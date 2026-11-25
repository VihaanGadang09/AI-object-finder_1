video = "";
status = "";
input_value = "";
objects = [];
detecting = false;  // true while the model is busy, so we don't send 60 requests a second

function setup(){
    canvas = createCanvas(480, 380);
    canvas.center();

    video = createCapture(VIDEO);
    video.size(480, 380);
    video.hide();
}

function draw(){
    image(video, 0, 0, 480, 380);

    if(status != ""){
        if(!detecting){
            detecting = true;
            objectDetector.detect(video, gotResult);
        }

        for(i = 0; i < objects.length; i++){
            document.getElementById("status").innerHTML = "Status: Objects Detected";
            fill("#FF0000");
            percent = floor(objects[i].confidence * 100);
            text(objects[i].label + " " + percent + "%", objects[i].x + 15, objects[i].y + 15);
            noFill();
            stroke("#FF0000");
            rect(objects[i].x, objects[i].y, objects[i].width, objects[i].height);

            if(objects[i].label == input_value){
                video.stop();
                status = "";  // stop detecting once the object has been found
                document.getElementById("object_status").innerHTML = input_value + " found!";
                synth = window.speechSynthesis;
                utterThis = new SpeechSynthesisUtterance(input_value + " found");
                synth.speak(utterThis);
            }
            else{
                document.getElementById("object_status").innerHTML = input_value + " not found!";
            }
        }
    }
}

function gotResult(error, results){
    detecting = false;
    if(error){
        console.log(error);
        return;
    }
    console.log(results);
    objects = results;
}

function start(){
    objectDetector = ml5.objectDetector('cocossd', modelLoaded);
    document.getElementById("status").innerHTML = "Status: Detecting Objects";
    input_value = document.getElementById("textinput_1").value;
    console.log(input_value);
}

function modelLoaded(){
    console.log("Model Loaded!");
    status = true;
}