
//This is the external javascript file for the first visualization
//  graphing the percentage of affirmative applicants sent to immigration court
//  tooltip which draw from NYTimes API to inlcude news articles under the visualization with the correct time

let parseTime = d3.timeParse("%B %Y");

function getData(data) {
    let vars = ["Percent Approved", "Percent Referred", "Percent Filing Deadline Referral", "Percent No Show Denials"]
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
    // console.log(result)
    return result.reverse()
  }


// Our D3 code will go here.
d3.csv("https://gist.githubusercontent.com/meitalhoffman/18bd4263adc1eb4e908fe7e0cf231af1/raw/e7e3c28bbe1346030f37fb3feec770f38397129d/AffirmativeAsylumWorkloadOverTime.csv").then(function(rawData) {

let data = getData(rawData)

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

let sections = ["Percent Approved", "Percent Referred", "Percent Filing Deadline Referral", "Percent No Show Denials"]

// Transpose the data into layers
var dataset = d3.stack().keys(sections)(data)
console.log(dataset)

let xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(xAxisScale)
    .ticks(5)
    .tickFormat(d3.timeFormat('%B %Y')))
    .call(g => g.selectAll(".domain").remove())

let yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(null, "s"))
    .call(g => g.selectAll(".domain").remove())

// Set x, y and colors
var x = d3.scaleBand()
    .domain(data.map(d => d.Date))
    .range([margin.left, width - margin.right])
    .padding(0.1)

    //manually write
var xAxisScale = d3.scaleTime()
    .domain([parseTime("January 2015"), parseTime("January 2019")])
    // .domain([parseTime("January 2015"), parseTime("January 2016"), parseTime("January 2017"),
    //     parseTime("January 2018"), parseTime("January 2019")])
    .range([margin.left+3, width - margin.right-3])
    // .padding()

var y = d3.scaleLinear()
    .domain([0, d3.max(dataset, d => d3.max(d, d => d[1]))])
    .rangeRound([height - margin.bottom, margin.top])

// var colors = ["b33040", "#d25c4d", "#f2b447", "#d9d574", "#763f9e"];
var color = d3.scaleOrdinal()
    .domain(dataset.map(d => d.key))
    .range(d3.quantize(t => d3.interpolateSpectral(t*.8 + 0.3), dataset.length).reverse())
    .unknown("#ccc")

// Define and draw axes
svg.append("g")
  .attr("class", "y axis")
  .call(yAxis);

svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis);


// Create groups for each series, rects for each segment 
var groups = svg.selectAll("g.percent")
  .data(dataset)
  .enter().append("g")
  .attr("class", "percent")
  .style("fill", function(d, i) { return color(d.key); })

var rect = groups.selectAll("rect")
  .data(function(d) { return d; })
  .enter()
  .append("rect")
  .attr("x", (d, i) => x(d.data.Date))
  .attr("y", d => y(d[1]))
  .attr("height", d => y(d[0]) - y(d[1]))
  .attr("width", x.bandwidth())
    .on("mouseover", d => tooltip.style("visibility", "visible").text(format(d.data.Date)))
    .on("mousemove", d => tooltip.style("top", (d3.event.pageY)+"px").style("left",(d3.event.pageX)+"px").text(format(d.data.Date)))
    .on("mouseout", d => tooltip.style("visibility", "hidden"));

//format the date objects
var format = d3.timeFormat('%m - %Y')
// Draw legend
var legend = svg => {
    const g = svg
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
        .attr("transform", `translate(${width + margin.right},${margin.top})`)
      .selectAll("g")
      .data(dataset.slice().reverse())
      .join("g")
        .attr("transform", (d, i) => `translate(0,${i * 20})`);
  
    g.append("rect")
        .attr("x", -19)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", d => color(d.key));
  
    g.append("text")
        .attr("x", -24)
        .attr("y", 9.5)
        .attr("dy", "0.35em")
        .text(d => d.key);
  }


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


svg.append("g")
    .call(legend);
})