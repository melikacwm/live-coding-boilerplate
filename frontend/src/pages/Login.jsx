import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';

const TABS = [
  { key: 'password', label: 'No HP/Email + Password' },
  { key: 'otp-email', label: 'Email + OTP' },
  { key: 'otp-hp', label: 'No HP + OTP' },
];

export default function Login() {
  const [tab, setTab] = useState('password');
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  // form state gabungan untuk ketiga metode
  const [form, setForm] = useState({ identifier: '', password: '', target: '', kode_otp: '' });

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleLoginPassword(e) {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', {
        identifier: form.identifier,
        password: form.password,
      });
      loginWithToken(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal');
    }
  }

  async function handleRequestOtp(e) {
    e.preventDefault();
    setError('');
    try {
      await api.post('/auth/otp/request', { target: form.target });
      setOtpSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengirim OTP');
    }
  }

  async function handleVerifyOtp(e) {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/otp/verify', {
        target: form.target,
        kode_otp: form.kode_otp,
      });
      loginWithToken(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Verifikasi OTP gagal');
    }
  }

  function handleGoogleLogin() {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  }

  return (
    <div className="container" style={{ maxWidth: 420 }}>
      <Card title="Login">
        <div className="login-tabs">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              className={`login-tab ${tab === t.key ? 'active' : ''}`}
              onClick={() => {
                setTab(t.key);
                setError('');
                setOtpSent(false);
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'password' && (
          <form onSubmit={handleLoginPassword}>
            <Input
              label="Email / No HP"
              name="identifier"
              value={form.identifier}
              onChange={handleChange}
              required
            />
            <Input
              label="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <Button type="submit">Masuk</Button>
          </form>
        )}

        {(tab === 'otp-email' || tab === 'otp-hp') && (
          <form onSubmit={otpSent ? handleVerifyOtp : handleRequestOtp}>
            <Input
              label={tab === 'otp-email' ? 'Email' : 'No HP'}
              name="target"
              value={form.target}
              onChange={handleChange}
              required
              disabled={otpSent}
            />
            {otpSent && (
              <Input
                label="Kode OTP"
                name="kode_otp"
                value={form.kode_otp}
                onChange={handleChange}
                required
              />
            )}
            <Button type="submit">{otpSent ? 'Verifikasi OTP' : 'Kirim OTP'}</Button>
          </form>
        )}

        {error && <p className="error-text">{error}</p>}

        <hr style={{ margin: '16px 0' }} />
        <Button variant="secondary" onClick={handleGoogleLogin} style={{ width: '100%' }}>
          Login dengan Google
        </Button>
      </Card>
    </div>
  );
}
