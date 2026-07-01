import { useEffect, useState } from 'react';
import api from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import DataTable from '../components/DataTable';

const columns = [
  { key: 'nama', label: 'Nama' },
  { key: 'email', label: 'Email' },
  { key: 'no_hp', label: 'No HP' },
];

// Halaman ini hanya untuk admin (dibatasi lewat ProtectedRoute roles={['admin']})
export default function PemilikPage() {
  const [pemilikList, setPemilikList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/pemilik')
      .then((res) => setPemilikList(res.data))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id) {
    if (!confirm('Hapus pemilik ini?')) return;
    await api.delete(`/pemilik/${id}`);
    setPemilikList((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="container">
      <Card
        title="Daftar Pemilik"
        actions={<Button onClick={() => alert('TODO: buka form tambah pemilik')}>+ Tambah Pemilik</Button>}
      >
        {loading ? (
          <p>Memuat...</p>
        ) : (
          <DataTable
            columns={columns}
            rows={pemilikList}
            actions={(row) => (
              <>
                <Button
                  variant="secondary"
                  onClick={() => alert('TODO: buka form edit pemilik ' + row.id)}
                >
                  Edit
                </Button>{' '}
                <Button variant="danger" onClick={() => handleDelete(row.id)}>
                  Hapus
                </Button>
              </>
            )}
          />
        )}
      </Card>
    </div>
  );
}
