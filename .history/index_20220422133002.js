const express = require('express');
const mongoose = require('mongoose');
const app = express();


mongoose.connect(`mongodb+srv://Sanjib292:Sanjib@292@cluster0.vlkzh.mongodb.net/Quikie?retryWrites=true&w=majority`)
  .catch(e => logger.error(e));


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listning on ${port}`));