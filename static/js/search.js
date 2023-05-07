

class Meteo
{
    constructor()
    {
        this.lat = 0;
        this.lon = 0;
        this.time = 0;
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

    select_time(element, value)
    {
        let buttons = Array.prototype.slice.call(document.getElementsByClassName("time_select_button"));
        buttons.forEach(element => element.style.opacity = 1.0);
        element.style.opacity = 0.4;

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

