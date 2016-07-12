const http = require('http'),
    fs = require('fs'),
    path = require('path'),
    contentTypes = require('./utils/content-types'),
    sysInfo = require('./utils/sys-info'),
    express = require('express'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    env = process.env;

var app = express();

// Enable CORS for all requests
app.use(cors());
app.use(bodyParser());


// allow serving of static files from the public directory
app.use(express.static(__dirname + '/static'));

app.get('/health', function(req, res){
  res.send(1);
});

app.get('/info', function(req, res){
  res.send(JSON.stringify(sysInfo[url.slice(6)]()));
});


app.listen(env.NODE_PORT || 3000, env.NODE_IP || 'localhost', function() {
    console.log(`Application worker ${process.pid} started...`);
});
