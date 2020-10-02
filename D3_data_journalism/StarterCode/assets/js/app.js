// @TODO: YOUR CODE HERE!
//  code for the scatter plot
var svgWidth = 750;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 60, 
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart and shift the latter by left and top margins
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(povertyData) {
 // Parse Data & Cast as numbers
 povertyData.forEach(function(data) {
    data.healthcare = +data.healthcare;
    data.poverty = +data.poverty;
});
// Create scale functions
var xLinearScale = d3.scaleLinear()
.domain(d3.extent(povertyData, d => d.poverty))
.range([0, width]);

var yLinearScale = d3.scaleLinear()
.domain([2, d3.max(povertyData, d => d.healthcare)])
.range([height, 0]);

// Create axis functions
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

// Append axes to the chart
chartGroup.append("g")
.attr("transform", `translate(0, ${height})`)
.call(bottomAxis);

chartGroup.append("g")
.call(leftAxis);

// Create circles
var circlesGroup = chartGroup.selectAll("Circle")
.data(povertyData)
.enter()
.append("circle")
.attr("cx", d => xLinearScale(d.poverty))
.attr("cy", d => yLinearScale(d.healthcare))
.attr("r", "12")
.attr("fill","skyblue")

//   .attr("fill", "rgb(117, 145, 197)") 
.attr("opacity", "0.5");

// Add state labels to the points
//   code added for the circle labels--------------------------------
var circleLabels = chartGroup.selectAll(null).data(povertyData).enter().append("text");

circleLabels
.attr("x", function(d) {
 return xLinearScale(d.poverty);
})
.attr("y", function(d) {
 return yLinearScale(d.healthcare);
})
.text(function(d) {
 return d.abbr;
})
.attr("font-family", "sans-serif")
.attr("font-size", "10px")
.attr("text-anchor", "middle")
.attr("fill", "white");

// Create axes labels
chartGroup.append("text")
.attr("transform", "rotate(-90)")
.attr("y", 0 - margin.left + 40)
.attr("x", 0 - (height / 2))
.attr("dy", "1em")
.attr("class", "aText")
.style("text-anchor", "middle")
.style('stroke', '#000')
.text("Lacks Healthcare (%)");

chartGroup.append("text")
.attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
.attr("class", "aText")
.style("text-anchor", "middle")
.style('stroke', '#000')
.text("In Poverty (%)");

// Initialize tooltip
var toolTip = d3.tip() 
.attr("class", "d3-tip")
.offset([80, -60])
.html(function(d) {
  return  `${d.state}<br>Poverty : ${d.poverty} <br>Healthcare: ${d.healthcare}<br>`; 
});

// Create tooltip in the chart
chartGroup.call(toolTip);

// Create event listeners to display and hide the tooltip
circlesGroup.on("mouseover", function(data) {
toolTip.show(data, this);
})
// onmouseout event
.on("mouseout", function(data, index) {
  toolTip.hide(data);
});

});