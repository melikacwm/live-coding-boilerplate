/**
 * Card reusable untuk membungkus konten halaman (Dashboard, Unit, Tagihan, Pemilik).
 */
export default function Card({ title, children, actions }) {
  return (
    <div className="card">
      {(title || actions) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {title && <div className="card-title">{title}</div>}
          {actions}
        </div>
      )}
      {children}
    </div>
  );
}
