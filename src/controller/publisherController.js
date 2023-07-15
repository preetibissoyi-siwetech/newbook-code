const bwipjs = require("bwip-js");
const publisherModel = require("../model/publisher");

let counter = 1; // Initial counter value

const createPublisher = async function (req, res) {
  try {
    let data = req.body;
    let {
      publishingHouseName,
      publishingHouseActivities,
      aboutPublishingHouse,
      city,
      licenseNumber,
      expiryDate,
      validity,
      licenseCopy,
      location,
      website,
    } = data;

    if (Object.keys(data).length === 0) {
      return res.status(400).send({
        status: false,
        message: "Provide required information in the request body",
      });
    }

    if (
      !publishingHouseName ||
      !publishingHouseActivities ||
      !aboutPublishingHouse ||
      !city ||
      !licenseNumber ||
      !expiryDate ||
      !validity ||
      !licenseCopy ||
      !location ||
      !website
    ) {
      return res.status(400).send({
        status: false,
        message: "All fields are required in the request body",
      });
    }

    // Check if the licenseNumber or licenseCopy already exist
    let uniqueLicenseNumber = await publisherModel.findOne({ licenseNumber });
    if (uniqueLicenseNumber) {
      return res.status(400).send({
        status: false,
        message: "License number already exists",
      });
    }

    let uniqueLicenseCopy = await publisherModel.findOne({ licenseCopy });
    if (uniqueLicenseCopy) {
      return res.status(400).send({
        status: false,
        message: "License copy already exists",
      });
    }

    // Generate a unique barcode for the publisher
    const barcodeValue = generateUniqueBarcode(); 

    // Generate a barcode using bwip-js
    const barcodeOptions = {
      bcid: "code128", // Barcode type: Code 128
      text: barcodeValue, // Use the unique barcode value for the barcode
      scale: 2, // Barcode size scaling factor
      height: 10, // Barcode height in millimeters
      includetext: true, // Include the encoded text in the barcode
    };

    const barcodeImageBuffer = await new Promise((resolve, reject) => {
      bwipjs.toBuffer(barcodeOptions, function (err, png) {
        if (err) {
          reject(err);
        } else {
          resolve(png); // Resolve with the barcode image buffer
        }
      });
    });

    // Convert the barcode image buffer to a base64-encoded string
    const barcodeImageBase64 = barcodeImageBuffer.toString("base64");

    //-----------------------Create Publisher data---------------------------

    // Create the publisher data with the barcode value and barcode image
    const publisherData = await publisherModel.create({
      ...data,
      barcode: barcodeValue, 
      barcodeImage: barcodeImageBase64, 
    });

    return res.status(201).send({
      status: true,
      message: "Publisher account created. Awaiting admin approval.",
      publisherData: {
        ...publisherData.toObject(),
        barcodeImage: barcodeImageBase64, 
      },
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

// Function to generate a unique barcode value
function generateUniqueBarcode() {
  const barcodeValue = `BARCODE-${counter}`; 
  counter++; 
  return barcodeValue;
}

//==============fetch all publisher data=========

const getPublishers = async function (req, res) {
  try {
    const publishers = await publisherModel.find();
    return res.status(200).json(publishers);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


module.exports = { createPublisher, getPublishers };

