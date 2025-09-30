# 🍽️🎥 Reelato

Welcome to **Reelato** — a unique fusion of **Instagram Reels** + **Zomato**!  
On Reelato, users can watch short, engaging **food reels** uploaded by food partners, explore their store, and even order delicious meals directly.  

Think of it as **scrolling reels that make you hungry — and you can instantly order what you see** 🤤🔥  

---

## ✨ Features

- 🎥 **Food Reels Feed** — Swipe through reels uploaded by food partners  
- ❤️ **Engagement** — Like ❤️ & Save 🔖 your favorite food reels  
- 🍴 **Food Partner Stores** — Visit partner profiles and explore their dishes  
- 🛒 **Order System** — Place food orders directly from reels  
- 🔒 **Authentication** — Secure login & registration for users and partners  
- ⚙️ **User Settings** — Manage your account & preferences easily  
- 🛡️ **Protected Routes** — Authenticated pages are wrapped with security  

---

## 🛠️ Tech Stack

### Frontend
- ⚛️ **React + Vite**
- 🎨 **Tailwind CSS + shadcn/ui**
- 🔄 **React Query (TanStack Query)** for data fetching & caching
- 🗂️ **Zustand** for global state management
- 🛣️ **React Router** for navigation

### Backend
- 🚀 **Node.js + Express**
- 🍃 **MongoDB + Mongoose** (with lean queries for performance)
- 🔑 **JWT Authentication**
- 🧂 **Bcrypt** for password hashing

---

## 📂 Project Structure (Frontend)

```

src/
┣ 📂 hooks        # Custom hooks (React Query, Zustand)
┣ 📂 lib          # Utilities (api client, helpers)
┣ 📂 pages        # Pages (Home, Auth, Settings, NotFound)
┣ 📂 components   # UI components (Reels, Actions, Layouts)
┣ 📂 store        # Zustand stores
┣ 📂 types        # TypeScript types
┗ 📂 routes/AppRoutes.tsx   # Routes config

````

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB running locally or Atlas URI

### Clone the repo
```bash
git clone https://github.com/TheGauravsahu/reelato-app
cd reelato-app
````

### Install dependencies

```bash
# Frontend
cd frontend
npm install or pnpm install

# Backend
cd backend
npm install or pnpm install
```

### Environment Variables

Create a `.env` file in both **frontend** and **backend**:

#### Backend `.env`

Check `src/config/index.ts`


#### Frontend `.env`

```
VITE_API_URL=http://localhost:3000/api
```

### Run the app

```bash
# Backend
cd backend
npm run dev or pnpm dev

# Frontend
cd frontend
npm run dev or pnpm dev
```

---

## 🎯 Roadmap

* ✅ User & Food Partner authentication
* ✅ Food reels feed
* ✅ Likes & saves
* 🚧 Food ordering system
* 🚧 Payments integration
* 🚧 Notifications (likes, orders, updates)

---

## 🧑‍💻 Contributors

* **You** (👨‍🍳 Developer & Foodie)
* Future contributors welcome! 🍕✨

---

## 📜 License

This project is licensed under the MIT License.
Free to use, modify, and share with the foodie community 💖
