
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
          devices:leds
        })
      });   

    }
};

exports.subscribeToDataFeed = function(req,res) {
  var ninja = require('ninja-blocks').app({access_token:req.session.ninja.token});
  ninja.devices(function(err,devices) {
    var leds = {};
    // First pull out all the LED devices
    for (var i in devices) {
      if (devices.hasOwnProperty(i) && devices[i].device_type==="rgbled") {
        leds[i] = devices[i];
      }
    }
    // If we have any, let's create callbacks so we can listen to their data
    if (Object.keys(leds).length>0) {
      for (var i in leds) {
        if (leds.hasOwnProperty(i)) {
          var opts = {
            guid:i,
            url:"http://ninja-led.herokuapp.com/data_callback"
          }
          ninja.subscribe(opts,function(err) {
            if (err) throw err;
          });
          res.redirect('/')
        }
      }
    }
  });
};

exports.handleInboundData = function(req,res) {
  console.log(req.body)
}

exports.sendLedValue = function(req, res){
  request({
    method:'PUT',
    url:'https://a.ninja.is/rest/v0/device/'+req.params.deviceGuid,
    json:req.body,
    qs: {
        access_token:req.session.ninja.token
    }
  }).pipe(res);
}