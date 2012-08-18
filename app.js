
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

var request = require('request');

app.put('/rest/v0/device/:deviceGuid/:sid', function(req, res){
  request({
    method:'PUT',
    url:'https://a.ninja.is/rest/v0/device/'+req.params.deviceGuid,
    json:req.body,
    headers: {
      cookie:'ninja.sid='+req.params.sid
    }
  }).pipe(res);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
