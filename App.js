const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const { time } = require('console');

app.use(express.urlencoded({ extended: true }))

const transport_details = {
    "Evolve Bamboo GTR 2in1": {"speed":24, "range": 31, "image": "/images/evolve.jpeg"},
    "MotoTec Skateboard": {"speed":22, "range": 10, "image": "/images/mototec.jpeg"},
    "OneWheel XR": {"speed":19, "range": 18, "image": "/images/onewheel.jpeg"},
    "Boosted Mini S Board": {"speed":18, "range": 7, "image": "/images/boostedmini.jpeg"},
    "GeoBlade 500": {"speed":15, "range": 8, "image": "/images/geoblade.jpeg"},
    "Segway Ninebot S-PLUS": {"speed":12, "range": 22, "image": "/images/segwaysplus.jpeg"},
    "Segway Ninebot S": {"speed":10, "range": 13, "image": "/images/segways.jpeg"},
    "Hovertrax Hoverboard": {"speed":9, "range": 6, "image": "/images/hovertrax.jpeg"},
    "Walking": {"speed":3.1, "range":30, "image": "/images/walking.png"},
};


//specify that we want to run our website on 'http://localhost:8000/'
const host = 'localhost';
const port = 8000;

var publicPath = path.join(__dirname, 'public'); //get the path to use our "public" folder where we stored our html, css, images, etc
app.use(express.static(publicPath));  //tell express to use that folder
app.set('view engine', 'ejs'); // set the view engine to ejs


function formatHours(hours) {
    var date = new Date(hours * 3600 * 1000)
    var hours = date.getUTCHours()
    var minutes = date.getUTCMinutes()
    var seconds = date.getUTCSeconds()

    var addZero = function(val){
        if(val < 10){
            return "0" + val.toString()
        }
        return val.toString()
    }


    return addZero(hours) + ":" + addZero(minutes) + ":" + addZero(seconds)
}


app.get("/", function (req, res) {
    res.render("index", {
        "selected": false
    });
});

function distance_computation(req){
    var transportName = req.body['distance-picker']
    var info = {}
    var distance = req.body.distance

    for(key in transport_details){
        let time = (distance/transport_details[key]["speed"])
        if (distance <= transport_details[key]["range"]){
            info[key] = formatHours(time)
        }else{
            info[key] = "Out of Range"
        }
    }

    return {
        "selected": true,
        "selectedValue": distance,
        "transportName": transportName,
        "transportInfo": info[transportName],
        "info": info,
        "title": "Time ⏳:",
        "img": transport_details[transportName]['image']
    }
}


function time_computation(req){
    var transportName = req.body['time-picker']
    var info = {}
    var time = req.body.time

    for(key in transport_details){
        let distance = (time/60) * transport_details[key]["speed"]
        if (distance <= transport_details[key]["range"]){
            info[key] = distance.toPrecision(2) + " Miles"
        }else{
            info[key] = "Out of Range"
        }
    }

    return {
        "selected": true,
        "selectedValue": time,
        "transportName": transportName,
        "transportInfo": info[transportName],
        "info": info,
        "title": "Distance 🛴:",
        "img": transport_details[transportName]['image']
    }
}

app.post("/", function (req, res) {
    if (req.body.hasOwnProperty('distance-picker')){
        res.render("index", distance_computation(req));
    }  
    else{
        res.render("index", time_computation(req));
    } 
    
});

//run this server by entering "node App.js" using your command line. 
app.listen(port, () => {
    console.log(`Server is running on http://${host}:${port}`);
});



