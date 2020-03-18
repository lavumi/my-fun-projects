var canvas = document.getElementById("canvas");
var gl =  canvas.getContext("webgl", { alpha: false }) || canvas.getContext("experimental-webgl", { alpha: false });

var shaders = {
    simpleShader: {
        vertexShader: 'shader/simple.vert',
        fragmentShader: 'shader/simple.frag',
        attrInfo : ['aVertexPosition'],
        uniInfo : ['uWorldMatrix','uViewMatrix', 'uProjectionMatrix']
    },
    colorShader: {
        vertexShader: 'shader/color.vert',
        fragmentShader: 'shader/color.frag',
        attrInfo : ['aVertexPosition', 'aVertexColor'],
        uniInfo : ['uWorldMatrix','uViewMatrix', 'uProjectionMatrix']
    },
    textureShader: {
        vtxShaderSrc: 
            "attribute vec4 aVertexPosition;"+
            "attribute vec2 uv;"+
            "uniform mat4 uWorldMatrix;"+
            "varying mediump vec2 TexCoords;"+
            "void main() {"+
            "    gl_Position = uWorldMatrix *  aVertexPosition;"+
            "   TexCoords = uv;"+
            "}",
        fragShaderSrc: 
            "uniform sampler2D texture;"+
            "varying mediump vec2 TexCoords;"+
            "void main(){"+
            "   mediump vec4 sampled = texture2D(texture, TexCoords);"+
            "   gl_FragColor = sampled;"+
            "}",
        attrInfo : ['aVertexPosition', 'uv'],
        uniInfo : ['uWorldMatrix', 'texture' ]
    },
    fontShader: {
        vertexShader: 'shader/fontShader.vert',
        fragmentShader: 'shader/fontShader.frag',
        attrInfo : ['aPos', 'aUV'],
        uniInfo : ['uiWorld', 'projection', 'text', 'textColor']
    },
};

//쉐이더 컴파일
var ShaderUtil = {

    initShaders: function(){
        var buildShader = function(gl, type, source) {
            var shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);

            //log any errors
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.log(gl.getShaderInfoLog(shader));
            }
            return shader;
        };
        var createShader =  function( shaderObj,  cb){
            var shaderProgram = gl.createProgram();
            var vertexShader, fragShader;


            vertexShader = buildShader( gl,gl.VERTEX_SHADER, shaderObj.vtxShaderSrc );
            gl.attachShader(shaderProgram, vertexShader);

            fragShader = buildShader( gl,gl.FRAGMENT_SHADER, shaderObj.fragShaderSrc );
            gl.attachShader(shaderProgram, fragShader);
            

            gl.linkProgram(shaderProgram);

            if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
                console.log('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
                cb( null );
                return null;
            }


            var singleShaderInfo = {
                program: shaderProgram,
                attribLocations: { },
                uniformLocations: {  },
            };


            var i ,locationName;
            for( i = 0;i < shaderObj['attrInfo'].length; i++){
                locationName = shaderObj['attrInfo'][i];
                singleShaderInfo.attribLocations[ locationName ] = gl.getAttribLocation(shaderProgram, locationName);
                if(singleShaderInfo.attribLocations[ locationName ] === -1 )
                    console.warn(locationName ,  " is not used in shader ");
            }
            for( i = 0;i < shaderObj['uniInfo'].length; i++){
                locationName = shaderObj['uniInfo'][i];
                singleShaderInfo.uniformLocations[ locationName ] = gl.getUniformLocation(shaderProgram, locationName);

                if(singleShaderInfo.uniformLocations[ locationName ] === -1 )
                    console.warn(locationName ,  " is not used in shader ");
            }

            cb( singleShaderInfo );
        };

        var shaderInfo = {};

        createShader(shaders["textureShader"],  function( result ){
            shaderInfo[ "textureShader" ] = result;
        });
        return shaderInfo;
    },
};

var TextureUtil = {

    textureList : [
        'prcn_data/cha.png',
        'prcn_data/109631.png',
        'prcn_data/ground.jpg'
    ],

    _glTexture : {},

     handleTextureLoaded : function(image, texture) {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);

        this._readyToDraw = true;
    },

    loadTexture: function( cb ){



        var initCount = 0;
        var self = this;


        var loadcallback = function( success, blob ){

            var texture = gl.createTexture();
            self._glTexture[ self.textureList[ initCount ]] = texture;
            var image = new Image();

            image.onload = function() {
                console.log(image);
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
                gl.generateMipmap(gl.TEXTURE_2D);
                initCount++;
                if( initCount < self.textureList.length )
                    loadData( self.textureList[initCount] ,loadcallback,'blob', errCallback);
                else {
                    console.log(self._glTexture);
                    cb();
                }
            };
            image.src = URL.createObjectURL(blob);
        };

        var errCallback =  function(e){console.log(e);};


        loadData( self.textureList[initCount], loadcallback, 'blob',errCallback);

        // var  initTextures = function( index ) {
        //     var texture = gl.createTexture();

        //     var image = new Image();

        //     image.onload = function() {
        //         console.log(image);
        //         gl.bindTexture(gl.TEXTURE_2D, texture);
        //         gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        //         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        //         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        //         gl.generateMipmap(gl.TEXTURE_2D);
        //         gl.bindTexture(gl.TEXTURE_2D, null );
        //         self._glTexture[ self.textureList[ initCount ]] = texture;
        //         initCount++;
        //         if( initCount < self.textureList.length )
        //             initTextures( initCount );
        //         else {
        //             console.log(self._glTexture);
        //             cb();
        //         }
        //     };
        //     image.onerror = function(e){
        //         console.log(e);
        //     }
        //     image.src = self.textureList[initCount];


        // };

        // initTextures( initCount );
    },

    getTexture : function( textureName ){
        return this._glTexture["prcn_data/"+textureName];
    }
};

//스프라이트 뿌리는 쉐이더 세팅
var SpriteShader = (function(){
    var shaderData = {
        program: null,//shaderProgram,
        attribLocations: { },
        uniformLocations: {  },
    };
    var buffer = {
        position: null,
        uv : null,
        indices : null,
    };





    
    var makeBuffer = function(){

        var minX = 0;//this._aabbData[0];
        var minY = 0;//this._aabbData[2];
        var minZ = 0;//this._aabbData[4];
        var maxX = 1;//this._aabbData[1];
        var maxY = 1;//this._aabbData[3];
        var maxZ = 0;//this._aabbData[5];

        const positions = [

            // // Back face
            minX, minY, minZ,
            minX, maxY, minZ,
            maxX, maxY, minZ,
            maxX, minY, minZ,

        ];

        vertexCount = 6;


        const uv = [
           0,0,
            0,1,
            1,1,
            1,0
        ];

        const indices = [
            0,  1,  2,      0,  2,  3,    // front
        ];


        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);




        const uvBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);




        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(indices), gl.STATIC_DRAW);


        buffer.position = positionBuffer;
        buffer.uv = uvBuffer;
        buffer.indices = indexBuffer;
    };

    //쉐이더 생성
    shaderData = ShaderUtil.initShaders().textureShader;
    makeBuffer();
    //버퍼 생성

    function _bind(){
      //  console.log(shaderData);
        gl.useProgram(shaderData.program);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer.position);
        gl.vertexAttribPointer(
            shaderData.attribLocations['aVertexPosition'],
            3, // position x, y, z 3개
            gl.FLOAT,
            false,
            0,
            0);
        gl.enableVertexAttribArray(
            shaderData.attribLocations['aVertexPosition']);


        if(shaderData.attribLocations.hasOwnProperty('uv')){

            gl.bindBuffer(gl.ARRAY_BUFFER, buffer.uv);
            gl.vertexAttribPointer(
                shaderData.attribLocations['uv'],
                2,
                gl.FLOAT,
                true,
                0,
                0);


            gl.enableVertexAttribArray(
                shaderData.attribLocations['uv']);
        }
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer.indices);
    };

    function _setUniformi( name, uniform ){

    };

    function _setUniform4x4f( name, uniform ){

    };

    function _setTexture(  textureName ){

        var texture = TextureUtil.getTexture(textureName);
       // console.log("_setTexture", texture);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);

        gl.uniform1i(shaderData.uniformLocations['texture'], 0);
    };

    function _setLocation( uniform ){
        gl.uniformMatrix4fv(
            shaderData.uniformLocations['uWorldMatrix'],
            false,
            [2,0,0,0,
            0,2,0,0,
            0,0,0,0,
            -1,-1,0,1]);
    };

    function _unbind(){

    };

    function _draw(){
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    };

    return {
        bind : _bind,
        setUniformi : _setUniformi,
        setLocation : _setLocation,
        unbind : _unbind,
        setTexture : _setTexture,
        draw : _draw,
    }
})();



