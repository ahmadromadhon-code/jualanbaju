require('dotenv').config();
const express = require('express');
const { Octokit } = require('@octokit/rest');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// GitHub Configuration
const octokit = new Octokit({ 
  auth: process.env.GITHUB_TOKEN
});
const [owner, repo] = process.env.GITHUB_REPO.split('/');
const branch = 'main';

// Upload to GitHub
async function uploadToGitHub(file) {
  const filePath = `images/${Date.now()}-${file.originalname}`;
  const content = fs.readFileSync(file.path, { encoding: 'base64' });

  try {
    const { data } = await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      branch,
      path: filePath,
      message: `Upload image ${file.originalname}`,
      content,
    });

    // Get raw GitHub URL
    return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;
  } catch (error) {
    console.error('GitHub upload error:', error);
    return null;
  } finally {
    fs.unlinkSync(file.path); // Delete temp file
  }
}

// Multer config
const upload = multer({ 
  dest: 'temp-uploads/',
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// API Endpoints
app.post('/api/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const imageUrl = await uploadToGitHub(req.file);
  if (!imageUrl) {
    return res.status(500).json({ error: 'Failed to upload image' });
  }

  res.json({ imageUrl });
});

// Products CRUD (using GitHub as DB)
async function getProducts() {
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      branch,
      path: 'data/products.json'
    });
    return JSON.parse(Buffer.from(data.content, 'base64').toString());
  } catch {
    return [];
  }
}

async function saveProducts(products) {
  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    branch,
    path: 'data/products.json',
    message: 'Update products',
    content: Buffer.from(JSON.stringify(products)).toString('base64'),
  });
}

app.get('/api/products', async (req, res) => {
  res.json(await getProducts());
});

app.post('/api/products', async (req, res) => {
  const products = await getProducts();
  const newProduct = {
    id: Date.now(),
    ...req.body
  };
  products.push(newProduct);
  await saveProducts(products);
  res.status(201).json(newProduct);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));