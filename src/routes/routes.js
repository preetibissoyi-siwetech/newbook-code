const express = require('express');
const router = express.Router();
const publisherController= require('../controller/publisherController') 
const authorController =require('../controller/authorController')

//Publisher//
router.post("/register",publisherController.createPublisher)
router.get('/publishers', publisherController.getPublishers);

// author
router.post("/authorregister",authorController.createAuthor)
router.get('/authorsdetails',authorController .authordetails);

module.exports = router;