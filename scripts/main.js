var x = document.getElementById("demo");
var map;
var user;
var allZones = [];

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
  }
}
var myposition;
function showPosition(position) {
  x = document.getElementById("demo");
  x.innerHTML = "Latitude: " + position.coords.latitude +
  "<br>Longitude: " + position.coords.longitude;
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
    map: map,
    title: 'Hello World!'
  });
}

function Zone(id, lon1, lan1, lon2, lan2, color, rectangle) {
  this.id = id;
  this.lon1 = lon1;
  this.lan1 = lan1;
  this.lon2 = lon2;
  this.lan2 = lan2;
  this.color = color;
  this.rectangle = rectangle;
}

function initMap() {

  var lon1 = -33.886395283702115;
  var lon2 = -33.89157870127412;
  var lan2 = 151.19090795516968;
  var lan1 = 151.18037223815918;

  var UTS = new google.maps.LatLng(lon2, lan2);

  map = new google.maps.Map(document.getElementById('map'), {
    center: UTS,
    zoom: 16,
    scaleControl: true,
            mapTypeId: google.maps.MapTypeId.SATELLITE,

  });


  var px1 = 15434124;
  var py1 = 10068865;
  var px2 = 15434615;
  var py2 = 10069156;

  Meters_per_pixel = 156543.03392 * Math.cos(UTS.lat() * Math.PI / 180) / Math.pow(2, map.getZoom());

  var xSize = 200;
  var ySize = 100;
  var lanPerZone = (xSize / Meters_per_pixel) * Math.abs((lan2 - lan1) / (px2 - px1));
  var lonPerZone = (ySize / Meters_per_pixel) * Math.abs((lon2 - lon1) / (py2 - py1));

  var zoneNumber = 0;
  var currentLan = lan1;
  var currentLon = lon1;

  var nextLon, nextLan;


  var allZones = [];
  while (currentLon > lon2) {
    currentLan = lan1;
    nextLon = Math.max(lon2, currentLon - lonPerZone);
    while (currentLan < lan2) {
      nextLan = Math.min(lan2, currentLan + lanPerZone);

      //DB

      var rectangle = new google.maps.Rectangle();

            allZones.push(new Zone(zoneNumber, currentLon, currentLan, nextLon, nextLan, '#FF4C4C', rectangle));

      zoneNumber++;
      currentLan = nextLan;
    }
    currentLon = nextLon;
  }

  for(var i=0; i<allZones.length; i++) {
    allZones[i].rectangle.setOptions({
            strokeColor: '#E5E5E5',
      strokeOpacity: 0.8,
      strokeWeight: 1,
      strokePosition: google.maps.StrokePosition.INSIDE,
      fillColor: allZones[i].color,
      fillOpacity: 0.4,
      map: map,
      bounds: {
        north: allZones[i].lon1,
        south: allZones[i].lon2,
        east: allZones[i].lan2,
        west: allZones[i].lan1,
      },
      positionNumber: allZones[i].id,
      // editable: true,
      // draggable: true,
    });

    allZones[i].rectangle.addListener('click', someAction);





  }


  var noFlyZone = [0, 1, 2, 5];

  var badWeatherZone = [16, 17, 21, 22];


  for (var i=0; i<allZones.length; i++) {
    if(noFlyZone.includes(i, 0)){
      allZones[i].rectangle.setOptions({
        strokeColor: 'red',
        strokeWeight: 10,

      })
    }

    if(badWeatherZone.includes(i, 0)){
      allZones[i].rectangle.setOptions({
        strokeColor: 'orange',
        strokeWeight: 10,

      })
    }

  }

//test code
//myZone = allZones[13];

    var clientZones = [myZone.id];
  for (var i=0; i<allZones.length; i++) {
    if(!clientZones.includes(i, 0)){
if (allZones[i].rectangle.strokeColor != 'red' && allZones[i].rectangle.strokeColor != 'orange') {
      allZones[i].rectangle.setMap(null) ;
      }
}
      else {
        allZones[i].rectangle.setOptions({
          fillColor: 'yellow'
        });

        var userZone = new google.maps.LatLng(myZone.lon2, myZone.lan2);
            map.setCenter(userZone);
            map.setZoom(18);
      }
    }



  function someAction() {
    if(this.fillColor == '#FF4C4C') {
      this.setOptions({
        fillColor: 'yellow',

      })
    } else if(this.fillColor == 'yellow') {
      this.setOptions({
        fillColor: 'green',

      })
    }
    var arrayLength = allZones.length;

  for (var i = 0; i < arrayLength; i++) {

  var clone=$.extend({},false,allZones[i]);
clone.color=clone.rectangle.fillColor;
  clone.rectangle=null;
console.log(clone);
  $.ajax({

  type: "POST",

  url: "/elastic/allzones/zone/"+i,

  data:  JSON.stringify(clone),
  success: function(data, status){
                console.log("Data: " + data + "\nStatus: " + status);
            },

  dataType: "json"

  });
  }

  }



  Meters_per_pixel = 156543.03392 * Math.cos(UTS.lat() * Math.PI / 180)
  / Math.pow(2, map.getZoom());
  console.log("mpp = " + Meters_per_pixel);

  google.maps.event.addListener(map, "click", function (event) {
    var latitude = event.latLng.lat();
    var longitude = event.latLng.lng();
    console.log(latitude + ', ' + longitude);
    // Center of map
    map.panTo(new google.maps.LatLng(latitude, longitude));
    coordInfoWindow.setContent(createInfoWindowContent(event.latLng, map.getZoom()));
    coordInfoWindow.setPosition(event.latLng);

    coordInfoWindow.open(map);

  });
  var coordInfoWindow = new google.maps.InfoWindow();
  coordInfoWindow.setContent(createInfoWindowContent(UTS, map.getZoom()));
  coordInfoWindow.open(map);

  map.addListener('zoom_changed', function () {
    coordInfoWindow.setContent(createInfoWindowContent(event.latLng, map.getZoom()));
    coordInfoWindow.open(map);
  });

}

var TILE_SIZE = 256;

function createInfoWindowContent(latLng, zoom) {
  return 0;
  var scale = 1 << zoom;

  var worldCoordinate = project(latLng);

  var pixelCoordinate = new google.maps.Point(
    Math.floor(worldCoordinate.x * scale),
    Math.floor(worldCoordinate.y * scale));

    var tileCoordinate = new google.maps.Point(
      Math.floor(worldCoordinate.x * scale / TILE_SIZE),
      Math.floor(worldCoordinate.y * scale / TILE_SIZE));

      return [
        'LatLng: ' + latLng,
        'Zoom level: ' + zoom,
        'World Coordinate: ' + worldCoordinate,
        'Pixel Coordinate: ' + pixelCoordinate,
        'Tile Coordinate: ' + tileCoordinate
      ].join('<br>');
    }

    // The mapping between latitude, longitude and pixels is defined by the web
    // mercator projection.
    function project(latLng) {
      var siny = Math.sin(latLng.lat() * Math.PI / 180);

      // Truncating to 0.9999 effectively limits latitude to 89.189. This is
      // about a third of a tile past the edge of the world tile.
      siny = Math.min(Math.max(siny, -0.9999), 0.9999);

      return new google.maps.Point(
        TILE_SIZE * (0.5 + latLng.lng() / 360),
        TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI)));
      }
