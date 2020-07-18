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
map.on('click', async function(ev){
  
  
  latlngstr = ev.latlng.lng + ',' + ev.latlng.lat;//Turns out the API takes Lng,Lat not Lat,Lng

  /*var locationNameRequest = new XMLHttpRequest();
  locationNameRequest.open('GET', 'https://api.maptiler.com/geocoding/' + latlngstr + '.json?key=IbN90CLdKmgfvvi2lna8', true);
  locationNameRequest.onload = function(){
    var data = JSON.parse(this.response);
    console.log(data.features);
  }
  locationNameRequest.send();
  */
  var stateName, countryName;
  let locationNameResponse = await fetch('https://api.maptiler.com/geocoding/' + latlngstr + '.json?key=IbN90CLdKmgfvvi2lna8', {method: 'GET'});
  let features = (await locationNameResponse.json()).features;
  console.log(features);
  for(let i=0; i<features.length; i++) {
    let feature = features[i];
    if(feature.place_type[0] == 'state') {
      stateName = feature.text;
    }
    if(feature.place_type[0] == 'country') {
      countryName = feature.text;
    }
    if(countryName !== undefined && stateName !== undefined) break;
  }
  console.log(`country: ${countryName}; state: ${stateName}`);


});