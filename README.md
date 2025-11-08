# 🧠 Analytica — AI‑Powered Data Analysis Platform

> **No‑code Automated EDA & Machine Learning**

Analytica is a full‑stack web application designed to make data science accessible to everyone. Users can upload raw data (CSV, Excel, JSON) and instantly receive:

- Automated Exploratory Data Analysis (EDA)
- Insights & dataset statistics
- Machine learning model training (classification / regression)
- Performance reports and metrics comparison

This project uses a **microservice architecture**, separating the frontend, backend, and AI computation service.

---

## 🚀 Features

| Category | Feature |
|----------|---------|
| ✅ **Frontend (React)** | Modern landing page, animated dashboard, drag‑and‑drop uploads |
| ✅ **Authentication** | JWT‑based authentication, secure login/signup |
| ✅ **EDA Engine** | Dataset summary, missing values, feature breakdown |
| ✅ **ML Pipeline** | Auto detection of regression/classification, trains multiple models |
| ✅ **Reporting** | Outputs model metrics (Accuracy, F1, R², etc.) |
| ⏳ **In Progress** | AI Chatbot (LangChain) |
| 📌 **Planned** | Cloud deployment (Render / Railway / Vercel) |

---

## 🧩 Tech Stack

### **Frontend (UI)**
- React.js (Vite)
- Tailwind CSS
- Axios
- React Router

### **Backend (API / Auth / File Management)**
- Node.js + Express.js
- MongoDB Atlas + Mongoose
- Multer (file uploads)
- JWT Authentication, bcrypt.js

### **AI / Data Service**
- FastAPI (Python)
- Pandas, NumPy
- Scikit‑learn (ML)
- OpenPyXL (Excel support)

---

## 📁 Project Structure
```
Analytica/
│
├── analytica-frontend/      # React UI (Vite)
├── analytica-backend/       # Node/Express API
└── analytica-python-api/    # FastAPI (EDA + ML)
```

---

## 🛠️ Installation & Setup

> You will need **three terminals open** — one for each service.

### 1️⃣ Backend API (Node.js / Express)
```bash
cd analytica-backend
npm install
```
Create `.env` in the backend folder:
```
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```
Run server:
```bash
npm run dev
``` 
Backend runs at: **http://localhost:5001**

---

### 2️⃣ AI Service (Python / FastAPI)
```bash
cd analytica-python-api
py -3 -m venv venv
./venv/Scripts/activate  # Windows
source venv/bin/activate # Mac/Linux

pip install fastapi "uvicorn[standard]" pandas scikit-learn openpyxl
python main.py
```
AI Service runs at: **http://localhost:8000**

---

### 3️⃣ Frontend (React)
```bash
cd analytica-frontend
npm install
npm run dev
```
Frontend will open at: **http://localhost:5173**

---

## 🚦 Running the Full System
After starting all three services, open:
👉 http://localhost:5173

Upload data ➝ Choose target column ➝ View EDA ➝ Train ML models

---

## 🗺️ Roadmap

| Phase | Status | Description |
|--------|--------|-------------|
| Phase 6 | 🚧 In Progress | LangChain-based AI Q&A chatbot (natural language questions about data) |
| Phase 7 | ✅ Planned | Cloud deployment (Vercel + Render/Railway + AWS S3) |

---

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first.

---

## 📄 License
MIT License — feel free to use and modify.

---

### ⭐ If you like this project, star the repository!
```bash
git clone https://github.com/Abhi-2516/Analytica-WEB-ML.git
