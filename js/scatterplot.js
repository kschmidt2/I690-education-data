// Build bar charts comparing school, state, and national averages
// To add more function parameters (e.g., selected state/school),
// add them to the beginning of the list.
// Call with createVis("bars", <selection variables>);

/*Global varaibles*/
//var state_data;
var filtered_data_global;
var svg_global;
var school_data_global;
var x_global;
var y_global;


var buildBarCharts = function(state_data, national_data) {
    //console.log(state_data);
    //console.log(national_data);

};

// Build scatterplot for a state based on school data
// Call with createVis("scatter", selectedState);
var buildScatter = function(selectState, school_data) {

  school_data_global = school_data;

  // margins
  var margin = {top: 25, right: 0, bottom: 55, left: 80},
      width = 700 - margin.left - margin.right,
      height = 700 - margin.top - margin.bottom;


  // create responsive svg
  var svg = d3v4.select("#scattercanvas")
      .append("div")
      .classed("svg-container-line-svg", true) //container class to make it responsive
      .append("svg")
      //responsive SVG needs these 2 attributes and no width and height attr
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 800 750")
      //class to make it responsive
      .classed("svg-content-responsive", true)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      svg_global = svg;

    var x = d3v4.scaleLinear()
        .range([0,width]);

    var y = d3v4.scaleLinear()
        .range([height,0]);

    x.domain(d3v4.extent(school_data,
        function(d) { return d.median_earnings; })).nice();
    y.domain(d3v4.extent(school_data,
        function(d) { return d.mean_debt_graduated; })).nice();

    // Filter to show selected state
    filtered_data = school_data.filter(function(d,i,arr) {
        if (selectState == d.state) {
            return d.state;
        } else {
            return false;
        }
    });
      x_global = x;
      y_global = y;
      filtered_data_global = filtered_data;
      //Creates the dropdown with only the schools in the selected state

      //Retrieves the schools in the state.
      var schools = populateSchoolsFromFilteredData(filtered_data);

      //Helps to fill in all of the schools in the current selection
      populateSelector(schools);

      addChangeEvent();
      console.log("we have updated the selector");



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
        .attr("r", 10)
        .attr("cx", function(d) { return x(d.median_earnings); })
        .attr("cy", function(d) { return y(d.mean_debt_graduated); })
        .attr("stroke", "#fff")
        .on("mouseover", scatterHover)
        .on("click", scatterHover);

<<<<<<< HEAD

      console.log("I have reached this part");

      selectSchool("Maine Maritime Academy");



      //I would not want this function to be here...
      // function selectSchool(selectedSchool){
      //   console.log(selectedSchool);
      //   if (selectedSchool === "Show all"){
      //     svg.selectAll(".dot")
      //       .data(filtered_data)
      //     .enter().append("circle")
      //       .attr("class", "dot")
      //       .attr("r", 10)
      //       .attr("cx", function(d) { return x(d.median_earnings); })
      //       .attr("cy", function(d) { return y(d.mean_debt_graduated); })
      //       .attr("stroke", "#fff")
      //       .on("mouseover", scatterHover)
      //       .on("click", scatterHover);
      //   }
      //   else{
      //     var circles = svg.selectAll(".dot");
      //     console.log(circles);
      //     //Shows the required circle in orange
      //     circles.remove();

      //     svg.selectAll(".dot")
      //     .data(filtered_data)
      //     .enter().append("circle")
      //       .attr("class", "dot")
      //       .attr("r", 10)
      //       .attr("cx", function(d) { return x(d.median_earnings); })
      //       .attr("cy", function(d) { return y(d.mean_debt_graduated); })
      //       .attr("stroke", "#fff")
      //       .style("fill", function(d) { if(d.college === selectedSchool) return "orange"; })
      //       .on("mouseover", scatterHover)
      //       .on("click", scatterHover);

      //     }

      // }

  };




  // function stateClick () {
  //     $this = this;
  //     var stateClass = $(this).attr('class');
  //     var enterState = '<div class="hidden-xs sf sf-' + stateClass.toLowerCase() + '"></div><h2>' + stateClass + '</h2>';
  //     $('.scatter').html('<div id="scattercanvas"></div>');
  //     $('#stateinfo').html(enterState);
  //     createVis("scatter", stateClass);
  //     $('.bottom-row').addClass('bottom-border');
  //     document.getElementById('schoolinfo').innerHTML = "";
  // }

  /*Helper functions*/
  function scatterHover(d) {
    details(d);
    $('.dot').removeClass('hover-dot');
    $(this).addClass('hover-dot');
  }

  function details (d) {
    var details = "<h3>" + d.college + "</h3><span class='category'>Median earnings:</span> $";
    details += d.median_earnings.toLocaleString() + "</br><span class='category'>Average debt:</span> $";
    details += d.mean_debt_graduated.toLocaleString() + "</br><span class='category'>Average net price:</span> $";
    details += d.mean_price.toLocaleString() + "</br><span class='category'>Graduation rate:</span> ";
    details += (d.completion_rate*100).toFixed(2) + "%</br><span class='category'>Repayment rate:</span> ";
    details += (d.repayment_rate*100).toFixed(2) + "%";
    document.getElementById('schoolinfo').innerHTML = details;
    }


    function populateSchoolsFromFilteredData(filtered_data){
    var schools = [];
    var j = 0;
    for (var i = 0; i < filtered_data.length; i++){
        schools[j] = filtered_data[i].college;
        j++;
     }
      return schools;
    }


    function populateSchools(currentState, school_data){
    var schools = [];
    var j = 0;
    for (var i = 0; i < school_data.length; i++){
      if (school_data[i].state == currentState){
        schools[j] = school_data[i].college;
        j++;
      }else{
        console.log("It didnt match");
      }
     }
      return schools;
    }
  //Helps to populate the selector
  function populateSelector(schools){
    var selector = document.getElementById('school-selector');
    console.log(selector);
    var newOptions = "<select class='selectpicker' id = 'school-selector'>";
    newOptions += "<option>Show all</option>";

    for (var i = 0; i < schools.length; i++) {
      newOptions += "<option>" + schools[i] + "</option>";
    }

    newOptions += "</select>";
    document.getElementById('school-selector').innerHTML = newOptions;

  }
  //Adds the event listener to monitor any changes in the selection
  function addChangeEvent(){
    var selectEvent = document.getElementById('school-selector')
    //The line below adds the event to the map! I do not understand why this is happening?
    //selectEvent.addEventListener("change", alert(this.value));
    console.log("I tried to add the event");
  }

      function selectSchool(selectedSchool){


        //Initialization of variables
        var filtered_data = filtered_data_global;
        var svg = svg_global;
        var school_data = school_data_global;
        var x = x_global;
        var y = y_global;

        console.log(selectedSchool);
        if (selectedSchool === "Show all"){
          svg.selectAll(".dot")
            .data(filtered_data)
          .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 10)
            .attr("cx", function(d) { return x(d.median_earnings); })
            .attr("cy", function(d) { return y(d.mean_debt_graduated); })
            .attr("stroke", "#fff")
            .on("mouseover", scatterHover)
            .on("click", scatterHover);
        }
        else{
          var circles = svg.selectAll(".dot");
          console.log(circles);
          //Shows the required circle in orange
          circles.remove();

          svg.selectAll(".dot")
          .data(filtered_data)
          .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 10)
            .attr("cx", function(d) { return x(d.median_earnings); })
            .attr("cy", function(d) { return y(d.mean_debt_graduated); })
            .attr("stroke", "#fff")
            .style("fill", function(d) { if(d.college === selectedSchool) return "orange"; })
            .on("mouseover", scatterHover)
            .on("click", scatterHover);

            displayDataFromSelectedDataPoint(filtered_data, selectedSchool);
          }

      }

      }


      function displayDataFromSelectedDataPoint(filtered_data, selectedSchool){
            var currentDataPoint;
            for (var i = 0; i < filtered_data.length; i ++){

              if (filtered_data[i].college === selectedSchool){
                currentDataPoint = filtered_data[i];
              }
            }

            scatterHover(currentDataPoint);
      }
>>>>>>> 4e1a6e2abb0cd1703a9d32aaef3ea9b7c8ce5eae
