import DataTable from './DataTable';
import PageHeader from './PageHeader';

export default function ListPage({ title, description, columns, rows, emptyMessage, actions }) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} actions={actions} />
      <DataTable columns={columns} rows={rows} emptyMessage={emptyMessage} />
    </div>
  );
}
