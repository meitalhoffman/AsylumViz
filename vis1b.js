function getData1b(data) {
    let vars = ["Pending End of Month"]
    let result = []
    for(let i = 0; i < data.length; i++){
      var row = {
        Date: parseTime(data[i].Month + " " + data[i].Year),
      }
      for(let v in vars){
        row[vars[v]] =  +(data[i][vars[v]])
    }
      result.push(row)
    }
    return result.reverse()
  }

d3.csv("https://gist.githubusercontent.com/meitalhoffman/d0933447ecdb70aef0df8361d4c8ad7f/raw/a909b05b11b0b4e0812c857f9d2577570a4c2440/pendingAsylumCases.csv").then(function(rawData) {
    
    let data1a = getData1b(rawData)

    // Setup svg using Bostock's margin convention
    
    var margin = {top: 20, right: 160, bottom: 35, left: 30};
    
    var width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
    
    var svg = d3.select("body")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    
    let xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x)
                .ticks(7)
                .tickFormat(d3.timeFormat('%m/%Y')))
        .call(g => g.selectAll(".domain").remove())
    
    let yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(null, "s"))
        .call(g => g.selectAll(".domain").remove())
    
    // Set x, y and colors
    var x = d3.scaleTime()
    .domain(d3.extent(data1a, d=> d.Date))
    .range([margin.left, width-margin.right])
    
    var y = d3.scaleLinear()
    .domain([0, d3.extent(data1a, d => d["Pending End of Month"])[1]])
    .range([height-margin.bottom, margin.top])
    
    // var colors = ["b33040", "#d25c4d", "#f2b447", "#d9d574", "#763f9e"];
    
    // Define and draw axes
    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);
    
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
    
    
    var line = d3.line()
      .x(function(d) { return x(d.Date); }) // set the x values for the line generator
      .y(function(d) { return y(d["Pending End of Month"]); }) // set the y values for the line generator 
      .curve(d3.curveMonotoneX) // apply smoothing to the line

    svg.append("path")
      .attr("d",d3.line().x(d => x(d.Date)).y(d => y(d["Pending End of Month"]))(data1a))
      .attr("stroke", "green")
      .attr("stroke-width","4")
      .attr("fill","none")
    
    //format the date objects
    var format = d3.timeFormat('%m - %Y')
    
    
    
    // Prep the tooltip bits, initial display is hidden
    var tooltip = d3.select("body")
      .append("g")
      .attr("class", "tooltip")
      .style("visibility", "visible");
        
    tooltip.append("rect")
      .attr("width", 30)
      .attr("height", 20)
      .attr("fill", "white");
    
    tooltip.append("text")
      .attr("x", 15)
      .attr("dy", "1.2em")
      .style("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .attr("text", "This is working");
    
  
})