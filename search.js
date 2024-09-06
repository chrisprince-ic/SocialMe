function displayPosts(querySnapshot) {
    const postsContainer = document.querySelector(".post-container");
    postsContainer.innerHTML = ""; // Clear any existing posts
  
    querySnapshot.forEach((doc) => {
      const post = doc.data();
      const profileURL = post.userProfileURL || 'path/to/default/profile-image.jpg';
  
      const postElement = document.createElement("div");
      postElement.classList.add("post");
  
      postElement.innerHTML = `
        <div class="post-header">
          <img src="${profileURL}" width="70px" />
          <div class="profile-post">
            <p>${post.userName}</p>
            <p>${post.userEmail}</p>
          </div>
          <i class="fa-solid fa-ellipsis"></i>
        </div>
        <div class="post-title">
          <h3>${post.postContent}</h3>
          <button>Review</button>
        </div>
        <p>${post.postText}</p>
        <div class="postfooter">
          <i class="fa-regular fa-share-from-square"></i>
          <i class="fa-regular fa-bookmark"></i>
        </div>
      `;
  
      postsContainer.appendChild(postElement);
    });
  }
  