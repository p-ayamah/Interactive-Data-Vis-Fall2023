/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.9,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 50, left: 60, right: 40 };

// LEGEND VALUES
const legendValues = [100, 1000, 2000, 3000, 5000]; 

Promise.all([
  d3.json("../data/world.json"),
  d3.csv("../data/MoMA_nationalities.csv", d3.autoType),
]).then(([geojson, nationalities]) => {
  // GETTING COUNTRIES OUT OF CSV FILE
  const countriesFromCSV = new Set(nationalities.map(d => d.Country));

  // Get the maximum value from the "Count" column
  const maxCount = d3.max(nationalities, d => d.Count);

  // CIRCLE SIZE BASED ON COUNT
  const circleSizeScale = d3
    .scaleLinear()
    .domain([0, maxCount])
    .range([5, 30]); // Adjust the range for the desired circle size range

  const svg = d3
    .select("#container")
    .append("svg")
    .attr("height", height)
    .attr("width", width)
    .style("background-color", "aliceblue");

  // Add a title to the graph
  svg
    .append("text")
    .attr("x", width / 1.8)
    .attr("y", height -margin.bottom)
    .attr("text-anchor", "middle")
    .attr("font-size", "35px")
    .text("Origins of MoMA Artifacts");

  // SPECIFY PROJECTION
  const projection = d3.geoNaturalEarth1().fitSize([width, height], geojson);

  // DEFINE PATH FUNCTION
  const pathGen = d3.geoPath().projection(projection);

  // APPEND GEOJSON PATH for all features
  const countries = svg
    .selectAll("path.countries")
    .data(geojson.features)
    .join("path")
    .attr("class", "countries")
    .attr("d", d => pathGen(d))
    .attr("stroke", "black")
    .attr("fill", d => {
      if (d.properties.name === "United States of America") {
        // Color the United States differently and reduce its size by 30%
        return "#005427";
      } else if (countriesFromCSV.has(d.properties.name)) {
        // Fill other shaded countries with green at alpha 0.6
        return "rgba(0, 128, 0, 0.6)";
      } else {
        return "transparent";
      }
    });

  // Append circles to shaded countries based on the "Count" column
  const circles = svg
    .selectAll("circle")
    .data(nationalities.filter(d => countriesFromCSV.has(d.Country)))
    .enter()
    .append("circle")
    .attr("cx", d => {
      const countryFeature = geojson.features.find(
        country => country.properties.name === d.Country
      );
      const centroid = pathGen.centroid(countryFeature);
      return centroid[0]; // X-coordinate based on centroid
    })
    .attr("cy", d => {
      const countryFeature = geojson.features.find(
        country => country.properties.name === d.Country
      );
      const centroid = pathGen.centroid(countryFeature);
      return centroid[1]; // Y-coordinate based on centroid
    })
    .attr("r", d => {
      if (d.Country === "United States of America") {
        // Reduce the size of the circle for the United States by 30%
        return circleSizeScale(d.Count);
      } else {
        return circleSizeScale(d.Count);
      }
    }) // Size of circle based on "Count" column
    .attr("fill", "green")
    .attr("fill-opacity", 0.6) // Alpha value for fill
    .attr("stroke", "black");

  // Create a legend
  const legend = svg
    .selectAll(".legend")
    .data(legendValues)
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", (d, i) => `translate(${width - 100}, ${margin.top + i * 50})`);

  // Add legend circles
  legend
    .append("circle")
    .attr("cx", 10)
    .attr("cy", 10)
    .attr("r", d => circleSizeScale(d))
    .attr("fill", "green")
    .attr("fill-opacity", 0.6)
    .attr("stroke", "black");

  // Add legend labels
  legend
    .append("text")
    .attr("x", 40)
    .attr("y", 10)
    .attr("dy", "0.35em")
    .attr("font-size", "12px")
    .text(d => d);


});
