var x = document.getElementById("demo");
var map;
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
    position: new google.maps.LatLng(position.coords.latitude,position.coords.longitude),
    map: map,
    title: 'Hello World!'
  });
}
      function initMap() {

        var UTS = new google.maps.LatLng(-33.88623496679706, 151.1795997619629);

        map = new google.maps.Map(document.getElementById('map'), {
          center: UTS,
          zoom: 16,
          scaleControl: true

        });
        var north = -33.88646653556321;
        var south = -33.89138277025567;
        var east = 151.19075775146484;
        var west = 151.18037223815918;
        Meters_per_pixel = 156543.03392 * Math.cos(UTS.lat() * Math.PI / 180)
         / Math.pow(2, map.getZoom());





        var rectangle = new google.maps.Rectangle({
   strokeColor: '#FF0000',
   strokeOpacity: 0.8,
   strokeWeight: 2,
   fillColor: '#FF0000',
   fillOpacity: 0.2,
   map: map,
   bounds: {
     north: north,
     south: south,
     east: east,
     west: west
   }
 });

        Meters_per_pixel = 156543.03392 * Math.cos(UTS.lat() * Math.PI / 180)
         / Math.pow(2, map.getZoom());
         console.log("mpp = "+Meters_per_pixel);

        google.maps.event.addListener(map, "click", function (event) {
            var latitude = event.latLng.lat();
            var longitude = event.latLng.lng();
            console.log( latitude + ', ' + longitude );
            // Center of map
            map.panTo(new google.maps.LatLng(latitude,longitude));
            coordInfoWindow.setContent(createInfoWindowContent(event.latLng, map.getZoom()));
            coordInfoWindow.setPosition(event.latLng);

            coordInfoWindow.open(map);
        });
        var coordInfoWindow = new google.maps.InfoWindow();
        coordInfoWindow.setContent(createInfoWindowContent(UTS, map.getZoom()));
        coordInfoWindow.open(map);

        map.addListener('zoom_changed', function() {
          coordInfoWindow.setContent(createInfoWindowContent(event.latLng, map.getZoom()));
          coordInfoWindow.open(map);
        });
      }

      var TILE_SIZE = 256;

      function createInfoWindowContent(latLng, zoom) {
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
