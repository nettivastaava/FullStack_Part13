const router = require('express').Router()
const { Blog } = require('../models')
const { fn, col } = require('sequelize')

router.get('/', async (req, res) => {
  const authors = await Blog.findAll({
    group: 'author',
    attributes: [
      'author',
      [fn('COUNT', col('author')), 'blogs'],
      [fn('SUM', col('likes')), 'likes']
    ],
    order: [
      [col('likes'), 'DESC'],
    ],
  })
  res.json(authors)
})

module.exports = router