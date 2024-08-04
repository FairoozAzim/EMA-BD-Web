import { useLoaderData } from "react-router-dom";
import { SlLike } from "react-icons/sl";
import { GoComment } from "react-icons/go";
import Modal from '../../components/Modal/Modal';
import { useState } from "react";


const BlogDetails = () => {
    const responseData = useLoaderData();
    const blogData = responseData.data;
    const [likes, setLikes] = useState(blogData.likes || 0);
    const [comments, setComments] = useState(blogData.comments || []);
    const [isOpen, setIsOpen] = useState(false);

    const handleLike = () => {
    
    };

    const openModal = () => {
        setIsOpen(true);
      };
    
    const closeModal = () => {
        setIsOpen(false);
      };
    
    const handleCommentSubmit = () => {
     event.preventDefault();
     let formData = new FormData()
     const form = event.target;
     formData.append("name",form.name.value);
     formData.append("email",form.email.value);
     formData.append("comment", form.comment.value);
    
     fetch("http://localhost:5000/blogComment", {
       method: 'POST',
       body: formData
     })
     .then(res => res.json())
     .then(data => {
       console.log('post response', data);
       alert(data.message);
       setComments(prevComments => [...prevComments, data.data]);
       form.reset();
       setIsOpen(false);
     })
    }
    return (
        <div className="mt-10 blog-details-container">
            <h1>{blogData.title}</h1>
            <div className="blog-author">
                <p>By {blogData.author}  .  <span>{blogData.date}</span></p> 
            </div>
            <div className="blog-banner-container">
                <img className='blog-banner' src={`http://localhost:5000/uploads/${blogData.blogImage}`} alt="Blog banner" />
            </div>
            <p>{blogData.text}</p>
            <div className="blog-interactions">
                <button className="like-button" onClick={handleLike}>
                    <SlLike className="icon"/> {likes}
                </button>
                <button className="comment-section">
                    <GoComment className="icon" onClick={openModal}/>
                </button>
                <Modal isOpen={isOpen} onClose={closeModal}>
                   <h3 className='text-center'>Create a Blog</h3>
                   <form className='create-form' onSubmit={handleCommentSubmit}>
                     <div className='form-content'>
                      <input name='name' type='text' placeholder='Your Name'></input>
                      <input name='email' type='email' placeholder='Your Email'></input>
                      <textarea name='comment' type='text' placeholder='Write a response' rows={20}></textarea>
                      <button className='submit btn-submit' type='submit'>Submit</button>
                     </div>
                     
                   </form>
                 </Modal>
            </div>
            <hr />
            <div className="comments-container">
                <h3>Comments</h3>
                <div className="comments-list">
                    {comments.map((comment, index) => (
                        <div key={index} className="comment">
                            <p>{comment.text}</p>
                            <small>{new Date(comment.date).toLocaleString()}</small>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogDetails;