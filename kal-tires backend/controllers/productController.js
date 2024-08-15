const Product = require('../models/product.model');
const asyncHandler = require('express-async-handler');

// Get all products
// route GET /products
// @access private
const getAllProducts = asyncHandler(async (req, res) => {
    const products = await Product.find().lean();
    if (!products?.length) {
        return res.status(400).json({ message: 'No products found' });
    }
    res.json(products);
});

// Create new product
// route POST /products
// @access private
const createNewProduct = asyncHandler(async (req, res) => {
    const { name, price, description, image } = req.body;

    // Confirm data
    if (!name || !price || !description || !image) {
        return res.status(400).json({ message: 'Name, price, Image and description are required' });
    }

    // Check for duplicate product name
    const duplicateProduct = await Product.findOne({ name }).lean().exec();
    if (duplicateProduct) {
        return res.status(400).json({ message: 'Product name already exists' });
    }

    // Create and store new product
    const product = await Product.create({ name, price, description, image });
    if (product) {
        res.status(201).json({ message: `New product ${name} has been created` });
    } else {
        res.status(400).json({ message: 'Invalid product data was received' });
    }
});

// Update product
// route PATCH /products
// @access private
const updateProduct = asyncHandler(async (req, res) => {
    const { id, name, price, description, image } = req.body;

    // Confirm data
    if (!id || !name || !price || !image) {
        return res.status(400).json({ message: 'ID, name, image and price are required' });
    }

    const product = await Product.findById(id).exec();
    if (!product) {
        return res.status(400).json({ message: 'Product not found' });
    }

    // Check for duplicate product name
    const duplicate = await Product.findOne({ name }).lean().exec();
    if (duplicate && duplicate._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate product name' });
    }

    product.name = name;
    product.price = price;
    product.image = image;
    if (description) {
        product.description = description;
    }

    const updatedProduct = await product.save();
    res.json({ message: `${updatedProduct.name} updated` });
});

// Delete product
// route DELETE /products
// @access private
const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'Product ID is required' });
    }

    const product = await Product.findById(id).exec();
    if (!product) {
        return res.status(400).json({ message: 'Product not found' });
    }

    const name = product.name;
    const Id = product._id;

    const result = await product.deleteOne();
    const reply = `Product ${name} with ID ${Id} was deleted`;

    res.json(reply);
});

module.exports = {
    getAllProducts,
    createNewProduct,
    updateProduct,
    deleteProduct
};
