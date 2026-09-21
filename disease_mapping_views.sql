CREATE SCHEMA IF NOT EXISTS ml;

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
    JOIN gold.classifications AS classification ON classification.id = vc.classification_id
    JOIN gold.clinical_areas AS area ON area.id = classification.clinical_area_id
    JOIN allowed_diseases AS allowed ON allowed.clinical_area_name = area.area_name
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
LEFT JOIN ml.visit_disease_types AS disease ON disease.visit_id = visit.id;

-- The installer also creates ml.imci_ml_dataset_with_disease_type by wrapping
-- imci_ml_query.sql and joining ml.visit_disease_types on visit_id.
