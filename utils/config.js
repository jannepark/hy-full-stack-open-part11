require('dotenv').config()

let PORT = process.env.PORT
const MONGODB_URI =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI

// const MONGODB_URI =
//   process.env.NODE_ENV === 'test'
//     ? 'mongodb+srv://janneviljo:Promoter-Hulk0-Sandal@cluster0.5irxesk.mongodb.net/forTheTests?retryWrites=true&w=majority&appName=Cluster0'
//     : process.env.MONGODB_URI
module.exports = {
  MONGODB_URI,
  PORT,
}
