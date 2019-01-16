// @ts-check
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const routes = require('./src/routes/index')

const port = process.env.PORT || 4000;
const app = express();

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cors());
app.use('/api/movie', routes);

app.listen(port, function(){
  console.log('Listening on port ' + port);
});
