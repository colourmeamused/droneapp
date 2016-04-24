var setUser;
var myZone=null;
setUser = function(userid) {
   user = userid;
$( "#pilot").html(userid);
  for(var i=0; i<allZones.length; i++) {
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
console.log(myZone);
     $.ajax({

      type: "DELETE",

      url: "/elastic/allzones/zone/"+i,

      success: function(data, status){
                    console.log("\nStatus: " + status);
       }
      });
}


}
};
