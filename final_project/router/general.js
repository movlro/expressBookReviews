const express = require('express');
const { json } = require('express');
let books = require("./booksdb.js");
const axios = require('axios');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();




public_users.post("/register", (req,res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    if (users.find((user) => user.username === username)) {
      return res.status(409).json({ message: "Username already exists" });
    }
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn=req.params.isbn;
  res.send(books[isbn]);
  return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;  
    const authorBooks = [];  
  
    for (const book in books) {  
      if (books[book].author === author) {  
        authorBooks.push(books[book]);
      }
    }
  
    if (authorBooks.length > 0) {  
      res.send(authorBooks);  
    }
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;  
  
    for (const book in books) {  
      if (books[book].title === title) {  
        res.send(books[book]);
        break;
      }
    }
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn=req.params.isbn;
    res.send(books[isbn].reviews);
  return res.status(300).json({message: "Yet to be implemented"});
});

//Get all books using Async callbacks
public_users.get("/server/asynbooks", async function (req,res) {
    try {
      let response = await axios.get("http://localhost:5005/");
      console.log(response.data);
      return res.status(200).json(response.data);
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({message: "Error getting book list"});
    }
});

//Get book details by ISBN using Promises
public_users.get("/server/asynbooks/isbn/:isbn", function (req,res) {
    let {isbn} = req.params;
    axios.get(`http://localhost:5005/isbn/${isbn}`)
    .then(function(response){
      console.log(response.data);
      return res.status(200).json(response.data);
    })
    .catch(function(error){
        console.log(error);
        return res.status(500).json({message: "Error while fetching book details."})
    })
});

//Get book details by author using promises
public_users.get("/server/asynbooks/author/:author", function (req,res) {
    let {author} = req.params;
    axios.get(`http://localhost:5005/author/${author}`)
    .then(function(response){
      console.log(response.data);
      return res.status(200).json(response.data);
    })
    .catch(function(error){
        console.log(error);
        return res.status(500).json({message: "Error while fetching book details."})
    })
});

//Get all books based on title using promises
public_users.get("/server/asynbooks/title/:title", function (req,res) {
    let {title} = req.params;
    axios.get(`http://localhost:5005/title/${title}`)
    .then(function(response){
      console.log(response.data);
      return res.status(200).json(response.data);
    })
    .catch(function(error){
        console.log(error);
        return res.status(500).json({message: "Error while fetching book details."})
    })
});

module.exports.general = public_users;
