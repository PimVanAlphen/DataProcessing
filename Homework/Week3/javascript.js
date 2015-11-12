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

  // make the date string into a javascript date
  var tmpString = tmpLines[0].trim()
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

// domain [x1, y1, x2, y2]
function setDomains(canvas){
  domainAxisY = [0, 0, canvas.width/10, canvas.height /10 *9]
  domainAxisX = [canvas.width/10, canvas.height /10 *9, canvas.width, canvas.height]
  domainGraph = [canvas.width/10, 0, canvas.width, canvas.height/10 *9]
}

function translateDates(dates){
  newDates = []
  for (var i = 0, l = dates.length; i < l; i++){
    var tmpDate = dates[i].getTime() - dates[0].getTime()
    var tmpTime = tmpDate / 1000 / 60 / 60 / 24
    newDates.push(tmpTime)
  }
  return newDates
}

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


function drawPoints(){
  maxTemp = Math.max(...temperatures)
  minTemp = Math.min(...temperatures)
  transformTemp = createTransform([maxTemp, minTemp], [domainGraph[1], domainGraph[3]]);

  newDates = translateDates(dates)
  maxDate = Math.max(...newDates)
  minDate = Math.min(...newDates)
  transformDates = createTransform([minDate, maxDate], [domainGraph[0], domainGraph[2]])

  var canvas = document.getElementById('canvas');
  if (canvas.getContext){
    var ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(transformDates(newDates[0]), transformTemp(temperatures[0]));
    for (i = 1, l = temperatures.length; i < l; i++){
      ctx.lineTo(transformDates(newDates[i]), + transformTemp(temperatures[i]));
    }
    ctx.stroke();
  }
}
