const IMG_GRID = [];
const GRID_WIDTH = 40;
const GRID_HEIGHT = 3;
const TILE_IMG =[
    'hidden',
    "images/Grass.png",
    "images/GrassHillLeft.png",
    "images/GrassHillLeft2.png",
    "images/GrassHillRight.png",
    "images/GrassHillRight2.png",
    "images/Dirt.png"
];



let parent = document.getElementsByClassName("container")[0];

parent.style.setProperty('grid-template-columns', 'repeat(' + GRID_WIDTH + ', 6vh)');
parent.style.setProperty('grid-template-rows', 'repeat(' + GRID_HEIGHT + ', 6vh)');

for( let i = 0 ; i < GRID_HEIGHT * GRID_WIDTH ; i ++ ){
    let div = document.createElement("div");
    div.className = "item";
    let img = document.createElement("img");
    div.appendChild(img);
    parent.appendChild(div);


    let x = i % GRID_WIDTH;
    let y = 2 - Math.floor(i / GRID_WIDTH);
    IMG_GRID[x * 3 + y] = img;
}


// for (let index = 0; index < document.getElementsByClassName("container")[0].children.length; index++) {
//     const element = document.getElementsByClassName("container")[0].children[index];
//     let x = index % gridWidth;
//     let y = 2 - Math.floor(index / gridWidth);
//     imgGrid[x * 3 + y] = (element.childNodes[0]);
// }







let mapGrid = [];
for( let x = 0 ; x < GRID_WIDTH ; x ++ ){
    for(let y = 0 ; y < GRID_HEIGHT ; y ++  ){
        if (y === 0 )
        mapGrid.push(1);
        else
        mapGrid.push(0);
    }
}

mapGrid[4*3+0] = 3;
mapGrid[4*3+1] = 2;
mapGrid[5*3+0] = 6;
mapGrid[5*3+1] = 1;
mapGrid[6*3+0] = 5;
mapGrid[6*3+1] = 4;

let drawMap = function(){
    for(let y = 0 ; y < GRID_HEIGHT ; y ++  ){
        for( let x = 0 ; x < GRID_WIDTH ; x ++ ){
            let idx = mapGrid[x*3 + y];
            let imgSrc = TILE_IMG[idx];
            if ( imgSrc === "hidden" ){
                IMG_GRID[x * 3 + y].style.visibility = "hidden";
            }
            else{
                IMG_GRID[x * 3 + y].style.visibility = "visible";
                IMG_GRID[x * 3 + y].src = imgSrc;
            }
        }
    }
    
}
drawMap();


let currentFloor = -1;
let makeRndStep = ()=>{
    let rnd = (Math.random() + 1) * 100 + currentFloor * 20;
    if ( rnd < 110 ){
        currentFloor++;
        return currentFloor === 0 ?   [3, 2, 0] : [ 6, 3, 2];
    }
    else if ( rnd > 190 ){
        currentFloor --;
        return currentFloor === 0 ?  [ 6, 5, 4] : [5, 4, 0];
    }

    if ( currentFloor === -1 ){
        return [1,0,0];
    }

    if ( currentFloor === 0 ){
        return [6,1,0];
    }

    if ( currentFloor === 1 ){
        return [6,6,1];
    }


    return [0,0,0];
}


let moveNext = ()=>{
    for(let i = 0 ; i < GRID_HEIGHT ; i ++ ){
        let item = mapGrid.shift();
        // mapGrid.push(item);
    }
    mapGrid = mapGrid.concat(makeRndStep());
    drawMap();
}


document.getElementsByClassName("container")[0].addEventListener("animationiteration", moveNext);

