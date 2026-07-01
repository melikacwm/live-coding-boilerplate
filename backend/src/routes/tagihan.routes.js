const express = require('express');
const router = express.Router();
const tagihanController = require('../controllers/tagihan.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

router.use(authMiddleware);

// admin: semua tagihan, pemilik: tagihan unit miliknya saja (difilter di controller)
router.get('/', tagihanController.getAll);
router.get('/:id', tagihanController.getById);

// hanya admin yang boleh CRUD
router.post('/', roleMiddleware(['admin']), tagihanController.create);
router.put('/:id', roleMiddleware(['admin']), tagihanController.update);
router.delete('/:id', roleMiddleware(['admin']), tagihanController.remove);

module.exports = router;
