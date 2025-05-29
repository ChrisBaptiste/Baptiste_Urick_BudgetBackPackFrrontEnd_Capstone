# BudgetBackpack - Frontend Client

This is the frontend client for the BudgetBackpack application, a full-stack travel planning tool. It's built with React (using Vite) and interacts with the BudgetBackpack backend server to provide a user-friendly interface for planning trips, searching for flights and events, and managing user accounts.

**Link to Backend Repository:** [https://github.com/ChrisBaptiste/Baptiste_Urick_BudgetBackPackBackEnd_Capstone]

## Table of Contents
1.  Features
2.  Technologies Used
4.  Setup and Installation
5.  Running the Frontend
6.  Key Components & Pages
7.  Environment Variables
8.  Author
9.  Credits


## 1. Features

*   User Authentication: Forms for user registration and login, integrated with the backend API.
*   Dynamic Navigation: Navbar updates based on user authentication status (e.g., showing Login/Register vs. Dashboard/Logout).
*   Protected Routes: Client-side route protection ensuring only authenticated users can access certain pages (e.g., Dashboard, Search).
*   Dashboard: Displays a list of the user's trips and provides options to create new ones.
*   **Trip Management (CRUD Interface):**
       Dedicated page/form to create new trips.
       Page to view detailed information for a specific trip.
       Page/form to edit existing trip details.
       Functionality to delete trips with user confirmation.
*   **Search Functionality:**
       Separate interfaces for searching one-way flights and local events/places.
       Displays search results fetched from the backend API.
*   **Home Page:** Engaging landing page with a dynamic image slideshow and clear calls to action.
*   **State Management:** Utilizes React Hooks (`useState`, `useEffect`, `useContext`) for local component state and global   authentication state via React Context API.
*   **Responsive Design :** Styled with CSS for usability on various screen sizes.

## 2. Technologies Used

*   **Library/Framework:** React.js (v18.x)
*   **Build Tool/Dev Server:** Vite
*   **Routing:** React Router DOM (v6)
*   **HTTP Client:** Axios (for API communication)
*   **Styling:** CSS (global styles, component-specific styles, CSS modules for some components)
*   **State Management:** React Hooks (`useState`, `useEffect`, `useContext`)



## 3. Setup and Installation

### Prerequisites
*   Node.js (v16.x or later recommended)
*   npm (Node Package Manager)
*   A running instance of the [BudgetBackpack Backend Server](https://github.com/ChrisBaptiste/Baptiste_Urick_BudgetBackPackBackEnd_Capstone) 

### Steps
1.  Clone the repository (or download the files for this frontend)
    
2.  Navigate to the `ClientSide-Server` directory
    
    cd path/to/your/ClientSide-Server
    
3.  Install dependencies
    
    npm install
    
4.  **Create a `.env` file** in the `ClientSide-Server` root directory. 
## 4. Running the Frontend

1.  Ensure the [BudgetBackpack Backend Server](#link-to-backend-repository-your-github-link-to-backend-server-here) is running and accessible (on `http://localhost:5001`).
2.  Start the frontend development server:
    
    npm run dev
    
3.  The application will  start on port 5000 (or as specified in your `vite.config.js` or by Vite if the port is in use). Open your browser and navigate to `http://localhost:5000` (or the assigned port).

## 5. Key Components & Pages

   **`App.jsx`**: The root component that sets up React Router and the main layout (Navbar, main content area, Footer).
   **`AuthContext.jsx`**: Manages global authentication state (token, user status) and provides login/logout actions.
   **`PrivateRoute.jsx`**: A higher-order component that protects routes requiring user authentication.
   **Page Components (`src/pages/`)**:
       `HomePage.jsx`: Landing page with app overview and dynamic hero slideshow.
       `LoginPage.jsx` & `RegisterPage.jsx`: Handle user authentication.
       `DashboardPage.jsx`: Displays user's trips and allows creation of new trips.
       `CreateTripPage.jsx` & `EditTripPage.jsx`: Forms for creating and updating trip details.
       `TripDetailsPage.jsx`: Shows detailed information for a selected trip, with options to edit/delete.
       `SearchPage.jsx`: Container for flight and event search functionalities.
   **Search Components (`src/components/Search/`)**:
       `SearchFlights.jsx`: Form and results display for flight searches.
       `SearchEvents.jsx`: Form and results display for event/place searches.
   **`Navbar.jsx`**: Provides site navigation, adapting links based on authentication state.

## 6. Environment Variables

Create a `.env` file in the `ClientSide-Server` root with the following variable:

```env
VITE_API_BASE_URL=http://localhost:5001/api
Use code with caution.
VITE_API_BASE_URL: The base URL for the backend API. Vite requires environment variables exposed to the client-side bundle to be prefixed with VITE_. This URL is used by Axios and the Vite development server proxy.

7. Author
Name: Urick Chris Baptiste
Contact: https://www.linkedin.com/in/urick-baptiste/

8. Credits
Code Stoic - https://www.youtube.com/@ashutoshpawar (81 short but well explained youtube video tutorials on React)
web dev cody - https://www.youtube.com/watch?v=dX_LteE0NFM 
web dev simplified - https://www.youtube.com/watch?v=mbsmsi7l3r4
freecodecamp - https://www.youtube.com/@freecodecamp
Bryan Santos - (https://perscholas.instructure.com/courses/2607/external_tools/7337) Office hourse cloud recording
Tishana Trainor - https://github.com/tishana/express-fruits-2025-04 , https://github.com/tishana/react-fruits-2025-04 (full stack fruit app used as guidance to build my app)
