const express = require('express');
const router = express.Router();

const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/product.controller');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', verifyToken, authorizeRoles('seller', 'admin'), createProduct);
router.put('/:id', verifyToken, authorizeRoles('seller', 'admin'), updateProduct);
router.delete('/:id', verifyToken, authorizeRoles('seller', 'admin'), deleteProduct);

module.exports = router;