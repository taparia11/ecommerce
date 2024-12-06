// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize the Express app
const app = express();

// Middleware to parse JSON bodies and enable CORS
app.use(bodyParser.json());
app.use(cors());

// Define the port for the server
const PORT = process.env.PORT || 5000;

// Start the server and listen on the defined port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// In-memory stores for carts, orders, and discount codes
let carts = {};
let orders = [];
let discountCodes = [];
const nthOrder = 5; // Every nth order gets a discount code

// API to add items to a user's cart
app.post('/api/cart/:userId', (req, res) => {
  const { userId } = req.params; // Extract userId from URL parameters
  const { item } = req.body; // Extract item from request body

  // Initialize cart for user if it doesn't exist
  if (!carts[userId]) {
    carts[userId] = [];
  }

  // Add item to user's cart
  carts[userId].push(item);
  res.status(200).json({ message: 'Item added to cart', cart: carts[userId] });
});

// API to checkout and place an order
app.post('/api/checkout/:userId', (req, res) => {
  const { userId } = req.params; // Extract userId from URL parameters
  const { discountCode } = req.body; // Extract discount code from request body

  // Check if the user's cart is empty
  if (!carts[userId] || carts[userId].length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  // Calculate total amount of items in the cart
  let totalAmount = carts[userId].reduce((total, item) => total + item.price, 0);
  let discount = 0;

  // Apply discount if a valid discount code is provided
  if (discountCode && discountCodes.includes(discountCode)) {
    discount = totalAmount * 0.1; // 10% discount
    totalAmount -= discount;
    discountCodes = discountCodes.filter(code => code !== discountCode); // Remove used discount code
  }

  // Add the order to the orders list
  orders.push({ userId, items: carts[userId], totalAmount, discount });
  carts[userId] = []; // Clear the user's cart

  // Generate a new discount code if the order count is a multiple of nthOrder
  if (orders.length % nthOrder === 0) {
    const newDiscountCode = `DISCOUNT${orders.length / nthOrder}`;
    discountCodes.push(newDiscountCode);
  }

  res.status(200).json({ message: 'Order placed', totalAmount, discount });
});

// API to get admin statistics
app.get('/api/admin/stats', (req, res) => {
  // Calculate total items, total purchase amount, and total discount amount
  const totalItems = orders.reduce((count, order) => count + order.items.length, 0);
  const totalPurchaseAmount = orders.reduce((total, order) => total + order.totalAmount, 0);
  const totalDiscountAmount = orders.reduce((total, order) => total + order.discount, 0);

  // Respond with the calculated statistics
  res.status(200).json({
    totalItems,
    totalPurchaseAmount,
    discountCodes,
    totalDiscountAmount
  });
});

// API to generate a discount code if the condition is met
app.post('/api/admin/generate-discount', (req, res) => {
  // Check if the number of orders is a multiple of nthOrder
  if (orders.length % nthOrder === 0 && orders.length !== 0) {
    const newDiscountCode = `DISCOUNT${orders.length / nthOrder}`;
    discountCodes.push(newDiscountCode);
    res.status(200).json({ message: 'Discount code generated', discountCode: newDiscountCode });
  } else {
    res.status(400).json({ message: 'Condition not met for generating discount code' });
  }
});
