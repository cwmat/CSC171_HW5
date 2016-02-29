// Disable forms
$('form').submit(false);

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


// Transition Speed
var transitionSpeed = 800;


// Date parser (https://github.com/mbostock/d3/wiki/Time-Formatting)
var formatDate = d3.time.format("%Y");

// FIFA world cup
var data,
		filtered,
		tip;

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
			filtered = csv;

      // Draw the visualization for the first time
      updateVisualization();
    }
  });
}


// Render visualization
function updateVisualization() {
  console.log(filtered);

	// Retrieve current selection
	var currentSelection = d3.select("#chart-data-select").property("value");

	// Initialize tool tip
	tip = d3.tip().attr('class', 'd3-tip').html(function(d) { return "<p>" + d.EDITION + "</p><p>" + d[currentSelection] + "</p>"; });
	svg.call(tip);

	// Update Domains
	x.domain(d3.extent(filtered, function(d) { return d.YEAR; }));
	y.domain([0, d3.max(filtered, function(d) { return d[currentSelection]; })]);


	// Update axiis
  svg.select(".y-axis")
      .transition()
      .duration(transitionSpeed)
      .call(yAxis);
  svg.select(".x-axis")
      .transition()
      .duration(transitionSpeed)
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
			.data(filtered);

	// Dots
	var dots = svg.selectAll("circle")
			.data(filtered);


	// Update
	// Path
	path.transition()
			.duration(transitionSpeed)
			// .attr("class", "line")
			.attr("d", line(filtered));

	// Dots
	var dotSize = 7;

	dots.transition()
			.duration(transitionSpeed)
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
			.attr("d", line(filtered));

	//Dots
	dots.enter()
		.append("circle")
			.attr({
				cx: function(d) { return x(d.YEAR); },
				cy: function(d) {return y(d[currentSelection]); },
				r: dotSize,
				class: "dots",
			})
			.on("mouseenter", tip.show)
			.on("mouseleave", tip.hide);

	// Exit
	path.exit().remove();
	dots.exit().remove();
}

// Filter data based on click event
function filterData() {
	var startRange = d3.select("#start-range").property("value")
	var endRange = d3.select("#end-range").property("value")

	filtered = data.filter(function(d) {
		// console.log(d.YEAR);
		if (d.YEAR >= formatDate.parse(startRange) && d.YEAR <= formatDate.parse(endRange)) {
			return d;
		}
	});

	console.log(filtered);
	updateVisualization();
}

// Clear Filter
function clearFilter() {
	filtered = data;

	$("#start-range").val("1930");
	$("#end-range").val("2014");

	updateVisualization();
}


// Show details for a specific FIFA World Cup
function showEdition(d) {

}
