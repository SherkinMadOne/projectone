(function () {

    document.addEventListener("DOMContentLoaded", init, false);

    var manHeight = 330;
    var objectPos = 0;
    var object = "middle";
    var passed = false;
    var gameSpeed = 350;
    var objectHeight = 330;
    var gameLength = 1;
    var obstacleThere = false;
    var count = 0;
    var score = 0;
    var pageNo = 0;
    var lined = "";
    var storyWords = [];
    var storyRequest = new XMLHttpRequest();
    var colourImage = new Image();
    var paintImage = new Image();
    var background = new Image();
    var gman = new Image();
    var gmanlegs = new Image();
    var wife = new Image();
    var obstacle = new Image();
    var frontLegs = true;
    var draw = false;
    var colour = "yellow";
    var colourfile = "pictures/gingerbreadman.jpg";
    var colours = ["blue", "yellow", "green", "red", "purple", "black", "brown", "orange", "white"];
    var context = "";
    var canvasWidth = 0;
    var canvasHeight = 0;
    var canvas = "";
    var clockx = 150;
    var clocky = 150;
    var clockInterval = "";


    function init() {
        document.addEventListener("scroll", function (event) { event.preventDefault() }, false);
        document.getElementById("story").addEventListener("click", displayModal, false);
        document.getElementById("game").addEventListener("click", displayModal, false);
        document.getElementById("goPaint").addEventListener("click", displayModal, false);
        document.getElementById("field").addEventListener("click", displayModal, false);
        document.getElementById("clock").addEventListener("click", displayModal, false);
        document.getElementById("video").addEventListener("click", displayModal, false);
        window.addEventListener("resize", checkWindow, false);
    }

    function goBack() {
        window.close();
    }

    function displayModal() {
        /* This is the pop up window  */
        createModalWin();
        whatEvent = this.id;

        if (whatEvent === "game") {
            createCanvas(400, 800);
            canvas = document.querySelector("canvas");
            context = canvas.getContext("2d");
            width = canvas.width;
            height = canvas.height;
            clockInterval = window.setInterval(game, gameSpeed);
            window.addEventListener("keypress", keyMove, false);
            window.addEventListener("touchstart", move, false);
        }

        if (whatEvent === "story") {
            createCanvas(300, 650);
            pageNo = 0;
            addNextPageButton();
            document.getElementById("canvas").style.background = 'yellow';
            getLine();
        }

        if (whatEvent === "goPaint") {

            createCanvas(400, 650);
            var context = canvas.getContext('2d');
            colourImage.src = colourfile;
            context.drawImage(colourImage, 10, 10);
            canvas.addEventListener('touchstart', touchDraw, false);
            canvas.addEventListener("touchmove", drawing, false);
            canvas.addEventListener("touchend", endDraw, false);
            canvas.addEventListener("mousedown", mouseDraw, false);
            canvas.addEventListener("mousemove", drawingMouse, false);
            canvas.addEventListener("mouseup", endDraw, false);
            drawPaints();
            drawThumbnails();
        }

        if (whatEvent === "clock") {
            createCanvas(300, 500);
            clockInterval = window.setInterval(displayTime, 100);
        }

        if (whatEvent === "field") {
            drawField();
        }

        if (whatEvent === "video") {
            var storyVideo = document.createElement("iframe");
            popUpwin = document.getElementById("insidePopup")
            popUpwin.appendChild(storyVideo);
            storyVideo.src = "https://www.youtube.com/embed/U89dkGrsYZY";
            storyVideo.setAttribute("width", "854");
            storyVideo.setAttribute("height", "480");
            storyVideo.setAttribute("frameborder", "0");
            storyVideo.style.align = "center";
        }
    }


	/*________________________________________________________________________
        Story */


    function displayLine() {
        /* This displays my story onto a black canvas screen, loaded from a database */

        canvas = document.querySelector('canvas');
        context = canvas.getContext('2d');
        context.font = "38px Arial";
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        for (var y = 50; y < canvasHeight; y += 70) {
            context.beginPath();
            context.strokeStyle = "red";
            context.moveTo(0, y);
            context.lineTo(canvasWidth, y);
            context.stroke();
            context.closePath();
        }
        if (storyRequest.status === 200) {

            if (storyRequest.readyState == 4) {
                storyLine = storyRequest.responseText;
                if (storyLine === "Ooooops.....the gingerbread man has ran away please try later....") {
                    /* hide the next page button */
                    context.textAlign = "center";
                    storyLine = "Ooooops.....the gingerbread man";
                    context.fillText(storyLine, 5, 10);
                    storyLine = "has ran away please try later....";
                    context.fillText(storyLine, 5, 40);
                }
                else if (storyLine === "END" || storyLine === "") {
                    //disable the next button
                    var popUpWin = document.getElementById("insidePopup");
                    var theButton = document.getElementById("nextpage");
                    popUpWin.removeChild(theButton);
                    context.font = "58px Arial";
                    context.fillText("The END", 175, 160);
                }
                else {
                    storyWords = storyLine.split(" ");
                    /* Now display to canvas */
                    var y = 40;
                    var x = 5;
                    for (var z = 0; z < storyWords.length; z++) {
                        context.fillStyle = "black";
                        var textLen = context.measureText(storyWords[z]);
                        if (x + textLen.width + 20 > canvasWidth)
                        { y = y + 70; x = 5; }
                        else {
                            context.fillText(storyWords[z], x, y);
                            x = x + textLen.width + 20;
                        }

                    }
                }
            }
        }

    }

    function getLine() {
        pageNo += 1;
        var storyLine = "getstory.py?pageno=" + pageNo;
        storyRequest.addEventListener("readystatechange", displayLine, false);
        storyRequest.open("POST", storyLine, true);
        storyRequest.send(null);
        displayLine()
    }
    /*___________________________________________________________________________ */
    /* This is the drawing canvas */


    function selectPaint(event) {
        /* change the colour when different paint colour selected */
        var x = event.target.id;
        colour = x;
    }

    function selectPicture(event) {
        /* this changes the picture on the canvas when selected */
        var x = event.target.id;
        colourImage.src = "pictures/" + x + ".jpg";
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        context.drawImage(colourImage, 0, 0);

    }

    function mouseDraw(event) {
        /* draw on the canvas with the mouse */
        var mousex = event.x - event.target.offsetLeft - 100;
        var mousey = event.y - event.target.offsetTop;
        context.fillStyle = colour;
        context.fillRect(mousex, mousey, 10, 10);
        draw = true;
    }

    function drawingMouse(event) {
        /* this follows the mouse amd draws as it goes */
        if (draw) {
            var mousex = event.x - event.target.offsetLeft - 100;
            var mousey = event.y - event.target.offsetTop;
            context.fillStyle = colour;
            context.fillRect(mousex, mousey, 10, 10);
        }
    }

    function touchDraw() {
        /* this is the tablet equivilant to the mouse */
        var touch = event.touches[0];
        var touchX = touch.pageX - touch.target.offsetLeft;
        var touchY = touch.pageY - touch.target.offsetTop;
        context.fillStyle = colour;
        context.fillRect(touchX, touchY, 10, 10);
        draw = true;
    }

    function drawing() {
        /* this is the tablet equivilant to the tablet as to the mouse */
        if (draw) {
            var touch = event.touches[0];
            var touchX = touch.pageX - touch.target.offsetLeft;
            var touchY = touch.pageY - touch.target.offsetTop;
            context.fillStyle = colour;
            context.fillRect(touchX, touchY, 10, 10);
        };

    }

    function endDraw() {
        /* this stops drawing on the canvas */
        draw = false;
    }

    function drawPaints() {
        /* This draws the thumbnail's of the paints on the left hand side of the modal */
        var yCo = 0;
        var xCo = 0;
        for (var z = 0; z < colours.length; z++) {
            var paint = colours[z];
            paint = "paints/" + paint + ".jpg";
            var paintColour = document.createElement("IMG");
            popUpwin = document.getElementById("popUp");
            popUpwin.appendChild(paintColour);
            paintColour.setAttribute("id", colours[z]);
            paintColour.style.position = "fixed";
            paintColour.style.top = yCo + "px";
            paintColour.style.right = xCo + "px";
            paintColour.src = paint;
            document.getElementById(colours[z]).addEventListener("click", selectPaint, false);

            yCo += 78;
            if (yCo > 350) {
                yCo = 0;
                xCo = xCo + 78;
            }
        }
    }

    function drawThumbnails() {
        // Draw thumbnails of other pics
        var thumbNail = document.createElement("IMG");
        popUpwin = document.getElementById("popUp")
        popUpwin.appendChild(thumbNail);
        thumbNail.src = "pictures/thumb/pig.jpg";
        thumbNail.setAttribute("id", "pig");
        thumbNail.style.position = "fixed";
        thumbNail.style.left = "0px";
        thumbNail.style.top = "200px";
        thumbNail.setAttribute("title", "Colour a pig");
        document.getElementById("pig").addEventListener("click", selectPicture, false);
        thumbNail = document.createElement("IMG");
        popUpwin = document.getElementById("popUp")
        popUpwin.appendChild(thumbNail);
        thumbNail.src = "pictures/thumb/flower.jpg";
        thumbNail.setAttribute("id", "flower");
        thumbNail.style.position = "fixed";
        thumbNail.style.top = "280px";
        thumbNail.style.left = "0px";
        thumbNail.setAttribute("title", "Colour a flower");
        document.getElementById("flower").addEventListener("click", selectPicture, false);
    }


	/*_____________________________________________________________________________
	 */
    /* This is the window overlooking the field */

    function drawField(event) {
        /* This draws the picture of the field on the canvas */

        var animals = [["chicken", "245,234,400,400"], ["pig", "0,315,151,400"], ["cow", "5,123,204,276"], ["sheep", "205,123,311,214"], ["goat", "324,95,400,215"]]; var fieldFile = "pictures/field.jpg";
        var popUpwin = document.getElementById("insidePopup");
        fieldPic = document.createElement("IMG");
        fieldPic.src = fieldFile;
        fieldPic.setAttribute("usemap", "#field");
        fieldPic.setAttribute("ismap", "ISMAP");
        popUpwin.appendChild(fieldPic);
        var mapping = document.createElement("map");
        mapping.setAttribute("name", "field");
        fieldPic.appendChild(mapping);
        for (var z = 0; z < animals.length; z++) {
            var areas = document.createElement("area");
            mapping.appendChild(areas);
            areas.setAttribute("shape", "rect");
            areas.setAttribute("coords", animals[z][1]);
            areas.setAttribute("id", animals[z][0])
            areas.setAttribute("alt", animals[z][0])
            areas.setAttribute("title", "What sounds does a " + animals[z][0] + " make?")
            document.getElementById(animals[z][0]).addEventListener("click", getAnimal, false);
        }
        window.addEventListener('touchstart', getAnimal, false);
    }


    function getAnimal(event) {
        /* This will return sound relative to the if of the animal pressed */

        var x = this.id;
        if (x === "") {
            x = event.touches[0];
        }
        x = "sounds/" + x + ".wav";
        var newSound = document.createElement("Audio");
        var popUpWin = document.getElementById("popUp");
        popUpWin.appendChild(newSound);
        newSound.src = x;
        newSound.play();

    }

	/*__________________________________
		 * CLOCK  */

    function displayTime() {
        /* This draws the clock face*/
        var h = new Date().getHours();
        var m = new Date().getMinutes();
        var s = new Date().getSeconds();
        context = canvas.getContext('2d');
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        context.beginPath();
        context.fillStyle = "white";
        context.arc(clockx, clocky, 140, 0, Math.PI * 2, true);
        context.fill();
        context.strokeStyle = "black";
        context.lineWidth = 10;
        context.stroke();
        context.closePath();
        drawNumber();
        drawHand(360 * (h / 12) + (m / 60) * 30 - 90, 70, "black", 10);
        drawHand(360 * (m / 60) + (s / 60) * 6 - 90, 100, "black", 10);
        drawHand(360 * (s / 60) + clockx - 90, 120, "red", 2);
        giveTime(h, m, s);
    }

    function drawNumber() {
        /* Draws the numbers on the clock face */
        for (var n = 0; n < 12; n++) {
            var d = -60;
            var num = new Number(n + 1);
            var str = num.toString();
            var dd = Math.PI / 180 * (d + n * 30);
            var tx = Math.cos(dd) * 120 + 140;
            var ty = Math.sin(dd) * 120 + 160;
            context.font = "26px Verdana";
            context.fillStyle = "green";
            context.fillText(str, tx, ty);
        }
    }

    function drawHand(deg, len, colour, handWidth) {
        /* Draw the hand on the clock face */
        rad = (Math.PI / 180 * deg);
        var x1 = clockx + Math.cos(rad) * len;
        var y1 = clocky + Math.sin(rad) * len;
        context.beginPath();
        context.strokeStyle = colour;
        context.lineWidth = handWidth;
        context.moveTo(clockx, clocky);
        context.lineTo(x1, y1);
        context.stroke();
        context.closePath();
    }

    function giveTime(h, m, s) {
        /* This displays the time on the canvas window as well */
        var morn = "morning";
        var am = " am"
        var d = new Date().getDay();
        var day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var hours = ["twelve", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"]
        if (h > 18) {
            morn = "night";
            am = " pm";
        }
        else if (h > 12) {
            morn = "afternoon";
            h = h - 12;
            am = " pm"
        }
        if (h === 0) { h = 12; }
        if (m < 10) {
            m = "0" + m;
        }
        var now = day[d] + " " + morn
        context.fillText(now, 260, 50);
        now = "at "
        switch (m) {
            case 0:
                now = hours[h] + " o'clock";
                break
            case 15:
                now = "quarter past " + hours[h];
                break
            case 45:
                h = h + 1;
                now = "quarter too " + hours[h];
                break
            case 30:
                now = "half past " + hours[h];
                break

            default: now = now + h + " :" + m + am;
        }
        context.fillText(now, 330, 100);
    }

    /*______________________________________________________*/
    /*  GAME */


    function game() {
        /* This is the beginning of the game - and is relative to setInterval */
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        gman.src = "game/man.jpg";
        if (frontLegs === true) {
            wife.src = "game/wife2.jpg";
        }
        else { wife.src = "game/wife1.jpg"; }
        background.src = "game/back.jpg";
        context.drawImage(background, 0, 0);
        context.drawImage(wife, 0, canvasHeight - 200);
        score += 1;
        if (count < 1) {
            if (frontLegs === true) {
                gmanlegs.src = "game/flegs.jpg";
                frontLegs = false;
            }
            else {
                frontLegs = true;
                gmanlegs.src = "game/blegs.jpg";
            }
        }
        context.drawImage(gman, 100, manHeight - 100);
        context.drawImage(gmanlegs, 100, manHeight);

        moveObjects();
    }

    function collide() {
        // stop game
        var temp = "";

        context.font = "36px Arial";
        context.fillStyle = "black";
        context.fillText("Ooops you were caught !!!!! ", 30, 100);
        context.fillText("Your score is : " + score, 130, 200);
        var oldScore = document.cookie.split(";")
        for (var z = 0; z < oldScore.length; z++) {
            if (oldScore[z].search("Score" > 0)) {
                temp = oldScore[z].split("=");

                if (temp[1] < score && score != 0) {
                    document.cookie = "Score=" + score;
                    score = 0;
                    window.alert("Congratulations a new high score!!")
                }
            }
        }
        if (score != 0 && temp === "") {
            document.cookie = "Score=" + score;
        }
        temp = window.confirm("Would you like to play again?");
        if (temp === true) {
            score = 0;
            gamespeed = 330;
            game();
        }
        else {

            closeModal();
        }
    }

    function checkObjects() {
        /*Check the objects */
        temp = "";
        if (object === "middle" && passed === true) {

            passed = false;
            var x = Math.floor((Math.random() * 5) + 1);
            obstacle.src = "";
            obstacleThere = false;
            if (x === 1) {
                objectHeight = canvasHeight - 250;
                obstacle.src = "game/tree.jpg"
                object = "Branch"
                obstacleThere = true;
            }
            if (x === 3) {
                objectHeight = canvasHeight - 50;
                obstacle.src = "game/log.jpg"
                object = "Pond"
                obstacleThere = true;
            }
            context.drawImage(obstacle, objectPos, objectHeight);
        }
    }
    function moveObjects() {
        /* This moves the objects along */
        if (objectPos < 0) {
            randno = Math.floor((Math.random() * 100) + 1);;
            objectPos = width + randno;
            passed = true;
            object = "middle";
            objectHeight = 330;
        }
        if (count > 0) { count -= 1; }
        if (count === 0) {
            manHeight = 330;
            gmanlegs.src = "game/flegs.jpg";
        }
        checkObjects();
        objectPos -= 40;
        context.drawImage(obstacle, objectPos, objectHeight);

        if (object != "middle") {
            if (objectPos < 120 && objectPos > 80) {
                if (objectHeight = 150 && manHeight != 390 && object === "Branch") {

                    collide();
                }
                if (objectHeight = 350 && manHeight != 270 && object === "Pond") {

                    collide();
                }
            }
        }
    }

    function move(e) {
        /* Move with touch screen */
        if (!e)
            var e = event;
        if (e.touches) {
            if (e.touches.length == 1) { // Only deal with one finger
                var touch = e.touches[0]; // Get the information for finger #1
                touchX = touch.pageX - touch.target.offsetLeft;
                touchY = touch.pageY - touch.target.offsetTop;
            }
            moveSprite(touchX, touchY);
        }

    }

    function keyMove(event) {
        /* move with keys */
        /* d - 68 or 100  f- 70 or 102 s-83 or 115 */
        var y = 0;
        var key = event.keyCode;
        if (key === 74 || key === 106) { y = 50; }
        if (key === 68 || key === 100) { y = 250; }
        if (key === 70 || key === 102) {
            gameSpeed -= 80;
            window.clearInterval(clockInterval);
            clockInterval = window.setInterval(game, gameSpeed);
        }
        if (key === 83 || key === 115) {
            gameSpeed += 80;
            window.clearInterval(clockInterval);
            clockInterval = window.setInterval(game, gameSpeed);
        }

        moveSprite(0, y);
    }

    function moveSprite(x, y) {
        /* take the input for moving and move the sprite correspondingly */
        if (y > 0 && y < 200) {
            manHeight = 270;
            count = 10;
            gmanlegs.src = "game/jump.jpg";
        }
        if (y > 200 && y < 380) {
            manHeight = 390;
            count = 10;
        }

    }
    /* ______________________________ */
    /* These are the various buttons in the modal window */


    function checkWindow() {
        /* Check the window size - ultiamte window size is 830 squared */
        /* This alters the CSS than transform the window portait when using tablet */
        var x = window.innerWidth;
        var y = window.innerHeight;
        if (x < 599 && screen.width > 1000) {
            document.body.style.transform = "rotate(0deg)";
        }
    }

    function addNextPageButton() {
        /* This is the 'Next Page' button on the story screen */
        var nextButton = document.createElement("img");
        var popUpwin = document.getElementById("insidePopup");
        popUpwin.appendChild(nextButton);
        nextButton.setAttribute("id", "nextpage")
        document.getElementById("nextpage").addEventListener("click", getLine, false);
        nextButton.src = "pictures/pagecurl.gif";
        nextButton.style.position = "fixed";
        nextButton.style.bottom = 0;
        nextButton.style.right = 0;
        nextButton.style.top = canvasHeight - 200;
        nextButton.setAttribute("title", "Next Page in the story");
    }

    function addBackButton() {
        /* This is my button that closes the modal window */

        var backButton = document.createElement("IMG");
        var popUpwin = document.getElementById("insidePopup");
        popUpwin.appendChild(backButton);
        backButton.addEventListener("click", closeModal, false);
        backButton.src = "pictures/doorway.jpg";
        backButton.setAttribute("id", "doorway");
        backButton.style.position = "fixed";
        backButton.style.left = 0;
        backButton.style.top = 0;
        backButton.setAttribute("title", "Back to the kitchen");

    }

    function createModalWin() {
        /* This creates the modal window */
        var mainWin = document.getElementById("main");
        var modalWin = document.createElement("div");
        mainWin.appendChild(modalWin);
        mainWin.style.display = "block";
        modalWin.setAttribute("id", "popUp");
        modalWin.style.zIndex = "1";
        modalWin.style.position = "fixed";
        modalWin.style.borderStyle = "solid";
        modalWin.style.left = "20px";
        modalWin.style.top = "-100px";
        modalWin.style.margin = "10%"
        modalWin.setAttribute("height", "100%");;
        modalWin.setAttribute("width", "100%");
        modalWin.style.color = "black";
        modalWin.style.backgroundColor = "rgba(0,0,0,0.8)";
        var modalWin = document.createElement("div");
        var bodyWin = document.getElementById("popUp");
        bodyWin.appendChild(modalWin);
        modalWin.setAttribute("id", "insidePopup");
        modalWin.style.margin = "0";
        modalWin.style.left = "20px";
        modalWin.setAttribute("height", "80%");;
        modalWin.setAttribute("width", "80%");
        modalWin.style.color = "white";
        modalWin.style.background = "black";
        document.getElementById("main").blur();
        addBackButton();

    }

    function createCanvas(fHeight, fWidth) {
        /* The will create the the canvas */
        var theCanvas = document.createElement("canvas");
        // Appended this to popup from inside popup
        var popUpWin = document.getElementById("popUp");
        popUpWin.appendChild(theCanvas);
        theCanvas.className = "canvas"
        theCanvas.setAttribute("height", fHeight);
        theCanvas.setAttribute("width", fWidth);
        theCanvas.setAttribute("id", "canvas")
        theCanvas.style.display = "block";
        theCanvas.style.marginLeft = "8%";
        theCanvas.style.marginRight = "8%";
        theCanvas.style.border = "1px solid black";
        theCanvas.style.background = "white";
        theCanvas.style.alignSelf = "center";
        theCanvas.style.left = "-100px"
        canvas = document.querySelector('canvas');
        context = canvas.getContext('2d');
        canvasHeight = fHeight;
        canvasWidth = fWidth;
        context.clearRect(0, 0, canvasWidth, canvasHeight);

    }

    function closeModal() {
        /* Close the modal window and remove all the elements that I have created */
        window.clearInterval(clockInterval);
        context = "";
        canvas = "";
        var mainWin = document.getElementById("main")
        var removeModal = document.getElementById("popUp");
        mainWin.style.display = "none";
        mainWin.removeChild(removeModal);

    }

})();