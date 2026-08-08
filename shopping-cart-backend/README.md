# Shopping Cart - Backend

Backend REST API for the Shopping Cart application, built using **Node.js, Express.js, TypeScript, and MySQL**.

The backend provides the APIs and business logic required for authentication, product management, shopping cart management, and order management.

It supports separate **Customer** and **Administrator** workflows with JWT-based authentication and role-based authorization.

---

## Technology Stack

- Node.js
- Express.js
- TypeScript
- MySQL
- JWT Authentication
- REST APIs
- Docker

---

# What This Backend Contains

The backend provides APIs for:

- User registration
- User login
- JWT authentication
- User authorization
- Product management
- Product search
- Product pagination
- Shopping cart management
- Add to cart
- Remove from cart
- Order placement
- Customer orders
- Administrator orders

The backend is responsible for validating requests, applying business logic, communicating with MySQL, and returning API responses to the frontend.

---

# Backend Structure

The backend follows a simple layered structure.

```text
src/
│
├── controllers/
│
├── middlewares/
│
├── repositories/
│
├── routes/
│
├── services/
│
├── types/
│
├── constants/
│
└── ...
```

### Routes

Defines the available REST API endpoints and connects them with the appropriate controllers and middleware.

### Controllers

Handles incoming HTTP requests and sends responses back to the frontend.

### Services

Contains application and business logic.

### Repositories

Handles MySQL queries and database operations.

### Middleware

Handles common request processing such as:

- JWT authentication
- Authorization
- Request processing

---

# Authentication

The backend uses JWT-based authentication.

The authentication flow is:

```text
Login Request
     |
     v
Controller
     |
     v
Service
     |
     v
Validate User
     |
     v
Generate JWT
     |
     v
Return Authentication Response
```

The JWT is then used by the frontend when accessing protected APIs.

---

# Authorization

The backend supports role-based authorization.

The main roles are:

```text
Customer
Admin
```

Customer and administrator APIs are protected based on the authenticated user's role.

Administrator-only operations include:

- Create product
- Edit product
- View all customer orders

Customer operations include:

- Cart management
- Place order
- View own orders

Authorization is enforced at the backend level rather than relying only on frontend visibility.

---

# Product APIs

The backend provides APIs for product management.

Product information includes:

- Product ID
- Product name
- Description
- Category
- Price
- Stock
- Image URL
- Cart status

The image is currently represented using an S3 image URL.

---

# Product Search

Product search is performed at the API/database level.

Example:

```text
GET /api/v1/products?page=1&limit=10&search=iphone
```

The backend receives the search value and performs the corresponding database query.

Search can be performed against relevant product information such as:

- Product name
- Description
- Category

---

# Product Pagination

Product pagination is handled by the backend.

The API supports:

```text
page
limit
search
```

Only 10 products are requested per page by the frontend.

Example:

```text
GET /api/v1/products?page=1&limit=10
```

Next page:

```text
GET /api/v1/products?page=2&limit=10
```

The backend applies the pagination values directly to the database query.

---

# Product Cart Status

The product listing API also determines whether a product is already present in the authenticated user's cart.

The API returns:

```text
is_in_cart
```

Example:

```json
{
  "id": 1,
  "name": "iPhone 16",
  "price": 79999,
  "is_in_cart": 1
}
```

The value represents:

```text
0 = Product is not in the user's cart

1 = Product is already in the user's cart
```

This allows the frontend to display:

```text
Add to Cart
```

or:

```text
Remove from Cart
```

without maintaining a separate cart-state calculation on the frontend.

---

# Product Management

Administrators can create and update products.

Product information includes:

```text
Name
Description
Category
Price
Stock
Image URL
```

The category is stored directly as a string value.

The backend receives the category name from the frontend rather than using a separate category ID.

---

# Shopping Cart APIs

The backend provides APIs for managing customer carts.

Major cart operations include:

- Add product to cart
- Remove product from cart
- Retrieve cart items

Cart operations are associated with the authenticated user.

The backend identifies the current user using the authenticated JWT information.

---

# Cart Data

Cart information includes:

- Product
- Product image
- Product name
- Unit price
- Quantity
- Total price

The backend provides the required data for the frontend Cart page and cart summary.

---

# Remove From Cart

The remove-cart operation receives the product ID from the frontend.

The backend identifies the authenticated user's active cart and removes the corresponding product from that cart.

The cart state is then refreshed by the frontend.

---

# Order APIs

The backend provides APIs for order management.

Customers can:

- Place orders
- View their own orders

Administrators can:

- View all customer orders
- View customer information
- View ordered products
- View order amounts

---

# Customer Orders

Customer order APIs return only the authenticated user's orders.

The backend identifies the user from the authenticated request.

This prevents a customer from accessing another customer's order information.

Customer order information includes:

- Order details
- Product information
- Quantity
- Price
- Total amount
- Order date

---

# Administrator Orders

Administrator order APIs provide access to all customer orders.

The response can contain:

- Customer information
- Product information
- Quantity
- Unit price
- Total price
- Order information

Access is restricted to administrators through backend authorization.

---

# Order Search and Pagination

Order listing APIs support:

- Search
- Pagination
- Page size

The frontend sends the search and pagination values to the backend.

Example:

```text
GET /api/v1/orders?page=1&limit=10&search=iphone
```

The backend performs the search and pagination at database level.

---

# Database

The backend uses **MySQL** as the primary database.

The database stores application information such as:

- Users
- Products
- Carts
- Cart items
- Orders
- Order items

Database communication is handled through the repository layer.

---

# Repository Layer

Database queries are kept inside repositories.

The repository layer is responsible for:

- Executing MySQL queries
- Reading database records
- Creating records
- Updating records
- Removing cart records
- Retrieving paginated data
- Retrieving filtered data

The service layer communicates with repositories instead of directly handling database queries.

---

# Service Layer

The service layer contains the main application logic.

Examples include:

- Authentication processing
- Product operations
- Cart operations
- Order operations
- Validation and business rules

The general flow is:

```text
Controller
    |
    v
Service
    |
    v
Repository
    |
    v
MySQL
```

---

# API Error Handling

The backend handles API failures and returns appropriate HTTP responses to the frontend.

The frontend can then display the corresponding error state.

Typical API flow:

```text
Request
   |
   v
Validation
   |
   +---- Invalid
   |       |
   |       v
   |    Error Response
   |
   +---- Valid
           |
           v
        Business Logic
           |
           v
        Database
           |
           v
       API Response
```

---

# REST API Modules

The main API areas are:

```text
Authentication
    |
    +-- Register
    +-- Login

Products
    |
    +-- Get Products
    +-- Search Products
    +-- Paginate Products
    +-- Create Product
    +-- Update Product

Cart
    |
    +-- Get Cart
    +-- Add to Cart
    +-- Remove from Cart

Orders
    |
    +-- Place Order
    +-- Customer Orders
    +-- Admin Orders
```

---

# Backend Configuration

Environment-specific configuration is maintained through environment variables.

Typical configuration includes:

```text
Database configuration
JWT configuration
Application port
Other environment-specific settings
```

Sensitive configuration values should not be committed to source control.

---

# Running the Backend

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:4000
```

---

# Production Build

Build the TypeScript application:

```bash
npm run build
```

Start the production application:

```bash
npm start
```

---

# Docker

The backend can be built and executed as a Docker container.

Build the image:

```bash
docker build -t shopping-cart-backend .
```

Run the container:

```bash
docker run -d \
  -p 4000:4000 \
  --env-file .env \
  --name shopping-cart-backend \
  shopping-cart-backend
```

The backend is then available at:

```text
http://localhost:4000
```

---

# Backend Responsibility

The backend is responsible for:

```text
HTTP Request
     |
     v
Authentication
     |
     v
Authorization
     |
     v
Validation
     |
     v
Business Logic
     |
     v
Database Operations
     |
     v
API Response
```

The frontend does not directly access the database.

All application data is accessed through the backend REST APIs.

---

# Backend Highlights

The major backend implementation includes:

- Node.js
- Express.js
- TypeScript
- REST APIs
- JWT authentication
- Role-based authorization
- MySQL integration
- Layered architecture
- Controller layer
- Service layer
- Repository layer
- Product management
- API-level product search
- API-level product pagination
- Cart management
- Add to Cart
- Remove from Cart
- Cart status in product response
- Order placement
- Customer order management
- Administrator order management
- API-level order search
- API-level order pagination
- Docker support

---

# Backend Summary

The Shopping Cart backend provides the complete REST API layer for the application.

It handles authentication, authorization, product management, cart management, and order management while keeping database operations separated through the repository layer.

The backend is designed to work with the separate:

```text
shopping-cart-frontend
```

application through REST APIs.

For the complete end-to-end architecture, application flow, and assessment overview, refer to the root project's `README.md`.
