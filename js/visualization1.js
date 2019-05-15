
//This is the external javascript file for the first visualization
//  graphing the percentage of affirmative applicants sent to immigration court
//  tooltip which draw from NYTimes API to inlcude news articles under the visualization with the correct time

// let parseTime = d3.timeParse("%B %Y");

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

var svg = d3.select("#affirmative")
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
    .attr("stroke", d3.rgb("#ffffff"))
    .attr("opacity", ".7")
    .call(d3.axisBottom(xAxisScale)
    .ticks(5)
    .tickFormat(d3.timeFormat('%B %Y')))
    .call(g => g.selectAll(".domain").remove())

let yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .attr("stroke", d3.rgb("#ffffff"))
    .attr("opacity", ".7")
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
    .range([margin.left+3, width - margin.right-3])

var y = d3.scaleLinear()
    .domain([0, d3.max(dataset, d => d3.max(d, d => d[1]))])
    .rangeRound([height - margin.bottom, margin.top])

var colors = ["#c5dfec", "#3d89bb", "#1b5a9d", "#0a396d"].reverse();
function color(key) {
  let i = sections.indexOf(key)
  return colors[i]
}

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
  .on("mouseover", d => tooltip.style("visibility", "visible").text(getHoverText(d)))
  .on("mousemove", d => tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px").text(getHoverText(d)))
  .on("mouseout", d => tooltip.style("visibility", "hidden"));

var formatHeadline = d3.timeFormat('%m-%Y')
var formatPicture = d3.timeFormat('%m%Y')
var picture = '012019';

function getHoverText(d){
let text = format(d.data.Date) + ": " + String((d[1] - d[0]).toFixed(3)) + "%"
headline = headlines[formatHeadline(d.data.Date)]
picture = String(formatPicture(d.data.Date))
return text
}

//format the date objects
var format = d3.timeFormat('%B %Y')
// Draw legend
var legend = svg => {
    const g = svg
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
        .attr("transform", `translate(${width + 40},${margin.top})`)
      .selectAll("g")
      .data(dataset.slice().reverse())
      .join("g")
      .attr("transform", (d, i) => `translate(0,${i * 30})`);
  
    g.append("rect")
        .attr("x", -19)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", d => color(d.key));
  
    g.append("text")
        .attr("x", -24)
        .attr("y", 9.5)
        .attr("fill", "#ffffff")
        .attr("dy", "0.35em")
        .text(d => getLegendText(d.key));
  }

  function getLegendText(key){
    if(key == "Percent No Show Denials") return "No Show Denial"
    else if(key == "Percent Filing Deadline Referral") return "Filing Deadline Referral"
    else if(key == "Percent Referred") return "Referred"
    else if(key == "Percent Approved") return "Approved"
}

svg.append("text")
.attr("font-family", "sans-serif")
.attr("font-size", 10)
    .attr("x", 0+margin.left)             
    .attr("y", 5 - (margin.top / 2))
    .attr("stroke", d3.rgb("#ffffff"))
    .attr("text-anchor", "left")  
    .style("font-size", "16px") 
    .text("Affirmative Asylum Outcomes");


  var tooltip = d3.select("body")
  .append("div")
  .style("position", "absolute")
  .style("z-index", "1")
  .style("visibility", "hidden")
  .style("background","white")
  .style("opacity","0.6")
  .style("padding","5px")
  .style("font-family", "'Open Sans', sans-serif")
  .style("font-size", "12px"); 

svg.append("g")
.call(legend);

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
.attr("dy", "1em")
.attr("stroke", d3.rgb("#ffffff"))
.style("opacity", ".5")
.style("font-size", "13px") 
.style("text-anchor", "middle")
.text("Percent of Applications");   

// var svgNYT = d3.select("#apic")
// .append("svg")
// .attr("width", width + margin.left + margin.right)
// .attr("height", height + margin.top + margin.bottom)
// .append("g")
// .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// svgNYT.append("text")
// .attr('x', 0)
// .attr('y', 0)
// .attr("font-family", "sans-serif")
// .attr("font-size", 15)
// .attr("text-anchor", "left")
// .attr("fill", "#ffffff")
// .attr("text", "DOES THIS THING WORK PLEASE LET ME KNOW")

// svgNYT.append("svg:image")
// .attr('x', 50)
// .attr('y', -12)
// .attr('width', 500)
// .attr('height', 500)
// .attr("xlink:href", "images/" + picture + ".JPG")

})