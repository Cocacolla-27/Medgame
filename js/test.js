var g = ga(
    900, 800, setup, [
        "assets/image/check/check.json",
        "assets/fonts/FredokaOne.ttf",
        "assets/fonts/Balligon.otf",
        "assets/image/other/other.json",
        "assets/image/diagnosis/diagnosis.json",
        "assets/image/hint/hint.json",
        "assets/sound/success.mp3",
        "assets/sound/next.mp3",
        "assets/sound/wrong.mp3",
        "assets/sound/hint.mp3",
    ],
    load
);

g.start();

var origin, test, number,
    chan,
    scale = 1;
var cw, ch;
var regionXs, regionYs, regionCs;

var successSound, wrongSound, hintSound, nextSound;

var hintImg, endGroup;

var scorePanel, score = 0;

var hintBu, endBu, restartBu;

function load() {
    g.progressBar.create(g.canvas, g.assets);
    g.progressBar.update();
}

function setup() {
    g.progressBar.remove();

    g.backgroundColor = "grey";

    cw = g.canvas.width;
    ch = g.canvas.height;
    number = 1;

    successSound = g.sound("assets/sound/success.mp3");
    wrongSound = g.sound("assets/sound/wrong.mp3");
    hintSound = g.sound("assets/sound/hint.mp3");
    nextSound = g.sound("assets/sound/next.mp3");

    successSound.pan = 0.8;
    wrongSound.pan = -0.5;
    hintSound.pan = 0.5;
    nextSound.pan = 0.5;
    nextSound.volume = 0.4;

    var footer = g.sprite("footer.png");
    footer.setPosition(0, 720);

    scorePanel = g.text("", "40px FredokaOne", "red");
    scorePanel.setPosition(680, 19);

    hintBu = g.button([
        "hint.png",
        "hintover.png",
        "hintdown.png"
    ]);

    hintBu.setPosition(20, 10);

    endBu = g.button([
        "endB.png",
        "endBover.png",
        "endBdown.png"
    ]);

    endBu.setPosition(230, 10);

    var footerGroup = g.group(scorePanel, hintBu, endBu);

    footerGroup.y = 900;
    g.slide(footerGroup, -0, 720, 120, "sineCubed", false, 0);

    hintBu.press = function() {
        hintSound.play();

        test.interactive = false;
        score -= 1;
        hintImg = g.sprite("hint" + number + ".png");

        hintImg.width /= 1.7;
        hintImg.height /= 1.7;

        //hintImg = g.sprite("hint" + number + ".png");
        g.stage.putCenter(hintImg, 0, -40);

        hintImg.interactive = true;
        hintImg.release = function() {
            hintImg.interactive = false;
            g.remove(hintImg);
            test.interactive = true;
        }
    }

    endBu.press = function() {
        // g.remove(hintImg);
        test.interactive = false;
        restart();

    }

    restartBu = g.button([
        "restart.png",
        "restartover.png",
        "restartdown.png"
    ]);

    restartBu.release = function() {

        g.slide(endGroup, -0, -800, 120, "sineCubed", false, 0);

        score = 0;
        chan = 0;
        number = 1;

        hintBu.interactive = true;
        loop(number);
    }

    g.state = loop(number);

    g.state = play;
}

function play() {

    scorePanel.content = "Score: " + score;

}

function loop(number) {

    chan = 0;

    dataImage(number);

    testImage(number);
}

function dataImage(n) {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");

    var dataImg = new Image();
    dataImg.onload = function() {
        ctx.drawImage(dataImg, 0, 0, dataImg.width, dataImg.height, 0, 0, canvas.width, canvas.height);
        var pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        getRegion(pixels);
    }

    dataImg.src = "assets/image/origin/origin(" + n + ").jpg";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function testImage(n) {
    var imgUrl2 = "check(" + n + ").jpg";
    test = g.sprite(imgUrl2);
    test.width = 900;
    test.height = 720;

    if (n == 1) {
        test.setPosition(0, 0);
    } else {
        test.x = 900;

        g.slide(test, 0, 0, 70, "sineCubed", false, 0);
    }

    testChan();
}

function getRegion(data) {
    var redTh = 200,
        greenTh = 40,
        blueTh = 40,
        alphaTh = 180,
        pixelIndex,
        RedVal,
        GreenVal,
        BlueVal,
        AlphaVal;

    var getX = [],
        getY = [],
        count = 0;

    for (var y = 0; y < ch; y++) {
        for (var x = 0; x < cw; x++) {
            pixelIndex = (y * cw * 4) + (x * 4);
            RedVal = data[pixelIndex];
            GreenVal = data[pixelIndex + 1];
            BlueVal = data[pixelIndex + 2];
            AlphaVal = data[pixelIndex + 3];

            if (RedVal >= redTh && GreenVal <= greenTh && BlueVal <= blueTh && AlphaVal >= alphaTh) {
                getX.push(x);
                getY.push(y);
                count += 1;
            }
        }
    }
    regionXs = getX;
    regionYs = getY;
    regionCs = count;
}

function testChan() {

    test.interactive = true;
    test.release = function() {
        hintBu.interactive = false;

        test.interactive = false;
        getCheck(g.pointer.x / scale, g.pointer.y / scale, regionXs, regionYs, regionCs);

    }
}

function getCheck(x, y, xs, ys, c) {
    var meanX = [];
    var posY1 = [];
    var posY2 = [];

    for (var i = 0; i < c; i++) {

        if (xs[i] == Math.round(x)) {
            meanX.push(xs[i]);
            posY1.push(ys[i]);

            for (var j = i + 1; j < c; j++) {
                if (xs[i] == xs[j]) {
                    posY2.push(ys[j]);
                }
            }
        }
    }
    var minY = Math.min.apply(posY1, posY2);
    var maxY = Math.max.apply(posY1, posY2);

    if (minY <= y && y <= maxY) {
        score += 1;
        rightMessage();
    } else {
        score -= 1;
        wrongMessage();
    }
}

function rightMessage() {
    successSound.play();
    var rightImg = g.sprite("rightMe.png");

    g.stage.putCenter(rightImg, 0, -40);

    rightImg.interactive = true;

    rightImg.release = function() {

        rightImg.interactive = false;
        g.remove(rightImg);

        var ansImg = g.sprite("ans" + number + ".png");

        ansImg.width /= 1.6;
        ansImg.height /= 1.6;

        g.stage.putCenter(ansImg, 0, -40);


        ansImg.interactive = true;
        ansImg.press = function() {

            ansImg.interactive = false;
            var rightGroup = g.group(test, ansImg);

            g.slide(rightGroup, -900, 0, 70, "sineCubed", false, 0);
            next();
        }
    }
}

function wrongMessage() {

    chan += 1;
    wrongSound.play();
    g.shake(test, 0.05, true);

    if (chan == 3) {
        var noChanImg = g.sprite("noChance.png");
        g.stage.putCenter(noChanImg, 0, -40);

        var wrongGroup = g.group(test, noChanImg);
        noChanImg.interactive = true;
        noChanImg.release = function() {
            hintBu.interactive = true;
            noChanImg.interactive = false;
            g.slide(wrongGroup, -900, 0, 70, "sineCubed", false, 0);

            next();
        }
    } else {

        var wrongImg = g.sprite("wrongMe.png");

        //test.interactive = false;
        g.stage.putCenter(wrongImg, 0, -40);

        wrongImg.interactive = true;

        wrongImg.release = function() {

            hintBu.interactive = true;
            wrongImg.interactive = false;
            g.remove(wrongImg);
            testChan();

        }

    }
}

function next() {
    //g.remove(g.stage.children);
    hintBu.interactive = true;
    if (number == 41) {
        restart();
    } else {
        nextSound.play();
        number++;
        loop(number);
    }

}

function restart() {

    var end = g.sprite("end.png");
    //end.setPosition(0, 800);

    var scorePanel1 = g.text("Score: " + score, "70px Balligon", "red");

    g.stage.putCenter(scorePanel1, -100, -90);

    g.stage.putCenter(restartBu, 0, 45);

    endGroup = g.group(end, scorePanel1, restartBu);

    endGroup.y = 800;

    g.slide(endGroup, 0, 0, 90, "sineCubed", false, 0);

}