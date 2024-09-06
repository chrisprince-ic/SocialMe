// Import necessary Firebase modules
import { getFirestore, doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

const db = getFirestore();
const auth = getAuth();

// Handle like button click
async function handleLike(postId) {
  const user = auth.currentUser;
  if (!user) {
    alert("You need to sign in to like posts.");
    return;
  }

  const postRef = doc(db, "posts", postId);
  const postSnapshot = await getDoc(postRef);

  if (!postSnapshot.exists()) {
    console.error("Post not found!");
    return;
  }

  const post = postSnapshot.data();
  const userEmail = user.email;

  try {
    // Check if user has already liked the post
    if (post.likes && post.likes.includes(userEmail)) {
      // Unlike the post
      await updateDoc(postRef, {
        likes: arrayRemove(userEmail),
      });
    } else {
      // Like the post
      await updateDoc(postRef, {
        likes: arrayUnion(userEmail),
      });
    }
    // Refresh posts to reflect changes
    displayPosts();
  } catch (error) {
    console.error("Error updating like: ", error);
  }
}
