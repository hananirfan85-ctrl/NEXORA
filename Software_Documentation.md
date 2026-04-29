# Software Documentation

## 1. Project Information

### Project Name
NEXA POS

### Version
v1.0.0

### Author / Company
Hanan Irfan / NEXA Systems

### Release Date
2024-05-29

### Project Description
NEXA POS is an advanced Point of Sale system built as a Progressive Web App (PWA). It is designed to automate and simplify business operations through a centralized shop management system with capabilities ranging from billing, inventory control, and customer management to robust reporting.

---

# 2. Purpose of the Software

* **Reduce Manual Work**: Automate inventory tracking, billing generation, and transaction logging.
* **Improve Workflow Efficiency**: Synchronize sales and inventory in real-time, providing staff with instant stock availability.
* **Provide Centralized Data Management**: Keep all user, vendor, product, and financial data in a single accessible cloud-based (Supabase) database.
* **Target Users**: Retail shop owners, cashiers, store managers, and small-to-medium enterprise administrators.

---

# 3. Key Features

| Module          | Description                     |
| --------------- | ------------------------------- |
| **Authentication** | Secure login and registration using Supabase Auth. Includes password hashing and bot integration (captcha). |
| **Dashboard**      | Real-time analytics, revenue reports, and low-stock indicators. |
| **User Management**| Add, edit, and remove users conditionally (RBAC implementation). |
| **POS Billing**    | Rapid checkout system with barcode scanning, custom discounts, and receipt generation. |
| **Inventory**      | Full stock lifecycle tracking, item variations, classification, and SKU management. |
| **Reporting**      | Export sales, daily summaries, and profit analytics. |

---

# 4. Technology Stack

## Frontend (Client-side PWA)
* React.js (v18+)
* Vite
* Tailwind CSS
* Framer Motion
* React Router DOM

## Backend & Database (BaaS)
* Supabase (PostgreSQL)
* Supabase GoTrue Auth (Authentication)

## Deployment / Hosting
* Vercel (Edge Network)

---

# 5. System Requirements

## Minimum Hardware Requirements
* **RAM**: 4GB+
* **Storage**: 100MB+ (Client app cache)
* **Processor**: Dual Core+

## Software Requirements
* Node.js v20+ (for developers)
* Modern Web Browser (Chrome, Edge, Safari, Firefox)

## Supported Platforms
* Windows (PWA Desktop execution)
* Linux (PWA Desktop execution)
* macOS (PWA Desktop execution)
* iOS / Android (Mobile browser installation)

---

# 6. Installation Guide

## Step 1: Clone Repository
```bash
git clone https://github.com/your-project/nexa-pos.git
```

## Step 2: Install Dependencies
```bash
npm install
```

## Step 3: Configure Environment Variables
Create a `.env` file in the root directory.

```env
VITE_SUPABASE_URL=https://<your-project-id>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

## Step 4: Start Application
```bash
npm run dev
```

---

# 7. Architecture Overview

* **Client-Server Data Fetching**: The application utilizes standard RESTful patterns and WebSockets mapped natively through the Supabase Javascript SDK.
* **Row Level Security**: The database uses internal PostgreSQL RLS (Row Level Security) to partition and restrict user data safely based on JWT claims.
* **Progressive Web App**: The application implements full service workers (VitePWA) to cache critical JS/CSS assets and layout files enabling an "Install to Desktop" capability.

---

# 8. Security Implementation

This software prioritizes data integrity and system security. The following foundational security features are implemented:

* **HTTPS Encryption**: Forced by default on deployment (Vercel edge limits the application strictly to SSL/TLS).
* **Password Hashing**: Offloaded to Supabase GoTrue Auth engine, leveraging robust `bcrypt` hashing. Passwords never touch application memory as plain text except during the encrypted transport payload.
* **Role-Based Access Control (RBAC)**: Interface layers and database policies selectively display information or deny backend POST/DELETE requests depending on user profiles (e.g. Admin vs Cashier).
* **Input Validation**: All client-side registration and login endpoints enforce format structures (Email regex validations, minimum length algorithms, and CAPTCHA integrations).
* **Rate Limiting**: Managed by the Supabase Edge infrastructure, preventing DDoS variations against login pathways or database endpoints.
* **Cross-Site Scripting (XSS)**: React handles DOM sanitization intrinsically, preventing injection attacks.

---

# 9. Support and Contact

## Support Information
* **Email**: hananirfan85@gmail.com
* **Platform**: [NEXA POS](https://nexapossystem.vercel.app/)

---
