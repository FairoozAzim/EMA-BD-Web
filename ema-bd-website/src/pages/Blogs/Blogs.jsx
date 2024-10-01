import {Link, useLoaderData } from 'react-router-dom';
import './Blogs.css'
import BlogCard from './BlogCard';

const Blogs = () => {
  const blogs=  useLoaderData();

  const sortBlogsByDate = (blogs) => {
    return blogs.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB - dateA;  // Sort in descending order
    });
  };
  const sortedBlogs = sortBlogsByDate(blogs);
  

   const latest = sortedBlogs[0]; 
   const otherBlogs = sortedBlogs.slice(1);
    return (
        <div className="blog-section">
          <div className='latest-post'>
            <div className='blog-img'>
            <img src={`http://localhost:5000/uploads/${latest.blogImage}`}></img>
            </div>
            <div className='blog-desc'>
              <span>Latest Post</span>
              <h1>{latest.title}</h1>
              <span>{latest.author}</span>
              <p>{latest.text.slice(0,100)} ...</p>
              <button className='btn-red'><Link to ={`/blogs/${latest._id}`}>Read More</Link></button>
              <span>{latest.date}</span>
              <p></p>

            </div>
          </div>
          
          <hr className='blog-divider'></hr>
        
          <div className="blogs-wrapper">
            
            {
              otherBlogs.map(blog => (
               <BlogCard
               key= {blog._id}
               blog = {blog}
               >

               </BlogCard>
              ))
            }
            </div>
          </div>
       
    );
};

export default Blogs;