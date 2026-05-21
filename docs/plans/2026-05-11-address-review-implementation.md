# Address and Review Management Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Enable users to manage addresses during checkout and leave reviews on product pages with full backend security.

**Architecture:** Enhancing existing Spring Boot controllers with security context awareness and building React services/components for the UI. Following the Controller -> Service -> Repository pattern.

**Tech Stack:** Java, Spring Boot, Spring Security, React, Axios, TailwindCSS (for styling as per project).

---

### Task 1: Backend - Secure Address Management

**Files:**
- Modify: `backend/src/main/java/com/example/backend/service/AddressService.java`
- Modify: `backend/src/main/java/com/example/backend/controller/AddressController.java`
- Modify: `backend/src/main/java/com/example/backend/repository/AddressRepository.java`

**Step 1: Add Query Method to AddressRepository**
```java
// backend/src/main/java/com/example/backend/repository/AddressRepository.java
List<Address> findByUserEmail(String email);
```

**Step 2: Update AddressService Logic**
Implement methods to save with user association and fetch by email.

**Step 3: Update AddressController**
Add `/api/addresses/my` and update `POST` to use `Principal` or `SecurityContext`.

**Step 4: Verify with Curl**
`curl -X GET http://localhost:8080/api/addresses/my -H "Authorization: Bearer <TOKEN>"`

---

### Task 2: Backend - Secure Review Management

**Files:**
- Modify: `backend/src/main/java/com/example/backend/service/ReviewService.java`
- Modify: `backend/src/main/java/com/example/backend/controller/ReviewController.java`
- Modify: `backend/src/main/java/com/example/backend/repository/ReviewRepository.java`

**Step 1: Add Query Method to ReviewRepository**
```java
// backend/src/main/java/com/example/backend/repository/ReviewRepository.java
List<Review> findByProductId(Long productId);
```

**Step 2: Update ReviewService**
Implement `saveReview` with auto-date and user association.

**Step 3: Update ReviewController**
Expose `GET /api/reviews/product/{productId}` (public) and secure others.

---

### Task 3: Frontend - Address Service & Checkout Integration

**Files:**
- Create: `frontend/src/services/addressService.js`
- Modify: `frontend/src/pages/Checkout.jsx`

**Step 1: Implement addressService.js**
Follow the pattern in `productService.js`.

**Step 2: Update Checkout.jsx UI**
Add address selection cards and "Add Address" modal/form.

---

### Task 4: Frontend - Review Service & Product UI

**Files:**
- Create: `frontend/src/services/reviewService.js`
- Modify: `frontend/src/pages/ProductDetails.jsx`

**Step 1: Implement reviewService.js**
Methods for `getReviews(id)` and `submitReview(data)`.

**Step 2: Update ProductDetails.jsx**
Add the review list and submission form with star rating.
