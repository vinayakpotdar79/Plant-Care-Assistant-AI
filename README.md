# Flora- Plant Care Assistant AI 🌱

A comprehensive AI-powered plant care application that helps users identify plants, diagnose issues, and maintain healthy plants through intelligent reminders and care recommendations.

## 🌟 Features

### 1.Plant Identification
- Upload plant photos for instant identification
- Accurate species recognition using machine learning
- Detailed plant information and care instructions

### 2. Smart Plant Diagnosis
- AI-powered disease and problem detection
- Detailed treatment recommendations
- Preventive care suggestions

### 3. Personalized Plant Management
- Digital plant collection tracking
- Custom care schedules and reminders
- Health monitoring and progress tracking

### 4. Intelligent Care System
- Automated watering reminders
- Seasonal care recommendations
- Growth progress monitoring

### 5. User Engagement
- Achievement system and rewards
- Educational plant care tips
- Community features (future development)

## 🚀 Technology Stack

### Frontend
- **React** with modern hooks and context API
- **Tailwind CSS** for responsive styling
- **Lucide React** for beautiful icons
- **React Router** for navigation

### Backend
- **Node.js** with Express.js server
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Multer** for file uploads

### Storage
- **Cloudinary** for image storage
- Secure user data management

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vinayakpotdar79/Plant-Care-Assistant-AI.git
   cd Plant-Care-Assistant-AI
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   - Create `.env` files in both frontend and backend directories
   - Configure your MongoDB connection string
   - Add Cloudinary credentials for image uploads
   - Set up JWT secret key

4. **Run the application**
   ```bash
   # Start backend server (from backend directory)
   npm run dev

   # Start frontend development server (from frontend directory)
   npm start
   ```

## 🏗️ Project Structure

```
plant-care-assistant-ai/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Plant.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── plants.js
│   │   └── users.js
│   ├── middleware/
│   │   └── auth.js
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── assets/
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Plants
- `GET /api/plants` - Get user's plants
- `POST /api/plants` - Add new plant
- `GET /api/plants/:id` - Get plant details
- `PUT /api/plants/:id` - Update plant
- `DELETE /api/plants/:id` - Delete plant
- `PATCH /api/plants/:id/water` - Mark as watered

### AI Services
- `POST /api/identify` - Identify plant from image
- `POST /api/diagnose` - Diagnose plant issues

## 🌐 Usage

1. **Register/Login** - Create an account or sign in
2. **Add Plants** - Upload photos to identify and add plants to your collection
3. **Track Care** - Receive reminders and log plant care activities
4. **Diagnose Issues** - Get AI-powered diagnosis for plant problems
5. **Monitor Health** - Track plant growth and health over time

## 🛠️ Development

### Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Environment Variables
Backend `.env`:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
PLANT_API_KEY=your_plant_identification_api_key
```

Frontend `.env`:
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
