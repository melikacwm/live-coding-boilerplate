import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import DataTable from '../components/DataTable';

const columns = [
  { key: 'nama_unit', label: 'Nama Unit' },
  { key: 'alamat', label: 'Alamat' },
  { key: 'pemilik', label: 'Pemilik', render: (row) => row.pemilik?.nama || '-' },
  { key: 'status', label: 'Status' },
];

export default function UnitPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/units')
      .then((res) => setUnits(res.data))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id) {
    if (!confirm('Hapus unit ini?')) return;
    await api.delete(`/units/${id}`);
    setUnits((prev) => prev.filter((u) => u.id !== id));
  }

  return (
    <div className="container">
      <Card
        title="Daftar Unit"
        actions={isAdmin && <Button onClick={() => alert('TODO: buka form tambah unit')}>+ Tambah Unit</Button>}
      >
        {loading ? (
          <p>Memuat...</p>
        ) : (
          <DataTable
            columns={columns}
            rows={units}
            actions={
              isAdmin
                ? (row) => (
                    <>
                      <Button
                        variant="secondary"
                        onClick={() => alert('TODO: buka form edit unit ' + row.id)}
                      >
                        Edit
                      </Button>{' '}
                      <Button variant="danger" onClick={() => handleDelete(row.id)}>
                        Hapus
                      </Button>
                    </>
                  )
                : undefined
            }
          />
        )}
      </Card>
    </div>
  );
}
