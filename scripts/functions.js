var setUser;
var myZone=null;
var i=0;
setUser = function(userid) {
   user = userid;
$( "#pilot").html(userid);
  for(i=0; i<30; i++) {
console.log("III "+i);
      $.ajax({

      type: "GET",

      url: "/elastic/allzones/zone/"+i,

      success: function(data, status){
console.log(data);
if (data._source.color=="yellow") {
                    myZone=data._source;
myZone.color="blue";
console.log("MY ZONNE IS "+data._id);
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
});
if (myZone != null ) return false;
}


};
