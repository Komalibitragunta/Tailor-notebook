// Updated app.js with MongoDB Atlas, dotenv, error handling, and structure cleanup

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const Customer = require('./models/customer');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Atlas connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Session middleware
app.use(session({
  secret: 'yourSecretKey123',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

let tempData = {}; // Temporary storage between form steps

// Routes

// Login
app.get('/', (req, res) => res.redirect('/login'));
app.get('/login', (req, res) => res.render('login'));
app.post('/login', (req, res) => res.redirect('/customer'));

// Customer Info
app.get('/customer', (req, res) => res.render('customer'));
app.post('/customer', (req, res) => {
  tempData = { ...tempData, ...req.body };
  res.redirect('/gender');
});

// Gender
app.get('/gender', (req, res) => res.render('gender'));
app.post('/gender', (req, res) => {
  tempData.gender = req.body.gender;
  res.redirect('/dress');
});

// Dress Type
app.get('/dress', (req, res) => res.render('dress'));
app.post('/dress', (req, res) => {
  tempData.dressType = req.body.dressType;
  res.redirect('/dress-models');
});

// Dress Models
app.get('/dress-models', (req, res) => {
  const models = {
    shirt: ['Slim Fit', 'Formal', 'Casual'],
    pant: ['Jeans', 'Formal Trousers', 'Cargo'],
    blouse: ['Embroidered', 'Sleeveless', 'High Neck'],
    salwar: ['Anarkali', 'Patiala', 'Straight Cut'],
    suit: ['3-Piece', 'Slim Fit', 'Double Breasted'],
    lehenga: ['Bridal', 'Party Wear', 'Printed']
  };

  const selectedDress = tempData.dressType;
  const dressModels = models[selectedDress] || [];

  res.render('dress-models', {
    dressType: selectedDress,
    models: dressModels
  });
});

app.post('/dress-models', (req, res) => {
  tempData.dressModel = req.body.dressModel;
  res.redirect('/measurements');
});

// Measurements
app.get('/measurements', (req, res) => res.render('measurements'));
app.post('/measurements', (req, res) => {
  tempData.measurements = req.body;
  res.redirect('/payment');
});

// Payment
app.get('/payment', (req, res) => res.render('payment'));
app.post('/payment', async (req, res) => {
  try {
    tempData.payment = req.body;
    const customer = new Customer(tempData);
    await customer.save();
    res.redirect('/order');
  } catch (err) {
    console.error('Error saving customer:', err);
    res.status(500).send('Server Error');
  }
});

// Order Confirmation
app.get('/order', async (req, res) => {
  const lastCustomer = await Customer.findOne().sort({ _id: -1 }).lean();
  res.render('order', { customer: lastCustomer });
});

// All Customers
app.get('/customers', async (req, res) => {
  const customers = await Customer.find();
  res.render('customers', { customers });
});

// Individual Customer
app.get('/customers/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send("Customer not found");
    res.render('customer-details', { customer });
  } catch (err) {
    res.status(500).send("Error loading customer details");
  }
});

// Dashboard
app.get('/dashboard', async (req, res) => {
  const totalCustomers = await Customer.countDocuments();
  const totalOrders = totalCustomers;
  const totalAppointments = 0; // Placeholder
  res.render('dashboard', { totalCustomers, totalOrders, totalAppointments });
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      return res.redirect('/dashboard');
    }
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
});

// Static Assets
app.use('/styles', express.static(path.join(__dirname, 'public')));

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
