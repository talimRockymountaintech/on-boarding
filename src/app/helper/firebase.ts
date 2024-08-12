

import firebase from "firebase";
import 'firebase/storage';



// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCp-dER9STMFtSz-0eY95uih6ZT7YHJcas",
    authDomain: "loopos-caf93.firebaseapp.com",
    projectId: "loopos-caf93",
    storageBucket: "loopos-caf93.appspot.com",
    messagingSenderId: "114185421631",
    appId: "1:114185421631:web:51deaac88b773a8b25898a"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

const auth = firebase.auth();
const store = firebase.storage();

export { db, auth, store }





