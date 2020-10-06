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

// Initial Params
// var chosenXAxis = "hair_length";
var chosenXAxis = "poverty"

// intial yxais param
var chosenYAxis = "healthcare"
//  Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function (povertyData, err) {
    if (err) throw err;

    // parse data
    povertyData.forEach(function (data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        data.age = +data.age;
        data.obesity = +data.obesity
        data.smokes = +data.smokes
       
    });

    // xLinearScale function above csv import
    var xLinearScale = xScale(povertyData, chosenXAxis);

    var yLinearScale = yScale(povertyData, chosenYAxis);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // append y axis
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);

    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(povertyData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", 15)
        .attr("fill", "red")
        .attr("opacity", ".5");

    //  Append initial labels for circles
    var circleLabels = chartGroup.append("text")
        .selectAll("tspan")
        .data(povertyData)
        .enter()
        .append("tspan")
        .attr("x", d => xLinearScale(d[chosenXAxis]) - 7)
        .attr("y", d => yLinearScale(d[chosenYAxis]) + 5)
        .text(d => d.abbr)
        .attr("fill", "black")
        .attr("font-size", "12px");

    // Create group for two x-axis labels
    var labelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var povertyLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("In Poverty (%)");

    var ageLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age") // value to grab for event listener
        .classed("inactive", true)
        .text("Age(mean)");
        
    var HouseholdLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income") // value to grab for event listener
        .classed("inactive", true)
        .text("Household Income");
        
        // ----------------------chart group yaxis labels--------------------------------------------------------------------
    var ylabelsGroup = chartGroup.append("g")

    // append y axis
    var healthcareLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 10 - margin.left)
        .attr("x", 10 - (height / 2))
        .attr("dy", "1em")
        .attr("value", "healthcare")
        .classed("active", true)
        .text("Lacks Health care");

    var ObesityLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 30 - margin.left)
        .attr("x", 30 - (height / 2))
        .attr("dy", "1em")
        .attr("value", "obesity")// value to grab for event listener
        .classed("inactive", true)
        .text("Obesity (%)");

    var smokesLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 50 - margin.left)
        .attr("x", 50 - (height / 2))
        .attr("dy", "1em")
        .attr("value", "smokes")// value to grab for event listener
        .classed("active", true)
        .text("Smokes");

    // updateToolTip function above csv import
     var circlesGroup = updateToolTip(chosenXAxis,chosenYAxis, circlesGroup);

    // x axis labels event listener
    labelsGroup.selectAll("text")
        .on("click", function () {
            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {

                // replaces chosenXAxis with value
                chosenXAxis = value;

                // functions here found above csv import
                // updates x scale for new data
                xLinearScale = xScale(povertyData, chosenXAxis);

                // updates x axis with transition
                xAxis = renderAxes(xLinearScale, xAxis);

                
                // updates circles with nrenderCirclesew x values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis)
                
                // updates circle labels with new info
                
                circleLabels = renderXLabels(circleLabels, xLinearScale, chosenXAxis);

  // updates tooltips with new info
  circlesGroup = updateToolTip(chosenXAxis,chosenYAxis, circlesGroup);



               // changes classes to change bold text
               if (chosenXAxis === "age") {
                ageLabel
                    .classed("active", true)
                    .classed("inactive", false);
                povertyLabel
                    .classed("active", false)
                    .classed("inactive", true);
                    HouseholdLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else if(chosenXAxis==="Household Income"){

                ageLabel
                .classed("active", false)
                .classed("inactive", true);
            povertyLabel
                .classed("active", false)
                .classed("inactive", true);
                HouseholdLabel
                .classed("active", true)
                .classed("inactive", false);


            }
            else {
                ageLabel
                    .classed("active", false)
                    .classed("inactive", true);
                povertyLabel
                    .classed("active", true)
                    .classed("inactive", false);
                    HouseholdLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }


        }
    });

        
    // // ---------------------------------------ylabelclickable---------------------------------------------------------
    // updateToolTip function above csv import
    var circlesGroup = updateToolTip( chosenXAxis,chosenYAxis, circlesGroup);

    // x axis labels event listener
    ylabelsGroup.selectAll("text")
        .on("click", function () {
            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenYAxis) {

                // replaces chosenXAxis with value
                chosenYAxis = value;


                // functions here found above csv import
                // updates x scale for new data
                yLinearScale = yScale(povertyData, chosenYAxis);
                console.log(yLinearScale)
                // updates x axis with transition
                yAxis = renderyAxes(yLinearScale, yAxis);
                console.log(yAxis)
                // yaxis = renderYAxes(yLinearScale, yAxis);

                // updates circles with new x values
                circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis)
                
                // updates tooltips with new info
                 circleLabels = renderYLabels(circleLabels, yLinearScale, chosenYAxis);
  // updates tooltips with new info
   circlesGroup = updateToolTip(chosenXAxis,chosenYAxis, circlesGroup);
// ------------------------------------------------------------------------------------------------------

 // changes classes to change bold text
 if (chosenYAxis === "Obesity") {

    ObesityLabel
    .classed("active", true)
    .classed("inactive", false);
healthcareLabel
    .classed("active", false)
    .classed("inactive", true);
    smokesLabel  
    .classed("active", false)
    .classed("inactive", true); 

}

else if(chosenYAxis==="Smokes"){
    smokesLabel  
    .classed("active", true)
    .classed("inactive", false);
    healthcareLabel
    .classed("active", false)
    .classed("inactive", true);
    ObesityLabel
    .classed("active", false)
    .classed("inactive", true);
}
else {

    ObesityLabel
    .classed("active", false)
    .classed("inactive", true);
healthcareLabel
    .classed("active", true)
    .classed("inactive", false);
    smokesLabel  
    .classed("active", false)
    .classed("inactive", true);

}

             }
         });


// create tooltip function--------------------------------
// function used for updating circles group with new tooltip
 function updateToolTip(chosenXAxis,chosenYAxis,  circlesGroup) {
    // function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    var label;
     var ylabel;
    if (chosenXAxis === "poverty") {
        label = "poverty: %";
    }
    else if(chosenXAxis==="income") {
 label="income:";
    }
    else {
        label = "age";
    }
    if (chosenYAxis === "healthcareLow") {
        ylabel = "Health care: %";

    }
    else if(chosenYAxis==="smokes"){
        ylabel ="smokes: %"
    }
    else {
        ylabel = "obesity:"
    }

    //  tooltip function
    var toolTip = d3.tip()
        // .attr("class", "tooltip")
        .attr("class", "d3-tip")
        // .offset([80, -60])
        .offset([80,-60])
        .html(function (d) {
            // return (`${d.state}<br>${label} ${d[chosenXAxis]}`);<b
            return (`<strong>${d.state}</strong><br>${label} ${d[chosenXAxis]} % <br>${ylabel} ${d[chosenYAxis]} %  `);
            // return (`<strong>${d.state}</strong><br>${d.poverty} % Poverty<br>${d.obesity} % Obesity`);
        });

     circlesGroup.call(toolTip);
    //  chartGroup.call(toolTip);

    circlesGroup.on("mouseover", function (data) {
        toolTip.show(data, this);
    })
        // onmouseout event
        .on("mouseout", function (data) {
            toolTip.hide(data);
        });

        return circlesGroup;
    }



    // function xScale(povertyData, chosenXAxis)
    function xScale(povertyData, chosenXAxis) {
        // create scales
        var xLinearScale = d3.scaleLinear()
            .domain([d3.min(povertyData, d => d[chosenXAxis]) - 1,
            d3.max(povertyData, d => d[chosenXAxis])
            ])
            .range([0, width]);

        return xLinearScale;

    }

    // function used for updating the y-scale var upon click on axis label

    function yScale(povertyData, chosenYAxis) {
        // create scales
        var yLinearScale = d3.scaleLinear()

            .domain(([d3.min(povertyData, d => d[chosenYAxis]) / 1.5, d3.max(povertyData, d => d[chosenYAxis])]))
            .range([height, 0]);

        return yLinearScale;


    }
    // function used for updating xAxis var upon click on axis label
    function renderAxes(newXScale, xAxis) {
        var bottomAxis = d3.axisBottom(newXScale);

        xAxis.transition()
            .duration(1000)
            .call(bottomAxis);

        return xAxis;
    }
    // // function used for updating yAxis var upon click on axis label

    function renderyAxes(newYScale, yAxis) {
        var leftAxis = d3.axisLeft(newYScale);

        yAxis.transition()
            .duration(1000)
            .call(leftAxis);

        return yAxis;
    }
    // function used for updating circles group with a transition to
    // new circles
    function renderCircles(circlesGroup, newXScale, chosenXAxis) {

        circlesGroup.transition()
            .duration(1000)
            .attr("cx", d => newXScale(d[chosenXAxis]))
        // .attr("cy", d => newYScale(d[chosenYAxis]));
        return circlesGroup;
    }
    // // function used for updating circles group with a transition to
    // // new circles
    function renderYCircles(circlesGroup, newYScale, chosenYAxis) {

        circlesGroup.transition()
            .duration(1000)
            .attr("cy", d => newYScale(d[chosenYAxis]));

        return circlesGroup;
    }
    // Function used for updating bubble labels when new X axis is selected
    function renderXLabels(circleLabels, xLinearScale, chosenXAxis) {
        circleLabels.transition()
            .duration(1000)
            .attr("x", d => xLinearScale(d[chosenXAxis]) - 7);
        return circleLabels;
    }

    // Function used for updating bubble labels when new Y axis is selected
    function renderYLabels(circleLabels, yLinearScale, chosenYAxis) {
        circleLabels.transition()
            .duration(1000)
            .attr("y", d => yLinearScale(d[chosenYAxis]) + 5);
        return circleLabels;
    }
});