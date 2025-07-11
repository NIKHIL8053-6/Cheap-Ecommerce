require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Product = require('./models/Product');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// CRUD APIs
app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});
app.post('/api/products', async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.json(product);
});
app.put('/api/products/:id', async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});
app.delete('/api/products/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});
app.get('/api/search', async (req, res) => {
  const query = req.query.q;
  const results = await Product.find({ name: { $regex: query, $options: 'i' } });
  res.json(results);
});
app.get('/api/categories', async (req, res) => {
  const categories = await Product.distinct('category');
  res.json(categories);
});

app.listen(process.env.PORT, () => console.log(`http://localhost:${process.env.PORT}`));
