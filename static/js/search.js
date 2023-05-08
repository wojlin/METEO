

class Meteo
{
    constructor()
    {
        this.lat = 0;
        this.lon = 0;
        this.timezone = "";
        this.time = 1;
        this.parameters = "";
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

            new Chart(ctx,
            {
                type: 'line',
                data:
                {
                    labels: json["hourly"]["time"],
                    datasets:
                    [
                        {
                            label: 'temperature',
                            data: json["hourly"]["temperature_2m"],
                            borderWidth: 3,
                            borderColor: '#f78d9b',
                            backgroundColor: '#f78d9b',
                        },
                        {
                            label: 'apparent temperature',
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

            new Chart(ctx,
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

            new Chart(ctx,
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
        }



        document.getElementById("settings_container").style.display = "none";
        document.getElementById("meteo_container").style.display = "block";
        let element = document.getElementById("transition");
        element.classList.remove("transition_animate");
        element.classList.add("transition_hidden");

        let element1 = document.getElementById("clouds");
        element1.classList.remove("clouds_animate");
        element1.classList.add("clouds_hidden");


    }

    prognose()
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

            let url_base = "https://api.open-meteo.com/v1/forecast?";
            let url_pos = "latitude="+this.lat+"&longitude="+this.lon;
            let url_params = "&hourly="+this.parameters;
            let url_time = "&forecast_days=" + this.time.toString();
            let url_timezone = "&timezone=" + this.timezone;

            let url = url_base + url_pos + url_params + url_time + url_timezone

            console.log(url)
            setTimeout(this.get, 5000, url, this.display_meteo);

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

