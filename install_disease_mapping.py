'''Import the five-disease mapping and create PostgreSQL disease views.'''

from __future__ import annotations

import getpass
import os
from pathlib import Path

import pandas as pd
import psycopg


MAPPING_PATH = Path(__file__).with_name('five_diseases_imci_symptom_mapping_dataset_order.csv')
ML_QUERY_PATH = Path(__file__).with_name('imci_ml_query.sql')

VIEW_SQL = '''
CREATE SCHEMA IF NOT EXISTS ml;

CREATE TABLE IF NOT EXISTS ml.disease_symptom_mapping (
    dataset_order integer NOT NULL,
    disease text NOT NULL,
    symptom text NOT NULL,
    column_name text NOT NULL,
    suggested_match_weight integer NOT NULL,
    role text NOT NULL,
    age_group text NOT NULL,
    protocol_rule text NOT NULL,
    imci_source_page text NOT NULL,
    PRIMARY KEY (dataset_order, disease, column_name)
);

CREATE OR REPLACE VIEW ml.visit_disease_types AS
WITH allowed_diseases AS (
    SELECT DISTINCT
        disease,
        CASE disease WHEN 'Diarrhoea' THEN 'Diarrhea' ELSE disease END AS clinical_area_name
    FROM ml.disease_symptom_mapping
),
positive_classifications AS (
    SELECT DISTINCT
        vc.visit_id,
        allowed.disease,
        classification.classification
    FROM gold.visit_classifications AS vc
    JOIN gold.classifications AS classification
      ON classification.id = vc.classification_id
    JOIN gold.clinical_areas AS area
      ON area.id = classification.clinical_area_id
    JOIN allowed_diseases AS allowed
      ON allowed.clinical_area_name = area.area_name
    WHERE vc.result = 1
      AND lower(classification.classification) NOT LIKE 'no %'
      AND lower(classification.classification) NOT LIKE 'normal%'
)
SELECT
    visit_id,
    string_agg(DISTINCT disease, ', ' ORDER BY disease) AS disease_type,
    array_agg(DISTINCT disease ORDER BY disease) AS disease_types,
    string_agg(DISTINCT classification, ' | ' ORDER BY classification) AS disease_classifications
FROM positive_classifications
GROUP BY visit_id;

CREATE OR REPLACE VIEW ml.visits_with_disease_type AS
SELECT
    visit.*,
    disease.disease_type,
    disease.disease_types,
    disease.disease_classifications
FROM gold.visits AS visit
LEFT JOIN ml.visit_disease_types AS disease
  ON disease.visit_id = visit.id;
'''


def connect() -> psycopg.Connection:
    password = os.getenv('POSTGRES_PASSWORD') or getpass.getpass('PostgreSQL password: ')
    return psycopg.connect(
        host=os.getenv('POSTGRES_HOST', 'localhost'),
        port=int(os.getenv('POSTGRES_PORT', '5432')),
        dbname=os.getenv('POSTGRES_DB', 'imci_pipeline'),
        user=os.getenv('POSTGRES_USER', 'postgres'),
        password=password,
    )


def main() -> None:
    mapping = pd.read_csv(MAPPING_PATH).astype(object).where(pd.notna, None)
    columns = list(mapping.columns)
    placeholders = ', '.join(['%s'] * len(columns))
    insert_sql = f'''
        INSERT INTO ml.disease_symptom_mapping ({', '.join(columns)})
        VALUES ({placeholders})
        ON CONFLICT (dataset_order, disease, column_name) DO UPDATE SET
            symptom = EXCLUDED.symptom,
            suggested_match_weight = EXCLUDED.suggested_match_weight,
            role = EXCLUDED.role,
            age_group = EXCLUDED.age_group,
            protocol_rule = EXCLUDED.protocol_rule,
            imci_source_page = EXCLUDED.imci_source_page
    '''

    with connect() as connection:
        connection.execute(VIEW_SQL.split('CREATE OR REPLACE VIEW')[0])
        with connection.cursor() as cursor:
            cursor.executemany(insert_sql, mapping.itertuples(index=False, name=None))
        view_statements = 'CREATE OR REPLACE VIEW' + VIEW_SQL.split('CREATE OR REPLACE VIEW', 1)[1]
        connection.execute(view_statements)
        ml_query = ML_QUERY_PATH.read_text(encoding='utf-8').strip().removesuffix(';')
        connection.execute(f'''
            CREATE OR REPLACE VIEW ml.imci_ml_dataset_with_disease_type AS
            SELECT
                dataset.*,
                disease.disease_type,
                disease.disease_types,
                disease.disease_classifications
            FROM ({ml_query}) AS dataset
            LEFT JOIN ml.visit_disease_types AS disease
              ON disease.visit_id = dataset.visit_id
        ''')
        mapping_count = connection.execute('SELECT count(*) FROM ml.disease_symptom_mapping').fetchone()[0]
        visit_count = connection.execute('SELECT count(*) FROM ml.visits_with_disease_type').fetchone()[0]
        labelled_count = connection.execute(
            'SELECT count(*) FROM ml.visits_with_disease_type WHERE disease_type IS NOT NULL'
        ).fetchone()[0]
        feature_count = connection.execute('''
            SELECT count(*)
            FROM information_schema.columns
            WHERE table_schema = 'ml'
              AND table_name = 'imci_ml_dataset_with_disease_type'
        ''').fetchone()[0]

    print(f'Imported {mapping_count} disease-symptom rules.')
    print(f'Created disease views for {visit_count} visits; {labelled_count} have a mapped disease type.')
    print(f'Connected the ML dataset view with {feature_count} columns.')


if __name__ == '__main__':
    main()
