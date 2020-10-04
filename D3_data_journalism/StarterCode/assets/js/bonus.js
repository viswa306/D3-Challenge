// @TODO: YOUR CODE HERE!
// @TODO: YOUR CODE HERE!
// The code for the chart is wrapped inside a function
// that automatically resizes the chart
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
// Initial Params

var chosenXAxis = "poverty"

// function used for updating x-scale var upon click on axis label

// function xScale(hairData, chosenXAxis)
function xScale(povertyData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(povertyData, d => d[chosenXAxis])-1 ,
      d3.max(povertyData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}
//  newcode added------------------------------------------------------------------------
// function to update position of the circle labels based on the new values
function renderCircleLabels(circleLabels, newXScale, chosenXAxis){
  circleLabels.transition()
  .duration(1000)
  .attr("x", d => newXScale(d[chosenXAxis]));
  return circleLabels;
}
// ---------------------------------------------------------------------------------------------
// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

  var label;

  if (chosenXAxis === "poverty") {
    label = "poverty: %";
  }
  else {
    label = "# of Health care:";
  }



  // ----------------------------------------------
//   var tip = d3Tip().attr('class', 'd3-tip').offset([-12,0])
// .html(function(d) {
//   /*  your code goes here */
// });
// -----------------------------------------------------------------------------
var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80,-60])
      // .offset([10,20])
        .html(function(d) {
      return (` states:${d.state}<br> Healthcare:${d.healthcareLow}<br>  poverty:${d[chosenXAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data,this);

  })
  // circlesGroup.call(toolTip);    
  //   // put event listener here
  //   circlesGroup.on("mouseover", function (data) {
  //       toolTip.show(data, this);
  //   })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(povertyData, err) {
  if (err) throw err;

  // parse data
  povertyData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcareLow = +data.healthcareLow;
    data.age = +data.age;
    data.income = +data.income;
    data.obesity =+data.obesity;
    data.smokes = +data.smokes;
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(povertyData, chosenXAxis);

  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(povertyData, d => d.healthcareLow)])
    .range([height, 0]);
console.log(yLinearScale)
  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(povertyData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.healthcareLow))
    .attr("r", 15)
    .attr("fill", "purple")
    // .attr("text","abc")
     .attr("opacity", ".5");

    
// circle lables added-----------------------------
var circleLabels = chartGroup.selectAll(null).data(povertyData).enter().append("text");

circleLabels
.attr("x", function(d) {
  return xLinearScale(d.poverty);
})
.attr("y", function(d) {
  return yLinearScale(d.healthcareLow);
})
.text(function(d) {
  return d.abbr;
})
.attr("font-family", "sans-serif")
.attr("font-size", "10px")
.attr("text-anchor", "middle")
.attr("fill", "black")

  // Create group for two x-axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .style('stroke', '#000')
    .text("In Poverty (%)");

  var ageLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 37)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .style('stroke', '#000')
    .text("Age(mean)");

//  income label-------------------------------------------
var incomeLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 55)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .style('stroke', '#000')
    .text("HouseHold Income(median) ");


// ------------------------------------------------------------

  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .style('stroke', '#000')
    .text("Lacks Health care");
   
  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      // // To remove the text
      // text.html("");
      
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(povertyData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        // update the circlelables with new x values
        circleLabels =  renderCircleLabels(circleLabels, xLinearScale, chosenXAxis)

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "age") {
          
          ageLabel
            .classed("active", true)
            .classed("inactive", false);

          povertyLabel
            .classed("active", false)
            .classed("inactive", true);

          
            
        }

        //  write code if the chosen axis  === household income
          else if (chosenXAxis === "income"){

            incomeLabel
            .classed("active", true)
            .classed("inactive", false);

            ageLabel
            .classed("active", false)
            .classed("inactive", true);

          povertyLabel
            .classed("active", false)
            .classed("inactive", true)
          }
// ------------------------------------------------------------------------------
        else {
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
         povertyLabel
            .classed("active", true)
            .classed("inactive", false);
            
        }
      }
    });
}).catch(function(error) {
  console.log(error);
});
