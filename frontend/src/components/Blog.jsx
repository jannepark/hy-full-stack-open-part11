import { useState } from 'react'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'

const Blog = ({ blog, user, setBlogs, handleLikeBlog }) => {

  const [visible, setVisible] = useState(false)
  const toggleViewAll = () => {
    setVisible(!visible)
  }
  Blog.propTypes = {
    blog: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    setBlogs: PropTypes.func.isRequired
  }

  const addLike= () => {
    const blogObject = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes +1,
      user: blog.user.id,
      id: blog.id
    }
    handleLikeBlog(blogObject)
  }

  const removeBlog = async () => {
    try {
      if (window.confirm('Do you really want delete this blog?')) {
        const response = await blogService.remove(blog.id)
        const toRemoveId = blog.id
        setBlogs((blogs) =>
          blogs.filter((blog) => blog.id !== toRemoveId))
        return response
      }

    }
    catch (error) {
      console.log(error)
    }
  }

  const showDel = () => {
    if (user.name === blog.user.name) {
      const response = <button type="submit" onClick={removeBlog} id='removeBlog'>delete</button>
      return response
    }
    return null
  }

  if (visible) {
    return (
      <div className="blogStyle">
        <div>
          <p>
            {blog.title}
            <button type="submit" onClick={toggleViewAll} id='hideBlogInfo'>hide</button>
          </p>
          <p>{blog.author}</p>
          <p>{blog.url}</p>
          <p>
            <span id='countLikes'> {blog.likes} </span>
            <button type="submit" onClick={addLike} id='likeBlog'>Like</button>
          </p>
          <p>{blog.user.name}</p>
          <div>
            {showDel()}
          </div>
        </div>
      </div>
    )
  }
  return (
    <>
      <div className="blogStyle">
        <p>
          {blog.title} - {blog.author}
          <button type="submit" onClick={toggleViewAll} id='viewBlogInfo'>view</button>
        </p>
      </div>
    </>
  )
}

export default Blog