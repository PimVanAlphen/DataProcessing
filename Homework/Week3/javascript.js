dataPoints = document.getElementById("rawdata")
dataText = dataPoints.innerHTML
dataLines = dataText.split('\n')

dates = []
temperatures = []

// loop from 1 till length - 1 to skip empty entries at front and back
for (var i = 1, l = dataLines.length - 1; i < l; i++) {

  // split the date and temp in different strings
  var tmpLines = dataLines[i].split(',')

  // make the date string into a javascript date
  var tmpString = tmpLines[0]
  var tmpDate = new Date(tmpString.substring(0,2), tmpString.substring(2,4),
    tmpString.substring(4,8))
  dates.push(tmpDate)

  // make the temp string into a number
  var tmpString = tmpLines[1]
  var tmpTemp = tmpString.substring(2, tmpString.length)
  temperatures.push(Number(tmpTemp))
}

function draw(){
  var canvas = document.getElementById('tutorial');
  if (canvas.getContext){
    var ctx = canvas.getContext('2d');

    ctx.fillStyle = "rgb(200,0,0)";
    ctx.fillRect (10, 10, 55, 50);

    ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
    ctx.fillRect (30, 30, 55, 50);
  }
}

// example use: createTransform([10, 20], [10, 20]);
function createTransform(domain, range){
	var beta = range[0];
	var alpha = (range[1] - range[0])/(domain[1] - domain[0]);

	return function(x){
				return alpha * (x - domain[0]) + beta;
	};
}
