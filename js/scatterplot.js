// Build scatterplot for a state based on school data
// Uses global school_data array
var buildScatterplot = function(selectState) {

    // margins
    var margin = {top: 25, right: 0, bottom: 55, left: 80},
        width = 700 - margin.left - margin.right,
        height = 700 - margin.top - margin.bottom;

    // create responsive svg
    this.svg = d3v4.select("#scattercanvas")
        .append("div")
          .classed("svg-container", true) //container class to make it responsive
          .append("svg")
          //responsive SVG needs these 2 attributes and no width and height attr
          .attr("preserveAspectRatio", "xMinYMin meet")
          .attr("viewBox", "0 0 800 750")
          //class to make it responsive
          .classed("svg-content-responsive", true)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // create clipping path for regression line
    svg.append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", width)
        .attr("height", height);

    // define scales
    this.x = d3v4.scaleLinear().range([0,width]);
    this.y = d3v4.scaleLinear().range([height,0]);

    // define global domain
    x.domain(d3v4.extent(school_data,
        function(d) { return d.median_earnings; })).nice();
    y.domain(d3v4.extent(school_data,
        function(d) { return d.mean_debt_graduated; })).nice();

    // Filter to show selected state
    filtered_data = school_data.filter(function(d) {
        return selectState === d.state;
    });

    // build scatterplot
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3v4.axisBottom(x)
        .tickFormat(function(d) { return "$" + d.toLocaleString(); }))
        .selectAll("text")
        .attr("y", 10)
        .attr("x", -80)
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "start");

    svg.append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", height-5)
        .style("text-anchor", "end")
        .text("Median earnings");

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0,0)")
        .call(d3v4.axisLeft(y)
        .tickFormat(function(d) { return "$" + d.toLocaleString(); }));

    svg.append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Average debt");

    // draws circles on Scatterplot
    svg.selectAll(".dot").data(filtered_data)
        .enter().append("circle")
        .attr("id", function(d) { return d.college; })
        .attr("class", "dot")
        .attr("r", 10)
        .attr("cx", function(d) { return x(d.median_earnings); })
        .attr("cy", function(d) { return y(d.mean_debt_graduated); })
        .attr("stroke", "#fff")
        .attr("fill", "#d2d9da")
        .on("click", function(d) {
          buildBarCharts(d);
          details(d);
        })
        .on("mouseover", function(d) {
          buildBarCharts(d);
          details(d);
        });

    // creates dropdown menu for each state
    var dropDown = d3.select("#school-selector").append("select")
        .data(filtered_data)
        .attr("class", function(d) { return "school-list school-list"+ d.state;});

    var selectSchool = dropDown.append("option")
        .text("Select a school:");

    var options = dropDown.selectAll("option").data(filtered_data)
        .enter().append("option")
        .text(function (d) { return d.college; })
        .attr("value", function (d) { return d.college; })
        ;

    // calls function that selects dot on menu selection
    dropDown.on("change", dropClick);


    updateRegression(filtered_data);

    // Build bar charts comparing school, state, and national averages
    // Uses global state_data and national_avgs arrays
    function buildBarCharts(selectedSchool) {

        $('#schoolinfo').html('');

        // changes dot size and color on focus
        d3.selectAll('.dot')
            .attr('r', function(d, i) {
                if (d.college == selectedSchool.college) {
                    return 15;
                } else {
                    return 10;
                }
            })
            .style('fill', function(d, i) {
                if (d.college == selectedSchool.college) {
                    return "#47b4f2";
                } else {
                    return "#d2d9da";
                }
            });

        var bar_groups = [
          {"name": "Median earnings", "values": [
              {"category": "school", "amount": selectedSchool.median_earnings},
              {"category": "state", "amount": d3.mean(filtered_data,function(d) { return d.median_earnings; })},
              {"category": "national", "amount": national_avgs.median_earnings}
          ]},
          {"name": "Average debt", "values": [
                {"category": "school", "amount": selectedSchool.mean_debt_graduated},
                {"category": "state", "amount": d3.mean(filtered_data,function(d) { return d.mean_debt_graduated; })},
                {"category": "national", "amount": national_avgs.mean_debt}
          ]},
          {"name": "Net price", "values": [
                {"category": "school", "amount": selectedSchool.mean_price},
                {"category": "state", "amount": d3.mean(filtered_data,function(d) { return d.mean_price; })},
                {"category": "national", "amount": national_avgs.mean_price}
          ]},
          {"name": "Graduation rate", "values": [
                {"category": "school", "amount": selectedSchool.completion_rate},
                {"category": "state", "amount": d3.mean(filtered_data,function(d) { return d.completion_rate; })},
                {"category": "national", "amount": national_avgs.completion_rate}
          ]},
          {"name": "Repayment rate", "values": [
                {"category": "school", "amount": selectedSchool.repayment_rate},
                {"category": "state", "amount": d3.mean(filtered_data,function(d) { return d.repayment_rate; })},
                {"category": "national", "amount": national_avgs.repayment_rate}
          ]}
        ];

        // margins
        var margin = {top: 30, right: 0, bottom: 0, left: 0},
            width = 800 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

        // create responsive svg
        this.svg2 = d3v4.select("#schoolinfo").selectAll("svg")
          .data(bar_groups)
          .enter()
            .append("div")
              .classed("col-xs-6 col-sm-4 bar-containers", true)
            .append("div")
              .classed("svg-container-bars", true) //container class to make it responsive
            .append("svg:svg")
              //responsive SVG needs these 2 attributes and no width and height attr
              .attr("preserveAspectRatio", "xMinYMin meet")
              .attr("viewBox", "0 0 800 400")
              //class to make it responsive
              .classed("svg-content-responsive", true)
              .attr("id", function(d) { return d.name })
            .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
           .each(function(d, i){ // creates every bar chart separately
                var svg = d3.select(this);
                var allValues = d.values;
                var xMax = d3v4.max(allValues, function(d) { return d.amount; })

                // define scales
                var barX = d3v4.scaleLinear()
                            .range([0,width]).nice()
                            .domain([0, xMax]);
                var barY = d3v4.scaleBand()
                            .range([height,0])
                            .padding(0.3)
                            .domain(["national", "state", "school"]);

                svg.append("g")
                  .append("text")
                  .attr("x", 0)
                  .attr("y", 0)
                  .attr("dy", ".71em")
                  .attr("text-anchor", "start")
                  .attr("font-size", "6rem")
                  .style("text-transform", "uppercase")
                  .text(function(d) { return d.name});

                var g2 = svg.selectAll("#bar")
                  .data(allValues)
                  .enter().append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                g2.append("rect")
                    .attr("x", margin.left )
                    .attr("height", function(d) { return barY.bandwidth() })
                    .attr("y", function(d){ return barY(d.category) + margin.top; })
                    .attr("width", function(d) { return barX(d.amount); })
                    .attr("class", function(d) { return d.category })
                    .attr("id", "bar");

                g2.append("text")
                  .text(function(d) { return d.amount.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'); })
                  .attr("y", function(d){ return barY(d.category) + margin.top + barY.bandwidth()/1.4; })
                  .attr("x", function(d){ return (barX(d.amount)) - 20; })
                  .attr("text-anchor", "middle")
                  .attr("fill", "#fff")
                  .style("text-anchor", "end")
                  .style("font-size", "4rem");
        })
    } //closes bar chart

    function details (d) {
      var details = "<h3>" + d.college + "</h3>";
      details += "<span class='key'><span class='school-key'>School</span> | <span class='state-key'>State average</span> | <span class='national-key'>National average</span></span>";
      $('#schoolname').html(details);
    }

    // highlights circle and creates info box on dropdown selection
    function dropClick(d) {
        // gets value of the selected option
        var selectedValue = d3.event.target.value;

        filtered_data.forEach(function (d) {
            // loop through json data to match td entry
            // removes info box if show all is selected
            if (selectedValue == "show-all") {
                $('#schoolinfo').html('');
            } else if (selectedValue === d.college) {
                //for each data object in the features array (d), compare it's
                //name against the one you got from the event object

                // pass data element to scatterHover function so the dropdown
                // responds the same way clicking on a circle does
                buildBarCharts(d);
                details(d);
            }
        });

    }


};


// Add a regression line
function updateRegression(schools) {
    var linear_model = ss.linearRegression(schools.map(function(d) {
        return [d.median_earnings, d.mean_debt_graduated];
    }));

    var regression_function = ss.linearRegressionLine(linear_model);
    var reg_line = this.svg.selectAll(".regression").data([schools]);
    reg_line.exit().remove();

    reg_line.enter().append("line")
        .attr("class", "regression")
        .attr("x1", x(0))
        .attr("y1", y(regression_function(0)))
        .attr("x2", x(85000))
        .attr("y2", y(regression_function(85000)))
        .attr("clip-path", "url(#clip)")
        .style("stroke", "#1f3f48")
        .style("opacity", 0)
        .style("stroke-dasharray", "10,8")
        .style("stroke-width", "2px")
        .transition()
            .style("opacity", 1);
}
