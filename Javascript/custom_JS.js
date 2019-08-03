//create variables to store all data database, user database, and top 4 results appeared
let dataTitle = new Map();
let user = [];
let highestResult = "",
  secondHighestResult = "",
  thirdHighestResult = "",
  forthHighestResult = "";

//Temporary workaround as all data is local not on server
for (let i = 1; i <= 5; i++) {
  //I was going to use getJson but it was async
  $.ajax({
    url: "../data/test" + i + ".json",
    dataType: 'json',
    async: false,
    success: function(data) {
      //push userID to user[]
      user.push(data.userID);
      //loop through each search result
      for (const entry of data.searchData) {
        //get what was searched
        const searchTerm = entry.searchQueryString;
        //if there are search results, get the results
        if (entry.searchResults != null) {
          for (const result of entry.searchResults) {
            // if this page is not in the database, add it
            let data = {};
            if (!dataTitle.has(result.title)) {
              data.search = searchTerm;
              data.searchUrl = result.url;
              data.numberAppeared = 1;
              data['numberTest' + i] = 1;
              dataTitle.set(result.title, data);
            }
            // increase the number of pages shown as result
            else {
              data = dataTitle.get(result.title);
              data.numberAppeared++;
              //distingiush this result was shown to this particular user
              if (data.hasOwnProperty('numberTest' + i)) {
                data['numberTest' + i]++;
              } else {
                data['numberTest' + i] = 1;
              }
              dataTitle.set(result.title, data);
            }
            //update latest number - which results appeared top 4 most frequently
            if (highestResult == "" || secondHighestResult == "" || thirdHighestResult == "" || forthHighestResult == "") {
              highestResult = result.title;
              secondHighestResult = result.title;
              thirdHighestResult = result.title;
              forthHighestResult = result.title;
            } else if (data.numberAppeared >= dataTitle.get(highestResult).numberAppeared) {
              highestResult = result.title;
            } else if (data.numberAppeared > dataTitle.get(secondHighestResult).numberAppeared && data.search != dataTitle.get(highestResult).search) {
              secondHighestResult = result.title;
            }
          }
        }
      }
    }
  });
}

//convert database from database format to chart format
const highestResultData = [], secondHighestResultData = [];
for (let count = 1; count <= 5; count++) {
  highestResultData.push(dataTitle.get(highestResult)['numberTest' + count]);
  secondHighestResultData.push(dataTitle.get(secondHighestResult)['numberTest' + count]);
}


//create two charts based on data
let ctx = document.getElementById('first').getContext('2d');
let myChart = new Chart(ctx, {
  type: 'polarArea',
  data: {
    labels: user,
    datasets: [{
      label: '# of Votes',
      data: highestResultData,
      backgroundColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)'
      ],
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    legend: {
      display: false,
    },
    title: {
      display: true,
      fontSize: 65,
      text: '\"' + dataTitle.get(highestResult).search + '\"',
    },
    scales: {
      xAxes: [{
        ticks: {
          display: false,
          fontSize: 40
        },
        scaleLabel: {
          display: false
        },
        gridLines: {
          display: false,
          drawBorder: false
        }
      }],
      yAxes: [{
        ticks: {
          display: false
        },
        gridLines: {
          display: false,
          drawBorder: false
        }
      }]
    }
  }
});

let ctx2 = document.getElementById('second').getContext('2d');
let myChart2 = new Chart(ctx2, {
  type: 'doughnut',
  data: {
    labels: user,
    datasets: [{
      label: '# of Votes',
      data: secondHighestResultData,
      backgroundColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)'
      ],
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    title: {
      display: true,
      fontSize: 65,
      text: '\"' + dataTitle.get(secondHighestResult).search + '\"',
    },
    legend: {
      display: false,
    },
    scales: {
      xAxes: [{
        ticks: {
          display: false
        },
        scaleLabel: {
          display: false,
        },
        gridLines: {
          display: false,
          drawBorder: false
        }
      }],
      yAxes: [{
        ticks: {
          display: false
        },
        gridLines: {
          display: false,
          drawBorder: false
        }
      }]
    }
  }
});
