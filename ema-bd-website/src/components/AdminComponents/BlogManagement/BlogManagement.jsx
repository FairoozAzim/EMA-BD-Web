import { useEffect, useState } from 'react';
import './BlogManagement.css'
import Modal from '../../Modal/Modal';
import { MdOutlineFileUpload } from 'react-icons/md';
import BlogCard from '../../../pages/Blogs/BlogCard';

const BlogManagement = () => {

const [isOpen, setIsOpen] = useState(false);
const [blogs, setBlogs] = useState([]);
const [blogImage, setBlogImage] = useState([]);
const [image, setImage] = useState(null);
const today = new Date();
const time = today.toTimeString();
const date = today.toDateString();

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };
 
  useEffect(() =>{
    fetch('http://localhost:5000/blogs')
    .then(res => res.json())
    .then(data => setBlogs(data));
 
  }, [])

  const handleImageUpload = event => {
    console.log(event.target.files);
    setImage(URL.createObjectURL(event.target.files[0]));
    setBlogImage(event.target.files[0]);
    console.log(image);
  }
  
 const handleAddBlog = event => {
  event.preventDefault();
  let formData = new FormData()
  const form = event.target;
  formData.append("title",form.title.value);
  formData.append("author",form.authorName.value);
  formData.append("date",  date);
  formData.append("time", time);
  formData.append("text", form.blogText.value);
  formData.append("blogImage",blogImage);

  const title = form.title.value;
  const author = form.authorName.value;
  const postDate = date;
  const postTime = time;
  const text =form.blogText.value ;
  const newBlog= {title, author, postDate, postTime, text};
  // formData.append("banner", fileName);
  

  console.log(newBlog);
  fetch("http://localhost:5000/blogs", {
    method: 'POST',
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    console.log('post response', data);
    alert(data.message);
    const addNewBlog = [...blogs, data];
    setBlogs[addNewBlog];
    setImage(null);
    form.reset();
    setIsOpen(false);
  })
 }

  

    return (
        <div>
            <h2 className="text-center">Manage Blogs</h2>
            <div>
                <div className="blog-header d-flex">
                <h2>Recent Blogs</h2>
                <button className='create-btn btn-red' onClick={openModal}>
                    Create a new blog</button>
                </div>
                <Modal isOpen={isOpen} onClose={closeModal}>
                   <h3 className='text-center'>Create a Blog</h3>
                   <form className='create-form' onSubmit={handleAddBlog}>
                     <div className='form-content'>
                      <input name='title' type='text' placeholder='Blog Title'></input>
                      <input name='authorName' type='text' placeholder='Author Name'></input>
                      <div className='image-input-container'>
                      <input name='blogImage' type='file' id='blogImage' className='event-banner' placeholder='Blog Image' hidden onChange={handleImageUpload}
                     ></input>
                    
                    {
                      image ?
                      <div className='banner-img-container'>
                      <img className='banner-img' src={image} accept="image/*"></img>
                      <button className='delete-img' onClick={() => setImage(null)}>Clear Image</button>
                      </div>
                      : 
                      <label className='banner-label' htmlFor='blogImage'>
                       <MdOutlineFileUpload className='icon'/>
                      Choose an Image from files</label>
                     
                    }
                    
                    </div>
                      <textarea name='blogText' type='text' placeholder='Write your thoughts' rows={20}></textarea>
                      <button className='submit btn-submit' type='submit'>Submit</button>
                     </div>
                     
                   </form>
                 </Modal>
                <div className="blogs-wrapper">
            {
              blogs.map(blog => (
                <BlogCard 
                key= {blog._id}
                blog = {blog}
                ></BlogCard>
              ))
            }
            </div>
            </div>
        </div>
    );
};

export default BlogManagement;