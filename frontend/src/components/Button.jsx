/**
 * Komponen tombol reusable, dipakai di semua halaman (Login, Unit, Tagihan, Pemilik, dst).
 * variant: 'primary' | 'secondary' | 'danger'
 */
export default function Button({ children, variant = 'primary', className = '', ...props }) {
  return (
    <button className={`btn btn-${variant} ${className}`} {...props}>
      {children}
    </button>
  );
}
