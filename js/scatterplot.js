// Build bar charts comparing school, state, and national averages
// To add more function parameters (e.g., selected state/school),
// add them to the beginning of the list.
// Call with createVis("bars", <selection variables>);
var buildBarCharts = function(school_data, state_data) {
    console.log(school_data);
};

// Build scatterplot for a state based on school data
// Call with createVis("scatter", selectedState);
var buildScatter = function(selectState, school_data) {

  console.log(selectState);

  // margins
  var margin = {top: 25, right: 0, bottom: 20, left: 45},
      width = 700 - margin.left - margin.right,
      height = 700 - margin.top - margin.bottom;


  // create responsive svg
  var svg = d3.select("#scattercanvas")
      .append("div")
      .classed("svg-container-line " + selectState + "-svg", true) //container class to make it responsive
      .append("svg")
      //responsive SVG needs these 2 attributes and no width and height attr
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 800 750")
      //class to make it responsive
      .classed("svg-content-responsive", true)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear()
        .range([0,width]);

    var y = d3.scaleLinear()
        .range([height,0]);

    x.domain(d3.extent(school_data,
        function(d) { return d.median_earnings; })).nice();
    y.domain(d3.extent(school_data,
        function(d) { return d.mean_debt_graduated; })).nice();

    // Filter to show selected state
    filtered_data = school_data.filter(function(d,i,arr) {
        if (selectState == d.state) {
            return d.state;
        } else {
            return false;
        }
    });

    console.log(filtered_data);

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
        .attr("y", height-5)
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
        .text("Average debt");

      function details (d) {
        var details = "<h3>" + d.college + "</h3><span class='category'>Median earnings:</span> $";
        details += d.median_earnings.toLocaleString() + "</br><span class='category'>Average debt:</span> $";
        details += d.mean_debt_graduated.toLocaleString() + "</br><span class='category'>Average net price:</span> $";
        details += d.mean_price.toLocaleString() + "</br><span class='category'>Graduation rate:</span> ";
        details += (d.completion_rate*100).toFixed(2) + "%</br><span class='category'>Repayment rate:</span> ";
        details += (d.repayment_rate*100).toFixed(2) + "%";
        document.getElementById('schoolinfo').innerHTML = details;
      }

      function scatterHover(d) {
        details(d);
        $('.dot').removeClass('hover-dot');
        $(this).addClass('hover-dot');
      }

      // function dotClick (d) {
      //   details(d);
      //   $(this).on('click', function() {
      //     $('.dot').removeClass('hover-dot');
      //     $(this).addClass('hover-dot');
      //   })
      // }

      svg.selectAll(".dot")
        .data(filtered_data)
      .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 7)
        .attr("cx", function(d) { return x(d.median_earnings); })
        .attr("cy", function(d) { return y(d.mean_debt_graduated); })
        .attr("stroke", "#fff")
        .on("mouseover", scatterHover)
        .on("click", scatterHover);

  };

$(".state").on('click', function(){
  $this = this;
  var stateClass = $(this).attr('id');
  var enterState = '<div class="hidden-xs sf sf-' + stateClass.toLowerCase() + '"></div><h2>' + stateClass + '</h2>';
  $('.scatter').html('<div id="scattercanvas"></div>');
  $('#stateinfo').html(enterState);
  createVis("scatter", stateClass);
  $('.bottom-row').addClass('bottom-border');
  document.getElementById('schoolinfo').innerHTML = "";
});
