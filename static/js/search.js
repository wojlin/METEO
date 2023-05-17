

class Meteo
{
    constructor()
    {
        this.lat = 0;
        this.lon = 0;
        this.timezone = "";
        this.time = 1;
        this.parameters = "";
        this.charts = [];
    }

    get(url, callback)
    {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function()
        {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            {
                callback(xmlHttp.responseText);
            }
        }
        xmlHttp.open("GET", url, true);
        xmlHttp.send(null);
    }

    display_menu()
    {
        document.getElementById("settings_container").style.display = "block";
        document.getElementById("meteo_container").style.display = "none";
        document.getElementById("meteo_simple_container").style.display = "none";
        let element = document.getElementById("transition");
        element.classList.remove("transition_animate");
        element.classList.add("transition_hidden");

        let element1 = document.getElementById("clouds");
        element1.classList.remove("clouds_animate");
        element1.classList.add("clouds_hidden");

        meteo.charts.forEach(element => element.destroy());
    }

    go_back()
    {
        let element = document.getElementById("transition");
        element.classList.remove("transition_hidden");
        element.classList.add("transition_animate");

        let element1 = document.getElementById("clouds");
        element1.classList.remove("clouds_hidden");
        element1.classList.add("clouds_animate");

        let info = document.getElementById("transition-info");

        info.innerHTML = "going back...";

        setTimeout(this.display_menu, 4000);
    }

    hide_transition()
    {
        let element = document.getElementById("transition");
        element.classList.remove("transition_animate");
        element.classList.add("transition_hidden");

        let element1 = document.getElementById("clouds");
        element1.classList.remove("clouds_animate");
        element1.classList.add("clouds_hidden");
    }

    includes(value)
    {
        if(this.parameters.includes(value))
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    display_simple_meteo(response)
    {
        document.getElementById("settings_container").style.display = "none";
        document.getElementById("meteo_container").style.display = "none";
        document.getElementById("meteo_simple_container").style.display = "block";

        let element = document.getElementById("transition");
        element.classList.remove("transition_animate");
        element.classList.add("transition_hidden");

        let element1 = document.getElementById("clouds");
        element1.classList.remove("clouds_animate");
        element1.classList.add("clouds_hidden");

        let json = JSON.parse(response);
        console.log(json);

        let unit = "";
        let temp_unit = ""
        let substring_amount = 0;

        if("hourly" in json)
        {
            unit = "hourly";
            substring_amount = 11;
            temp_unit = "temperature_2m";
        }
        else if("daily" in json)
        {
            unit = "daily";
            substring_amount = 5;
            temp_unit = "temperature_2m_max";
        }
        else
        {
            console.error("unknown error");
            return;
        }

        let container = document.getElementById("meteo_simple_box_container");
        container.innerHTML = "";
        

        for(let i = 0; i<json[unit]["time"].length; i++)
        {

            let day_part = ""
            if("hourly" in json && "daily" in json)
            {
                let current_date = Date.parse(json[unit]["time"][i]);
                let sunrise_date = Date.parse(json['daily']["sunrise"]);
                let sunset_date = Date.parse(json['daily']["sunset"]);
                if(current_date < sunset_date)
                {   
                    
                    if(current_date < sunrise_date)
                    {
                        day_part = "night"
                    }
                    else
                    {
                        day_part = "day"
                    }
                }
                else
                {
                    day_part = "night"
                }
            }
            else
            {
                day_part = "day"
            }

            

            let wmo_code = 
            {
                0: {"name": "clear sky", "icon": "static/images/icons/"+day_part+"/clear_sky.png"},
                1: {"name": "mainly clear", "icon": "static/images/icons/"+day_part+"/mainly_clear.png"},
                2: {"name": "partly cloudy", "icon": "static/images/icons/"+day_part+"/partly_cloudy.png"},
                3: {"name": "overcast", "icon": "static/images/icons/"+day_part+"/overcast.png"},
                45: {"name": "fog", "icon": "static/images/icons/"+day_part+"/fog.png"},
                48: {"name": "rime fog", "icon": "static/images/icons/"+day_part+"/rime_fog.png"},
                51: {"name": "light drizzle", "icon": "static/images/icons/"+day_part+"/drizzle.png"},
                53: {"name": "moderate drizzle", "icon": "static/images/icons/"+day_part+"/drizzle.png"},
                55: {"name": "dense drizzle", "icon": "static/images/icons/"+day_part+"/drizzle.png"},
                56: {"name": "light freezing drizzle", "icon": "static/images/icons/"+day_part+"/drizzle.png"},
                57: {"name": "dense freezing drizzle", "icon": "static/images/icons/"+day_part+"/drizzle.png"},
                61: {"name": "slight rain", "icon": "static/images/icons/"+day_part+"/slight_rain.png"},
                63: {"name": "moderate rain", "icon": "static/images/icons/"+day_part+"/moderate_rain.png"},
                65: {"name": "heavy rain", "icon": "static/images/icons/"+day_part+"/heavy_rain.png"},
                66: {"name": "light freezing rain", "icon": "static/images/icons/"+day_part+"/slight_freezing_rain.png"},
                67: {"name": "dense freezing rain", "icon": "static/images/icons/"+day_part+"/heavy_freezing_rain.png"},
                71: {"name": "slight snow fall", "icon": "static/images/icons/"+day_part+"/light_snow_fall.png"},
                73: {"name": "moderate snow fall", "icon": "static/images/icons/"+day_part+"/moderate_snow_fall.png"},
                75: {"name": "heavy snow fall", "icon": "static/images/icons/"+day_part+"/heavy_snow_fall.png"},
                77: {"name": "snow grains", "icon": "static/images/icons/"+day_part+"/snow_grains.png"},
                80: {"name": "slight rain shower", "icon": "static/images/icons/"+day_part+"/rain_shower.png"},
                81: {"name": "moderate rain shower", "icon": "static/images/icons/"+day_part+"/rain_shower.png"},
                82: {"name": "violent rain shower", "icon": "static/images/icons/"+day_part+"/rain_shower.png"},
                85: {"name": "light snow shower", "icon": "static/images/icons/"+day_part+"/slight_snow_shower.png"},
                86: {"name": "violent snow shower", "icon": "static/images/icons/"+day_part+"/heavy_snow_shower.png"},
                95: {"name": "thunderstorm", "icon": "static/images/icons/"+day_part+"/thunderstorm.png"},
                96: {"name": "thunderstorm with slight hail", "icon": "static/images/icons/"+day_part+"/thunderstorm.png"},
                99: {"name": "thunderstorm with heavy hail", "icon": "static/images/icons/"+day_part+"/thunderstorm.png"}
            }

            let time = json[unit]["time"][i];
            let code = json[unit]["weathercode"][i];
            let temperature = json[unit][temp_unit][i];

            let div = document.createElement("div");
            div.classList.add("simple_container")

            let time_p = document.createElement("p");
            time_p.innerHTML = time.substring(substring_amount);
            time_p.classList.add("simple_container_time")


            let code_p = document.createElement("p");
            code_p.innerHTML = wmo_code[parseInt(code)]["name"];
            code_p.classList.add("simple_container_code")

            let temperature_p = document.createElement("p");
            temperature_p.innerHTML = temperature + "<span style='opacity:0.6;'>°C</span>";
            temperature_p.classList.add("simple_container_temperature")

            let icon_div = document.createElement("div");
            icon_div.innerHTML = "<img src='"+wmo_code[parseInt(code)]["icon"]+"' alt='' />";
            icon_div.classList.add("simple_container_icon")

            div.appendChild(time_p);
            div.appendChild(code_p);
            div.appendChild(temperature_p);
            div.appendChild(icon_div);

            container.appendChild(div);
        }

    }

    display_meteo(response)
    {
        let json = JSON.parse(response);
        console.log(json);



        let amount = Object.keys(json["hourly"]["time"]).length;

        let cut_start = 0;
        let cut_end = 0;

        if(amount <= 24)
        {
            cut_start = 11;
            cut_end = 0;
        }
        else if(amount <= 24*4)
        {
            cut_start = 8;
            cut_end = 3;
        }
        else
        {
            cut_start = 5;
            cut_end = 6;
        }

        for (const [key, value] of Object.entries(json["hourly"]["time"])) {
          json["hourly"]["time"][key] = value.toString().substring(cut_start, value.toString().length-cut_end);
          json["hourly"]["time"][key] = json["hourly"]["time"][key].replace("T", " H");
        }





        let charts_amount = 0;

        if(meteo.includes("temperature_2m") && meteo.includes("apparent_temperature"))
        {
            charts_amount += 1;
        }

        if(meteo.includes("pressure_msl"))
        {
            charts_amount += 1;
        }

        if(meteo.includes("relativehumidity_2m") && meteo.includes("rain"))
        {
            charts_amount += 1;
        }

        if(meteo.includes("windspeed_10m") && meteo.includes("winddirection_10m"))
        {
            charts_amount += 1;
        }

        if(meteo.includes("cloudcover") && meteo.includes("cloudcover_low") && meteo.includes("cloudcover_mid") && meteo.includes("cloudcover_high"))
        {
            charts_amount += 1;
        }

        let size = 80 / charts_amount;

        if(charts_amount == 5)
        {
            size = 15;
        }
        if(charts_amount == 4)
        {
            size = 20;
        }
        if(charts_amount == 3)
        {
            size = 27;
        }
        if(charts_amount == 2)
        {
            size = 42;
        }
        if(charts_amount == 1)
        {
            size = 80;
        }

        console.log("active charts: " + charts_amount + "     size per chart: " + size);


        if(meteo.includes("temperature_2m") && meteo.includes("apparent_temperature"))
        {
            document.getElementById('temperature_label').style.display = "block";
            let ctx = document.getElementById('temperature_chart');
            let dim = (size.toString()/100 * document.documentElement.clientHeight)
            ctx.height = dim;

            const chartAreaBorder = {
              id: 'chartAreaBorder',
              beforeDraw(chart, args, options) {
                const {ctx, chartArea: {left, top, width, height}} = chart;
                ctx.save();
                ctx.strokeStyle = options.borderColor;
                ctx.lineWidth = options.borderWidth;
                ctx.setLineDash(options.borderDash || []);
                ctx.lineDashOffset = options.borderDashOffset;
                ctx.strokeRect(left, top, width, height);
                ctx.restore();
              }
            };

            let chart = new Chart(ctx,
            {
                type: 'line',
                data:
                {
                    labels: json["hourly"]["time"],
                    datasets:
                    [
                        {
                            label: 'real',
                            data: json["hourly"]["temperature_2m"],
                            borderWidth: 3,
                            borderColor: '#f78d9b',
                            backgroundColor: '#f78d9b',
                        },
                        {
                            label: 'apparent',
                            data: json["hourly"]["apparent_temperature"],
                            borderWidth: 2,
                            borderColor: '#8da8f7',
                            backgroundColor: '#8da8f7',
                        }
                    ]
                },
                options:
                {
                    responsive: false,
                    maintainAspectRatio: false,
                    tooltips:
                    {
                        enabled: false
                    },
                    hover:
                    {
                        mode: null
                    },
                    events:
                    [

                    ],
                    plugins:
                    {
                        legend:
                        {
                            labels:
                            {
                                color: '#e0aaff'
                            }
                        },
                        chartAreaBorder:
                        {
                            borderColor: '#e0aaff',
                            borderWidth: 2,
                        }
                    },
                    scales:
                    {
                        x:
                        {
                            beginAtZero: false,
                            ticks:
                            {
                                color: '#e0aaff',
                                beginAtZero: false
                            },
                            grid:
                            {
                                display: true,
                                drawOnChartArea: true,
                                drawTicks: true,
                                color: "rgba(224, 170, 255, 0.5)",
                            },
                            border:
                            {
                                dash: [2,4],
                            }
                        },
                        y:
                        {
                            beginAtZero: true,
                            ticks:
                            {
                                color: '#e0aaff',
                                beginAtZero: true,
                                callback: function(value, index, ticks)
                                {
                                    return value+"°C";
                                }
                            },
                            grid:
                            {
                                display: true,
                                drawOnChartArea: true,
                                drawTicks: true,
                                color: "rgba(224, 170, 255, 0.5)",

                            },
                            border:
                            {
                                dash: [2,4],
                            }
                        }
                    },
                    elements:
                    {
                        point:
                        {
                            radius: 0
                        }
                    }
                },
                plugins: [chartAreaBorder]
            }
            
            );

            meteo.charts.push(chart);

        }else
        {
            document.getElementById('temperature_label').style.display = "none";
        }

        if(meteo.includes("pressure_msl"))
        {
            document.getElementById('pressure_label').style.display = "block";
            let ctx = document.getElementById('pressure_chart');
            let dim = (size.toString()/100 * document.documentElement.clientHeight)
            ctx.height = dim;

            const chartAreaBorder = {
              id: 'chartAreaBorder',
              beforeDraw(chart, args, options) {
                const {ctx, chartArea: {left, top, width, height}} = chart;
                ctx.save();
                ctx.strokeStyle = options.borderColor;
                ctx.lineWidth = options.borderWidth;
                ctx.setLineDash(options.borderDash || []);
                ctx.lineDashOffset = options.borderDashOffset;
                ctx.strokeRect(left, top, width, height);
                ctx.restore();
              }
            };

            let width, height, gradient;
            function getGradient(ctx, chartArea) {
              const chartWidth = chartArea.right - chartArea.left;
              const chartHeight = chartArea.bottom - chartArea.top;
              if (!gradient || width !== chartWidth || height !== chartHeight) {
                // Create the gradient because this is either the first render
                // or the size of the chart has changed
                width = chartWidth;
                height = chartHeight;
                gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                gradient.addColorStop(0, '#03a7f8');
                gradient.addColorStop(0.3, '#4cf902');
                gradient.addColorStop(0.5, '#eba60a');
                gradient.addColorStop(0.7, '#eb550a');
                gradient.addColorStop(0.9, '#eb100a');
                gradient.addColorStop(1, '#510a19');
              }

              return gradient;
            }

            let chart1 = new Chart(ctx,
            {
                type: 'line',
                data:
                {
                    labels: json["hourly"]["time"],
                    datasets:
                    [
                        {
                            label: 'pressure',
                            data: json["hourly"]["pressure_msl"],
                            borderWidth: 5,
                            borderColor: function(context) {
                                const chart = context.chart;
                                const {ctx, chartArea} = chart;

                                if (!chartArea) {
                                  // This case happens on initial chart load
                                  return;
                                }
                                return getGradient(ctx, chartArea);
                              },
                            fill: false,
                        },
                    ]
                },
                options:
                {
                    responsive: false,
                    maintainAspectRatio: false,
                    tooltips:
                    {
                        enabled: false
                    },
                    hover:
                    {
                        mode: null
                    },
                    events:
                    [

                    ],
                    plugins:
                    {
                        legend:
                        {
                            labels:
                            {
                                color: '#e0aaff'
                            },
                            display: false
                        },
                        chartAreaBorder:
                        {
                            borderColor: '#e0aaff',
                            borderWidth: 2,
                        }
                    },
                    scales:
                    {
                        x:
                        {
                            beginAtZero: false,
                            ticks:
                            {
                                color: '#e0aaff',
                                beginAtZero: false
                            },
                            grid:
                            {
                                display: true,
                                drawOnChartArea: true,
                                drawTicks: true,
                                color: "rgba(224, 170, 255, 0.5)",
                            },
                            border:
                            {
                                dash: [2,4],
                            }
                        },
                        y:
                        {
                            min:990,
                            max:1035,
                            beginAtZero: false,
                            ticks:
                            {
                                color: '#e0aaff',
                                beginAtZero: false,
                                callback: function(value, index, ticks)
                                {
                                    return value+" hPa";
                                }
                            },
                            grid:
                            {
                                display: true,
                                drawOnChartArea: true,
                                drawTicks: true,
                                color: "rgba(224, 170, 255, 0.5)",

                            },
                            border:
                            {
                                dash: [2,4],
                            }
                        }
                    },
                    y1:
                    {
                        min:750,
                        max:775,
                        beginAtZero: false,
                        ticks:
                        {
                            color: '#e0aaff',
                            beginAtZero: false,
                            callback: function(value, index, ticks)
                            {
                                return value+" mm";
                            }
                        },
                    },
                    elements:
                    {
                        point:
                        {
                            radius: 0
                        }
                    }
                },
                plugins: [chartAreaBorder]
            }
            );

            meteo.charts.push(chart1);
        }
        else
        {
            document.getElementById('pressure_label').style.display = "none";
        }

        if(meteo.includes("relativehumidity_2m") && meteo.includes("rain"))
        {
            document.getElementById('humidity_label').style.display = "block";
            let ctx = document.getElementById('humidity_chart');
            let dim = (size.toString()/100 * document.documentElement.clientHeight)
            ctx.height = dim;

            const chartAreaBorder = {
              id: 'chartAreaBorder',
              beforeDraw(chart, args, options) {
                const {ctx, chartArea: {left, top, width, height}} = chart;
                ctx.save();
                ctx.strokeStyle = options.borderColor;
                ctx.lineWidth = options.borderWidth;
                ctx.setLineDash(options.borderDash || []);
                ctx.lineDashOffset = options.borderDashOffset;
                ctx.strokeRect(left, top, width, height);
                ctx.restore();
              }
            };

            let chart2 = new Chart(ctx,
            {
                type: 'line',
                data:
                {
                    labels: json["hourly"]["time"],
                    datasets:
                    [
                        {
                            label: 'humidity',
                            data: json["hourly"]["relativehumidity_2m"],
                            borderWidth: 3,
                            borderColor: '#3cde5c',
                            backgroundColor: '#3cde5c',
                            yAxisID: 'y',
                        },
                        {
                            label: 'rain',
                            data: json["hourly"]["rain"],
                            borderWidth: 2,
                            borderColor: '#2583e8',
                            backgroundColor: '#2583e8',
                            fill: true,
                            yAxisID: 'y1',
                        }
                    ]
                },
                options:
                {
                    responsive: false,
                    maintainAspectRatio: false,
                    tooltips:
                    {
                        enabled: false
                    },
                    hover:
                    {
                        mode: null
                    },
                    events:
                    [

                    ],
                    plugins:
                    {
                        legend:
                        {
                            labels:
                            {
                                color: '#e0aaff'
                            }
                        },
                        chartAreaBorder:
                        {
                            borderColor: '#e0aaff',
                            borderWidth: 2,
                        }
                    },
                    scales:
                    {
                        x:
                        {
                            beginAtZero: false,
                            ticks:
                            {
                                color: '#e0aaff',
                                beginAtZero: false
                            },
                            grid:
                            {
                                display: true,
                                drawOnChartArea: true,
                                drawTicks: true,
                                color: "rgba(224, 170, 255, 0.5)",
                            },
                            border:
                            {
                                dash: [2,4],
                            }
                        },
                        y:
                        {
                            beginAtZero: true,
                            ticks:
                            {
                                color: '#e0aaff',
                                beginAtZero: true,
                                callback: function(value, index, ticks)
                                {
                                    return value+"%";
                                }
                            },
                            grid:
                            {
                                display: true,
                                drawOnChartArea: true,
                                drawTicks: true,
                                color: "rgba(224, 170, 255, 0.5)",

                            },
                            border:
                            {
                                dash: [2,4],
                            }
                        },
                        y1:
                        {
                            min: 0,
                            max: 10,
                            position: 'right',
                            beginAtZero: true,
                            ticks:
                            {
                                color: '#e0aaff',
                                beginAtZero: true,
                                callback: function(value, index, ticks)
                                {
                                    return value+"mm";
                                }
                            },
                            border:
                            {
                                dash: [2,4],
                            }
                        }
                    },
                    elements:
                    {
                        point:
                        {
                            radius: 0
                        }
                    }
                },
                plugins: [chartAreaBorder]
            }
            );

            meteo.charts.push(chart2);
        }
        else
        {
            document.getElementById('humidity_label').style.display = "none";
        }

        if(meteo.includes("windspeed_10m") && meteo.includes("winddirection_10m"))
        {
            document.getElementById('wind_label').style.display = "block";
            let ctx = document.getElementById('wind_chart');
            let dim = (size.toString()/100 * document.documentElement.clientHeight)
            ctx.height = dim;

            const chartAreaBorder = {
              id: 'chartAreaBorder',
              beforeDraw(chart, args, options) {
                const {ctx, chartArea: {left, top, width, height}} = chart;
                ctx.save();
                ctx.strokeStyle = options.borderColor;
                ctx.lineWidth = options.borderWidth;
                ctx.setLineDash(options.borderDash || []);
                ctx.lineDashOffset = options.borderDashOffset;
                ctx.strokeRect(left, top, width, height);
                ctx.restore();
              }
            };


            var floor = Math.floor,
                abs = Math.abs;
            function largestTriangleThreeBuckets(data, threshold) {

                var data_length = data.length;
                if (threshold >= data_length || threshold === 0) {
                    return data; // Nothing to do
                }

                var sampled = [],
                    sampled_index = 0;

                // Bucket size. Leave room for start and end data points
                var every = (data_length - 2) / (threshold - 2);

                var a = 0,  // Initially a is the first point in the triangle
                    max_area_point,
                    max_area,
                    area,
                    next_a;

                sampled[ sampled_index++ ] = data[ a ]; // Always add the first point

                for (var i = 0; i < threshold - 2; i++) {

                    // Calculate point average for next bucket (containing c)
                    var avg_x = 0,
                        avg_y = 0,
                        avg_range_start  = floor( ( i + 1 ) * every ) + 1,
                        avg_range_end    = floor( ( i + 2 ) * every ) + 1;
                    avg_range_end = avg_range_end < data_length ? avg_range_end : data_length;

                    var avg_range_length = avg_range_end - avg_range_start;

                    for ( ; avg_range_start<avg_range_end; avg_range_start++ ) {
                      avg_x += data[ avg_range_start ][ 0 ] * 1; // * 1 enforces Number (value may be Date)
                      avg_y += data[ avg_range_start ][ 1 ] * 1;
                    }
                    avg_x /= avg_range_length;
                    avg_y /= avg_range_length;

                    // Get the range for this bucket
                    var range_offs = floor( (i + 0) * every ) + 1,
                        range_to   = floor( (i + 1) * every ) + 1;

                    // Point a
                    var point_a_x = data[ a ][ 0 ] * 1, // enforce Number (value may be Date)
                        point_a_y = data[ a ][ 1 ] * 1;

                    max_area = area = -1;

                    for ( ; range_offs < range_to; range_offs++ ) {
                        // Calculate triangle area over three buckets
                        area = abs( ( point_a_x - avg_x ) * ( data[ range_offs ][ 1 ] - point_a_y ) -
                                    ( point_a_x - data[ range_offs ][ 0 ] ) * ( avg_y - point_a_y )
                                  ) * 0.5;
                        if ( area > max_area ) {
                            max_area = area;
                            max_area_point = data[ range_offs ];
                            next_a = range_offs; // Next a is this b
                        }
                    }

                    sampled[ sampled_index++ ] = max_area_point; // Pick this point from the bucket
                    a = next_a; // This a is the next a (chosen b)
                }

                sampled[ sampled_index++ ] = data[ data_length - 1 ]; // Always add last

                return sampled;
            }

            let wind_speed = json["hourly"]["windspeed_10m"];
            let wind_dir = json["hourly"]["winddirection_10m"];
            let wind_labels = json["hourly"]["time"];

            function pack(first)
            {
                let output = [];
                let count = 0;
                for (const key in first)
                {
                    output.push([count, first[key]]);
                    count+=1;
                }
                return output;
            }

            let wind_pack =  largestTriangleThreeBuckets(pack(wind_speed), 20);
            let wind_pack_dir =  largestTriangleThreeBuckets(pack(wind_dir), 20);

            console.log(wind_pack)
            console.log(wind_pack_dir)

            function unpackArray(array) {
              const x = [];
              const y = [];

              for (let i = 0; i < array.length; i++) {
                const item = array[i];
                const valueX = item[0];
                const valueY = item[1];

                x.push(valueX);
                y.push(valueY);
              }

              return { x, y };
            }


            function unpackArray1(array) {
              const x1 = [];
              const y1 = [];

              for (let i = 0; i < array.length; i++) {
                const item = array[i];
                const valueX = item[0];
                const valueY = item[1];

                x1.push(valueX);
                y1.push(valueY);
              }

              return { x1, y1 };
            }


            const { x, y } = unpackArray(wind_pack);


            let x_val = x;
            let y_val = y;

            const { x1, y1 } = unpackArray1(wind_pack_dir);

            let dir_val = y1;

            function map_range(value, low1, high1, low2, high2) {
                return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
            }

            x_val.forEach(function (value, i) {
                let remapped = Math.floor(map_range(i, 0, Object.keys(x_val).length, 0, Object.keys(wind_labels).length));
                x_val[i] = wind_labels[remapped];
            });


            console.log(x_val);
            console.log(y_val);
            console.log(dir_val);

            const arrow = new Image();
            arrow.src = "static/images/arrow.png";

            let chart3 = new Chart(ctx,
            {
                type: 'line',
                data:
                {
                    labels: x_val,
                    datasets:
                    [
                        {
                            label: 'wind speed',
                            data: y_val,
                            borderWidth: 0,
                            borderColor: '#e6a91c',
                            backgroundColor: '#e6a91c',
                            yAxisID: 'y',
                            pointStyle: arrow,
                            pointRotation: dir_val,
                            pointRadius: 7
                        }
                    ]
                },
                options:
                {
                    responsive: false,
                    maintainAspectRatio: false,
                    tooltips:
                    {
                        enabled: false
                    },
                    hover:
                    {
                        mode: null
                    },
                    events:
                    [

                    ],
                    plugins:
                    {
                        legend:
                        {
                            labels:
                            {
                                color: '#e0aaff'
                            },
                            display: false
                        },
                        chartAreaBorder:
                        {
                            borderColor: '#e0aaff',
                            borderWidth: 2,
                        }
                    },
                    scales:
                    {
                        x:
                        {
                            beginAtZero: false,
                            ticks:
                            {
                                color: '#e0aaff',
                                beginAtZero: false
                            },
                            grid:
                            {
                                display: true,
                                drawOnChartArea: true,
                                drawTicks: true,
                                color: "rgba(224, 170, 255, 0.5)",
                            },
                            border:
                            {
                                dash: [2,4],
                            }
                        },
                        y:
                        {
                            beginAtZero: true,
                            ticks:
                            {
                                color: '#e0aaff',
                                beginAtZero: true,
                                callback: function(value, index, ticks)
                                {
                                    return value+" km/h";
                                }
                            },
                            grid:
                            {
                                display: true,
                                drawOnChartArea: true,
                                drawTicks: true,
                                color: "rgba(224, 170, 255, 0.5)",

                            },
                            border:
                            {
                                dash: [2,4],
                            }
                        }
                    },
                    elements:
                    {
                        point:
                        {
                            borderWidth: 1,
                            borderColor: 'black',
                            hitRadius: 5,
                            hoverRadius: 5,
                            radius: 5
                        }
                    }
                },
                plugins:
                [
                    chartAreaBorder
                ]
            }
            );

            meteo.charts.push(chart3);
        }else
        {
            document.getElementById('wind_label').style.display = "none";
        }

        if(meteo.includes("cloudcover") && meteo.includes("cloudcover_low") && meteo.includes("cloudcover_mid") && meteo.includes("cloudcover_high"))
        {
            document.getElementById('cloud_label').style.display = "block";
            let ctx = document.getElementById('cloud_chart');
            let dim = (size.toString()/100 * document.documentElement.clientHeight)
            ctx.height = dim;

            const chartAreaBorder = {
              id: 'chartAreaBorder',
              beforeDraw(chart, args, options) {
                const {ctx, chartArea: {left, top, width, height}} = chart;
                ctx.save();
                ctx.strokeStyle = options.borderColor;
                ctx.lineWidth = options.borderWidth;
                ctx.setLineDash(options.borderDash || []);
                ctx.lineDashOffset = options.borderDashOffset;
                ctx.strokeRect(left, top, width, height);
                ctx.restore();
              }
            };

            let width, height, gradient;
            function getGradient(ctx, chartArea) {
              const chartWidth = chartArea.right - chartArea.left;
              const chartHeight = chartArea.bottom - chartArea.top;
              if (!gradient || width !== chartWidth || height !== chartHeight) {
                // Create the gradient because this is either the first render
                // or the size of the chart has changed
                width = chartWidth;
                height = chartHeight;
                gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                gradient.addColorStop(0, '#03a7f8');
                gradient.addColorStop(0.3, '#4cf902');
                gradient.addColorStop(0.5, '#eba60a');
                gradient.addColorStop(0.7, '#eb550a');
                gradient.addColorStop(0.9, '#eb100a');
                gradient.addColorStop(1, '#510a19');
              }

              return gradient;
            }

            let chart4 = new Chart(ctx,
            {
                type: 'line',
                data:
                {
                    labels: json["hourly"]["time"],
                    datasets:
                    [
                        {
                            label: 'low',
                            data: json["hourly"]["cloudcover_low"],
                            borderWidth: 5,
                            borderColor: "#0f0f0f",
                            backgroundColor: "#0f0f0f",
                            fill: true,
                        },
                        {
                            label: 'mid',
                            data: json["hourly"]["cloudcover_mid"],
                            borderWidth: 5,
                            borderColor: "#363535",
                            backgroundColor: "#363535",
                            fill: true,
                        },
                        {
                            label: 'high',
                            data: json["hourly"]["cloudcover_high"],
                            borderWidth: 5,
                            borderColor: "#d4d4d4",
                            backgroundColor: "#d4d4d4",
                            fill: true,
                        },
                    ]
                },
                options:
                {
                    responsive: false,
                    maintainAspectRatio: false,
                    tooltips:
                    {
                        enabled: false
                    },
                    hover:
                    {
                        mode: null
                    },
                    events:
                    [

                    ],
                    plugins:
                    {
                        legend:
                        {
                            labels:
                            {
                                color: '#e0aaff'
                            },
                            display: true
                        },
                        chartAreaBorder:
                        {
                            borderColor: '#e0aaff',
                            borderWidth: 2,
                        }
                    },
                    scales:
                    {
                        x:
                        {
                            beginAtZero: false,
                            ticks:
                            {
                                color: '#e0aaff',
                                beginAtZero: false
                            },
                            grid:
                            {
                                display: true,
                                drawOnChartArea: true,
                                drawTicks: true,
                                color: "rgba(224, 170, 255, 0.5)",
                            },
                            border:
                            {
                                dash: [2,4],
                            }
                        },
                        y:
                        {
                            min:0,
                            max:100,
                            beginAtZero: false,
                            ticks:
                            {
                                color: '#e0aaff',
                                beginAtZero: false,
                                callback: function(value, index, ticks)
                                {
                                    return value+"%";
                                }
                            },
                            grid:
                            {
                                display: true,
                                drawOnChartArea: true,
                                drawTicks: true,
                                color: "rgba(224, 170, 255, 0.5)",

                            },
                            border:
                            {
                                dash: [2,4],
                            }
                        }
                    },
                    elements:
                    {
                        point:
                        {
                            radius: 0
                        }
                    }
                },
                plugins: [chartAreaBorder]
            }
            );

            meteo.charts.push(chart4);
        }
        else
        {
            document.getElementById('cloud_label').style.display = "none";
        }

        document.getElementById("settings_container").style.display = "none";
        document.getElementById("meteo_container").style.display = "block";
        document.getElementById("meteo_simple_container").style.display = "none";

        let element = document.getElementById("transition");
        element.classList.remove("transition_animate");
        element.classList.add("transition_hidden");

        let element1 = document.getElementById("clouds");
        element1.classList.remove("clouds_animate");
        element1.classList.add("clouds_hidden");


    }


    prognose(value)
    {
        this.check_forecast_selection();

        let element = document.getElementById("transition");
        element.classList.remove("transition_hidden");
        element.classList.add("transition_animate");

        let element1 = document.getElementById("clouds");
        element1.classList.remove("clouds_hidden");
        element1.classList.add("clouds_animate");

        let info = document.getElementById("transition-info");

        if(this.lat == 0 || this.lon == 0 || this.timezone == "")
        {
            info.innerHTML = "city is not selected!";
            document.getElementById("transition-button").style.display = "block";
        }
        else if(this.parameters == "")
        {

            document.getElementById("transition-button").style.display = "block";
        }else
        {
            info.innerHTML = "your prognose is loading";
            document.getElementById("transition-button").style.display = "none";
            
            if(value == "advanced")
            {
                let url_base = "https://api.open-meteo.com/v1/forecast?";
                let url_pos = "latitude="+this.lat+"&longitude="+this.lon;
                let url_params = "&hourly="+this.parameters;
                let url_time = "&forecast_days=" + this.time.toString();
                let url_timezone = "&timezone=" + this.timezone;

                let url = url_base + url_pos + url_params + url_time + url_timezone

                console.log(url)
                setTimeout(this.get, 5000, url, this.display_meteo);
            }
            else if(value == "simple")
            {

                let url = "";

                if(this.time == 1)
                {
                    let code = "hourly"
                    let url_base = "https://api.open-meteo.com/v1/forecast?";
                    let url_pos = "latitude="+this.lat+"&longitude="+this.lon;
                    let url_params = "&"+code+"="+"weathercode,temperature_2m&daily=sunrise,sunset";
                    let url_time = "&forecast_days=" + this.time.toString();
                    let url_timezone = "&timezone=" + this.timezone;
                    url = url_base + url_pos + url_params + url_time + url_timezone
                }
                else
                {
                    let code = "daily"
                    let url_base = "https://api.open-meteo.com/v1/forecast?";
                    let url_pos = "latitude="+this.lat+"&longitude="+this.lon;
                    let url_params = "&"+code+"="+"weathercode,temperature_2m_max";
                    let url_time = "&forecast_days=" + this.time.toString();
                    let url_timezone = "&timezone=" + this.timezone;
                    url = url_base + url_pos + url_params + url_time + url_timezone
                }
                
                

                

                console.log(url)
                setTimeout(this.get, 5000, url, this.display_simple_meteo);
            }else
            {
                console.error("prognose not implemented!")
            }

        }
    }



    check_forecast_selection()
    {
        let objects = Array.prototype.slice.call(document.getElementsByClassName("forecast_option_button"));
        let param = ""
        objects.forEach(function(element)
        {
            let value = element.dataset.value;
            param += value;
        });

        param = param.substring(1);
        this.parameters = param;
    }

    select_forecast(element)
    {
        if(element.dataset.selected == "true")
        {
            element.classList.remove("forecast_option_button");
            element.classList.add("forecast_option_button_inactive");
            element.dataset.selected = "false";
            this.check_forecast_selection();

        }else
        {
            element.classList.add("forecast_option_button");
            element.classList.remove("forecast_option_button_inactive");
            element.dataset.selected = "true";
            this.check_forecast_selection();
        }

    }

    select_time(element, value)
    {
        let buttons = Array.prototype.slice.call(document.getElementsByClassName("time_select_button"));
        buttons.forEach(element => element.classList.remove("time_select_button"));
        buttons.forEach(element => element.classList.add("time_select_button_inactive"));
        element.classList.remove("time_select_button_inactive");
        element.classList.add("time_select_button");

        console.log("selected time to " + value + " days")
        this.time = value;
    }

    deselect_city(element)
    {
        console.log("deselected city!")
        let input = document.getElementById("search_input");
        this.lat = 0;
        this.lon = 0;
        this.timezone = "";
        input.focus();
        input.select();
        element.style.display = "none";
    }

    select_city(element)
    {

        let container = document.getElementById("city_select_container");
        let input = document.getElementById("search_input");
        input.value = "";
        let selected_city = document.getElementById("selected_city");
        selected_city.style.display = "block";
        let rect = input.getBoundingClientRect();
        selected_city.style.width = rect.width.toString()+"px";
        selected_city.style.height = rect.height.toString()+"px";
        selected_city.innerHTML = "<img src='https://open-meteo.com/images/country-flags/"+element.dataset.country_code+".svg' /><p><span class='selected_city_name'>"+element.dataset.name+"</span><span class='selected_city_pos'>"+element.dataset.latitude+" "+element.dataset.longitude+"</span></p>"
        this.lat = element.dataset.latitude;
        this.lon = element.dataset.longitude;
        this.timezone = element.dataset.timezone;
        container.style.display = "none";
        console.log("selected city: " + element.dataset.name)
        
        let text = document.getElementsByClassName("selected_city_name")[0];
        text.style.fontSize = (7-(0.3*(element.dataset.name.length))).toString() + "vw";
    }


    search_result(result)
    {
        let json = JSON.parse(result);

        let container = document.getElementById("city_select_container");

        if("results" in json)
        {
            container.style.display = "block";
            container.innerHTML = "";

            for (var i = 0; i < json["results"].length; i++)
            {
              var obj = json["results"][i];

              let element = document.createElement("button");
              element.classList.add("city_select_button");
              element.onclick = function() { meteo.select_city(element); }
              element.innerHTML = "<img src='https://open-meteo.com/images/country-flags/"+obj["country_code"]+".svg' /><p><span class='city_name'>"+obj["name"]+"</span><span class='city_place'>"+obj["latitude"]+" "+obj["longitude"]+"</span></p>"
              element.dataset.name = obj["name"];
              element.dataset.latitude = obj["latitude"];
              element.dataset.longitude = obj["longitude"]
              element.dataset.country_code = obj["country_code"]
              element.dataset.timezone = obj["timezone"]
              container.appendChild(element);
            }
        }
        else
        {
            console.log("no results!")
            container.style.display = "none";
        }


    }

    search(element)
    {
        let value = element.value;
        console.log(value);
        this.get("https://geocoding-api.open-meteo.com/v1/search?name=" + value.toString(), this.search_result);
    }
}

