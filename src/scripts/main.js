import { getUsers, getPosts, createPost } from './data/DataManager.js'
import { PostList } from './feed/PostList.js'
import { NavBar} from './nav/NavBar.js'
import { PostEntry } from './feed/PostEntry.js'

const showNavBar = () => {
    const navElement = document.querySelector(".navigation")
    navElement.innerHtml = NavBar()
}

const showPostList = () => {
    //Get a reference to the location on the DOM where the list will display
	const postElement = document.querySelector(".postList");
	getPosts().then((allPosts) => {
        postElement.innerHTML = PostList(allPosts);
	})
}

const showPostEntry = () => { 
    //Get a reference to the location on the DOM where the nav will display
    const entryElement = document.querySelector(".entryForm");
    entryElement.innerHTML = PostEntry();
  }

  const applicationElement = document.querySelector(".giffygram");
  applicationElement.addEventListener("click", event => {
      if (event.target.id === "newPost__cancel") {
          //clear the input fields
      }
    })
  applicationElement.addEventListener("click", event => {
      event.preventDefault();
      if (event.target.id === "newPost__submit") {
          //collect the input values into an object to post to the DB
          const title = document.querySelector("input[name='postTitle']").value
          const url = document.querySelector("input[name='postURL']").value
          const description = document.querySelector("textarea[name='postDescription']").value
          //we have not created a user yet - for now, we will hard code `1`.
          //we can add the current time as well
          const postObject = {
              title: title,
              imageURL: url,
              description: description,
              userId: 1,
              timestamp: Date.now()
            }
            
            // be sure to import from the DataManager
            createPost(postObject)
    }
  })

const startGiffyGram = () => {
    const postElement = document.querySelector(".postList");
    // postElement.innerHTML = "Hello Cohort 47"
    showPostList();
    showNavBar();
    showPostEntry();
}

// applicationElement.addEventListener("click", (event) => {
    
//     if (event.target.id.startsWith("edit")){
//         console.log("post clicked", event.target.id.split("--"))
// 		console.log("the id is", event.target.id.split("--")[1])
// 	}
// })

//  startGiffyGram() => {
// 	showPostList();
// }
// Are you defining the function here or invoking it?

// getUsers()
// .then(data => {
//     console.log("User Data", data)
// })
startGiffyGram();
