/**
 * OTP service sederhana (in-memory) — cukup untuk kebutuhan tes/demo.
 * Untuk produksi, simpan di tabel DB/Redis dan kirim via SMS/email gateway.
 */
const otpStore = new Map(); // key: target (email/no_hp) -> { kode, expiredAt }

const OTP_EXPIRES_MINUTES = Number(process.env.OTP_EXPIRES_MINUTES || 5);

function generateOtp(target) {
  const kode = String(Math.floor(100000 + Math.random() * 900000)); // 6 digit
  const expiredAt = Date.now() + OTP_EXPIRES_MINUTES * 60 * 1000;
  otpStore.set(target, { kode, expiredAt });

  // Untuk kebutuhan tes: tampilkan di console, bukan kirim SMS/email asli
  console.log(`[OTP] target=${target} kode=${kode} (berlaku ${OTP_EXPIRES_MINUTES} menit)`);

  return kode;
}

function verifyOtp(target, kode) {
  const record = otpStore.get(target);
  if (!record) return false;
  if (Date.now() > record.expiredAt) {
    otpStore.delete(target);
    return false;
  }
  if (record.kode !== kode) return false;

  otpStore.delete(target); // one-time use
  return true;
}

module.exports = { generateOtp, verifyOtp };
