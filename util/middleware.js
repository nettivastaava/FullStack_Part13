const jwt = require('jsonwebtoken')
const { SECRET } = require('./config')

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' }) 
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  
  next(error)
}

const tokenExtractor = (req, res, next) => {  
  const authorization = req.get('authorization')  
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {    
    try {      
      console.log(authorization.substring(7))      
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)    
    } catch (error){      
      console.log(error)      
      return res.status(401).json({ error: 'token invalid' })    
    }  } else {    
      return res.status(401).json({ error: 'token missing' })  
    }
    next()
  }

module.exports = {
   errorHandler,
   tokenExtractor
}