'use strict';

////////////////////////////////////////////////////////////////////////////////
let title = document.querySelector('title');

let titleLength = title.baseURI.length;

let string = title.baseURI.slice(titleLength - 17, titleLength - 11);

title.innerHTML = string;
////////////////////////////////////////////////////////////////////////////////

let canvases       = document.querySelectorAll('.canvas');

let backgroundCanv = canvases[0];
let gridCanv       = canvases[1];
let imageCanv      = canvases[2];
let drawCanv       = canvases[3];
let cursorCanv     = canvases[4];


let backgroundCtx  = backgroundCanv.getContext('2d');             //ctx for background
let gridCtx        = gridCanv.getContext('2d');                   //ctx for grid
let imageCtx       = imageCanv.getContext('2d');                  //ctx for view or save
let drawCtx        = drawCanv.getContext('2d');                   //ctx for drawing
let cursorCtx      = cursorCanv.getContext('2d');                 //ctx for cursor

let inputColor     = document.querySelector('#inputColor');       //input the draw color
let coordView      = document.querySelector('.coordView');        //the coords panel

let viewCoord      = document.querySelector('#viewCoords');       //config On | Off for the coords panel 

let widthGrid      = document.querySelector('#widthGrid');        //input width of line in grid

let drawFigure     = document.querySelectorAll('li > svg');       //svg config

class Paint {
    //for grid
    widthCube;
    cellCount = 10;

    //config color
    cursorColor = 'blue';
    drawColor = 'red';
    circleColor = this.cursorColor;
    widthLine = 1;

    //coords
    startedCoord = {x: -1, y: -1};
    endedCoord = {x: -1, y: -1};

    //for mouseDown
    isMouseDown = false;
    drawing;

    //for clickEvents
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

    drawGrid(cellCount = this.cellCount, widthLine = this.widthLine){
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
        gridCtx.lineWidth = 1;
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
    
    //interface

    undo(){
        this.history.pop();
      
        this.clear(imageCtx);
        this.history.forEach((lineCoords) => {
          //drawLine()
          // Risovat liniu is history
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
        this.drawGrid(this.cellCount, gridCtx.lineWidth);
    }

    saveImage(canvas = imageCanv) {
        let url = canvas.toDataURL();
        let result = document.querySelector("#result");
        result.src = url;
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
        
        cursorCanv.addEventListener('mousedown', function(e) {
            that.isMouseDown = true;
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
        
        cursorCanv.addEventListener('wheel', function(e) {
            that.wheelGrid(e);
        });
    }

    eventKeyPress(){
        let that = this;

        

        document.addEventListener("keypress", function(e){
            if('KeyZ' == e.code){
                that.undo();
            }
            if('KeyI' == e.code){
              backgroundCanv.style.backgroundImage = "url('"+prompt('image url')+"')";
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
        viewCoord.parentElement.addEventListener('click', function(e){
            if(viewCoord.innerHTML == 'On'){
                viewCoord.innerHTML = 'Off';
                coordView.style.display = 'none';
            }else{
                viewCoord.innerHTML = 'On';
                coordView.style.display = 'block';
                that.viewCoords(0, 0);
            }
        });
        drawFigure.forEach(function(elem) {
            elem.addEventListener('click', function(){
                that.keyQPress = true;
        
                if(drawFigure[8] == elem){
                    that.startAngle = 0;
                    that.endAngle = 2 * Math.PI;
                    that.arrow = false;
                }
                if(drawFigure[0] == elem){
                    that.startAngle = 1 * Math.PI;
                    that.endAngle = 1.5 * Math.PI;
                    that.arrow = false;
                }
                if(drawFigure[2] == elem){
                    that.startAngle = 1 * Math.PI;
                    that.endAngle = 2 * Math.PI;
                    that.arrow = false;
                }
                if(drawFigure[7] == elem){
                    that.startAngle = 1 * Math.PI;
                    that.endAngle = 2 * Math.PI;
                    that.arrow = true;
                }
                if(drawFigure[3] == elem){
                    that.startAngle = 2.5 * Math.PI;
                    that.endAngle = 1.5 * Math.PI;
                    that.arrow = false;
                }
                if(drawFigure[4] == elem){
                    that.startAngle = 2.5 * Math.PI;
                    that.endAngle = 1.5 * Math.PI;
                    that.arrow = true;
                }
               
                if(drawFigure[1] == elem){
                    that.startAngle = 2 * Math.PI;
                    that.endAngle = 1.5 * Math.PI;
                    that.arrow = true;
                }
                if(drawFigure[5] == elem){
                    that.startAngle = 1 * Math.PI;
                    that.endAngle = 2.5 * Math.PI;
                    that.arrow = true;
                }
                if(drawFigure[6] == elem){
                    that.startAngle = 2 * Math.PI;
                    that.endAngle = 2.5 * Math.PI;
                    that.arrow = false;
                }
                if(drawFigure[9] == elem){
                    that.keyQPress = false;
                }
            });
        });
    }

    otherEvents(){
        let that = this;

        inputColor.addEventListener('change', function(){
            that.drawColor = inputColor.value;
        });
        
        widthGrid.max = 20;
        widthGrid.min = 0.1;
        widthGrid.step = 0;
        
        widthGrid.addEventListener('input', function(){
            that.widthLine = widthGrid.value;
            that.drawGrid();
        });
    }

    //start a program
    
    start(){
        this.drawGrid();
        this.mouseEvents();
        this.eventClickListener();
        this.eventKeyPress();
        this.otherEvents();
    }

}

let paint = new Paint();

paint.start();