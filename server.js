require('dotenv').config();
const express = require('express');
const parseCSV = require('./utils/csvToJsonConverter');
const { saveUserToDB, showAgeGroupStats } = require('./services/csvUploadService');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/upload', async (req, res) => {
  try {
    const records = parseCSV(process.env.CSV_FILE_PATH);
    for (const record of records) {
      await saveUserToDB(record);
    }
    await showAgeGroupStats();
    res.send('✅ Upload complete');
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ Something went wrong');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
