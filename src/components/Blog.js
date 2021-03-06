import React, { useState } from 'react'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'

const Blog = ({ blog, handleRemove, username }) => {
  const [viewAllInfo, setViewAllInfo] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleViewAllInfo = () => {
    setViewAllInfo(!viewAllInfo)
  }

  const handleLike = async () => {
    const blogObject = {
      ...blog,
      likes: likes + 1,
      user: blog.user.id
    }

    const updatedBlog = await blogService.update(blogObject)
    setLikes(updatedBlog.likes)
  }

  const deleteBlog = async () => {
    handleRemove(blog)
  }

  let removeButton
  if (username === blog.user.username) {
    removeButton = <button id='remove-button' onClick={deleteBlog}>remove</button>
  }

  if (!viewAllInfo) {
    return (
      <div className='blog' style={blogStyle}>
        {blog.title} {blog.author}
        <button onClick={toggleViewAllInfo}>view</button>
      </div>
    )
  }
  else {
    return (
      <div className='blog' style={blogStyle}>
        {blog.title} {blog.author}
        <button onClick={toggleViewAllInfo}>hide</button> <br/>
        {blog.url} <br/>
        likes {likes}
        <button id='like-button' onClick={handleLike}>like</button>
        <br/>
        {blog.user.name} <br/>
        {removeButton}
      </div>
    )
  }
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  handleRemove: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired
}

export default Blog
