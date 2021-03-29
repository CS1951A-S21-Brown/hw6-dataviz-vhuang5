let svg = d3.select("#graph1")
    .append("svg")
    .attr("width", graph_1_width)   
    .attr("height", graph_1_height)     
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top + 20})`);

let countRef = svg.append("g");


d3.csv(filename).then(function(data) {

    //slice 10 for the top ten globally selling games
    data = data.slice(0,10)

    let x = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) {return parseInt(d["Global_Sales"])})])
        .range([0, graph_1_width - margin.left - margin.right]);

    let y = d3.scaleBand()
        .domain(data.map(function(a) { return a['Name'] }))
        .range([0, graph_1_height - margin.top - margin.bottom])
        .padding(0.1);  // Improves readability

    svg.append("g")
        .call(d3.axisLeft(y).tickSize(0).tickPadding(10));

    let bars = svg.selectAll("rect").data(data);

    // OPTIONAL: Define color scale
    let color = d3.scaleOrdinal()
        .domain(data.map(function(d) { return d['Name'] }))
        .range(d3.quantize(d3.interpolateHcl("#66a0e2", "#81c2c3"), 10));

    bars.enter()
        .append("rect")
        .merge(bars)
        .transition()
        .duration(1000)
        .attr("fill", function(d) { return color(d.Name) })
        .attr("x", x(0))
        .attr("y", function(d) { return y(d.Name) })               // Use function(d) { return ...; } to apply styles based on the data point (d)
        .attr("width", function(d) { return x(d.Global_Sales) })
        .attr("height", y.bandwidth());        // y.bandwidth() makes a reasonable display height

    let counts = countRef.selectAll("text").data(data);

    // Render the text elements on the DOM
    counts.enter()
        .append("text")
        .merge(counts)
        .transition()
        .duration(1000)
        .attr("x", function(d) { return x(parseInt(d.Global_Sales)) + 10; })       // Add a small offset to the right edge of the bar, found by x(d.count)
        .attr("y", function(d) { return y(d.Name) + 10; })      // Add a small offset to the top edge of the bar, found by y(d.artist)
        .style("text-anchor", "start")
        .text(function(a) { return parseInt(a.Global_Sales); });           // Get the count of the artist


    // Add x-axis label
    svg.append("text")
        .attr("transform", `translate(${(graph_1_width - margin.left - margin.right) / 2},
                                    ${(graph_1_height - margin.top - margin.bottom) + 20})`)    // Place this at the bottom middle edge of the graph - use translate(x, y) that we discussed earlier
        .style("text-anchor", "middle")
        .text("Total Global Sales (rounded to nearest million)");

    // Add y-axis label
    svg.append("text")
        .attr("transform", `translate(-200, ${(graph_1_height - margin.top - margin.bottom) / 2})`)  
        .style("text-anchor", "middle")
        .text("Game Title");

    //  Add chart title
    svg.append("text")
        .attr("transform", `translate(${(graph_1_width - margin.left - margin.right) / 2}, ${-15})`)       // Place this at the top middle edge of the graph - use translate(x, y) that we discussed earlier
        .style("text-anchor", "middle")
        .style("font-size", 17)
        .text("Graph 1 - Top 10 All Time Selling Video Game Titles*");
});
