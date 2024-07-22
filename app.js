// app.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/nodejs-crud', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  name: String,
  email: String,

});


const User = mongoose.model('User', userSchema);
 
// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Routes
app.get('/', async (req, res) => {
  const users = await User.find();
  res.render('index', { users });
});

app.get('/create', (req, res) => {
  res.render('create');
});

app.post('/create', async (req, res) => {
  const newUser = new User(req.body);
  await newUser.save();
  res.redirect('/');
});

app.get('/edit/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    res.render('edit', { user });
  } else {
    res.status(404).send('User not found');
  }
});

app.post('/edit/:id', async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (user) {
    res.redirect('/');
  } else {
    res.status(404).send('User not found');
  }
});

app.post('/delete/:id', async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (user) {
    res.redirect('/');
  } else {
    res.status(404).send('User not found');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


