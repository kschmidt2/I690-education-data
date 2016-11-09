// Utility functions for state abbreviations
var state_abbr = { "AL": "Alabama", "AK": "Alaska", "AZ": "Arizona", "AR": "Arkansas", "CA": "California", "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware", "FL": "Florida", "GA": "Georgia", "HI": "Hawaii", "ID": "Idaho", "IL": "Illinois", "IN": "Indiana", "IA": "Iowa", "KS": "Kansas", "KY": "Kentucky", "LA": "Louisiana", "ME": "Maine", "MD": "Maryland", "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota", "MS": "Mississippi", "MO": "Missouri", "MT": "Montana", "NE": "Nebraska", "NV": "Nevada", "NH": "New Hampshire", "NJ": "New Jersey", "NM": "New Mexico", "NY": "New York", "NC": "North Carolina", "ND": "North Dakota", "OH": "Ohio", "OK": "Oklahoma", "OR": "Oregon", "PA": "Pennsylvania", "RI": "Rhode Island", "SC": "South Carolina", "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas", "UT": "Utah", "VT": "Vermont", "VA": "Virginia", "WA": "Washington", "WV": "West Virginia", "WI": "Wisconsin", "WY": "Wyoming" };
var abbrOf = function(state) {
    for (var abbr in state_abbr) {
        if (state_abbr[abbr] == state) {
            return abbr;
        }
    }
    return "Other";
};

// Extract the given year's data from a rolled-up data object
var get_year_data = function(target_year, annual_data) {
    for (var year in annual_data) {
        if (annual_data[year].key == target_year) {
            return annual_data[year].values;
        }
    }
    return -1;
};

// Define variables to control which vis function we call
var vis_function_list = {"map": buildMap, "scatter": buildScatter};
var vis_mode, vis_function_args;

function combine_data(error, school_data, state_data) {
    var converted_school_data = [],
        converted_state_data = [];

    // Select the fields we want from school data
    school_data.forEach(function(d) {
        converted_school_data.push({
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
        });
    });

    // Filter out schools in territories, not states
    converted_school_data = converted_school_data.filter(function(d) {
        return d.state in state_abbr;
    });
    // Filter out school records with non-number values in numerical fields
    converted_school_data = converted_school_data.filter(function(d) {
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

    if (this.vis_mode == "scatter") {
        this.vis_function_args.push(converted_school_data);
        return this.vis_function_list[this.vis_mode]
            .apply(this, this.vis_function_args);
    }

    // Select the fields we want from state data
    state_data.forEach(function(d) {
        converted_state_data.push({
            state: d.State,
            year: d.FiscalYear,
            inflation: 1/(+d.InflationDenom),
            cost_of_living: +d.CostOfLiving,
            state_funding: +d.StateSupport,
            ft_students: +d.FTEnrollment
        });
    });

    // Filter out state records with non-number values in numerical fields
    converted_state_data = converted_state_data.filter(function(d) {
        var number_fields =
          ["inflation", "cost_of_living", "state_funding", "ft_students"];

        for (var i=0; i < number_fields.length; i++) {
          var property_value = d[number_fields[i]];
          if (isNaN(property_value) || property_value <= 0) {
            return false;
          }
        }
        return true;
    });

    // Group state data by year then by state
    var nested_state_data = d3.nest()
        .key(function(d) { return d.year; })
        .key(function(d) { return abbrOf(d.state); })
            .sortKeys(d3.ascending)
        .entries(converted_state_data);

    // Pull aggregate data from school file
    var aggregate_data = d3.nest()
        .key(function(d) { return d.state; }).sortKeys(d3.ascending)
        .rollup(function(states) {
            return {
                median_earnings: d3.median(states, function(d) { return d.median_earnings; }),
                mean_debt: d3.mean(states, function(d) { return d.mean_debt_graduated; }),
                mean_price: d3.mean(states, function(d) { return d.mean_price; })
            };
        }).entries(converted_school_data);

    // Add aggregated school data to state data
    for (var i=0; i < nested_state_data[nested_state_data.length - 1].values.length; i++) {
        for (var property in aggregate_data[i].value) {
            nested_state_data[nested_state_data.length - 1].values[i].values[0][property] =
                    aggregate_data[i].value[property];
        }
    }

    // Call function to render vis
    if (this.vis_mode == "map") {
        this.vis_function_args.push(
            get_year_data(nested_state_data[nested_state_data.length-1].key,
                nested_state_data)
        );
    } else {
        this.vis_function_args.push(nested_state_data);
    }
    this.vis_function_list[this.vis_mode].apply(this, this.vis_function_args);
}

function createVis (mode) {
    if (!(mode in vis_function_list)) {
        console.log("Incorrect mode specified. Try again?");
        throw error;
    }

    this.vis_mode = mode;
    this.vis_function_args = Array.prototype.slice.call(arguments, 1);

    // load data
    var institutionFile = "data/institutional-data.csv";
    var stateFile = "data/state-data.csv";

    var q = d3.queue()
        .defer(d3.csv, institutionFile)
        .defer(d3.csv, stateFile)
        .await(combine_data);

}
