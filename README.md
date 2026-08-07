# 🛒 Shopping Cart Backend API

A scalable **Shopping Cart Backend Application** built using **Node.js**, **Express.js**, **TypeScript**, and **MySQL** following a **Three-Tier Architecture**. The application provides secure REST APIs for user authentication, product management, shopping cart operations, and order management. The project is containerized using **Docker** and is designed to support future enhancements such as **Redis Caching** and cloud deployment.

---

# 📌 Project Objective

The objective of this project is to build a production-ready backend for an e-commerce shopping cart application that follows enterprise-level coding standards and best practices.

The application provides APIs for:

- User Authentication & Authorization
- Product Management
- Shopping Cart Management
- Order Management
- Role-Based Access Control
- Dockerized Deployment

The backend is designed with maintainability, scalability, and security in mind by following a layered architecture.

---

# 🚀 Tech Stack

| Category            | Technology           |
| ------------------- | -------------------- |
| Runtime             | Node.js              |
| Language            | TypeScript           |
| Framework           | Express.js           |
| Database            | MySQL 8              |
| Authentication      | JWT (JSON Web Token) |
| Password Encryption | bcrypt               |
| Validation          | express-validator    |
| Containerization    | Docker               |
| API Testing         | Postman              |
| Version Control     | Git & GitHub         |

---

# 🏗️ Application Architecture

The project follows a **Three-Tier Architecture**, separating responsibilities into different layers.

```
                Client (Vue.js)

                       │

                REST API Requests

                       │

               Express Route Layer

                       │

              Controller Layer

                       │

               Service Layer
        (Business Logic / Validation)

                       │

             Repository Layer
        (Database Access / SQL Queries)

                       │

                   MySQL Database
```

### Layer Responsibilities

### Routes

- Define REST API endpoints.
- Apply Authentication & Authorization middleware.
- Apply request validation.
- Forward requests to Controllers.

---

### Controllers

- Receive HTTP requests.
- Extract request data.
- Call Service methods.
- Return standardized API responses.
- No business logic.

---

### Services

Contains all business logic.

Examples:

- User Registration
- Login
- Product Creation
- Cart Management
- Order Placement
- Stock Validation

---

### Repository

Responsible for database operations.

Responsibilities include:

- Executing SQL Queries
- Insert
- Update
- Delete
- Select
- Returning database results

Business logic is intentionally kept outside the Repository layer.

---

# ✨ Features

## Authentication

- User Registration
- User Login
- Password Hashing using bcrypt
- JWT Token Generation
- Protected APIs
- Role-Based Authorization

---

## Product Module

- Create Product
- Update Product
- Get Product Details
- Get Product List
- Soft Delete Product

---

## Shopping Cart

- Add Product to Cart
- Update Product Quantity
- Remove Product
- View Active Cart
- Place Order

---

## Order Module

### Customer

- View Own Orders

### Admin

- View All Customer Orders

---

## Security Features

- JWT Authentication
- Role-Based Authorization
- Password Encryption
- Request Validation
- Centralized Error Handling
- Standard API Responses

---

# 📁 Project Structure

```
shopping-cart-backend/

│

├── src/

│   ├── config/

│   ├── controllers/

│   ├── middleware/

│   ├── repositories/

│   ├── routes/

│   ├── services/

│   ├── validations/

│   ├── interfaces/

│   ├── utils/

│   ├── constants/

│   ├── app.ts

│   └── server.ts

│

├── Dockerfile

├── .env

├── package.json

├── tsconfig.json

└── README.md
```

---

# 🎯 Design Principles Followed

- Three-Tier Architecture
- Separation of Concerns
- Single Responsibility Principle (SRP)
- Reusable Services
- Modular Folder Structure
- Soft Delete Strategy
- Role-Based Authorization
- Secure Password Storage
- RESTful API Design
- TypeScript Best Practices
- Dockerized Deployment

# 🗄️ Database Design

The application uses **MySQL** as the relational database management system.

The database is designed to support a simple e-commerce shopping cart workflow while following normalization principles and maintaining clear relationships between entities.

---

# 📊 Database Tables

The application consists of the following tables:

| Table      | Description                                   |
| ---------- | --------------------------------------------- |
| users      | Stores customer and administrator information |
| products   | Stores product details                        |
| carts      | Stores active and completed shopping carts    |
| cart_items | Stores products added to a specific cart      |

---

# 📌 Entity Relationship Diagram (ER Diagram)

```

+-------------+
| users |
+-------------+
| id (PK) |
| name |
| email |
| phone |
| password |
| role |
| is_active |
| created_at |
| updated_at |
+-------------+
|
| 1
|
| M
+-------------+
| carts |
+-------------+
| id (PK) |
| user_id (FK) |
| status |
| created_at |
| updated_at |
+-------------+
|
| 1
|
| M
+----------------+
| cart_items |
+----------------+
| id (PK) |
| cart_id (FK) |
| product_id(FK) |
| quantity |
| unit_price |
| total_price |
+----------------+
|
|
| M
|
| 1
+-------------+
| products |
+-------------+
| id (PK) |
| name |
| description |
| category |
| price |
| stock |
| image_url |
| is_active |
| created_at |
| updated_at |
+-------------+

```

---

# 👤 Users Table

Stores all registered users including administrators and customers.

### Columns

| Column     | Type         | Description          |
| ---------- | ------------ | -------------------- |
| id         | INT          | Primary Key          |
| name       | VARCHAR(100) | User Name            |
| email      | VARCHAR(100) | Unique Email         |
| phone      | VARCHAR(15)  | Mobile Number        |
| password   | VARCHAR(255) | Encrypted Password   |
| role       | ENUM         | ADMIN / CUSTOMER     |
| is_active  | BOOLEAN      | Soft Delete Flag     |
| created_at | TIMESTAMP    | Record Creation Date |
| updated_at | TIMESTAMP    | Last Updated Date    |

### Notes

- Passwords are stored using **bcrypt hashing**.
- Email must be unique.
- Soft delete is implemented using **is_active**.
- Default administrator account is inserted during database initialization.

---

# 📦 Products Table

Stores all available products.

### Columns

| Column      | Type          | Description         |
| ----------- | ------------- | ------------------- |
| id          | INT           | Primary Key         |
| name        | VARCHAR(150)  | Product Name        |
| description | TEXT          | Product Description |
| category    | VARCHAR(100)  | Product Category    |
| price       | DECIMAL(10,2) | Product Price       |
| stock       | INT           | Available Stock     |
| image_url   | VARCHAR(255)  | Product Image URL   |
| is_active   | BOOLEAN       | Soft Delete Flag    |
| created_at  | TIMESTAMP     | Created Date        |
| updated_at  | TIMESTAMP     | Updated Date        |

### Notes

- Products are never permanently deleted.
- Soft delete is implemented using **is_active**.
- Stock quantity is updated after an order is placed.

---

# 🛒 Carts Table

Represents a shopping cart created by a customer.

### Columns

| Column     | Type      | Description            |
| ---------- | --------- | ---------------------- |
| id         | INT       | Primary Key            |
| user_id    | INT       | Foreign Key (users.id) |
| status     | ENUM      | ACTIVE / ORDER_PLACED  |
| created_at | TIMESTAMP | Created Date           |
| updated_at | TIMESTAMP | Updated Date           |

### Cart Lifecycle

```

ACTIVE

↓

Customer Adds Products

↓

Customer Updates Quantity

↓

Customer Removes Products

↓

Customer Places Order

↓

ORDER_PLACED

```

### Notes

- A customer can have multiple carts over time.
- Only one cart remains in **ACTIVE** status.
- After checkout, the status changes to **ORDER_PLACED**.

---

# 🛍️ Cart Items Table

Stores products associated with a shopping cart.

### Columns

| Column      | Type          | Description                    |
| ----------- | ------------- | ------------------------------ |
| id          | INT           | Primary Key                    |
| cart_id     | INT           | Foreign Key (carts.id)         |
| product_id  | INT           | Foreign Key (products.id)      |
| quantity    | INT           | Ordered Quantity               |
| unit_price  | DECIMAL(10,2) | Product Price at Purchase Time |
| total_price | DECIMAL(10,2) | quantity × unit_price          |

### Why Store unit_price?

The product price may change in the future.

Example:

```

Product Price Today

₹100

↓

Customer Places Order

↓

Price Changes

↓

₹150

```

The order should still display **₹100**, which is why the price is stored inside **cart_items** at the time the product is added to the cart.

---

# 🔗 Table Relationships

### User → Cart

```

One User

↓

Many Carts

```

Relationship:

```

users.id

↓

carts.user_id

```

---

### Cart → Cart Items

```

One Cart

↓

Many Products

```

Relationship:

```

carts.id

↓

cart_items.cart_id

```

---

### Product → Cart Items

```

One Product

↓

Many Cart Items

```

Relationship:

```

products.id

↓

cart_items.product_id

```

---

# 📌 Database Workflow

```

User Registers

↓

Login

↓

Browse Products

↓

Add Products to Cart

↓

Cart Created

↓

Cart Items Added

↓

Update Quantity

↓

Place Order

↓

Stock Reduced

↓

Cart Status Updated

↓

ORDER_PLACED

↓

Customer Views Order History

↓

Admin Views All Orders

```

---

# ✅ Database Design Highlights

- Fully normalized relational database.
- Foreign key relationships maintain data integrity.
- Soft delete implemented for users and products.
- Product price is preserved using `unit_price`.
- Inventory is updated after successful order placement.
- Simple schema suitable for small to medium-scale e-commerce applications.
- Designed to support future enhancements such as order payments, shipping, and Redis caching.

# 🔐 Authentication & Authorization

The application implements **JWT (JSON Web Token)** based authentication with **Role-Based Authorization (RBAC)** to secure all protected resources.

Every authenticated user receives a JWT token after a successful login. This token must be included in the `Authorization` header for all protected API requests.

---

# 🔑 Authentication Flow

```

User

↓

Login API

↓

Validate Email

↓

Validate Password (bcrypt)

↓

Generate JWT Token

↓

Return Token

↓

Client Stores Token

↓

Client Sends Token

↓

Authorization: Bearer <token>

↓

Protected APIs

```

---

# 🛡️ JWT Authentication

JWT is generated after a successful login.

The token contains:

```json
{
  "id": 1,
  "email": "admin@gmail.com",
  "role": "ADMIN"
}
```

The token is signed using a secret key stored inside the environment configuration.

Example:

```env
JWT_SECRET=shopping_cart_secret
```

---

# 🔒 Password Security

Passwords are **never stored in plain text**.

The application uses **bcrypt** to hash passwords before storing them in the database.

Registration Flow

```

User Password

↓

bcrypt.hash()

↓

Encrypted Password

↓

Database

```

Login Flow

```

User Password

↓

bcrypt.compare()

↓

Password Match

↓

Generate JWT

```

This ensures that user credentials remain secure even if the database is compromised.

---

# 🔑 Protected Routes

After login, every request must include the JWT token.

Example:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

The Authentication Middleware performs the following steps:

1. Reads Authorization Header
2. Extracts JWT Token
3. Verifies JWT Signature
4. Decodes User Information
5. Stores User Information in Request
6. Allows Access to Protected Routes

---

# 🔄 Authentication Middleware Flow

```

Incoming Request

↓

Authorization Header

↓

Token Present?

↓

No

↓

401 Unauthorized

↓

Yes

↓

Verify JWT

↓

Valid?

↓

No

↓

401 Unauthorized

↓

Yes

↓

Attach User

↓

req.user

↓

Next Middleware

```

---

# 👥 Role-Based Authorization

The application supports two roles.

| Role     | Permissions                      |
| -------- | -------------------------------- |
| ADMIN    | Manage Products, View All Orders |
| CUSTOMER | Manage Cart, View Own Orders     |

---

# 👤 ADMIN Permissions

An administrator can:

- Create Products
- Update Products
- Delete Products
- View All Customer Orders

---

# 👤 CUSTOMER Permissions

A customer can:

- Browse Products
- Add Products to Cart
- Update Cart
- Remove Cart Items
- Place Orders
- View Own Order History

---

# 🔐 Role Middleware

After successful authentication, the Role Middleware checks whether the authenticated user has permission to access the requested resource.

Example

```

Authenticated User

↓

Role = CUSTOMER

↓

Access Product Create API

↓

Role Middleware

↓

Requires ADMIN

↓

403 Forbidden

```

---

# 🚫 Unauthorized Responses

### Missing Token

```json
{
  "success": false,
  "statusCode": 401,
  "message": "Authorization token is required"
}
```

---

### Invalid Token

```json
{
  "success": false,
  "statusCode": 401,
  "message": "Invalid or expired token"
}
```

---

### Forbidden Access

```json
{
  "success": false,
  "statusCode": 403,
  "message": "Access denied"
}
```

---

# 🔄 Complete Request Flow

```

Client

↓

Login

↓

JWT Generated

↓

Frontend Stores Token

↓

Authorization Header

↓

Authentication Middleware

↓

Role Middleware

↓

Controller

↓

Service

↓

Repository

↓

MySQL

↓

Response

```

---

# 📌 Security Features

- JWT Authentication
- Role-Based Authorization
- Password Hashing using bcrypt
- Protected REST APIs
- Centralized Error Handling
- Request Validation
- Soft Delete Strategy
- Environment Variable Configuration

---

# 📂 Authentication Components

```

controllers/
    auth.controller.ts

services/
    auth.service.ts

repositories/
    auth.repository.ts

routes/
    auth.routes.ts

middleware/
    auth.middleware.ts
    role.middleware.ts

validations/
    auth.validation.ts

```

---

# ✅ Authentication Summary

The authentication module provides a secure mechanism for user registration, login, and API authorization. By combining JWT authentication, bcrypt password hashing, and role-based access control, the application ensures that only authenticated users can access protected resources while restricting administrative operations to authorized users.# 🔐 Authentication & Authorization

The application implements **JWT (JSON Web Token)** based authentication with **Role-Based Authorization (RBAC)** to secure all protected resources.

Every authenticated user receives a JWT token after a successful login. This token must be included in the `Authorization` header for all protected API requests.

---

# 🔑 Authentication Flow

```

User

↓

Login API

↓

Validate Email

↓

Validate Password (bcrypt)

↓

Generate JWT Token

↓

Return Token

↓

Client Stores Token

↓

Client Sends Token

↓

Authorization: Bearer <token>

↓

Protected APIs

```

---

# 🛡️ JWT Authentication

JWT is generated after a successful login.

The token contains:

```json
{
  "id": 1,
  "email": "admin@gmail.com",
  "role": "ADMIN"
}
```

The token is signed using a secret key stored inside the environment configuration.

Example:

```env
JWT_SECRET=shopping_cart_secret
```

---

# 🔒 Password Security

Passwords are **never stored in plain text**.

The application uses **bcrypt** to hash passwords before storing them in the database.

Registration Flow

```

User Password

↓

bcrypt.hash()

↓

Encrypted Password

↓

Database

```

Login Flow

```

User Password

↓

bcrypt.compare()

↓

Password Match

↓

Generate JWT

```

This ensures that user credentials remain secure even if the database is compromised.

---

# 🔑 Protected Routes

After login, every request must include the JWT token.

Example:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

The Authentication Middleware performs the following steps:

1. Reads Authorization Header
2. Extracts JWT Token
3. Verifies JWT Signature
4. Decodes User Information
5. Stores User Information in Request
6. Allows Access to Protected Routes

---

# 🔄 Authentication Middleware Flow

```

Incoming Request

↓

Authorization Header

↓

Token Present?

↓

No

↓

401 Unauthorized

↓

Yes

↓

Verify JWT

↓

Valid?

↓

No

↓

401 Unauthorized

↓

Yes

↓

Attach User

↓

req.user

↓

Next Middleware

```

---

# 👥 Role-Based Authorization

The application supports two roles.

| Role     | Permissions                      |
| -------- | -------------------------------- |
| ADMIN    | Manage Products, View All Orders |
| CUSTOMER | Manage Cart, View Own Orders     |

---

# 👤 ADMIN Permissions

An administrator can:

- Create Products
- Update Products
- Delete Products
- View All Customer Orders

---

# 👤 CUSTOMER Permissions

A customer can:

- Browse Products
- Add Products to Cart
- Update Cart
- Remove Cart Items
- Place Orders
- View Own Order History

---

# 🔐 Role Middleware

After successful authentication, the Role Middleware checks whether the authenticated user has permission to access the requested resource.

Example

```

Authenticated User

↓

Role = CUSTOMER

↓

Access Product Create API

↓

Role Middleware

↓

Requires ADMIN

↓

403 Forbidden

```

---

# 🚫 Unauthorized Responses

### Missing Token

```json
{
  "success": false,
  "statusCode": 401,
  "message": "Authorization token is required"
}
```

---

### Invalid Token

```json
{
  "success": false,
  "statusCode": 401,
  "message": "Invalid or expired token"
}
```

---

### Forbidden Access

```json
{
  "success": false,
  "statusCode": 403,
  "message": "Access denied"
}
```

---

# 🔄 Complete Request Flow

```

Client

↓

Login

↓

JWT Generated

↓

Frontend Stores Token

↓

Authorization Header

↓

Authentication Middleware

↓

Role Middleware

↓

Controller

↓

Service

↓

Repository

↓

MySQL

↓

Response

```

---

# 📌 Security Features

- JWT Authentication
- Role-Based Authorization
- Password Hashing using bcrypt
- Protected REST APIs
- Centralized Error Handling
- Request Validation
- Soft Delete Strategy
- Environment Variable Configuration

---

# 📂 Authentication Components

```

controllers/
    auth.controller.ts

services/
    auth.service.ts

repositories/
    auth.repository.ts

routes/
    auth.routes.ts

middleware/
    auth.middleware.ts
    role.middleware.ts

validations/
    auth.validation.ts

```

---

# ✅ Authentication Summary

The authentication module provides a secure mechanism for user registration, login, and API authorization. By combining JWT authentication, bcrypt password hashing, and role-based access control, the application ensures that only authenticated users can access protected resources while restricting administrative operations to authorized users.

# 🛍️ Business Modules

The Shopping Cart Backend is divided into three core business modules:

- Product Management
- Shopping Cart Management
- Order Management

Each module follows the same layered architecture:

```

Routes

↓

Controller

↓

Service

↓

Repository

↓

MySQL Database

```

This separation ensures better maintainability, scalability, and testability.

---

# 📦 Product Module

The Product module allows administrators to manage products available in the application.

## Features

- Create Product
- Get Product List
- Get Product By ID
- Update Product
- Soft Delete Product

---

## Product Flow

```

Admin Login

↓

Create Product

↓

Validation

↓

Product Service

↓

Product Repository

↓

MySQL

↓

Success Response

```

---

## Product Fields

| Field         | Description         |
| ------------- | ------------------- |
| Name          | Product Name        |
| Description   | Product Description |
| Category      | Product Category    |
| Price         | Product Price       |
| Stock         | Available Quantity  |
| Image URL     | Product Image       |
| Active Status | Soft Delete Flag    |

---

## Soft Delete Strategy

Products are never permanently deleted.

Instead,

```

Delete Product

↓

is_active = false

```

This preserves historical order data while hiding inactive products from customers.

---

# 🛒 Shopping Cart Module

The Cart module allows customers to add products before placing an order.

---

## Cart Features

- Add Product
- View Cart
- Update Quantity
- Remove Product
- Place Order

---

## Add to Cart Flow

```

Customer

↓

Select Product

↓

Check Active Cart

↓

Cart Exists?

↓

No

↓

Create Cart

↓

Yes

↓

Check Product Exists in Cart

↓

Already Exists?

↓

Yes

↓

Increase Quantity

↓

No

↓

Insert Cart Item

↓

Return Success

```

---

## Cart Update Flow

```

Customer

↓

Update Quantity

↓

Validate Stock

↓

Update Quantity

↓

Recalculate Total Price

↓

Return Success

```

---

## Remove Cart Item

```

Customer

↓

Remove Product

↓

Delete Cart Item

↓

Return Updated Cart

```

---

## Place Order Flow

```

Customer

↓

Click Place Order

↓

Validate Active Cart

↓

Validate Cart Items

↓

Reduce Product Stock

↓

Update Cart Status

↓

ORDER_PLACED

↓

Return Success

```

---

## Inventory Management

During checkout, product stock is automatically updated.

Example

```

Current Stock

20

↓

Customer Orders

3

↓

Updated Stock

17

```

This ensures inventory remains accurate after every successful order.

---

# 📦 Order Module

The Order module allows customers and administrators to view completed purchases.

---

## Customer Features

- View Own Order History

---

## Admin Features

- View All Customer Orders

---

## Order Flow

```

Customer Places Order

↓

Cart Status

↓

ORDER_PLACED

↓

Order History

↓

Customer

```

Administrator

```

Admin Login

↓

View All Orders

↓

Customer Details

↓

Ordered Products

↓

Order Date

```

---

# 📋 Customer Order Response

```json
[
  {
    "product_id": 1,
    "product_name": "iPhone 16",
    "quantity": 2,
    "unit_price": 90000,
    "total_price": 180000,
    "ordered_at": "2026-08-08T10:30:20.000Z"
  }
]
```

---

# 📋 Admin Order Response

```json
[
  {
    "customer_name": "John Doe",
    "email": "john@example.com",
    "product_name": "MacBook Air",
    "quantity": 1,
    "unit_price": 120000,
    "total_price": 120000,
    "ordered_at": "2026-08-08T11:15:00.000Z"
  }
]
```

---

# 🔄 Complete Business Workflow

```

User Registration

↓

Login

↓

JWT Token Generated

↓

Browse Products

↓

Add Products To Cart

↓

Update Cart

↓

Place Order

↓

Reduce Product Stock

↓

Update Cart Status

↓

ORDER_PLACED

↓

View Order History

```

---

# 📂 Module Structure

```

controllers/

├── auth.controller.ts

├── product.controller.ts

├── cart.controller.ts

└── order.controller.ts

services/

├── auth.service.ts

├── product.service.ts

├── cart.service.ts

└── order.service.ts

repositories/

├── auth.repository.ts

├── product.repository.ts

├── cart.repository.ts

└── order.repository.ts

routes/

├── auth.routes.ts

├── product.routes.ts

├── cart.routes.ts

└── order.routes.ts

```

---

# 🎯 Design Decisions

The business modules were designed with the following principles:

- Clear separation between business logic and database operations.
- Reusable service layer for business rules.
- Repository layer dedicated to SQL queries.
- Soft delete strategy for products.
- Inventory updates during checkout.
- Role-based access to administrative operations.
- RESTful API design with standardized responses.

---

# ✅ Module Summary

The Product, Cart, and Order modules together provide a complete shopping workflow. Customers can browse products, manage their shopping cart, place orders, and view purchase history, while administrators manage products and monitor customer orders. The modular architecture ensures scalability, maintainability, and ease of future enhancements such as payment integration, shipping management, and Redis caching.

# 🌐 REST API Documentation

The backend exposes RESTful APIs for authentication, product management, shopping cart operations, and order management.

All APIs follow a standardized JSON response format.

---

# 📋 Base URL

```

http://localhost:4000/api/v1

```

---

# 📦 Standard API Response

## Success Response

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Request processed successfully",
  "data": {}
}
```

---

## Error Response

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed"
}
```

---

# 🔐 Authentication APIs

## Register User

| Method | Endpoint       |
| ------ | -------------- |
| POST   | /auth/register |

### Request

```json
{
  "name": "John Doe",
  "email": "john@gmail.com",
  "phone": "9876543210",
  "password": "Admin@123"
}
```

---

## Login

| Method | Endpoint    |
| ------ | ----------- |
| POST   | /auth/login |

### Request

```json
{
  "email": "john@gmail.com",
  "password": "Admin@123"
}
```

### Response

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "JWT_TOKEN",
    "user": {
      "id": 1,
      "name": "John Doe",
      "role": "CUSTOMER"
    }
  }
}
```

---

# 📦 Product APIs

## Get All Products

| Method | Endpoint  | Access        |
| ------ | --------- | ------------- |
| GET    | /products | Authenticated |

---

## Get Product By Id

| Method | Endpoint      | Access        |
| ------ | ------------- | ------------- |
| GET    | /products/:id | Authenticated |

---

## Create Product

| Method | Endpoint  | Access |
| ------ | --------- | ------ |
| POST   | /products | ADMIN  |

### Request

```json
{
  "name": "iPhone 16",
  "description": "Apple Mobile",
  "category": "Electronics",
  "price": 85000,
  "stock": 15,
  "image_url": "https://sample.com/image.png"
}
```

---

## Update Product

| Method | Endpoint      | Access |
| ------ | ------------- | ------ |
| PUT    | /products/:id | ADMIN  |

---

## Delete Product

| Method | Endpoint      | Access |
| ------ | ------------- | ------ |
| DELETE | /products/:id | ADMIN  |

---

# 🛒 Cart APIs

## Add Product To Cart

| Method | Endpoint    |
| ------ | ----------- |
| POST   | /cart/items |

### Request

```json
{
  "productId": 1,
  "quantity": 2
}
```

> **Note:** After JWT authentication, the `userId` is automatically retrieved from the authenticated user (`req.user.id`).

---

## Get Active Cart

| Method | Endpoint |
| ------ | -------- |
| GET    | /cart    |

Returns all active cart items for the authenticated user.

---

## Update Quantity

| Method | Endpoint        |
| ------ | --------------- |
| PUT    | /cart/items/:id |

### Request

```json
{
  "quantity": 3
}
```

---

## Remove Cart Item

| Method | Endpoint        |
| ------ | --------------- |
| DELETE | /cart/items/:id |

---

## Place Order

| Method | Endpoint          |
| ------ | ----------------- |
| POST   | /cart/place-order |

Places the current active cart as an order.

During checkout:

- Product stock is reduced.
- Cart status changes to `ORDER_PLACED`.

---

# 📦 Order APIs

## Customer Order History

| Method | Endpoint |
| ------ | -------- |
| GET    | /orders  |

Returns only the authenticated customer's order history.

---

## Admin Order List

| Method | Endpoint    | Access |
| ------ | ----------- | ------ |
| GET    | /orders/all | ADMIN  |

Returns all customer orders.

---

# 🔒 Protected APIs

The following endpoints require a valid JWT token.

```http
Authorization: Bearer <JWT_TOKEN>
```

Protected Modules:

- Products
- Cart
- Orders

---

# 📌 HTTP Status Codes

| Status Code | Description           |
| ----------- | --------------------- |
| 200         | Success               |
| 201         | Resource Created      |
| 400         | Validation Error      |
| 401         | Unauthorized          |
| 403         | Forbidden             |
| 404         | Resource Not Found    |
| 409         | Conflict              |
| 500         | Internal Server Error |

---

# 📂 Postman Collection

All APIs have been tested using **Postman**.

The Postman collection includes:

- Authentication APIs
- Product APIs
- Cart APIs
- Order APIs

The collection can be imported directly for testing and development.

---

# ✅ API Design Highlights

- RESTful API Design
- JWT Protected Endpoints
- Role-Based Authorization
- Consistent JSON Response Structure
- Centralized Error Handling
- Request Validation
- HTTP Status Code Standards
- Modular Route Organization

# 🐳 Docker Deployment Guide

The backend application is containerized using **Docker**, allowing it to run consistently across different environments without requiring local dependency installation.

---

# 📦 Docker Architecture

```

+-----------------------------+

| Docker Container |

| |

| Node.js + Express.js |

| Shopping Cart Backend |

| |

+-----------------------------+

|

|

MySQL Database

(Local Machine)

```

> **Note:** During development, the backend runs inside a Docker container while connecting to the local MySQL instance using `host.docker.internal`.

---

# 📄 Dockerfile

The project includes a Dockerfile that performs the following steps:

1. Pulls the official Node.js image.
2. Creates the application working directory.
3. Copies the project files.
4. Installs project dependencies.
5. Builds the TypeScript project.
6. Exposes the application port.
7. Starts the production server.

---

# 📂 Dockerfile

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 4000

CMD ["npm", "run", "start"]
```

---

# ⚙️ Environment Variables

The application uses environment variables for configuration.

Example `.env`

```env
PORT=4000

DB_HOST=host.docker.internal
DB_PORT=3306
DB_NAME=shopping_cart
DB_USER=root
DB_PASS=your_password

JWT_SECRET=your_jwt_secret
```

---

# 🚀 Build Docker Image

Navigate to the project root.

```bash
docker build -t shopping-cart-backend .
```

This command builds a Docker image named:

```
shopping-cart-backend
```

---

# ▶️ Run Docker Container

```bash
docker run -d -p 4000:4000 --name shopping-cart-backend --env-file .env shopping-cart-backend
```

---

# 📋 Verify Running Container

```bash
docker ps
```

Expected Output

```
CONTAINER ID

IMAGE

shopping-cart-backend

STATUS

Up
```

---

# 📜 View Container Logs

```bash
docker logs shopping-cart-backend
```

Useful for troubleshooting startup or database connection issues.

---

# ⛔ Stop Container

```bash
docker stop shopping-cart-backend
```

---

# ▶️ Start Existing Container

```bash
docker start shopping-cart-backend
```

---

# 🗑️ Remove Container

```bash
docker rm -f shopping-cart-backend
```

---

# 🌐 Application URL

After the container starts successfully:

```
http://localhost:4000
```

API Base URL

```
http://localhost:4000/api/v1
```

---

# 💾 Database Connection

The backend connects to MySQL using the following configuration:

| Property | Value                |
| -------- | -------------------- |
| Database | MySQL                |
| Host     | host.docker.internal |
| Port     | 3306                 |

---

# 📦 Install Project (Without Docker)

Clone Repository

```bash
git clone <repository-url>
```

Install Packages

```bash
npm install
```

Run Development Server

```bash
npm run dev
```

Build Project

```bash
npm run build
```

Run Production

```bash
npm run start
```

---

# 📌 Project Features

- Node.js + Express.js
- TypeScript
- Three-Tier Architecture
- JWT Authentication
- Role-Based Authorization
- Product Management
- Shopping Cart
- Order Management
- MySQL
- Dockerized Backend
- Centralized Error Handling
- Request Validation
- Secure Password Hashing
- RESTful APIs

---

# 🚀 Future Enhancements

The application is designed to support additional enterprise features.

Planned enhancements include:

- Redis Caching
- Product Search
- Pagination
- Sorting & Filtering
- Refresh Token Authentication
- Email Notifications
- Payment Gateway Integration
- Image Upload
- Swagger API Documentation
- Unit Testing
- CI/CD Pipeline
- Cloud Deployment (AWS)

---

# 👨‍💻 Author

**Shopping Cart Backend API**

Developed using modern backend development practices with Node.js, Express.js, TypeScript, MySQL, JWT Authentication, and Docker.

Designed following scalable architecture principles suitable for enterprise web applications.
