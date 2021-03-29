let radius = Math.min(graph_2_width, graph_2_height) / 2 - 75

//make new svg
let svg2 = d3.select("#graph2")
    .append("svg")
        .attr("width", graph_2_width + 50)   
        .attr("height", graph_2_height)     
    .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top + 200})`);

//append legend
svg2.append("g")
    .attr("class", "legend")
 
//append tooltip, default hidden
let tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

//append title
let title = svg2.append("text")
    .attr("transform", `translate(${(graph_2_width - margin.left - margin.right - 250) / 2}, ${-125})`)       // HINT: Place this at the top middle edge of the graph - use translate(x, y) that we discussed earlier
    .style("text-anchor", "middle")
    .style("font-size", 17)

    //dynamically change graph 
function set_map(N, region){
    d3.select("#graph2").select("g").select("g").selectAll("text").remove()
    d3.select("#graph2").select("g").select("g").selectAll("rect").remove()
    d3.csv(filename).then(function(data) {
        data = get_top_regions(data.slice(0,N))
        data = data[region]
        for (var key in data){
            if (!data[key] > 0){
                delete data[key];
            }
        }
        console.log(data)
        total_sales = 0.0
        max = 0.0
        max_key = ""
        //used to calculate percentages and to find most popular genre to display in title
        for (var key in data){
            if (data[key] >= max){
                max = data[key]
                max_key = key
            }
            total_sales += data[key]
        }
        console.log(total_sales)

// set the color scale
    let color = d3.scaleOrdinal()
        .domain(data)
        .range(["#E5E1EE", "#dffdff", "#90bede", "#68edc6", "#90f3ff", "#272932", "#4d7ea8", "#828489", "#9e90a2", "#b6c2d9", "#bffff1"]);

        // Mouseover function
    let mouseover = function(d) {
        let html = `<br/>Genre: ${d.data.key}</span><br/>
                Percentage of total sales: ${Math.round(d.data.value/total_sales * 100)}%</span>`;

    // Set position of tool tip and change opacity to 0.9 (show tooltip on hover)
        tooltip.html(html)
            .style("left", `${(d3.event.pageX) + 30}px`)
            .style("top", `${(d3.event.pageY) - 80}px`)
            .style("box-shadow", `5px 5px 5px ${color(d.data.key)}`)
            .style("background-color", "#FFFFFF")
            .transition()
            .duration(200)
            .style("opacity", 0.9)
            .attr("transform", `translate(${margin.left}, ${margin.top + 200})`)
    };


        // initialize pie slice values
        let pie = d3.pie()
            .value(function(d) { return d.value; })
            .sort(function(x, y) { return d3.ascending(x.key, y.key);} )

        // map to data
        let build_pie = svg2.selectAll("path")
            .data(pie(d3.entries(data)))

        let arcc = d3.arc().innerRadius(0).outerRadius(radius)

        // build slices using the arcc variable
        build_pie.enter()
            .append('path')
            .on("mouseover", mouseover)
            .on("mouseout", function(d) {tooltip.transition().duration(300).style("opacity", 0);}) //set opacity to 0, effectively hiding tool tip
            .merge(build_pie)
            .transition()
            .duration(1000) //make transitions clean
            .attr('d', arcc)
            .attr('fill', function(d){ return(color(d.data.key)) })
            .attr("transform", function(d,i){
                return `translate(${(margin.left - 350)} , ${margin.top - 25})`; //Set pie graph location
              })
            .attr("stroke", "white")
            .style("stroke-width", "2px")
            .style("opacity", 1)

        build_pie.exit().remove()

        //make a legend
 
        let my_legend = svg2.select("g.legend");
        my_legend.exit().remove();
        //make color squares for legend
        let rectangles = my_legend.selectAll("rect")
            .data(pie(d3.entries(data)))
            .enter()
            .append("rect");
        
        rectangles.exit().remove()

        rectangles
            .merge(rectangles)
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", function(d){ return(color(d.data.key)) }) //match rectangle colors to slice color
            .attr("transform", function(d,i){
                return `translate(${(graph_2_width - 500)} , ${(i * 15 - 65)})`; // position the color squares
            });
            
        //put corresponding text next to color squares
        let text_elem = my_legend.selectAll("text") 
            .data(pie(d3.entries(data)))
            .enter()
            .append("text");

        text_elem.exit().remove()

        text_elem
            .merge(text_elem)
            .text(function(d){ return d.data.key; }) //actual text (each genre)
            .attr("y", 10)
            .attr("x", 14)
            .style("font-size", 12)
            .attr("transform", function(d,i){
                return `translate(${(graph_2_width - 500)} , ${(i * 15 - 65)})`; // position text
              });



//dynamically set title
    title.text("Graph 2 - Top* Genre In " + region + ": " + max_key);

    });
}

//clean data, return hashmap of countries as keys and values as a hashmap of genre, total sale KV pairs
function get_top_regions(data){
    var genre_NA = {Action: 0.0, Adventure: 0.0, Fighting: 0.0, Misc: 0.0, Platform: 0.0, Puzzle: 0.0, Racing: 0.0, Role_playing: 0.0, Shooter: 0.0, Simulation: 0.0, Sports: 0.0}   
    var genre_EU = {Action: 0.0, Adventure: 0.0, Fighting: 0.0, Misc: 0.0, Platform: 0.0, Puzzle: 0.0, Racing: 0.0, Role_playing: 0.0, Shooter: 0.0, Simulation: 0.0, Sports: 0.0}   
    var genre_JP = {Action: 0.0, Adventure: 0.0, Fighting: 0.0, Misc: 0.0, Platform: 0.0, Puzzle: 0.0, Racing: 0.0, Role_playing: 0.0, Shooter: 0.0, Simulation: 0.0, Sports: 0.0}   
    var genre_Other = {Action: 0.0, Adventure: 0.0, Fighting: 0.0, Misc: 0.0, Platform: 0.0, Puzzle: 0.0, Racing: 0.0, Role_playing: 0.0, Shooter: 0.0, Simulation: 0.0, Sports: 0.0}   
    var genre_Global = {Action: 0.0, Adventure: 0.0, Fighting: 0.0, Misc: 0.0, Platform: 0.0, Puzzle: 0.0, Racing: 0.0, Role_playing: 0.0, Shooter: 0.0, Simulation: 0.0, Sports: 0.0}   
    let hash_countries = {NA: genre_NA, EU: genre_EU, JP: genre_JP, Other: genre_Other, Global: genre_Global}; 
    // console.log(hash_countries)
    data.forEach(function(a) {  
        // console.log(a)
        let n = a.Genre
        if(!(a.Genre in genre_NA)){
            n = "Role_playing"
        }
        hash_countries.NA[n] += parseFloat(a.NA_Sales)
        hash_countries.EU[n] += parseFloat(a.EU_Sales)
        hash_countries.JP[n] += parseFloat(a.JP_Sales)
        hash_countries.Other[n] += parseFloat(a.Other_Sales)
        hash_countries.Global[n] += parseFloat(a.Global_Sales)
    });
    return hash_countries;
}

//on page render set map with top 50 games
set_map(50, "NA")