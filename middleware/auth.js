import firebase from "../plugins/firebase";

export default function ({ redirect }) {
  firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
      redirect('/login');
    }
  });
}