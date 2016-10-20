var buildMap = function() {

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

  // load data
  var institutionFile = "data/institutional-data.csv";
  var stateFile = "data/state-data.csv";

  // First, load the state data
  d3.csv(stateFile,
      function(d) {
          return {
              state: d.State,
              year: d.FiscalYear,
              inflation: 1/(+d.InflationDenom),
              cost_of_living: +d.CostOfLiving,
              state_funding: +d.StateSupport,
              ft_students: +d.FTEnrollment
          };
      },
      function(error, data) {
          if (error != null) {
              alert("Uh-oh, we can't read the state-level data file. Try again?");
          } else {
            var state_data = d3.nest()
                .key(function(d) { return d.year; })
                .key(function(d) { return abbrOf(d.state); }).sortKeys(d3.ascending)
                .entries(data);

            // Now load aggregated data from the institution file
            d3.csv(institutionFile,
                function(d) { 
                    return {
                        state: d.state,
                        median_earnings: d.median_earnings,
                        mean_debt: d.debt_graduated,
                        mean_price: d.avg_net_price
                    };
              },
              function(error, data) {
                  if (error != null) {
                      alert("Uh-oh, we can't read the institution-level data file. Try again?");
                  } else {
                      var filtered_data = data.filter(function(d) { 
                          return (d.state in state_abbr);
                      });

                      var aggregate_data = d3.nest()
                          .key(function(d) { return d.state; }).sortKeys(d3.ascending)
                          .rollup(function(states) { 
                              return {
                                  median_earnings: d3.median(states, function(d) { return d.median_earnings; }),
                                  mean_debt: d3.mean(states, function(d) { return d.mean_debt; }),
                                  mean_price: d3.mean(states, function(d) { return d.mean_price; })
                              };
                           }).entries(filtered_data);

                      // Add aggregated data to state data
                      for (var i=0; i < state_data[state_data.length - 1].values.length; i++) {
                         for (property in aggregate_data[i].value) {
                             state_data[state_data.length - 1].values[i].values[0][property] = 
                                 aggregate_data[i].value[property];
                         }
                      }
                      plot_data(state_data);
                  }
              });
          }
      });

  var plot_data = function(data) {
      console.log(get_year_data("2015", data));
  }

// Utility Functions
  var state_abbr = { "AL": "Alabama", "AK": "Alaska", "AZ": "Arizona", "AR": "Arkansas", "CA": "California", "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware", "FL": "Florida", "GA": "Georgia", "HI": "Hawaii", "ID": "Idaho", "IL": "Illinois", "IN": "Indiana", "IA": "Iowa", "KS": "Kansas", "KY": "Kentucky", "LA": "Louisiana", "ME": "Maine", "MD": "Maryland", "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota", "MS": "Mississippi", "MO": "Missouri", "MT": "Montana", "NE": "Nebraska", "NV": "Nevada", "NH": "New Hampshire", "NJ": "New Jersey", "NM": "New Mexico", "NY": "New York", "NC": "North Carolina", "ND": "North Dakota", "OH": "Ohio", "OK": "Oklahoma", "OR": "Oregon", "PA": "Pennsylvania", "RI": "Rhode Island", "SC": "South Carolina", "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas", "UT": "Utah", "VT": "Vermont", "VA": "Virginia", "WA": "Washington", "WV": "West Virginia", "WI": "Wisconsin", "WY": "Wyoming" };
  var abbrOf = function(state) {
      for (abbr in state_abbr) { 
          if (state_abbr[abbr] == state) {
              return abbr;
          }
      }
      return "Other";
  }

};

  // Extract the given year's data from a rolled-up data object
  var get_year_data = function(target_year, annual_data) {
      console.log(annual_data);
      for (year in annual_data) { 
          if (annual_data[year].key == target_year) {
              return annual_data[year].values;
          }
      }
      return -1;
  }


// Actually build something
buildMap();
