import firebase from "firebase";

if (!firebase.apps.length) {
  firebase.initializeApp({
  apiKey: "AIzaSyBNfrPO6vDEukC1vGSPEQGanBXKZiRH11o",
  authDomain: "share-app-84535.firebaseapp.com",
  projectId: "share-app-84535",
  storageBucket: "share-app-84535.appspot.com",
  messagingSenderId: "283196730351",
  appId: "1:283196730351:web:41ab88920867e6b861e41a",
  measurementId: "G-01CP687020",
  });
}

export default firebase;