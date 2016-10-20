var buildScatter = function(selectState) {

  console.log(selectState);

  // margins
  var margin = {top: 20, right: 80, bottom: 290, left: 100},
      width = 865 - margin.left - margin.right,
      height = 670 - margin.top - margin.bottom;


  // create responsive svg
  var svg = d3.select("#canvas1")
      .append("div")
      .classed("svg-container-line " + selectState + "-svg", true) //container class to make it responsive
      .append("svg")
      //responsive SVG needs these 2 attributes and no width and height attr
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 800 700")
      //class to make it responsive
      .classed("svg-content-responsive", true)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


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
              mean_debt_graudated: +d.debt_graduated,
              repayment_rate: +d.repayment_rate
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

  var plot_data = function(data) {
      console.log(data);

      svg.selectAll("text")
          .data(data)
        .enter().append("text")
          .text(selectState);

  }


};

$(".state").one('click', function(){
  $this = this;
  var stateClass = $(this).attr('id');
  buildScatter(stateClass);
})
.on('click', function(){
  $('#canvas1').fadeIn(500);
});
