/* CONSTANTS AND GLOBALS */
const margin = { top: 20, right: 30, bottom: 40, left: 90 };
const width = window.innerWidth * 0.8 - margin.left - margin.right;
const height = 800 - margin.top - margin.bottom;

d3.csv('../data/MoMA_TopTenNationalities.csv', d3.autoType)
  .then(data => {
    console.log("data", data);

    // Define X Scale
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data.map(d => d.Count))])
      .range([0, width]);

    // Define Y Scale
    const yScale = d3.scaleBand()
      .domain(data.map(d => d.Nationality))
      .range([0, height])
      .padding(0.3);

    const svg = d3.select('#container')
      .append('svg')
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)
      .style('background-color', 'rgba(200, 200, 255, .3)')

    const chart = svg.append('g')
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .attr('fill', 'green')

    const bars = chart.selectAll('rect.bar')
      .data(data)
      .join('rect')
      .attr('class', 'bar')
      .attr('height', yScale.bandwidth())
      .attr('width', d => xScale(d.Count))
      .attr('x', 0)
      .attr('y', d => yScale(d.Nationality))
      .attr('fill', '#b08968');

    // Add headings and labels
    chart.selectAll('text.bar-label')
      .data(data)
      .join('text')
      .attr('class', 'bar-label')
      .attr('x', d => xScale(d.Count) + 5)
      .attr('y', d => yScale(d.Nationality) + yScale.bandwidth() / 2)
      .attr('dy', '0.35em') // Adjust the vertical alignment
      .attr('fill', 'black') // Set text color to black
      .text(d => d.Count);

    // Creating axes
    const xaxisGroup = chart.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xScale))
      .attr('color', 'black')
      .attr('stroke-width', 1);

    const yaxisGroup = chart.append("g")
      .call(d3.axisLeft(yScale));

    // Add x-axis label
    svg.append("text")
      .attr("x", width / 2 + margin.left)
      .attr("y", height + margin.top + margin.bottom - 10)
      .attr("text-anchor", "middle")
      .text("Count");

    // Add y-axis label
    svg.append("text")
      .attr("transform", "rotate(270)")
      .attr("y", margin.left - 70)
      .attr("x", -height / 2 - margin.top)
      .attr("text-anchor", "middle")
      .text("Nationality");

    /* Add chart title*/
    svg.append("text")
      .attr("x", width / 2 + margin.left)
      .attr("y", margin.top+5 )
      .attr("text-anchor", "middle")
      .attr("font-size", "30px")
      .text("Top Ten Nations of MoMA Artifact Origins");
  });
