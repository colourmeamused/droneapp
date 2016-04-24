var setUser;
var myZone=null;
setUser = function(userid) {
   user = userid;
$( "#pilot").html(userid);
  for(var i=0; i<30; i++) {
      $.ajax({

      type: "GET",

      url: "/elastic/allzones/zone/"+i,

      success: function(data, status){
                    console.log("Data: " + data + "\nStatus: " + status);
if (data._source.color=="yellow") {
                    myZone=data._source;
            }
      }
      });
if (myZone!=null && myZone.color=="yellow") {
myZone.color="blue";
console.log("MY ZONNE IS "+i);
  $.ajax({

  type: "POST",

  url: "/elastic/allzones/zone/"+i,

  data:  JSON.stringify(myZone),
  success: function(data, status){
                console.log("Data: " + data + "\nStatus: " + status);
            },

  dataType: "json"

  });
}


}
};
