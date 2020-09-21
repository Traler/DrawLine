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
        widthLine: 0.5,
    }

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
        inclineX: 601/2,
        inclineY: 601/2,
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

    static isMouseDown = false;

    static gridView = true;

    static drawing;

    drawMode = {
        line: true,
        circle: false,
        bezierCurve: false,
        quadraticCurve: false,
    };

    constructor(width, height) {
        this.drawBoxSize.width = width + 1;
        this.drawBoxSize.height = height + 1;
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

    drawLine(ctx, color, width){
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(this.coord.startedCoord.x, this.coord.startedCoord.y);
        ctx.lineTo(this.coord.endedCoord.x, this.coord.endedCoord.y); 
        ctx.closePath();
        ctx.stroke();
    }

    drawQuadraticCurve(ctx = Interface.drawCtx, color, width){
        let t = this.coord;
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.moveTo(t.startedCoord.x, t.startedCoord.y);
        ctx.quadraticCurveTo(t.endedCoord.x, t.endedCoord.y, t.inclineX, t.inclineY);
        ctx.stroke();
        ctx.closePath();
    }

    drawBezierCurve(ctx = Interface.drawCtx, color, width){
        let t = this.coord;
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.bezierCurveTo(
            t.endedCoord.x,
            t.endedCoord.y, 
            t.inclineX, 
            t.inclineY, 
            t.startedCoord.x, 
            t.startedCoord.y
        );
        ctx.stroke();
        ctx.closePath();
    }
    
    drawCursor(x, y, ctx = Interface.cursorCtx){
        let widthLine = Interface.gridCtx.lineWidth + 4;
        let widthLine2 = (Interface.gridCtx.lineWidth / 0.5);
        this.clear(Interface.cursorCtx);
        let lineX = x - widthLine2;
        let lineY = y - widthLine2;

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

    clickListenerLogic(e){
        let that = this;
        let x = that.coord.localCoord(e).x;
        let y = that.coord.localCoord(e).y;

        let xRounded = that.coord.customRound(x);
        let yRounded = that.coord.customRound(y);

        this.coord.inclineX = xRounded; 
        this.coord.inclineY = yRounded; 
    }
   
    mouseLogic(e, value){
        let that = this;

        let x = that.coord.localCoord(e).x;
        let y = that.coord.localCoord(e).y;

        let xRounded = that.coord.customRound(x);
        let yRounded = that.coord.customRound(y);

        let startedCoord = that.coord.startedCoord;

        let auxiliarie = that.line.auxiliarie;
        let draw = that.line.draw;
       
        that.clear(Interface.cursorCtx);
        that.drawCursor(xRounded, yRounded);

        let callback = function(up, move){
            if(value == 'up'){
                up();
            }else if(value == 'move'){
                move();
            }
        };

        if(that.drawMode.line){
            lineLogic();
        }

        if(that.drawMode.quadraticCurve){
            quadraticCurveLogic();
        }

        if(that.drawMode.bezierCurve){
            bezierCurveLogic();
        }

        //draw the line
        function lineLogic(){
            function up(){
                that.clear(Interface.drawCtx);

                that.coord.setEndedCoord(x, y);
                if(DL.isMouseDown && DL.drawing){
                    that.drawLine(Interface.drawBoxCtx, draw.color, draw.width)
                    that.coord.sayCoords('DRAWING END', x, y)
                }
                DL.isMouseDown = false;
                DL.drawing = false;
            }

            function move(){
                that.coord.setEndedCoord(xRounded, yRounded);

                if (DL.isMouseDown && !DL.drawing){
                    that.coord.sayCoords('DRAWING FROM', x, y);
                    DL.drawing = true;
                
                    startedCoord.x = xRounded;
                    startedCoord.y = yRounded;
                }

                //draw the line
                
                if(DL.isMouseDown && DL.drawing) {
                    that.clear(Interface.drawCtx);
                    that.drawLine(Interface.drawCtx, auxiliarie.color, auxiliarie.width);
                }
            }

            callback(up, move);
        }

        //draw the bezier curve
        function bezierCurveLogic(){

            function up(){
                that.clear(Interface.drawCtx);

                that.coord.setEndedCoord(x, y);
                if(DL.isMouseDown && DL.drawing){
                    that.drawBezierCurve(Interface.drawBoxCtx, draw.color, draw.width);
                    that.coord.sayCoords('DRAWING END', x, y);
                }
                DL.isMouseDown = false;
                DL.drawing = false;
            }

            function move(){
                that.coord.setEndedCoord(xRounded, yRounded);

                if (DL.isMouseDown && !DL.drawing){
                    that.coord.sayCoords('DRAWING FROM', x, y);
                    DL.drawing = true;
                    
                    startedCoord.x = xRounded;
                    startedCoord.y = yRounded;
                }

                if(DL.isMouseDown && DL.drawing) {
                    that.clear(Interface.drawCtx);
                    if(that.coord.inclineX !== 601/2){
                        that.drawBezierCurve(Interface.drawCtx, auxiliarie.color, auxiliarie.width);
                    }
                }
            }

            callback(up, move);
        }

        //draw the quadratic curve
        function quadraticCurveLogic(){

            function up(){
                that.clear(Interface.drawCtx);

                that.coord.setEndedCoord(x, y);
                if(DL.isMouseDown && DL.drawing){
                    that.drawQuadraticCurve(Interface.drawBoxCtx, draw.color, draw.width);
                    that.coord.sayCoords('DRAWING END', x, y);
                }
                DL.isMouseDown = false;
                DL.drawing = false;
            }

            function move(){
                that.coord.setEndedCoord(xRounded, yRounded);

                if (DL.isMouseDown && !DL.drawing){
                    that.coord.sayCoords('DRAWING FROM', x, y);
                    DL.drawing = true;
                    
                    startedCoord.x = xRounded;
                    startedCoord.y = yRounded;
                }

                if(DL.isMouseDown && DL.drawing) {
                    that.clear(Interface.drawCtx);
                    if(that.coord.inclineX !== 601/2){
                        that.drawQuadraticCurve(Interface.drawCtx, auxiliarie.color, auxiliarie.width);
                    }
                }
            }

            callback(up, move);
        }
    }

    keyPressLogic(e){
        switch (e.code) {
            case 'KeyZ':
                Interface.gridView()
                break;
        }
    }

    changeDrawMode(value, object = dL.drawMode){
        let keys = Object.keys(object);
        keys.forEach((item, index)=>{
            object[keys[index]] = false;
        });
        object[value] = true;
    }
}

class Interface {

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

    //initialization

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

        function levelConstructor(contextTag, items){
            let levelKeys = Object.keys(items);

            levelKeys.forEach((menuItemName) => {
                let liTag = document.createElement("li");

                const menuItem = items[menuItemName];

                if('icon' in menuItem){
                    liTag.addEventListener('click', function(){
                        if('props' in menuItem){
                            let menu = document.createElement('div');
                            menu.setAttribute('class', 'vertical-menu');
                            menu.style.bottom = '0';
                            document.body.appendChild(menu);
                            createInputRange(menu);
                        }
                    });

                    let imgTag = document.createElement("img");
                    imgTag.setAttribute('width', '50x');
                    imgTag.setAttribute('height', '50x');
                    liTag.appendChild(imgTag);
                    imgTag.src = menuItem.icon;

                }

                if(menuItemName == 'Grid'){
                    let divTag = document.createElement("div");
                    divTag.innerHTML = menuItemName;
                    liTag.appendChild(divTag);
                    createInputRange(divTag);
                }

                function createInputRange(contextTag){
                    let div = document.createElement("div");
                    contextTag.appendChild(div);
                    div.innerHTML = 'Width of line';
    
                    let input = document.createElement('input');
                    input.setAttribute('class', 'input');
                    input.type = 'range';
                    input.value = 1;
                    input.max = 10;
                    input.min = 0.1;
                    input.step = 0.1
                    contextTag.appendChild(input);
                    input.addEventListener('change', menuItem.props['Width of line']); 
                }

                contextTag.appendChild(liTag); 
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

    static initEvents(){
        function mouse(){
            Interface.cursorCanv.addEventListener('wheel', function(e) {
                if(!DL.gridView){
                    return;
                }
                dL.wheelGrid(e);
            });

            Interface.cursorCanv.addEventListener('mouseup', function(e) {
                dL.mouseLogic(e, 'up');
            });
            
            Interface.cursorCanv.addEventListener('mousemove', function(e){
                dL.mouseLogic(e, 'move');
            });
    
            Interface.cursorCanv.addEventListener('mousedown', function(e) {
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

        function clickListener(){
            Interface.cursorCanv.addEventListener('click', function(e){
                dL.clickListenerLogic(e);
            });
        }
        clickListener();

        function otherEvents(){
            //
        }
    }

    //initial menus

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
        Line: {
            icon: "./images/line.png",
            props: {
                'Width of line': (e) => { Interface.setWidth('line', e.path[0].value )},
                Color: () => {},
            },
            call: () => {console.log('call to line')},
        },
        Circle: {
            icon: "./images/circle.png",
            props: {
                'Width of line': (e) => { Interface.setWidth('circle', e.path[0].value) },
                Color: () => {},
            },
            call: () => {console.log('call to circle')},
        },
        quadraticCurve: {
            icon: "./images/quadraticCurve.png",
            props: {
                'Width of line': (e) => { Interface.setWidth('quadraticCurve', e.path[0].value) },
                Color: () => {},
            },
            call: () => {console.log('call to quadratic curve')},
        },
        Grid: {
            props: {
                'Width of line': (e) => { Interface.setWidth('grid', e.path[0].value) },
                Color: () => {},
            },
            call: () => {},
        }
    };

    //methods for menus

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

    //methods for tools menus

    static setWidth(value, e){
        if(value == 'line'){
            dL.line.draw.width = e;
           
        }
        if(value == 'circle'){
        }
        if(value == 'grid'){
            dL.grid.widthLine = e;
            dL.drawGrid();
        }
        if(value == 'quadraticCurve'){
            dL.line.draw.width = e;
            dL.drawGrid();
            
        }
    }
}

let dL = DL.init();

dL.drawGrid(10);

//for the future

class WheelColor{

    section = {
        colorSelectionPlane: null,
        hue: null,
        localColor: null, //array, length = 4
        wheelColorWalker: null, //array, length = 2
        brightnessPlug: null, //array, length = 2
        colorSaturation: null, //array, length = 2
        webSafeColor: null, //array, length = 2
        gradientPosition: null, //array, length = 2
        swatches: {
            segment: {
                red: 'red',
                blue: 'blue',
                green: 'green',
                black: 'black',
                //...
            }
        }
    };

    constructor(){
        //
    }

    init(){
        //
    }

    initCreateSections(){
        let wc = document.createElement('div');
        wc.setAttribute('class', 'wheelColor');
        document.body.appendChild(wc);
        
        let div = document.createElement('div');
        div.setAttribute('class', 'div');
        wc.appendChild(div);


        let circle = document.createElement('div');
        circle.setAttribute('class', 'circle');
        div.appendChild(circle);
        circle.setAttribute('width', '100px');
        circle.setAttribute('height', '100px');
        circle.setAttribute('position', 'absolute');
    }
}

let wheelColor = new WheelColor();