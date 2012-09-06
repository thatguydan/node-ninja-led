

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
    $('.picker').farbtastic(function(colour) {
        var deviceGuid = $(this.wheel).parent().parent().data().guid;
        var payload = {
            colour:colour.substr(1,colour.length)
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