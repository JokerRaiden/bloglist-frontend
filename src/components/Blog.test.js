import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

test('renders blog', () => {
  const blog = {
    title: 'Testi title',
    author: 'Testaaja',
    url: 'www.google.fi',
    user: 'ttestaaj',
    likes: '16'
  }

  const component = render(
    <Blog blog={blog} handleRemove={() => {}} username = 'ttestaaj' />
  )

  expect(component.container).toHaveTextContent(
    'Testi title'
  )

  expect(component.container).toHaveTextContent(
    'Testaaja'
  )

  expect(component.container).not.toHaveTextContent(
    'www.google.fi'
  )

  expect(component.container).not.toHaveTextContent(
    'likes'
  )
})

test('clicks view and renders likes and url', () => {
  const blog = {
    title: 'Testi title',
    author: 'Testaaja',
    url: 'www.google.fi',
    user: 'ttestaaj',
    likes: '16'
  }

  const mockHandler = jest.fn()

  const component = render(
    <Blog blog={blog} handleRemove={mockHandler} username = 'ttestaaj' />
  )

  const button = component.getByText('view')
  fireEvent.click(button)

  expect(component.container).toHaveTextContent(
    'www.google.fi'
  )

  expect(component.container).toHaveTextContent(
    'likes 16'
  )
})

test('clicks like twice', () => {
  const blog = {
    title: 'Testi title',
    author: 'Testaaja',
    url: 'www.google.fi',
    user: 'ttestaaj',
    likes: '16'
  }

  const mockHandler = jest.fn()

  const component = render(
    <Blog blog={blog} handleRemove={mockHandler} username = 'ttestaaj' />
  )

  const button = component.getByText('view')
  fireEvent.click(button)

  const likeButton = component.getByText('like')
  const likeMockHandler = jest.fn()
  likeButton.onclick = likeMockHandler

  fireEvent.click(likeButton)
  fireEvent.click(likeButton)

  expect(likeMockHandler.mock.calls).toHaveLength(2)
})
