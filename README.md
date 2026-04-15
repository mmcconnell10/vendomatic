# Vend-O-Matic

A simple HTTP service that simulates a beverage vending machine.
Includes a Node.js/Express API and a minimal React UI for demonstration.

This project was built as part of a technical assessment and follows the constraints specified in the assignment, including coin handling, inventory limits, and HTTP contract behavior. 

**Thank you so much for the opportunity and I look forward to hearing back from you all. Have a great weekend!

---

# Features

### API

* Accepts only US quarters (one at a time)
* Each beverage costs **2 quarters**
* 3 beverage types available
* Each beverage starts with inventory of **5**
* Only **one beverage dispensed per transaction**
* Extra coins are returned automatically
* JSON-based HTTP interface
* Uses response headers to communicate coin balances and inventory updates 

### Frontend

* Simple React interface
* Insert quarters
* Return coins
* View inventory levels
* Purchase beverages
* Displays returned change
* Shows error messages for insufficient funds or out-of-stock items

---

# Tech Stack

### Backend

* Node.js
* Express
* dotenv

### Frontend

* React
* Vite

---

# Project Structure

```
vend-o-matic/
│
├── src/
│   ├── app.js
│   ├── state.js
│   └── routes.js
│
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── App.css
│   ├── index.html
│   └── vite.config.js
│
├── .env
├── .env.example
└── README.md
```

---

# Setup Instructions (OSX / Linux)

### 1. Clone repository

```bash
git clone <repo-url>
cd vend-o-matic
```

---

### 2. Install backend dependencies

```bash
npm install
```

---

### 3. Install frontend dependencies

```bash
cd client
npm install
npm install -D @vitejs/plugin-react
cd ..
```

---

### 4. Configure environment variables

Create `.env` in the root directory:

```env
PORT=3000
NODE_ENV=development

ITEM_COUNT=3
MAX_INVENTORY_PER_ITEM=5
ITEM_PRICE_IN_COINS=2
```

---

# Running the Application

### Start backend

```bash
npm run dev
```

Server runs at:

```
http://localhost:3000
```

---

### Start frontend

```bash
npm run client
```

Frontend runs at:

```
http://localhost:5173
```

---

# API Specification

All requests and responses use:

```
Content-Type: application/json
```

---

## Insert Coin

### PUT /

Insert one quarter into the machine.

#### Request Body

```json
{
  "coin": 1
}
```

#### Response

```
204 No Content
X-Coins: <number of coins currently inserted>
```

---

## Return Coins

### DELETE /

Returns all inserted coins.

#### Response

```
204 No Content
X-Coins: <number of coins returned>
```

---

## Get Inventory

### GET /inventory

Returns remaining quantity of all beverages.

#### Response

```json
[5,5,5]
```

---

## Get Inventory for Item

### GET /inventory/:id

#### Response

```json
5
```

---

## Purchase Beverage

### PUT /inventory/:id

Attempts to purchase one beverage.

#### Success Response

```
200 OK
X-Coins: <coins returned as change>
X-Inventory-Remaining: <updated stock level>
```

```json
{
  "quantity": 1
}
```

---

### Error Responses

#### Out of Stock

```
404
X-Coins: <inserted coins>
```

#### Insufficient Coins

```
403
X-Coins: <inserted coins>
```

These behaviors follow the requirements defined in the assignment specification. 

---

# Example curl Usage
If you want to just run the backend and run these commands, that works as well!

Insert quarter:

```bash
curl -X PUT http://localhost:3000/ \
-H "Content-Type: application/json" \
-d '{"coin":1}' -i
```

Return coins:

```bash
curl -X DELETE http://localhost:3000/ -i
```

Check inventory:

```bash
curl http://localhost:3000/inventory
```

Buy beverage:

```bash
curl -X PUT http://localhost:3000/inventory/0 \
-H "Content-Type: application/json" \
-d '{}' -i
```

---



