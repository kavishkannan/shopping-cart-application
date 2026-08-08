````markdown
# Shopping Cart Application

A full-stack Shopping Cart application developed as an assessment project using Vue 3, TypeScript, Vuetify, Node.js, Express.js, and MySQL.

The application provides complete customer and administrator workflows covering authentication, product management, shopping cart management, and order management.

---

## Project Overview

The project is organized into two separate applications:

- `shopping-cart-frontend` - Vue 3 frontend application
- `shopping-cart-backend` - Node.js REST API backend

The frontend communicates with the backend through REST APIs.

The backend handles authentication, authorization, business logic, database operations, product management, cart management, and order processing.

```text
                         SHOPPING CART APPLICATION
                                  |
                 +----------------+----------------+
                 |                                 |
                 v                                 v
       SHOPPING-CART-FRONTEND              SHOPPING-CART-BACKEND
                 |                                 |
                 |          REST APIs              |
                 +-------------------------------->+
                                                   |
                                                   v
                                               MySQL
````

---

# Main Features

The application provides the following features:

* User registration
* User login
* JWT authentication
* Protected routes
* Role-based authorization
* Customer workflow
* Administrator workflow
* Dashboard
* Product listing
* Product search
* API-level pagination
* Search debounce
* Product creation
* Product editing
* S3 image URL support
* Add to cart
* Remove from cart
* Cart summary
* Order placement
* Customer order history
* Administrator order management
* Loading states
* Error states
* Empty states
* Responsive UI
* Docker support

---

# User Roles

The application supports two user roles.

## Customer

Customers can:

* Register
* Login
* Access the dashboard
* View products
* Search products
* Navigate through paginated products
* Add products to cart
* Remove products from cart
* View their cart
* Review cart summary
* Place orders
* View their own orders

## Administrator

Administrators can:

* Login
* Access the dashboard
* View products
* Search products
* Navigate through paginated products
* Create products
* Edit products
* View all customer orders
* View customer and order information

Administrator-only functionality is protected at both the frontend and backend levels.

---

# Application Flow

The complete application flow is:

```text
                         Application
                              |
                              v
                     Login / Register
                              |
                              v
                      Authentication
                              |
                              v
                          Dashboard
                              |
                 +------------+------------+
                 |                         |
                 v                         v
             Customer                   Admin
                 |                         |
                 v                         v
             Products                  Products
                 |                         |
                 |                         +----> Create Product
                 |                         |
                 |                         +----> Edit Product
                 |
                 +----> Search
                 |
                 +----> Pagination
                 |
                 v
             Add to Cart
                 |
                 v
                Cart
                 |
                 +----> Remove Product
                 |
                 +----> Cart Summary
                 |
                 v
            Place Order
                 |
                 v
               Orders
                 |
                 +----> Customer: Own Orders
                 |
                 +----> Admin: All Orders
```

---

# Authentication Flow

Authentication is implemented using JWT.

The login flow is:

```text
User
 |
 | Login credentials
 v
Frontend
 |
 | Login API
 v
Backend
 |
 | Validate credentials
 v
Generate JWT
 |
 v
Frontend
 |
 | Store authentication state
 v
Authenticated Application
```

After successful login:

1. The backend validates the credentials.
2. A JWT token is generated.
3. The authentication information is maintained by the frontend.
4. Protected API requests use the authenticated user's token.
5. The user's role determines access to role-specific functionality.

---

# Route Protection

Protected frontend routes use route guards.

```text
User requests protected page
             |
             v
      Authentication check
             |
        +----+----+
        |         |
       No        Yes
        |         |
        v         v
      Login    Requested Page
```

If the user is not authenticated, the application redirects the user to the login page.

If the user is authenticated, the requested protected page is displayed.

---

# Role-Based Authorization

The application separates customer and administrator functionality.

```text
                     Authenticated User
                            |
                 +----------+----------+
                 |                     |
              Customer               Admin
                 |                     |
                 v                     v
        Customer Features       Admin Features
```

Examples of administrator-only functionality:

* Create product
* Edit product
* View all orders

Customer-specific functionality includes:

* Cart
* Place order
* View own orders

Role validation is handled on the backend for API security, while the frontend uses the role to display the appropriate UI options.

---

# Product Flow

The product page provides product browsing functionality for authenticated users.

Each product can display:

* Product image
* Product name
* Description
* Category
* Price
* Stock
* Cart status

The product image is represented using an S3 image URL.

The product page supports:

* Search
* Pagination
* Loading state
* Error state
* Empty state
* Responsive product cards

---

# API-Level Product Search

Product searching is performed by the backend rather than filtering the complete product list in the browser.

Example:

```text
GET /api/v1/products?page=1&limit=10&search=iphone
```

The backend receives the search value and performs the database query.

This keeps search processing at the API/database level.

---

# API-Level Pagination

Product pagination is also handled by the backend.

The application requests a maximum of 10 products per request.

Example:

```text
GET /api/v1/products?page=1&limit=10
```

Next page:

```text
GET /api/v1/products?page=2&limit=10
```

The frontend displays the returned products and provides pagination controls for navigating between pages.

---

# Search Debounce

The product search field uses debounce behavior.

The frontend waits briefly after the user stops typing before sending the search request.

```text
User types
    |
    +-- i
    +-- ip
    +-- iph
    +-- ipho
    +-- iphone
            |
            v
         Debounce
            |
            v
      API Request
```

This prevents unnecessary API requests for every individual keystroke.

---

# Product Cart Status

The product API returns the cart status for the authenticated user.

Example:

```json
{
  "id": 1,
  "name": "iPhone 16",
  "price": 79999,
  "is_in_cart": 1
}
```

The `is_in_cart` value determines the action displayed on the product card.

```text
is_in_cart = 0
        |
        v
   Add to Cart


is_in_cart = 1
        |
        v
 Remove from Cart
```

After a cart operation, the product API is called again so the latest cart status is reflected on the product page.

---

# Product Management

Administrators can create and edit products.

The product form supports:

* Product name
* Description
* Category
* Price
* Stock
* Image URL

The product creation and editing functionality uses a reusable product dialog.

When editing a product:

```text
Edit Product
     |
     v
Open Product Dialog
     |
     v
Load Existing Product Data
     |
     v
Update Product
     |
     v
Refresh Product List
```

---

# Product Categories

Product categories are maintained as local dropdown values in the frontend.

The category is stored as a string value in the backend.

Examples include:

```text
Electronics
Gadgets
Grocery
Books
Home Appliances
Clothing
Sports
Beauty
Furniture
Accessories
```

The selected category name is sent directly to the API.

---

# Shopping Cart Flow

Customers can add products to their cart from the product page.

```text
Products
    |
    v
Add to Cart
    |
    v
Cart
    |
    +---- Product Image
    +---- Product Name
    +---- Unit Price
    +---- Quantity
    +---- Total Price
    +---- Remove
```

The cart page also provides an order summary.

---

# Cart Summary

The cart page is divided into two main sections.

```text
+-------------------------------+-------------------------------+
|                               |                               |
|          Cart Items           |        Order Summary          |
|                               |                               |
|  Product Image                |  Total Items                  |
|  Product Name                 |  Subtotal                     |
|  Unit Price                   |  Total                        |
|  Quantity                     |                               |
|  Total Price                  |  Place Your Order             |
|  Remove                       |                               |
|                               |                               |
+-------------------------------+-------------------------------+
```

The customer can review the cart and place the order from the summary section.

---

# Order Flow

After the customer places an order, the order is created through the backend.

```text
Cart
 |
 | Place Order
 v
Backend
 |
 | Create Order
 v
Database
 |
 v
Order Created
 |
 v
Orders Page
```

---

# Customer Orders

Customers can view their own orders.

The customer order page displays relevant information such as:

* Order details
* Ordered products
* Order amount

Customers can only access their own order information.

---

# Administrator Orders

Administrators can view all customer orders.

The administrator order page provides information such as:

* Customer information
* Ordered products
* Order details
* Order amount

The orders module uses the authenticated user's role to determine which order view is displayed.

---

# Frontend and Backend Communication

The frontend communicates with the backend through REST APIs.

The general request flow is:

```text
Frontend
   |
   | HTTP Request
   v
Backend Route
   |
   v
Middleware
   |
   v
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

The response follows the reverse path:

```text
MySQL
   |
   v
Repository
   |
   v
Service
   |
   v
Controller
   |
   v
Frontend
```

---

# Backend Architecture

The backend follows a layered architecture.

```text
Request
   |
   v
Routes
   |
   v
Middleware
   |
   v
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

### Routes

Defines API endpoints and applies required middleware.

### Middleware

Handles common request processing such as:

* JWT authentication
* Authorization
* Request validation where required

### Controllers

Responsible for:

* Reading HTTP requests
* Reading request parameters
* Reading request bodies
* Calling services
* Returning HTTP responses

### Services

Contains application and business logic.

### Repositories

Handles database queries and database interaction.

### MySQL

Stores the application data.

---

# Frontend Architecture

The frontend uses Vue 3 with TypeScript and follows a component-based structure.

The application separates routing views from reusable components.

```text
shopping-cart-frontend/
│
├── src/
│   ├── components/
│   ├── views/
│   ├── layouts/
│   ├── services/
│   ├── stores/
│   ├── router/
│   ├── types/
│   └── constants/
│
├── Dockerfile
├── .dockerignore
├── package.json
└── README.md
```

Views are primarily responsible for routing-level page composition.

Reusable page functionality is implemented inside components.

---

# API Service

The frontend uses a common API service for HTTP communication.

Instead of creating separate HTTP service files for every feature, common request methods are centralized.

The API service provides reusable methods for:

```text
GET
POST
PUT
DELETE
```

This keeps API communication consistent throughout the application.

---

# Global State Management

Pinia is used for global application state.

A single global store is used for application-wide information.

The store contains information such as:

* Current user
* User role
* JWT token
* Authentication state

Feature-specific data such as products, cart items, and orders is maintained within the respective components rather than being stored unnecessarily in the global store.

---

# Responsive Design

The application is designed to work across:

* Desktop
* Tablet
* Mobile

The main layout provides:

* Fixed application header
* Responsive navigation
* Mobile menu toggle
* Responsive product cards
* Responsive cart layout
* Responsive order pages
* Responsive dialogs

The frontend uses Vuetify components and responsive layout features.

---

# Application States

The application handles common UI states throughout the main modules.

## Loading State

Displayed while waiting for API responses.

## Error State

Displayed when an API request fails.

## Empty State

Displayed when there is no data to show.

For example, the product page handles:

```text
API Request
    |
    +---- Loading
    |
    +---- Success
    |       |
    |       +---- Products
    |
    +---- Empty
    |
    +---- Error
```

---

# Technology Stack

## Frontend

* Vue 3
* TypeScript
* Vuetify
* Pinia
* Vue Router
* Vite

## Backend

* Node.js
* Express.js
* TypeScript
* REST APIs
* JWT
* MySQL

## Infrastructure

* Docker
* Docker Desktop
* Amazon S3 image URLs

---

# Project Structure

```text
Shopping_Cart/
│
├── README.md
│
├── shopping-cart-frontend/
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   └── README.md
│
└── shopping-cart-backend/
    ├── src/
    │   ├── controllers/
    │   ├── middlewares/
    │   ├── repositories/
    │   ├── routes/
    │   ├── services/
    │   ├── types/
    │   └── constants/
    │
    ├── Dockerfile
    ├── .dockerignore
    ├── package.json
    └── README.md
```

---

# Running the Application Locally

The frontend and backend are maintained as separate applications.

## Backend

Open a terminal:

```bash
cd shopping-cart-backend
npm install
npm run dev
```

The backend runs on:

```text
http://localhost:4000
```

The backend requires the configured MySQL database and environment variables.

---

## Frontend

Open another terminal:

```bash
cd shopping-cart-frontend
npm install
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

---

# Production Build

## Frontend

```bash
cd shopping-cart-frontend
npm install
npm run build
```

## Backend

```bash
cd shopping-cart-backend
npm install
npm run build
```

---

# Docker Setup

Both applications can be containerized independently.

## Frontend Docker

From the frontend directory:

```bash
docker build -t shopping-cart-frontend .
```

Run the container:

```bash
docker run -d -p 5173:80 --name shopping-cart-frontend shopping-cart-frontend
```

Frontend:

```text
http://localhost:5173
```

---

## Backend Docker

From the backend directory:

```bash
docker build -t shopping-cart-backend .
```

Run the container:

```bash
docker run -d -p 4000:4000 --env-file .env --name shopping-cart-backend shopping-cart-backend
```

Backend:

```text
http://localhost:4000
```

---

# Docker Architecture

```text
                         Docker Desktop
                              |
                +-------------+-------------+
                |                           |
                v                           v
       Frontend Container           Backend Container
       Vue + Nginx                  Node + Express
       Port 5173                    Port 4000
                |                           |
                |       REST API            |
                +-------------------------->|
                                            |
                                            v
                                      MySQL Database
```

---

# End-to-End Assessment Flow

## Customer

```text
Register
   ↓
Login
   ↓
Dashboard
   ↓
Products
   ↓
Search Products
   ↓
Pagination
   ↓
Add Product to Cart
   ↓
Go to Cart
   ↓
Review Cart
   ↓
Place Order
   ↓
My Orders
```

## Administrator

```text
Login
   ↓
Dashboard
   ↓
Products
   ↓
Search Products
   ↓
Pagination
   ↓
Create Product
   ↓
Edit Product
   ↓
All Orders
   ↓
View Customer Order Details
```

---

# Assessment Coverage

| Feature            | Customer | Admin |
| ------------------ | :------: | :---: |
| Registration       |    Yes   |   -   |
| Login              |    Yes   |  Yes  |
| JWT Authentication |    Yes   |  Yes  |
| Route Protection   |    Yes   |  Yes  |
| Dashboard          |    Yes   |  Yes  |
| View Products      |    Yes   |  Yes  |
| Product Search     |    Yes   |  Yes  |
| Product Pagination |    Yes   |  Yes  |
| Add Product        |    No    |  Yes  |
| Edit Product       |    No    |  Yes  |
| Add to Cart        |    Yes   |   -   |
| Remove from Cart   |    Yes   |   -   |
| View Cart          |    Yes   |   -   |
| Place Order        |    Yes   |   -   |
| View Own Orders    |    Yes   |   -   |
| View All Orders    |    No    |  Yes  |
| Responsive UI      |    Yes   |  Yes  |

---

# Key Implementation Highlights

### Authentication

JWT-based authentication with protected routes and role-based access.

### Product Search

Search is performed at the API/database level rather than filtering the complete dataset on the frontend.

### Pagination

Products are retrieved in pages with a maximum of 10 products per request.

### Cart State

The product API returns the `is_in_cart` status for the authenticated user so the frontend can display the correct cart action.

### Product Management

Administrators use a reusable product dialog for both creating and editing products.

### Order Management

Customers can view their own orders while administrators can view all orders.

### Responsive UI

The application is responsive across desktop, tablet, and mobile screen sizes.

### Docker

Both frontend and backend applications can be built and run independently using Docker Desktop.

---

# Conclusion

The Shopping Cart application provides a complete end-to-end shopping workflow with separate customer and administrator capabilities.

The project demonstrates:

* Modern Vue 3 development with TypeScript
* Component-based frontend architecture
* REST API integration
* JWT authentication
* Role-based authorization
* API-level search and pagination
* Product management
* Shopping cart management
* Order management
* MySQL database integration
* Responsive UI development
* Layered backend architecture
* Docker containerization

The root repository provides the complete application, while the frontend and backend are maintained as separate projects with their own implementation details and documentation.
