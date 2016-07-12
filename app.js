process.env.SLACK_VERIFY_TOKEN = "TEST";
process.env.SLACK_BOT_COMMAND = "TEST";
process.env.SLACK_CLIENT_ID = "TEST";
process.env.SLACK_CLIENT_SECRET = "TEST";

const http = require('http'),
    fs = require('fs'),
    path = require('path'),
    contentTypes = require('./utils/content-types'),
    sysInfo = require('./utils/sys-info'),
    express = require('express'),
    // cors = require('cors'),
    bodyParser = require('body-parser'),
    env = process.env;

var app = express();

// app.use(cors());
app.use(bodyParser());

app.use('/', require('./lib/signupPage')());
app.use('/slackbot', require('./lib/slackbot')());

// health endpoint is mandatory for openshift gears
app.get('/health', function(req, res){
  res.send(1);
});


app.listen(env.NODE_PORT || 3000, env.NODE_IP || 'localhost', function() {
    console.log(`Application worker ${process.pid} started...`);
});
