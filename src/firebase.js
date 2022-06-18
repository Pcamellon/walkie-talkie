import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyB2VUzB63jqLfNR042nBR1c2_MKTXHBw6g",
  authDomain: "walkie-talkie-bfbb0.firebaseapp.com",
  projectId: "walkie-talkie-bfbb0",
  storageBucket: "walkie-talkie-bfbb0.appspot.com",
  messagingSenderId: "982310790605",
  appId: "1:982310790605:web:1706f78fa6d9010eaf1084",
  measurementId: "G-V5J0MPCWG4"
};

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
export const auth = firebase.auth();
export const storage = firebase.storage();
