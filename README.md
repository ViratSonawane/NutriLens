# NutriLens

**Your Personal AI Nutritionist for Indian Cuisine**

---

## Overview

NutriLens is a full-stack, AI-powered mobile application that solves a critical gap in nutrition tracking: **accurately analyzing complex, multi-item Indian meals**. While existing apps can track single items like an apple or a banana, they struggle with traditional Indian dishes like thalis, pav bhaji, or rajma rice.

Built entirely from scratch, NutriLens leverages a **custom-trained YOLOv8 computer vision model** to identify multiple Indian food items from a single photo, calculate comprehensive nutritional values, and track them against personalized health goals—all in real-time.

This project showcases end-to-end development capabilities: from data annotation and ML model training to full-stack application development and deployment.

---

## Key Features

### AI-Powered Food Recognition
- Custom-trained YOLOv8 object detection model for Indian cuisine
- Identifies multiple food items from a single photograph
- Real-time inference with optimized performance on mobile devices

### Complete Authentication System
- Email/Password authentication with secure password handling
- Google Sign-In integration for seamless onboarding
- Session management and secure token handling via Firebase

### Intelligent Nutrition Tracking
- Automatic calculation of calories, protein, carbs, and fats
- Personalized daily nutritional goals based on BMI and activity level
- Real-time progress tracking with intuitive visualizations

### Smooth User Experience
- Multi-step onboarding flow with BMI calculation
- Interactive dashboard with progress indicators
- Streak calendar with heatmap visualization for consistency tracking
- Modern, responsive UI built with NativeWind (Tailwind CSS for React Native)

### Cross-Platform Mobile App
- Built with React Native for native performance
- TypeScript for type safety and better developer experience
- Optimized for Android with production-ready build configuration

---

## Technology Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React Native, TypeScript, React Navigation, NativeWind |
| **State Management** | React Context API |
| **Backend** | Python, Flask, RESTful API |
| **Database** | Firebase Firestore (NoSQL) |
| **Authentication** | Firebase Authentication |
| **AI/ML** | YOLOv8, OpenCV, PyTorch |
| **Training & Annotation** | Roboflow, Google Colab |

---

## Application Screenshots

<table>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/aeeebec1-bd3e-4445-bfb9-38ef4a623b2e" width="250"/><br />
      <b>Login & Authentication</b>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/ac2217b6-43a7-4de1-a411-c6ce377d393f" width="250"/><br />
      <b>Personalized Onboarding</b>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/ff807832-f14c-46bc-8795-2142cc442c73" width="250"/><br />
      <b>Main Dashboard</b>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/dfdc311a-922e-4f11-9973-100888a5e687" width="250"/><br />
      <b>Main Dashboard</b>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/49dfbd84-c047-4c13-aa76-a8a9502bfdaa" width="250"/><br />
      <b>AI Food Analysis</b>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/5fa9fba4-4c1b-406e-9338-ed955689e68d" width="250"/><br />
      <b>Streak Calendar</b>
    </td>
  </tr>
</table>

---

## AI Model Development

The heart of NutriLens is a custom-trained **YOLOv8 object detection model** specifically designed for Indian cuisine recognition.

### Training Process

- **Dataset:** Custom-curated dataset of Indian food items
- **Annotation:** Hand-labeled using Roboflow
- **Training Environment:** Google Colab (GPU-accelerated)
- **Framework:** Ultralytics YOLOv8
- **Performance:** Optimized for mobile inference with quantization

### Resources

- **NutriLens Trained Model:** [Download from Hugging Face](https://huggingface.co/ViratSonawane/NutriLens-BackendModel/resolve/main/best.pt)
- **Dataset & Annotations:** [View on Roboflow](https://universe.roboflow.com/nutrilens-b0kk2/nutrilens_phase1-pex8h)
- **Training Notebook:** [View on Google Colab](https://colab.research.google.com/drive/1Pf26RzV0JAaCf6-Bk3YWATcFuQxeiBN6?usp=sharing)

The model achieves high accuracy in real-world scenarios and can simultaneously detect multiple food items in complex meal compositions.

---

## Project Architecture

```
NutriLens/
├── NutriLensApp/              # React Native mobile application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── screens/           # Screen components
│   │   ├── navigation/        # Navigation configuration
│   │   ├── contexts/          # Global state management
│   │   ├── services/          # API and Firebase services
│   │   └── utils/             # Helper functions
│   ├── android/               # Android-specific configuration
│   └── package.json
│
└── NutriLens-backend/         # Python Flask backend
    ├── app.py                 # Main Flask application
    ├── best.pt                # Trained YOLOv8 model (not in repo)
    ├── serviceAccountKey.json # Firebase Admin SDK (not in repo)
    └── requirements.txt       # Python dependencies
```

---

## Getting Started

### Prerequisites

Before running the project, ensure you have:

- **Node.js** (LTS version) and npm
- **Python 3.10+**
- **Android Studio** with Android SDK
- **Firebase Project** ([Create one here](https://console.firebase.google.com/))

---

### Backend Setup

Navigate to the backend directory and set up the environment:

```bash
cd NutriLens-backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```


#### Configure Firebase Admin

1. Go to [Firebase Console](https://console.firebase.google.com/) > Project Settings > Service Accounts
2. Click **"Generate new private key"** and download the JSON file
3. Rename it to `serviceAccountKey.json`
4. Place it in the `NutriLens-backend/` folder

#### Start the Backend Server

```bash
python app.py
```

The server will run at `http://127.0.0.1:5000`

---

### Frontend Setup

Navigate to the frontend directory and install dependencies:

```bash
cd NutriLensApp

# Install dependencies
npm install
```

#### Configure Firebase (Android)

1. In [Firebase Console](https://console.firebase.google.com/), add an **Android app**
2. Use package name: `com.nutrilensapp` (or your custom name)
3. Download `google-services.json`
4. Place it in `NutriLensApp/android/app/`

#### Run the Application

Open two separate terminals:

**Terminal 1 - Start Metro Bundler:**
```bash
npx react-native start
```

**Terminal 2 - Run on Android:**
```bash
npx react-native run-android
```

---

## Future Enhancements

- Expand food recognition to other regional cuisines
- Add meal planning and recipe suggestions
- iOS version with App Store deployment

---

## Contributing

This is an academic project developed at Sardar Patel Institute of Technology, Mumbai. Feedback and suggestions are welcome.

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## Authors

**Sardar Patel Institute of Technology, Mumbai**

<table>
  <tr>
    <td align="center">
      <b>Virat Sonawane</b><br/>
      <a href="https://www.linkedin.com/in/virat-sonawane">LinkedIn</a><br/>
      virat.sonawane23@spit.ac.in
    </td>
    <td align="center">
      <b>Yash Sonawane</b><br/>
      <a href="https://www.linkedin.com/in/yash-sonawane-298b08293/">LinkedIn</a><br/>
      yash.sonawane23@spit.ac.in
    </td>
    <td align="center">
      <b>Siddhesh Shinde</b><br/>
      <a href="https://www.linkedin.com/in/siddhesh-shinde-b08b64311/">LinkedIn</a><br/>
      siddhesh.shinde23@spit.ac.in
    </td>
  </tr>
</table>

---

## Acknowledgments.

- [Ultralytics YOLOv8](https://github.com/ultralytics/ultralytics) for the object detection framework.
- [Roboflow](https://roboflow.com/) for dataset management and annotation tools.
- [Firebase](https://firebase.google.com/) for authentication and database services.
- The React Native community for excellent documentation and support.

---

<div align="center">

**If you found this project interesting, please consider giving it a star!**

Made with dedication at Sardar Patel Institute of Technology, Mumbai

</div>
