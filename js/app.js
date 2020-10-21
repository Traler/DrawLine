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

    viewPanel;

    //function of draw a canvases and menus
    static init(){
        //draw the menu
        this.initMenu();
        this.initCanvases(Interface.drawBoxSize.width, Interface.drawBoxSize.height);
        console.log('Class >Interface< started');
        this.initViewPanel();
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

    static initViewPanel(){
        let viewPanel = document.createElement("div"); 
        viewPanel.setAttribute('class', 'coordView');

        Interface.cursorCanv.parentNode.appendChild(viewPanel);
        viewPanel.style.display = 'none';
        Interface.viewPanel = viewPanel;
    }

    static menu = {
        File: {
            'New document': {
                call: Interface.CreateNewDoc,
            },
            "Import": {
                "Image background": {
                    call: Interface.changeBackground,
                },
                "Line list": {
                    call: null,
                },
            },
            'Save as image': {
                call: Interface.saveAsImage,
            },
            'Save as line list': {
                call: null,
            },
        },
        View: {
            'CoordView': {
                call: Interface.CoordViewPanel,
                switchable: "Off",
            },
            'Grid': {
                call: Interface.gridView,
                switchable: "On",
            },
        },
        'Draw Mode':{
            'Line': {
                call: () => {Interface.setDrawMode('line')},
            },
            'Circle': {
                call: () => {Interface.setDrawMode('circle')},
            },
            'Bezier curve': {
                call: () => {Interface.setDrawMode('bezierCurve')},
            }
        }
    };

    static initMenu(){

        let headerTag = document.createElement("header");

        let menuTag = document.createElement("div");
        menuTag.setAttribute("class", "horizontal-menu");

        let menuUlTag = document.createElement("ul");

        menuTag.appendChild(menuUlTag);
        headerTag.appendChild(menuTag);

        document.body.appendChild(headerTag);

        function levelConstructor(contextTag, items) {
            let levelKeys = Object.keys(items);
        
            levelKeys.forEach((menuItemName) => {
                let liTag = document.createElement("li");
                let divTag = document.createElement("div");
                divTag.innerHTML = menuItemName;

                liTag.appendChild(divTag);

                contextTag.appendChild(liTag);

                const menuItem = items[menuItemName];
    
                if("call" in menuItem) {
                    liTag.addEventListener('click', menuItem.call);
                        if("switchable" in menuItem){
                            let rightLi = document.createElement('div');
                            liTag.appendChild(rightLi);
                            rightLi.innerHTML = menuItem.switchable;

                            liTag.addEventListener('click', function(e){
                                if(rightLi.innerHTML == 'On'){
                                    rightLi.innerHTML = 'Off';
                                }else if(rightLi.innerHTML == 'Off'){
                                    rightLi.innerHTML = 'On';
                                }
                               
                            });

                            menuItem.switchable = rightLi;
                            rightLi.setAttribute('class', 'rightLi');
                        }
                    return;
                }

                let ulTag = document.createElement("ul");
                liTag.appendChild(ulTag);

                levelConstructor(ulTag, menuItem);
            });
        }

        levelConstructor(menuUlTag, Interface.menu);
    }

    //draw the coord panel
    static coordPanelLogic(){
        let viewPanel = Interface.viewPanel;
        let coordX = Coord.coordX / Grid.widthCube;
        let coordY = Coord.coordY / Grid.widthCube;

        let string = `x: ${coordX} | y: ${coordY}`;

        if(!(coordX == coordY && Grid.cellCount / 2 == coordX)){
            viewPanel.innerHTML = string;
        }else{
            viewPanel.innerHTML = 'centre ' + string;
        }

        viewPanel.style.left = Coord.coordX;
        viewPanel.style.top = Coord.coordY;
    }

    //on or off the coord panel
    static CoordViewPanel() {
        let viewPanel = Interface.viewPanel;
        let switchable = Interface.menu.View.CoordView.switchable;

        if(switchable.innerHTML == 'Off'){
            viewPanel.style.display = 'block';
        }else if(switchable.innerHTML == 'On'){
            viewPanel.style.display = 'none';
        }
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
            //draw the coord panel
            Interface.coordPanelLogic();
        });

        Interface.cursorCanv.addEventListener('mousedown', function(e) {
            Line.isMouseDown = true;
        });

        Interface.cursorCanv.addEventListener('wheel', function(e){
            Grid.wheel(e);
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
    static wheelGrid = true;

    static drawGrid(cellCount = Grid.cellCount, ctx = Interface.gridCtx){
        if(!Grid.visibility){
            return;
        }
        Figure.clear(ctx);

        Grid.widthCube = Interface.drawBoxSize.width / cellCount;

        ctx.lineWidth = Grid.width;
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

    //function for wheel the grid in draw space
    static wheel(e){   
        if(!Grid.wheelGrid){
            return;
        }

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

class History {

    static history = [];

    static setHistory(type){
        History.history.push(
            [
                {
                    x: Coord.startedCoord.x,
                    y: Coord.startedCoord.y
                },
                {
                    x: Coord.endedCoord.x,
                    y: Coord.endedCoord.y
                },
                {
                    color: Line.color,
                    width: Line.width,
                },
                type,
            ]
        );
    }

    static drawLinesFromObject(lineList, ctx = Interface.drawBoxCtx) {

        lineList.forEach((lineCoords) => {
            ctx.beginPath();
            ctx.strokeStyle = lineCoords[2]['color'];
            ctx.lineWidth = lineCoords[2]['width'];

            if(lineCoords[3] == 'line'){
                ctx.moveTo(lineCoords[0].x, lineCoords[0].y);
                ctx.lineTo(lineCoords[1].x, lineCoords[1].y);
            }else if (lineCoords[3] == 'bezierCurve'){
                ctx.bezierCurveTo(
                    lineCoords[1].x,
                    lineCoords[1].y, 
                    lineCoords[4].inclineX, 
                    lineCoords[4].inclineY, 
                    lineCoords[0].x, 
                    lineCoords[0].y
                );
            }

            ctx.stroke();
            ctx.closePath();
            
        });

    }

    static undo(history = History.history){
        history.pop();
        Figure.clear(Interface.drawBoxCtx);
        History.drawLinesFromObject(history);
    }

    static saveAsLineList(history = History.history){
        let a = document.createElement("a"); 

        document.body.appendChild(a);
        a.style.display = 'none';

        let str = JSON.stringify(history, null, 3);
        
        let file = new Blob([str], {type: "text/javascript"});
        a.href = URL.createObjectURL(file);
        a.download = 'Line List.txt';
        a.click();
        
        a.parentNode.removeChild(a);
    }

    static openLineList(color, width){
        let input = document.createElement("input"); 

        document.body.appendChild(input);
        input.style.display = 'none';
        input.type = 'file';

        input.addEventListener('change', function(e){
            let file = e.target.files[0];

            if (!file) {
                return;
            }
            let reader = new FileReader();

            reader.onload = function(e) {
                let data = e.target.result;
                
                let parseData = JSON.parse(data);

                color = prompt('color:', '#00ff08');
                width = prompt('width:', 1);
                width = Number(width);

                if(typeof color == 'string' && typeof width == 'number'){
                    parseData.forEach(function(item, index){
                        parseData[index][2].width = width;
                     parseData[index][2].color = color;
                     })
                }
                
                History.history = History.history.concat(parseData); 
                
                History.drawLinesFromObject(parseData);
            };
            reader.readAsText(file);
        });

        input.click();
        input.parentNode.removeChild(input);
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
                History.setHistory('line');
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