const mongoose = require("mongoose");


const publisherSchema = new mongoose.Schema({
  publishingHouseName: { type: String, required: true },
  publishingHouseActivities: { type: String, required: true },
  aboutPublishingHouse: { type: String, required: true },
  city: { type: String, required: true },
  licenseNumber: { type: String, required: true },
  expiryDate: { type: Date, required: true },
  validity: { type: String, required: true },
  licenseCopy: { type: String, required: true },
  location: { type: String, required: true },
  website: { type: String, required: true },
});

const Publisher = mongoose.model('Publisher', publisherSchema);

module.exports = Publisher;