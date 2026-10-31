# 🚀 Brightloop — SaaS Subscription Management System
### Team Syntax | Odoo Hackathon

Brightloop is a full-stack, enterprise-grade SaaS Subscription Management System designed and built for the Odoo Hackathon. It enables businesses to manage subscription lifecycles end-to-end: from multi-tier products, flexible pricing models, and quotations pipeline to automated recurring invoices, payment collections, and revenue intelligence.

---

## 🏗️ Architecture & Modules

The platform is split into 4 core functional modules:

### 👤 Member 1 — Authentication, Team & Customer Management
- **JWT & Role-Based Auth:** Secure token authentication with bcrypt password hashing and 24h token expiry.
- **Role Permissions:** Distinct personas for **Admin**, **Staff**, and **Customer**.
- **Staff Team Portal:** Admin-controlled user directory to manage staff accounts, roles, and status toggles.
- **Customer CRM:** Comprehensive client account directory with profile history, commercial records, and subscription timeline.
- **Self-Service Preferences:** Account profile name changes and secure password rotation.

### 📦 Member 2 — Product Catalogue & Pricing Rules
- **Products & Variants:** Service, consumable, and storable offerings with support for pricing variants (extra seats, addons, environments).
- **Subscription Plans:** Multi-cadence pricing (daily, weekly, monthly, yearly) with minimum seat thresholds and live pricing card previews.
- **Promotions & Discounts:** Flat amount and percentage deductions applicable across all products or specific plans.
- **Taxation Engine:** Configurable GST / VAT percentage assessment rules with inline editing.

### 📋 Member 3 — Quotations & Subscriptions Lifecycle
- **3-Step Quotation Wizard:** Interactive customer selection, pricing overrides, live tax calculation, and document preview.
- **Document View & Print:** Standard printable quotation statements with instant conversion to subscriptions.
- **Subscription Engine:** Dual view modes (Card Grid & Structured Table) with live status badges.
- **Lifecycle Actions:** 1-click **Pause**, **Resume**, **Renew**, and **Close** (with reason logging).
- **Audit Stepper Timeline:** Step-by-step visual event timeline tracking creation, confirmation, active cycles, and scheduled renewals.

### 💰 Member 4 — Invoices, Payments & Finance Dashboard
- **Executive Dashboard:** Live KPI cards for Total Revenue, Outstanding Receivables, Settled Invoices, and Overdue Accounts.
- **Data Visualizations:** 6-month smoothed AreaChart for monthly revenue trends and an interactive Donut Chart for invoice distribution.
- **Automated Billing Engine:** Automatic invoice generation for all active subscriptions due for billing (`/api/invoices/generate`).
- **Printable Statements:** Professional invoice document with Bill To credentials, itemized calculations, and payment audit logs.
- **Payment Collection:** Drawer modal supporting UPI, Card, Bank Transfer, and Cash with instant status reconciliation.
- **Overdue Tracking & Reports:** Urgent overdue collections console and multi-dimensional revenue intelligence reports.

---

## ⚡ Quick Start

### 1. Start Backend (FastAPI + SQLite)
```bash
# In c:\FAHAD\Phoenix
python backend/run.py
# Or double click: start-backend.bat
```
Backend runs on: `http://localhost:8000`  
Swagger API Docs: `http://localhost:8000/docs`

### 2. Start Frontend (React 19 + Vite + TailwindCSS v4)
```bash
# In c:\FAHAD\Phoenix\frontend
npm run dev
# Or double click: start-frontend.bat
```
Frontend runs on: `http://localhost:5173`

---

## 🔑 Demo Accounts (Pre-seeded with Sample Data)

Brightloop comes pre-seeded with realistic SaaS subscription accounts, products, and active invoices:

| Persona | Email | Password | Role & Permissions |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@brightloop.com` | `admin123` | Full access to all modules, staff, finance & settings |
| **Staff Member** | `staff@brightloop.com` | `staff123` | Quotations, subscriptions, catalogue, and invoices |
| **Customer Portal** | `customer@acme.com` | `customer123` | Client portal: "My Subscriptions" & "My Invoices" |

*Quick 1-Click buttons are also available on the Login screen to instantly test each role!*

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Vite, TailwindCSS v4, React Router DOM v7, Zustand, TanStack Query v5, Axios, React Hook Form, Zod, Lucide React, Recharts, Sonner.
- **Backend:** FastAPI (Python 3.11), SQLAlchemy ORM, SQLite, Pydantic v2, Python-Jose (JWT), Passlib (Bcrypt), Uvicorn.
- **Currency & Localization:** Indian Rupee (`₹` - INR) formatting with Indian numbering conventions (`1,00,000`).
