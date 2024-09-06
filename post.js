import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

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
const db = getFirestore(app);
const auth = getAuth(app);

// Retrieve user data from localStorage
const user = JSON.parse(localStorage.getItem("user"));

if (user) {
    document.getElementById("userName").innerText = user.name;
    document.getElementById("userProfile").src = user.profileURL;
} else {
    // Redirect to sign-in page if user data is not found
    window.location.href = "index.html";
}

// Function to add a post to Firestore
async function addPost(content, postTitle, postimg) {
    try {
        await addDoc(collection(db, "posts"), {
            userName: user.name,
            userEmail: user.email,
            userProfileURL: user.profileURL,
            postContent: content,
            postTitle: postTitle,
            postImg: postimg,
            timestamp: new Date()
        });
        console.log("Post added successfully");
        displayPosts(); // Refresh posts
    } catch (e) {
        console.error("Error adding post: ", e);
    }
}

// Function to display posts from Firestore
async function displayPosts() {
    const postContainer = document.getElementById("postContainer");
    postContainer.innerHTML = ""; // Clear previous posts

    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        const postData = doc.data();

        const postElement = document.createElement("div");
        postElement.className = "post";
        postElement.innerHTML = `
            <div class="post-header">
              <img src="${postData.userProfileURL}" width="70px" />
              <div class="profile-post">
                <p>${postData.userName}</p>
                <p>${postData.userEmail}</p>
              </div>
              <i class="fa-solid fa-ellipsis"></i>
            </div>
            <div class="post-title">
              <h3>${postData.postTitle}</h3>
              <button>Add to Fav ❤️</button>
            </div>
        
            <p>${postData.postContent}</p>
               <img src="${postData.postImg}" alt="no image posted" class="postimg">
           
        `;
        postContainer.appendChild(postElement);
    });
}

// Event listener for the post submission
document.getElementById("submitPost").addEventListener("click", () => {
    const content = document.getElementById("postContent").value;
    const postTitle = document.getElementById("posttitle").value;
    const postimg = document.getElementById("postimg").value;
    if (content.trim() || postTitle.trim() !== "") {
        addPost(content, postTitle, postimg);
        document.getElementById("postContent").value = "";
         // Clear the input field
    } else {
        alert("Please enter some content before posting.");
    }
});

// Display posts on page load
window.onload = displayPosts;
