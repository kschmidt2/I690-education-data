/*This function creates the line chart that helps us to compare the amount of state funding per student in the selected state*/
function buildLineChart(selectState, state_data) {
    //Defines the size of the various attributes in the visualization canvas
    var height = 500;
    var width = 500;
    var margin = 40;
    var margin_left = 40;


    // create responsive svg
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

    // Create the SVG canvas that will be used to render the visualization.
    // var svg = d3v4.select("#vis_container")
    //     .append("svg")
    //     .attr("width", width)
    //     .attr("height", height);

    // Define the axis scales and formats
    var x = d3v4.scaleLinear()
        .domain([1998, 2016])
        .range([margin, width - margin]);

    var xAxis = d3v4.axisBottom(x)
        .tickFormat(d3v4.format(".0f"));
        //this formats the ticks on the axis and removes the , from the thousands

    var y = d3v4.scaleLinear()
        .domain([20000 , 2000])
        .range([margin, height - margin]);

    // Add x axis to graph
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



    // Add y axis to graph
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + margin_left + ",0)")
        .call(d3v4.axisLeft(y));

    //Make changes here to change the way Average funding is written on the chart
    svg.append("text")
        .attr("transform", "rotate(90)")
        .attr("class", "axis-label")
        .attr("y", - 45)
        .attr("x", 0 + (100))
        .style("text-anchor", "middle")
        .attr("id", "axis-text")
        .text("AVERAGE FUNDING");


    // Now a clipping plain for the main axes
    // Add the clip path.
    // Are we going to animate transitions? If not, we can probably remove this.
    svg.append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("x", margin)
        .attr("y", margin)
        .attr("width", width - 2 * margin)
        .attr("height", height - 2 * margin);


    // Add data
    //This was the only way I could reference the data!???
    var lineFunc = d3v4.line()
        .x(function (d) { return x(d.year); })
        .y(function (d) { populateDetails(d); return y(d.state_funding / d.ft_students); });

    svg.append("svg:path")
            .attr("d", lineFunc(state_data[selectState]))//this line is causing errors???
            .attr("stroke", "red")
            .attr("stroke-width",3)
            .attr("fill", "none");
    
}


//Populates the information that follows the line chart
//How do we get d???
function populateDetails(d){
    
    var stateDetails = "<h3>" + d.state + "</h3>";
      stateDetails += "</br><span class='category'>Average debt:</span> $" + d.funding_per_student.toLocaleString();
      stateDetails += "</br><span class='category'>Full Time Enrollment</span>: " + d.ft_students.toLocaleString();
      document.getElementById("schoolAndStateInfo").innerHTML = stateDetails;
      //$('#schoolAndStateInfo').html(stateDetails);

}

function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

