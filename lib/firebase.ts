import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCkrSSSdM408nURoQxjeugA6ZGfdbNd2KQ',
  authDomain: 'fireship-blog.firebaseapp.com',
  projectId: 'fireship-blog',
  storageBucket: 'fireship-blog.appspot.com',
  messagingSenderId: '13212831676',
  appId: '1:13212831676:web:60e04f00bb6c484af5e5b9',
  measurementId: 'G-C1DZHXHNVZ',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export const firestore = firebase.firestore();
export const storage = firebase.storage();
