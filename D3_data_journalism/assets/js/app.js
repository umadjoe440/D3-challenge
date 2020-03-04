// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 600;

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

// Import Data
d3.csv("assets/data/data.csv").then(function (censusData) {


  // Step 1: Parse Data/Cast as numbers
  // ==============================
  censusData.forEach(function (data) {
    data.healthcare = +data.healthcare;
    data.poverty = +data.poverty;
    data.smokes = +data.smokes;
    data.obesity = +data.obesity;
    data.age = +data.age;
    data.income = +data.income;
  });

  // Step 2: Create scale functions
  // ==============================
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d.poverty), d3.max(censusData, d => d.poverty)])
    .range([0, width]);
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d.healthcare), d3.max(censusData, d => d.healthcare)])
    .range([height, 0]);


  // Step 3: Create axis functions
  // ==============================
  var xAxis = d3.axisBottom(xLinearScale);
  var yAxis = d3.axisLeft(yLinearScale);

  // Step 4: Append Axes to the chart
  // ==============================
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);

  chartGroup.append("g")
    .call(yAxis);
  // Step 5: Create Circles
  // ==============================
  var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "lightblue")
    .attr("stroke-width", "1")
    .attr("stroke", "black");


  console.log(censusData);
  //Add the SVG Text Element to the svgContainer
  var circleText = chartGroup.append("text")
    .selectAll("tspan")
    .data(censusData)
    .enter()
    .append("tspan")
    .attr("x", d => xLinearScale(d.poverty) - 6)
    .attr("y", d => yLinearScale(d.healthcare) + 4)
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    .attr("fill", "black")
    .text(function (d) { return d.abbr; });


  // Step 6: Initialize tool tip
  // ==============================
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .html(function (d) {
      return (`<strong>${d.state}<hr><strong>Poverty: ${d.poverty}<br><strong>Healthcare: ${d.healthcare}`);
    });

  // Step 7: Create tooltip in the chart
  // ==============================
  chartGroup.call(toolTip);
  // Step 8: Create event listeners to display and hide the tooltip
  // ==============================
  circlesGroup.on("mouseover", function (d) {
    toolTip.show(d, this);
  })
    .on("mouseout", function (d) {
      toolTip.hide(d);
    });

  // Create axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Lacks Healthcare (%)");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("In Poverty (%)");
}).catch(function (error) {
  console.log(error);
});
