// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDGCV1sSL_XqS757Oitpo0XoHGpvqVuIkM",
  authDomain: "myservices-7ab69.firebaseapp.com",
  projectId: "myservices-7ab69",
  storageBucket: "myservices-7ab69.firebasestorage.app",
  messagingSenderId: "360051974330",
  appId: "1:360051974330:web:3527cda3da8489d81f2283",
  measurementId: "G-413F82JPRV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);