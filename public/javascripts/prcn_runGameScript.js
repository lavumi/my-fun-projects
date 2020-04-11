var canvas;
var gl;
var ScreenSize = [1920, 1080];

function GameMain() {


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


    var groundPos = - ScreenSize[0] / 2;
    var bgPos = - ScreenSize[0] / 2;
    var adjustHeight = -60;

    var distBGSpeed = 100;
    var closeBGSpeed = 400;


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
                requestAnimationFrame(update);
            });
        })



        for (var i = 0; i < 6; i++) {
            obstaclePos.push([i * 512 + Math.random() * 50 - 25, -30]);
            farBgPos.push([i * 1024 - 2048, -60 - 512]);
            nearBgPos.push([i * 512 - 1024, -60]);
            treePos.push([i * 512 - 1024, -60]);
        }


        FontSystem.setString("score", "Score : " + score);
        FontSystem.setPosition("score", [0, 470]);

    }

    function initInput() {
        keyMap = {};
        document.addEventListener('keydown', function (event) {
            if (keyMap[event.code] === true) return;

            // if(event.code === 'ArrowRight' ){
            //     runChar( false);
            // }
            // else if (event.code === 'ArrowLeft'){
            //     runChar( true);
            // }
            // else if (event.code === 'KeyA'){
            //     attackChar();
            // }
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
                spineManager.jump();
            }

            keyMap[event.code] = true;

        }, false);

        document.addEventListener('keyup', function (event) {

            // if(event.code === 'ArrowRight'){
            //     stopChar();
            // }
            // else if (event.code === 'ArrowLeft'){
            //     stopChar();
            // }

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





    function update() {


        var now = Date.now() / 1000;
        var delta = now - lastFrameTime;
        lastFrameTime = now;
        delta *= speedFactor;

        movememtDelta = delta * spineManager.getSpeed();

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
                }
            }
            // else if ( obstaclePos[i][0] <= 100 - ScreenSize[0] / 2 && obstaclePos[i][0] >= - ScreenSize[0] / 2 - 128){

            // }
            else if (obstaclePos[i][0] < - ScreenSize[0] / 2 - 128) {
                resetObstacle(i);
                score += 1;

            }
        }


        FontSystem.setString("score", "Score : " + score);
        render(delta);
        requestAnimationFrame(update);
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

        // SpriteShader.bind();
        SpriteShader.setTexture("obstacle.png");
        for (var i = 0; i < obstaclePos.length; i++) {
            SpriteShader.setAttr(obstaclePos[i]);
            SpriteShader.draw();
        }


        FontSystem.draw();



        spineManager.render(delta, false);

    }







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

    return {
        init : init
    }
    //endregion
}