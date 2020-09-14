'use strict';

let canvases        = document.querySelectorAll('.canvas');

let backgroundCanv  = canvases[0];
let gridCanv        = canvases[1];
let imageCanv       = canvases[2];
let drawCanv        = canvases[3];
let cursorCanv      = canvases[4];


let backgroundCtx   = backgroundCanv.getContext('2d');             //ctx for background
let gridCtx         = gridCanv.getContext('2d');                   //ctx for grid
let imageCtx        = imageCanv.getContext('2d');                  //ctx for view or save
let drawCtx         = drawCanv.getContext('2d');                   //ctx for drawing
let cursorCtx       = cursorCanv.getContext('2d');                 //ctx for cursor

let setDrawColor    = document.querySelector('#inputColor');       //input the draw color
let coordView       = document.querySelector('.coordView');        //the coords panel

let viewCoord       = document.querySelector('#viewCoords');       //config On | Off for the coords panel 
 
let widthGrid       = document.querySelector('#widthGrid');        //input width of line in grid

let setFigure       = document.querySelectorAll('li > svg');       //svg config

let save            = document.querySelector('.save');             //save the image
let setBackground   = document.querySelector('.changeBackground'); //change background

let saveAsLineListBtn = document.querySelector('.saveAsLineList'); //save as file for redraw
let openLineListBtn   = document.querySelector('#openLineList');   //open the line list
let newDocument       = document.querySelector('.newDocument');    //create a new document
let viewGrid          = document.querySelector('.viewGrid');
let viewBoolGrid      = document.querySelector('.viewBoolGrid');

class Paint {
    //for grid
    widthCube;
    cellCount = 10;
    boolGrid = true;

    //config color
    cursorColor = 'blue';
    drawColor = 'red';
    circleColor = this.cursorColor;
    widthLine = 1;
    widthCubeLine;

    //coords
    startedCoord = {x: -1, y: -1};
    endedCoord = {x: -1, y: -1};

    //for mouseDown
    isMouseDown = false;
    drawing;

    //for key Press
    keyQPress = false;
    keyPressed = false;

    //for clircle
    startAngle = 0;
    endAngle = 2 * Math.PI;
    arrow = false;

    history = [];

    constructor(cellCount = 10, cursorColor = 'blue', drawColor = 'red'){
        this.cellCount = cellCount;
        this.cursorColor = cursorColor;
        this.drawColor = drawColor;
    }

    //draw functions

    clear(ctx = gridCtx){
        ctx.clearRect(0, 0, gridCanv.width, gridCanv.height); 
    }

    drawGrid(cellCount = this.cellCount, widthLine = this.widthCubeLine){
        if(this.boolGrid){
            this.widthCube = gridCanv.width / cellCount;
            let widthCube = this.widthCube;
            
            this.clear();
        
            gridCtx.lineWidth = widthLine;
        
            for (let n = 0; n < cellCount*widthCube; n+=widthCube) {
            for (let t = 0; t < cellCount*widthCube; t+=widthCube){
                gridCanv.parentElement.style.border = '1px solid white';
                gridCtx.strokeStyle = 'white';
                gridCtx.beginPath();
                gridCtx.strokeRect(n, t, widthCube, widthCube);
                gridCtx.closePath();
                gridCtx.stroke();
            }
            }
            gridCtx.lineWidth = this.widthLine;
        }
    }

    drawLine(ctx, startedCoord, endedCoord, color){
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.moveTo(startedCoord.x, startedCoord.y);
        ctx.lineTo(endedCoord.x, endedCoord.y);
        ctx.stroke(); 
        ctx.closePath();
    }
    
    drawCursor(x, y){
        let widthLine = gridCtx.lineWidth + 4;
        let widthLine2 = (gridCtx.lineWidth / 0.5);
      
        let lineX = x - widthLine2;
        let lineY = y - widthLine2;
        
        this.clear(cursorCtx, cursorCanv);
        cursorCtx.beginPath();
        cursorCtx.lineWidth = 0;
        cursorCtx.fillStyle = this.cursorColor;
        cursorCtx.fillRect(lineX, lineY, widthLine, widthLine);
        cursorCtx.lineWidth = gridCtx.lineWidth;
        cursorCtx.closePath();
    }

    drawCircle(x, y, ctx = imageCtx, color = this.circleColor){
        this.clear(cursorCtx);
        ctx.beginPath();
        ctx.lineWidth = 0;
        ctx.strokeStyle = color;
        ctx.arc(x, y, this.widthCube, this.startAngle, this.endAngle, this.arrow);
        ctx.lineWidth = gridCtx.lineWidth;
        ctx.stroke();
    }

    //coord functions

    customRound(coord) {
        return this.widthCube * Math.round(coord / this.widthCube);
    }
      
    localCoord(e){
        return {
            x: e.layerX - gridCanv.offsetLeft,
            y: e.layerY - gridCanv.offsetTop,
        };
    }
    
    setEndedCoord(x, y){
        this.endedCoord.x = this.customRound(x);
        this.endedCoord.y = this.customRound(y);
    }
    
    sayCoords(event, x, y){
        let coordX = this.customRound(x) / this.widthCube;
        let coordY = this.customRound(y) / this.widthCube;
        console.log(event, coordX, coordY);
    }

    viewCoords(x, y){

        let coordX = Math.round(x / this.widthCube);  
        let coordY = Math.round(y / this.widthCube);

        let string = `x: ${coordX} | y: ${coordY}`;

        if(!(coordX == coordY && this.cellCount / 2 == coordX)){
            coordView.innerHTML = string;
        }else{
            coordView.innerHTML = 'centre ' + string;
        }

        coordView.style.left = x;
        coordView.style.top = y;
    }
    
    //functions

    undo(history = this.history){
        history.pop();
      
        this.clear(imageCtx);
        this.drawLinesFromObject(history);
    }

    drawLinesFromObject(lineList) {
        lineList.forEach((lineCoords) => {
          imageCtx.beginPath();
          imageCtx.strokeStyle = this.drawColor;
          imageCtx.moveTo(lineCoords[0].x, lineCoords[0].y);
          imageCtx.lineTo(lineCoords[1].x, lineCoords[1].y);
          imageCtx.stroke();
          imageCtx.closePath();
        });
    }
    
    wheelGrid(e){
        let max = this.cellCount <= 300;
        let min = this.cellCount >= 1;
        let interval = max && min;
      
        this.clear(cursorCtx, cursorCanv);
        
        if(interval && e.deltaY > 0 || !max){
          this.cellCount -= 1;
        }else{
          this.cellCount += 1;
        }
        this.drawGrid(this.cellCount);
    }

    //horizontal-menu functions

    saveImage(canvas = imageCanv) {
        let url = canvas.toDataURL();

        let a = document.createElement("a"); 

        document.body.appendChild(a);
        a.style.display = 'none';
        
        a.href = url;
        a.download = 'My image';
        a.click();
        
        a.parentNode.removeChild(a);
    }

    changeBackground(){
        backgroundCanv.style.backgroundImage = "url('" + prompt('Change image url for background') + "')";
    }

    saveAsLineList(){
        let a = document.createElement("a"); 

        document.body.appendChild(a);
        a.style.display = 'none';

        let strA = JSON.stringify(paint.history);
        
        let file = new Blob([strA], {type: "text/javascript"});
        a.href = URL.createObjectURL(file);
        a.download = 'Line List.txt';
        a.click();
        
        a.parentNode.removeChild(a);
    }

    openLineList(){
        let that = this;
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
                that.history = that.history.concat(parseData); 
                
                that.drawLinesFromObject(parseData);
            };
            reader.readAsText(file);
        });

        input.click();
        input.parentNode.removeChild(input);
    }

    //logic

    mouseEvents(){
        let that = this;

        cursorCanv.addEventListener('mouseup', function(e) {
            let x = that.localCoord(e).x;
            let y = that.localCoord(e).y;
        
            that.setEndedCoord(x, y);
        
            that.clear(drawCtx, drawCanv);

            //draw the line
        
            if(that.isMouseDown && that.drawing){
                that.sayCoords('DRAWING END', x, y)
                that.drawLine(imageCtx, that.startedCoord, that.endedCoord, that.drawColor);
                that.history.push([
                    {x: that.startedCoord.x, y: that.startedCoord.y},
                    {x: that.endedCoord.x, y: that.endedCoord.y},
                ]);
            }
            that.isMouseDown = false;
            that.drawing = false;

            //draw the circle
            if(that.keyQPress){
                that.drawCircle(that.customRound(x), that.customRound(y), imageCtx, that.drawColor);
                that.sayCoords('DRAWING CIRCLE RADIUS', x, y)
            }
        });
        
        cursorCanv.addEventListener('mousemove', function(e){
            let x = that.localCoord(e).x;
            let y = that.localCoord(e).y;

            let xRounded = that.customRound(x);
            let yRounded = that.customRound(y);
        
            that.setEndedCoord(xRounded, yRounded);

            that.viewCoords(xRounded, yRounded);

            that.drawCursor(xRounded, yRounded);
        
            if (that.isMouseDown && !that.drawing){
                that.sayCoords('DRAWING FROM', x, y);
                that.drawing = true;
            
                that.startedCoord.x = xRounded;
                that.startedCoord.y = yRounded;
            }

            //draw the line
            
            if(that.isMouseDown && that.drawing) {
                that.clear(drawCtx, drawCanv);
                that.drawLine(drawCtx, that.startedCoord, that.endedCoord, that.cursorColor);
            }

            //draw the circle

            if(that.keyQPress){
                that.drawCircle(that.customRound(x), that.customRound(y), cursorCtx);
            }
        });

        cursorCanv.addEventListener('mousedown', function(e) {
            that.isMouseDown = true;
        });

        cursorCanv.addEventListener('wheel', function(e) {
            that.wheelGrid(e);
        });
    }

    eventKeyPress(){
        let that = this;

        document.addEventListener("keypress", function(e){
            if('KeyS' == e.code){
                save.click();
            }
            if('KeyZ' == e.code){
                that.undo();
            }
            if('KeyI' == e.code){
                that.changeBackground();
            }
            if('KeyC' == e.code){
                if(!that.keyPressed){
                    that.clear();
                    that.keyPressed = true;
                }else{
                    that.drawGrid();
                    that.keyPressed = false;
                }
            }
            if('KeyQ' == e.code){
                if(that.keyQPress == true){
                    that.keyQPress = false;
                }else{
                    that.keyQPress = true;
                }
            }
        });
    }

    eventClickListener(){
        let that = this;

        viewCoord.parentElement.addEventListener('click', function(){
            if(viewCoord.innerHTML == 'On'){
                viewCoord.innerHTML = 'Off';
                coordView.style.display = 'none';
            }else{
                viewCoord.innerHTML = 'On';
                coordView.style.display = 'block';
                that.viewCoords(0, 0);
            }
        });

        viewGrid.addEventListener('click', function(){
            if(viewBoolGrid.innerHTML == 'On'){
                viewBoolGrid.innerHTML = 'Off';
                that.boolGrid = false;
            }
            if(viewBoolGrid.innerHTML == 'Off'){
                viewBoolGrid.innerHTML = 'On';
                that.boolGrid = true;
            }
        });

        setFigure.forEach(function(elem) {
            elem.addEventListener('click', function(){
                that.keyQPress = true;
                let figure  = setFigure;
        
                if(figure[8] == elem){
                    that.startAngle = 0;
                    that.endAngle = 2 * Math.PI;
                    that.arrow = false;
                }
                if(figure[0] == elem){
                    that.startAngle = 1 * Math.PI;
                    that.endAngle = 1.5 * Math.PI;
                    that.arrow = false;
                }
                if(figure[2] == elem){
                    that.startAngle = 1 * Math.PI;
                    that.endAngle = 2 * Math.PI;
                    that.arrow = false;
                }
                if(figure[7] == elem){
                    that.startAngle = 1 * Math.PI;
                    that.endAngle = 2 * Math.PI;
                    that.arrow = true;
                }
                if(figure[3] == elem){
                    that.startAngle = 2.5 * Math.PI;
                    that.endAngle = 1.5 * Math.PI;
                    that.arrow = false;
                }
                if(figure[4] == elem){
                    that.startAngle = 2.5 * Math.PI;
                    that.endAngle = 1.5 * Math.PI;
                    that.arrow = true;
                }
               
                if(figure[1] == elem){
                    that.startAngle = 2 * Math.PI;
                    that.endAngle = 1.5 * Math.PI;
                    that.arrow = true;
                }
                if(figure[5] == elem){
                    that.startAngle = 1 * Math.PI;
                    that.endAngle = 2.5 * Math.PI;
                    that.arrow = true;
                }
                if(figure[6] == elem){
                    that.startAngle = 2 * Math.PI;
                    that.endAngle = 2.5 * Math.PI;
                    that.arrow = false;
                }
                if(figure[9] == elem){
                    that.keyQPress = false;
                }
            });
        });

        save.addEventListener('click', function(){
            that.saveImage();
        });

        setBackground.addEventListener('click', function(){
            that.changeBackground();
        });
        
        saveAsLineListBtn.addEventListener('click', function(){
            that.saveAsLineList();
        });
        
        openLineListBtn.addEventListener('click', function(){
            that.openLineList();
        });

        newDocument.addEventListener('click', function(){
            that.history.length = 0;
            that.clear(imageCtx);
            console.log('history cleared');
            console.log('imageCtx cleared');
        });
    }

    otherEvents(){
        let that = this;

        inputColor.addEventListener('change', function(){
            that.drawColor = setDrawColor.value;
        });

        widthGrid.max = 5;
        widthGrid.min = 0.1;
        widthGrid.step = 0.1;
        
        widthGrid.addEventListener('input', function(){
            that.widthCubeLine = widthGrid.value;
            that.drawGrid();
        });
    }

    //start a program
    
    start(){
        console.log('[ starting... ]');

        this.drawGrid();
        console.log('Draw grid');

        this.mouseEvents();
        console.log('Add mouse events');

        this.eventClickListener();
        console.log('Add click events');

        this.eventKeyPress();
        console.log('Add key press events');

        this.otherEvents();
        console.log('Add other events');

        console.log('[ started ]');
    }

}

let paint = new Paint();

paint.start();