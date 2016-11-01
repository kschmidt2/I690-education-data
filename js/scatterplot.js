var buildScatter = function(selectState) {

  console.log(selectState);

  // margins
  var margin = {top: 25, right: 0, bottom: 20, left: 45},
      width = 500 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;


  // create responsive svg
  var svg = d3.select("#scattercanvas")
      .append("div")
      .classed("svg-container-line " + selectState + "-svg", true) //container class to make it responsive
      .append("svg")
      //responsive SVG needs these 2 attributes and no width and height attr
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 550 550")
      //class to make it responsive
      .classed("svg-content-responsive", true)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear()
        .range([0,width]);

    var y = d3.scaleLinear()
        .range([height,0]);


  // var designation = ["Main", "Branch"];
  // var designation_color = ["#47b4f2","#b0c422"];

  // load data
  var institutionFile = "data/institutional-data.csv";
  d3.csv(institutionFile,
      function(d) {
          return {
              college: d.college_name,
              state: d.state,
              college_type: d.type_des,
              campus_type: d.campus_des,
              median_income: +d.median_family_income,
              mean_price: +d.avg_net_price,
              median_earnings: +d.median_earnings,
              completion_rate: +d.completion_rate,
              mean_debt_withdrawn: +d.debt_withdrew,
              mean_debt_graduated: +d.debt_graduated,
              repayment_rate: +d.repayment_rate
          };
      },
      function(error, data) {
          if (error != null) {
              alert("Uh-oh, something went wrong. Try again?");
          } else {
                // Filter out schools with non-numbers in numerical fields
                var filtered_data = data.filter(function(d) {
                  var number_fields =
                    ["median_income", "mean_price", "median_earnings",
                    "completion_rate", "mean_debt_graduated",
                    "mean_debt_withdrawn", "repayment_rate"];

                  for (var i=0; i < number_fields.length; i++) {
                    var property_value = d[number_fields[i]];
                    if (isNaN(property_value) || property_value <= 0) {
                      return false;
                    }
                  }
                  return true;
                });

                // Filter to show selected state
                filtered_data = filtered_data.filter(function(d,i,arr) {
                if (selectState == d.state) {
                  return d.state;
                } else {
                  return false;
                }
              });
              plot_data(filtered_data);
          }
      });

  var plot_data = function(data) {
      console.log(data);

      x.domain(d3.extent(data, function(d) { return d.median_earnings; })).nice();
      y.domain(d3.extent(data, function(d) { return d.mean_debt_graduated;  })).nice();

      svg.append("g")
          .attr("class", "axis")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x)
            .tickFormat(function(d) { return "$" + d.toLocaleString(); }))
        .selectAll("text")
          .attr("y", 5)
          .attr("x", -42)
          .attr("transform", "rotate(-45)")
          .style("text-anchor", "start");

      svg.append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", 450)
        .style("text-anchor", "end")
        .text("Median earnings");

      svg.append("g")
          .attr("class", "axis")
          .attr("transform", "translate(0,0)")
          .call(d3.axisLeft(y)
            .tickFormat(function(d) { return "$" + d.toLocaleString(); }));

      svg.append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Average debt")

          svg.selectAll(".dot")
            .data(data)
          .enter().append("circle")
            // .attr("class", function(d) { return "dot " + d.campus_type })
            .attr("r", 3.5)
            .attr("cx", function(d) { return x(d.median_earnings); })
            .attr("cy", function(d) { return y(d.mean_debt_graduated); })
            .attr("r", 5);

      // svg.selectAll("text")
      //     .data(data)
      //   .enter().append("text")
      //     .text(function (d) { return d.median_earnings });

  }




};

$(".state").on('click', function(){
  $this = this;
  var stateClass = $(this).attr('id');
  var enterState = '<div class="hidden-xs sf sf-' + stateClass.toLowerCase() + '"></div><h2>' + stateClass + '</h2>';
  $('.scatter').html('<div id="scattercanvas"></div>');
  $('#schoolinfo').html(enterState);
  buildScatter(stateClass);
  $('.bottom-row').addClass('bottom-border');
});
