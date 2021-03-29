let radius3 = Math.min(graph_3_width, graph_3_height) / 2 - 75

//make new svg
let svg3 = d3.select("#graph3")
    .append("svg")
        .attr("width", graph_3_width + 50)   
        .attr("height", graph_3_height)     
    .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top + 200})`);

//append legend
let leg = svg3.append("g")
    .attr("class", "legend")
 
//append tooltip, default hidden
let tooltip_3 = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

//append title
let title_3 = svg3.append("text")
    .attr("transform", `translate(${(graph_3_width - margin.left - margin.right - 250) / 2}, ${-125})`)       // HINT: Place this at the top middle edge of the graph - use translate(x, y) that we discussed earlier
    .style("text-anchor", "middle")
    .style("font-size", 17)

    //dynamically change graph 
function set_graph3(N, genre){
    d3.csv(filename).then(function(data) {
        // let old_genre = genre
        data = get_top_publisher(data.slice(0,N), genre)
        max = 0.0
        max_key = ""
        // keys = []
        for (var key in data){ //used to find most popular publisher to display in title
            if (data[key] >= max){
                max = data[key]
                max_key = key
            }
            // keys.push(key)
        }
        console.log(data)

// set the color scale
    let color = d3.scaleOrdinal()
        .domain(Object.keys(data))
        .range(["#E5E1EE", "#dffdff", "#90bede", "#68edc6", "#90f3ff", "#272932", "#4d7ea8", "#828489", "#9e90a2", "#b6c2d9", "#bffff1"]);

        // Mouseover function to display the tooltip on hover
    let mouseover = function(d) {
        let html = `<br/>Publisher: ${d.data.key}</span><br/>
            Number of sales $${Math.round(d.data.value)} million</span>`;

    // Show the tooltip and set the position relative to the event X and Y location
        tooltip_3.html(html)
            .style("left", `${(d3.event.pageX) + 30}px`)
            .style("top", `${(d3.event.pageY) - 80}px`)
            .style("box-shadow", `5px 5px 5px ${color(d.data.key)}`)
            .style("background-color", "#FFFFFF")
            .transition()
            .duration(200)
            .style("opacity", 0.9)
            .attr("transform", `translate(${margin.left}, ${margin.top + 200})`)
    };

// A function that create / update the plot for a given variable:

        // Compute the position of each group on the pie:
        let pie = d3.pie()
            .value(function(d) { return d.value; })

        // map to data
        let build_pie = svg3.selectAll("path")
            .data(pie(d3.entries(data)))

        let arcc = d3.arc().innerRadius(0).outerRadius(radius3)

                // build slices using the arcc variable
        build_pie.enter()
            .append('path')
            .on("mouseover", mouseover)
            .on("mouseout", function(d) {tooltip_3.transition().duration(300).style("opacity", 0);})
            .merge(build_pie)
            .transition()
            .duration(1000)//make transitions clean
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
 
        let my_legend = svg3.select("g.legend");

        my_legend.exit().remove()

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
              .attr("fill", function(d){ return(color(d.data.key)) })
              .attr("transform", function(d,i){
                return `translate(${(graph_3_width - 500)} , ${(i * 15 - 75)})`; // place each legend on the right and bump each one down 15 pixels
              });
              
        //match text and color squares
        let text_elem = my_legend.selectAll("text") 
            .data(pie(d3.entries(data)))
            .enter()
            .append("text");

        text_elem.exit().remove()

        text_elem
            .merge(text_elem)
            .text(function(d){ return d.data.key; })
            .attr("y", 10)
            .attr("x", 14)
            .style("font-size", 12)
            .attr("transform", function(d,i){
                return `translate(${(graph_3_width - 500)} , ${(i * 15 - 75)})`; // place each legend on the right and bump each one down 15 pixels
              });

        // my_legend.selectAll("rect").exit().remove();

        // d3.select("#graph3").selectAll("g").selectAll("rect").exit().remove();
        // d3.select("#graph3").selectAll("g").selectAll("text").exit().remove();
    //dynamically update title
    title_3.text("Graph 3 - Top* Publisher For " + genre + " Games: " + max_key);

    });
}


//clean data to get hashmap of publishers for user inputted genre
function get_top_publisher(data, genre){
    let genree = {}
    data.forEach(function(a) {  
        if(a.Genre ==  genre){
            if(a.Publisher in genree){
                genree[a.Publisher] += parseFloat(a.Global_Sales);
            }
            else{
                genree[a.Publisher] =  parseFloat(a.Global_Sales)
            }
        }
    });
    return genree
}

//on page render set map with top 50 games
set_graph3(100, "Action")