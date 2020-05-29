var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import d
(async function(){
  var data = await d3.csv("assets/data/data.csv").catch(function(error) {
    console.log(error);
  });

    // Step 1: Parse d/Cast as numbers
    // ==============================
    data.forEach(d => {
        d.poverty = +d.poverty;
        d.healthcare = +d.healthcare;
    });

    // Step 2: Create scale functions
    // ==============================
    var xScale = d3.scaleLinear()
        .domain([8, d3.max(data, d => d.poverty * 1.2)])
        .range([0, width]);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.healthcare * 1.2)])
        .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

    chartGroup.append("g")
        .call(yAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle").data(data).enter()

    circlesGroup.append("circle")
        .attr("cx", d => xScale(d.poverty) - 0.05)
        .attr("cy", d => yScale(d.healthcare))
        .attr("r", "10")
        .attr("class", "stateCircle");


    circlesGroup.append("text")
        .text(d => {
            return d.abbr;
        })
        .attr("dx", d => xScale(d.poverty))
        .attr("dy", d => yScale(d.healthcare))
        .attr("font-size", 8)
        .attr("class", "stateText");


    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);
    chartGroup.append("g")
        .call(yAxis)

    // Create axes labels
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("In Poverty (%)");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("Lacks Healthcare (%)");
})()