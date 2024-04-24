const lodash = require('lodash')

const dummy = (blogs) => {
    // ...
    return 1
  }
const totalLikes = (blogs) => {
    const sumOfLikes = (sum, item) => {
        return sum + item.likes
    }
    return blogs.length === 0
    ? 0
    : blogs.reduce(sumOfLikes, 0)
}
const favoriteBlog = (blogs) => {
    if (blogs.length === 0 ) {
        return null
    }
    const mostLikesBlog = blogs.reduce((currentMostLikesBlog, nextBlog) => {  
      return nextBlog.likes > currentMostLikesBlog.likes ? nextBlog : currentMostLikesBlog;
    }, blogs[0])
  
    const { title, author, likes } = mostLikesBlog
    const result = {  title, author, likes }
  
    return result
  }
const mostBlogs = (blogs) => {
    if (blogs.length === 0 ) {
        return null
    }

    const authorCount = lodash.countBy(blogs, 'author')
    console.log(authorCount)
    const mostBlogsAuthor = lodash.maxBy(Object.keys(authorCount), i => authorCount[i])

    const mostBlogsCount = authorCount[mostBlogsAuthor]

    return {
        author: mostBlogsAuthor,
        blogs: mostBlogsCount
    }
}
const mostLikes = (blogs) => {
    if (blogs.length === 0 ) {
        return null
    }
    const blogsGroupedByAuthor = lodash.groupBy(blogs, 'author')

    const authorsTotalLikes = lodash.mapValues(blogsGroupedByAuthor, authorBlogs =>
        lodash.sumBy(authorBlogs, 'likes')
      );
      console.log(authorsTotalLikes)

      const mostLikesAuthor = lodash.maxBy(Object.keys(authorsTotalLikes), author =>
        authorsTotalLikes[author]
      );
      const mostLikesAmount = authorsTotalLikes[mostLikesAuthor]

    return {
        author:mostLikesAuthor,
        likes:mostLikesAmount
        }

}
  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }
  