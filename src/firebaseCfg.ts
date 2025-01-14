// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDC9ENSSdZRL--kicSTnQM514-J9X8t4YU",
  authDomain: "projektpai-5cf27.firebaseapp.com",
  projectId: "projektpai-5cf27",
  storageBucket: "projektpai-5cf27.firebasestorage.app",
  messagingSenderId: "381099129870",
  appId: "1:381099129870:web:6eb705ce34f407e05bd05f",
  measurementId: "G-TSTP3V8VBN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// @ts-ignore: TS6133
const analytics = getAnalytics(app);