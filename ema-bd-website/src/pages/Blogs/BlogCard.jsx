import { Link } from "react-router-dom";

const BlogCard = ({blog}) => {
    return (
        <div className="blog-item" key={blog.id}>
        <div className='blog-card-img'>
          <img src={`http://localhost:5000/uploads/${blog.blogImage}`}></img>
        </div>
        <h3>{blog.title}</h3>
         <span>{blog.author}</span>
         <p>{blog.text.slice(0,50)} ...</p>
         <span>{blog.date}</span>
         
         <button className='btn-red'><Link to ={`/blogs/${blog._id}`}>Read More</Link></button>
      </div>
    );
};

export default BlogCard;