const express = require('express');
let books = require('./booksdb.js');
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!users.some(user => user.username === username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "Customer successfully registered. Now you can login"});
        } else {
            return res.status(409).json({message: "Customer already exists!"});
        }
    }
    return res.status(400).json({message: "Unable to register customer. Missing username or password."});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if(books[isbn]) {
        return res.status(200).json(books[isbn]);
    } else {
        return res.status(404).json({message: "Book not found"});
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    let filtered_books = [];
    let keys = Object.keys(books);
    keys.forEach((key) => {
        if(books[key].author.toLowerCase() === author.toLowerCase()) {
            filtered_books.push(books[key]);
        }
    });
    if(filtered_books.length > 0) {
        return res.status(200).send(JSON.stringify(filtered_books, null, 4));
    } else {
        return res.status(404).json({message: "Author not found"});
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    let filtered_books = [];
    let keys = Object.keys(books);
    keys.forEach((key) => {
        if(books[key].title.toLowerCase() === title.toLowerCase()) {
            filtered_books.push(books[key]);
        }
    });
    if(filtered_books.length > 0) {
        return res.status(200).send(JSON.stringify(filtered_books, null, 4));
    } else {
        return res.status(404).json({message: "Book title not found"});
    }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if(books[isbn]) {
        return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
    } else {
        return res.status(404).json({message: "Book not found"});
    }
});

// Task 10-13: Async/Await & Promises implementation using Axios
const getAllBooksAsync = async () => {
    try {
        const response = await axios.get('http://localhost:5000/');
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getBookByISBNPromise = (isbn) => {
    return new Promise((resolve, reject) => {
        axios.get(`http://localhost:5000/isbn/${isbn}`)
            .then(response => resolve(response.data))
            .catch(error => reject(error));
    });
};

const getBooksByAuthorAsync = async (author) => {
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getBooksByTitleAsync = async (title) => {
    try {
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

module.exports.general = public_users;