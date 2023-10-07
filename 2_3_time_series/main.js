/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 40, bottom: 60, left: 80, right: 40 };

/* LOAD DATA */
d3.csv('../data/US_Births.csv', d3.autoType)
  .then(data => {
    data.forEach(d => {
      d.year = d3.timeParse('%Y')(d.year); 
    });

    // SCALES
    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => d.year))
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.births)])
      .range([height - margin.bottom, margin.top]);

    // CREATE SVG CONTAINER
    const svg = d3.select("#container")
      .append("svg")
      .attr("height", height)
      .attr("width", width);

    // BUILD AND CALL AXES
    const xAxis = d3.axisBottom(xScale)
      .tickFormat(d3.timeFormat('%Y')); 

    const xAxisGroup = svg.append("g")
      .attr("class", "xAxis")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(xAxis);

    const yAxis = d3.axisLeft(yScale);

    const yAxisGroup = svg.append("g")
      .attr("class", "yAxis")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(yAxis);

    // AREA GENERATOR FUNCTION
    const areaGenerator = d3.area()
      .x(d => xScale(d.year))
      .y0(height - margin.bottom)
      .y1(d => yScale(d.births));

    // DRAW AREA
    svg.append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", areaGenerator)
      .attr("fill", "green");

      // Add X-Axis Title
    svg.append("text")
    .attr("x", width / 2)
    .attr("y", height - 10)
    .style("text-anchor", "middle")
    .text("Year");

  // Add Y-Axis Title
  svg.append("text")
    .attr("x", -height / 2)
    .attr("y", margin.left / 4)
    .attr("transform", "rotate(-90)")
    .style("text-anchor", "middle")
    .text("Total Births");

  // Add Main Title
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", margin.top / 2)
    .style("text-anchor", "middle")
    .style("font-size", "18px")
    .text("US Births Over Time");
  });
