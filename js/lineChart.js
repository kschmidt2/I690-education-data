 /*This function creates the line chart that helps us to compare the amount of state funding per student in the selected state*/
 function buildLineChart(selectState){

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

        var xAxis = d3.axisBottom(x).tickFormat(d3.format(".0f"));//this formats the ticks on the axis and removes the , from the thousands
           
        // Life expectancy values all fall between 70 and 90.
        var y = d3.scaleLinear()
            .domain([ 15000 , 5000])
            .range([margin, height - margin]);

         // Add axes.  First the X axis and label.
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0,"+(500 - margin)+")")
            .call(xAxis);

        svg.append("text")
            .attr("class", "axis-label")
            .attr("y", 450)
            .attr("x",0 + (440))
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
            
        
        // Now a clipping plain for the main axes
        // Add the clip path.
        svg.append("clipPath")
            .attr("id", "clip")
            .append("rect")
                  .attr("x", margin)
                  .attr("y", margin)
                  .attr("width", width - 2 * margin)
                  .attr("height", height - 2 * margin);   

        //Loading the data
       d3.csv("/data/state-data.csv", 
        function(d) {
            return {
                      state: d.State,
                      fiscal_year: +d.FiscalYear,
                      inflation_denom: +d.InflationDenom,
                      Cost_of_living: +d.CostOfLiving,
                      expensive_school_enrollment: +d.ExpensiveSchoolEnrollment,
                      state_support: +d.StateSupport,
                      FT_enrollment: +d.FTEnrollment,
                      support_per_student: +d.SupportPerStudent
                  };
                },       
                function(error, data) {
                    if (error != null) {
                        alert("Uh-oh, something went wrong. Try again?");
                     } else {
                        var filtered_data = data.filter(function(d,i,arr) {
                        if (selectState == d.state) {
                            return d.state;
                        } else {
                          return false;
                        }
                      });
                      plot_data(filtered_data);
                    }
                });

        var plot_data = function(data){
            console.log(data);

            var lineFunc = d3.line()
                .x(function (d) {
                  return x(d.fiscal_year);
                  })
                  .y(function (d) {
                    return y(d.support_per_student);
                  });

            svg.append("svg:path")
              .attr("d", lineFunc(data))
              .attr("stroke", "red")
              .attr("stroke-width",3)
              .attr("fill", "none");

        }
}