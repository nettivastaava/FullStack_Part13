const router = require('express').Router()
const { Blog, User, Readinglist } = require('../models')
const { tokenExtractor } = require('../util/middleware')

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

router.put('/:id', tokenExtractor, async (req, res, next) => {
  const readingList = await Readinglist.findByPk(req.params.id)
  const user = await User.findByPk(req.decodedToken.id, {
    attributes: { exclude: [''] } , 
    include:[{
      model: Blog,
      as: 'readBooks',
      attributes: { exclude: ['userId']},        
      through: {          
        attributes: []        
      },
      include: {          
        model: Readinglist,     
        as: 'reads',
        attributes: { exclude: ['userId', 'blogId']}          
      }
    }]
  })
  
  const blogList = user.readBooks.find(blog => blog.id === readingList.blogId)

  if (blogList) {
    try {
      readingList.read = req.body.read
      await readingList.save()
      res.json(readingList)
    } catch(exception) {
      next(exception)
    }
  } else {
    res.status(404).end()
  }
    
})

module.exports = router