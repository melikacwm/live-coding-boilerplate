const express = require('express');
const router = express.Router();
const unitController = require('../controllers/unit.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

router.use(authMiddleware);

// admin: semua unit, pemilik: unit miliknya saja (difilter di controller)
router.get('/', unitController.getAll);
router.get('/:id', unitController.getById);

// hanya admin yang boleh CRUD
router.post('/', roleMiddleware(['admin']), unitController.create);
router.put('/:id', roleMiddleware(['admin']), unitController.update);
router.delete('/:id', roleMiddleware(['admin']), unitController.remove);

module.exports = router;
