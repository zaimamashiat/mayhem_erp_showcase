import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Download, MoreHorizontal, Search, X } from 'lucide-react';

const quote = String.fromCharCode(34);
const csv = (value) => quote + String(value ?? '').replaceAll(quote, quote + quote) + quote;

export function DataTable(props) {
  const { data = [], columns = [], title, description, selectable, pagination,
    pageSize: startingSize = 12, pageSizeOptions = [10, 20], splitView,
    exportable, onCellClick, onCellDoubleClick, onCellSave,
    rowActions = [], bulkActions = [] } = props;
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState({ key: '', desc: false });
  const [selected, setSelected] = useState(new Set());
  const [active, setActive] = useState(null);
  const [menu, setMenu] = useState(null);
  const [editing, setEditing] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(startingSize);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const result = needle
      ? data.filter((row) => columns.some((col) => String(row[col.key] ?? '').toLowerCase().includes(needle)))
      : [...data];
    if (!sort.key) return result;
    return result.sort((a, b) => {
      const x = a[sort.key], y = b[sort.key];
      const order = typeof x === 'number' && typeof y === 'number'
        ? x - y
        : String(x ?? '').localeCompare(String(y ?? ''), undefined, { numeric: true });
      return sort.desc ? -order : order;
    });
  }, [columns, data, query, sort]);

  const pages = pagination ? Math.max(1, Math.ceil(filtered.length / pageSize)) : 1;
  const rows = pagination ? filtered.slice((page - 1) * pageSize, page * pageSize) : filtered;
  const selectedRows = data.filter((row) => selected.has(row.id));
  const allSelected = rows.length > 0 && rows.every((row) => selected.has(row.id));

  useEffect(() => setPage(1), [query, pageSize]);
  useEffect(() => setPage((value) => Math.min(value, pages)), [pages]);
  useEffect(() => {
    setSelected((current) => new Set([...current].filter((id) => data.some((row) => row.id === id))));
    setActive((current) => current ? data.find((row) => row.id === current.id) || null : null);
  }, [data]);
  function toggle(id) {
    setSelected((current) => {
      const next = new Set(current);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }
  function toggleAll() {
    setSelected((current) => {
      const next = new Set(current);
      rows.forEach((row) => allSelected ? next.delete(row.id) : next.add(row.id));
      return next;
    });
  }
  function download() {
    const content = [
      columns.map((col) => csv(col.label)).join(','),
      ...filtered.map((row) => columns.map((col) => csv(row[col.key])).join(',')),
    ].join('\n');
    const url = URL.createObjectURL(new Blob([content], { type: 'text/csv' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'operational-records.csv';
    link.click();
    URL.revokeObjectURL(url);
  }
  return <div className='local-table'>
    <div className='local-table__toolbar'>
      <div className='local-table__heading'><h2>{title}</h2><p>{description}</p></div>
      <label className='local-table__search'>
        <Search size={14} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder='Search records...' />
        {query && <button type='button' onClick={() => setQuery('')} aria-label='Clear search'><X size={13} /></button>}
      </label>
      {exportable && <button type='button' className='local-table__button' onClick={download}><Download size={14} /> Export</button>}
    </div>
    {selectedRows.length > 0 && <div className='local-table__bulk'>
      <strong>{selectedRows.length} selected</strong>
      {bulkActions.map((action) => <button type='button' key={action.label}
        className={action.variant === 'destructive' ? 'danger' : ''}
        onClick={() => { action.onClick(selectedRows); setSelected(new Set()); }}>
        {action.icon}{action.label}
      </button>)}
    </div>}
    <div className={`local-table__body${active && splitView ? ' has-inspector' : ''}`}>
      <div className='local-table__scroll'><table>
        <thead><tr>
          {selectable && <th className='check'><input type='checkbox' checked={allSelected} onChange={toggleAll} aria-label='Select visible rows' /></th>}
          {columns.map((col) => <th key={col.key}><button type='button'
            onClick={() => setSort((current) => current.key === col.key ? { key: col.key, desc: !current.desc } : { key: col.key, desc: false })}>
            {col.label}<ChevronDown size={12} className={sort.key === col.key && sort.desc ? 'descending' : ''} />
          </button></th>)}
          {rowActions.length > 0 && <th className='actions'>Actions</th>}
        </tr></thead>
        <tbody>
          {rows.map((row) => <tr key={row.id}
            className={active?.id === row.id ? 'active' : ''}
            onClick={() => { setActive(row); onCellClick?.(row); }}>
            {selectable && <td className='check' onClick={(event) => event.stopPropagation()}>
              <input type='checkbox' checked={selected.has(row.id)} onChange={() => toggle(row.id)} aria-label={`Select ${row.id}`} />
            </td>}
            {columns.map((col) => {
              const cell = `${row.id}:${col.key}`;
              const value = row[col.key];
              return <td key={col.key} onDoubleClick={() => { setEditing(cell); onCellDoubleClick?.(row, col); }}>
                {editing === cell
                  ? <input className='local-table__edit' autoFocus defaultValue={value}
                    onClick={(event) => event.stopPropagation()}
                    onBlur={(event) => {
                      onCellSave?.(data.findIndex((item) => item.id === row.id), col.key, event.target.value);
                      setEditing(null);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') event.currentTarget.blur();
                      if (event.key === 'Escape') setEditing(null);
                    }} />
                  : col.cell ? col.cell({ value, row }) : String(value ?? '')}
              </td>;
            })}
            {rowActions.length > 0 && <td className='actions' onClick={(event) => event.stopPropagation()}>
              <button type='button' className='local-table__icon'
                onClick={() => setMenu(menu === row.id ? null : row.id)}
                aria-label={`Actions for ${row.id}`}><MoreHorizontal size={16} /></button>
              {menu === row.id && <div className='local-table__menu'>
                {rowActions.map((action) => <button type='button' key={action.label}
                  className={action.variant === 'destructive' ? 'danger' : ''}
                  onClick={() => { action.onClick(row); setMenu(null); }}>
                  {action.icon}{action.label}
                </button>)}
              </div>}
            </td>}
          </tr>)}
          {rows.length === 0 && <tr><td className='local-table__empty'
            colSpan={columns.length + (selectable ? 1 : 0) + (rowActions.length ? 1 : 0)}>No matching records</td></tr>}
        </tbody>
      </table></div>
      {active && splitView && <aside className='local-table__inspector'>
        <div><span>Record details</span><button type='button' onClick={() => setActive(null)} aria-label='Close details'><X size={15} /></button></div>
        <strong>{active.name}</strong><small>{active.id}</small>
        <dl>{columns.slice(2).map((col) => <div key={col.key}>
          <dt>{col.label}</dt>
          <dd>{col.cell ? col.cell({ value: active[col.key], row: active }) : String(active[col.key] ?? '')}</dd>
        </div>)}</dl>
      </aside>}
    </div>
    <div className='local-table__footer'>
      <span>{filtered.length ? `${(page - 1) * pageSize + 1}-${Math.min(page * pageSize, filtered.length)} of ${filtered.length}` : '0 records'}</span>
      {pagination && <div className='local-table__pager'>
        <label>Rows <select value={pageSize} onChange={(event) => setPageSize(Number(event.target.value))}>
          {pageSizeOptions.map((size) => <option key={size} value={size}>{size}</option>)}
        </select></label>
        <button type='button' disabled={page === 1} onClick={() => setPage((value) => value - 1)} aria-label='Previous page'><ChevronLeft size={15} /></button>
        <span>{page} / {pages}</span>
        <button type='button' disabled={page === pages} onClick={() => setPage((value) => value + 1)} aria-label='Next page'><ChevronRight size={15} /></button>
      </div>}
    </div>
  </div>;
}
