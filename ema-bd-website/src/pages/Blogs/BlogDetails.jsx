import { useLoaderData } from "react-router-dom";
import { useState } from "react";
// import './BlogDetails.css'; // Assuming you'll add CSS here for styling

const BlogDetails = () => {
    const responseData = useLoaderData();
    const blogData = responseData.data;
    const [comments, setComments] = useState(blogData.comments || []); // Initializing the comments from blog data

    const handleCommentSubmit = (event) => {
        event.preventDefault();
        const form = event.target;
        const newComment = {
            name: form.name.value,
            email: form.email.value,
            comment: form.comment.value,
        };

        // Update the comments state without saving to a database
        setComments((prevComments) => [...prevComments, newComment]);

        // Optionally reset the form
        form.reset();
    };

    return (
        <div className="blog-details-container">
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

            {/* Comment Form */}
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

            {/* Display Comments */}
            <div className="comments-section">
                <h3>Comments</h3>
                {comments.length === 0 ? (
                    <p>No comments yet.</p>
                ) : (
                    comments.map((comment, index) => (
                        <div key={index} className="comment-item">
                            <p><strong>{comment.name}</strong> ({comment.email})</p>
                            <p>{comment.comment}</p>
                            <hr/>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default BlogDetails;
