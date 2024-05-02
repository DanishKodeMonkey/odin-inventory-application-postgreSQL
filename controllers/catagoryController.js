// import model to be used for various operations
const Category = require('../models/category');

// import asyncHandler manage error handling as a wrapper, voiding alot of boiletplate.
const asyncHandler = require('express-async-handler');

// display list of all categories
exports.category_list = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: category list');
});

// Display detail page for specific category
exports.category_detail = asyncHandler(async (req, res, next) => {
    res.send(`NOT IMPLEMENTED: Category details: ${req.params.id}`);
});

// display category create form on GET
exports.category_create_get = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Category create GET');
});

// handle category create on POST
exports.category_create_post = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Category create POST');
});

// display category delete form on GET
exports.category_delete_get = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Category delete GET');
});

// handle category delete on POST
exports.category_delete_post = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Category delete POST');
});

// display category update form on GET
exports.category_update_get = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Category update GET');
});

// handle category update on POST
exports.category_update_post = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Category update POST');
});
