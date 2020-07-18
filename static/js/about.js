var map = L.map('map').setView([45, 0], 2);

L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=IbN90CLdKmgfvvi2lna8', {
  attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
}).addTo(map);


//Disable zoom and dragging
/*
map.dragging.disable();
map.zoomControl.remove();
map.touchZoom.disable();
map.doubleClickZoom.disable();
map.scrollWheelZoom.disable();
map.boxZoom.disable();
map.keyboard.disable();
*/

//This be super sketchy reverse geocoding 
var latlngstr;
map.on('click', function(ev){
  
  latlngstr = ev.latlng.lat + ',' + ev.latlng.lng;

  var locationNameRequest = new XMLHttpRequest();
  locationNameRequest.open('GET', 'https://api.maptiler.com/geocoding/' + latlngstr + '.json?key=IbN90CLdKmgfvvi2lna8', true);
  locationNameRequest.onload = function(){
    var data = JSON.parse(this.response);
    console.log(data.features);
  }
  locationNameRequest.send();
  

  //Try using another API. It's simple and accurate, but the limit isn't good.
  /*var locationNameRequest = new XMLHttpRequest();
  locationNameRequest.open('GET', 'https://secure.geonames.org/countryCodeJSON?lat=' + ev.latlng.lat + '&lng=' + ev.latlng.lng + '&username=wisha');
  locationNameRequest.onload = function(){
    var data = JSON.parse(this.response);
    console.log(data.countryName);
  }
  locationNameRequest.send();
  */
});