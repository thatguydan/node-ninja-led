

var app = {
    devices:{},
    setDevices: function(devices) {
        app.devices = devices;
    },
    handleData:function(data) {
        if (app.devices.hasOwnProperty(data.GUID)) {
            $('.history[data-guid="'+data.GUID+'"]')
                .append('Data: <span style="color:#'+data.DA+'">#'+data.DA+'</span><br />');
        }
    },
    handleHeartbeat: function(heartbeat) {
        for(var guid in heartbeat) {
            if (app.devices.hasOwnProperty(guid)) {
                $('.history[data-guid="'+guid+'"]')
                    .append('Heartbeat: <span style="color:#'+heartbeat[guid].DA+'">#'+heartbeat[guid].DA+'</span><br />');
            }
        }
    }
};


$(document).ready(function() {
    $('.picker').each(function() {
        var guid = $(this).data().guid;
        var pickerid = 'picker'+guid;
        var sliderid = 'slider'+guid;
        ColorPicker(
        document.getElementById(sliderid),
        document.getElementById(pickerid),
        function(hex, hsv, rgb) {
            var deviceGuid = $(this.pickerElement).data().guid;
            var payload = {
                colour:hex.substr(1,hex.length)
            };
            $.ajax({
                url:'/device/'+deviceGuid+'/colour',
                type:'PUT',
                data:payload,
                crossDomain:false,
                success:function(response) {
                    console.log(response)
                }

            });        
        });
    });
});