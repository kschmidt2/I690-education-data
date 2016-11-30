// Build line chart of state funding over time for a given state
// Uses global state_data array
function buildLineChart(selectState) {

    //Defines the size of the various attributes in the visualization canvas
    var height = 500;
    var width = 500;
    var margin = 40;
    var margin_left = 40;


    //Creates a responsive svg
    var svg = d3v4.select("#vis_container")
      .classed("svg-container-line " + selectState + "-svg", true) //container class to make it responsive
      .append("svg")
      //responsive SVG needs these 2 attributes and no width and height attr
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 800 750")
      //class to make it responsive
      .classed("svg-content-responsive", true)
      .attr("width", width)
      .attr("height", height);

    // Define the axis scales and formats
    var x = d3v4.scaleLinear()
        .domain([2000, 2016])
        .range([margin, width - margin]);

    var xAxis = d3v4.axisBottom(x)
        .tickFormat(d3v4.format(".0f"));
        //this formats the ticks on the axis and removes the , from the thousands

    var y = d3v4.scaleLinear()
        .domain([20000 , 2000])
        .range([margin, height - margin]);

    // Add an x axis to graph
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0,"+(500 - margin)+")")
        .call(xAxis);

    svg.append("text")
        .attr("class", "axis-label")
        .attr("y", 455)
        .attr("x", 0 + (440))
        .style("text-anchor", "middle")
        .attr("id", "axis-text")
        .text("YEAR");

    // Add a y axis to graph
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + margin_left + ",0)")
        .call(d3v4.axisLeft(y)
            .tickFormat(function(d) { return "$" + d.toLocaleString(); }));

    svg.append("text")
        .attr("transform", "rotate(90)")
        .attr("class", "axis-label")
        .attr("y", - 45)
        .attr("x", 0 + (100))
        .style("text-anchor", "middle")
        .attr("id", "axis-text")
        .text("AVERAGE FUNDING");


    //Draws the line chart
    var lineFunc = d3v4.line()
        .x(function (d) { return x(d.year); })
        .y(function (d) { populateDetails(d); return y(d.state_funding / d.ft_students); });

    svg.append("svg:path")
            .attr("d", lineFunc(state_data[selectState]))
            .attr("stroke", "red")
            .attr("stroke-width",3)
            .attr("fill", "none");

}


/*Helper functions*/

//Populates the information that follows the line chart
function populateDetails(d){

    var stateDetails = "<h3>" + d.state + "</h3>";
    stateDetails += "<span class='category'>Average debt:</span> $" + d.funding_per_student.toLocaleString();
    stateDetails += "</br><span class='category'>Full Time Enrollment</span>: " + d.ft_students.toLocaleString();
    document.getElementById("schoolAndStateInfo").innerHTML = stateDetails;

}

function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}
