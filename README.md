# 🛒 Full-Stack E-Commerce Platform

A professional full-stack E-Commerce web application featuring a robust Java Spring Boot backend and a modern React + Vite frontend.

---

## 🏛️ Architecture & Technologies

### Backend (`/backend`)
* **Core Framework**: Java / Spring Boot
* **Database Access**: Spring Data JPA / Hibernate
* **Database**: MySQL (configured via `application.properties`)
* **Build System**: Maven (wrapper included)
* **Design Patterns**: MVC Architecture (Controller, Service, Repository layers)
* **Security & Models**:
  * **User**: `@JsonProperty(access = Access.WRITE_ONLY)` for secure passwords.
  * **Product & Category**: Clean one-to-many relationship mapping.
  * **Order & OrderItem**: Decoupled pricing logic to preserve historical purchase prices.
  * **Review & Wishlist**: Bridge tables linking Users and Products for flexible interaction.

### Frontend (`/frontend`)
* **Framework**: React.js with Vite
* **Build Tool**: Vite (extremely fast hot module replacement)
* **Package Manager**: npm
* **Styling**: Tailwind CSS / Vanilla CSS

---

## 🚀 Getting Started

### Prerequisites
* **Java SDK 17+**
* **Node.js** (v18+ recommended)
* **MySQL Database**

### 1. Running the Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Update the MySQL database credentials in `src/main/resources/application.properties`.
3. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```

### 2. Running the Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

---

## 📑 Database Schema Details
For a deep dive into the entities, relationships (User, Product, Category, Review, Order, Address), and database design rules, refer to [TECHNICAL_EXPLANATION.md](TECHNICAL_EXPLANATION.md).
