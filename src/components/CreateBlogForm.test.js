import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import CreateBlogForm from './CreateBlogForm'

test('<CreateBlogForm /> calls createBlog() with correct params', () => {
  const createBlog = jest.fn()

  const component = render(
    <CreateBlogForm createBlog={createBlog} />
  )

  const blog = {
    title: 'Testi title',
    author: 'Testaaja',
    url: 'www.google.fi'
  }

  const titleInput = component.container.querySelector('#title')
  const authorInput = component.container.querySelector('#author')
  const urlInput = component.container.querySelector('#url')

  const form = component.container.querySelector('form')

  fireEvent.change(titleInput, {
    target: { value: 'Testi title' }
  })
  fireEvent.change(authorInput, {
    target: { value: 'Testaaja' }
  })
  fireEvent.change(urlInput, {
    target: { value: 'www.google.fi' }
  })

  fireEvent.submit(form)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toMatchObject(blog)
})