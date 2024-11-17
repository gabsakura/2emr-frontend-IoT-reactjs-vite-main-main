Frontend README.md

# IoT Sensor Monitoring Frontend

This project is the **frontend** for the IoT Sensor Monitoring system, built with React and Vite. It provides a real-time dashboard to visualize sensor data such as temperature, occupancy, and lighting for multiple rooms.

## Features

- Real-time data visualization using **Chart.js**.
- Interactive controls for room state (light, AC, occupancy).
- Responsive design for multiple room displays.
- Integration with the backend API for sensor data.

## Tech Stack

- **React**: Frontend framework.
- **Vite**: Build tool for fast development.
- **Chart.js**: Graph library for visualization.
- **CSS/Styled Components**: For styling.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/gabsakura/Front-end.git

    Navigate to the project directory:

cd Front-end

Install dependencies:

npm install

Start the development server:

    npm run dev

Environment Variables

Create a .env file in the root directory with the following variables:

VITE_BACKEND_URL=http://localhost:3000

Replace http://localhost:3000 with your backend API URL if needed.
Usage

    Start the backend API (refer to the backend's README).
    Access the frontend in your browser:

http://localhost:5173
