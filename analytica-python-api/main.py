import uvicorn
import pandas as pd
import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
from dotenv import load_dotenv

# --- Scikit-learn Imports ---
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    r2_score, mean_squared_error
)

# Model Imports
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor

# --- LangChain Imports (for AI Q&A) ---
from langchain_community.agent_toolkits.pandas.base import create_pandas_dataframe_agent
# --- CHANGE 1: Import Groq instead of OpenAI ---
from langchain_groq import ChatGroq

# --- Load Environment Variables ---
load_dotenv()

# --- CHANGE 2: Check for GROQ_API_KEY ---
if os.getenv("GROQ_API_KEY") is None:
    print("Warning: GROQ_API_KEY environment variable not set.")
    print("Please create a .env file in this directory with your key:")
    print("GROQ_API_KEY=gsk-...")

# --- Data Models ---
class FileRequest(BaseModel):
    file_path: str

class PredictRequest(BaseModel):
    file_path: str
    target_column: str

class QueryRequest(BaseModel):
    file_path: str
    query: str

# --- Create the FastAPI app instance ---
app = FastAPI()

# --- Helper Function: Get Column Stats ---
def get_column_stats(df):
    """Analyzes each column of the DataFrame."""
    column_details = []
    
    for col in df.columns:
        col_type = str(df[col].dtype)
        missing_count = int(df[col].isnull().sum())
        unique_count = int(df[col].nunique())
        
        col_stats = {
            "column_name": col,
            "data_type": col_type,
            "missing_values": missing_count,
            "unique_values": unique_count,
        }
        column_details.append(col_stats)
        
    return column_details

# --- Helper Function: Load Data (No Preprocessing) ---
def load_data(file_path: str):
    """Loads a dataset from a file path."""
    try:
        if file_path.endswith('.csv'):
            df = pd.read_csv(file_path)
        elif file_path.endswith('.xlsx'):
            df = pd.read_excel(file_path)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format. Please use .csv or .xlsx")
        
        df.replace([np.inf, -np.inf], np.nan, inplace=True)
        return df
    
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"File not found at path: {file_path}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading data: {str(e)}")

# --- Helper Function: Build Preprocessing Pipeline ---
def build_preprocessor(X):
    """Identifies numeric/categorical features and builds a pipeline."""
    numeric_features = X.select_dtypes(include=np.number).columns.tolist()
    categorical_features = X.select_dtypes(include=['object', 'category']).columns.tolist()
    
    numeric_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median')), # Fill missing numbers
        ('scaler', StandardScaler()) # Scale data
    ])
    
    categorical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='most_frequent')), # Fill missing strings
        ('onehot', OneHotEncoder(handle_unknown='ignore')) # Convert strings to numbers
    ])
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, numeric_features),
            ('cat', categorical_transformer, categorical_features)
        ])
    
    return preprocessor, numeric_features, categorical_features

# --- API Endpoints ---

@app.get("/")
def read_root():
    return {"message": "Welcome to the Analytica AI Service!"}

@app.post("/analyze")
def analyze_file(request: FileRequest):
    """Receives a file path and returns a basic EDA report."""
    df = load_data(request.file_path)
    
    total_rows = int(df.shape[0])
    total_columns = int(df.shape[1])
    total_missing = int(df.isnull().sum().sum())
    column_details = get_column_stats(df)

    return {
        "message": "Analysis complete!",
        "file_info": {
            "file_path": request.file_path,
            "total_rows": total_rows,
            "total_columns": total_columns,
            "total_missing_values": total_missing,
        },
        "column_details": column_details,
    }

@app.post("/predict")
def run_prediction_models(request: PredictRequest):
    """Trains multiple models for a given file and target column."""
    
    # 1. Load data
    df = load_data(request.file_path)
    
    # Drop rows where the target column is missing
    df.dropna(subset=[request.target_column], inplace=True)
    if df.empty:
        raise HTTPException(status_code=400, detail="No data remaining after dropping rows with missing target values.")

    X = df.drop(request.target_column, axis=1)
    y = df[request.target_column]
        
    # 2. Identify Problem Type
    problem_type = "Unknown"
    if pd.api.types.is_numeric_dtype(y) and y.nunique() > 20:
        problem_type = "Regression"
    else:
        problem_type = "Classification"
        
    # 3. Define Models and Metrics
    results = []
    if problem_type == "Classification":
        models = {
            "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42),
            "Decision Tree": DecisionTreeClassifier(random_state=42),
            "Random Forest": RandomForestClassifier(random_state=42),
        }
    else: # Regression
        models = {
            "Linear Regression": LinearRegression(),
            "Decision Tree": DecisionTreeRegressor(random_state=42),
            "Random Forest": RandomForestRegressor(random_state=42),
        }
        
    # 4. Build Preprocessor
    preprocessor, num_features, cat_features = build_preprocessor(X)
    
    # 5. Split Data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # 6. Train and Evaluate Each Model
    for name, model in models.items():
        pipeline = Pipeline(steps=[('preprocessor', preprocessor), ('model', model)])
        
        try:
            pipeline.fit(X_train, y_train)
            y_pred = pipeline.predict(X_test)
            
            if problem_type == "Classification":
                metrics = {
                    "accuracy": accuracy_score(y_test, y_pred),
                    "precision": precision_score(y_test, y_pred, average='weighted', zero_division=0),
                    "recall": recall_score(y_test, y_pred, average='weighted', zero_division=0),
                    "f1_score": f1_score(y_test, y_pred, average='weighted', zero_division=0),
                }
            else: # Regression
                metrics = {
                    "r2_score": r2_score(y_test, y_pred),
                    "mse": mean_squared_error(y_test, y_pred),
                    "rmse": np.sqrt(mean_squared_error(y_test, y_pred)),
                }
            results.append({"model_name": name, "metrics": metrics, "status": "Success"})
        
        except Exception as e:
            results.append({"model_name": name, "metrics": {}, "status": "Failed", "error": str(e)})

    return {
        "problem_type": problem_type,
        "target_column": request.target_column,
        "model_results": results,
        "features_used": {"numeric": num_features, "categorical": cat_features}
    }

@app.post("/query")
async def query_data(request: QueryRequest):
    """
    Read a DataFrame and answer a natural language question about it.
    """
    
    # 1. Load the data
    df = load_data(request.file_path)
    
    # 2. Initialize the AI model (LLM)
    # --- CHANGE 3: Initialize ChatGroq instead of ChatOpenAI ---
    try:
        # We'll use Llama 3, which is powerful and fast
        # This uses the GROQ_API_KEY from your .env file
        llm = ChatGroq(model="llama3-8b-8192", temperature=0)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not initialize Groq model: {str(e)}. Is your API key correct?")
    # This agent can understand and write pandas code
    # 3. Create the Pandas DataFrame Agent
    try:
        # This is the stable import from langchain_community
        agent = create_pandas_dataframe_agent(
            llm,
            df,
            verbose=True, # Set to True to see the agent's "thinking" in your terminal
            allow_dangerous_code=True # Required to let the agent run code
        )
        
        # 4. Run the query
        response = await agent.ainvoke(request.query)
        
        # 5. Return the agent's answer
        return {"answer": response['output']}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while processing the query: {str(e)}")

# --- Main entry point to run the server ---
if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)