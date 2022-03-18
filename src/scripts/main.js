import { getUsers, getPosts, createPost,getPostsByID, editPost } from './data/DataManager.js'
import { PostList } from './feed/PostList.js'
import { NavBar} from './nav/NavBar.js'
import { PostEntry } from './feed/PostEntry.js'

const showNavBar = () => {
    const navElement = document.querySelector(".nav")
    navElement.innerHTML = NavBar()
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

  const clearInputs=()=>{
    const title = document.querySelector("input[name='postTitle']").value = null
    const url = document.querySelector("input[name='postURL']").value = null
    const description = document.querySelector("textarea[name='postDescription']").value = null
    const postId = document.querySelector("input[name='postId']").value = null



};
  const applicationElement = document.querySelector(".giffygram");
  applicationElement.addEventListener("click", event => {
      if (event.target.id === "newPost__cancel") {
          //clear the input fields
          clearInputs()
      }
    })
  applicationElement.addEventListener("click", event => {
      event.preventDefault();
      if (event.target.id === "newPost__submit") {
          //collect the input values into an object to post to the DB
          const title = document.querySelector("input[name='postTitle']").value
          const url = document.querySelector("input[name='postURL']").value
          const description = document.querySelector("textarea[name='postDescription']").value
          const postId = document.querySelector("input[name='postId']").value
          //we have not created a user yet - for now, we will hard code `1`.
          //we can add the current time as well
          const postObject = {
              id: postId || null,
              title: title,
              imageURL: url,
              description: description,
              userId: 1,
              timestamp: Date.now()
            }

            
            // be sure to import from the DataManager
            if(postId){
                editPost(postObject).then(showPostList)
            }else{

                createPost(postObject).then(showPostList)
            }
            clearInputs()
            
    }
  })

const handleEdit = ((id)=>{
    getPostsByID(id).then((postData)=> {
        //set form fields to selected ID
               document.querySelector("input[name='postTitle']").value = postData.title
                document.querySelector("input[name='postURL']").value = postData.imageURL
                document.querySelector("textarea[name='postDescription']").value = postData.description
                document.querySelector("input[name='postId']").value = postData.id
                        
    
    })
  
})
  applicationElement.addEventListener("click", (event) => {
	
	if (event.target.id.startsWith("edit")){
	

        const postId = event.target.id.split("--")[1]
        handleEdit(postId)
        
	}
})
applicationElement.addEventListener("click", event => {
    if (event.target.id === "directMessageIcon") {
        //clear the input fields
        alert("Don't touch my pen!");
    }
  })
  applicationElement.addEventListener("click", event => {
    if (event.target.id === "peanutButterIcon") {
        //clear the input fields
        alert("It's Peanut Butter Jelly Time! Go Home!");
    }
  })







 
const startGiffyGram = () => {
    const postElement = document.querySelector(".postList");
    postElement.innerHTML = "Hello Cohort 47";
    showNavBar();
    showPostList();
    showPostEntry();
}

startGiffyGram();
