const router = require('express').Router()

const { User, Blog } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] }    }
  })
  res.json(users)
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