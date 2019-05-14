
//This is the external javascript file for the first visualization
//  graphing the percentage of affirmative applicants sent to immigration court
//  tooltip which draw from NYTimes API to inlcude news articles under the visualization with the correct time


function getData1a(data) {
    let vars = ["Percent Conducted", "Percent No Show", "Percent Cancelled by Applicant", "Percent Cancelled by USCIS"]
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

var keyDates = {
  "Obama shifts priority to detaining migrants at the border": "February 2015",
  "ICE officials round up families who were denied asylum": "December 2015",
  "Supreme Court does not uphold Obama's defered action plan, DAPA": "June 2016",
  "Trump Elected": "November 2016",
  "Trump signs Executive Order 13767, making asylum harder to claim": "January 2017",
  "Trump signs the Muslim travel ban": "January 2017",
  "Zero Tolerance family seperation policy piloted in El Paso": "July 2017",
  "Trump announces the end of DACA": "September 2017",
  "Jeff Sessions increases immigration judge's yearly quota": "April 2018",
  "Trump introduces Family Seperation Policy": "April 2018",
  "Session rules that domestic abuse victims no longer qualify for asylum": "June 2018",
  "Trump ends Family Seperation Policy": "June 2018",
  "Trump begins 'Remain in Mexico' policy": "January 2019"
}

// Our D3 code will go here.
d3.csv("https://gist.githubusercontent.com/meitalhoffman/18bd4263adc1eb4e908fe7e0cf231af1/raw/dc748c3d36539892db54f39fab95aae2e89bfc3e/AffirmativeAsylumWorkloadOverTime.csv").then(function(rawData) {

let data1a = getData1a(rawData)

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

let sections1a = ["Percent Conducted", "Percent No Show", "Percent Cancelled by Applicant", "Percent Cancelled by USCIS"]

// Transpose the data into layers
var dataset1a = d3.stack().keys(sections1a)(data1a)
console.log(dataset1a)

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
    .domain(data1a.map(d => d.Date))
    .range([margin.left, width - margin.right])
    .padding(0.1)

var xAxisScale = d3.scaleTime()
    .domain([parseTime("January 2015"), parseTime("January 2019")])
    .range([margin.left+3, width - margin.right-3])


var y = d3.scaleLinear()
    .domain([0, d3.max(dataset1a, d => d3.max(d, d => d[1]))])
    .rangeRound([height - margin.bottom, margin.top])

// var colors = ["b33040", "#d25c4d", "#f2b447", "#d9d574", "#763f9e"];
var color = d3.scaleOrdinal()
    .domain(dataset1a.map(d => d.key))
    .range(d3.quantize(t => d3.interpolateSpectral(t*.8 + 0.3), dataset1a.length).reverse())
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
  .data(dataset1a)
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
    // .on("mouseover", d => tooltip.style("visibility", "visible").text(format(d.data.Date)))
    .on("mouseover", d => tooltip.style("visibility", "visible").text(getHoverText(d)))
    .on("mousemove", d => tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px").text(getHoverText(d)))
    .on("mouseout", d => tooltip.style("visibility", "hidden"))
    .on("click", d => {
      picture = str(formatPicture(d.data.Date))
      svgNYT.select("image")
        .attr("xlink:href", "images/" + picture + ".JPG")
    });

var formatHeadline = d3.timeFormat('%m-%Y')
var formatPicture = d3.timeFormat('%m%Y')
var picture = '012019';

function getHoverText(d){
  let text = format(d.data.Date) + ": " + str((d[1] - d[0]).toFixed(3)) + "%"
  headline = headlines[formatHeadline(d.data.Date)]
  picture = str(formatPicture(d.data.Date))
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
        .attr("transform", `translate(${width + margin.right},${margin.top})`)
      .selectAll("g")
      .data(dataset1a.slice().reverse())
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

var svgNYT = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svgNYT.append("svg:image")
    .attr('x', -9)
    .attr('y', -12)
    .attr('width', 500)
    .attr('height', 500)
    .attr("xlink:href", "images/" + picture + ".JPG")

})