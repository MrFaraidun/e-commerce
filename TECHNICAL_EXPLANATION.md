# 🏛️ The Ultimate E-Commerce Technical Manual

This is the definitive guide to your project. It covers every model, field, relationship, and logic path in full detail.

---

## 1. The Database Architecture (Entity Deep Dive)

We use **JPA (Java Persistence API)** with **Hibernate** to map Java classes to MySQL tables.

### 👤 User Model

- **Fields**: `id`, `username`, `email`, `password`, `role`.
- **Security**: The `password` field uses `@JsonProperty(access = Access.WRITE_ONLY)` to ensure it is never leaked in API responses.
- **Relationships**:
  - `addresses`: `@OneToMany` (A user can have multiple shipping addresses).
  - `orders`: `@OneToMany` (History of all purchases).
  - `reviews`: `@OneToMany` (All feedback left by the user).
  - `wishlist`: `@OneToMany` (Saved items).

### 📦 Product Model

- **Fields**: `id`, `name`, `description`, `price`, `imageUrl`.
- **Relationships**:
  - `category`: `@ManyToOne` (Linked to a specific category like 'Electronics').
  - `reviews`: `@OneToMany` (Customer feedback for this specific product).

### 📑 Category Model

- **Fields**: `id`, `name`, `icon`.
- **Relationships**:
  - `products`: `@OneToMany` (A list of all products belonging to this category).

### 🛒 Order & OrderItem (The Purchase Logic)

- **Order Fields**: `id`, `status`, `totalPrice`, `orderDate`.
- **OrderItem Fields**: `id`, `quantity`, `price`.
- **The Connection**:
  - `Order` has many `OrderItems`.
  - `OrderItem` links to a specific `Product`.
  - _Teacher Tip:_ "This separation allows us to save the price at the time of purchase, even if the product price changes later."

### ⭐ Review Model

- **Fields**: `id`, `rating` (1-5), `comment`, `date`.
- **Relationships**: Linked to both `User` (who wrote it) and `Product` (what it's for).

### 📍 Address Model

- **Fields**: `street`, `city`, `state`, `zipCode`, `country`.
- **Relationships**: `@ManyToOne` with `User`.

---

## 🔗 2. Relationship Mapping Table

| From Model    | To Model         | Type | Ownership                        |
| :------------ | :--------------- | :--- | :------------------------------- |
| **User**      | **Address**      | 1:N  | User owns multiple Addresses     |
| **Product**   | **Category**     | N:1  | Many products share one Category |
| **Order**     | **User**         | N:1  | Many orders belong to one User   |
| **OrderItem** | **Order**        | N:1  | Many items belong to one Order   |
| **Review**    | **Product**      | N:1  | Many reviews for one Product     |
| **Wishlist**  | **User/Product** | N:1  | Bridge between User and Product  |

---

## 🌉 3. The "Bridge" Connections (User ↔️ Product)

In this architecture, a **User** and a **Product** are never linked directly. Instead, they "meet" through **Bridge Entities**. This allows for a clean, many-to-many relationship.

### 1. The Feedback Bridge (`Review`)

- **Logic**: A `Review` entity acts as the meeting point. It holds a `@ManyToOne` reference to a `User` (the author) and a `@ManyToOne` reference to a `Product`.
- **Why?**: This allows the same user to review many products, and the same product to be reviewed by many users.

### 2. The Interest Bridge (`Wishlist`)

- **Logic**: The `Wishlist` model stores a `userId` and a `productId`.
- **Why?**: This is a classic **Many-to-Many** pattern. It tells the system: "This user has an interest in this specific product."

### 3. The Purchase Bridge (`Order` & `OrderItem`)

- **Path**: `User` ➡️ `Order` ➡️ `OrderItem` ➡️ `Product`.
- **Logic**: This is the most critical flow. A User owns an Order, that Order contains multiple OrderItems, and each Item points back to a Product.
- **Why?**: This decouples the User from the Product, allowing us to keep a history of what was bought even if the product is deleted or its price changes.

---

## ⚙️ 4. Backend Logic (Service & Repository)

Your app follows the **DRY (Don't Repeat Yourself)** principle using three layers:

1.  **Repository Layer**: Extends `JpaRepository`. This provides **CRUD** (Create, Read, Update, Delete) without any SQL code.
2.  **Service Layer**: Where business rules live.
    - _Example:_ In `OrderService`, we automatically set the `orderDate` using `new Date()` before saving to the database.
3.  **Controller Layer**: Handles HTTP statuses (200 OK, 401 Unauthorized, etc.).

---

## 🔐 4. Security & JWT (The "Gold" Standard)

### The "Stateless" Guard

We use `JwtAuthenticationFilter`. Every time a request comes in:

1.  It checks the **Authorization Header**.
2.  It strips the "Bearer " prefix to get the raw Token.
3.  `JwtUtil` validates the cryptographic signature.
4.  `SecurityContextHolder` is updated so Spring knows the user is logged in for that specific request.

### Cross-Origin Resource Sharing (CORS)

In `SecurityConfig.java`, we allow `*` origins. This is what permits your React app (Port 5173) to talk to your Tomcat server (Port 8080).

---

## ⚛️ 5. Frontend Architecture & Contexts

### API Management (`axiosConfig.js`)

We use **Global Interceptors**. This means you never have to manually add a token to an API call. The config does it for you in the background.

### State Persistence

We use a **Hybrid Approach**:

- **React State**: For fast, reactive UI updates.
- **LocalStorage**: For data that must survive a page refresh (Cart, Token, User info).

### Context Detailed Breakdown:

- **AuthContext**: Controls the global `isAuthenticated` boolean.
- **CartContext**: Calculates `totalPrice` in real-time as you change quantities.
- **WishlistContext**: Uses **Optimistic UI**. It updates the "Heart" icon instantly and only talks to the server _afterwards_.

---

## 🔔 6. UX Intelligence (Notifications)

In the Admin Layout:

1.  The app fetches recent activity (Orders, New Users).
2.  It compares these with a "Dismissed List" in LocalStorage.
3.  If an activity is **New** and **Not Dismissed**, it generates a UI notification.
4.  _Logic:_ This simulates a real-time notification system without requiring complex WebSockets or Firebase.

---

## 🎨 7. Tech Stack Summary

- **Backend**: Spring Boot 3.x, Java 17, Spring Security, Hibernate, MySQL.
- **Frontend**: React 18, Vite, TailwindCSS, Framer Motion, Lucide Icons, Recharts.
- **Dev Tools**: Maven, Axios, Lombok (for cleaner code).

---

_Manual version 2.0 - Full Details Included._

---

## 📂 8. Frontend Modular Structure

The frontend is organized into logical "Modules" to maintain high scalability.

- **`src/api/`**: Contains the `axiosConfig.js`. This is the single source of truth for all backend communication.
- **`src/context/`**: The "Memory" of the app. Stores global data like the user's login status and shopping cart items.
- **`src/services/`**: The "Logic Workers". Each file (e.g., `productService.js`) handles the actual data fetching for a specific feature, keeping the UI components clean.
- **`src/components/`**: Small, reusable UI atoms like Navbars, Buttons, and Route Guards (`ProtectedRoute`).
- **`src/layout/`**: The "Shells". Defines how the Admin panel looks vs. the main Storefront.
- **`src/pages/`**: The "Destination". Each file here represents a full screen you see in the browser.

---

## 🛡️ 9. Backend Security Folder Deep Dive

The `/security` folder is the most critical part of your backend. It acts as a multi-layered shield.

### 📜 SecurityConfig.java (The Master Config)

- **URL Control**: Explicitly allows `/api/auth/**` and `/api/products/**` to be viewed by anyone, while forcing other requests (like `/api/admin/**`) to be authenticated.
- **Filter Injection**: It injects the `JwtAuthenticationFilter` into the Spring Security pipeline.
- **CORS Management**: It allows your React app to communicate with the server without being blocked by browser security.

### 🔑 JwtUtil.java (The Keymaker)

- **Generation**: Takes a username and signs it with a secret key to create a "Passport" (the JWT).
- **Validation**: When a user returns, it checks if the "Passport" has been tampered with or has expired.

### 👮 JwtAuthenticationFilter.java (The Gatekeeper)

- This is a `OncePerRequestFilter`. It intercepts every single request.
- If a request has a token, it asks `JwtUtil` to verify it. If valid, it "authenticates" the user inside Spring’s memory for the duration of that request.

### 🕵️ CustomUserDetailsService.java (The Verifier)

- This file connects Spring Security to your **UserRepository**.
- It fetches the user from your database and converts them into a `UserDetails` object that Spring can understand.
- **Roles**: It takes your `user.role` (ADMIN or USER) and converts it into a `GrantedAuthority` (e.g., `ROLE_ADMIN`).

---

## 📊 10. Knowledge Graph Insights (Graphify)

Using the **Graphify** knowledge layer, we can see the hidden "God Nodes" of your system:

- **`useAuth()`** is the most connected node in the frontend (17 connections), proving that security is central to your entire UI.
- **`JwtUtil`** acts as a "Bridge" between your security logic and the REST controllers.
- The system identifies **Communities** (like Auth, Order, and Product), showing a high level of modularity.

---

_Manual version 3.0 - Ultimate Detailed Edition._
