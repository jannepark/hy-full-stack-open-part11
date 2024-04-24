import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'


describe('Blog', () => {
  test('renders title, author on default, but not url', () => {
    const blog = {
      title: 'Component testing is done with react-testing-library',
      author: 'kivi',
      url: 'www.osoite.fi'
    }

    render(<Blog blog={blog} />)
    screen.getByText(
      'Component testing is done with react-testing-library', { exact: false }
    )
    screen.getByText(
      'kivi', { exact: false }
    )
    const element = screen.queryByText('uwww.osoite.fi')
    expect(element).toBeNull()
  })
  test('renders blogs all fields when button view is pushed', async () => {
    const blog = {
      title: 'Component testing is done with react-testing-library2',
      author: 'kivi2',
      url: 'www.osoite.fi',
      likes: 99,
      user: {
        username: 'root',
        name: 'Superuser'
      }
    }
    render(
      <Blog
        blog={blog}
        user={{ username: 'root', name: 'Superuser' }}
        setBlogs={() => console.log('lisäys')}
      />
    )

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)
    screen.getByText(
      'www.osoite.fi', { exact: false }
    )
    screen.getByText(
      '99', { exact: false }
    )
  })
  test('when like button pushed, its eventhandler is called', async () => {
    const blog = {
      title: 'Component testing is done with react-testing-library2',
      author: 'kivi2',
      url: 'www.osoite.fi',
      likes: 99,
      user: {
        username: 'root',
        name: 'Superuser'
      }
    }
    const mockHandler = jest.fn()
    render(
      <Blog
        blog={blog}
        user={{ username: 'root', name: 'Superuser' }}
        setBlogs={() => console.log('lisäys')}
        handleLikeBlog={mockHandler}
      />
    )
    const user = userEvent.setup()

    const buttonView = screen.getByText('view')
    await user.click(buttonView)

    const buttonLike = screen.getByText('Like')
    await user.click(buttonLike)
    await user.click(buttonLike)

    expect(mockHandler).toBeCalledTimes(2)

  })
})
describe('test blogForm', () => {
  test('<BlogForm /> updates parent state and calls onSubmit', async () => {
    const user = userEvent.setup()
    const createBlog = jest.fn()

    const { container } = render(<BlogForm createBlog={createBlog} />)

    const titleInput = container.querySelector('#title-Input')
    const authorInput = container.querySelector('#author-Input')
    const urlInput = container.querySelector('#url-Input')
    const sendButton = screen.getByText('create')

    await user.type(titleInput, 'This is title')
    await user.type(authorInput, 'This is author')
    await user.type(urlInput, 'This is url')

    await user.click(sendButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('This is title')

  })
})
