# E-commerce Store Backend

This is the backend for an e-commerce store where clients can add items to their cart and checkout to successfully place an order. Every nth order gets a coupon code for a 10% discount that can be applied to their cart.

## Features

- Add items to cart
- Checkout and place an order
- Generate discount codes for every nth order
- Admin API to get statistics

## Installation

1. Clone the repository:
2. Install the dependencies:
```
npm install

```
3. Run the server
```
Node ./server.js

```
The server will run on http://localhost:5000

# API Endpoints

### Add Item to Cart
URL: /api/cart/:userId

Method: POST

Request Body:JSON

{
  "item": {
    "id": "item1",
    "name": "Laptop",
    "price": 1000
  }
}


Response:JSON


{
  "message": "Item added to cart",
  "cart": [
    {
      "id": "item1",
      "name": "Laptop",
      "price": 1000
    }
  ]
}

### Checkout

URL: /api/checkout/:userId

Method: POST

Request Body:JSON

{
  "discountCode": "DISCOUNT1"
}

Response:JSON

{
  "message": "Order placed",
  "totalAmount": 900,
  "discount": 100
}

### Admin Stats
URL: /api/admin/stats

Method: GET

Response:JSON

{
  "totalItems": 10,
  "totalPurchaseAmount": 9000,
  "discountCodes": ["DISCOUNT2"],
  "totalDiscountAmount": 1000
}

### Generate Discount Code
URL: /api/admin/generate-discount

Method: POST

Response: If the condition is met

{
  "message": "Discount code generated",
  "discountCode": "DISCOUNT1"
}

If the condition is not met

{
  "message": "Condition not met for generating discount code"
}
