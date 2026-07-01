import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import DataTable from '../components/DataTable';

const columns = [
  { key: 'unit', label: 'Unit', render: (row) => row.unit?.nama_unit || '-' },
  { key: 'periode', label: 'Periode' },
  { key: 'jumlah', label: 'Jumlah', render: (row) => `Rp ${Number(row.jumlah).toLocaleString('id-ID')}` },
  {
    key: 'status',
    label: 'Status',
    render: (row) => (
      <span className={`badge ${row.status === 'lunas' ? 'badge-success' : 'badge-warning'}`}>
        {row.status === 'lunas' ? 'Lunas' : 'Belum Bayar'}
      </span>
    ),
  },
  { key: 'jatuh_tempo', label: 'Jatuh Tempo' },
];

export default function TagihanPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [tagihanList, setTagihanList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/tagihan')
      .then((res) => setTagihanList(res.data))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id) {
    if (!confirm('Hapus tagihan ini?')) return;
    await api.delete(`/tagihan/${id}`);
    setTagihanList((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="container">
      <Card
        title="Daftar Tagihan"
        actions={isAdmin && <Button onClick={() => alert('TODO: buka form tambah tagihan')}>+ Tambah Tagihan</Button>}
      >
        {loading ? (
          <p>Memuat...</p>
        ) : (
          <DataTable
            columns={columns}
            rows={tagihanList}
            actions={
              isAdmin
                ? (row) => (
                    <>
                      <Button
                        variant="secondary"
                        onClick={() => alert('TODO: buka form edit tagihan ' + row.id)}
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
