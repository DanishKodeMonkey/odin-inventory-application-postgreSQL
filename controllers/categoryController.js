// import validation tools
const { body, validationResult } = require('express-validator');

// import model to be used for various operations
const Category = require('../models/category');
const Item = require('../models/item');

// import asyncHandler manage error handling as a wrapper, voiding alot of boiletplate.
const asyncHandler = require('express-async-handler');

// display list of all categories
exports.category_list = asyncHandler(async (req, res, next) => {
    const allCategories = await Category.find().sort({ title: 1 }).exec();

    res.render('category_list', {
        title: 'Categories list',
        category_list: allCategories,
    });
});

// Display detail page for specific category
exports.category_detail = asyncHandler(async (req, res, next) => {
    const [category, allItemsInCategory] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Item.find({ category: req.params.id }, 'name url').exec(),
    ]);

    res.render('category_detail', {
        title: 'Category details',
        category: category,
        category_items: allItemsInCategory,
    });
});

// display category create form on GET
exports.category_create_get = (req, res, next) => {
    res.render('category_form', {
        title: 'Create Category',
        category: {},
        errors: [],
    });
};

// handle category create on POST
exports.category_create_post = [
    // validate and sanitize fields for post
    body('title')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('Title must be specified')
        .isAlphanumeric()
        .withMessage('Title name has non-alphanumeric characters'),
    body('description').isLength({ min: 1, max: 500 }).escape(),

    // Process request after validation
    asyncHandler(async (req, res, next) => {
        // Extract errors(if any) from a request
        const errors = validationResult(req);

        // Create new category object with data
        const category = new Category({
            title: req.body.title,
            description: req.body.description,
        });

        // Errors were found, render form again with sanitized values and error messages
        if (!errors.isEmpty()) {
            res.render('category_form', {
                title: 'Create category',
                category: category,
                errors: errors.array(),
            });
            return;
        } else {
            // Data is valid, proceed
            // Check if category already exist
            const categoryExists = await Category.findOne({
                title: req.body.title,
            }).exec();
            if (categoryExists) {
                //Category exists, redirect to detail page, dont save.
                res.redirect(categoryExists.url);
            } else {
                // save to db
                await category.save();
                //redirect to new category detail page
                res.redirect(category.url);
            }
        }
    }),
];

// display category delete form on GET
exports.category_delete_get = asyncHandler(async (req, res, next) => {
    // remember: prevent deletion of categories if items are associated
    const [category, allItemsInCategory] = await Promise.all([
        // First, find the category in question
        Category.findById(req.params.id).exec(),
        // find any items with category id matching category in question
        Item.find({ category: req.params.id }, 'name numberInStock').exec(),
    ]);

    // no categories found(by id)
    if (category === null) {
        // redirect to categories list
        res.redirect('/catalog/categories');
    }

    // category found, render deletion page, pass items for error.
    res.render('category_delete', {
        title: 'Delete Category',
        category: category,
        category_items: allItemsInCategory,
    });
});

// handle category delete on POST
exports.category_delete_post = asyncHandler(async (req, res, next) => {
    // Again, get both category and items associated
    const [category, allItemsInCategory] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Item.find({ category: req.params.id }, 'title numberInStock').exec(),
    ]);

    if (allItemsInCategory.length > 0) {
        // Category has items, render just like GET route, will display an error
        res.render('category_delete', {
            title: 'Delete Category',
            category: category,
            category_items: allItemsInCategory,
        });
        // end POST here.
        return;
    } else {
        // Category has no items, delete object and redirect to list
        // use categoryid created in the form of the view.
        await Category.findByIdAndDelete(req.body.categoryid);
        // redirect to categories catalog
        res.redirect('/catalog/categories');
    }
});

// display category update form on GET
exports.category_update_get = asyncHandler(async (req, res, next) => {
    // Get category to edit
    const category = await Category.findById(req.params.id).exec();

    if (category === null) {
        const err = new Error('Category not found');
        err.status = 404;
        return next(err);
    }

    res.render('category_form', {
        title: 'Update category',
        category: category,
        errors: [],
    });
});

// handle category update on POST
exports.category_update_post = [
    // Nothing to convert, validate body

    // validate and sanitize fields for post
    body('title')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('Title must be specified')
        .isAlphanumeric()
        .withMessage('Title name has non-alphanumeric characters'),
    body('description').isLength({ min: 1, max: 500 }).escape(),

    // Process request after validation and sanitization
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        // Create category object, REMEMBER THE ID or a new id will be assigned
        const category = new Category({
            title: req.body.title,
            description: req.body.description,
            _id: req.params.id, // IMPORTANT for update operation
        });
        // Errors found ,re-render form
        if (!errors.isEmpty()) {
            // nothing important to fetch, just re-render

            res.render('category_update', {
                title: 'Update category',
                category: category,
                errors: errors.array(),
            });
            return;
        } else {
            // Data valid, update the record
            const updatedCategory = await Category.findByIdAndUpdate(
                req.params.id,
                category,
                {}
            );
            res.redirect(updatedCategory.url);
        }
    }),
];
