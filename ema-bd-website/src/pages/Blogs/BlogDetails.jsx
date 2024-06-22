import { useLoaderData } from "react-router-dom";

const BlogDetails = () => {
    const responseData = useLoaderData();
    const blogData = responseData.data;
  
    return (
        <div className="mt-10">
            <h1>{blogData.title}</h1>
            <div>
            <h4>{blogData.author}</h4>
            <span>{blogData.date}</span>
            </div>
          <div className="blog-banner-container">

          <img className='blog-banner' src={`http://localhost:5000/uploads/${blogData.blogImage}`}></img>
          </div>
          
            <p>{blogData.text}</p>
            
        </div>
    );
};

export default BlogDetails;