# Design: Address and Review Management (2026-05-11)

## Overview
This design outlines the implementation of User Address management during Checkout and Product Reviews on the Product Details page. It follows the existing Spring Boot (Backend) and React (Frontend) architecture.

## Backend Changes

### 1. Security Utilities
- Enhance `UserService` or create a `SecurityUtils` to provide the `getCurrentUser()` method using `SecurityContextHolder`.

### 2. Address Management
- **Model**: `Address.java` (already exists, linked to `User`).
- **Service (`AddressService.java`)**:
    - `getAddressesByCurrentUser()`: Fetch addresses for the authenticated user.
    - `saveAddress(Address, User)`: Save address and associate with user.
    - `deleteAddress(Long id, User)`: Delete only if it belongs to the user.
- **Controller (`AddressController.java`)**:
    - `GET /api/addresses/my`: Returns current user's addresses.
    - `POST /api/addresses`: Accepts address data, links to current user.
    - `DELETE /api/addresses/{id}`: Validates ownership before deletion.

### 3. Review Management
- **Model**: `Review.java` (already exists, linked to `User` and `Product`).
- **Service (`ReviewService.java`)**:
    - `getReviewsByProduct(Long productId)`: Fetch all reviews for a product.
    - `addReview(Review, Long productId, User)`: Save review with product and user association.
    - `deleteReview(Long id, User)`: Delete only if it belongs to the user.
- **Controller (`ReviewController.java`)**:
    - `GET /api/reviews/product/{productId}`: Publicly accessible.
    - `POST /api/reviews`: Requires authentication.
    - `DELETE /api/reviews/{id}`: Validates ownership before deletion.

## Frontend Changes

### 1. Service Layer
- `frontend/src/services/addressService.js`:
    - `getMyAddresses()`
    - `addAddress(data)`
    - `deleteAddress(id)`
- `frontend/src/services/reviewService.js`:
    - `getProductReviews(productId)`
    - `addReview(data)`
    - `deleteReview(id)`

### 2. UI Components
- **Product Details (`ProductDetails.jsx`)**:
    - Add a "Reviews" section.
    - Component to display list of reviews (User, Rating, Comment, Date).
    - Form to add a review (Star rating, Comment text) - visible only if `isLoggedIn`.
    - Delete button for user's own reviews.
- **Checkout (`Checkout.jsx`)**:
    - Address selection grid for saved addresses.
    - "Add New Address" form/modal.
    - Integration with `orderService` to include the selected address.

## Success Criteria
- Users can add multiple addresses during checkout and select one.
- Users can see all reviews for a product.
- Logged-in users can leave a review (rating + comment).
- Users can delete their own reviews and addresses.
- Ownership is verified on the backend for all DELETE/UPDATE operations.
