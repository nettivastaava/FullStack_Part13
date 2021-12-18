const router = require('express').Router()
const { tokenExtractor } = require('../util/middleware')
const { Op } = require('sequelize')

const { Blog, User, Session } = require('../models')

router.get('/', async (req, res) => {
  let where = {}

  if (req.query.search) {
    where = {
      [Op.or]: [
        {
          title: {
            [Op.iLike]: '%' + req.query.search + '%'
          }
        },
        {
          author: {
            [Op.iLike]: '%' + req.query.search + '%'
          }
        },
      ]
    }
  }

  const blogs = await Blog.findAll({
    order: [
      ['likes', 'DESC'],
    ],
    attributes: { exclude: ['userId'] },    
    include: {      
      model: User,      
      attributes: ['name']    
    },
    where
  })  

  res.json(blogs)
})
  
router.post('/', tokenExtractor, async (req, res, next) => {
  console.log(req.body)
  try {
    const user = await User.findByPk(req.decodedToken.id)   
    const auth = req.get("authorization").substring(7)

    const session = await Session.findOne({
      where: {
        userId: user.id,
        token: auth
      }
    })
    
    if (user.disabled === true) {
      return res.status(401).json({
        error: 'account disabled. please, contact admin.'
      })
    } else if (!session) {
      return res.status(401).json({
        error: 'session has expired. please, login again.'
      })
    }
    const blog = await Blog.create({...req.body, userId: user.id})
    return res.json(blog)
  } catch(exception) {
    next(exception)
  }
})
  
router.delete('/:id', tokenExtractor, async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)
  const user = await User.findByPk(req.decodedToken.id)
  const auth = req.get("authorization").substring(7)

  const session = await Session.findOne({
    where: {
      userId: user.id,
      token: auth
    }
  })
  
  if (user.disabled === true) {
    return res.status(401).json({
      error: 'account disabled. please, contact admin.'
    })
  } else if (!session) {
    return res.status(401).json({
      error: 'session has expired. please login again.'
    })
  }
    
  if (blog && blog.userId === user.id) {
    blog.destroy()
    res.status(204).end()
  } else {
    res.status(404).end()
  }
})

router.put('/:id',  async (req, res, next) => {
  const blog = await Blog.findByPk(req.params.id)

  try {
    blog.likes = req.body.likes
    await blog.save()
    res.json(blog)
  } catch(exception) {
    next(exception)
  }
  
})

module.exports = router