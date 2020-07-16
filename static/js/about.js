var map = L.map('map').setView([45, 0], 2);

L.tileLayer('https://api.maptiler.com/maps/basic/{z}/{x}/{y}.png?key=IbN90CLdKmgfvvi2lna8', {
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