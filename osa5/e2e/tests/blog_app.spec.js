const { test, expect, beforeEach, describe } = require('@playwright/test')
const { createBlog, loginWith } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Joacim Sarén',
        username: 'jsaren',
        password: 'salainen'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'jsaren', 'salainen')

      await expect(page.getByText('Joacim Sarén logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'jsaren', 'väärä')

      await expect(page.getByText('Joacim Sarén logged in')).not.toBeVisible()
      await expect(page.getByText('invalid username or password')).toBeVisible()
    })

    describe('When logged in', () => {
      beforeEach(async ({ page }) => {
        await loginWith(page, 'jsaren', 'salainen')
      })
    
      test('a new blog can be created', async ({ page }) => { 
        await createBlog(page, 'Test title', 'Test author', 'Test url')

        await expect(page.getByText('Test title Test author')).toBeVisible()
      })

      test('Blogs can be liked', async ({ page }) => {
        await createBlog(page, 'Likeable blog', 'Likeable author', 'likeableurl')

        await page.getByRole('button', {name: 'view'}).click()
        await expect(page.getByText('likes: 0')).toBeVisible()

        await page.getByRole('button', {name: 'like'}).click()
        await expect(page.getByText('likes: 1')).toBeVisible()
      })

      test('Blogs can be deleted', async ({ page }) => {
        page.on('dialog', dialog => dialog.accept())
        await createBlog(page, 'Deletable blog', 'Deletable author', 'Deletableurl')

        await page.getByRole('button', {name: 'view'}).click()
        await expect(page.getByText('Deletable blog Deletable author')).toBeVisible()
        await page.getByRole('button', {name: 'remove'}).click()
        await expect(page.getByText('Deletable blog Deletable author')).not.toBeVisible()
      })

      test('Delete button is only visible to blog creator', async ({ page, request }) => {
        await createBlog(page, 'Deletable blog', 'Deletable author', 'Deletableurl')
        await page.getByRole('button', {name: 'view'}).click()
        await expect(page.getByRole('button', {name: 'remove'})).toBeVisible()

        await page.getByRole('button', {name: 'logout'}).click()
        await request.post('/api/users', {
          data: {
            name: 'Keijo',
            username: 'kelo',
            password: 'salis'
          }
        })

        await loginWith(page, 'kelo', 'salis')
        await page.getByRole('button', {name: 'view'}).click()
        await expect(page.getByText('likes: 0')).toBeVisible()
        await expect(page.getByRole('button', {name: 'remove'})).not.toBeVisible()

        await page.getByRole('button', {name: 'logout'}).click()
        await loginWith(page, 'jsaren', 'salainen')
        await page.getByRole('button', {name: 'view'}).click()
        await expect(page.getByRole('button', {name: 'remove'})).toBeVisible()
      })

      test.only('Blogs are sorted by likecount', async ({ page }) => {
        await createBlog(page, 'First testblog', 'First author', 'First url')
        await createBlog(page, 'Second testblog', 'Second author', 'Second url')
        await createBlog(page, 'Third testblog', 'Third author', 'Third url')
        await expect(page.getByText('a new blog Third testblog by')).toHaveCount(0)

        const blogs = await page.getByText('testblog', {exact: false}).all()

        await page.pause()

        await expect(blogs[0].getByText('First testblog First author')).toBeVisible()
        await expect(blogs[1].getByText('Second testblog Second author')).toBeVisible()
        await expect(blogs[2].getByText('Third testblog Third author')).toBeVisible()

        await blogs[1].getByRole('button', {name: 'view'}).click()
        await blogs[1].getByRole('button', {name: 'like'}).click()

        await expect(blogs[0].getByText('Second testblog Second author')).toBeVisible()
        await expect(blogs[1].getByText('First testblog First author')).toBeVisible()
        await expect(blogs[2].getByText('Third testblog Third author')).toBeVisible()

        await blogs[0].getByRole('button', {name: 'like'}).click()
        await blogs[2].getByRole('button', {name: 'view'}).click()
        await blogs[2].getByRole('button', {name: 'like'}).click()

        await expect(blogs[0].getByText('Second testblog Second author')).toBeVisible()
        await expect(blogs[1].getByText('Third testblog Third author')).toBeVisible()
        await expect(blogs[2].getByText('First testblog First author')).toBeVisible()
      })
    })
  })
})