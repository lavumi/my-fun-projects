var initSpineGL = function(){
    shader = spine.webgl.Shader.newTwoColoredTextured(gl);
    batcher = new spine.webgl.PolygonBatcher(gl);
    mvp.ortho2d(0, 0, canvas.width - 1, canvas.height - 1);
    skeletonRenderer = new spine.webgl.SkeletonRenderer(gl);
    debugRenderer = new spine.webgl.SkeletonDebugRenderer(gl);
    debugRenderer.drawRegionAttachments = true;
    debugRenderer.drawBoundingBoxes = true;
    debugRenderer.drawMeshHull = true;
    debugRenderer.drawMeshTriangles = true;
    debugRenderer.drawPaths = true;
    debugShader = spine.webgl.Shader.newColored(gl);
    shapes = new spine.webgl.ShapeRenderer(gl);
};

//spineData
var animationQueue = [];
var characterID = 109631;
var classID = 2;


var additionAnimations = ['DEAR', 'NO_WEAPON', 'POSING', 'RACE', 'RUN_JUMP', 'SMILE'];

var loading = false;
var loadingSkeleton;
var generalBattleSkeletonData = {};
var generalAdditionAnimations = {};
var currentTexture;
var currentClassAnimData = {
    type: 0,
    data: {}
};
var currentCharaAnimData = {
    id: 0,
    data: {}
};
var currentClass = '1';

var additionAnimations = ['DEAR', 'NO_WEAPON', 'POSING', 'RACE', 'RUN_JUMP', 'SMILE'];

var loading = false;
var loadingSkeleton;
var generalBattleSkeletonData = {};
var generalAdditionAnimations = {};
var currentTexture;
var currentClassAnimData = {
    type: 0,
    data: {}
};
var currentCharaAnimData = {
    id: 0,
    data: {}
};
var currentClass = '1';

//end spineData
function loadSpine(unit_id, class_id) {
    if (loading) return;
    loading = true;
    if (activeSkeleton == unit_id && currentClass == classList.value) return;
    currentClass = class_id;
    var baseUnitId = unit_id | 0;
    baseUnitId -= baseUnitId % 100 - 1;
    loadingSkeleton = { id: unit_id | 0, baseId: '000000' };
//	if (loadingSkeleton.info.hasSpecialBase) loadingSkeleton.baseId = baseUnitId, currentClass = baseUnitId;
    var baseId = loadingSkeleton.baseId;

    if (!generalBattleSkeletonData[baseId])
        loadData('prcn_data/' + baseId + '_CHARA_BASE.cysp', function (success, data) {
            if (!success || data === null) return loading = false;
            generalBattleSkeletonData[baseId] = data;
            loadAdditionAnimation();
        }, 'arraybuffer');
    else loadAdditionAnimation();
}
function loadAdditionAnimation() {
    var doneCount = 0, abort = false;
    var baseId = loadingSkeleton.baseId;
    generalAdditionAnimations[baseId] = generalAdditionAnimations[baseId] || {};
    additionAnimations.forEach(function (i) {
        if (generalAdditionAnimations[baseId][i]) return doneCount++;
        loadData('prcn_data/' + baseId + '_' + i + '.cysp', function (success, data) {
            if (!success || data == null) return abort = true;

            if (abort) return;
            generalAdditionAnimations[baseId][i] = sliceCyspAnimation(data);
            if (++doneCount == additionAnimations.length) loadClassAnimation();
        }, 'arraybuffer');
    });
    if (doneCount == additionAnimations.length) return loadClassAnimation();
}
function loadClassAnimation() {
    if (currentClassAnimData.type == currentClass)
        loadCharaSkillAnimation();
    else
            loadData('prcn_data/' + getClass(currentClass) + '_COMMON_BATTLE.cysp', function (success, data) {
            if (!success || data === null) return loading = false;
            currentClassAnimData = {
                type: currentClass,
                data: sliceCyspAnimation(data)
            }
            loadCharaSkillAnimation();
        }, 'arraybuffer');
}
function loadCharaSkillAnimation() {
    var baseUnitId = loadingSkeleton.id;
    baseUnitId -= baseUnitId % 100 - 1;
    if (currentCharaAnimData.id == baseUnitId)
        loadTexture();
    else
        loadData('prcn_data/' + baseUnitId + '_BATTLE.cysp', function (success, data) {
            if (!success || data === null) return loading = false;
            currentCharaAnimData = {
                id: baseUnitId,
                data: sliceCyspAnimation(data)
            }
            loadTexture();
        }, 'arraybuffer');
}
function loadTexture() {
    loadData('prcn_data/' + loadingSkeleton.id + '.atlas', function (success, atlasText) {
        if (!success) return loading = false;//
        loadData('prcn_data/' + loadingSkeleton.id + '.png', function (success, blob) {
            if (!success) return loading = false;
            var img = new Image();
            img.onload = function () {

                var created = !!window.skeleton.skeleton;
                if (created) {
                    window.skeleton.state.clearTracks();
                    window.skeleton.state.clearListeners();
                    gl.deleteTexture(currentTexture.texture)
                }

                var imgTexture = new spine.webgl.GLTexture(gl, img);
                URL.revokeObjectURL(img.src);
                atlas = new spine.TextureAtlas(atlasText, function (path) {
                    return imgTexture;
                });
                currentTexture = imgTexture;
                atlasLoader = new spine.AtlasAttachmentLoader(atlas);

                var baseId = loadingSkeleton.baseId;
                var additionAnimations = Object.values(generalAdditionAnimations[baseId]);

                var animationCount = 0;
                var classAnimCount = currentClassAnimData.data.count;
                animationCount += classAnimCount;
                var unitAnimCount = currentCharaAnimData.data.count;
                animationCount += unitAnimCount;
                additionAnimations.forEach(function (i) {
                    animationCount += i.count;
                })

                //assume always no more than 128 animations
                var newBuffSize = generalBattleSkeletonData[baseId].byteLength - 64 + 1 +
                    currentClassAnimData.data.data.byteLength +
                    currentCharaAnimData.data.data.byteLength;
                additionAnimations.forEach(function (i) {
                    newBuffSize += i.data.byteLength;
                })
                var newBuff = new Uint8Array(newBuffSize);
                var offset = 0;
                newBuff.set(new Uint8Array(generalBattleSkeletonData[baseId].slice(64)), 0);
                offset += generalBattleSkeletonData[baseId].byteLength - 64;
                newBuff[offset] = animationCount;
                offset++;
                newBuff.set(new Uint8Array(currentClassAnimData.data.data), offset);
                offset += currentClassAnimData.data.data.byteLength;
                newBuff.set(new Uint8Array(currentCharaAnimData.data.data), offset);
                offset += currentCharaAnimData.data.data.byteLength;
                additionAnimations.forEach(function (i) {
                    newBuff.set(new Uint8Array(i.data), offset);
                    offset += i.data.byteLength;
                })

                var skeletonBinary = new spine.SkeletonBinary(atlasLoader);
                var skeletonData = skeletonBinary.readSkeletonData(newBuff.buffer);
                var skeleton = new spine.Skeleton(skeletonData);
                skeleton.setSkinByName('default');
                var bounds = calculateBounds(skeleton);

                animationStateData = new spine.AnimationStateData(skeleton.data);
                var animationState = new spine.AnimationState(animationStateData);
              //  console.log( animationStateData );
                animationState.setAnimation(0, getClass(currentClass) + '_run', true);
                animationState.addListener({
                    /*start: function (track) {
                        console.log("Animation on track " + track.trackIndex + " started");
                    },

                    interrupt: function (track) {
                        console.log("Animation on track " + track.trackIndex + " interrupted");
                    },
                    end: function (track) {
                        console.log("Animation on track " + track.trackIndex + " ended");
                    },
                    disposed: function (track) {
                        console.log("Animation on track " + track.trackIndex + " disposed");
                    },*/
                    complete: function tick(track) {
                        //console.log('complete' + animationQueue.length );
                        if (animationQueue.length) {
                            var nextAnim = animationQueue.shift();
                           // console.log( 'start ' + nextAnim );
                            if (nextAnim == 'stop') return;
                            if (nextAnim == 'hold') return setTimeout(tick, 1e3);

                            distBGSpeed = 100;
                            closeBGSpeed = 400;
                            nextAnim = setAnimName(nextAnim);
                            //console.log(nextAnim);
                            animationState.setAnimation(0, nextAnim, !animationQueue.length);
                        }
                    },
                    /*event: function (track, event) {
                        console.log("Event on track " + track.trackIndex + ": " + JSON.stringify(event));
                    }*/
                });

                window.skeleton = { skeleton: skeleton, state: animationState, bounds: bounds, premultipliedAlpha: true }
                loading = false;
                //(window.updateUI || setupUI)();
                if (!created) {
                    canvas.style.width = '99%';
                    requestAnimationFrame(render);
                    setTimeout(function () {
                        canvas.style.width = '';
                    }, 0)
                }
                activeSkeleton = loadingSkeleton.id;
            }
            img.src = URL.createObjectURL(blob);
        }, 'blob', function (e) {
            var perc = e.loaded / e.total * 40 + 60;
        });
    })
}
function calculateBounds(skeleton) {
    skeleton.setToSetupPose();
    skeleton.updateWorldTransform();
    var offset = new spine.Vector2();
    var size = new spine.Vector2();
    skeleton.getBounds(offset, size, []);
    offset.y = 0
    return { offset: offset, size: size };
}
function setAnimName( animName ){
    var returnName;
    if (animName.substr(0, 6) == '000000') returnName =animName;
    else if (animName.substr(0, 1) != '1') returnName = getClass(currentClassAnimData.type) + '_' + animName;
    else returnName = animName;
    return returnName
}

function spineRender( delta, showDebug ){


    
    window.skeleton.skeleton.x = -1420;
    // Apply the animation state based on the delta time.
    var state = window.skeleton.state;
    var skeleton = window.skeleton.skeleton;
    var premultipliedAlpha = window.skeleton.premultipliedAlpha;
    state.update(delta);
    state.apply(skeleton);
    movementSkeleton( skeleton, movement);
    skeleton.updateWorldTransform();

    // Bind the shader and set the texture and model-view-projection matrix.
    shader.bind();
    shader.setUniformi(spine.webgl.Shader.SAMPLER, 0);
    shader.setUniform4x4f(spine.webgl.Shader.MVP_MATRIX, mvp.values);

    // Start the batch and tell the SkeletonRenderer to render the active skeleton.
    batcher.begin(shader);
    skeletonRenderer.premultipliedAlpha = premultipliedAlpha;
    skeletonRenderer.draw(batcher, skeleton);
    batcher.end();
    
    shader.unbind();

    if  ( showDebug ) {
        debugShader.bind();
        debugShader.setUniform4x4f(spine.webgl.Shader.MVP_MATRIX, mvp.values);
        debugRenderer.premultipliedAlpha = premultipliedAlpha;
        shapes.begin(debugShader);
        debugRenderer.draw(shapes, skeleton);
        shapes.end();
        debugShader.unbind();
    }
}

function movementSkeleton( targetSkeleton, moveX){
    if(moveX < 0){
        targetSkeleton.flipX = true;
    }
    else if(moveX > 0){
        targetSkeleton.flipX = false;
    }
}