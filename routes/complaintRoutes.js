const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const connectToDatabase = require('../config/db');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

const db = connectToDatabase();

// Create complaint
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const complaint = {
      id: uuidv4(),
      Complaint: req.body.Complaint,
      location: {
        lat: parseFloat(req.body.lat),
        lon: parseFloat(req.body.lon)
      },
      photo: req.file.path 
    };
    const collection = (await db).collection('complaints');
    await collection.insertOne(complaint);
    res.status(201).json(complaint);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read all complaints
router.get('/', async (req, res) => {
  try {
    const collection = (await db).collection('complaints');
    const complaints = await collection.find().toArray();
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read single complaint
router.get('/:id', async (req, res) => {
  try {
    const collection = (await db).collection('complaints');
    const complaint = await collection.findOne({ id: req.params.id });
    if (complaint) {
      res.json(complaint);
    } else {
      res.status(404).json({ error: 'Complaint not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update complaint
router.put('/:id', upload.single('photo'), async (req, res) => {
  try {
    const updateFields = {
      Complaint: req.body.Complaint,
      location: {
        lat: parseFloat(req.body.lat),
        lon: parseFloat(req.body.lon)
      }
    };
    if (req.file) {
      updateFields.photo = req.file.path;
    }
    const collection = (await db).collection('complaints');
    const result = await collection.updateOne(
      { id: req.params.id },
      { $set: updateFields }
    );
    if (result.modifiedCount > 0) {
      res.json({ message: 'Complaint updated' });
    } else {
      res.status(404).json({ error: 'Complaint not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete complaint
router.delete('/:id', async (req, res) => {
  try {
    const collection = (await db).collection('complaints');
    const result = await collection.deleteOne({ id: req.params.id });
    if (result.deletedCount > 0) {
      res.json({ message: 'Complaint deleted' });
    } else {
      res.status(404).json({ error: 'Complaint not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
