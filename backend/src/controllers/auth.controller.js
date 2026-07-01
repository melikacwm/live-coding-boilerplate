const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { User } = require('../models');
const { generateOtp, verifyOtp } = require('../services/otp.service');

function signToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role, nama: user.nama },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
}

// POST /api/auth/otp/request  { target } -> target = email atau no_hp
async function requestOtp(req, res, next) {
  try {
    const { target } = req.body;
    if (!target) return res.status(400).json({ message: 'target (email/no_hp) wajib diisi' });

    generateOtp(target);
    // Di dunia nyata: kirim via SMS/email gateway. Untuk tes, OTP dicetak di log server.
    res.json({ message: 'Kode OTP terkirim' });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/otp/verify  { target, kode_otp }
async function verifyOtpLogin(req, res, next) {
  try {
    const { target, kode_otp } = req.body;
    if (!target || !kode_otp) {
      return res.status(400).json({ message: 'target dan kode_otp wajib diisi' });
    }

    const valid = verifyOtp(target, kode_otp);
    if (!valid) return res.status(400).json({ message: 'Kode OTP salah atau kedaluwarsa' });

    const user = await User.findOne({
      where: { [Op.or]: [{ email: target }, { no_hp: target }] },
    });

    if (!user) {
      return res.status(403).json({ message: 'Akun belum terdaftar, hubungi admin' });
    }

    const token = signToken(user);
    res.json({ token, user: { id: user.id, nama: user.nama, role: user.role } });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/login  { identifier, password }
async function loginWithPassword(req, res, next) {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ message: 'identifier dan password wajib diisi' });
    }

    const user = await User.findOne({
      where: { [Op.or]: [{ email: identifier }, { no_hp: identifier }] },
    });

    if (!user || !user.password) {
      return res.status(401).json({ message: 'Email/No HP atau password salah' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Email/No HP atau password salah' });
    }

    const token = signToken(user);
    res.json({ token, user: { id: user.id, nama: user.nama, role: user.role } });
  } catch (err) {
    next(err);
  }
}

// GET /api/auth/me
async function getMe(req, res, next) {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'nama', 'email', 'no_hp', 'role'],
    });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  requestOtp,
  verifyOtpLogin,
  loginWithPassword,
  getMe,
  signToken,
};
