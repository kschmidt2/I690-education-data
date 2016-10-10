var buildScatter = function(selectState) {

  console.log(selectState);

  // load data
  var institutionFile = "data/institutional-data.csv";
  d3.csv(institutionFile,
      function(d) {
          return {
              college: d.college_name,
              state: d.state,
              collegeType: d.type_des,
              medianIncome: +d.median_family_income,
              meanPrice: +d.avg_net_price,
              medianEarnings: +d.median_earnings,
              completionRate: +d.completion_rate,
              meanDebtWithdrawn: +d.debt_withdrew,
              meanDebtGraudated: +d.debt_graduated,
              repaymentRate: +d.repayment_rate
          };
      },
      function(error, data) {
          if (error != null) {
              alert("Uh-oh, something went wrong. Try again?");
          } else {
              this.institutionData = data;
              // console.log("Successfully imported "+ data.length() +" records.");
              var filtered_data = data.filter(function(d,i,arr) {
                if (selectState == d.state) {
                  return d.state;
                } else {
                  return false;
                }
              });
              console.log(filtered_data);
          }
      });



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

    svg.selectAll("text")
      .data(institutionFile)
    .enter().append("text")
      .text(selectState);

};

$(".state").one('click', function(){
  $this = this;
  var stateClass = $(this).attr('id');
  buildScatter(stateClass);
})
.on('click', function(){
  $('#canvas1').fadeIn(500);
});
