const express = require('express');
const router = express.Router();
const pemilikController = require('../controllers/pemilik.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

router.use(authMiddleware, roleMiddleware(['admin']));

router.get('/', pemilikController.getAll);
router.get('/:id', pemilikController.getById);
router.post('/', pemilikController.create);
router.put('/:id', pemilikController.update);
router.delete('/:id', pemilikController.remove);

module.exports = router;
