
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
      var ninja = require('ninja-blocks').app({access_token:req.session.ninja.access_token});
      ninja.devices(function(err,devices) {

        if (err) {
          console.error(err);
          return;
        }

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
          ninjaPusher:'ccff70362850caf79c9f'
        })
      });

    }
};

exports.subscribeToDataFeed = function(req,res) {
  var ninja = require('ninja-blocks').app({access_token:req.session.ninja.access_token});
  ninja.devices(function(err,devices) {

    if (err) {
      console.error(err);
      return;
    }

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
          var url = "http://ninja-led.herokuapp.com/data_callback";
          ninja.device(guid).subscribe(url,true,function(err) {
            if (err) throw err;
          });
          res.redirect('/')
        }
      }
    } else {
      res.redirect('/')
    }
  });
};

exports.handleInboundData = function(req,res) {
  // req.redis.hgetall('user:'+req.body.id,function(err,data) {
  //   console.dir(data);
  //   if (err) throw err;
  //   else {
  //     var ninja = require('ninja-blocks').app({access_token:data.access_token});
  //     ninja.device(req.body.GUID).last_heartbeat(function(err,heartbeat) {
  //       console.log("Last heartbeat")
  //       console.dir(heartbeat);
  //     });
  //   }
  // });
  res.send(200);
}

exports.sendLedValue = function(req, res){
  var ninja = require('ninja-blocks').app({access_token:req.session.ninja.access_token});
  ninja
    .device(req.params.deviceGuid)
    .actuate(req.body.colour,function(err) {
      if (err) {
        console.error(err);
        return;
      }
      else res.send(200);
    });
}