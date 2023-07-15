const bwipjs = require("bwip-js");
const { v4: uuidv4 } = require('uuid');
const Author = require("../model/author");
const { isValidName, validatePhone, isValidEmail, isValidPassword } = require("../validator/validation");


const createAuthor = async function(req, res) {
  try {
    let data = req.body;

    // Checking if the body is empty
    if (Object.keys(data).length === 0) {
      return res.status(400).send({ status: false, message: "Body is empty" });
    }

    let { name, authorType, phone, email, password } = data;

    // Validating the fields
    if (!isValidName(name)) {
      return res.status(400).send({ status: false, message: "Name is not valid" });
    }
    if (!authorType) {
      return res.status(400).send({ status: false, message: "authorType is not valid" });
    }
    if (!validatePhone(phone)) {
      return res.status(400).send({ status: false, message: "phone is not valid" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).send({ status: false, message: "email is not valid" });
    }
    if (!isValidPassword(password)) {
      return res.status(400).send({ status: false, message: "password is not valid" });
    }

    // Generate a unique barcode for the author
    const barcode = generateUniqueBarcode();

    // Create a new author instance with the barcode
    const author = new Author({
      name,
      authorType,
      phone,
      email,
      password,
      barcode
    });

    // Save the author to the database
    const savedAuthor = await author.save();

    return res.status(201).json(savedAuthor);
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

// Function to generate a unique barcode
function generateUniqueBarcode() {
  // Generating a random UUID
  const barcode = uuidv4();

  return barcode;
}

// fetch all data
const authordetails = async function(req, res){
  try {
    const authors = await Author.find();
    return res.status(200).json(authors);
  }  catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = { createAuthor ,authordetails };
