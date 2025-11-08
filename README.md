Analytica: AI-Powered Data Analysis Platform



[This project is currently in active development]

Analytica is a full-stack web application designed to democratize data science. It allows users to upload raw data files (CSV, Excel) and, with no code required, instantly receive a comprehensive Exploratory Data Analysis (EDA) and run multiple predictive machine learning models to uncover insights.

This project is built as a microservice-oriented system, featuring:

React Frontend: A modern, responsive user interface.

Node.js/Express Backend: A robust MERN stack for user authentication and file management.

Python AI Service: A separate FastAPI server that handles all heavy computation (EDA and ML model training).

Core Features (Completed)

Modern Landing Page: A fully responsive, animated landing page (built with React & Tailwind CSS).

Secure User Authentication: Full sign-up and login capabilities using a MERN stack and JSON Web Tokens (JWT).

Animated User Dashboard: A "glassmorphism" style dashboard with a live animated gradient background.

Drag-and-Drop File Uploads: A sleek interface for uploading CSV, XLSX, and JSON files, powered by Multer.

Automated Exploratory Data Analysis (EDA): The moment a file is uploaded, it is sent to the Python API, which instantly returns:

Overall dataset statistics (Total Rows, Columns, Missing Values).

A detailed per-column breakdown (Data Type, Missing Values, Unique Values).

Interactive Predictive Modeling:

Automatically identifies the problem type (Classification vs. Regression) based on the user's chosen target variable.

Trains, tests, and compares multiple scikit-learn models (e.g., Logistic/Linear Regression, Decision Tree, Random Forest).

Returns a clean, simple performance report (Accuracy, F1-Score, R²-Score, etc.) for each model.

Tech Stack

Service

Category

Technology

Frontend

UI

React.js, Vite, React Router



Styling

Tailwind CSS



HTTP

Axios

Backend

Runtime

Node.js



Framework

Express.js



Database

MongoDB (Atlas), Mongoose



Auth

JSON Web Token (JWT), bcrypt.js



File Handling

Multer

AI Service

API

Python 3, FastAPI



Data Analysis

Pandas, NumPy



Machine Learning

Scikit-learn

Project Structure

This project is a "monorepo" containing three separate, independent services that run at the same time and communicate via HTTP requests.

/Analytica
│
├── 📂 analytica-frontend/   (React UI)
│   ├── src/
│   ├── package.json
│   └── ...
│
├── 📂 analytica-backend/    (Node.js/Express API)
│   ├── routes/
│   ├── models/
│   ├── uploads/
│   ├── package.json
│   └── index.js
│
└── 📂 analytica-python-api/  (Python/FastAPI AI Service)
    ├── venv/
    ├── main.py
    └── requirements.txt


How to Run This Project Locally

You must have three separate terminals open to run this application.

1. Backend Server (Node.js)

# 1. Navigate to the backend folder
cd analytica-backend

# 2. Install dependencies
npm install

# 3. Create a .env file in this folder and add your variables:
# MONGO_URI=your_mongodb_atlas_connection_string
# JWT_SECRET=your_secret_key_for_jwt

# 4. Run the server (runs on http://localhost:5001)
npm run dev


2. AI Service (Python)

# 1. Navigate to the Python API folder
cd analytica-python-api

# 2. Create and activate a virtual environment
py -3 -m venv venv
.\venv\Scripts\activate

# 3. Install required libraries
# (This command has all the *working* libraries for Phases 1-5)
pip install fastapi "uvicorn[standard]" pandas scikit-learn "openpyxl"

# 4. Run the server (runs on http://localhost:8000)
python main.py


3. Frontend (React)

# 1. Navigate to the frontend folder
cd analytica-frontend

# 2. Install dependencies
npm install

# 3. Run the server (runs on http://localhost:5173)
npm run dev


You can now open http://localhost:5173 in your browser to use the application.

Future Roadmap (Next Steps)

[In Progress] Phase 6: AI Q&A Chatbot: Implementing a langchain agent to allow users to ask natural-language questions about their data. (Currently paused to resolve langchain v0.2.x dependency conflicts).

[Planned] Phase 7: Deployment:

Deploy React Frontend to Vercel/Netlify.

Deploy Node.js & Python services to Render/Railway.

Configure cloud file storage with AWS S3.


