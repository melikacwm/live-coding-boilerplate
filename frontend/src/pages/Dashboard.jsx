import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="container">
      <Card title={`Halo, ${user?.nama || ''}`}>
        <p>Role kamu: <strong>{user?.role}</strong></p>
        {user?.role === 'admin' ? (
          <p>Sebagai admin, kamu bisa mengelola Pemilik, Unit, dan Tagihan.</p>
        ) : (
          <p>Sebagai pemilik, kamu bisa melihat Unit dan Tagihan milikmu.</p>
        )}
      </Card>
    </div>
  );
}
