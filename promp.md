# Ultimate Blueprint: Market Cashier System (Cyber Mint)

> **Role for AI Assistant:** You are a Senior Full-Stack Engineer. Build this system using React and Spring Boot. Follow the architecture and design guidelines strictly.

## 1. Goal & Aesthetic
Build a high-performance Market Cashier System (POS) with a **Cyber Mint** aesthetic.
- **Design Source of Truth:** All colors must use these CSS Variables in `index.css`.
```css
:root {
  --primary-mint: #00ffcc;
  --bg-deep: #0a0b10;
  --bg-surface: #161821;
  --accent-purple: #8a2be2;
  --text-main: #f8fafc;
  --text-dim: #94a3b8;
  --danger: #ff4757;
  --success: #2ed573;
  --glass-bg: rgba(255, 255, 255, 0.03);
  --glass-border: rgba(255, 255, 255, 0.08);
  --neon-glow: 0 0 20px rgba(0, 255, 204, 0.2);
}
```

## 2. Technical Architecture & Connectivity
1. **PC1 (Database):** MySQL (xampp). 
   - **MANDATORY JDBC Params:** `allowPublicKeyRetrieval=true&useSSL=false` to avoid handshake errors.
   - **Credentials:** Use a dedicated user (e.g., `site_user`) with remote access permissions.
2. **PC2 (Server):** Spring Boot (backend.war) + React (dist folder) hosted on Apache Tomcat 11.
   - **CORS:** Enable `allowed-origins=*` in `application.properties` for cross-device LAN access.
3. **PC3 (Client):** Browser accessing via LAN IP.

## 3. Detailed Data Models (7 Entities)
All models must have `Long id` as Primary Key.
1.  **User:** `username`, `password`, `fullName`, `role` (ADMIN, CASHIER).
2.  **Category:** `name`, `description`.
3.  **Product:** `name`, `sku`, `price`, `stockQuantity`, `category` (ManyToOne).
4.  **Customer:** `name`, `phone`, `email`, `loyaltyPoints`.
5.  **Supplier:** `name`, `contactPerson`, `phone`.
6.  **Transaction:** `transactionDate`, `totalAmount`, `cashier` (ManyToOne), `customer` (ManyToOne, optional).
7.  **TransactionItem:** `transaction` (ManyToOne), `product` (ManyToOne), `quantity`, `unitPrice`, `subtotal`.

## 4. Backend Implementation Best Practices
- **Secure Transaction Association:** Do NOT send `userId` from the frontend. Always use `@AuthenticationPrincipal UserDetails` in the Controller to associate the transaction with the logged-in user.
- **Relationship Linking:** When saving a Transaction with Items, manually iterate through items to set the parent Transaction reference (e.g., `item.setTransaction(transaction)`) before calling `.save()`.
- **Date Handling:** Set `transactionDate` on the server side (e.g., `new Date()`) to avoid client-side format mismatches.

## 5. Frontend & Deployment Requirements
1.  **API Pathing:** 
    - Set `baseURL` in Axios to `http://${window.location.hostname}:8080/backend/api`.
    - Do NOT hardcode `/api/` prefixes in service calls (e.g., use `api.post('/auth/login')`, not `api.post('/api/auth/login')`) to prevent double-pathing.
2.  **SPA Routing Fix:** 
    - Create `public/WEB-INF/web.xml` that redirects 404 errors to `/index.html`. This ensures browser refresh and "Back" button work correctly in Tomcat.
3.  **Aesthetics:** Use Glassmorphism, Framer Motion for smooth transitions, and ensure 100% responsiveness on mobile.

## 6. Execution Prompt for AI
> "Build a **Market Cashier System** using **Spring Boot** and **React**. 
> 
> **Connectivity:** Use `allowPublicKeyRetrieval=true` for JDBC. Set CORS to allow all for LAN testing.
> **Security:** Associate Transactions with users via `@AuthenticationPrincipal` on the backend.
> **Architecture:** Follow the three-tier model. Deploy as `ROOT` (frontend) and `backend.war` on Tomcat.
> **Routing:** Implement the `web.xml` 404-to-index fix for SPA compatibility.
> **Logic:** Ensure atomic transactions that update inventory and loyalty points simultaneously. 
> **Design:** Implement the 'Cyber Mint' theme with glassmorphism and neon accents."
