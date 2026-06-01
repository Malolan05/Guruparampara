# Guruparampara - React + Node.js

A React frontend with a Node.js (Express) backend to showcase Sri Vaishnavite Acharya lineage.

## Project Structure

```
Guruparampara/
├── client/                   # React app
├── server.js                 # Express server + API
├── data/acharyas.json        # Acharya listing data
├── acharya-data/             # Individual acharya JSON files
└── acharya-image/            # Acharya images
```

## Run Locally

1. Install dependencies:
   ```bash
   npm install
   npm --prefix client install
   ```
2. Start frontend + backend in development:
   ```bash
   npm run dev
   ```
3. Open:
   - React app: `http://localhost:5173`
   - API server: `http://localhost:3000`

## Build and Start

```bash
npm run build
npm start
```

This serves the built React app and API from Node.js on port `3000`.
