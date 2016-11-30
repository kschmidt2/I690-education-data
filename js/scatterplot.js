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
            .classed("svg-container-line " + selectState + "-svg", true) //container class to make it responsive
            .append("svg")
            //responsive SVG needs these 2 attributes and no width and height attr
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 800 750")
            //class to make it responsive
            .classed("svg-content-responsive", true)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

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
    this.filtered_data = school_data.filter(function(d) {
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
        .on("mouseover", scatterHover)
        .on("click", buildBarCharts);

    // creates dropdown menu for each state
    var dropDown = d3.select("#school-selector").append("select")
        .data(filtered_data)
        .attr("class", "school-list");

    var options = dropDown.selectAll("option").data(filtered_data)
        .enter().append("option")
        .text(function (d) { return d.college; })
        .attr("value", function (d) { return d.college; });

    // calls function that selects dot on menu selection
    dropDown.on("change", dropClick);

    // adds select a school option to the menus
    $('option:first-child').before('<option>Select a school:</option>');
    $('option:first-child').val("show-all");
    $('.school-list').val("show-all");

    updateRegression(this.filtered_data);

};

// Build bar charts comparing school, state, and national averages
// Uses global state_data and national_avgs arrays
function buildBarCharts (d) {
    console.log(d.median_earnings);
    console.log(state_data);
    console.log(national_avgs);
}


/* Helper functions */
function scatterHover(d) {
    details(d);
    $('.dot').css('fill', '#47b4f2').attr("r", 10);
    $(this).css('fill', "#1f3f48").attr("r", 15);
    // buildBarCharts(d, state_data, national_data);
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
            scatterHover(d);
        }
    });

    // increases dot size and changes color on dropdown click
    d3.selectAll('.dot')
        .attr('r', function(d, i) {
            if (d.college == selectedValue) {
                return 15;
            } else {
                return 10;
            }
        })
        .style('fill', function(d, i) {
            if (d.college == selectedValue) {
                return "#1f3f48";
            } else {
                return "#47b4f2";
            }
        }
    );
}

// function to populate the info box
function details (d) {
    var details = "<h3>" + d.college + "</h3><span class='category'>Median earnings:</span> $";
    details += d.median_earnings.toLocaleString() + "</br><span class='category'>Average debt:</span> $";
    details += d.mean_debt_graduated.toLocaleString() + "</br><span class='category'>Average net price:</span> $";
    details += d.mean_price.toLocaleString() + "</br><span class='category'>Graduation rate:</span> ";
    details += (d.completion_rate*100).toFixed(2) + "%</br><span class='category'>Repayment rate:</span> ";
    details += (d.repayment_rate*100).toFixed(2) + "%";
    $('#schoolinfo').html(details);
}

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
