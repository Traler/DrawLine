class DL{
    drawBoxSize = {
        width: null,
        height: null,
    };

    cellCount = 10;
    widthCube;

    line = {
        draw: {
            color: 'red',
            width: 1,
        },
        auxiliarie: {
            color: 'blue',
            width: 1,
        },
    };

    cursor = {
        color: 'blue',
        width: 0,
    };

    grid = {
        color: 'white',
        widthLine: 1,
    }

    static isMouseDown = false;

    static gridView = true;

    static drawing;

    static cursorColor = 'blue';

    coord = {
        t: this,
        endedCoord: {
            x: -1,
            y: -1,
        },
        startedCoord:{
            x: -1,
            y: -1,
        },
        customRound(coord) {
            return this.t.widthCube * Math.round(coord / this.t.widthCube);
        },
        localCoord(e){
            return {
                x: e.layerX - Interface.gridCanv.offsetLeft,
                y: e.layerY - Interface.gridCanv.offsetTop,
            };
        },
        setEndedCoord(x, y){
            this.endedCoord.x = this.customRound(x);
            this.endedCoord.y = this.customRound(y);
        },
        sayCoords(event, x, y){
            let coordX = this.customRound(x) / this.t.widthCube;
            let coordY = this.customRound(y) / this.t.widthCube;
            console.log(event, coordX, coordY);
        },
    };

    constructor(width, height) {
        this.drawBoxSize.width = width;
        this.drawBoxSize.height = height;
    }

    static init(){
        let width = 600;
        let height = 600;
        Interface.initMenu();
        Interface.initTools();
        Interface.initCanvases(width, height);
        Interface.initEvents();
        return new DL(width, height);
    }

    drawGrid(cellCount = this.cellCount, ctx = Interface.gridCtx){
        this.clear(ctx);

        this.widthCube = this.drawBoxSize.width / cellCount;

        ctx.lineWidth = this.grid.widthLine;
        ctx.strokeStyle = this.grid.color;
    
        for (let n = 0; n < cellCount*this.widthCube; n+=this.widthCube) {
        for (let t = 0; t < cellCount*this.widthCube; t+=this.widthCube){
            ctx.beginPath();
            ctx.strokeRect(n, t, this.widthCube, this.widthCube);
            ctx.closePath();
            ctx.stroke();
            }
        }
    }

    drawLine(ctx, startedCoord, endedCoord, color, width){
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.moveTo(startedCoord.x, startedCoord.y);
        ctx.lineTo(endedCoord.x, endedCoord.y);
        ctx.stroke(); 
        ctx.closePath();
    }

    drawCursor(x, y, ctx = Interface.cursorCtx){
        let widthLine = Interface.gridCtx.lineWidth + 4;
        let widthLine2 = (Interface.gridCtx.lineWidth / 0.5);
      
        let lineX = x - widthLine2;
        let lineY = y - widthLine2;
        
        this.clear(ctx);
        ctx.beginPath();
        ctx.lineWidth = this.cursor.width;
        ctx.fillStyle = this.cursor.color;
        ctx.fillRect(lineX, lineY, widthLine, widthLine);
        ctx.lineWidth = Interface.gridCtx.lineWidth;
        ctx.closePath();
    }

    clear(ctx = Interface.gridCtx){
        let width = this.drawBoxSize.width;
        let height = this.drawBoxSize.height;
        ctx.clearRect(0, 0, width, height); 
    }

    wheelGrid(e){   
        let that = this;

        let max = that.cellCount <= 300;
        let min = that.cellCount >= 1;
        let interval = max && min;
    
        that.clear(Interface.cursorCtx);
        
        if(interval && e.deltaY > 0 || !max){
            that.cellCount -= 1;
        }else{
            that.cellCount += 1;
        }
        that.drawGrid(that.cellCount);
    }

    //logic
   
    mouseLogic(e, value){
        let that = this;

        let x = that.coord.localCoord(e).x;
        let y = that.coord.localCoord(e).y;

        if(value == 'up'){
            up();
        }else if(value == 'move'){
            move();
        }

        //draw the line
       
        function up(){
            that.clear(Interface.drawCtx);

            that.coord.setEndedCoord(x, y);
            if(DL.isMouseDown && DL.drawing){
                let line = that.line.draw;
                that.drawLine(Interface.drawBoxCtx, that.coord.startedCoord, that.coord.endedCoord, line.color, line.width)
                that.coord.sayCoords('DRAWING END', x, y)
            }
            DL.isMouseDown = false;
            DL.drawing = false;
        }

        function move(){
            let xRounded = that.coord.customRound(x);
            let yRounded = that.coord.customRound(y);
        
            that.coord.setEndedCoord(xRounded, yRounded);

            that.drawCursor(xRounded, yRounded);

        //  that.drawCursor(xRounded, yRounded);
        
            if (DL.isMouseDown && !DL.drawing){
                that.coord.sayCoords('DRAWING FROM', x, y);
                DL.drawing = true;
            
                that.coord.startedCoord.x = xRounded;
                that.coord.startedCoord.y = yRounded;
            }

            //draw the line
            
            if(DL.isMouseDown && DL.drawing) {
                that.clear(Interface.drawCtx);
                that.drawLine(Interface.drawCtx, that.coord.startedCoord, that.coord.endedCoord, that.line.auxiliarie.color, that.line.auxiliarie.width);
            }
        }
    }

    keyPressLogic(e){
        //
    }
}

class Interface {

    backgroundCtx;
    backgroundCanv;
    gridCtx;
    gridCanv;
    drawBoxCtx;
    cursorCtx;
    drawCtx;

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

    static initTools(){
        let menuTag = document.createElement("div");
        menuTag.setAttribute("class", "vertical-menu");
        document.body.appendChild(menuTag);

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
                    return;
                }

                let ulTag = document.createElement("div");
                liTag.appendChild(ulTag);

                levelConstructor(ulTag, menuItem);
            });
        }

        levelConstructor(menuTag, Interface.tools);
    }

    static initCanvases(width, height){
        //create the canvas

        function createContainerForCanvases(){
            let paint = document.createElement('div');
            paint.setAttribute('class', 'paint');

            let canvases = document.createElement("div");
            canvases.setAttribute("class", 'canvases');
            paint.appendChild(canvases);
            canvases.setAttribute('width', width + 1);
            canvases.setAttribute('height', height + 1);

            document.body.appendChild(paint);

            canvases.style.border = '1px solid white';
            return canvases;
        }

        let canvases = createContainerForCanvases();

        function createCanv(){
                let canv = document.createElement('canvas');
                canv.setAttribute('class', 'canvas');
                canvases.appendChild(canv);
                canv.setAttribute('width', width + 1);
                canv.setAttribute('height', height + 1);
                return canv;
        }

        function createBackground() {
            let backgroundCanv = createCanv();
            backgroundCanv.setAttribute('id', 'backgroundCanv');
        }

        function createGrid() {
            let gridCanv = createCanv();
            gridCanv.setAttribute('id', 'gridCanv');
        }

        function createDrawBox() {
            let drawBoxCanv = createCanv();
            drawBoxCanv.setAttribute('id', 'drawBoxCanv');

        }

        function createAuxiliaries() {
            //actual cursor and drawing line
            function cursor(){
                let cursorCanv = createCanv();
                cursorCanv.setAttribute('id', 'cursorCanv');

            }

            function draw(){
                let drawCanv = createCanv();
                drawCanv.setAttribute('id', 'drawCanv');
            }
            draw();
            cursor();
            
        }

        createBackground();
        createGrid();
        createDrawBox();
        createAuxiliaries();

    }

    static initEvents(){
        let backgroundCanv = document.querySelector('#backgroundCanv');
        Interface.backgroundCanv = backgroundCanv;
        let gridCanv = document.querySelector('#gridCanv');
        Interface.gridCanv = gridCanv;
        let drawBoxCanv = document.querySelector('#drawBoxCanv');
        let cursorCanv = document.querySelector('#cursorCanv');
        let drawCanv = document.querySelector('#drawCanv');

        Interface.backgroundCtx = backgroundCanv.getContext('2d');
        Interface.gridCtx = gridCanv.getContext('2d');
        Interface.drawBoxCtx = drawBoxCanv.getContext('2d');
        Interface.cursorCtx = cursorCanv.getContext('2d');
        Interface.drawCtx = drawCanv.getContext('2d');

        function mouse(){
            cursorCanv.addEventListener('wheel', function(e) {
                if(!DL.gridView){
                    return;
                }
                dL.wheelGrid(e);
            });

            cursorCanv.addEventListener('mouseup', function(e) {
                dL.mouseLogic(e, 'up');
            });
            
            cursorCanv.addEventListener('mousemove', function(e){
                dL.mouseLogic(e, 'move');
            });
    
            cursorCanv.addEventListener('mousedown', function(e) {
                DL.isMouseDown = true;
            });
        }
        mouse();

        function keyPress(){
            document.addEventListener('keypress', function(e){
                dL.keyPressLogic(e)
            });
        }
        keyPress();

        function otherEvents(){
            //
        }
    }

    static menu = {
        File: {
            'New document': {
                call: Interface.CreateNewDoc,
            },
            "Import": {
                "Image background": {
                    call: () => {},
                },
                "Line list": {
                    call: () => {},
                },
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
        }
    };

    static tools = {
        Draw: {
            line: {
                call: () => {},
            },
            circle: {
                call: () => {},
            },
        },
        Grid: {
            width: {
                call: () => {},
            },
            color: {
                call: () => {},
            },
            cellCount: {
                call: () => {},
            },
        }
    }

    static CoordViewPanel(switchState) {
        function activate() {
            coordView.style.display = 'block';
        }

        function deactivate() {
            coordView.style.display = 'none';
        }

        alert("CoordViewPanel logics...");
    }

    static CreateNewDoc() {
        alert("CreateNewDoc logics...");
    }

    static gridView(){
        if(!DL.gridView){
            dL.drawGrid();
            DL.gridView = true;
        }else{
            dL.clear();
            DL.gridView = false;
        }
    }
}

let dL = DL.init();

dL.drawGrid(10);