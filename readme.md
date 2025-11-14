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

Create a .env file in the root directory:

env

MONGODB_URI=your_mongodb_connection_string
PORT=3000
Start the server

Bash

npm start
Or for development with nodemon:

Bash

npm run dev
Open your browser

Navigate to http://localhost:3000

📁 Project Structure
text

short-id/
├── controllers/
│   └── url.js              # URL controller logic
├── models/
│   └── url.js              # MongoDB URL schema
├── routes/
│   └── url.js              # API routes
├── config/
│   └── db.js               # Database connection
├── public/
│   ├── index.html          # Frontend HTML
│   ├── style.css           # Styling
│   └── script.js           # Client-side JavaScript
├── .env                    # Environment variables (not tracked)
├── .env.example            # Environment template
├── .gitignore              # Git ignore file
├── index.js                # Server entry point
├── package.json            # Dependencies
└── README.md               # Documentation
🔌 API Endpoints
Method	Endpoint	Description
POST	/api/shorten	Create a new short URL
GET	/api/urls	Get all URLs with analytics
GET	/api/analytics/:shortId	Get analytics for specific URL
GET	/:shortId	Redirect to original URL
API Examples
Create Short URL:

Bash

curl -X POST http://localhost:3000/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.example.com/very/long/url"}'
Response:

JSON

{
  "id": "abc12345"
}
Get All URLs:

Bash

curl http://localhost:3000/api/urls
Get Analytics:

Bash

curl http://localhost:3000/api/analytics/abc12345
📊 Usage
Creating Short URLs
Enter your long URL in the input field
Click "Shorten URL"
Copy and share your new short link
Viewing Analytics
Scroll down to see all your shortened URLs
View total visit counts for each URL
Click "Show Visit History" to see detailed timestamps
Use the refresh button to update analytics
Sharing Links
Use the copy button (📋) to quickly copy URLs
Share anywhere - social media, emails, messages
Track engagement through the analytics dashboard
🚀 Deployment
Deploy to Render
Create account on Render
Create new Web Service
Connect your GitHub repository
Add environment variables:
MONGODB_URI
PORT (optional, Render sets automatically)
Deploy!
Deploy to Railway
Bash

# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Add environment variables
railway variables set MONGODB_URI=your_mongodb_uri

# Deploy
railway up
Deploy to Heroku
Bash

# Login to Heroku
heroku login

# Create app
heroku create short-id-app

# Add MongoDB
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set MONGODB_URI=your_mongodb_uri

# Deploy
git push heroku main

# Open app
heroku open
🔐 Environment Variables
Variable	Description	Required
MONGODB_URI	MongoDB connection string	Yes
PORT	Server port (default: 3000)	No
🧪 Testing
Bash

# Run tests (if implemented)
npm test

# Check code formatting
npm run lint
🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

Fork the project
Create your feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request
📝 To-Do
 Add user authentication
 Implement custom short IDs
 Add QR code generation
 Export analytics as CSV
 Add link expiration dates
 Implement rate limiting
 Add dark mode
🐛 Known Issues
None at the moment. Please report any bugs in the Issues section.

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgments
Built with Express.js
Database powered by MongoDB
Unique IDs generated using nanoid
Inspired by bit.ly and TinyURL
📧 Contact
Hasnain Tanoli - @hasnain-tanoli

Project Link: https://github.com/hasnain-tanoli/short-id

⭐ Star this repo if you find it helpful!

Made with ❤️ by Hasnain Tanoli