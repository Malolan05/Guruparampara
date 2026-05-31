# Guruparampara

A React + Node.js experience that highlights Srivaishnava acharyas with multilingual support.

## Development

### Server (API + images)

```bash
cd server
npm install
npm start
```

The API runs on `http://localhost:3001`.

### Client (React)

```bash
cd client
npm install
npm run dev
```

Vite proxies `/api` and `/images` to the Node server during development.

## Production build

```bash
cd client
npm run build
```

After building, the Node server will serve the static React build from `client/dist`.
