d3.json("dump", function(data){
    var dateParse = d3.time.format("%Y%m%d").parse;
    var dateFormat = d3.time.format("%d %B '%y")

    data.forEach(function(d) {
      d[0] = dateParse(d[0]);
      d[1] = (+d[1]) / 10.0;
    });

    var body = d3.select("body")
    var title = body.append("h1").html("Maximum temperature in \"De Bild\"").attr("class","title")
    var author = body.append("h3").html("By Pim van Alphen, 11082887")

    var height = 400
    var width = 600

    var bording = 40
    var padding = -40

    var svg = d3.select("body").append("svg")
        .attr("width", width + 2 * bording)
        .attr("height", height + 2 * bording)
        .attr("viewBox",  padding + " " + 0 + " " + (width + 2 * bording)
          + " " + (height + 2 * bording))
        .attr("id","svg")

    var x = d3.time.scale()
        .range([bording, width]);

    var y = d3.scale.linear()
        .range([height, bording]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var line = d3.svg.line()
        .x(function(d) { return x(d[0]); })
        .y(function(d) { return y(d[1]); });

    //var invisibleRect = svg.append("rect")
    //    .attr("width", width)
    //    .attr("height", height-bording)
    //    .attr("x", bording - padding)
    //    .attr("y", bording - padding)
    //    .attr("opacity", 0)

    x.domain(d3.extent(data, function(d) { return d[0]; }));
    y.domain(d3.extent(data, function(d) { return d[1]; }));

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height + bording) + ")")
        .call(xAxis);
      svg.append("text")
        .attr("class", "label")
        .attr("text-anchor", "start")
        .attr("y", height + bording - 10)
        .attr("x", bording * 2 + padding)
        .text("Date");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      svg.append("text")
        .attr("class", "label")
        .attr("text-anchor", "end")
        .attr("y", 20)
        .attr("x", - height - padding + 2 * bording  )
        .attr("transform", "rotate(-90)")
        .text("Temperature");

    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);

    var crossX = svg.append("rect")
        .attr("class", "crosshair")
        .attr("width","2")
        .attr("height", (height-bording))
        .attr("x",(width/2 + bording))
        .attr("y", bording)
        .attr("fill","black")
        .style("visibility","hidden")

    var crossY = svg.append("rect")
        .attr("class", "crosshair")
        .attr("width",(width-bording))
        .attr("height", 2)
        .attr("x",bording)
        .attr("y", (height/2 + bording))
        .attr("fill","black")
        .style("visibility","hidden")

    var ttTemp = body.append("div")
            .style("display", "none")
            .style("position", "absolute")
            .style("width","80px")
            .style("height","20px")
            .style("font", "12px sans-serif")
            .style("font-weight","bold")
            .style("color","white")
            .style("background","black")

    var ttDate = body.append("div")
            .style("display", "none")
            .style("position", "absolute")
            .style("width","70px")
            .style("height","30px")
            .style("transform", "rotate(90deg)")
            .style("font", "12px sans-serif")
            .style("font-weight","bold")
            .style("color","white")
            .style("background","black")

    svg.on('mouseover', function(d, i) {
      var coordinates = d3.mouse(document.getElementById("svg"))

      coordinates[0] = (coordinates[0] > width) ? width : coordinates[0];
      coordinates[0] = (coordinates[0] < bording) ? bording : coordinates[0];

      var index = d3.round(((coordinates[0]-bording) / (width- bording)) * data.length)

      coordinates[1] = data[index][1]

      crossX.style("visibility","visible")
          .attr("x",coordinates[0])
      crossY.style("visibility","visible")
          .attr("y",y(coordinates[1]))

      console.log(coordinates[0], y(coordinates[1]))

      ttTemp.style("left", (coordinates[0] - 80) + "px")
          .style("top", (y(coordinates[1]) + bording - padding) + "px")

      ttDate.style("left", (coordinates[0] - 5) + "px")
          .style("top", (y(coordinates[1]) + bording - padding + 80) + "px")

      setTimeout(function(){
        ttTemp.html("Temp: " + coordinates[1] + "°C")
            .style("display", "block")
        ttDate.html("Date: " + dateFormat(data[index][0]))
            .style("display", "block")
      }, 1500);

    })

    svg.on("mouseout", function(d) {
        crossX.style("visibility","hidden")
        crossY.style("visibility","hidden")
        ttTemp.style("display", "none")
        ttDate.style("display", "none")
    })



    var dataSource = body.append("p").html("This graph displays the maximum"+
    " temperature at the given dates. Dates range from 11 november 2014 to 11"+
    " november 2015. Data is taken from http://projects.knmi.nl/klimatologie/"+
    "daggegevens/selectie.cgi.").attr("class","source")

})
