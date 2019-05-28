function usageMonthly() {
    $.ajax({
        type: "GET",
        url: "/data",

        success: function(result) {

        	document.getElementById("inputs").style.display = "none";
            result = JSON.parse(result)
            var monthly = {}

            for (i = 0; i < result.length; i++) {
                var date = result[i].date;
                var amt = result[i].amount;

                var month = date.getMonth()
                var today = new Date();

                if(today.getYear() == date.getYear())
                {
                    if (!(month in monthly)) {
                        monthly[month] = amt;
                    } else monthly[month] += amt;
                }
            }

            console.log(monthly)

            function oof(month) {
                if(month in monthly)
                	return monthly[month]

                return 0
            }
            
        }
    });

}