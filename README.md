# SwarSaathi - Eldercare Voice Assistant

A comprehensive eldercare companion app with voice assistance, medicine reminders, memory aids, and emergency contacts.

## 🌟 Features

- **Medicine Reminders**: Voice notifications at scheduled times
- **Memory Aids**: Reminders for important dates and events
- **Emergency Contacts**: Quick access to emergency contacts
- **Mood Tracking**: Mood-based activities and content
- **Voice Assistant**: Natural language interaction
- **Multi-language Support**: English and regional languages

## 🚀 Live Demo

- **Frontend**: https://saivarshini07-12.github.io/SwarSaathi
- **Backend API**: [Deploy to your preferred platform]

## 🛠️ Technology Stack

### Frontend
- React 18 with TypeScript
- Vite build tool
- Tailwind CSS
- React Router
- Lucide React Icons
- Date-fns

### Backend
- Node.js with Express
- SQLite database
- JWT authentication
- bcrypt password hashing
- CORS enabled

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm 8+

### Setup
```bash
# Clone the repository
git clone https://github.com/saivarshini07-12/SwarSaathi.git
cd SwarSaathi

# Install all dependencies
npm run install:all

# Start development servers
npm run dev
```

### Environment Variables
Create a `.env` file in the root directory:
```
MURF_API_KEY=your_murf_api_key
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

## 🚀 Deployment

### Frontend (GitHub Pages)
```bash
npm run build:frontend
npm run deploy
```

### Backend Options

#### Option 1: Render
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Use build command: `cd murf-backend && npm install`
4. Use start command: `cd murf-backend && npm start`

#### Option 2: Railway
1. Connect GitHub repository
2. Deploy from `murf-backend` folder
3. Set environment variables

#### Option 3: Vercel
1. Use `vercel --prod`
2. Configure for Node.js backend

## 📱 Usage

1. **Sign Up/Login**: Create account or login
2. **Medicine Reminders**: Set medicine schedules with voice alerts
3. **Memory Aids**: Add important dates with reminder times
4. **Emergency Contacts**: Store and organize emergency contacts
5. **Voice Interaction**: Use voice commands for navigation

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Secure API endpoints
- Input validation and sanitization

## 📊 Database Schema

- Users (authentication)
- Medicine reminders
- Memory aids
- Emergency contacts
- Mood entries

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 👥 Authors

- Development Team
- UI/UX Design
- Voice Integration

## 🙏 Acknowledgments

- Murf API for voice synthesis
- React community
- Open source contributors


## Screenshots of our app runned in local host

![WhatsApp Image 2025-07-27 at 02 22 19_e8a72304](https://github.com/user-attachments/assets/9ae6d756-90ed-4079-8269-707fa1c0f3f0)
