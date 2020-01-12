var key = 'pk.eyJ1IjoicmFmZmFlbGVyaWNjYXJkZWxsaSIsImEiOiJjazNpcmZoMzIwYWVzM2NwNm92eWpxbTdiIn0.15M15i30LdC8jUWkVsMSfg';

// Options for map
var options = {
  lat: 0,
  lng: 0,
  zoom: 4,
  maxBounds: bounds,
  studio: false,
  style: 'mapbox.satellite'
};

// Create an instance of Mapbox
var mappa = new Mappa('Mapbox', key);
var myMap;
var coords = [];
var count;
var canvas;
//var JSON and image
var data;
var user_loc;

var volc;
var nameVolc = [];
var zoom;
var text = [];
var currentPosition;
var minDistance;
//determine the position of the array of nearest volcano from you
var countDistance;
//position in pixel of the nearest volcano
var posVolc;


function preload() {
  user_loc = loadImage('assets/map_user.png');
  data = loadJSON('volcano.json');
  currentPosition = getCurrentPosition();
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  volc = data.features;
  // Create a tile map and overlay the canvas on top.
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);
  var distance = calcGeoDistance(volc[0].properties.Latitude, volc[0].properties.Longitude, currentPosition.latitude, currentPosition.longitude, "km");
  minDistance = distance;

  //put lat, lng and name of volcanoes in array
  for (var i = 0; i < data.features.length; i++) {
    coords.push(volc[i].properties.Latitude, volc[i].properties.Longitude);
    nameVolc[i] = new addText(volc[i].properties.V_Name);
    distance = calcGeoDistance(volc[i].properties.Latitude, volc[i].properties.Longitude, currentPosition.latitude, currentPosition.longitude, "km");
    if (minDistance > distance) {
      minDistance = distance;
      countDistance = i;
    }
  }
  // console.log(minDistance, volc[countDistance].properties.V_Name);
  count = data.features.length;
}

function draw() {
  // Clear the canvas
  clear();
  var j = 1;
  var k = 0;
  //check zoom
  zoom = myMap.getZoom();
  //show the current position
  var posMe = myMap.latLngToPixel(currentPosition.latitude, currentPosition.longitude);
  fill("red");
  translate();
  var marker = new addMarker(user_loc, posMe.x, posMe.y);
  posVolc = myMap.latLngToPixel(volc[countDistance].properties.Latitude, volc[countDistance].properties.Longitude);

  //line to link user location and the nearest volcano
  stroke("blue");
  strokeWeight(8);
  line(posVolc.x, posVolc.y, posMe.x + 18, posMe.y);

  push();
  marker.display();
  pop();

  //show the position of volcanoes
  for (var i = 0; i < count; i += 2) {
    var pos = myMap.latLngToPixel(coords[i], coords[j]);
    j += 2;
    fill("white");
    stroke("#cccccc");
    strokeWeight(2);
    ellipse(pos.x, pos.y, 10);
    if (zoom > 5) {
      nameVolc[k].display(pos.x, pos.y - 15);
    }
    //counter for volcanoes
    k++;
  }
  var box = rect(12, 80, 200, 100);
  noStroke();
  fill("black");
  textSize(15);
  textAlign(LEFT);
  text("You are " + round(minDistance) + " km away from the nearest volcano, " + volc[countDistance].properties.V_Name + ".", 17, 85, 180, 90);
}

function addText(_name) {
  this.name = _name;

  this.display = function(_x, _y) {
    this.x = _x;
    this.y = _y;
    noStroke();
    textAlign(CENTER);
    text(_name, _x, _y);
  }
}

function addMarker(_name, _x, _y) {
  this.name = _name;
  this.x = _x;
  this.y = _y;

  this.display = function() {
    translate(0, -50);
    image(_name, _x, _y);
  }
}
