const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const Book = require('../models/book');
const Author = require('../models/author');
const uploadPath = path.join('public', Book.coverImageBasePath);
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype), true);
    }
});
//All Books route
router.get('/', async (req, res) => {
    let query = Book.find();
    if (req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'));
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
        query = query.lte('publishedDate', req.query.publishedBefore);
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
        query = query.gte('publishedDate', req.query.publishedBefore);
    }
    try {
        const books = await query.exec();
        res.render('books/index', {
            books: books,
            searchOption: req.query
        });
    } catch{
        res.redirect('/')
    }

});

//New Book route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Book());
});
//Create Book Route
router.post('/', upload.single('cover'), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null;
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        coverImage: fileName,
        description: req.body.description
    });

    try {
        const newBook = await book.save();
        // res.redirect('books/${new}')
        res.redirect('books');
    } catch (err) {
        renderNewPage(res, book, true);
    }
});

async function renderNewPage(res, book, hasErr = false) {
    try {
        const author = await Author.find({});
        const params = {
            author: author,
            book: book
        };
        if (hasErr)
            params.errorMessage = "Error Creating a Book";
        res.render('books/new', params);
    } catch{
        removeBookCover(book.coverImage);
        res.redirect('/books');
    }
}

function removeBookCover(fineName) {
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) {
            console.error(err);
        }
    });
}

module.exports = router;