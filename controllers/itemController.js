// import relevant query functions
const { indexQueries, itemQueries, categoryQueries } = require('../db/queries');

// import asyncHandler manage error handling as a wrapper, voiding alot of boiletplate.
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

// Site home page, initial landing page
exports.index = asyncHandler(async (req, res, next) => {
    // Get item and category details for overview
    const [numItems, numCategories] = await Promise.all([
        indexQueries.getItemCount(),
        indexQueries.getCategoryCount(),
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
    const allItems = await itemQueries.getAllItems();

    // Add urls to items and their associated categories
    allItems.forEach((item) => {
        item.url = `/catalog/items/${item.id}`;

        // add url for each category associated with the item
        if (item.category && item.category.length > 0) {
            item.category = item.category.map((category) => {
                return {
                    ...category,
                    url: `/catalog/categories/${category.id}`,
                };
            });
        }
    });

    res.render('item_list', { title: 'Item list', item_list: allItems });
});

// Display detail page for specific item
exports.item_detail = asyncHandler(async (req, res, next) => {
    // get details of item
    const item = await itemQueries.getItemById(req.params.id);

    // No result
    if (item === null) {
        const err = new Error('Item not found');
        err.status = 404;
        return next(err);
    }
    item.url = `/catalog/items/${item.id}`;

    if (item.categories && item.categories.length > 0) {
        item.categories = item.categories.map((category) => {
            return {
                ...category,
                url: `/catalog/categories/${category.id}`,
            };
        });
    }
    res.render('item_detail', {
        title: 'Item details',
        item: item,
    });
});

// display item create form on GET
exports.item_create_get = asyncHandler(async (req, res, next) => {
    // get all categories for selecting categories to assign to
    const allCategories = await categoryQueries.getAllCategories();

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
        // Extract validation errors from request
        const errors = validationResult(req);

        // Create new book object
        const item = {
            name: req.body.name,
            categoryIds: req.body.categories,
            description: req.body.description,
            price: req.body.price,
            numberInStock: req.body.numberInStock,
        };

        if (!errors.isEmpty()) {
            console.log('Error found, returning item', item);
            // Errors were found, re-render form with values

            // Get all categories for re-render of form
            const allCategories = await categoryQueries
                .getAllCategories()
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
            const newItem = await itemQueries.createItem(item);
            res.redirect(`/catalog/items/${newItem.id}`);
        }
    }),
];

// display item delete form on GET
exports.item_delete_get = asyncHandler(async (req, res, next) => {
    // since item is a bottom level association (not depended on by other items)
    // we dont need to find any associations.
    const item = await itemQueries.getItemById(req.params.id);

    // no item found, redirect.
    if (!item) {
        res.redirect('/catalog/items');
    }

    // item found, render deletion page
    res.render('item_delete', {
        title: 'Delete item',
        item: item,
    });
});

// handle item delete on POST
exports.item_delete_post = asyncHandler(async (req, res, next) => {
    // Since no checks have to be made, if the user confirms in form, just delete.
    await itemQueries.deleteItemById(req.body.itemid);
    res.redirect('/catalog/items');
});

// display item update form on GET
exports.item_update_get = asyncHandler(async (req, res, next) => {
    // in order to update an item we need to get the items and associated categories
    const [item, allCategories] = await Promise.all([
        itemQueries.getItemById(req.params.id),
        categoryQueries.getAllCategories(),
    ]);

    // item not found, return 404
    if (!item) {
        const err = new Error('Item not found');
        err.status = 404;
        return next(err);
    }

    // Mark selected categories as checked
    for (const category of allCategories) {
        if (item.category.includes(category.id)) {
            category.checked = 'true';
        }
    }

    // Reuse item form from creation
    res.render('item_form', {
        title: 'Update item',
        categories: allCategories,
        item: item,
        errors: [],
    });
});

// handle item update on POST
exports.item_update_post = [
    // Much like create, convert categories to array
    (req, res, next) => {
        if (!Array.isArray(req.body.categories)) {
            req.body.categories =
                typeof req.body.categories === 'undefined'
                    ? []
                    : [req.body.categories];
        }
        // proceed to next middleware
        next();
    },

    // Validation and dsanitization is litteraly copy pasted from create POST.
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

    // process request after validation and sanitization
    asyncHandler(async (req, res, next) => {
        // Extract errors
        const errors = validationResult(req);

        //Create book object, but remember _id or new id will be assigned
        const item = {
            name: req.body.name,
            categoryIds:
                typeof req.body.categories === 'undefined'
                    ? []
                    : req.body.categories,
            description: req.body.description,
            price: req.body.price,
            numberInStock: req.body.numberInStock,
            id: req.params.id, // IMPORTANT FOR UPDATE
        };

        if (!errors.isEmpty()) {
            // Errors found, re-render form

            const categories = await categoryQueries.getAllCategories();

            // mark selected categories as checked
            for (const category of categories) {
                if (item.category.includes(category.id)) {
                    category.checked = 'true';
                }
            }
            res.render('item_form', {
                title: 'Update item',
                categories: categories,
                item: item,
                errors: errors.array(),
            });
            return;
        } else {
            // Data is valid, proceed with update
            const updatedItem = await itemQueries.updateItemById(item.id, item);
            // redirect to updated book details
            res.redirect(`/catalog/items/${updatedItem.id}`);
        }
    }),
];
