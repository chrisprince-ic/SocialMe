// Import the necessary functions from the Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-analytics.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB1PhJlVoDQeOiGIpwHyWOV3n07xnO_q14",
  authDomain: "socialmedia-95388.firebaseapp.com",
  projectId: "socialmedia-95388",
  storageBucket: "socialmedia-95388.appspot.com",
  messagingSenderId: "830446529214",
  appId: "1:830446529214:web:03cbab21e615e792408cef",
  measurementId: "G-G05VDZRQGY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize the Google provider
const provider = new GoogleAuthProvider();

let googleSigninBtn = document.getElementById("googleSigninBtn");

googleSigninBtn.addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then(async (result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;

      // Prepare user data
      const userData = {
        email: user.email,
        name: user.displayName,
        profileURL: user.photoURL,
        uid: user.uid,  // Using Firebase User ID as a unique identifier
      };

      try {
        // Save user data to Firestore
        await setDoc(doc(db, "users", user.uid), userData);

        // Save user data to localStorage
        localStorage.setItem("user", JSON.stringify(userData));

        console.log('User signed in and data saved: ', userData);

        // Redirect to home.html
        window.location.href = "Home.html";
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.error('Error signing in: ', errorMessage);
    });
});

// Check if user is already logged in
window.onload = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    // Redirect to home.html if user is already logged in
    window.location.href = "Home.html";
  }
};
