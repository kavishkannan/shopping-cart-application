# Shopping Cart - Frontend

The frontend application for the Shopping Cart project, built using **Vue 3, TypeScript, Vuetify, Pinia, Vue Router, and Vite**.

This application provides the complete user interface for both **Customer** and **Administrator** workflows. It communicates with the Shopping Cart backend through REST APIs.

---

## What This Frontend Contains

The frontend contains the complete UI for:

- Authentication
- Dashboard
- Product management
- Shopping cart
- Order management
- User navigation
- Role-based UI
- Responsive layouts

The application provides different features and navigation options based on the logged-in user's role.

---

## Technology Stack

- **Vue 3** - Frontend framework
- **TypeScript** - Type-safe development
- **Vuetify** - UI component framework
- **Pinia** - Global state management
- **Vue Router** - Application routing
- **Vite** - Development server and build tool
- **Docker** - Containerized deployment

---

## Main UI Modules

### Authentication

The frontend provides:

- Login page
- Registration page
- Form validation
- Authentication handling
- Protected application routes
- Logout functionality

After successful login, the user is redirected to the Dashboard.

---

### Dashboard

The Dashboard is the main landing page after authentication.

It is integrated with the common application layout and provides navigation to the available application modules.

---

### Products

The Products page provides the main product browsing interface.

Each product is displayed as a responsive card containing:

- Product image
- Product name
- Description
- Price
- Add to Cart / Remove from Cart action

The page also provides:

- Product search
- API-level pagination
- 10 products per request
- Search debounce
- Loading state
- Error state
- Empty state

---

### Product Management

Administrators can manage products through the frontend.

Admin users can:

- Add products
- Edit products

The product form is implemented using a reusable dialog.

The dialog supports:

- Product name
- Description
- Category
- Price
- Stock
- Image URL

The same dialog is reused for both creating and editing products.

---

### Product Categories

Product categories are provided through a local dropdown.

Examples include:

- Electronics
- Gadgets
- Grocery
- Books
- Home Appliances
- Clothing
- Sports
- Beauty
- Furniture
- Accessories

The selected category name is sent directly to the backend.

---

### Shopping Cart

The Cart page is available to customers.

It displays:

- Product image
- Product name
- Unit price
- Quantity
- Total price
- Remove action

The page also provides an Order Summary containing:

- Total items
- Subtotal
- Total
- Place Your Order button

---

### Orders

The Orders module provides different UI experiences based on the user's role.

#### Customer

Customers can view their own orders.

#### Administrator

Administrators can view all customer orders.

Both order pages support:

- Search
- API-level pagination
- Loading state
- Error state
- Empty state

---

## Application Layout

Authenticated pages use a common application layout.

The layout contains:

- Application header
- Shopping Cart branding
- User profile menu
- Logout option
- Navigation drawer
- Responsive menu

### Customer Navigation

```text
Dashboard
Products
My Cart
My Orders
```

### Administrator Navigation

```text
Dashboard
Products
All Orders
```

The navigation automatically adapts based on the user's role.

---

## Responsive UI

The frontend is designed to work across:

- Desktop
- Laptop
- Tablet
- Mobile

Responsive behavior is implemented for:

- Application header
- Navigation drawer
- Dashboard
- Product cards
- Product dialogs
- Cart
- Order pages
- Search controls
- Pagination

On smaller screens, the navigation drawer changes to a mobile-friendly menu.

---

## Frontend Structure

The frontend follows a simple component-based structure.

```text
src/
│
├── assets/
│
├── components/
│   ├── login/
│   ├── register/
│   ├── products/
│   ├── cart/
│   ├── orders/
│   └── dialogues/
│
├── layouts/
│   └── MainLayout.vue
│
├── views/
│
├── services/
│   └── api.service.ts
│
├── stores/
│   └── store.ts
│
├── router/
│
├── types/
│
└── constants/
```

### Views

Views are mainly used for routing-level page composition.

### Components

Reusable UI and page functionality are implemented inside components.

### Layout

`MainLayout.vue` contains the common authenticated application layout.

### Services

`api.service.ts` provides reusable HTTP methods for communicating with the backend.

### Store

`store.ts` contains global application state such as:

- User information
- User role
- JWT token
- Authentication state

---

## API Integration

The frontend uses a common API service for backend communication.

The service provides reusable methods for:

```text
GET
POST
PUT
DELETE
```

The UI components use this service to communicate with the backend APIs.

Search and pagination for products and orders are handled through API requests rather than filtering large datasets entirely on the frontend.

---

## Authentication State

Pinia is used to maintain global authentication-related state.

The global store contains information required across the application, including:

- Logged-in user
- User role
- JWT token
- Authentication status

Feature-specific data remains within the relevant components.

---

## Product Cart Status

The Products page uses the cart status returned by the backend.

```text
is_in_cart = 0
    ↓
Add to Cart

is_in_cart = 1
    ↓
Remove from Cart
```

After a cart operation, the product data is refreshed so the latest cart status is displayed.

---

## UI States

The major frontend pages handle:

### Loading

Displays a loading indicator while API requests are in progress.

### Error

Displays an appropriate error message when an API request fails.

### Empty

Displays an empty state when there are no products, cart items, or orders available.

---

## Running the Frontend

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

---

## Production Build

Create the production build:

```bash
npm run build
```

The production files are generated in the:

```text
dist/
```

directory.

---

## Docker

The frontend can be built and run as a Docker container.

Build the image:

```bash
docker build -t shopping-cart-frontend .
```

Run the container:

```bash
docker run -d \
  -p 5173:80 \
  --name shopping-cart-frontend \
  shopping-cart-frontend
```

The application can then be accessed at:

```text
http://localhost:5173
```

---

## Frontend Summary

The Shopping Cart frontend provides a complete responsive UI for the application.

The major frontend functionality includes:

- Vue 3 + TypeScript
- Vuetify UI
- Customer and Admin interfaces
- Login and Registration
- Protected routes
- Responsive Main Layout
- Product listing
- Product search
- API pagination
- Search debounce
- Admin product creation
- Admin product editing
- Shopping cart
- Cart summary
- Order placement
- Customer orders
- Admin orders
- Loading, error, and empty states
- Centralized API service
- Global authentication state
- Docker support

For the complete application architecture, backend flow, database, API flow, authentication design, and end-to-end assessment workflow, refer to the root project `README.md`.
