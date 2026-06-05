# Security Hardening & Production Readiness Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix the critical, high, and medium security vulnerabilities in the e-commerce codebase while preserving functionality for LAN development/deployment.

**Architecture:** 
- Restructure Spring Security configurations to reject unauthenticated callers by default.
- Mitigate mass-assignment (overposting) via dedicated registration DTOs.
- Prevent IDOR by validating owner identity dynamically inside controllers.
- Externalize all database credentials, JWT secrets, and CORS origins using environment variable injection.

**Tech Stack:** Java 21, Spring Boot 3.3.5, Spring Security, Hibernate, React 19, Axios, TailwindCSS.

---

### Task 1: Update Maven POM & Dependencies
**Files:**
- Modify: `backend/pom.xml`

**Steps:**
1. Update Spring Boot Parent Version from `4.0.6` to stable GA release `3.3.5`.
2. Add `spring-boot-starter-validation` dependency to enable server-side validation.
3. Commit.

---

### Task 2: Configure Environment Overrides and Properties
**Files:**
- Modify: `backend/src/main/resources/application.properties`

**Steps:**
1. Configure database parameters to support environment overrides (`SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`) while falling back to the current LAN settings.
2. Define a property for the JWT signing secret (`jwt.secret`) with a secure default value.
3. Define a property for allowed CORS origins (`app.cors.allowed-origins`) defaulting to all for local development.
4. Define properties for administrative seed credentials (`app.admin.email`, `app.admin.password`, `app.user.email`, `app.user.password`).
5. Set Hibernate schema management property to validate schema rather than update by default (`spring.jpa.hibernate.ddl-auto=validate`).
6. Commit.

---

### Task 3: Inject JWT Signature Secret
**Files:**
- Modify: `backend/src/main/java/com/example/backend/security/JwtUtil.java`

**Steps:**
1. Inject `jwt.secret` via `@Value` annotation.
2. Initialize the cryptographic key signature generator dynamically using `@PostConstruct`.
3. Commit.

---

### Task 4: Secure Global Filter Chain and CORS Mappings
**Files:**
- Modify: `backend/src/main/java/com/example/backend/security/SecurityConfig.java`

**Steps:**
1. Inject `app.cors.allowed-origins` into `SecurityConfig`.
2. Restrict allowed CORS origins to the configured properties.
3. Replace `.anyRequest().permitAll()` in `securityFilterChain` with `.anyRequest().authenticated()`.
4. Configure explicit permitAll matchers for public endpoints:
   - `/api/auth/**` (all methods)
   - GET `/api/products/**`
   - GET `/api/categories/**`
   - GET `/api/reviews/product/**`
5. Configure role protection:
   - `/api/users/**` -> `hasRole("ADMIN")` or custom validation.
   - POST/PUT/DELETE on `/api/products/**` -> `hasRole("ADMIN")`.
   - POST/PUT/DELETE on `/api/categories/**` -> `hasRole("ADMIN")`.
6. Commit.

---

### Task 5: Eliminate Registration Mass-Assignment
**Files:**
- Modify: `backend/src/main/java/com/example/backend/controller/AuthController.java`

**Steps:**
1. Define a `UserRegistrationDto` class with email validation constraints.
2. Update the `/register` endpoint mapping to map incoming bodies into the registration DTO instead of the direct `User` entity.
3. Programmatically set the `role` field on the persisted user record to `"USER"` strictly, preventing clients from overriding this role.
4. Commit.

---

### Task 6: Implement IDOR Checks on User Update Mappings
**Files:**
- Modify: `backend/src/main/java/com/example/backend/controller/UserController.java`

**Steps:**
1. Change `getAll` to verify the caller has the `ADMIN` role.
2. Update `update` to load the current authenticated user's profile and assert that the caller is editing their own record, or has the `ADMIN` role.
3. Commit.

---

### Task 7: Implement IDOR Checks on Orders
**Files:**
- Modify: `backend/src/main/java/com/example/backend/controller/OrderController.java`

**Steps:**
1. Update `getById`, `update`, and `delete` to load the target order from the database and verify that it belongs to the authenticated user (or that the caller holds the `ADMIN` role).
2. Commit.

---

### Task 8: Implement IDOR Checks on Shipping Addresses
**Files:**
- Modify: `backend/src/main/java/com/example/backend/controller/AddressController.java`

**Steps:**
1. Update `delete` to fetch the shipping address and assert ownership prior to executing `addressService.deleteAddress(id)`.
2. Commit.

---

### Task 9: Implement IDOR Checks on Reviews
**Files:**
- Modify: `backend/src/main/java/com/example/backend/controller/ReviewController.java`

**Steps:**
1. Update `delete` to check that the review author matches the authenticated principal.
2. Commit.

---

### Task 10: Externalize Seed User Credentials
**Files:**
- Modify: `backend/src/main/java/com/example/backend/config/DataSeeder.java`

**Steps:**
1. Inject email and password configuration settings via `@Value` values.
2. Map these settings into the seeder execution logic.
3. Commit.

---

### Task 11: Add Server-Side Input Validation constraints
**Files:**
- Modify: `backend/src/main/java/com/example/backend/model/Review.java`

**Steps:**
1. Add `@Min(1)` and `@Max(5)` on rating.
2. Add `@NotBlank` and `@Size(max = 1000)` on comments.
3. Commit.

---

### Task 12: Hide Default Credentials on Frontend Login
**Files:**
- Modify: `frontend/src/pages/Auth.jsx`

**Steps:**
1. Restrict the rendering of hardcoded demo credential blocks to development builds (`import.meta.env.DEV`).
2. Commit.
