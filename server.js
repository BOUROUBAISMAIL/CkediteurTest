const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 5000;
const cors = require('cors');

// Enable CORS for all origins
app.use(cors());

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(
  cors({
    origin: 'http://localhost:3001', // Replace this with your frontend URL
    methods: ['GET', 'POST', 'OPTIONS'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type'], // Allowed headers
    credentials: true, // Include cookies or credentials if needed
  })
);
app.options('*', cors());
// File upload endpoint
app.post('/upload', upload.single('upload'), (req, res) => {
  console.log('File received:', req.file);

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;
  res.status(200).json({
    uploaded: true,
    url: fileUrl
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
