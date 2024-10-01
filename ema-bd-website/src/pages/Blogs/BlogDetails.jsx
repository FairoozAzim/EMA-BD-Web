// import { useLoaderData } from "react-router-dom";
// import { SlLike } from "react-icons/sl";
// import { GoComment } from "react-icons/go";
// import Modal from '../../components/Modal/Modal';
// import { useState } from "react";


// const BlogDetails = () => {
//     const responseData = useLoaderData();
//     const blogData = responseData.data;
//     const [likes, setLikes] = useState(blogData.likes || 0);
//     const [comments, setComments] = useState(blogData.comments || []);
//     const [isOpen, setIsOpen] = useState(false);

//     const handleLike = () => {
//        const updateLikes = parseInt(blogData.likes) + 1;
//        setLikes(updateLikes);
//        fetch("http://localhost:5000/blogComment", {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       })
//       .then(res => res.json())   
//       .then(data => {
//         console.log('post response', data);
//     })};

//     const openModal = () => {
//         setIsOpen(true);
//       };
    
//     const closeModal = () => {
//         setIsOpen(false);
//       };
 
//     const handleCommentSubmit = () => {
//      event.preventDefault();
//      let formData = new FormData()
//      const form = event.target;
//      formData.append("name",form.name.value);
//      formData.append("email",form.email.value);
//      formData.append("comment", form.comment.value);
    
//      fetch("http://localhost:5000/blogComment", {
//        method: 'POST',
//        body: formData
//      })
//      .then(res => res.json())   
//      .then(data => {
//        console.log('post response', data);
//        alert(data.message);
//        setComments(prevComments => [...prevComments, data.data]);
//        form.reset();
//        setIsOpen(false);
//      })
//     }
//     return (
//         <div className="mt-10 blog-details-container">
//             <h1>{blogData.title}</h1>
//             <div className="blog-author">
//                 <p>By {blogData.author}  .  <span>{blogData.date}</span></p> 
//             </div>
//             <div className="blog-banner-container">
//                 <img className='blog-banner' src={`http://localhost:5000/uploads/${blogData.blogImage}`} alt="Blog banner" />
//             </div>
//             <pre>{blogData.text}</pre>
//             <hr/>
//             <div className="blog-interactions">
//                 <button className="like-button" onClick={handleLike}>
//                     <SlLike className="icon"/> {likes}
//                 </button>
//                 <button className="comment-section">
//                     <GoComment className="icon" onClick={openModal}/>
//                 </button>
//             </div>
//             {/* <hr />
//             <div className="comments-container">
//                 <h3>Comments</h3>
//                 <div className="comments-list">
//                     {comments.map((comment, index) => (
//                         <div key={index} className="comment">
//                             <p>{comment.text}</p>
//                             <small>{new Date(comment.date).toLocaleString()}</small>
//                         </div>
//                     ))}
//                 </div>
//             </div> */}
//         </div>
//     );
// };

// export default BlogDetails;

import { useLoaderData } from "react-router-dom";

// import { useState } from "react";
// import './BlogDetails.css'; // Assuming you'll add CSS here for styling

const BlogDetails = () => {
    const responseData = useLoaderData();
    const blogData = responseData.data;
    // const [comments, setComments] = useState(blogData.comments || []);
 

    const handleCommentSubmit = (event) => {
        event.preventDefault();
        let formData = new FormData()
        const form = event.target;
        const newComment = {
          "name": form.name.value,
          "email" : form.email.value,
          "comment" : form.comment.value,
         
        }
        for (const key in newComment){
          formData.append(key, newComment[key]);
        }
       console.log(formData);

      fetch("http://localhost:5000/blogComment", {
              method: 'POST',
              body: formData,
          })
          .then(res => res.json())   
          .then(data => {
              console.log('post response', data);
              alert(data.message);
              // setComments(prevComments => [...prevComments, data.data]);
              form.reset();
              
          });
    };

    return (
        <div className="mt-10 blog-details-container">
            <h1>{blogData.title}</h1>
            <div className="blog-author">
                <p>By {blogData.author}  .  <span>{blogData.date}</span></p> 
            </div>
            <div className="blog-banner-container">
                <img className='blog-banner' src={`http://localhost:5000/uploads/${blogData.blogImage}`} alt="Blog banner" />
            </div>
            <pre>{blogData.text}</pre>
            <hr/>
            <div className="blog-interactions d-flex">
            <h3 className="mt-10">Have Questions? Leave us a comment! </h3>
            </div>

                <div className="comment-box">
                 
                    <form className="comment-form" onSubmit={handleCommentSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input type="text" id="name" name="name" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" name="email" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="comment">Comment</label>
                            <textarea id="comment" name="comment" required></textarea>
                        </div>
                        <button type="submit" className="submit-comment">Submit</button>
                    </form>
                </div>
           
        </div>
    );
};

export default BlogDetails;
