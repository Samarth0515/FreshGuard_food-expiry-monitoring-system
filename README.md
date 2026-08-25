# 🥗 FreshGuard: Smart Food Expiry Tracker System

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.3-brightgreen.svg?logo=springboot)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21-orange.svg?logo=openjdk)](https://www.oracle.com/java/)
[![React](https://img.shields.io/badge/React-18-blue.svg?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg?logo=vite)](https://vitejs.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg?logo=mysql)](https://www.mysql.com/)
[![JWT Auth](https://img.shields.io/badge/JWT-Stateless%20Auth-red.svg?logo=jsonwebtokens)](https://jwt.io/)
[![Swagger OpenAPI](https://img.shields.io/badge/Swagger-OpenAPI%203.0-green.svg?logo=swagger)](http://localhost:8080/swagger-ui.html)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> An enterprise-grade, full-stack digital food lifecycle tracking system designed to eliminate household and commercial food wastage. Built with **Spring Boot 3 (Java 21)**, **MySQL 8**, and **React 18 (Vite)**.

---

## 📌 Academic Project Details

- **Project Title:** Smart Food Expiry Tracker System (FreshGuard)
- **Academic Year:** 2024–2025
- **Department:** Department of Computer Science and Engineering
- **Institute:** DKTE Society's Textile and Engineering Institute, Ichalkaranji *(An Empowered Autonomous Institute)*
- **University Affiliation:** Shivaji University, Kolhapur
- **Project Guides:**
  - **Prof. K. S. Kadam** *(Assistant Professor)*
  - **Prof. (Dr.) V. V. Kheradkar** *(Professor)*
- **Project Team:**
  - **Samarth Rahul Navale** (PRN: `23UCS091`)
  - **Paras Shantisagar Patil** (PRN: `23UCS096`)
  - **Pramila Siddhappa Patil** (PRN: `23UCS097`)
  - **Isha Rajendra Marathe** (PRN: `23UCS080`)

---

## 🌟 Key Features & Capabilities

### 1. 🎙️ Multi-Modal Food Intake
- **Voice Recognition Input (Speech-to-Text):** Speak naturally (*"Milk expires next Friday"*) — our NLP client parser automatically extracts product names, storage types, and calculates expiry dates.
- **Supermarket Receipt / Bill OCR Scanning:** Powered by in-browser **Tesseract.js** OCR engine with image preprocessing, candidate line item extraction, confidence scoring, and interactive batch import.
- **Live Barcode Scanner:** Real-time camera barcode scanner with local catalog lookup and automatic fallback to the global **Open Food Facts API**.
- **Manual Form Entry:** Fast entry with category presets, auto-calculated expiry dates, and quantity unit management.

### 2. 🚦 Traffic-Signal Expiry Monitoring & Automated Scheduler
- **Visual Expiry Statuses:**
  - 🟢 **Safe / Fresh:** Items with more than 3 days of shelf life remaining.
  - 🟡 **Near Expiry:** Items expiring within the next 3 days (`NEAR_EXPIRY`).
  - 🔴 **Expired:** Items that have crossed their expiration date (`EXPIRED`).
  - ⚡ **Expiring Today:** Critical amber notification banner highlighting items that must be used immediately.
- **Scheduled Background Monitor (`@Scheduled` cron `0 0 8 * * *`):** Automated daily batch processing (batch size 100) running every morning at 8:00 AM, re-evaluating statuses and generating persistent notifications.

### 3. 🍲 AI Recipe Recommendation Engine
- Transforms near-expiry items into nutritious meals before they spoil.
- Suggests tailored recipes with prep time, cook time, difficulty badge, servings, ingredient match tags, and expandable step-by-step instructions.
- One-click **"🍲 Recipe ideas"** button directly on inventory rows nearing expiry.

### 4. 👥 Role-Based Access Control (RBAC)
- **🏡 Household Users (`HOME_USER`):** Manage personal kitchen inventory (Fridge, Pantry, Freezer), receive expiration alerts, and discover waste-reduction recipes.
- **🏪 Retail Shopkeepers (`SHOPKEEPER`):** Specialized commercial inventory view focused on high-volume store pantries and batch shelf-life management (recipes tab hidden for streamlined operations).
- **🛡️ System Administrators (`ADMIN`):** Dedicated Admin Control Center to monitor platform health, manage registered users, author and publish new recipes, maintain the barcode registry, and trigger expiry checks on demand.

### 5. 🔔 Interactive Notification Bell & Drawer
- Header bell badge with real-time unread alert count.
- Dropdown preview of active warnings (`UPCOMING_EXPIRY`, `TODAY_EXPIRY`, `ALREADY_EXPIRED`).
- Mark individual alerts as read or clear all alerts with 60-second auto-polling.

---

## 🛠️ Technology Stack

| Layer | Technologies & Frameworks |
|---|---|
| **Backend** | Spring Boot 3.3.3, Java 21, Spring Data JPA, Spring Security 6, Spring Validation, JJWT (0.12.6), SpringDoc OpenAPI (Swagger 3.0), Lombok, Jackson |
| **Frontend** | React 18, Vite 5.4, React Router DOM v6, Axios, Web Speech API, Tesseract.js (v5), Bootstrap 5 Grid, Custom CSS Design System |
| **Database** | MySQL 8.0, Relational Schema with Foreign Keys, Cascades, and B-Tree Indexes |
| **External APIs** | Open Food Facts REST API (v0/product) |
| **Authentication** | Stateless JWT (HMAC-SHA256), BCrypt Password Hashing |
| **Dev Tools** | Maven, Git, VS Code, Postman |

---

## 📁 Project Directory Structure

```
Food Expiry Tracking System/
├── README.md                            # Comprehensive project documentation
│
├── backend/                             # Spring Boot 3.3.3 Backend API
│   ├── pom.xml                          # Maven dependencies & build config
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/freshguard/
│   │   │   │   ├── FreshguardApiApplication.java   # Main entry point (@EnableScheduling)
│   │   │   │   ├── config/              # SecurityConfig, CorsConfig, OpenApiConfig, AdminInitializer
│   │   │   │   ├── controller/          # AuthController, ProductController, NotificationController, RecipeController, AdminController
│   │   │   │   ├── dto/                 # Request & Response DTOs
│   │   │   │   ├── entity/              # User, Product, StorageLocation, Notification, Recipe, RecipeIngredient, BarcodeCatalog
│   │   │   │   ├── enums/               # UserType, StorageType, ExpiryStatus, InputMethod, AlertType, Difficulty
│   │   │   │   ├── exception/           # GlobalExceptionHandler, Custom Exceptions
│   │   │   │   ├── repository/          # Spring Data JPA Repositories
│   │   │   │   ├── security/            # JwtUtil, JwtAuthFilter, UserPrincipal, UserDetailsServiceImpl
│   │   │   │   └── service/             # AuthService, ProductService, ExpiryMonitorService, NotificationService, RecipeService, AdminService
│   │   │   └── resources/
│   │   │       ├── application.properties # DB connection, JWT secret, ports
│   │   │       ├── schema.sql           # MySQL 8 relational schema DDL
│   │   │       └── data.sql             # Recipes, Ingredients & Barcode seed data
│   └── target/
│       └── freshguard-api-1.0.0.jar     # Production runnable JAR
│
└── frontend/                            # React 18 + Vite Web Application
    ├── package.json                     # NPM packages & scripts
    ├── vite.config.js                   # Vite config with API proxy
    ├── index.html                       # Single Page App HTML template
    └── src/
        ├── assets/                      # Icons, sample bills, images
        ├── components/
        │   ├── common/                  # Modal, NotificationBell, ProtectedRoute, AdminRoute, SignalBadge
        │   ├── inventory/               # ProductTable, ProductRow, DashboardSummary, AddProductModal, BillScanModal, EntryMethodModal
        │   └── layout/                  # Navbar, Footer
        ├── context/                     # AuthContext (JWT & role state), ToastContext
        ├── pages/
        │   ├── Home/                    # SaaS landing page with live interactive status preview
        │   ├── Inventory/               # Live inventory, Expiring Today banner, Storage breakdown
        │   ├── Recipes/                 # Culinary suggestions, difficulty badges & steps accordion
        │   ├── Scanner/                 # Barcode scanner with metadata lookup & quick-add form
        │   ├── Admin/                   # Admin Control Center (Metrics, Users, Recipes, Barcodes)
        │   ├── Auth/                    # ChangePassword page
        │   ├── About/                   # Academic details, Guides & Team Members
        │   ├── Login/                   # Split-screen modern authentication
        │   ├── SignUp/                  # Split-screen role selector registration
        │   └── NotFound/                # 404 Error page
        ├── routes/                      # AppRoutes.jsx (Public, Protected & Admin routes)
        ├── services/                    # apiClient.js, authService.js, productService.js, notificationService.js, recipeService.js, adminService.js
        └── utils/                       # expiryUtils.js, date parsing & traffic signal helpers
```

---

## 🚀 Getting Started & Installation Guide

### Prerequisites
- **Java Development Kit (JDK):** Version 21 or higher (`java -version`)
- **Node.js & npm:** Version 18+ (`node -v`, `npm -v`)
- **MySQL Server:** Version 8.0+ running on port `3306`
- **Apache Maven:** Version 3.8+ (`mvn -v`)

---

### Step 1: Database Setup (MySQL)

1. Start your MySQL service (e.g. `MySQL80` on Windows).
2. Open MySQL Command Line or MySQL Workbench and run:
   ```sql
   CREATE DATABASE IF NOT EXISTS freshguard;
   ```
3. Execute the schema and seed scripts:
   ```bash
   mysql -u root -pmanager freshguard < backend/src/main/resources/schema.sql
   mysql -u root -pmanager freshguard < backend/src/main/resources/data.sql
   ```

---

### Step 2: Backend Configuration & Launch (Spring Boot)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Verify `src/main/resources/application.properties` database credentials:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/freshguard?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
   spring.datasource.username=root
   spring.datasource.password=manager
   freshguard.jwt.secret=9a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b
   ```
3. Build and package the JAR:
   ```bash
   mvn clean package -DskipTests
   ```
4. Run the Spring Boot application:
   ```bash
   java -jar target/freshguard-api-1.0.0.jar
   ```
   *The backend starts on `http://localhost:8080`.*

---

### Step 3: Frontend Setup & Launch (React + Vite)

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The frontend starts on `http://localhost:5173` with automatic API proxying to `http://localhost:8080`.*

---

## 🔑 Default Credentials & Demo Accounts

| Account Type | Member ID / Username | Password | Role | Description |
|---|---|---|---|---|
| **System Admin** | `admin` | `Admin@123` | `ADMIN` | Full control center, metrics, user management, recipe authoring |
| **Household User** | `23UCS091` | *(Register via UI)* | `HOME_USER` | Personal kitchen inventory, recipe suggestions, notifications |
| **Retail Shopkeeper**| `SHOP_001` | *(Register via UI)* | `SHOPKEEPER`| Commercial store pantries, bulk inventory management |

---

## 📡 REST API Documentation

Interactive Swagger documentation is available at:
👉 **[`http://localhost:8080/swagger-ui.html`](http://localhost:8080/swagger-ui.html)**

### 1. Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Public | Register new user (`HOME_USER` / `SHOPKEEPER`), auto-create storage locations, return JWT |
| `POST` | `/api/auth/login` | Public | Authenticate user credentials, return JWT token and profile |
| `POST` | `/api/auth/change-password` | Protected | Change account password (requires old and new password) |

### 2. Inventory Products (`/api/products`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/products` | User | List user's products (supports `q`, `status`, `location`, `sort`) |
| `POST` | `/api/products` | User | Add new product (supports `MANUAL`, `BARCODE`, `BILL_SCAN`, `VOICE`) |
| `GET` | `/api/products/{id}` | User | Get details of a single product |
| `PUT` | `/api/products/{id}` | User | Update an existing product |
| `DELETE` | `/api/products/{id}` | User | Delete a product from inventory |
| `GET` | `/api/products/summary` | User | Single-query dashboard metrics and storage breakdown |
| `GET` | `/api/products/barcode/{barcode}` | User | Look up barcode via local catalog and Open Food Facts |

### 3. Notifications (`/api/notifications`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/notifications` | User | Fetch recent unread expiry alerts |
| `PATCH`| `/api/notifications/{id}/read` | User | Mark a single notification as read |
| `PATCH`| `/api/notifications/read-all` | User | Mark all user notifications as read |

### 4. Smart Recipes (`/api/recipes`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/recipes/suggest?ingredients=...` | Public | Recommend recipes based on available/near-expiry ingredients |

### 5. Admin Control Center (`/api/admin`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/admin/metrics` | Admin | Comprehensive platform metrics (Users, Products, Expiry stats) |
| `GET` | `/api/admin/users` | Admin | List all registered users with product and storage counts |
| `DELETE`| `/api/admin/users/{id}` | Admin | Delete user account and cascade inventory |
| `POST` | `/api/admin/recipes` | Admin | Publish a new recipe with ingredients and steps |
| `PUT` | `/api/admin/recipes/{id}` | Admin | Update an existing recipe |
| `DELETE`| `/api/admin/recipes/{id}` | Admin | Delete a recipe from the global catalog |
| `POST` | `/api/admin/barcodes` | Admin | Register a new barcode item in the catalog |
| `POST` | `/api/admin/trigger-expiry-check` | Public/Admin | Manually trigger daily batch expiry evaluation job |

---

## 🧪 Testing & Verification

A test suite verifying all 15 functional scenarios is included in the project:
```bash
python scratch/test_full_suite.py
python scratch/test_admin_flow.py
```

### Verified Test Matrix
- [x] User Registration with unique member ID validation
- [x] Duplicate member ID rejection with `409 Conflict`
- [x] JWT Authentication & Protected route authorization
- [x] Manual, Voice, Barcode, and Receipt OCR product ingestion
- [x] Traffic-signal status computation (`FRESH`, `NEAR_EXPIRY`, `EXPIRED`)
- [x] Single-roundtrip dashboard summary aggregations
- [x] Daily 8:00 AM scheduled expiry check and alert generation
- [x] Notification bell unread count badge & mark-as-read drawer
- [x] Multi-ingredient recipe recommendation engine
- [x] Role-based UI customization (Recipes hidden for Shopkeepers)
- [x] Admin Control Center with user management, recipe builder, and platform metrics

---

## 📄 License

This project is developed as part of the B.Tech Computer Science & Engineering Curriculum (2024–2025) and is released under the **MIT License**.
