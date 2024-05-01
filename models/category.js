const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Create Schema
const CategorySchema = new Schema({
    title: { type: String, required: true, maxLength: 50 },
    description: { type: String, required: true, maxLength: 200 },
});

// Virtual for Category URL

CategorySchema.virtual('url').get(function () {
    return `/catalog/categories/${this._id}`;
});

// export model creation from schema
module.exports = mongoose.model('Category', CategorySchema);
