import StatusBadge from './StatusBadge';

const getValue = (row, column) => {
  if (typeof column.render === 'function') {
    return column.render(row);
  }

  const value = row[column.key];

  if (column.type === 'status') {
    return <StatusBadge value={value} />;
  }

  return value ?? '—';
};

export default function DataTable({ columns, rows, emptyMessage = 'No records found.' }) {
  if (!rows?.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-white/70 p-10 text-center text-sm text-slate-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_18px_50px_-30px_rgba(15,23,42,0.35)]">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left">
          <thead className="bg-slate-50/80">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.id || row.key || JSON.stringify(row)} className="align-top">
                {columns.map((column) => (
                  <td key={column.key} className="px-5 py-4 text-sm text-slate-700">
                    {getValue(row, column)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
