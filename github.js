// shold be a json
var user_data = [];

// parse json data sent from backend
function parseJson(jsondata) {
	// parse json to data for visualization
	var repos_data = jsondata["repos_data"];
	var repos_data_array = [['repo', 'Number of stars',]];
	for (var i in repos_data) {
		// console.log("!!!"+i);
		repos_data_array.push([repos_data[i]["name"], repos_data[i]["number_of_star"] ]);
	}
	// console.log(repos_data_array);
	return repos_data_array;
}

// draw the chart 
function drawBasic() {
	// set up data
	real_data = parseJson(user_data);
	data = google.visualization.arrayToDataTable(real_data);
	// console.log("in draw basic");
	var options = {
		title: 'Repositories Data',
		chartArea: {width: '50%'},
		hAxis: {
		  title: 'Number of stars',
		  minValue: 0
		},
		vAxis: {
		  title: 'Repo Name'
		}
	};

	var chart = new google.visualization.BarChart(document.getElementById('chart_div'));

	chart.draw(data, options);
	
}


// 4. Connect with REST API
function createBarChart() {
  // get element from the form
  // API
  var temp = document.getElementById("githubname").value;
  // console.log(temp);
  if (temp == "") {
  	return;
  }

  var apigClient = apigClientFactory.newClient();
  var params = {
    "username" : temp,
  };


  var body = { };
  var additionalParams = { };

  apigClient.usernameGet(params, body, additionalParams)
    .then(function(result){

        //This is where you would put a success callback
        user_data = result.data;

        // 0 and 1: alert user
        // 2: make the bar chart 
        if (user_data["message"] == 0) {
        	alert("User not found");
        } else if (user_data["message"] == 1) {
        	alert("Someone searched in two minutes");
        } else {
        	google.charts.load('current', {packages: ['corechart', 'bar']});
			google.charts.setOnLoadCallback(drawBasic);

			// TODO: 
			var githubname = document.getElementById("namefield");
			githubname.style.fontSize = "large";
			githubname.innerHTML = "Github username: " + user_data["username"];
			var image = document.getElementById("imgfield");
			image.src = user_data["image"];
        }	
    }).catch( function(result){
        //This is where you would put an error callback
        console.log(result);
    });
}
