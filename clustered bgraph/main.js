/* CONSTANTS AND GLOBALS */
const margin = { top: 30, right: 30, bottom: 40, left: 100 };
const width = window.innerWidth * 0.8 - margin.left - margin.right;
const height = 800 - margin.top - margin.bottom;

// Select the container element
const svg = d3.select('#container')
  .append('svg')
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);

// Group for the actual chart
const chart = svg.append('g')
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv('moma_gender.csv', d3.autoType)
  .then(data => {
    // Extracting unique dates for x-axis
    const dates = data.map(d => d.date);

    // Define X scale
    const xScale = d3.scaleBand()
      .domain(dates)
      .range([0, width])
      .padding(0.1);

    // Define Y scale
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.male + d.female + d.nonbinary + d.unknown)])
      .nice()
      .range([height, 0]);

    // Adding bars for male, female, and nonbinary
    const barWidth = xScale.bandwidth() / 3;

    const maleBars = chart.selectAll('.male')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar male')
      .attr('x', d => xScale(d.date))
      .attr('y', height) // Start from the bottom
      .attr('width', barWidth)
      .attr('height', 0)
      .attr('fill', '#00b4d8')
      .transition()
      .duration(1000)
      .attr('y', d => yScale(d.male))
      .attr('height', d => height - yScale(d.male));

    const femaleBars = chart.selectAll('.female')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar female')
      .attr('x', d => xScale(d.date) + barWidth)
      .attr('y', height) // Start from the bottom
      .attr('width', barWidth)
      .attr('height', 0)
      .attr('fill', '#FA0089')
      .transition()
      .duration(1000)
      .attr('y', d => yScale(d.female))
      .attr('height', d => height - yScale(d.female));

    const nonbinaryBars = chart.selectAll('.nonbinary')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar nonbinary')
      .attr('x', d => xScale(d.date) + barWidth * 2)
      .attr('y', height) // Start from the bottom
      .attr('width', barWidth)
      .attr('height', 0)
      .attr('fill', 'green')
      .transition()
      .duration(1000)
      .attr('y', d => yScale(d.nonbinary))
      .attr('height', d => height - yScale(d.nonbinary));

      const unknownBars = chart.selectAll('.unknown')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar unknown')
      .attr('x', d => xScale(d.date) + barWidth * 2)
      .attr('y', height) // Start from the bottom
      .attr('width', barWidth)
      .attr('height', 0)
      .attr('fill', '#bc6c25')
      .transition()
      .duration(1000)
      .attr('y', d => yScale(d.unknown))
      .attr('height', d => height - yScale(d.unknown));


    // Add X-axis
    chart.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    // Add Y-axis
    chart.append("g")
      .call(d3.axisLeft(yScale).ticks(10));

    // Chart title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", margin.top)
      .attr("text-anchor", "middle")
      .text("MoMA Artifacts Acquired over Time by Gender of Artist")
      .attr("font-size", 30);

    // X-axis label
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.top + margin.bottom)
      .attr("text-anchor", "middle")
      .text("Date");

    // Y-axis label
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", margin.left - 70)
      .attr("x", -height / 2 - margin.top)
      .attr("text-anchor", "middle")
      .text("Count");

        
        // Legend
  const legend = chart.append("g")
    .attr("transform", `translate(${width - 100}, 10)`);

  legend.append("rect")
    .attr("width", 15)
    .attr("height", 15)
    .attr("y", 0)
    .attr("fill", "#00b4d8");

  legend.append("text")
    .attr("x", 20)
    .attr("y", 10)
    .text("Male");

  legend.append("rect")
    .attr("y", 20)
    .attr("width", 15)
    .attr("height", 15)
    .attr("fill", "#FA0089");

  legend.append("text")
    .attr("x", 20)
    .attr("y", 30)
    .text("Female");

  legend.append("rect")
    .attr("y", 40)
    .attr("width", 15)
    .attr("height", 15)
    .attr("fill", "gray");

  legend.append("text")
    .attr("x", 20)
    .attr("y", 50)
    .text("Nonbinary");

    legend.append("rect")
    .attr("y", 60)
    .attr("width", 15)
    .attr("height", 15)
    .attr("fill", "#bc6c25");

    legend.append("text")
    .attr("x", 20)
    .attr("y", 70)
    .text("unknown");  
    // Tooltip
    const tooltip = d3.select('#container')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    const bars = chart.selectAll('.bar');
    bars.on('mouseover', function (event, d) {
      const gender = d3.select(this).attr('class').split(' ')[1]; // Get the gender from class
      tooltip.transition().duration(200).style('opacity', 0.9);
      tooltip.html(`Gender: ${gender}<br>Value: ${d[gender]}`)
        .style('left', event.pageX + 'px')
        .style('top', (event.pageY - 28) + 'px');
    }).on('mouseout', function () {
      tooltip.transition().duration(500).style('opacity', 0);
    });
  });
