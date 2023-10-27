var url = "https://api.openweathermap.org/data/2.5/weather?q=";
var apikey = "&units=imperial&appid=ecf071a12fde88e534d97674aa7cd83b";
var cityNames = ["PHILADELPHIA", "BOSTON", "PHOENIX", "SEATTLE", "PARIS", "NEW YORK", "LOS ANGELES", "DUBAI", "MELBOURNE"];
var weatherData = []; // Array to store the weather data for each city

// setting up my high and low colors for my color scale
var lowColor = [16, 193, 201];
var highColor = [234, 78, 0];

var margin = 30;
var padding = 10;

function setup() {
  // Set a fixed canvas size to fit your desired page layout
  var canvasWidth = 1400; // Adjust the canvas width as needed
  var canvasHeight = 1050;
  createCanvas(canvasWidth, canvasHeight);
  rectMode(CENTER);
  noStroke();
  blendMode(OVERLAY);

  // Load weather data for each city
  var promises = cityNames.map((cityName) => {
    var request = url + cityName + apikey;
    return fetch(request)
      .then((response) => response.json());
  });

  Promise.all(promises)
    .then((data) => {
      weatherData = data;
      drawRectangles(); // Draw the rectangles once data is loaded
      drawTemperatureKeyAndScale(); // Draw the temperature key and scale
    });
}

function drawRectangles() {
  var totalCities = cityNames.length;
  var numberOfColumns = 3; // Total columns, including the sidebar
  var numberOfRows = Math.ceil(totalCities / numberOfColumns);
  var rectangleWidth = (width * 3 / 4) / numberOfColumns; // Adjust the width of the sidebar
  var rectangleHeight = height / numberOfRows;

  // Calculate the width of the sidebar
  var sidebarWidth = (width / 4 + 20);

  // Use the loaded weather data to display each city's rectangle
  for (var i = 0; i < numberOfRows; i++) {
    for (var j = 0; j < numberOfColumns; j++) {
      var cityIndex = i * numberOfColumns + j;
      if (cityIndex >= totalCities) {
        break; // Skip if there are no more cities to display
      }

      var realTemp = weatherData[cityIndex].main.temp;

      var s = map(realTemp, 0, 120, 0, 1);
      var c = lerpColor(color(lowColor), color(highColor), s);
      fill(c);

      var positionX = (j * rectangleWidth) + (width / 4 + 20); // Adjust X position for the sidebar
      var positionY = i * rectangleHeight;
      var offset = rectangleWidth / 2;

      rect(positionX + offset, positionY + offset, rectangleWidth, rectangleHeight);

      // Creates 'feels like' circle in the middle
      push();
      var feelsLikeTemp = weatherData[cityIndex].main.feels_like;

      var s2 = map(feelsLikeTemp, 0, 120, 0, 1);
      var c2 = lerpColor(color(lowColor), color(highColor), s2);

      fill(c2);
      img = circle(positionX + offset, positionY + offset, rectangleHeight);
      img.loadPixels();
      pop();
    }
  }

  // Draw the sidebar on the left
  fill('f7f7f1'); // Change the fill color to white for the sidebar
  rect(sidebarWidth / 2, height / 2, sidebarWidth, height);
}

function drawTemperatureKeyAndScale() {
  // Sidebar
  // Temp Key
  var keySize = 300;
  var offset = keySize / 2;
  var yPosition = height / 5.5;

  textSize(12);
  fill(0);
  blendMode(BLEND);
  text('TEMPERATURE SCALE', margin, height - 85);

  // Temp Scale
  var scaleCircle = 20;
  var scaleOffset = scaleCircle / 4;

  for (let i = 0; i <= 100; i += 10) { // go up in 10% increments
    let s2 = i / 100;
    let c3 = lerpColor(color(lowColor), color(highColor), s2);

    fill(c3);
    ellipse(margin + scaleOffset + i * 2, height - 65, scaleCircle, scaleCircle);
  }

  // Labels for temperature scale

  
  for (let i = 0; i <= 100; i += 10) {
    fill(0);
    textSize(9);
    textAlign(LEFT);
    text(i, margin + (i * 2), height - 40);
  }

  // Draw the key box and labels
  stroke(120);
  strokeWeight(0.75);
  noFill();
  rect(margin + keySize / 2, yPosition, keySize, keySize);
  ellipse(margin + keySize / 2, yPosition, keySize-50, keySize-50);

  textAlign(CENTER, CENTER);
  fill(0);
  textSize(12);
  text('ACTUAL', margin + offset, yPosition - offset + keySize*.05);
  text('FEELS LIKE', margin + offset, yPosition - offset + keySize * 0.5);
  
  // City Key
  var cityKeyX = margin + offset * 0.35; // Adjust the X position for the city key
  var cityKeyY = yPosition - offset + keySize * 1.5; // Adjust the Y position for the city key
  var cityKeySize = keySize; // Adjust the size of the city key square

  // Calculate the number of rows and columns for the city key square
  var cityKeyRows = 3; // Change this value as needed
  var cityKeyColumns = Math.ceil(cityNames.length / cityKeyRows);

  // Calculate the width and height of each cell in the city key square
  var cellWidth = cityKeySize / cityKeyColumns;
  var cellHeight = cityKeySize / cityKeyRows;

  // Loop through the city names and display them in the city key square
  for (var i = 0; i < cityNames.length; i++) {
    var row = Math.floor(i / cityKeyColumns);
    var col = i % cityKeyColumns;
    var cityNameText = cityNames[i];

    var cellX = cityKeyX + col * cellWidth;
    var cellY = cityKeyY + row * cellHeight;

    fill(0);
    textAlign(CENTER, CENTER);
    textSize(10);
    text(cityNameText, cellX, cellY);

    // Draw vertical lines to denote columns (except for the first column)
    if (col > 0) {
      stroke(120);
      strokeWeight(0.75);
      line(cellX-cellWidth/2, cityKeyY-cellHeight/2, cellX-cellWidth/2, cityKeyY + keySize-cellHeight/2);
    }

    // Draw horizontal lines to denote rows (except for the first row)
    if (row > 0) {
      stroke(120);
      strokeWeight(0.75);
      line(cityKeyX-cellWidth/2, cellY-cellHeight/2, cityKeyX + keySize-cellWidth/2, cellY-cellHeight/2);
    }
  }
}
