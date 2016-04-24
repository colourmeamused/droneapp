var setUser;
var myZone=null;
var i=0;
setUser = function(userid) {
   user = userid;
$( "#pilot").html(userid);
  for(i=0; i<30; i++) {
      $.ajax({

      type: "GET",

      url: "/elastic/allzones/zone/"+i,

      success: function(data, status){
if (data._source.color=="yellow") {
                    myZone=data._source;
myZone.color="blue";
console.log("MY ZONNE IS "+data._id);
  $.ajax({

  type: "POST",

  url: "/elastic/allzones/zone/"+data._id,

  data:  JSON.stringify(myZone),
  success: function(data, status){
            },

  dataType: "json"

  });

      }
}
});
}


};
