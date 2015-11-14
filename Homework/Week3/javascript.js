// Pim van Alphen
// 11082887
// feel free to adjust the values of padding and interval, as well as the width
// and height of the canvas (see data.html)

// Global variables
dates = []
temperatures = []

domainAxisX = []
domainAxisY = []
domainGraph = []

dataPoints = document.getElementById("rawdata")
dataText = dataPoints.innerHTML
dataLines = dataText.split('\n')

// loop from 1 till length - 1 to skip empty entries at front and back
for (var i = 1, l = dataLines.length - 1; i < l; i++) {

  // split the date and temp in different strings
  var tmpLines = dataLines[i].split(',')

  // Take the string with the date and trim whitespaces
  var tmpString = tmpLines[0].trim()

  // make the date string into a javascript date
  var tmpDate = new Date(tmpString.substring(0,4), tmpString.substring(4,6),
    tmpString.substring(6,8))
  dates.push(tmpDate)

  // make the temp string into a number
  var tmpTemp = tmpLines[1].trim()
  temperatures.push(Number(tmpTemp))
}

function createTransform(domain, range){
	var alpha = (range[1] - range[0])/(domain[1] - domain[0]);
	var beta = range[0] - alpha * domain[0]

	return function(x){
				return alpha * x + beta;
	};
}

// this function takes the canvas and declares the domains of the axes and of the
// graph. These are stored in global variables. desription: domain [x1, y1, x2, y2],
function setDomains(canvas){
  domainAxisY = [0, 0, canvas.width/10, canvas.height /10 *9]
  domainAxisX = [canvas.width/10, canvas.height /10 *9, canvas.width, canvas.height]
  domainGraph = [canvas.width/10, 0, canvas.width, canvas.height/10 *9]
}

// this function takes a input an array of date objects and returns an array of numbers
// representing days, starting counting from the first input date and indexed at 0
function translateDates(dates){
  newDates = []
  for (var i = 0, l = dates.length; i < l; i++){
    var tmpDate = dates[i].getTime() - dates[0].getTime()
    var tmpTime = tmpDate / 1000 / 60 / 60 / 24
    newDates.push(tmpTime)
  }
  return newDates
}

// this function draws the x and y axes in their domains.
function drawAxis(){
  var canvas = document.getElementById('canvas');
  if (canvas.getContext){
    var ctx = canvas.getContext('2d');
    setDomains(canvas)

    ctx.lineWidth = 1

    // draw x-axis, a line in the middle of the domain
    ctx.beginPath();
    ctx.moveTo(domainAxisX[0], (domainAxisX[3] + domainAxisX[1]) /2);
    ctx.lineTo(domainAxisX[2], (domainAxisX[3] + domainAxisX[1]) /2);
    ctx.stroke();

    // draw y-axis, a line in the middle of the domain
    ctx.beginPath();
    ctx.moveTo( (domainAxisY[2] + domainAxisY[0]) /2, domainAxisY[1]);
    ctx.lineTo( (domainAxisY[2] + domainAxisY[0]) /2, domainAxisY[3]);
    ctx.stroke();

  }
}

// this function draws the graph in its domain, and draws the scaling on the y axis. It takes
// a padding (distance between the maximum values to the top and bottom of the domain) and an
// interval (distance between the scaling on the y axis) as input.
function drawPoints(initialPadding, initialInterval){

  // prevent too small padding and interval
  padding = initialPadding < 10 ? 10 : initialPadding
  interval = initialInterval < 10 ? 10 : initialInterval

  // create a transform function to correctly display temperature in the canvas.
  maxTemp = Math.max(...temperatures)
  minTemp = Math.min(...temperatures)
  // padding is added to keep the top of the graph from hitting to top of the canvas
  transformTemp = createTransform([maxTemp + padding, minTemp - padding], [domainGraph[1], domainGraph[3]]);

  // create a transform function to correctly display days in the canvas.
  newDates = translateDates(dates)
  maxDate = Math.max(...newDates)
  minDate = Math.min(...newDates)
  transformDates = createTransform([minDate, maxDate], [domainGraph[0], domainGraph[2]])

  var canvas = document.getElementById('canvas');
  if (canvas.getContext){
    var ctx = canvas.getContext('2d');

    // create the points of the graph based on temperature and date
    ctx.beginPath();
    ctx.moveTo(transformDates(newDates[0]), transformTemp(temperatures[0]));
    for (i = 1, l = temperatures.length; i < l; i++){
      ctx.lineTo(transformDates(newDates[i]), + transformTemp(temperatures[i]));
    }
    ctx.stroke();

    // create a dynamic y axis scaling. the ~~ is used from trimming the decimals from float
    // values, which was needed to count the amount of interval values between the min and max
    // value
    for (var i = 0, marks = ~~(maxTemp / interval) - ~~(minTemp / interval); i <= marks; i++){
      ctx.beginPath();

      // make a horizontal line starting on the y axis of dynamic length (arbitrarily chosen).
      // the amount of lines drawn is determined by the interval value, and the heigth of the
      // lines are adjusted for temperature values (scaled using the same transformation function
      // as the temperatures).
      ctx.moveTo((domainAxisY[2] + domainAxisY[0]) /2,
        transformTemp(~~((maxTemp - i * interval) / interval) * interval));
      ctx.lineTo((domainAxisY[2] + domainAxisY[0]) / 10 * 3,
        transformTemp(~~((maxTemp - i * interval) / interval) * interval));
      ctx.stroke();

      // draw the numbers at the marks described above.
      fontSize = 20
      ctx.font="%dpx Georgia", fontSize;
      tempString = ~~((maxTemp - i * interval) / interval) * interval
      ctx.fillText(tempString.toString(), 0 ,
        transformTemp(~~((maxTemp - i * interval) / interval) * interval));
    }

  }
}
