var canvas;
var gl;
var ScreenSize = [1920, 1080];


function GameMain() {

    var socket = io();
    //#region 렌더링 변수
    var lastFrameTime = Date.now() / 1000;

    var bgColor = [0, 0.5, 1, 1];


    var spriteShader;
    var spineManager;


    //#endregion


    //#region inGame val
    var characterID = 109631;
    var classID = 2;


    var speedFactor = 1;
    var obstaclePos = [];
    var farBgPos = [];
    var nearBgPos = [];
    var treePos = [];

    var score = 0;
    var HP = 3;

    var distBGSpeed = 100;
    var closeBGSpeed = 400;


    var gameStart = false;
    var gameEntry = true;
    var gameOver = false;
    var highScore = false;

    //#endregion

    function init() {
        canvas = document.getElementById("canvas");
        var config = { alpha: false };
        gl = canvas.getContext("webgl", config) || canvas.getContext("experimental-webgl", config);
        if (!gl) {
            alert('WebGL is unavailable.');
            return;
        }


        initInput();

        spineManager = new SpineManager();
        spineManager.init();

        FontSystem.loadFont();

        TextureUtil.loadTexture(function () {
            spineManager.load(characterID, classID, function () {
                initGame();

            });
        })






        FontSystem.setString("score", "Score : " + score);
        FontSystem.setPosition("score", [0, 470]);


        FontSystem.setString("Rank0", "");
        FontSystem.setString("Rank1", "");
        FontSystem.setString("Rank2", "");
        FontSystem.setString("Rank3", "");
        FontSystem.setString("Rank4", "");
        FontSystem.setPosition("Rank0", [-950, -230]);
        FontSystem.setPosition("Rank1", [-950, -290]);
        FontSystem.setPosition("Rank2", [-950, -350]);
        FontSystem.setPosition("Rank3", [-950, -410]);
        FontSystem.setPosition("Rank4", [-950, -470]);

        FontSystem.setString("CountDown", "3");
        FontSystem.setPosition("CountDown", [-100, 30]);


        FontSystem.setString("Restart", "Press Any Key To Start");
        FontSystem.setPosition("Restart", [-300, -150]);
    }

    function sendScore(score) {
        socket.emit("set_score", { name: 'AAA', score: score });
    }

    function initInput() {
        keyMap = {};
        document.addEventListener('keydown', function (event) {
            if( gameEntry === true || gameStart === false || gameOver === true){
                return;
            }


            if (keyMap[event.code] === true) return;

            // if(event.code === 'ArrowRight' ){
            //     runChar( false);
            // }
            // else if (event.code === 'ArrowLeft'){
            //     runChar( true);
            // }
            if (event.code === 'KeyA') {
                //sendScore(score);
                //spineManager.die();
            }
            // else if (event.code === 'KeyS'){
            //     attack2Char();
            // }

            // else if (event.code === 'KeyQ'){
            //     dieChar( );
            // }
            // else if (event.code === 'KeyW'){
            //     damageedChar();
            // }

            // else if (event.code === 'KeyZ'){
            //     useSkill( 0);
            // }
            // else if (event.code === 'KeyX'){
            //     useSkill( 1);
            // }
            // else if (event.code === 'KeyC'){
            //     useSkill( 2);
            // }


            if (event.code === 'Space') {
                event.preventDefault();
                spineManager.jump();
            }

            keyMap[event.code] = true;

        }, false);

        document.addEventListener('keyup', function (event) {

            if( gameOver === true ){
                initGame();
            }
            else if( gameStart === false && gameEntry === true ){
                startGame();
            }

            keyMap[event.code] = false;

        }, false);
    }


    var resetObstacle = function (i) {
        var nextPos = 0;

        for (var k = 0; k < obstaclePos.length; k++) {
            if (nextPos < obstaclePos[k][0])
                nextPos = obstaclePos[k][0];
        }

        obstaclePos[i] = [nextPos + (100 + Math.random() * 500), -30]

    }


    var prevTime = 0;
    function printDeltaTime() {
        if ((Date.now() - prevTime) > 33) {
            var currentdate = new Date();
            var datetime = "Last Sync: "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":"
                + currentdate.getSeconds();

            console.log(" 1 " + (Date.now() - prevTime) + " ++++ " + datetime);

        }
        prevTime = Date.now();
    };

    function initGame() {
        spineManager.setDearIdle();
        requestAnimationFrame(update);

        spineManager.setPosition(0);
        score = 0;
        HP = 3;
        gameStart = false;
        gameEntry = true;
        gameOver = false;

        obstaclePos.length = 0;
        farBgPos.length = 0;
        nearBgPos.length = 0;
        treePos.length = 0;

        for (var i = 0; i < 6; i++) {
            obstaclePos.push([i * 512 + Math.random() * 50 - 25 + 1024, -30]);
            farBgPos.push([i * 1024 - 2048, -60 - 512]);
            nearBgPos.push([i * 512 - 1024, -60]);
            treePos.push([i * 512 - 1024, -60]);
        }


        FontSystem.setVisible("score", false);
        FontSystem.setVisible("CountDown", false);
    }

    function startGame(){
        gameStart = true;
        FontSystem.setVisible("Restart", false);
    }


    function update() {


        var now = Date.now() / 1000;
        var delta = now - lastFrameTime;
        lastFrameTime = now;
        delta *= speedFactor;
        movememtDelta = delta * spineManager.getSpeed() * gameStart;

        if( gameOver === true )
            movememtDelta = 0;

        if (gameEntry === true) {
            var pos = spineManager.getPosition();
            pos -= movememtDelta * 2 * 400;
            if (pos <= -1420) {
                pos = -1420;
                gameEntry = false;
                gameStart = false;
                countDown();

            }
            spineManager.setPosition(pos);
        }



        for (var i = 0; i < farBgPos.length; i++) {
            farBgPos[i][0] -= movememtDelta * distBGSpeed;
            if (farBgPos[i][0] < - ScreenSize[0] / 2 - 1024)
                farBgPos[i][0] += 512 * farBgPos.length;
        }

        for (var i = 0; i < nearBgPos.length; i++) {
            nearBgPos[i][0] -= movememtDelta * closeBGSpeed;
            if (nearBgPos[i][0] < - ScreenSize[0] / 2 - 512) {
                nearBgPos[i][0] += 512 * nearBgPos.length;
            }
        }


        for (var i = 0; i < obstaclePos.length; i++) {
            obstaclePos[i][0] -= movememtDelta * closeBGSpeed;
            if (obstaclePos[i][0] > 100 - ScreenSize[0] / 2 && obstaclePos[i][0] < 270 - ScreenSize[0] / 2) {
                if (spineManager.damage()) {
                    resetObstacle(i);
                    HP--;
                    if( HP === 0 ){
                        gameFinish();
                    }
                }
            }
            else if (obstaclePos[i][0] < - ScreenSize[0] / 2 - 128) {
                resetObstacle(i);
                score += 1;

            }
        }
        FontSystem.setString("score", "Score : " + score);

        var hptext = "";
        for( var i = 0; i < HP ; i++ ){
            hptext += '@';
        }
        FontSystem.setString("HP", hptext );


        render(delta);
        requestAnimationFrame(update);

    }

    function gameFinish(){
        spineManager.die();
        gameOver = true;
        FontSystem.setVisible("Restart", true);
        sendScore( score );
    }

    function countDown() {
        setTimeout(function () {
            FontSystem.setVisible("CountDown", false);
        }, 4000);

        setTimeout(function () {
            console.log("timeout start");
            FontSystem.setString("CountDown", "Start");
            spineManager.run();
            gameStart = true;
            FontSystem.setVisible("score", true);
            FontSystem.setVisible("HP", true );
        }, 3000);

        setTimeout(function () {
            FontSystem.setString("CountDown", "1");
        }, 2000);

        setTimeout(function () {
            FontSystem.setString("CountDown", "2");
        }, 1000);

        FontSystem.setVisible("CountDown", true);
        FontSystem.setString("CountDown", "3");
        spineManager.setIdle();
    }

    function render(delta) {

        gl.clearColor(bgColor[0], bgColor[1], bgColor[2], 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        resize();


        SpriteShader.bind();
        SpriteShader.setTexture("bg.png");
        for (var i = 0; i < 4; i++) {
            SpriteShader.setAttr(farBgPos[i]);
            SpriteShader.draw();
        }

        SpriteShader.setTexture("ground2.png");
        for (var i = 0; i < 6; i++) {
            SpriteShader.setAttr(nearBgPos[i], 0.5);
            SpriteShader.draw();
        }

        SpriteShader.setTexture("tree.png");
        for (var i = 0; i < 6; i++) {
            SpriteShader.setAttr(nearBgPos[i]);
            SpriteShader.draw();
        }

        SpriteShader.setTexture("obstacle.png");
        for (var i = 0; i < obstaclePos.length; i++) {
            SpriteShader.setAttr(obstaclePos[i]);
            SpriteShader.draw();
        }

        drawUI();
        FontSystem.draw();



       // spineManager.render(delta, false);

    }



    function drawUI(){

        SpriteShader.setTexture("optionUI.png");
        SpriteShader.setAttr([-256,-256]);
        SpriteShader.draw();


        FontSystem.setString("Ranktxt", "1st");
        FontSystem.setPosition("Ranktxt", [-30,140]);

        FontSystem.setString("MyNAME", "A A A");
        FontSystem.setPosition("MyNAME", [-95, 20]);
    };


    socket.on("update_rank", function (data) {
        //console.log('update_rank received', data);
        updateRank(data);
    });




    function resize() {

        var w = ScreenSize[0];
        var h = ScreenSize[1];

        var scaleX = window.innerWidth * devicePixelRatio / w;
        var scaleY = window.innerHeight * devicePixelRatio / h;
        var scale = Math.min(scaleX, scaleY);
        if (scale > 1)
            scale = 1;


        w = Math.floor(w * scale / 10) * 10;
        h = Math.floor(h * scale / 10) * 10;

        if (canvas.width !== w || canvas.height !== h) {
            canvas.width = w;
            canvas.height = h;
        }


        spineManager.resize(scale);

        gl.viewport(0, 0, canvas.width, canvas.height);
    }

    function updateRank(data) {

        for (var i = 0; i < 5; i++) {
            if (i >= data.length)
                break;
            FontSystem.setString("Rank" + i, data[i].name + " " + data[i].score);

        }
    }

    return {
        init: init
    }
    //endregion
}



var main = new GameMain();
main.init();


