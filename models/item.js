const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Create Schema
const ItemSchema = new Schema({
    name: { type: String, required: true, maxLength: 50 },
    category: [
        { type: Schema.Types.ObjectId, required: true, ref: 'Category' },
    ],
    description: { type: String, required: true, maxLength: 200 },
    price: { type: Number, required: true, min: 0, max: 99999 },
    numberInStock: { type: Number, required: true, min: 0, max: 99999 },
});

// Virtual for Item URL

ItemSchema.virtual('url').get(function () {
    return `/catalog/items/${this._id}`;
});

// export model creation from schema
module.exports = mongoose.model('Item', ItemSchema);
