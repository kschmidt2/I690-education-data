// Build line chart of state funding over time for a given state
// Uses global state_data array
function buildLineChart(selectState) {

    //Defines the size of the various attributes in the visualization canvas
    // var height = 500;
    // var width = 500;
    // var margin = 40;
    // var margin_left = 40;

    // margins
    var margin = {top: 10, right: 80, bottom: 55, left: 50},
        width = 400 - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom;


    //Creates a responsive svg
    var svg = d3v4.select("#vis_container")
      .classed("svg-container-line", true) //container class to make it responsive
      .append("svg")
      //responsive SVG needs these 2 attributes and no width and height attr
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 400 350")
      //class to make it responsive
      .classed("svg-content-responsive", true)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Define the axis scales and formats
    var x = d3v4.scaleLinear()
        .domain([2000, 2016])
        .range([0, width]);

    var xAxis = d3v4.axisBottom(x)
        .tickFormat(d3v4.format(".0f"));
        //this formats the ticks on the axis and removes the , from the thousands

    var y = d3v4.scaleLinear()
        .domain([20000 , 0])
        .range([0, height]);

    // Add an x axis to graph
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0,"+height+")")
        .call(xAxis);

    svg.append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", height-5)
        .style("text-anchor", "end")
        .text("Year");

    // Add a y axis to graph
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0,0)")
        .call(d3v4.axisLeft(y)
            .ticks(5)
            .tickFormat(function(d) { return "$" + d.toLocaleString(); }));

    svg.append("text")
        .attr("transform", "rotate(90)")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Funding per student");


    //Draws the line chart
    var lineFunc = d3v4.line()
        .x(function (d) { return x(d.year); })
        .y(function (d) { return y((d.state_funding / d.ft_students)*d.inflation); });

    svg.append("svg:path")
            .attr("d", lineFunc(state_data[selectState]))
            .attr("stroke", "#47b4f2")
            .attr("stroke-width",3)
            .attr("fill", "none");

}


/*Helper functions*/
