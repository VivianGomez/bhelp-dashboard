# 📊 BHelp Dashboard

<img width="1920" height="1080" alt="bhelpdashboard" src="https://github.com/user-attachments/assets/280627b7-ef52-43f5-b767-49195db7be23" />

Dashboard created to analyze user demographics and interaction data of **BHelp**, a mobile app designed to help parents manage their children’s tasks.  

The dashboard is built with **React.js** and connects to the mobile app database using **Firebase Firestore (2019 SDK)**.  
It includes interactive visualizations with **Chart.js**, **CanvasJS**, and **KendoReact**.

---

## 🚀 Key Features

- 📈 Visualization of user demographic data  
- 👨‍👩‍👧‍👦 Tracking parent–child interactions within the mobile app  
- 🔥 Real-time connection with **Firebase Firestore**  
- 📊 Dynamic charts powered by **Chart.js**, **CanvasJS**, and **KendoReact**  
- 🗂 Data export to PDF and CSV  
- 🖥 Responsive UI with dynamic menus  

---

## 🛠️ Tech Stack

- **Frontend**: React.js (16.8.6), React Router, React Burger Menu  
- **Charts & Visualization**: Chart.js, React-Chartjs-2, CanvasJS, KendoReact  
- **Database**: Firebase Firestore (SDK 5.10.1)  
- **Utilities**: PapaParse for CSV parsing, Bootstrap 4.3.1 for styling  

---

## ⚙️ Installation & Usage

1. Clone this repository:
   ```
   git clone https://github.com/VivianGomez/bhelp-dashboard.git
   cd bhelp-dashboard
   
2. Install dependencies:
   ```
   npm install
   
5. Configure Firebase credentials in:
   ```
   /src/services/firebase.js

7. Run the development server:
   ```
   npm start

9. Open in your browser:
    ```
    http://localhost:3000

##📦 Available Scripts

npm start → Runs the app in development mode

npm run build → Builds the app for production

npm test → Runs tests

npm run eject → Exposes the React configuration

##⚠️ Notes

This is a demo/prototype project, not intended for production use without further improvements.

Firebase SDK used is from 2019; upgrading may be required for compatibility.

##📜 License

This project is licensed under the MIT License.

##👩‍💻 Author

[Vivian Gómez]([url](https://viviangomez.github.io/#/))


