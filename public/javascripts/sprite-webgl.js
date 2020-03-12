//스프라이트 뿌리는 쉐이더 세팅
var spriteShader = (function(){


    return {
        bind : _bind,
        setUniformi : _setUniformi,
        setUniform4x4f : setUniform4x4f,
        unbind : _unbind
    }
})();

//이미지들 세팅
var spriteBatcher = (function(){

    return {
        setTexture : _setTexture
    }
})();

//렌더링 부분
var spriteRenderer = (function(){

    return {
        draw : _draw
    }
})();