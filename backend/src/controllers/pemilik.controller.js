const bcrypt = require('bcryptjs');
const { User } = require('../models');

// GET /api/pemilik (admin only)
async function getAll(req, res, next) {
  try {
    const pemilikList = await User.findAll({
      where: { role: 'pemilik' },
      attributes: ['id', 'nama', 'email', 'no_hp', 'role', 'created_at'],
    });
    res.json(pemilikList);
  } catch (err) {
    next(err);
  }
}

// GET /api/pemilik/:id (admin only)
async function getById(req, res, next) {
  try {
    const pemilik = await User.findOne({
      where: { id: req.params.id, role: 'pemilik' },
      attributes: ['id', 'nama', 'email', 'no_hp', 'role', 'created_at'],
    });
    if (!pemilik) return res.status(404).json({ message: 'Pemilik tidak ditemukan' });
    res.json(pemilik);
  } catch (err) {
    next(err);
  }
}

// POST /api/pemilik (admin only)
async function create(req, res, next) {
  try {
    const { nama, email, no_hp, password } = req.body;
    if (!nama || (!email && !no_hp)) {
      return res.status(400).json({ message: 'nama dan salah satu dari email/no_hp wajib diisi' });
    }

    const hashed = password ? await bcrypt.hash(password, 10) : null;

    const pemilik = await User.create({
      nama,
      email: email || null,
      no_hp: no_hp || null,
      password: hashed,
      role: 'pemilik',
    });

    res.status(201).json({ id: pemilik.id, nama: pemilik.nama, role: pemilik.role });
  } catch (err) {
    next(err);
  }
}

// PUT /api/pemilik/:id (admin only)
async function update(req, res, next) {
  try {
    const { nama, email, no_hp, password } = req.body;
    const pemilik = await User.findOne({ where: { id: req.params.id, role: 'pemilik' } });
    if (!pemilik) return res.status(404).json({ message: 'Pemilik tidak ditemukan' });

    if (nama !== undefined) pemilik.nama = nama;
    if (email !== undefined) pemilik.email = email;
    if (no_hp !== undefined) pemilik.no_hp = no_hp;
    if (password) pemilik.password = await bcrypt.hash(password, 10);

    await pemilik.save();
    res.json({ id: pemilik.id, nama: pemilik.nama, role: pemilik.role });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/pemilik/:id (admin only)
async function remove(req, res, next) {
  try {
    const pemilik = await User.findOne({ where: { id: req.params.id, role: 'pemilik' } });
    if (!pemilik) return res.status(404).json({ message: 'Pemilik tidak ditemukan' });

    await pemilik.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getById, create, update, remove };
