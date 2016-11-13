
// Build Map
// attribute is which of the aggregate attributes to graph
// (This should match one of the variable names in the state data)
// state_data is the aggregated data for each state
var buildMap = function(attribute, state_data) {

    // margins
    var margin = {top: 20, right: 80, bottom: 290, left: 100},
        width = 865 - margin.left - margin.right,
        height = 670 - margin.top - margin.bottom;

    // create responsive svg
    var svg = d3.select("#canvas1")
        .append("div")
            .classed("svg-container-line-svg", true) //container class to make it responsive
            .append("svg")
            //responsive SVG needs these 2 attributes and no width and height attr
                .attr("preserveAspectRatio", "xMinYMin meet")
                .attr("viewBox", "0 0 800 700")
            //class to make it responsive
                .classed("svg-content-responsive", true)
            .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add map code here
    // If data join is .data(state_data), then
    // State abbreviations -> d.state_id
    // State properties -> d[attribute]
    // The console line here provides an example:
    for (var i=0; i<state_data.length; i++) {
        var d = state_data[i];
        console.log(d.state_id +" has an average "+ attribute +" of "+ d[attribute]);
    }
};
