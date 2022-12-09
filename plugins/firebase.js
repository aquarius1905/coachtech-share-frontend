// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBNfrPO6vDEukC1vGSPEQGanBXKZiRH11o",
  authDomain: "share-app-84535.firebaseapp.com",
  projectId: "share-app-84535",
  storageBucket: "share-app-84535.appspot.com",
  messagingSenderId: "283196730351",
  appId: "1:283196730351:web:41ab88920867e6b861e41a",
  measurementId: "G-01CP687020"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default analytics