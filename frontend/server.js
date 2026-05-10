const express = require('express');
const app = express();
const path = require('path');

// משתנה סביבה שיגיד ל-Frontend איפה ה-Backend נמצא
const BACKEND_URL = process.env.BACKEND_URL;

app.use(express.static('public'));

app.get('/config', (req, res) => {
    res.json({ backendUrl: BACKEND_URL });
});

app.listen(3000, () => {
    console.log('Frontend server running on port 3000');
});