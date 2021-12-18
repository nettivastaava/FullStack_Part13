const jwt = require('jsonwebtoken')
const router = require('express').Router()
const { tokenExtractor } = require('../util/middleware')

const { SECRET } = require('../util/config')
const { User, Session } = require('../models')

router.post('/', async (request, response, next) => {
  const body = request.body

  const user = await User.findOne({
    where: {
      username: body.username
    }
  })

  const passwordCorrect = body.password === 'salainen'

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  } else if (user.disabled === true) {
    return response.status(401).json({
      error: 'account disabled. please, contact admin.'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, SECRET)

  try {
    const prevSession = await Session.findOne({
      where: {
        userId: user.id
      }
    })

    if (prevSession) {
      prevSession.destroy()
    }

    const session = await Session.create({
      userId: user.id,
      token: token
    })
  } catch (exception) {
    next(exception)
    return response.status(401).json({
      error: 'login failed'
    })
  }

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

router.delete('/', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  const session = await Session.findOne({
    where: {
      userId: user.id
    }
  })  

  if (session) {
    session.destroy()
    res.status(204).end()
  } else {
    res.status(404).end()
  }
})

module.exports = router