const router = require('express').Router()
const { Op } = require('sequelize')

const { User, Blog, Readinglist } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] }    
    }
  })
  res.json(users)
})

router.get('/:id', async (req, res) => {
  let read = { 
    [Op.in]: [
      true, 
      false
    ] 
  }

  if (req.query.read) {
    read = req.query.read === 'true'
  } 

  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['createdAt', 'updatedAt'] } , 
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
        attributes: { exclude: ['userId', 'blogId']},
        where: {
          userId: req.params.id,
          read
        }        
      },
    }]
  })

  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch(error) {
    return res.status(400).json({ error })
  }
})

router.put('/:username', async (req, res, next) => {
  const user = await User.findOne({
    where: {
      username: req.params.username
    }
  })

  try {
    user.username = req.body.username
    await user.save()
    res.json(user)
  } catch(exception) {
    next(exception)
  }
})

module.exports = router