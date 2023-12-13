/* CONSTANTS AND GLOBALS */
const margin = { top: 30, right: 30, bottom: 40, left: 100 };
const width = window.innerWidth * 0.8 - margin.left - margin.right;
const height = 800 - margin.top - margin.bottom;
const radius = Math.min(width, height) / 2;

// Select the container element
const svg = d3.select('#pie_container')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', `translate(${width / 2}, ${height / 2})`); // Center the pie chart

d3.csv('moma_pie.csv', d3.autoType)
  .then(data => {
    const pie = d3.pie()
      .sort(null)
      .value(d => d.male + d.female + d.nonbinary + d.unknown);

    const path = d3.arc()
      .outerRadius(radius - 10)
      .innerRadius(0);

    const arc = svg.selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    arc.append('path')
      .attr('d', path)
      .attr('fill', (d, i) => {
        const colors = ['#00b4d8', '#FA0089', 'green', '#bc6c25'];
        return colors[i];
      });

    // Tooltip
    const tooltip = d3.select('#pie_container')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    arc.on('mouseover', function (event, d) {
      tooltip.transition().duration(200).style('opacity', 0.9);
      const gender = ['Male', 'Female', 'Nonbinary', 'Unknown'];
      tooltip.html(`Gender: ${gender[d.index]}<br>Value: ${d.data[gender[d.index]]}`)
        .style('left', event.pageX + 'px')
        .style('top', (event.pageY - 28) + 'px');
    }).on('mouseout', function () {
      tooltip.transition().duration(500).style('opacity', 0);
    });

    // Legend
    const legend = svg.selectAll('.legend')
      .data(gender)
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', (d, i) => `translate(0, ${i * 20})`);

    legend.append('rect')
      .attr('width', 18)
      .attr('height', 18)
      .attr('fill', (d, i) => colors[i]);

    legend.append('text')
      .attr('x', 25)
      .attr('y', 9)
      .attr('dy', '.35em')
      .style('text-anchor', 'start')
      .text(d => d);
  });
