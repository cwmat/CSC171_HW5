// SVG drawing area

var margin = {
  top: 40,
  right: 40,
  bottom: 60,
  left: 60
};

var width = 600 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

var svg = d3.select("#chart-area").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// Scales
var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

// Axiis
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var yAxisGroup = svg.append("g")
    .attr("class", "y-axis axis");

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var xAxisGroup = svg.append("g")
    .attr("class", "x-axis axis")
    .attr("transform", "translate(0," + height + ")");


// Date parser (https://github.com/mbostock/d3/wiki/Time-Formatting)
var formatDate = d3.time.format("%Y");

// FIFA world cup
var data;

// Initialize data
loadData();


// Load CSV file
function loadData() {
  d3.csv("data/fifa-world-cup.csv", function(error, csv) {

    if (error) {
      console.log("Data did not load properly!");
      console.log(error.responseURL + " " + error.status + " " + error.statusText);
    } else {
      csv.forEach(function(d) {
        // Convert string to 'date object'
        d.YEAR = formatDate.parse(d.YEAR);

        // Convert numeric values to 'numbers'
        d.TEAMS = +d.TEAMS;
        d.MATCHES = +d.MATCHES;
        d.GOALS = +d.GOALS;
        d.AVERAGE_GOALS = +d.AVERAGE_GOALS;
        d.AVERAGE_ATTENDANCE = +d.AVERAGE_ATTENDANCE;
      });

      // Store csv data in global variable
      data = csv;

      // Draw the visualization for the first time
      updateVisualization();
    }
  });
}


// Render visualization
function updateVisualization() {
  console.log(data);

	// Retrieve current selection
	var currentSelection = d3.select("#chart-data-select").property("value");

	// Update Domains
	x.domain(d3.extent(data, function(d) { return d.YEAR; }));
	y.domain([0, d3.max(data, function(d) { return d[currentSelection]; })]);


	// Update axiis
  svg.select(".y-axis")
      .transition()
      .duration(1000)
      .call(yAxis);
  svg.select(".x-axis")
      .transition()
      .duration(1000)
      .call(xAxis);

	// Make line object for use in path
	var line = d3.svg.line()
      .x(function(d) {
        return x(d.YEAR);
      })
      .y(function(d) {
        return y(d[currentSelection]);
      })
			.interpolate("monotone");

	// Data join
	// Path
	var path = svg.selectAll(".line")
			.data(data);

	// Dots
	var dots = svg.selectAll("circle")
			.data(data);


	// Update
	// Path
	path.transition()
			.duration(1000)
			// .attr("class", "line")
			.attr("d", line(data));

	// Dots
	var dotSize = 5;

	dots.transition()
			.duration(1000)
			.attr({
				cx: function(d) { return x(d.YEAR); },
				cy: function(d) {return y(d[currentSelection]); },
				r: dotSize,
				class: "dots",
			});

	// Enter
	// Path
	path.enter()
		.append("path")
			.attr("class", "line")
			.attr("d", line(data));

	//Dots
	dots.enter()
		.append("circle")
			.attr({
				cx: function(d) { return x(d.YEAR); },
				cy: function(d) {return y(d[currentSelection]); },
				r: dotSize,
				class: "dots",
			});

	// Exit
	path.exit().remove();
	dots.exit().remove();
}


// Show details for a specific FIFA World Cup
function showEdition(d) {

}
