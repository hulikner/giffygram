import { PostList } from "./feed/PostList.js";
import { NavBar } from "./nav/NavBar.js";
import { PostEntry } from "./feed/PostEntry.js";
import { LoginForm } from "../auth/LoginForm.js";
import { RegisterForm } from "../auth/RegisterForm.js";
import { getUsers, getPosts, createPost, getPostsByID, editPost, usePostCollection, postLike } from "./data/DataManager.js";
import { setLoggedInUser, getLoggedInUser, logoutUser, registerUser, loginUser, deletePost } from "./data/DataManager.js";

const showNavBar = () => {
  const navElement = document.querySelector(".nav");
  navElement.innerHTML = NavBar();
};

const checkForUser = () => {
  if (sessionStorage.getItem("user")) {
    setLoggedInUser(JSON.parse(sessionStorage.getItem("user")));
    startGiffyGram();
  } else {
    showLoginRegister();
  }
};

document.addEventListener("click", (event) => {
  event.preventDefault();
  if (event.target.id.startsWith("like")) {
    const likeObject = {
      postId: parseInt(event.target.id.split("__")[1]),
      userId: getLoggedInUser().id,
    };
    postLike(likeObject).then((response) => {
      showPostList();
    });
  }
});

document.addEventListener("click", (event) => {
  if (event.target.id === "logout") {
    logoutUser();
    console.log(getLoggedInUser());
    sessionStorage.clear();
    checkForUser();
  }
});

document.addEventListener("click", (event) => {
  event.preventDefault();
  if (event.target.id === "register__submit") {
    //collect all the details into an object
    const userObject = {
      name: document.querySelector("input[name='registerName']").value,
      email: document.querySelector("input[name='registerEmail']").value,
    };
    registerUser(userObject).then((dbUserObj) => {
      sessionStorage.setItem("user", JSON.stringify(dbUserObj));
      startGiffyGram();
    });
  }
});

document.addEventListener("click", (event) => {
  event.preventDefault();
  if (event.target.id === "login__submit") {
    //collect all the details into an object
    const userObject = {
      name: document.querySelector("input[name='name']").value,
      email: document.querySelector("input[name='email']").value,
    };
    loginUser(userObject).then((dbUserObj) => {
      if (dbUserObj) {
        sessionStorage.setItem("user", JSON.stringify(dbUserObj));
        startGiffyGram();
      } else {
        //got a false value - no user
        const entryElement = document.querySelector(".entryForm");
        entryElement.innerHTML = `<p class="center">That user does not exist. Please try again or register for your free account.</p> ${LoginForm()} <hr/> <hr/> ${RegisterForm()}`;
      }
    });
  }
});

const showLoginRegister = () => {
  showNavBar();
  const entryElement = document.querySelector(".entryForm");
  //template strings can be used here too
  entryElement.innerHTML = `${LoginForm()} <hr/> <hr/> ${RegisterForm()}`;
  //make sure the post list is cleared out too
  const postElement = document.querySelector(".postList");
  postElement.innerHTML = "";
};

document.addEventListener("click", (event) => {
  if (event.target.id === "logout") {
    logoutUser();
    console.log(getLoggedInUser());
  }
});

document.addEventListener("click", (event) => {
  event.preventDefault();
  if (event.target.id.startsWith("delete")) {
    const postId = event.target.id.split("__")[1];
    deletePost(postId).then((response) => {
      showPostList();
    });
  }
});

const showPostList = () => {
  //Get a reference to the location on the DOM where the list will display
  const postElement = document.querySelector(".postList");
  getPosts().then((allPosts) => {
    postElement.innerHTML = PostList(allPosts);
  });
};

const showPostEntry = () => {
  //Get a reference to the location on the DOM where the nav will display
  const entryElement = document.querySelector(".entryForm");
  entryElement.innerHTML = PostEntry();
};

const clearInputs = () => {
  const title = (document.querySelector("input[name='postTitle']").value = null);
  const url = (document.querySelector("input[name='postURL']").value = null);
  const description = (document.querySelector("textarea[name='postDescription']").value = null);
  const postId = (document.querySelector("input[name='postId']").value = null);
};
const applicationElement = document.querySelector(".giffygram");
applicationElement.addEventListener("click", (event) => {
  if (event.target.id === "newPost__cancel") {
    //clear the input fields
    clearInputs();
  }
});
applicationElement.addEventListener("click", (event) => {
  event.preventDefault();
  if (event.target.id === "newPost__submit") {
    //collect the input values into an object to post to the DB
    const title = document.querySelector("input[name='postTitle']").value;
    const url = document.querySelector("input[name='postURL']").value;
    const description = document.querySelector("textarea[name='postDescription']").value;
    const postId = document.querySelector("input[name='postId']").value;
    //we have not created a user yet - for now, we will hard code `1`.
    //we can add the current time as well
    const postObject = {
      id: postId || null,
      title: title,
      imageURL: url,
      description: description,
      userId: getLoggedInUser().id,
      timestamp: Date.now(),
    };

    // be sure to import from the DataManager
    if (postId) {
      editPost(postObject).then(showPostList);
    } else {
      createPost(postObject).then(showPostList);
    }
    clearInputs();
  }
});

const handleEdit = (id) => {
  getPostsByID(id).then((postData) => {
    //set form fields to selected ID
    document.querySelector("input[name='postTitle']").value = postData.title;
    document.querySelector("input[name='postURL']").value = postData.imageURL;
    document.querySelector("textarea[name='postDescription']").value = postData.description;
    document.querySelector("input[name='postId']").value = postData.id;
  });
};
applicationElement.addEventListener("click", (event) => {
  if (event.target.id.startsWith("edit")) {
    const postId = event.target.id.split("--")[1];
    if (getLoggedInUser().id === postId.userId) {
      handleEdit(postId);
    }
  }
});
applicationElement.addEventListener("click", (event) => {
  if (event.target.id === "directMessageIcon") {
    //clear the input fields
    alert("Don't touch my pen!");
  }
});
applicationElement.addEventListener("click", (event) => {
  if (event.target.id === "peanutButterIcon") {
    //clear the input fields
    alert("It's Peanut Butter Jelly Time! Go Home!");
  }
});

const showFilteredPosts = (year) => {
  //get a copy of the post collection
  const epoch = Date.parse(`01/01/${year}`);
  //filter the data
  const filteredData = usePostCollection().filter((singlePost) => {
    if (singlePost.timestamp >= epoch) {
      return singlePost;
    }
  });
  const postElement = document.querySelector(".postList");
  postElement.innerHTML = PostList(filteredData);
};

applicationElement.addEventListener("change", (event) => {
  if (event.target.id === "yearSelection") {
    const yearAsNumber = parseInt(event.target.value);
    console.log(`User wants to see posts since ${yearAsNumber}`);
    //invoke a filter function passing the year as an argument
    showFilteredPosts(yearAsNumber);
  }
});

export const showFooter = () => {
  //Get a reference to the location on the DOM where the nav will display
  const footerElement = document.querySelector("footer");
  footerElement.innerHTML = `
<footer class="footer">
    <div class="footer__item">
        Posts since <select id="yearSelection">
            <option>2020</option>
            <option>2019</option>
            <option>2018</option>
            <option>2017</option>
        </select>
        <span id="postCount">0</span>
    </div>
    <div> &copy NSS Cohort 55</div>
</footer>
`;
};

const startGiffyGram = () => {
  const postElement = document.querySelector(".postList");
  // postElement.innerHTML = "Hello Cohort 47";
  showNavBar();
  showPostList();
  showPostEntry();
  showFooter();
};

checkForUser()
