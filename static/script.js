function showmore()
{
	document.getElementById("more").style.display = "none"; 
	document.getElementById("content").style.display = "block";
}

function showless()
{
	document.getElementById("content").style.display = "none"; 
	document.getElementById("more").style.display = "block";
}

function display() {
    $.ajax({
        type: "GET",
        url: "/data",

        success: function(result) {

            result = JSON.parse(result)
            var dict = {}

            for (i = 0; i < result.length; i++) {
                var date = result[i].date;
                var amt = result[i].amount;
                var about = result[i].reason;
                var id = result[i].id;

                if (!(date in dict))
                    dict[date] = []

                dict[date].push(amt)
                dict[date].push(about)
                dict[date].push(id)

            }



            function sortOnKeys(dict) {

                var sorted = [];
                for (var key in dict) {
                    sorted[sorted.length] = key;
                }
                sorted.sort();
                sorted.reverse();

                var tempDict = {};
                for (var i = 0; i < sorted.length; i++) {
                    tempDict[sorted[i]] = dict[sorted[i]];
                }

                return tempDict;
            }

            dict = sortOnKeys(dict);

            var x = ""
            var count = 0
            var f = 0
            for (var date in dict) {

            	if(count == 6)
                {
                	f = 1
                	x+= '<button id="more" onclick = "showmore()">Read more</button><div id="content">' 
                }

                x += '<li>' + date + '<ul id="ul2">'

                for (i = 0; i < dict[date].length; i += 3) {
                	
                    x += '<div id="'+dict[date][i+2]+ '+"><li> Rs ' + dict[date][i] + '<p>'+ dict[date][i + 1] + '<span class="close" id="'+dict[date][i+2]+'">&times;</span></p></li></div>'
                	count += 1;
                }

                x += '</ul></li>'
            }
            if(f == 1)
            	x+= '<button id ="less" onclick = "showless()">Read less</button></div>'

            document.getElementById("ul1").innerHTML = x
        }
    });
}

function del(x)
{
	$.ajax({
        type: "POST",
        url:"/delete",
        data: JSON.stringify(x),
        contentType: 'application/json;charset=UTF-8',
    });
}

$("body").on("click", ".close", function() {
	
	var x = $(this).attr('id')
	console.log(x)
	del(x)
	x = x + "+"
	console.log(x)
	document.getElementById(x).style.display="none"
})
 

function usage() {
    $.ajax({
        type: "GET",
        url: "/data",

        success: function(result) {

            result = JSON.parse(result)
            var daily = {}

            for (i = 0; i < result.length; i++) {
                var date = result[i].date;
                var amt = result[i].amount;
                var about = result[i].reason;

                if (!(date in daily)) {
                    daily[date] = amt;
                } else daily[date] += amt;

            }

            console.log(daily)

            function oof(date) {
                if(date in daily)
                	return daily[date]

                return 0
            }

            google.charts.load('current', {
                'packages': ['corechart']
            });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {

                var data = new google.visualization.DataTable();
                data.addColumn('date', 'Time of Day');
                data.addColumn('number', 'Amount');

                var today = new Date();
                var m = today.getMonth();
                var d = today.getDate();
                var y = today.getFullYear();
                m = m+1
                
                var arr = [];

                for (i = 10; i >= 0; i--) {
                	str = ""
                	str += y
                	str += "-" 
                	if(m < 10)
                		str+="0"+m
                	else str+=m
                	str += "-"
                	str += d-i

                    arr.push([new Date(y, m-1, d - i), oof(str)])
                    console.log(str)
                	console.log(oof(str))
                }

                data.addRows(arr);

                var options = {
                    title: 'Daily Expenditure for the past 10 days',
                    width: 900,
                    height: 500,
                    hAxis: {
                        format: 'MMM dd, yyyy',
                        gridlines: {
                            count: 15
                        }
                    },
                    vAxis: {
                        gridlines: {
                            color: 'none'
                        },
                        minValue: 0
                    }
                };

                var chart = new google.visualization.LineChart(document.getElementById('chart_div'));

                chart.draw(data, options);

            }


        }
    });

}

function um() {
    $.ajax({
        type: "GET",
        url: "/data",

        success: function(result) {

            result = JSON.parse(result)

            var monthly = {}
            var today = new Date();
            var year = today.getYear() + 1900;

            for (i = 0; i < result.length; i++) {
                var date = result[i].date;
                var amt = result[i].amount;

                var month = date.substring(5,7)             
                if(year == date.substring(0,4))
                {
                    if (!(month in monthly)) {
                        monthly[month] = amt;
                    } else monthly[month] += amt;
                }
            }


            google.charts.load('current', {
              callback: drawChart,
              packages:['corechart']
            });

            function drawChart() {
                let data = [];

                for(i in monthly)
                	data.push({yearId: year, monthId: Number(i), money: monthly[i]})
                

                console.log(data)
                let dataTable = new google.visualization.DataTable();

                dataTable.addColumn("string", "Months");
                dataTable.addColumn("number", "Amount");

                let formatDate = new google.visualization.DateFormat({
                  pattern: 'MMM yyyy'
                });

                data.forEach(row => {
                    dataTable.addRow([formatDate.formatValue(new Date(row.yearId, row.monthId - 1)), row.money]);
                });
                let chart = new google.visualization.ColumnChart(document.getElementById("detailedCharts"));

                let options = {
                    title: "Monthly Expenditure",
                    hAxis: {
                        title: "Months",
                        gridelines: {
                            count: -1
                        }
                    },
                    vAxis: {
                        gridlines: { color: 'none' },
                        minValue: 0,
                        title: "Amount",
                        format: '#',
                        maxValue: 4
                    }
                };

                chart.draw(dataTable, options);
            }
            
        }
    });

}