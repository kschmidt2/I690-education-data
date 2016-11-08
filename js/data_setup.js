var state_data={}
var buildMap = function(selectAttr) {

  // load data
    var stateFile = "/data/state-data.csv";
    var institutionFile="/data/institutional-data.csv";
    
    //create state_data dictionary w/ abbr and color
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
//              console.log(data);
//              state_data={};
//add state_abbr              
var state_abbr= { "AL": "Alabama", "AK": "Alaska", "AZ": "Arizona", "AR": "Arkansas", "CA": "California", "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware", "FL": "Florida", "GA": "Georgia", "HI": "Hawaii", "ID": "Idaho", "IL": "Illinois", "IN": "Indiana", "IA": "Iowa", "KS": "Kansas", "KY": "Kentucky", "LA": "Louisiana", "ME": "Maine", "MD": "Maryland", "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota", "MS": "Mississippi", "MO": "Missouri", "MT": "Montana", "NE": "Nebraska", "NV": "Nevada", "NH": "New Hampshire", "NJ": "New Jersey", "NM": "New Mexico", "NY": "New York", "NC": "North Carolina", "ND": "North Dakota", "OH": "Ohio", "OK": "Oklahoma", "OR": "Oregon", "PA": "Pennsylvania", "RI": "Rhode Island", "SC": "South Carolina", "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas", "UT": "Utah", "VT": "Vermont", "VA": "Virginia", "WA": "Washington", "WV": "West Virginia", "WI": "Wisconsin", "WY": "Wyoming" };
                
              var abbrOf = function(state) {
                    for (abbr in state_abbr) { 
                        if (state_abbr[abbr] == state) {
                        return abbr;
                        }
                    }
                    return "Other";
                };
              
              
              data.forEach(function(d){     
                  var st=abbrOf(d.state);
                   if (d.year=="2014"){
                       state_data[st]={state: d.state, state_funding: d.state_funding, color: d3.interpolate("#ffffcc", "#800026")(Math.round(100*Math.random())/100), cost_of_living: d.cost_of_living, ft_students:d.ft_students}}});

      console.log(state_data);
          
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
                      var agg_data={};
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
                      
                        aggregate_data.forEach(function(d){
                            var st_agg=d.key;
                            agg_data[st_agg]={median_earnings:d.values.median_earnings, mean_debt: d.values.mean_debt, mean_price:d.values.mean_price}  
                                                
                        })
                                                
                      console.log(state_data);
                      console.log(agg_data); 
                      
                    }
              });                    
                      // Add aggregated data to state data
//                      for (var i=0; i < state_data[state_data.length - 1].values.length; i++) {
//                         for (property in aggregate_data[i].value) {
//                             state_data[state_data.length - 1].values[i].values[0][property] = 
//                                 aggregate_data[i].value[property];
//                         }
//                      }
//                      plot_data(state_data);
                      

              
//              state_data.forEach(function (d){
//                  d[key]={state_data[d[key]], agg_data[d[key]]}});
//                  
   
                               /* draw states on id #statesvg */	
      uStates.draw("#statesvg", state_data, tooltipHtml);
//	
      d3.select(self.frameElement).style("height", "600px"); 
              
        function tooltipHtml(n,selectAttr){	/* function to create html content string in tooltip div. */
            return "<h4>"+n+"</h4><table>"+
			"<tr><td></td><td>"+selectAttr+"</td><tr>"+
			"</table>";
        }


};})};

