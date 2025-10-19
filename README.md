# English Learning Platform + AI Powered Quiz Generator

This project is a web application designed to help users learn English grammar in a dynamic and interactive way. It combines a structured learning environment with the power of artificial intelligence. Users can select a lesson and instantly generate a unique, context-aware quiz based on that lesson's content, providing an endless supply of practice material.

## Features

-   **Dynamic Lesson Display:** Fetches and displays a list of English grammar lessons from the backend API, allowing users to choose their topic of focus.
    
-   **AI-Powered Quiz Generation:** The core feature. Users can select any lesson, and the application sends the content to a Large Language Model (LLM) to generate a fresh, relevant quiz in real-time.
    
-   **Interactive Quiz Interface:** A clean and user-friendly interface allows users to take the generated quiz, select answers, and receive immediate feedback on their score upon completion.
    

----------

## Technologies Used

### Frontend

-   **React.js + Typescript**
-   **Vite (for the development environment)**
    
-   **Tailwind CSS (& Typography Plugin)**
    
-   **Axios (for API calls)**
    

### Backend

-   **Node.js**
    
-   **Express.js**
    

### AI Services

-   **Replicate API:** A platform for running machine learning models in the cloud, used here to access LLMs.
    
-   **Large Language Models (LLMs):** The brains behind the quiz generation.
    

----------

## Local Setup and Installation

Follow these instructions to get the project running on your local machine.

### Prerequisites

-   Node.js (v18.x or later)
    
-   npm or yarn
    

### Backend Setup

1.  **Clone the repository:**
    
    Bash
    
    ```
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name/backend
    
    ```
    
2.  **Install dependencies:**
    
    Bash
    
    ```
    npm install
    
    ```
    
3.  **Create an environment file:** Create a `.env` file in the `backend` directory and add your Replicate API token.
    
    Cuplikan kode
    
    ```
    REPLICATE_API_TOKEN=your_replicate_api_token_here
    
    ```
    
4.  **Start the server:**
    
    Bash
    
    ```
    npm run dev
    
    ```
    
    The backend server will be running on `http://localhost:3000`.
    


### Frontend Setup

1.  **Navigate to the frontend directory:** Open a **new terminal** and navigate to the `frontend` folder.
    
    Bash
    
    ```
    # Make sure you are in the root directory of the project first
    cd frontend
    
    ```
    
2.  **Install dependencies:**
    
    Bash
    
    ```
    npm install
    
    ```
    
3.  **Connect to your Local API (Important!)** By default, the frontend is configured to use the live, deployed API. To connect it to your local backend server, you must change the API endpoint in the source code.
    
    -   Find the file where API calls are made (e.g., `src/App.tsx` or a dedicated API service file).
        
    -   Change the URL from the Vercel deployment to your local server address.
        
    
    **Change this:**
    
    JavaScript
    
    ```
    axios.get("https://english-quiz-generator-api.vercel.app/api/lessons")
    
    ```
    
    **To this:**
    
    JavaScript
    
    ```
    axios.get("http://localhost:3000/api/lessons")
    
    ```
    
4.  **Start the development server:**
    
    Bash
    
    ```
    npm run dev
    
    ```
    
    The React application will be available at `http://localhost:5173`. It will now fetch data from your local backend server.
    

----------

## The Role of AI in This Project

Artificial Intelligence is integral to both the application's core functionality and its development process.

### 🤖 In-App Quiz Generation

The primary function of the app is a direct integration with a Large Language Model. The Express backend takes user-selected lesson content, wraps it in a carefully engineered prompt, and sends it to the **Replicate API**. The prompt instructs the model to act as an English teacher and return a unique quiz formatted as a strict JSON object, which the frontend can then easily display.

### 👨‍💻 Development Assistance & Code Optimization

Throughout the development process, AI tools were used as a pair programmer. This included:

-   Generating boilerplate code for React components and Express routes.
    
-   Debugging complex functions and suggesting fixes.
    
-   Refactoring code for better performance and readability.
    

### 📝 Automated Documentation

AI was used to generate inline comments and documentation for various functions and components. By providing a code block to an LLM and asking it to "explain this code," we could quickly generate descriptive comments, improving code maintainability and making it easier for other developers to understand the codebase.
