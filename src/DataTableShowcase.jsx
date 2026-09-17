import { useCallback, useMemo, useRef, useState } from 'react';
import { Archive, CheckCircle2, Copy, Eye, FilePenLine, Trash2 } from 'lucide-react';
import { DataTable } from './components/DataTable';

const initialRecords = [
  { id: 'REC-001', name: 'Alpha Project', category: 'Project', owner: 'Alex Morgan', status: 'In Progress', priority: 'High', amount: 12500, progress: 72, dueDate: '2026-09-30', updatedAt: '2 hours ago' },
  { id: 'REC-002', name: 'Equipment Order', category: 'Purchase', owner: 'Jordan Lee', status: 'Pending', priority: 'Medium', amount: 8450, progress: 30, dueDate: '2026-10-04', updatedAt: '5 hours ago' },
  { id: 'REC-003', name: 'System Upgrade', category: 'Asset', owner: 'Taylor Smith', status: 'Completed', priority: 'Low', amount: 24000, progress: 100, dueDate: '2026-09-15', updatedAt: 'Yesterday' },
  { id: 'REC-004', name: 'Monthly Invoice', category: 'Invoice', owner: 'Morgan Reed', status: 'Overdue', priority: 'High', amount: 5750, progress: 10, dueDate: '2026-09-01', updatedAt: '3 days ago' },
  { id: 'REC-005', name: 'Product Batch', category: 'Manufacturing', owner: 'Casey Brown', status: 'In Review', priority: 'Medium', amount: 18200, progress: 55, dueDate: '2026-10-12', updatedAt: '1 hour ago' },
  { id: 'REC-006', name: 'Stock Recount', category: 'Inventory', owner: 'Riley Davis', status: 'Draft', priority: 'Low', amount: 3200, progress: 15, dueDate: '2026-10-18', updatedAt: '4 hours ago' },
  { id: 'REC-007', name: 'Launch Checklist', category: 'Task', owner: 'Jamie Wilson', status: 'In Progress', priority: 'Critical', amount: 9100, progress: 64, dueDate: '2026-09-25', updatedAt: '30 minutes ago' },
  { id: 'REC-008', name: 'Regional Order', category: 'Order', owner: 'Avery Chen', status: 'Pending', priority: 'High', amount: 16750, progress: 20, dueDate: '2026-10-02', updatedAt: '6 hours ago' },
  { id: 'REC-009', name: 'Beta Rollout', category: 'Project', owner: 'Cameron Hall', status: 'In Review', priority: 'High', amount: 29800, progress: 81, dueDate: '2026-10-20', updatedAt: 'Yesterday' },
  { id: 'REC-010', name: 'Safety Supplies', category: 'Purchase', owner: 'Drew Parker', status: 'Completed', priority: 'Medium', amount: 4600, progress: 100, dueDate: '2026-09-12', updatedAt: '4 days ago' },
  { id: 'REC-011', name: 'Vehicle Register', category: 'Asset', owner: 'Skyler Evans', status: 'Archived', priority: 'Low', amount: 31500, progress: 100, dueDate: '2026-08-28', updatedAt: '2 weeks ago' },
  { id: 'REC-012', name: 'Service Invoice', category: 'Invoice', owner: 'Reese Cooper', status: 'Pending', priority: 'Medium', amount: 7300, progress: 40, dueDate: '2026-10-06', updatedAt: '2 hours ago' },
  { id: 'REC-013', name: 'Assembly Run', category: 'Manufacturing', owner: 'Quinn Bailey', status: 'In Progress', priority: 'Critical', amount: 22100, progress: 48, dueDate: '2026-09-28', updatedAt: '15 minutes ago' },
  { id: 'REC-014', name: 'Warehouse Transfer', category: 'Inventory', owner: 'Rowan Foster', status: 'In Review', priority: 'Medium', amount: 6800, progress: 67, dueDate: '2026-10-09', updatedAt: '3 hours ago' },
  { id: 'REC-015', name: 'Policy Review', category: 'Task', owner: 'Emerson Gray', status: 'Draft', priority: 'Low', amount: 1500, progress: 5, dueDate: '2026-11-01', updatedAt: 'Today' },
  { id: 'REC-016', name: 'Export Order', category: 'Order', owner: 'Parker Young', status: 'Overdue', priority: 'Critical', amount: 38900, progress: 76, dueDate: '2026-09-10', updatedAt: '2 days ago' },
  { id: 'REC-017', name: 'Gamma Project', category: 'Project', owner: 'Robin King', status: 'Pending', priority: 'Medium', amount: 14600, progress: 25, dueDate: '2026-10-24', updatedAt: '7 hours ago' },
  { id: 'REC-018', name: 'Office Fixtures', category: 'Purchase', owner: 'Hayden Brooks', status: 'Completed', priority: 'Low', amount: 11200, progress: 100, dueDate: '2026-09-08', updatedAt: '1 week ago' },
  { id: 'REC-019', name: 'Device Audit', category: 'Asset', owner: 'Finley Ward', status: 'In Progress', priority: 'High', amount: 19400, progress: 58, dueDate: '2026-10-15', updatedAt: 'Yesterday' },
  { id: 'REC-020', name: 'Quarterly Invoice', category: 'Invoice', owner: 'Dakota Price', status: 'Draft', priority: 'Medium', amount: 9600, progress: 12, dueDate: '2026-10-30', updatedAt: '5 hours ago' },
  { id: 'REC-021', name: 'Packaging Batch', category: 'Manufacturing', owner: 'Sage Rivera', status: 'Pending', priority: 'High', amount: 17400, progress: 35, dueDate: '2026-10-11', updatedAt: '40 minutes ago' },
  { id: 'REC-022', name: 'Cycle Count', category: 'Inventory', owner: 'Blake Murphy', status: 'Completed', priority: 'Medium', amount: 2800, progress: 100, dueDate: '2026-09-16', updatedAt: 'Yesterday' },
  { id: 'REC-023', name: 'Data Cleanup', category: 'Task', owner: 'Charlie Bell', status: 'In Review', priority: 'Low', amount: 3900, progress: 88, dueDate: '2026-09-27', updatedAt: '3 hours ago' },
  { id: 'REC-024', name: 'Priority Order', category: 'Order', owner: 'Kendall Ross', status: 'In Progress', priority: 'Critical', amount: 42600, progress: 69, dueDate: '2026-09-29', updatedAt: '20 minutes ago' },
];

const categories = ['Project', 'Purchase', 'Asset', 'Invoice', 'Manufacturing', 'Inventory', 'Task', 'Order'];
const statuses = ['Draft', 'Pending', 'In Progress', 'In Review', 'Completed', 'Overdue', 'Archived'];
const priorities = ['Low', 'Medium', 'High', 'Critical'];
const statusClass = { Draft: 'neutral', Pending: 'amber', 'In Progress': 'blue', 'In Review': 'violet', Completed: 'green', Overdue: 'red', Archived: 'muted' };
const priorityClass = { Low: 'muted', Medium: 'amber', High: 'orange', Critical: 'red' };
const dateFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
const moneyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

function Badge({ value, tone }) {
  return <span className={`showcase-badge ${tone}`}>{value}</span>;
}

export default function DataTableShowcase() {
  const [records, setRecords] = useState(initialRecords);
  const [notice, setNotice] = useState('');
  const editTargetId = useRef(null);
  const noticeTimer = useRef(null);

  const notify = useCallback((message) => {
    setNotice(message);
    window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(''), 2200);
  }, []);

  const mutateSelected = useCallback((selectedRows, action) => {
    const ids = new Set(selectedRows.map((row) => row.id));
    if (action === 'delete') setRecords((current) => current.filter((row) => !ids.has(row.id)));
    else setRecords((current) => current.map((row) => ids.has(row.id) ? { ...row, status: action, updatedAt: 'Just now' } : row));
    notify(action === 'delete' ? `${ids.size} records deleted` : `${ids.size} records marked ${action.toLowerCase()}`);
  }, [notify]);

  const columns = useMemo(() => [
    { key: 'id', label: 'ID', enableFiltering: true },
    { key: 'name', label: 'Name', enableFiltering: true },
    { key: 'category', label: 'Category', enableFiltering: true, facetOptions: categories },
    { key: 'owner', label: 'Owner', enableFiltering: true },
    { key: 'status', label: 'Status', enableFiltering: true, facetOptions: statuses, cell: ({ value }) => <Badge value={value} tone={statusClass[value] || 'neutral'} /> },
    { key: 'priority', label: 'Priority', enableFiltering: true, facetOptions: priorities, cell: ({ value }) => <Badge value={value} tone={priorityClass[value] || 'muted'} /> },
    { key: 'amount', label: 'Amount', type: 'number', enableFiltering: true, cell: ({ value }) => <span className="showcase-amount">{moneyFormatter.format(Number(value) || 0)}</span> },
    { key: 'progress', label: 'Progress', type: 'number', enableFiltering: true, cell: ({ value }) => <span className="showcase-progress"><i><b style={{ width: `${Math.max(0, Math.min(100, Number(value) || 0))}%` }} /></i><em>{Number(value) || 0}%</em></span> },
    { key: 'dueDate', label: 'Due Date', type: 'date', enableFiltering: true, cell: ({ value }) => dateFormatter.format(new Date(`${value}T00:00:00Z`)) },
    { key: 'updatedAt', label: 'Updated', enableFiltering: true },
  ], []);

  const rowActions = useMemo(() => [
    { label: 'View', icon: <Eye className="h-3.5 w-3.5" />, onClick: (row) => { requestAnimationFrame(() => { const match = [...document.querySelectorAll('.datatable-stage tbody tr')].find((item) => item.textContent.includes(row.id)); match?.click(); }); notify(`${row.id} opened in the inspector`); } },
    { label: 'Edit', icon: <FilePenLine className="h-3.5 w-3.5" />, onClick: (row) => { editTargetId.current = row.id; notify('Double-click any cell to edit it'); } },
    { label: 'Duplicate', icon: <Copy className="h-3.5 w-3.5" />, onClick: (row) => { setRecords((current) => { const nextNumber = Math.max(...current.map((item) => Number(item.id.split('-')[1]) || 0)) + 1; return [...current, { ...row, id: `REC-${String(nextNumber).padStart(3, '0')}`, name: `${row.name} Copy`, status: 'Draft', updatedAt: 'Just now' }]; }); notify('Record duplicated'); } },
    { label: 'Archive', icon: <Archive className="h-3.5 w-3.5" />, onClick: (row) => { setRecords((current) => current.map((item) => item.id === row.id ? { ...item, status: 'Archived', updatedAt: 'Just now' } : item)); notify('Record archived'); } },
    { label: 'Delete', icon: <Trash2 className="h-3.5 w-3.5" />, variant: 'destructive', onClick: (row) => { setRecords((current) => current.filter((item) => item.id !== row.id)); notify('Record deleted'); } },
  ], [notify]);

  const bulkActions = useMemo(() => [
    { label: 'Mark Completed', icon: <CheckCircle2 className="h-3.5 w-3.5" />, onClick: (rows) => mutateSelected(rows, 'Completed') },
    { label: 'Archive', icon: <Archive className="h-3.5 w-3.5" />, onClick: (rows) => mutateSelected(rows, 'Archived') },
    { label: 'Delete', icon: <Trash2 className="h-3.5 w-3.5" />, variant: 'destructive', onClick: (rows) => mutateSelected(rows, 'delete') },
  ], [mutateSelected]);

  const handleCellSave = useCallback((rowIndex, key, value) => {
    const fallbackId = records[rowIndex]?.id;
    const targetId = editTargetId.current || fallbackId;
    setRecords((current) => current.map((row) => {
      if (row.id !== targetId) return row;
      const nextValue = key === 'amount' || key === 'progress' ? Number(value) || 0 : value;
      return { ...row, [key]: nextValue, updatedAt: 'Just now' };
    }));
    editTargetId.current = null;
    notify('Record updated');
  }, [notify, records]);

  return <div className="datatable-showcase dark">
    <DataTable
      data={records}
      columns={columns}
      title="Operational records"
      description="Select a row to inspect or edit its details"
      showTableHeading
      selectable
      pagination
      pageSize={12}
      pageSizeOptions={[8, 12, 20]}
      splitView
      hoverable
      exportable
      showStats
      resizable
      reorderable
      filterMode="global"
      onCellClick={(row) => { editTargetId.current = row.id; }}
      onCellDoubleClick={(row) => { editTargetId.current = row.id; }}
      onCellSave={handleCellSave}
      rowActions={rowActions}
      bulkActions={bulkActions}
      config={{ groupBy: 'user', columnVisibility: 'user', advancedFilter: 'user', export: 'user', columnStats: 'user', density: 'user', widthMode: 'user', fullscreen: 'user', resizable: true, reorderable: true }}
    />
    <div className={`showcase-toast${notice ? ' visible' : ''}`} role="status" aria-live="polite">{notice}</div>
  </div>;
}
