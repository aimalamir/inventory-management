// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDqbqF7jEdtwSPrquwCs3II63y0bIkv1SY",
  authDomain: "inventory-management-3ec62.firebaseapp.com",
  projectId: "inventory-management-3ec62",
  storageBucket: "inventory-management-3ec62.appspot.com",
  messagingSenderId: "782057314461",
  appId: "1:782057314461:web:2e3065518f3d40e652dc74",
  measurementId: "G-VS8L83EKNR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app)

export { firestore }