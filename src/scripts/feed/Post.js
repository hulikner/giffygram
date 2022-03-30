import { getLikes, getLoggedInUser } from "../data/DataManager.js";
import { getUsers } from "../data/DataManager.js";
const getNumberOfLikes = (postId) => {
  getLikes(postId).then((response) => {
    document.querySelector(`#likes__${postId}`).innerHTML = `👍 ${response.length}`;
  });
};
export const Post = (postObject) => {
  console.log(getLoggedInUser());
  const logUserId = getLoggedInUser().id;
  if (getLoggedInUser().id === postObject.userId) {
    return `
      <section class="post">
        <header>
            <h2 class="post__title">${postObject.title}</h2>
            
            <div> By: ${postObject.user.name}</div>
        </header>
        <img class="post__image" src="${postObject.imageURL}" />
        <p class="postDescription" type="text area">${postObject.description}</p>
        <div> 
        <button id="edit--${postObject.id}">Edit</button> 
        <button id="delete__${postObject.id}">Delete</button> 
        <button id="like__${postObject.id}">Like</button>
        </div>
        <p id="likes__${postObject.id}">👍 ${getNumberOfLikes(postObject.id)}</p>


      </section>
    `;
  } else {
    return `
          <section class="post">
            <header>
                <h2 class="post__title">${postObject.title}</h2>
                <div> By: ${postObject.user.name}</div>
            </header>
            <img class="post__image" src="${postObject.imageURL}" />
            <p class="postDescription" type="text area">${postObject.description}</p>
            <div>  <button id="like__${postObject.id}">Like</button>
            </div>
            <p id="likes__${postObject.id}">👍 ${getNumberOfLikes(postObject.id)}</p>
    
    
          </section>
        `;
  }
};
