const router = require('express').Router()
const { Blog, User, Readinglist } = require('../models')

router.post('/', async (req, res) => {
  const user = User.findByPk(req.body.user_id)
  const blog = Blog.findByPk(req.body.blog_id)

  if (!user || !blog) {
    res.status(404).end()
  }

  try {
    const readingList = await Readinglist.create({
      userId: req.body.user_id,
      blogId: req.body.blog_id
    })
    return res.json(readingList)
  } catch(error) {
    return res.status(400).json({ error })
  }
})

module.exports = router