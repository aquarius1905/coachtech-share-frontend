import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBNfrPO6vDEukC1vGSPEQGanBXKZiRH11o",
  authDomain: "share-app-84535.firebaseapp.com",
  projectId: "share-app-84535",
  storageBucket: "share-app-84535.appspot.com",
  messagingSenderId: "283196730351",
  appId: "1:283196730351:web:41ab88920867e6b861e41a",
  measurementId: "G-01CP687020"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);