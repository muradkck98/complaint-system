const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  id: { type: String, required: true },
  Complaint: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },  
    lon: { type: Number, required: true }
  },
  photo: { type: String, required: true }
});

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;
