var map = L.map('map').setView([35, 0], 2);

L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=IbN90CLdKmgfvvi2lna8', {
  attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
}).addTo(map);


//Disable zoom and dragging
//map.dragging.disable(); //need to keep dragging enabled until we can find a way to position the map properly for every screen size

map.zoomControl.remove();
map.touchZoom.disable();
map.doubleClickZoom.disable();
map.scrollWheelZoom.disable();
map.boxZoom.disable();
map.keyboard.disable();

var latlngstr;
var locationInfo = {
  regionTitle: undefined,
  regionSubtitle: undefined,
  regionGoLink: undefined
};

map.on('click', async function(ev){
  latlngstr = ev.latlng.lng + ',' + ev.latlng.lat;//API takes Lng,Lat

  var stateName, countryName;
  
  locationInfo.regionTitle.innerText = ev.latlng.lat.toString().substring(0,8) + ', ' + ev.latlng.lng.toString().substring(0,8);
  locationInfo.regionSubtitle.innerText = "Loading location info...";
  locationInfo.regionGoLink.removeAttribute("href");


  let locationNameResponse = await fetch('https://api.maptiler.com/geocoding/' + latlngstr + '.json?key=IbN90CLdKmgfvvi2lna8', {method: 'GET'});
  
  let features = (await locationNameResponse.json()).features;
  //console.log(features);

  for(let i=0; i<features.length; i++) {
    let feature = features[i];
    if(feature.place_type[0] == 'state') {
      stateName = feature.text;
      stateName = stateName.replace(/\s/g, '').toLowerCase();
    }
    if(feature.place_type[0] == 'country') {
      countryName = feature.text;
      countryName = countryName.replace(/\s/g, '').toLowerCase();
    }
    if(countryName !== undefined && stateName !== undefined) break;
  }


  if(countryName !== undefined) {
    let regionInfoResponse = await fetch('/getregioninfo/' + countryName + '/' + stateName);
    //console.log(regionInfoResponse);
    if(regionInfoResponse.status == 200) {
      let regionInfo = await regionInfoResponse.json();  
      locationInfo.regionTitle.innerText = regionInfo.Name;
      locationInfo.regionSubtitle.innerText = regionInfo.Subtitle;
      locationInfo.regionGoLink.href = regionInfo.Url;
    }
    else {
      locationInfo.regionTitle.innerText = "Not Found";
      locationInfo.regionSubtitle.innerText = "Try clicking some other region";
      locationInfo.regionGoLink.removeAttribute("href");
    }
    
    
    
    
    
    
  }
  //console.log(`country: ${countryName} \nstate: ${stateName}`);
  /*if(countryName !== undefined) { 
    window.location.replace(`https://ProjectCulture.cew88.repl.co/region/${countryName}/${stateName}`);
  }*/


});

window.onload = function() {
  locationInfo.regionTitle = document.getElementById("region-title");
  locationInfo.regionSubtitle = document.getElementById("region-subtitle");
  locationInfo.regionGoLink = document.getElementById("region-go-link");
  console.log(locationInfo);
}