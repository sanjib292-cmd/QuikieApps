const express = require('express');
const mongoose = require('mongoose');
const app = express();
const login=require('./Routes/user_routes/login_user');
const register=require('./Routes/user_routes/register_user');

app.use('/login',login);
app.use('./register',register);




  mongoose.connect(`mongodb+srv://Sanjib292:Sanjib292@cluster0.vlkzh.mongodb.net/Cluster0?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true }).then(console.info('Connected To DB'))
  .catch(e => console.error(e));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listning on ${port}`));