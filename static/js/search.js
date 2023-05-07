function get(url, callback)
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

function deselect_city(element)
{
    console.log("deselected city!")
    let input = document.getElementById("search_input");
    input.focus();
    input.select();
    element.style.display = "none";
}

function select_city(element)
{
    console.log("selected city!")
    let container = document.getElementById("city_select_container");
    console.log(element)
    let input = document.getElementById("search_input");
    input.value = "";
    let selected_city = document.getElementById("selected_city");
    console.log(selected_city)
    selected_city.style.display = "block";
    let rect = input.getBoundingClientRect();
    selected_city.style.width = rect.width.toString()+"px";
    selected_city.style.height = rect.height.toString()+"px";
    selected_city.innerHTML = "<p><span class='selected_city_name'>"+element.dataset.name+"</span><span class='selected_city_pos'>"+element.dataset.latitude+" "+element.dataset.longitude+"</span></p>"
    container.style.display = "none";
}


function search_result(result)
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
          element.onclick = function() { select_city(element); }
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

function search(element)
{
    let value = element.value;
    console.log(value);
    get("https://geocoding-api.open-meteo.com/v1/search?name=" + value.toString(), search_result);
}