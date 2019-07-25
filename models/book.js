const mongoose = require('mongoose');
const coverImageBasePath = 'uploads/bookCovers';
const path = require('path');
const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    publishDate: {
        type: Date,
        required: true
    },
    pageCount: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    coverImage: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Author'
    }
});
bookSchema.virtual('coverImagePath').get(function () {
    if (this.coverImage != null) {
        return path.join('/', coverImageBasePath, this.coverImage);
    }
});
module.exports = mongoose.model('Book', bookSchema);
module.exports.coverImageBasePath = coverImageBasePath;