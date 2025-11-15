# NutriLens
An AI-powered mobile app to analyze Indian meals from a photo. Built with React Native, Python/Flask, and a custom-trained YOLOv8 model.

Show Image
Show Image
Show Image
Show Image
Show Image
Show Image

**Overview**
NutriLens is a full-stack, AI-powered mobile application that solves a critical gap in nutrition tracking: accurately analyzing complex, multi-item Indian meals. While existing apps can track single items like an apple or a banana, they struggle with traditional Indian dishes like thalis, pav bhaji, or rajma rice.
Built entirely from scratch, NutriLens leverages a custom-trained YOLOv8 computer vision model to identify multiple Indian food items from a single photo, calculate comprehensive nutritional values, and track them against personalized health goals—all in real-time.
This project showcases end-to-end development capabilities: from data annotation and ML model training to full-stack application development and deployment.

**Key Features**

**1) AI-Powered Food Recognition**
Custom-trained YOLOv8 object detection model for Indian cuisine
Identifies multiple food items from a single photograph
Real-time inference with optimized performance on mobile devices

**2) Complete Authentication System**
Email/Password authentication with secure password handling
Google Sign-In integration for seamless onboarding
Session management and secure token handling via Firebase

**3) Intelligent Nutrition Tracking**
Automatic calculation of calories, protein, carbs, and fats
Personalized daily nutritional goals based on BMI and activity level
Real-time progress tracking with intuitive visualizations

**4) Smooth User Experience**
Multi-step onboarding flow with BMI calculation
Interactive dashboard with progress indicators
Streak calendar with heatmap visualization for consistency tracking
Modern, responsive UI built with NativeWind (Tailwind CSS for React Native)

**5) Cross-Platform Mobile App**
Built with React Native for native performance
TypeScript for type safety and better developer experience
Optimized for Android with production-ready build configuration


**Technology Stack**
LayerTechnologiesFrontendReact Native, TypeScript, React Navigation, NativeWindState ManagementReact Context APIBackendPython, Flask, RESTful APIDatabaseFirebase Firestore (NoSQL)AuthenticationFirebase AuthenticationAI/MLYOLOv8, OpenCV, PyTorchTraining & AnnotationRoboflow, Google Colab

![Image](https://github.com/user-attachments/assets/ac2217b6-43a7-4de1-a411-c6ce377d393f)
![Image](https://github.com/user-attachments/assets/aeeebec1-bd3e-4445-bfb9-38ef4a623b2e)
![Image](https://github.com/user-attachments/assets/dfdc311a-922e-4f11-9973-100888a5e687)
![Image](https://github.com/user-attachments/assets/ff807832-f14c-46bc-8795-2142cc442c73)
![Image](https://github.com/user-attachments/assets/49dfbd84-c047-4c13-aa76-a8a9502bfdaa)
![Image](https://github.com/user-attachments/assets/5fa9fba4-4c1b-406e-9338-ed955689e68d)

**Application Screenshots**
<table>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/ac2217b6-43a7-4de1-a411-c6ce377d393f" alt="Login Screen" width="250"/><br />
      <b>Login & Authentication</b>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/aeeebec1-bd3e-4445-bfb9-38ef4a623b2e" alt="Onboarding" width="250"/><br />
      <b>Personalized Onboarding</b>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/dfdc311a-922e-4f11-9973-100888a5e687" alt="Dashboard" width="250"/><br />
      <b>Main Dashboard</b>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/ff807832-f14c-46bc-8795-2142cc442c73" alt="AI Analysis" width="250"/><br />
      <b>AI Food Analysis</b>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/49dfbd84-c047-4c13-aa76-a8a9502bfdaa" alt="Streak Tracker" width="250"/><br />
      <b>Streak Calendar</b>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/5fa9fba4-4c1b-406e-9338-ed955689e68d" alt="Profile" width="250"/><br />
      <b>User Profile</b>
    </td>
  </tr>
</table>

**AI Model Development**
The heart of NutriLens is a custom-trained YOLOv8 object detection model specifically designed for Indian cuisine recognition.
Training Process

Dataset: Custom-curated dataset of Indian food items
Annotation: Hand-labeled using Roboflow
Training Environment: Google Colab (GPU-accelerated)
Framework: Ultralytics YOLOv8
Performance: Optimized for mobile inference with quantization

NutriLens AI Model: https://huggingface.co/ViratSonawane/NutriLens-BackendModel/resolve/main/best.pt
Dataset & Annotations: roboflow link
View Training Notebook: Google Colab Link (Optional: Add your Colab share link here)
The model achieves high accuracy in real-world scenarios and can simultaneously detect multiple food items in complex meal compositions.

**Project Architecture**
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

**Prerequisites**
Before running the project, ensure you have:

Node.js (LTS version) and npm
Python 3.10+
Android Studio with Android SDK
Firebase Project


**Backend Setup**
bash# Navigate to backend directory
cd NutriLens-backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
Download AI Model
The custom-trained YOLOv8 model is not included in this repository due to file size.
Download: Model Download Link (Add your Hugging Face, Google Drive, or GitHub Release link)
Place best.pt in the NutriLens-backend/ folder.
Configure Firebase Admin

Go to Firebase Console → Project Settings → Service Accounts
Click "Generate new private key" and download the JSON file
Rename it to serviceAccountKey.json
Place it in NutriLens-backend/ folder

bash# Start the backend server
python app.py
Server runs at http://127.0.0.1:5000

**Frontend Setup**
bash# Navigate to frontend directory
cd NutriLensApp

# Install dependencies
npm install
Configure Firebase (Android)

In Firebase Console, add an Android app
Use package name: com.nutrilensapp (or you can give a custom name)
Download google-services.json
Place it in NutriLensApp/android/app/

**Run the Application**
Open two terminals:
Terminal 1 - Start Metro Bundler:
bashnpx react-native start
Terminal 2 - Run on Android:
bashnpx react-native run-android

**Future Enhancements**

 Expand food recognition to other regional cuisines
 Add meal planning and recipe suggestions
 iOS version with App Store deployment

**License**
This project is licensed under the MIT License - see the LICENSE file for details.

**Authors**
Sardar Patel Institute of Technology, Mumbai
<table>
  <tr>
    <td align="center">
      <b>Virat Sonawane</b><br/>
      <a href="www.linkedin.com/in/virat-sonawane">LinkedIn</a> • <a href="">GitHub</a><br/>
      virat.sonawane23@soit.ac.in
    </td>
    <td align="center">
      <b>Yash Sonawane</b><br/>
      <a href="https://www.linkedin.com/in/yash-sonawane-298b08293/">LinkedIn</a> • <a href="#">GitHub</a><br/>
      yash.sonawane23@spit.ac.in
    </td>
    <td align="center">
      <b>Siddhesh Shinde</b><br/>
      <a href="https://www.linkedin.com/in/siddhesh-shinde-b08b64311/">LinkedIn</a> • <a href="#">GitHub</a><br/>
      siddhesh.shinde23@spit.ac.in
    </td>
  </tr>
</table>
