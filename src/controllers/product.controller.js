const Product = require('../models/product');

const createProduct = async(req, res) => {
    try {
        const { title, description, price, category, stock, images } = req.body;

        if (!title || !description || price === undefined || !category || stock === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Title, description, price, category, and stock are required',
            });
        }

        const product = await Product.create({
            title,
            description,
            price,
            category,
            stock,
            images: images || [],
            seller: req.user._id,
        });

        res.status(201).json({ success: true, message: 'Product created', data: { product } });
    } catch (error) {
        throw error;
    }
};

const getAllProducts = async(req, res) => {
    try {
        let { page, limit, category, minPrice, maxPrice, sort } = req.query;
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const skip = (page - 1) * limit;

        const filter = { isActive: true };
        if (category) filter.category = category.toLowerCase();
        if (minPrice !== undefined || maxPrice !== undefined) {
            filter.price = {};
            if (minPrice !== undefined) filter.price.$gte = parseFloat(minPrice);
            if (maxPrice !== undefined) filter.price.$lte = parseFloat(maxPrice);
        }

        const allowedSorts = ['price', '-price', 'createdAt', '-createdAt'];
        const sortField = allowedSorts.includes(sort) ? sort : '-createdAt';

        const products = await Product.find(filter)
            .populate('seller', 'name email avatar')
            .sort(sortField)
            .skip(skip)
            .limit(limit);

        const total = await Product.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: {
                products,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                    hasNextPage: page < Math.ceil(total / limit),
                    hasPrevPage: page > 1,
                },
            },
        });
    } catch (error) {
        throw error;
    }
};

const getProductById = async(req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('seller', 'name email avatar');
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, data: { product } });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ success: false, message: 'Invalid product ID' });
        }
        throw error;
    }
};

const updateProduct = async(req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        if (product.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'You can only update your own products' });
        }

        const allowed = ['title', 'description', 'price', 'category', 'stock', 'images', 'isActive'];
        allowed.forEach((field) => {
            if (req.body[field] !== undefined) product[field] = req.body[field];
        });

        await product.save();
        res.status(200).json({ success: true, message: 'Product updated', data: { product } });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ success: false, message: 'Invalid product ID' });
        }
        throw error;
    }
};

const deleteProduct = async(req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        if (product.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'You can only delete your own products' });
        }

        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Product deleted' });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ success: false, message: 'Invalid product ID' });
        }
        throw error;
    }
};

module.exports = { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct };