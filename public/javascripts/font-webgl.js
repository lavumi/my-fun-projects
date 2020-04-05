var FontSystem = (function(){

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
    var vertexCount = 0;

   var  myFontData = {};
   var fontAtlas = null;

   var currentString = "";
    
   function loadFont(){
        function loadDoc() {
            var req = new XMLHttpRequest();
            req.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    parse(this);
                }
            };
            req.open("GET", "font/myFont.xml", true);
            req.send();
        }
    
        function parse(xml) {
            var i;
            var xmlDoc = xml.responseXML;   
            var chars = xmlDoc.getElementsByTagName("Char");
            for( var i = 0 ; i <chars.length ; i ++ ){
    
                var char = chars[i].getAttribute('code');
                var width = chars[i].getAttribute('width');
                var offset = chars[i].getAttribute('offset').split(' ');
                var rect = chars[i].getAttribute('rect').split(' ');
    
                myFontData[char] = {
                    width : width,
                    offset : offset,
                    rect : rect
                }
                
            }

            _loadFontAtlas( 'myFont' );
        }

        loadDoc();
    };

    var loadfinished = false;
    function _loadFontAtlas( atlas ){
        var texture = gl.createTexture();
        var image = new Image();

        image.onload = function(){
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.bindTexture(gl.TEXTURE_2D, null );
            fontAtlas = texture;
            _loadShader();
            _makeBuffer();
            loadfinished = true;
        };

        image.onerror = function(e){
            console.error( "image load fail :" + atlas + " error : "+ e );
        }

        image.src = 'font/' + atlas + ".png";
    }


    function _loadShader(){
        shaderData = ShaderUtil.initShaders('fontShader').fontShader;
    };

    function _makeBuffer(){

        var positions = [];
        var uv = [];
        var indices = [];


        var string = currentString;
        if( currentString = "")
            return;

        var fontStartPos = [0,0];

        vertexCount = 0;
        for( var i = 0; i < string.length ; i++ ){

            if( string[i] === " "){
                fontStartPos[0] += 30 / 512;
                continue;
            }
            var fontData = myFontData[ string[i]];

            var X =         fontData.rect[0] / 512;
            var Y =         fontData.rect[1] / 512;
            var offsetX =   fontData.offset[0] / 512;
            var offsetY =   fontData.offset[1] / 512
            var width =     fontData.rect[2] / 512;
            var height =    fontData.rect[3] / 512;
    
            var minX = offsetX + fontStartPos[0];
            var minY = offsetY + fontStartPos[1];
            var minZ = 0;
            var maxX = offsetX + fontStartPos[0] + width;
            var maxY = offsetY + fontStartPos[1] + height;
            var maxZ = 0;


            fontStartPos[0] += fontData.width / 512;
    
            positions.push( minX);
            positions.push( minY);
            positions.push( minZ);
    
            positions.push( minX);
            positions.push( maxY);
            positions.push( minZ);
    
            positions.push( maxX);
            positions.push( maxY);
            positions.push( minZ);
    
            positions.push( maxX);
            positions.push( minY);
            positions.push( minZ);
    
    

    


            uv.push(X);
            uv.push(Y + height);

            uv.push(X);
            uv.push(Y);

            uv.push(X + width);
            uv.push(Y);

            uv.push(X + width);
            uv.push(Y + height);

    

            indices.push(0 + 4 * vertexCount / 6);
            indices.push(1 + 4 * vertexCount / 6);
            indices.push(2 + 4 * vertexCount / 6);

            indices.push(0 + 4 * vertexCount / 6);
            indices.push(2 + 4 * vertexCount / 6);
            indices.push(3 + 4 * vertexCount / 6);
            vertexCount += 6;

        }



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

    function _bind(){

        if( buffer.position === null )
        return;

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
  
          gl.uniformMatrix4fv(
              shaderData.uniformLocations['uVPMatrix'],
              false,
              [2 ,     0,     0,      0,
              0,      2 ,     0,      0,
              0,      0,     1,      0,
              0 ,     0,     0,      1]);
  
  
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer.indices);
          gl.enable(gl.BLEND);
          gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA  );
    };

    function _setFont( fontName ){
       // var texture = TextureUtil.getTexture(fontName);
        
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, fontAtlas );
        gl.uniform1i(shaderData.uniformLocations['texture'], 0);
    };

    function _setLocation(x,y){

        var width = 512 / ScreenSize[0]  ;
        var height = 512 / ScreenSize[1]  ;

        var position = {
            x : x / ScreenSize[0],
            y : y / ScreenSize[1],
        };
        
        gl.uniformMatrix4fv(
            shaderData.uniformLocations['uWorldMatrix'],
            false,
            [ width,0,0,0,
            0, height,0,0,
            0,0,1,0,
            position.x, position.y, 0,      1]);
    };

    function _draw(){
        if( loadfinished === false )
            return;

        if( buffer.position === null )
            return;
       // _bind();
       // _setFont();
       // _setLocation(400, -500);
        gl.drawElements(gl.TRIANGLES, vertexCount, gl.UNSIGNED_SHORT, 0);
    };

    function _setString( string ){
        currentString = string;
        _makeBuffer();
    };

    return {
        loadFont : loadFont,
        setString : _setString,
        bind : _bind,
        setLocation : _setLocation,
        draw : _draw,
        setFont : _setFont,
    }
})();


