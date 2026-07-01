/**
 * Tabel generik yang dipakai ulang di halaman Unit, Tagihan, dan Pemilik.
 * columns: [{ key, label, render? }]
 * rows: array of object
 * actions?: (row) => ReactNode  -> kolom aksi opsional (edit/hapus), hanya dilewatkan untuk admin
 */
export default function DataTable({ columns, rows, actions }) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key}>{col.label}</th>
          ))}
          {actions && <th>Aksi</th>}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 && (
          <tr>
            <td colSpan={columns.length + (actions ? 1 : 0)}>Belum ada data.</td>
          </tr>
        )}
        {rows.map((row) => (
          <tr key={row.id}>
            {columns.map((col) => (
              <td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>
            ))}
            {actions && <td>{actions(row)}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
