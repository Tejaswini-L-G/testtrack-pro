# Installation Guide

## 1. Clone Repository

git clone https://github.com/Tejaswini-L-G/testtrack-pro.git

cd testtrack-pro

## 2. Install Dependencies

Backend:

cd apps/api/backend
npm install

Frontend:

cd apps/web/frontend
npm install

## 3. Setup Environment Variables

Copy .env.example to .env

Example:

DATABASE_URL=postgresql://user:password@localhost:5432/testtrack

JWT_SECRET=your-secret-key

## 4. Run Database Migration

npx prisma migrate dev

## 5. Start Backend

npm start

## 6. Start Frontend

cd apps/web/frontend
npm start

Application will run at:

Frontend → http://localhost:3000  
Backend → http://localhost:5000