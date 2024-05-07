// import model to be used for various operations
const Item = require('../models/item');
const Category = require('../models/category');

// import asyncHandler manage error handling as a wrapper, voiding alot of boiletplate.
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

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
    const allItems = await Item.find({}, 'name category price numberInStock')
        .sort({ name: 1 })
        .populate('category')
        .exec();

    res.render('item_list', { title: 'Item list', item_list: allItems });
});

// Display detail page for specific item
exports.item_detail = asyncHandler(async (req, res, next) => {
    // get details of item
    const item = await Item.findById(req.params.id).populate('category').exec();

    // No result
    if (item === null) {
        const err = new Error('Item not found');
        err.status = 404;
        return next(err);
    }

    res.render('item_detail', {
        title: 'Item details',
        item: item,
    });
});

// display item create form on GET
exports.item_create_get = asyncHandler(async (req, res, next) => {
    // get all categories for selecting categories to assign to
    const allCategories = await Category.find().sort({ title: 1 }).exec();

    res.render('item_form', {
        title: 'Create item',
        item: {},
        errors: [],
        categories: allCategories,
    });
});

// handle item create on POST
exports.item_create_post = [
    // Convert chosen categories to an array
    (req, res, next) => {
        if (!Array.isArray(req.body.categories)) {
            req.body.categories =
                typeof req.body.categories === 'undefined'
                    ? []
                    : [req.body.categories];
        }
        next();
    },
    body('name', 'Name must not be empty.')
        .isLength({ min: 1, max: 50 })
        .escape(),
    body('category.*').notEmpty().escape(),
    body('description', 'Description must not be empty')
        .isLength({ min: 1, max: 500 })
        .escape(),
    body('price', 'Price must not be empty')
        .trim()
        .isDecimal()
        .withMessage('Price must be a decimal number')
        .toFloat(),
    body('numberInStock', 'Number in stock must not be empty')
        .trim()
        .isInt({ min: 0 })
        .withMessage('In stock must be a non-negative number')
        .toInt(),

    // Process request after validation
    asyncHandler(async (req, res, next) => {
        console.log('Handling request body', req.body);
        // Extract validation errors from request
        const errors = validationResult(req);

        // Create new book object
        const item = new Item({
            name: req.body.name,
            category: req.body.categories,
            description: req.body.description,
            price: req.body.price,
            numberInStock: req.body.numberInStock,
        });

        if (!errors.isEmpty()) {
            console.log('Error found, returning item', item);
            // Errors were found, re-render form with values

            // Get all categories for re-render of form
            const allCategories = await Category.find()
                .sort({ title: 1 })
                .exec();

            // Mark selected categories as checked
            for (const category of allCategories) {
                if (item.category.includes(category._id)) {
                    category.checked = 'true';
                }
            }
            res.render('item_form', {
                title: 'Create item',
                categories: allCategories,
                item: item,
                errors: errors.array(),
            });
        } else {
            // Data form valid, proceed
            await item.save();
            res.redirect(item.url);
        }
    }),
];

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
