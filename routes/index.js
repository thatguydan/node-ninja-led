
var request = require('request');
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
    var opts = {
        url:'https://localhost:3000/rest/v1/devices',
        qs: {
            access_token:req.session.ninja.token
        }
    }
    request(opts,function(err,result,body) {
      var devices = JSON.parse(body);
      var leds=[]
      for (var i in devices) {
        if (devices.hasOwnProperty(i) && devices[i].device_type=="rgbled") {
            var device = devices[i]
            device.guid=i;
            leds.push(device)
        }
      }
      res.render('index', { 
        title: 'Ninja Colour Picker',
        user:req.session.ninja.data,
        devices:leds
      });

    });
};

exports.sendLedValue = function(req, res){
  request({
    method:'PUT',
    url:'https://localhost:3000/rest/v1/device/'+req.params.deviceGuid,
    json:req.body,
    qs: {
        access_token:req.session.ninja.token
    }
  }).pipe(res);
}