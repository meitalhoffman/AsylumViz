//This is the external javascript file for the first visualization
//  graphing the percentage of affirmative applicants sent to immigration court
//  tooltip which draw from NYTimes API to inlcude news articles under the visualization with the correct time
// const fetch = require("node-fetch");
let d3 = require("d3");
if (typeof fetch !== 'function') {
    global.fetch = require('node-fetch');
}
let jsdom = require("jsdom");
const DOM = new jsdom.JSDOM(``, { pretendToBeVisual: true });
global.window = DOM.window;
global.document = DOM.window.document;
global.requestAnimationFrame = DOM.window.requestAnimationFrame.bind(
  DOM.window
);

const csv = require('d3-fetch').csv;

let width = 900
let height = 600
let margin = ({top: 20, right: 20, bottom: 20, left: 50})
let parseTime = d3.timeParse("%B %Y");

let data1 = d3.csv("https://gist.githubusercontent.com/meitalhoffman/52ec0e8478bc3398f25c15e7e1fcf8d9/raw/00c3d09c27890f6e83bd47bed63c6b17047b7e9c/MonthlyAffirmativeWorkload.csv")

function getData() {
    let index1 = "Referrals (Interviewed Cases)"
    let index2 = "Approvals"
    let result = []
    for(let i = 0; i < data1.length; i++){
      var row = {
        Date: parseTime(data1[i].Month + " " + data1[i].Year),
        Value: +(data1[i][index1].replace(',','')) / (+(data1[i][index1].replace(',',''))+ (+(data1[i][index2].replace(',',''))))
      }
      result.push(row)
    }
    return result
  }

let dataToUse = getData()

let x = d3.scaleTime()
      .domain(d3.extent(dataToUse, d=> d.Date))
      .range([margin.left, width-margin.right])

let y = d3.scaleLinear()
        .domain([0, d3.extent(dataToUse, d => d.Value)[1]])
        .range([height-margin.bottom, margin.top])

function vis() {
    var svg = d3.select(DOM.svg(width,height));
  
    svg.append("g")
    .call(d3.axisBottom(x))
    .attr("transform",`translate(0,${height-margin.bottom})`);
    
    svg.append("g")
    .call(d3.axisLeft(y))
    .attr("transform",`translate(${margin.left},0)`);
    
    svg.append("path")
    .attr("d",d3.line().x(d => x(d.Date)).y(d => y(d.Value))(dataToUse))
        .attr("stroke","red")
    .attr("stroke-width","4")
    .attr("fill","none")
    
    return svg.node();
}

vis()
