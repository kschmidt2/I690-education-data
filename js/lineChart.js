 function buildLineChart(selectState, state_data){

        //Defines the size of the various attributes in the visualization canvas
        var height = 500;
        var width = 500;
        var margin = 40;
        var margin_left = 40;

        // Create the SVG canvas that will be used to render the visualization.
        var svg = d3.select("#vis_container")
            .append("svg")
            .attr("width", width)
            .attr("height", height);


        // Defines the scales
        var x = d3.scaleLinear()
            .domain([ 1998, 2016])
            .range([margin, width - margin]);

        // Life expectancy values all fall between 70 and 90.
        var y = d3.scaleLinear()
            .domain([ 15000 , 5000])
            .range([margin, height - margin]);

         // Add axes.  First the X axis and label.
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0,"+(500 - margin)+")")
            .call(d3.axisBottom(x));

        svg.append("text")
            .attr("class", "axis-label")
            .attr("y", 495)
            .attr("x",0 + (500 / 2))
            .style("text-anchor", "middle")
            .text("Year");

        // Now the Y axis and label.
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + margin_left + ",0)")
            .call(d3.axisLeft(y));

        //Make changes here to change the way Average funding is written on the chart
        svg.append("text")
            .attr("transform", "rotate(90)")
            .attr("class", "axis-label")
            .attr("y", - 50)
            .attr("x", 0 + (80))
            .style("text-anchor", "middle")
            .text("Average funding");


        var filtered_data = state_data[selectState];
        // console.log(filtered_data);
        var lineFunc = d3.line()
            .x(function (d) { console.log(d); return x(d.year); })
            .y(function (d) { return y(d.state_funding / d.ft_students); });

        svg.append("svg:path")
          .attr("d", lineFunc(filtered_data))
          .attr("stroke", "red")
          .attr("stroke-width",3)
          .attr("fill", "none");

}
