const Blog = require('./blog')
const User = require('./user')
const Readinglist = require('./readinglist')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: Readinglist, as: 'readBooks' })
Blog.belongsToMany(User, { through: Readinglist, as: 'usersRead' })

Blog.hasMany(Readinglist, { as: 'reads' })

module.exports = {
  Blog, User, Readinglist
}