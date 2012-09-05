
/**
 * Module dependencies.
 */

if (!process.env.NINJA_CLIENT_ID||!process.env.NINJA_CLIENT_SECRET) 
  throw new Error('Ninja client credentials have not been set!')

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , redisClient = require('redis-url').connect(process.env.REDISTOGO_URL)
  , RedisStore = require('connect-redis')(express);

var app = express();
var authom = require('authom');

app.configure(function(){
  app.set('port', process.env.PORT || 8000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.cookieParser())
  app.use(express.session({secret:"ninjaALLTHETHINGS",store: new RedisStore({client:redisClient})}));
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

authom.createServer({ 
  service:"ninjablocks",
  id:process.env.NINJA_CLIENT_ID,
  secret:process.env.NINJA_CLIENT_SECRET,
  scope:['all']
});

/*
    Authom configuration
 */

authom.on('auth',function(req,res,data) {
  req.session.ninja = data;
  routes.subscribeToDataFeed(req,res);
});

authom.on('error',function(req,res,data) {
  console.log(data);
});

/*
  App Routes
 */
app.get('/', routes.index);
app.put('/rest/v0/device/:deviceGuid', routes.sendLedValue);
app.post('/data_callback',routes.handleInboundData);

/*
  Authom routes
 */
app.get("/auth/:service",authom.app);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
