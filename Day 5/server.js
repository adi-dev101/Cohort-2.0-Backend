// server.js ka kaam server chalana hai

const app = require('./src/App') // App.js se express application import kar rahe hain

app.listen(3000, () => {
  console.log('Server is running on port 3000') // Server start hone par message print kar rahe hain
})