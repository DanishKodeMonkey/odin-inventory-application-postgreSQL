// import model to be used for various operations
const Item = require('../models/item');
const Category = require('../models/category');

// import asyncHandler manage error handling as a wrapper, voiding alot of boiletplate.
const asyncHandler = require('express-async-handler');

// Site home page, initial landing page
exports.index = asyncHandler(async (req, res, next) => {
    // Get item and category details for overview
    const [numItems, numCategories] = await Promise.all([
        Item.countDocuments({}),
        Category.countDocuments({}),
    ]);

    res.render('index', {
        title: 'Odin Inventory Application Home',
        item_count: numItems,
        category_count: numCategories,
    });
});

// Item specific pages

// display list of all items
exports.item_list = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: item list');
});

// Display detail page for specific item
exports.item_detail = asyncHandler(async (req, res, next) => {
    res.send(`NOT IMPLEMENTED: item details: ${req.params.id}`);
});

// display item create form on GET
exports.item_create_get = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: item create GET');
});

// handle item create on POST
exports.item_create_post = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: item create POST');
});

// display item delete form on GET
exports.item_delete_get = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: item delete GET');
});

// handle item delete on POST
exports.item_delete_post = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: item delete POST');
});

// display item update form on GET
exports.item_update_get = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: item update GET');
});

// handle item update on POST
exports.item_update_post = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: item update POST');
});
