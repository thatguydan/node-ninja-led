
var request = require('request');
var ninja = require('ninja-blocks')
/*
 * GET home page.
 */

exports.index = function(req, res){
    if (!req.session.ninja) {
        res.render('authme', { 
           title: 'Ninja Color Picker'
        });
        return;
    }
    else {
      var ninja = require('ninja-blocks').app({access_token:req.session.ninja.token});
      ninja.devices(function(err,devices) {
        var leds = {};
        // First pull out all the LED devices
        for (var i in devices) {
          if (devices.hasOwnProperty(i) && devices[i].device_type==="rgbled") {
            leds[i] = devices[i];
            leds[i].guid=i;
          }
        }
        res.render('index',{
          title:'Hello!',
          user:req.session.ninja,
          devices:leds,
          ninjaPusher:'00faab0f9cd3973fb150'
        })
      });   

    }
};

exports.subscribeToDataFeed = function(req,res) {
  var ninja = require('ninja-blocks').app({access_token:req.session.ninja.token});
  ninja.devices(function(err,devices) {
    if (err) throw err.error
    var leds = {};
    // First pull out all the LED devices
    for (var i in devices) {
      if (devices.hasOwnProperty(i) && devices[i].device_type==="rgbled") {
        leds[i] = devices[i];
      }
    }
    // If we have any, let's create callbacks so we can listen to their data
    if (Object.keys(leds).length>0) {
      for (var guid in leds) {
        if (leds.hasOwnProperty(guid)) {
          var url = "http://127.0.0.1:8000/data_callback";
          ninja.device(guid).subscribe(url,true,function(err) {
            if (err) throw err;
          });
          res.redirect('/')
        }
      }
    }
  });
};

exports.handleInboundData = function(req,res) {
  req.redis.hgetall('user:'+req.body.id,function(err,data) {
    console.dir(data);
    if (err) throw err;
    else {
      var ninja = require('ninja-blocks').app({access_token:data.token});
      ninja.device(req.body.GUID).data(function(err,historical) {
        console.log('data!')
        console.dir(historical);
      });
      var ninja = require('ninja-blocks').app({access_token:data.token});
      ninja.device(req.body.GUID).last_heartbeat(function(err,heartbeat) {
        console.log('heartbeat!')
        console.dir(heartbeat);
      });
    }
  });
}

exports.sendLedValue = function(req, res){
  var ninja = require('ninja-blocks').app({access_token:req.session.ninja.token});
  ninja
    .device(req.params.deviceGuid)
    .actuate(req.body.colour,function(err) {
      if (err) throw err.error;
      else res.send(200);
    });
}