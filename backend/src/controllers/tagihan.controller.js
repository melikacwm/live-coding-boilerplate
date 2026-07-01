const { Tagihan, Unit } = require('../models');

// GET /api/tagihan -> admin lihat semua, pemilik hanya milik unitnya
async function getAll(req, res, next) {
  try {
    const include = [
      {
        model: Unit,
        as: 'unit',
        attributes: ['id', 'nama_unit', 'pemilik_id'],
        where: req.user.role === 'pemilik' ? { pemilik_id: req.user.id } : undefined,
      },
    ];
    const tagihanList = await Tagihan.findAll({ include });
    res.json(tagihanList);
  } catch (err) {
    next(err);
  }
}

// GET /api/tagihan/:id
async function getById(req, res, next) {
  try {
    const include = [
      {
        model: Unit,
        as: 'unit',
        attributes: ['id', 'nama_unit', 'pemilik_id'],
        where: req.user.role === 'pemilik' ? { pemilik_id: req.user.id } : undefined,
      },
    ];
    const tagihan = await Tagihan.findOne({ where: { id: req.params.id }, include });
    if (!tagihan) return res.status(404).json({ message: 'Tagihan tidak ditemukan' });
    res.json(tagihan);
  } catch (err) {
    next(err);
  }
}

// POST /api/tagihan (admin only)
async function create(req, res, next) {
  try {
    const { unit_id, periode, jumlah, status, jatuh_tempo, tanggal_bayar } = req.body;
    if (!unit_id || !periode || !jumlah || !jatuh_tempo) {
      return res.status(400).json({ message: 'unit_id, periode, jumlah, jatuh_tempo wajib diisi' });
    }
    const tagihan = await Tagihan.create({
      unit_id, periode, jumlah, status, jatuh_tempo, tanggal_bayar,
    });
    res.status(201).json(tagihan);
  } catch (err) {
    next(err);
  }
}

// PUT /api/tagihan/:id (admin only)
async function update(req, res, next) {
  try {
    const tagihan = await Tagihan.findByPk(req.params.id);
    if (!tagihan) return res.status(404).json({ message: 'Tagihan tidak ditemukan' });

    const { unit_id, periode, jumlah, status, jatuh_tempo, tanggal_bayar } = req.body;
    if (unit_id !== undefined) tagihan.unit_id = unit_id;
    if (periode !== undefined) tagihan.periode = periode;
    if (jumlah !== undefined) tagihan.jumlah = jumlah;
    if (status !== undefined) tagihan.status = status;
    if (jatuh_tempo !== undefined) tagihan.jatuh_tempo = jatuh_tempo;
    if (tanggal_bayar !== undefined) tagihan.tanggal_bayar = tanggal_bayar;

    await tagihan.save();
    res.json(tagihan);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/tagihan/:id (admin only)
async function remove(req, res, next) {
  try {
    const tagihan = await Tagihan.findByPk(req.params.id);
    if (!tagihan) return res.status(404).json({ message: 'Tagihan tidak ditemukan' });

    await tagihan.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getById, create, update, remove };
