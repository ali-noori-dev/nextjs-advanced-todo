# 🚀 Next.js Advanced Todo List

A **feature-rich, full-stack Todo List application** built with **Next.js App Router**, **Prisma**, **NextAuth.js**, and **Sass**. This project demonstrates **authentication, API routes, database integration, real-time updates, and PWA capabilities**.

---

## 📌 Features

✅ **User Authentication** (OAuth & Credentials with NextAuth.js)  
✅ **Task Management** (CRUD operations with API routes)  
✅ **Task Categorization** (Lists, Due Date, Labels)  
✅ **Drag & Drop Task Ordering**  
✅ **Real-time Updates** (WebSockets / SSE)  
✅ **Push Notifications** (Firebase Cloud Messaging)  
✅ **Dark Mode & Responsive UI**  
✅ **Offline Support (PWA)**  
✅ **Deployed on Vercel**

---

## 🛠️ Tech Stack

- **Frontend:** Next.js, React, TypeScript, Sass
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** PostgreSQL / MongoDB
- **Auth:** NextAuth.js (Google, GitHub OAuth)
- **Storage:** Cloudinary or Supabase for file uploads
- **Real-time:** WebSockets / Server-Sent Events (SSE)
- **Notifications:** Firebase Cloud Messaging (FCM) / OneSignal
- **State Management:** Zustand
- **Deployment:** Vercel

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```sh
git clone https://github.com/YOUR_GITHUB_USERNAME/nextjs-todo.git
cd nextjs-todo
```

### 2️⃣ Install Dependencies

```sh
pnpm install
```

### 3️⃣ Set Up Environment Variables

Create a `.env` file in the root directory and add:

```sh
DATABASE_URL="your_database_connection_string"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_nextauth_secret"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
```

### 4️⃣ Set Up Prisma

```sh
npx prisma migrate dev --name init
npx prisma generate
```

### 5️⃣ Run the Development Server

```sh
pnpm run dev
```

Now open `http://localhost:3000` in your browser to see the app in action!

---

## ✨ Contributing

Want to contribute? **PRs are welcome!** 🚀

### 🛠️ Steps to Contribute:

### 1️⃣ **Fork the repository**

### 2️⃣ **Create a new branch**

```sh
git checkout -b feature-name
```

### 3️⃣ Commit your changes

```sh
git add .
git commit -m "feat: add new feature"
```

### 4️⃣ Push to your branch

```sh
git push origin feature-name
```

### 5️⃣ Submit a Pull Request (PR)

Once your PR is approved, it will be merged into the main branch. Thank you for your contribution!

---

## 📞 Contact

💬 **Developer:** Ali Noori  
📧 **Email:** [ali.noori.dev@gmail.com](mailto:ali.noori.dev@gmail.com)  
🔗 **GitHub:** [@ali-noori-dev](https://github.com/ali-noori-dev)
