class DrawLine {
    static init(){
        //create canvases and menus
        Interface.init();
        //draw the grid in draw space
        Grid.drawGrid();
        console.log('Method >Grid< drawed');
        //create envents for listen a click, mouseMove, mouseUp...
        Events.init();
        console.log('Method >drawCursor< started');
        //set draw mode (for draw line) (is a custom draw mode)
        Interface.setDrawMode('line');
        return new DrawLine();
    }
}


class Interface {

    //is a value has got a current drawLogic function
    static drawMode;

    //is a size of canvases
    static drawBoxSize = {
        width: 601,
        height: 601,
    };

    //is a canvases and contexts of canvas for draw a background
    backgroundCtx;
    backgroundCanv;

    gridCtx;
    gridCanv;

    drawBoxCtx;
    drawBoxCanv;

    cursorCtx;
    cursorCanv;

    drawCtx;
    drawCanv;

    //function of draw a canvases and menus
    static init(){
        this.initCanvases(Interface.drawBoxSize.width, Interface.drawBoxSize.height);
        console.log('Class >Interface< started');
    }

    //draw canvases
    static initCanvases(width, height){
        //create the canvas

        function createContainerForCanvases(){
            let paint = document.createElement('div');
            paint.setAttribute('class', 'paint');

            let canvases = document.createElement("div");
            canvases.setAttribute("class", 'canvases');
            paint.appendChild(canvases);
            canvases.setAttribute('width', width);
            canvases.setAttribute('height', height);

            document.body.appendChild(paint);

            canvases.style.border = '1px solid white';
            return canvases;
        }

        let canvases = createContainerForCanvases();

        function createCanv(){
                let canv = document.createElement('canvas');
                canv.setAttribute('class', 'canvas');
                canvases.appendChild(canv);
                canv.setAttribute('width', width);
                canv.setAttribute('height', height);
                return canv;
        }

        function createBackground() {
            let backgroundCanv = createCanv();
            backgroundCanv.setAttribute('id', 'backgroundCanv');
            Interface.backgroundCanv = backgroundCanv;    
            Interface.backgroundCtx = backgroundCanv.getContext('2d');        
        }

        function createGrid() {
            let gridCanv = createCanv();
            gridCanv.setAttribute('id', 'gridCanv');
            Interface.gridCanv = gridCanv;
            Interface.gridCtx = gridCanv.getContext('2d');
        }

        function createDrawBox() {
            let drawBoxCanv = createCanv();
            drawBoxCanv.setAttribute('id', 'drawBoxCanv');
            Interface.drawBoxCanv = drawBoxCanv;
            Interface.drawBoxCtx = drawBoxCanv.getContext('2d');
        }

        function createAuxiliaries() {
            //actual cursor and drawing line
            function cursor(){
                let cursorCanv = createCanv();
                cursorCanv.setAttribute('id', 'cursorCanv');
                Interface.cursorCanv = cursorCanv;
                Interface.cursorCtx = cursorCanv.getContext('2d');
            }

            function draw(){
                let drawCanv = createCanv();
                drawCanv.setAttribute('id', 'drawCanv');
                Interface.drawCanv = drawCanv;
                Interface.drawCtx = drawCanv.getContext('2d');
            }
            draw();
            cursor();
        }

        createBackground();
        createGrid();
        createDrawBox();
        createAuxiliaries();

    }

    //function for change the draw mode (line, circle...)
    static setDrawMode(value){
        switch(value){
            case "line":
                Interface.drawMode = Line.lineLogic;
                break;
            case "circle":
                Interface.drawMode = Circle.circleLogic;
        }
        console.log('drawMode >'+ value +'< setted');
    }

    //function for wheel the grid in draw space
    static wheelGrid(e = Events.e){   

        let max = Grid.cellCount <= 300;
        let min = Grid.cellCount >= 1;
        let interval = max && min;
    
        if(interval && e.deltaY > 0 || !max){
            Grid.cellCount -= 1;
        }else{
            Grid.cellCount += 1;
        }
        Grid.drawGrid(Grid.cellCount);
    }
}

class Events {
    
    //add events
    static init(){
        Events.mouseEvents();
        console.log('Class >Events< started');
    }
    //add mouse events
    static mouseEvents(){
        Interface.cursorCanv.addEventListener('mouseup', function(e) {
            Interface.drawMode(e, 'MouseUp');
        });
        
        Interface.cursorCanv.addEventListener('mousemove', function(e){
            Interface.drawMode(e, 'MouseMove');
            //draw the cursor
            Cursor.drawCursor();
        });

        Interface.cursorCanv.addEventListener('mousedown', function(e) {
            Line.isMouseDown = true;
        });

        Interface.cursorCanv.addEventListener('wheel', function(e){
            Interface.wheelGrid(e);
        });

        Interface.cursorCanv.addEventListener('click', function(e){
            Interface.drawMode(e, 'Click');
        });
    }
}

class Coord {

    //is a first coord
    static endedCoord = {
        x: -1,
        y: -1,
    }
    
    //is a second coord
    static startedCoord = {
        x: -1,
        y: -1,
    }

    //Is a magnetized coordinates to the grid
    static coordX = -1;
    static coordY = -1;

    //set a coordX and coordY
    static customRound(e) {
        let x = e.layerX - Interface.gridCanv.offsetLeft;
        let y = e.layerY - Interface.gridCanv.offsetTop;
        Coord.coordX = Grid.widthCube * Math.round(x / Grid.widthCube);
        Coord.coordY = Grid.widthCube * Math.round(y / Grid.widthCube);
    }

    //set 'endedCoord' for draw
    static setEndedCoord(){
        Coord.endedCoord.x = Coord.coordX;
        Coord.endedCoord.y = Coord.coordY;
    }

    //set 'startedCoord' for draw
    static setStartedCoord(){
        Coord.startedCoord.x = Coord.coordX;
        Coord.startedCoord.y = Coord.coordY;
    }

    //say the cords
    static sayCoords(event){
        let coordX = Coord.coordX;
        let coordY = Coord.coordY;
        console.log(event, coordX / Grid.widthCube, coordY / Grid.widthCube);
    }
    
}

//is a class for grid.
//grid logic and how to draw a grid
class Grid {
    static drawMode = 'grid';

    static color = 'white';
    static width = 0.7;

    static cellCount = 10;
    static widthCube;

    static visibility = true;

    static drawGrid(cellCount = Grid.cellCount, ctx = Interface.gridCtx){
        Figure.clear(ctx);

        Grid.widthCube = Interface.drawBoxSize.width / cellCount;

        ctx.lineWidth = Grid.widthLine;
        ctx.strokeStyle = Grid.color;
    
        for (let n = 0; n < cellCount*Grid.widthCube; n+=Grid.widthCube) {
        for (let t = 0; t < cellCount*Grid.widthCube; t+=Grid.widthCube){
            ctx.beginPath();
            ctx.strokeRect(n, t, Grid.widthCube, Grid.widthCube);
            ctx.closePath();
            ctx.stroke();
            }
        }
    }


}

class Cursor {

    static color = 'red';
    static radius = 3;

    static visibility = true;

    static drawCursor(ctx = Interface.cursorCtx){

        if(!Cursor.visibility){
            return;
        }

        Figure.clear(ctx);

        ctx.fillStyle = Cursor.color;
        ctx.beginPath();
        ctx.arc(Coord.coordX, Coord.coordY, Cursor.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }
}

//is abstract class for custom props for other figures
class Figure {

    static drawing;
    static isMouseDown = false;

    static width = 0.5;
    static color = 'blue';
    static auxiliarieColor = 'red';

    static clear(ctx = Interface.gridCtx){
        let width = Interface.drawBoxSize.width;
        let height = Interface.drawBoxSize.height;
        ctx.clearRect(0, 0, width, height); 
    }
}

//is a class for draw line
//and how to draw a line
class Line extends Figure {

    //how to draw the line
    static drawLine(ctx, color = Line.color){
        let startedCoord = Coord.startedCoord;
        let endedCoord = Coord.endedCoord;

        ctx.strokeStyle = color;
        ctx.lineWidth = Line.width;
        ctx.beginPath();
        ctx.moveTo(startedCoord.x, startedCoord.y);
        ctx.lineTo(endedCoord.x, endedCoord.y); 
        ctx.closePath();
        ctx.stroke();
      
    }

    //logic for draw the line
    static lineLogic(e, value){

        Coord.customRound(e);

        function up(){
            Line.clear(Interface.drawCtx);

            Coord.setEndedCoord();
            if(Line.isMouseDown && Line.drawing){
                Line.drawLine(Interface.drawBoxCtx, Line.color)
                Coord.sayCoords('DRAWING END');
            }
            Line.isMouseDown = false;
            Line.drawing = false;
        }

        function move(){
            Coord.setEndedCoord();

            if (Line.isMouseDown && !Line.drawing){
                Coord.sayCoords('DRAWING FROM');
                Line.drawing = true;
            
                Coord.setStartedCoord();
            }

            //draw the line
            
            if(Line.isMouseDown && Line.drawing) {
                Line.clear(Interface.drawCtx);
                Line.drawLine(Interface.drawCtx, Line.auxiliarieColor);
            }
        }

        if(value == 'MouseUp'){
            up();
        }else if(value == 'MouseMove'){
            move();
        }
    }
}


//start the program
window.onload = function(){
    let drawLine = DrawLine.init();
}