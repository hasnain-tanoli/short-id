cat > README.md << 'EOF'
# 🔗 URL Shortener

A modern, full-stack URL shortening service built with Node.js, Express, and MongoDB. Transform long URLs into short, shareable links with comprehensive analytics and visit tracking.

![URL Shortener](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## ✨ Features

- **🚀 Instant URL Shortening** - Convert long URLs into compact, easy-to-share links
- **📊 Real-time Analytics** - Track total visits and view detailed visit history
- **🎨 Modern UI** - Beautiful, responsive interface with gradient design
- **📋 One-Click Copy** - Quickly copy shortened URLs to clipboard
- **⚡ Fast & Reliable** - Built on Express.js with MongoDB for optimal performance
- **📱 Mobile Responsive** - Works seamlessly on all devices
- **🔒 Secure** - Safe URL storage and validation
- **📈 Visit Tracking** - Monitor when and how often your links are accessed

## 🛠️ Tech Stack

**Frontend:**
- HTML5
- CSS3 (Modern gradient design)
- Vanilla JavaScript (ES6+)

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- nanoid (for unique ID generation)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/hasnain-tanoli/short-id.git
   cd short-id

Install dependencies

Bash

npm install
Set up environment variables

## short-id — URL Shortener

![status-active](https://img.shields.io/badge/status-active-success.svg) ![license-MIT](https://img.shields.io/badge/license-MIT-blue.svg)

A small URL shortening service built with Node.js, Express and MongoDB. Shorten long links, get basic visit analytics, and redirect via compact IDs.

---

## Features

- Shorten long URLs to compact IDs
- Redirect from short ID to original URL
- Basic visit tracking / analytics
- Simple frontend to create and copy short links

## Tech stack
## short-id — URL Shortener

![status-active](https://img.shields.io/badge/status-active-success.svg) ![license-MIT](https://img.shields.io/badge/license-MIT-blue.svg)

A small URL shortening service built with Node.js, Express and MongoDB. Shorten long links, get basic visit analytics, and redirect via compact IDs.

---

## Features

- Shorten long URLs to compact IDs
- Redirect from short ID to original URL
- Basic visit tracking / analytics
- Simple frontend to create and copy short links

## Tech stack

- Node.js + Express
- MongoDB + Mongoose
- nanoid for ID generation
- Plain HTML/CSS/Vanilla JS frontend (served from /public)

## Quick start

1. Clone the repository

  git clone https://github.com/hasnain-tanoli/short-id.git
  cd short-id

2. Install dependencies

  npm install

3. Create a .env file in the project root (see `.env.example` if present) and set:

  MONGODB_URI=your_mongodb_connection_string
  PORT=3000

4. Start the app

  npm start

  # for development with nodemon (if available)
  npm run dev

5. Open http://localhost:3000 in your browser

## Project structure

```
short-id/
├── controllers/    # request handlers (url controller)
├── models/         # Mongoose schemas (url model)
├── routes/         # Express route definitions
├── public/         # static frontend (index.html, script.js, style.css)
├── connection.js   # database connection (or config)
├── server.js       # app entry point
├── package.json
└── README.md
```

## API

POST /api/shorten
- Create a new short URL. Body: { "url": "https://example.com/..." }

GET /api/urls
- List stored URLs and basic analytics

GET /api/analytics/:shortId
- Get analytics for a specific short ID

GET /:shortId
- Redirects to the original URL and records the visit

Example (create a short URL):

curl -X POST http://localhost:3000/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.example.com/very/long/url"}'

Response example:

```json
{ "id": "abc12345", "shortUrl": "http://localhost:3000/abc12345", "originalUrl": "https://www.example.com/..." }
```

## Environment

- MONGODB_URI - MongoDB connection string (required)
- PORT - server port (optional, default 3000)

## Contributing

Contributions are welcome. Please open issues or submit PRs for improvements.

## License

This project is licensed under the MIT License.

---

Made with ❤️ by Hasnain Tanoli — https://github.com/hasnain-tanoli/short-id
