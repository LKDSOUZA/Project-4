
const url_CP = "http://127.0.0.1:5000/api/v1.0/Parking"
const Url_Bus = "http://127.0.0.1:5000/api/v1.0/Business"


  d3.json(url_CP).then((data)=> { 
    
  
  
    var Carpark_Total = d3.nest()
      .key(function(d) { return d.parking_type; })
      .rollup(function(v) { return d3.sum(v, function(d) { return d.parking_spaces; }); })
      .object(data);
    console.log(JSON.stringify(Carpark_Total));

    var xValues = ["Residential","Private", "Commercial"];
    var yValues = [831293,1434332,1292518];
    var barColors = [
          "#b91d47",
          "#00aba9",
          "#2b5797"
        ]     ;

    new Chart("myChart", {
    type: "doughnut",
    data: {
      labels: xValues,
      datasets: [{
      backgroundColor: barColors,
      data: yValues
    }]
  },
  options: {
    title: {
      display: true,
      text: "Number of Parking Spaces By Parking Types"
    }
  }
}); 
})

//#################################################################################################//
                                          //Bar Graphs//

d3.json(url_CP).then((data)=> {
  
  let xvalues = data.map(d=>d.clue_small_area);
  let yvalues = data.map(d=>d.parking_spaces)
  var data = [
    {
      x: xvalues,
      y: yvalues,
      type: 'bar',
      
    }
  ];
  var layout = {
    title: 'Number of Parking Spaces in Each Area'
  }
  
  Plotly.newPlot('myDiv', data,layout);
})



d3.json(url_CP).then((data)=> {
  //console.log(data);
  let xvalues= data.map(d=>d.census_year);
  let yvalues = data.map(d=>d.parking_spaces);
  var data = [
    {
      x: xvalues,
      y: yvalues,
      type: 'bar',
      
    }
  ];
  var layout = {
    title: 'Growth By Census Year'
  }
  
  Plotly.newPlot('myDiv2', data,layout);
})
d3.json(url_CP).then((data)=> { 
    var Carpark_Total = d3.nest()
    .key(function(d) { return d.clue_small_area; })
    .rollup(function(v) { return d3.sum(v, function(d) { return d.parking_spaces; }); })
    .object(data);
  //console.log(JSON.stringify(Carpark_Total));
})
d3.json(url_CP).then((data)=> { 
  var Carpark_Total = d3.nest()
  .key(function(d) { return d.census_year; })
  .rollup(function(v) { return d3.sum(v, function(d) { return d.parking_spaces; }); })
  .object(data);
//console.log(JSON.stringify(Carpark_Total));
})

d3.json(Url_Bus).then((data)=> { 
  var Business_Total = d3.nest()
  .key(function(d) { return d.census_year; })
  .rollup(function(v) { return v.length; })
  .object(data);
  console.log(JSON.stringify(Business_Total));
  var xValues = [2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022];
  var yValues = [13556,13611,13777,14526,15120,16449,17500,18119,18311,18695,18791,19030,19403,19482,19461,19599,19730,19731,19751,19914]
  var data = [
    {
      x: xValues,
      y: yValues,
      type: 'bar',
      
    }
  ];
  var layout = {
    title: 'Growth By Census Year'
  }
  
  Plotly.newPlot('Bar2', data,layout);
})

function changeText(id) {
  id.innerHTML = "Residential:831293, Private:1434332, Commercial:1292518";
}
function changeText2(id) {
  id.innerHTML="Parkville:179610, West Melbourne(Industrial):89637, North Melbourne:158127, Docklands:387476, Kensington:254921, Melbourne (CBD):977251, West Melbourne (Residential):74787, Carlton:266638, East Melbourne:168760, Melbourne (Remainder):158633, Southbank:547506, Port Melbourne:238475, South Yarra:56322"}
function changeText3(id) {
  id.innerHTML="2002:136229, 2005:154385, 2010:177282,2011:180999, 2012:182793, 2015:193782, 2016:193792, 2021:207276"}

changeText();
changeText2();
changeText3();
