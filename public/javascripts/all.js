$(document).ready(function() {
    $('#picker').farbtastic(function(color) {
        var color = color.substr(1,color.length);
        var toSend = {
            DA:color
        }
        var sid = $("#sid").val();
        $.ajax({
            url:'/rest/v0/device/'+$("#device").val()+'/'+$("#sid").val(),
            type:'PUT',
            data:toSend,
            crossDomain:false,
            success:function(response) {
                console.log(response)
            }

        });
    });
  });