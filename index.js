require('dotenv').config()
const { Sequelize, QueryTypes, Model, DataTypes } = require('sequelize')
const express = require('express')
const app = express()

app.use(express.json())

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
})

class Blog extends Model {}
Blog.init({  
  id: {    
    type: DataTypes.INTEGER,    
    primaryKey: true,    
    autoIncrement: true  
  },  
  author: {    
    type: DataTypes.TEXT,    
  },  
  url: {    
    type: DataTypes.TEXT,
    allowNull: false    
  },  
  title: {    
    type: DataTypes.TEXT,
    allowNull: false   
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {  
  sequelize,  
  underscored: true,  
  timestamps: false,  
  modelName: 'blog'
})

app.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.findAll()  
  res.json(blogs)
})

app.post('/api/blogs', async (req, res) => {
  console.log(req.body)
  try {
    const blog = await Blog.create(req.body)
    return res.json(blog)
  } catch(error) {
    return res.status(400).json({ error })
  }
})

app.delete('/api/blogs/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)
  
  if (blog) {
    blog.destroy()
    res.status(204).end()
  } else {
    res.status(404).end()
  }
})

/*
const main = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
    const blogs = await sequelize.query("SELECT * FROM blogs", { type: QueryTypes.SELECT })    
    console.log(blogs)    
    sequelize.close()
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

main()
*/

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {  
  console.log(`Server running on port ${PORT}`)
})