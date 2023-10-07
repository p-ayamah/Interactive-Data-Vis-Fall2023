/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 40, bottom: 60, left: 60, right: 40 };

/* LOAD DATA */
d3.csv("../data/MoMA_distributions.csv", d3.autoType).then(data => {
  console.log(data);

  //THE SVG CONTAINER
  const svg = d3
    .select("#container")
    .append("svg")
    .attr("height", height)
    .attr("width", width);

  // SCALES
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(data, d => d['Width (cm)']))
    .range([margin.left, width - margin.right]);

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, d => d['Length (cm)']))
    .range([height - margin.bottom, margin.top]);

  const radius = d3
    .scaleLinear()
    .domain(d3.extent(data, d => d['Artist Lifespan']))
    .range([5, 30]);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  // BINDING DOM ELEMENTS TO DATA
  svg
    .selectAll("circle.artifact")
    .data(data)
    .join("circle")
    .attr("class", "artifact")
    .attr("r", d => radius(d['Artist Lifespan']))
    .attr("fill", "blue")
    .attr("transform", d => `translate(${xScale(d['Width (cm)'])},${yScale(d['Length (cm)'])})`);

   //LABELING THE CIRCLES (PLOT ELEMENTS) 
  svg
    .selectAll("text.label")
    .data(data)
    .join("text")
    .attr("class", "label")
    .attr("x", d => xScale(d['Width (cm)']) + 5)
    .attr("y", d => yScale(d['Length (cm)']) - 5)
    .text("ls")
    .attr("font-size", "10px");

    //THE X AXIS
  svg
    .append("g")
    .call(selection => selection.call(xAxis))
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    
//THE Y AXIS
  svg
    .append("g")
    .call(selection => selection.call(yAxis))
    .attr("transform", `translate(${margin.left}, 0)`)

    //X-Axis Title
    svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height+40-margin.bottom)
    .attr("text-anchor", "middle")
    .attr("font-size", "15px")
    .text("Width of Artifact (cm)");

    //Y-Axis Title
    svg
    .append("text")
    .attr("x", -height / 2)
    .attr("y", margin.left / 4)
    .attr("transform", "rotate(-90)")
    .style("text-anchor", "middle")
    .text("Length of Artifact (cm)");



  // Main title
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", margin.top - 18)
    .attr("text-anchor", "middle")
    .attr("font-size", "30px")
    .text("Relationship between Length and Width of MoMA Artifacts");
});
