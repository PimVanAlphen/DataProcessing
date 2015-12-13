$("#container1").datamap({
   scope: 'europe',
   geography_config: {
     borderColor: 'rgba(255,255,255,0.3)',
     highlightBorderColor: 'rgba(0,0,0,0.5)',
     popupTemplate: _.template([
       '<div class="hoverinfo">',
       '<strong><%= geography.properties.name %></strong><br/>',
       '<% if (data.population) { %>',
       'Population: <%= data.population %><br/> <% } %>',
       '</div>'
      ].join('') )
   },
   fills: {
     population1: '#d73027',
     population10: '#fc8d59',
     population50: '#fee090',
     population100: '#e0f3f8',
     population500: '#91bfdb',
     population1000: '#4575b4',
     defaultFill: '#AAAAAA'
   },
   data: {
     'RUS': {fillKey: 'population1000', population:144031000},'DEU': {fillKey: 'population1000', population:81276000},'TUR': {fillKey: 'population1000', population:78214000},'FRA': {fillKey: 'population1000', population:67063000},'GBR': {fillKey: 'population1000', population:65081276},'ITA': {fillKey: 'population1000', population:60963000},'ESP': {fillKey: 'population500', population:46335000},'UKR': {fillKey: 'population500', population:42850000},'POL': {fillKey: 'population500', population:38494000},'ROU': {fillKey: 'population500', population:19822000},'KAZ': {fillKey: 'population500', population:17543000},'NLD': {fillKey: 'population500', population:16933000},'BEL': {fillKey: 'population500', population:11259000},'GRC': {fillKey: 'population500', population:10769000},'CZE': {fillKey: 'population500', population:10535000},'PRT': {fillKey: 'population500', population:10311000},'HUN': {fillKey: 'population100', population:9835000},'SWE': {fillKey: 'population100', population:9816666},'AZE': {fillKey: 'population100', population:9651000},'BLR': {fillKey: 'population100', population:9481000},'AUT': {fillKey: 'population100', population:8608000},'CHE': {fillKey: 'population100', population:8265000},'BGR': {fillKey: 'population100', population:7185000},'SRB': {fillKey: 'population100', population:7103000},'DNK': {fillKey: 'population100', population:5673000},'FIN': {fillKey: 'population100', population:5475000},'SVK': {fillKey: 'population100', population:5426000},'NOR': {fillKey: 'population100', population:5194000},'IRL': {fillKey: 'population50', population:4630000},'HRV': {fillKey: 'population50', population:4230000},'BIH': {fillKey: 'population50', population:3750000},'GEO': {fillKey: 'population50', population:3707000},'MDA': {fillKey: 'population50', population:3564000},'ARM': {fillKey: 'population50', population:3010000},'LTU': {fillKey: 'population50', population:2906000},'ALB': {fillKey: 'population50', population:2887000},'MKD': {fillKey: 'population50', population:2071000},'SVN': {fillKey: 'population50', population:2065000},'LVA': {fillKey: 'population50', population:1979000},'EST': {fillKey: 'population50', population:1315000},'CYP': {fillKey: 'population10', population:876000},'MNE': {fillKey: 'population10', population:620000},'LUX': {fillKey: 'population10', population:570000},'MLT': {fillKey: 'population10', population:425000},'ISL': {fillKey: 'population10', population:331000},'AND': {fillKey: 'population1', population:78000},'LIE': {fillKey: 'population1', population:37000},'MCO': {fillKey: 'population1', population:37000},'SMR': {fillKey: 'population1', population:33000},'VAT': {fillKey: 'population1', population:800},
   }
});

// nu komt het bar chart gedeelte

d3.json("countriesJson.txt", function(data){

  function getColor(population){
    if (population <= 100000) {return '#d73027'}
    else if (population <= 1000000) {return '#fc8d59'}
    else if (population <= 5000000) {return '#fee090'}
    else if (population <= 10000000) {return '#e0f3f8'}
    else if (population <= 50000000) {return '#91bfdb'}
    else {return '#4575b4'}
  }

  var body = d3.select("body")

  var margin = {top: 10, right: 0, bottom: 180, left: 100};

  var width = 960 - margin.left - margin.right,
      height = 550 - margin.top - margin.bottom;

  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], 0.1);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10);

    x.domain(data.map(function(d) { return d[0]; }));
    y.domain([0, data[0][1]]);

    function rescale() {
        y.domain([0, data[0][1]])  // change scale to 0, to between 10 and 100
        x.domain(data.map(function(d) { return d[0]; }));

        svg.select(".y axis")
            .call(yAxis);
        svg.select(".x axis")
            .call(xAxis);
    }

    function update(data) {
      svg.selectAll("g").remove()

      var gXAxis = svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
      gXAxis.selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", "rotate(-65)" )

      var gYAxis = svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
      gYAxis.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Population");

      var bars = svg.selectAll(".bar")
          .data(data)
      bars.enter().append("rect")
          .attr("class", "bar")
      bars.attr("id", function(d) { return d[0]; })
          .attr("x", function(d) { return x(d[0]); })
          .attr("width", x.rangeBand())
          .attr("y", function(d) { return y(d[1]); })
          .attr("height", function(d) { return height - y(d[1]); })
          .style("fill",function(d) {return getColor(d[1])})
          .style("stroke","black")
          .on("click", function(d, i){
              data.splice(i, 1)
              rescale()
              update(data)
          });
      bars.exit().remove()
    }
    update(data)
})
// einde barchart

barColor = ""

var paths = d3.select("body").select("g").selectAll("path")
paths.on('mouseover.paths', function() {
  this.style.opacity = 0.6
  var hover = document.querySelector(".hoverinfo").innerText
  hover = hover.split("\n")[0]
  hover = ("#" + hover.trim())
  var bar = document.querySelector(hover)
  barColor = bar.style.fill
  bar.style.fill = "#FF0000"
})

paths.on("mouseout.paths", function() {
  this.style.opacity = 1
  var hover = document.querySelector(".hoverinfo").innerText
  hover = hover.split("\n")[0]
  hover = ("#" + hover.trim())
  var bar = document.querySelector(hover)
  bar.style.opacity = 1
  bar.style.fill = barColor
})
