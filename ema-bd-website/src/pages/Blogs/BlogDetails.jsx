import { useLoaderData } from "react-router-dom";
import { SlLike } from "react-icons/sl";
import { GoComment } from "react-icons/go";
import { useState } from "react";


const BlogDetails = () => {
    const responseData = useLoaderData();
    const blogData = responseData.data;
    const [likes, setLikes] = useState(blogData.likes || 0);
    const [comments, setComments] = useState(blogData.comments || []);
    const [newComment, setNewComment] = useState("");

    const handleLike = () => {
        fetch(`http://localhost:5000/blogs/like/${blogData._id}/`, {
            method: 'POST'
        })
        .then(res => res.json())
        .then(data => {
            // setLikes(data.likes);
            console.log(data)
        });
    };

    const handleCommentSubmit = (event) => {
        event.preventDefault();
        const comment = {
            text: newComment,
            date: new Date().toISOString()
        };
        console.log(comment);
        
        // fetch(`http://localhost:5000/blogs/${blogData._id}/comment`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(comment)
        // })
        // .then(res => res.json())
        // .then(data => {
        //     setComments(data.comments);
        //     setNewComment("");
        // });
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
            <p>{blogData.text}</p>
            <div className="blog-interactions">
                <button className="like-button" onClick={handleLike}>
                    <SlLike className="icon"/> {likes}
                </button>
                <button className="comment-section">
                    <GoComment className="icon"/> {comments.length}
                </button>
            </div>
            <hr />
            <div className="comments-container">
                <h3>Comments</h3>
                <form onSubmit={handleCommentSubmit}>
                    <textarea
                        className="comment-box"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment"
                        rows="3"
                        required
                    ></textarea>
                    <button type="submit">Submit</button>
                </form>
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