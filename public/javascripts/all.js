$(document).ready(function() {
    $('#picker').farbtastic(function(color) {
        var deviceGuid = $(this.wheel).parent().parent().data().guid;
        var color = color.substr(1,color.length);
        var payload = {
            DA:color
        };
        $.ajax({
            url:'/rest/v1/device/'+deviceGuid,
            type:'PUT',
            data:payload,
            crossDomain:false,
            success:function(response) {
                console.log(response)
            }

        });
    });
  });