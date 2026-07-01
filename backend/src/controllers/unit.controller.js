const { Unit, User } = require('../models');

// GET /api/units -> admin lihat semua, pemilik hanya miliknya
async function getAll(req, res, next) {
  try {
    const where = req.user.role === 'pemilik' ? { pemilik_id: req.user.id } : {};
    const units = await Unit.findAll({
      where,
      include: [{ model: User, as: 'pemilik', attributes: ['id', 'nama'] }],
    });
    res.json(units);
  } catch (err) {
    next(err);
  }
}

// GET /api/units/:id
async function getById(req, res, next) {
  try {
    const where = { id: req.params.id };
    if (req.user.role === 'pemilik') where.pemilik_id = req.user.id;

    const unit = await Unit.findOne({
      where,
      include: [{ model: User, as: 'pemilik', attributes: ['id', 'nama'] }],
    });
    if (!unit) return res.status(404).json({ message: 'Unit tidak ditemukan' });
    res.json(unit);
  } catch (err) {
    next(err);
  }
}

// POST /api/units (admin only)
async function create(req, res, next) {
  try {
    const { nama_unit, alamat, pemilik_id, status } = req.body;
    if (!nama_unit || !pemilik_id) {
      return res.status(400).json({ message: 'nama_unit dan pemilik_id wajib diisi' });
    }
    const unit = await Unit.create({ nama_unit, alamat, pemilik_id, status });
    res.status(201).json(unit);
  } catch (err) {
    next(err);
  }
}

// PUT /api/units/:id (admin only)
async function update(req, res, next) {
  try {
    const unit = await Unit.findByPk(req.params.id);
    if (!unit) return res.status(404).json({ message: 'Unit tidak ditemukan' });

    const { nama_unit, alamat, pemilik_id, status } = req.body;
    if (nama_unit !== undefined) unit.nama_unit = nama_unit;
    if (alamat !== undefined) unit.alamat = alamat;
    if (pemilik_id !== undefined) unit.pemilik_id = pemilik_id;
    if (status !== undefined) unit.status = status;

    await unit.save();
    res.json(unit);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/units/:id (admin only)
async function remove(req, res, next) {
  try {
    const unit = await Unit.findByPk(req.params.id);
    if (!unit) return res.status(404).json({ message: 'Unit tidak ditemukan' });

    await unit.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getById, create, update, remove };
