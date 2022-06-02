//info retrieval functions
function getBoxLeft() {
    var box = document.getElementById("box");
    console.log(box);
    return parseInt(box.style.left);
}
function getBoxTop() {
    var box = document.getElementById("box");
    return parseInt(box.style.top);
}
function getBoxHeight() {
    // var curHeight = getComputedStyle(document.getElementById("box")).height;
    // var intCurHeight = parseInt(curHeight.substring(0, curHeight.length-2));
    // return intCurTop;
    var box = document.getElementById("box");
    return parseInt(box.style.height);
}
function getBoxWidth() {
    var box = document.getElementById("box");
    return parseInt(box.style.width);
}
function getFrameLeft() {
    var frame = document.getElementById("mapFrame");
    return parseInt(frame.getBoundingClientRect().left);
}
function getFrameTop() {
    var frame = document.getElementById("mapFrame");
    return parseInt(frame.getBoundingClientRect().top);
}
function getFrameHeight() {
    var frame = document.getElementById("mapFrame");
    return parseInt(frame.getBoundingClientRect().height);
}
function getFrameWidth() {
    var frame = document.getElementById("mapFrame");
    return parseInt(frame.getBoundingClientRect().width);
}
function cursorInFrame(x, y) {
    var checkX = x >= getFrameLeft() && x <= getFrameLeft() + getFrameWidth();
    var checkY = y >= getFrameTop() && y <= getFrameTop() + getFrameHeight();
    return checkX && checkY;
}
function inFrameBoundaryX() { //-1 out of left bound; 1 out of right bound; 0 in bound
    if(getBoxLeft() >= getFrameLeft()) {
        return -1;
    } else if (getBoxLeft()+getBoxWidth() <= getFrameLeft()+getFrameWidth()) {
        return 1;
    }
    return 0;
}
function inFrameBoundaryY() { //-1 out of left bound; 1 out of right bound; 0 in bound
    if(getBoxTop() >= getFrameTop()) {
        return -1;
    } else if (getBoxTop()+getBoxHeight() <= getFrameTop()+getFrameHeight()) {
        return 1;
    }
    return 0;
}


//moving button functions
function moveRight() {
    var intCurLeft = getBoxLeft();
    // var curLeft = getComputedStyle(document.getElementById("box")).left;
    // var intCurLeft = parseInt(curLeft.substring(0, curLeft.length-2));
    document.getElementById("box").style.left= (intCurLeft-100)+"px";
}
function moveLeft() {
    var intCurLeft = getBoxLeft();
    document.getElementById("box").style.left= (intCurLeft+100)+"px";
}
function moveUp() {
    var intCurTop = getBoxTop();
    // var curTop = getComputedStyle(document.getElementById("box")).top;
    // var intCurTop = parseInt(curTop.substring(0, curTop.length-2));    
    document.getElementById("box").style.top= (intCurTop+100)+"px";
}
function moveDown() {
    var intCurTop = getBoxTop();

    document.getElementById("box").style.top= (intCurTop-100)+"px";
}



//dragging functions
var params = {top: 0, left: 0, curX:0, curY:0, isDragging:false}
params.left = getBoxLeft();
params.top = getBoxTop();
function handleMouseDown(evt) {
    
    if(cursorInFrame(evt.clientX, evt.clientY)) {
        evt.preventDefault();
        params.isDragging = true;
        params.curX = evt.clientX;
        params.curY = evt.clientY;

        // var curTop = getComputedStyle(document.getElementById("box")).top;
        // params.top = curTop;
        // var curLeft = getComputedStyle(document.getElementById("box")).left;
        // params.left = curLeft;
        
        document.getElementById("box").style.cursor = "move";
        
    }
}

function handleMouseUp(evt) {
    if(params.isDragging == true){
        params.left = getBoxLeft();
        params.top = getBoxTop();
        params.isDragging = false;
        document.getElementById("box").style.cursor = "default";
    }

}
function handleMouseMove(evt) {
    if(params.isDragging == true) {
        var changeY = (evt.clientY - params.curY);
        var changeX = (evt.clientX - params.curX);

        //change stuff
        if(inFrameBoundaryX() == -1 && changeX > 0) {
            document.getElementById("box").style.left=getFrameLeft()+"px";
        } else if (inFrameBoundaryX() == 1 && changeX < 0) {
            document.getElementById("box").style.left=getFrameLeft()+getFrameWidth()-getBoxWidth() + "px";
        } else {
            document.getElementById("box").style.left= (parseInt(params.left) + changeX) + "px";
        }

        //almost good version
        var frameMarginTop = window.getComputedStyle(document.getElementById("mapFrame")).marginTop;
        if(inFrameBoundaryY() == -1 && changeY > 0) {
            document.getElementById("box").style.top=(getFrameTop()-parseInt(frameMarginTop))+"px";
        } else if (inFrameBoundaryY() == 1 && changeY < 0) {
            document.getElementById("box").style.top=(getFrameTop()+getFrameHeight()-getBoxHeight()-parseInt(frameMarginTop)) + "px";
        } else {
            document.getElementById("box").style.top= (parseInt(params.top) + changeY) + "px";
        }
        evt.preventDefault();
    }
}


// EventTarget interface
// document.addEventListener
// document.removeEventListener
// document.dispatchEvent

document.addEventListener("mousedown", handleMouseDown, false);
document.addEventListener("mousemove", handleMouseMove, false);
document.addEventListener("mouseup", handleMouseUp, false);


// zooom functions
var maps = [{src:"images/map-s.gif", width:"1283", height:"997"},
            {src:"images/map-m.gif", width:"2047", height:"1589"},
            {src:"images/map-l.gif", width:"3063", height:"2373"},
            {src:"images/map-xl.gif", width:"4084", height:"3164"}];
var curMapIndex = 1;

console.log("box left: " + box.style.left);
console.log("box top: " + box.style.top);

function zoomIn() {
    var box = document.getElementById("box");
    if(curMapIndex < 3) {
        curMapIndex+=1;

        var leftCords = getBoxLeft();
        var topCords = getBoxTop();

        var ratioX = maps[curMapIndex].width/maps[curMapIndex-1].width;
        var ratioY = maps[curMapIndex].height/maps[curMapIndex-1].height;

        var newLeft = (getFrameWidth()/2-leftCords) * ratioX
        var newTop = (getFrameHeight()/2-topCords) * ratioY

        box.src = maps[curMapIndex].src;
        box.style.width= maps[curMapIndex].width + "px";
        box.style.height= maps[curMapIndex].height + "px";
        
        box.style.left = -(newLeft-getFrameWidth()/2) + "px";
        box.style.top = -(newTop-getFrameHeight()/2) + "px";

        console.log("box left: " + box.style.left);
        console.log("box top: " + box.style.top);
    }
    params.left = getBoxLeft();
    params.top = getBoxTop();

    // var width = getBoxWidth();
    // console.log(ratio);
    // if(getBoxWidth)
}

function zoomOut() {
    var box = document.getElementById("box");
    if(curMapIndex > 0) {
        curMapIndex-=1;

        var leftCords = getBoxLeft();
        var topCords = getBoxTop();

        var ratioX = maps[curMapIndex].width/maps[curMapIndex+1].width;
        var ratioY = maps[curMapIndex].height/maps[curMapIndex+1].height;

        var newLeft = (getFrameWidth()/2-leftCords) * ratioX
        var newTop = (getFrameHeight()/2-topCords) * ratioY

        box.src = maps[curMapIndex].src;
        box.style.width= maps[curMapIndex].width + "px";
        box.style.height= maps[curMapIndex].height + "px";
        
        box.style.left = -(newLeft-getFrameWidth()/2) + "px";
        box.style.top = -(newTop-getFrameHeight()/2) + "px";

        console.log("box left: " + box.style.left);
        console.log("box top: " + box.style.top);
    }
    params.left = getBoxLeft();
    params.top = getBoxTop();
}

//frame resize
var scaleX = 800/window.innerWidth;
var scaleY = 600/window.innerHeight;
window.addEventListener("resize", handleResize, false);
function handleResize() {
    var x = window.innerWidth;
    var y = window.innerHeight;
    document.getElementById("mapFrame").style.width = x*scaleX + "px";
    document.getElementById("mapFrame").style.height = y*scaleY + "px";

    document.getElementById("navigation").style.left = (getFrameWidth()/2 - 50) + "px";
    console.log(document.getElementById("navigation").style.left);
}
