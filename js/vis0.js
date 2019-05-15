function getData1b(data) {
    let vars = ["Affirmative", "Defensive", "Total"]
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

  let parseTime = d3.timeParse("%B %Y");


d3.csv("https://gist.githubusercontent.com/meitalhoffman/bb8ba91a2affec714bc357854c3045fc/raw/0176c0d695c563b4731c96280987c158fe3c2b6e/vis0.csv").then(function(rawData) {
    
    let data1a = getData1b(rawData)

    // Setup svg using Bostock's margin convention
    
    var margin = {top: 20, right: 160, bottom: 35, left: 30};
    
    var width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
    
    var svg = d3.select("#overtime")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    
    let xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .attr("stroke", d3.rgb("#ffffff"))
        .attr("opacity", ".8")
        .call(d3.axisBottom(x)
                .ticks(8)
                .tickFormat(d3.timeFormat('%m/%Y')))
        .call(g => g.selectAll(".domain").remove())
    
    let yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .attr("stroke", d3.rgb("#ffffff"))
        .attr("opacity", ".8")
        .call(d3.axisLeft(y1).ticks(null, "s"))
        .call(g => g.selectAll(".domain").remove())
    
    // Set x, y and colors
    var x = d3.scaleTime()
    .domain(d3.extent(data1a, d=> d.Date))
    .range([margin.left, width-margin.right])
    
    var y1 = d3.scaleLinear()
    .domain([0, d3.extent(data1a, d => d["Total"])[1]])
    .range([height-margin.bottom, margin.top])
    
    // var colors = ["b33040", "#d25c4d", "#f2b447", "#d9d574", "#763f9e"];
    function make_x_gridlines() {		
        return d3.axisBottom(x)
            .ticks(9)
    }
    
    // gridlines in y axis function
    function make_y_gridlines() {		
        return d3.axisLeft(y1)
            .ticks(8)
    }
    svg.append("g")			
    .attr("class", "grid")
    .attr("transform", "translate(0," + (height - margin.bottom) + ")")
    .attr("color", "#eae8e8")
    .style("opacity", ".25")
    .call(make_x_gridlines()
        .tickSize(-height + margin.bottom)
        .tickFormat(d3.timeFormat("%m"))
    )

// add the Y gridlines
svg.append("g")			
    .attr("class", "grid")
    .attr("color", "#eae8e8")
    .style("opacity", ".25")
    .attr("transform", "translate(" + margin.left + ",0)")
    .call(make_y_gridlines()
        .tickSize(-width + margin.right)
        .tickFormat("")
    )
    // Define and draw axes
    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);
    
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
    
    svg.append("path")
      .attr("d",d3.line().x(d => x(d.Date)).y(d => y1(d["Affirmative"]))(data1a))
      .attr("stroke", d3.rgb("#a7d1e9"))
      .attr("stroke-width","4")
      .attr("fill","none")

    svg.append("path")
      .attr("d",d3.line().x(d => x(d.Date)).y(d => y1(d["Defensive"]))(data1a))
      .attr("stroke", d3.rgb("#f6c0a6"))
      .attr("stroke-width","4")
      .attr("fill","none")
      
    svg.append("path")
      .attr("d",d3.line().x(d => x(d.Date)).y(d => y1(d["Total"]))(data1a))
      .attr("stroke", d3.rgb("#878787"))
      .attr("stroke-width","4")
      .attr("fill","none")

    //manual creation of the legend
    svg.append("text")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
        .attr("x", 0+margin.left)             
        .attr("y", 5 - (margin.top / 2))
        .attr("stroke", d3.rgb("#ffffff"))
        .attr("text-anchor", "left")  
        .style("font-size", "16px") 
        .text("Asylum Applications in the United States");

    let legendVals1 = ["Affirmative", "Defensive", "Total"]

    svg.append("rect")
    .attr("x", width - margin.right/2)             
    .attr("y", 5 - (margin.top / 2))
    .attr("width", 18)
    .attr("height", 18)
    .attr("fill", d3.rgb("#a7d1e9"));
    
    svg.append("text")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("x", width - margin.right/2 + 25)             
    .attr("y", (margin.top / 2) - 1)
    .attr("stroke", d3.rgb("#ffffff"))
    .style("opacity", ".7")
    .attr("text-anchor", "left")  
    .style("font-size", "13px") 
    .text("Affirmative");// .text("Affirmative");

    svg.append("rect")
    .attr("x", width- margin.right/2)             
    .attr("y", 30 - (margin.top / 2))
    .attr("width", 18)
    .attr("height", 18)
    .attr("fill", d3.rgb("#f6c0a6"));
    
    svg.append("text")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("x", width- margin.right/2 + 25)             
    .attr("y", (margin.top / 2) + 25)
    .attr("stroke", d3.rgb("#ffffff"))
    .style("opacity", ".7")
    .attr("text-anchor", "left")  
    .style("font-size", "13px") 
    .text("Defensive");// .text("Affirmative");

    svg.append("rect")
    .attr("x", width- margin.right/2)             
    .attr("y", 55 - (margin.top / 2))
    .attr("width", 18)
    .attr("height", 18)
    .attr("fill", d3.rgb("#878787"));
    
    svg.append("text")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("x", width - margin.right/2 + 25)             
    .attr("y", (margin.top / 2) + 48)
    .attr("stroke", d3.rgb("#ffffff"))
    .style("opacity", ".7")
    .attr("text-anchor", "left")  
    .style("font-size", "13px") 
    .text("Total");// .text("Affirmative");

      // text label for the x axis
  svg.append("text")   
  .attr("font-family", "sans-serif")
  .attr("font-size", 10)          
  .attr("transform",
        "translate(" + ((width/2) - 30) + " ," + 
                       (height + margin.top - 10) + ")")
    .attr("stroke", d3.rgb("#ffffff"))
    .style("opacity", ".5")
    .style("font-size", "13px") 
    .style("text-anchor", "middle")
    .text("Date");

// text label for the y axis
  svg.append("text")
  .attr("font-family", "sans-serif")
  .attr("font-size", 10)
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x",0 - (height / 2))
  // .attr("dy", "1em")
  .attr("stroke", d3.rgb("#ffffff"))
  .style("opacity", ".5")
  .style("font-size", "13px") 
  .style("text-anchor", "middle")
  .text("Number of Applications");      
    
})