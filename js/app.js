class DL{
    drawBoxSize = {
        width: null,
        height: null,
    };

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

    circle = {
        startAngle: 0,
        endAngle: Math.PI * 2,
        arrow: false,
    };

    cursor = {
        color: 'blue',
        width: 0,
        visibility: true,
    };

    grid = {
        color: 'white',
        widthLine: 0.5,
        visibility: true,
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
        inclineX: -1,
        inclineY: -1,
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

    cellCount = 10;
    widthCube;

    history = [];

    static drawMode = {
        line: true,
        circle: false,
        bezierCurve: false,
        quadraticCurve: false,
    };

    static drawing;
    static isMouseDown = false;

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
        Interface.initViewPanel();
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

    drawCircle(ctx, x, y, color, width){
        let t = this;
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.strokeStyle = color;
        ctx.arc(x, y, t.widthCube, t.circle.startAngle, t.circle.endAngle, t.circle.arrow);
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
        let cursor = this.cursor;

        if(!cursor.visibility){
            return;
        }
        this.cursor.width = 3;
        let radius = this.cursor.width;

        this.clear(ctx);

        ctx.fillStyle = cursor.color;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }   

    clear(ctx = Interface.gridCtx){
        let width = this.drawBoxSize.width;
        let height = this.drawBoxSize.height;
        ctx.clearRect(0, 0, width, height); 
    }

    wheelGrid(e){   
        let t = this;

        let max = t.cellCount <= 300;
        let min = t.cellCount >= 1;
        let interval = max && min;
    
        if(interval && e.deltaY > 0 || !max){
            t.cellCount -= 1;
        }else{
            t.cellCount += 1;
        }
        t.drawGrid(t.cellCount);
    }

    //logic

    clickListenerLogic(e){
        let t = this;
        let x = t.coord.localCoord(e).x;
        let y = t.coord.localCoord(e).y;

        let xRounded = t.coord.customRound(x);
        let yRounded = t.coord.customRound(y);

        t.coord.inclineX = xRounded; 
        t.coord.inclineY = yRounded; 

        if(!DL.drawMode.circle){
            return;
        }
        t.drawCircle(Interface.drawBoxCtx, xRounded, yRounded, this.line.draw.color, this.line.draw.width);
    }
   
    mouseLogic(e, value){
        let that = this;

        let x = that.coord.localCoord(e).x;
        let y = that.coord.localCoord(e).y;

        let xRounded = that.coord.customRound(x);
        let yRounded = that.coord.customRound(y);

        let startedCoord = that.coord.startedCoord;
        let endedCoord = that.coord.endedCoord;

        let inclineX = that.coord.inclineX;
        let inclineY = that.coord.inclineY;

        let auxiliarie = that.line.auxiliarie;
        let draw = that.line.draw;
       
        that.clear(Interface.cursorCtx);
        that.drawCursor(xRounded, yRounded);

        function viewPanelLogic(){
            that.viewPanelLogic(xRounded, yRounded);
        }

        let callback = function(up, move){
            if(value == 'up'){
                up();
            }else if(value == 'move'){
                move();
                viewPanelLogic();
                if(DL.drawMode.circle){
                    that.drawCircle(Interface.cursorCtx, xRounded, yRounded, auxiliarie.color, auxiliarie.width);
                }
                
            }
        };

        if(DL.drawMode.line){
            lineLogic();
        }

        if(DL.drawMode.quadraticCurve){
            quadraticCurveLogic();
        }

        if(DL.drawMode.bezierCurve){
            bezierCurveLogic();
        }

        function setHistory(type){
                that.history.push([
                {x: startedCoord.x, y: startedCoord.y},
                {x: endedCoord.x, y: endedCoord.y},
                {
                    color: draw.color,
                    width: draw.width,
                },
                type,
                ]);

                if(type == 'bezierCurve'){
                    that.history[that.history.length -1][4] = {inclineX: inclineX, inclineY: inclineY};
                }
        }

        //draw the line
        function lineLogic(){
            function up(){
                that.clear(Interface.drawCtx);

                that.coord.setEndedCoord(x, y);
                if(DL.isMouseDown && DL.drawing){
                    that.drawLine(Interface.drawBoxCtx, draw.color, draw.width)
                    that.coord.sayCoords('DRAWING END', x, y);
                    setHistory('line');
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
                    setHistory('bezierCurve');
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

    changeDrawMode(value, object = DL.drawMode){
        let keys = Object.keys(object);
        keys.forEach((item, index)=>{
            object[keys[index]] = false;
        });
        object[value] = true;
    }

    undo(history = this.history){
        history.pop();
        this.clear(Interface.drawBoxCtx);
        this.drawLinesFromObject(history);
    }

    drawLinesFromObject(lineList, ctx = Interface.drawBoxCtx) {

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

    viewPanelLogic(x, y){
        let viewPanel = Interface.viewPanel;

        let coordX = Math.round(x / this.widthCube);  
        let coordY = Math.round(y / this.widthCube);

        let string = `x: ${coordX} | y: ${coordY}`;

        if(!(coordX == coordY && this.cellCount / 2 == coordX)){
            viewPanel.innerHTML = string;
        }else{
            viewPanel.innerHTML = 'centr ' + string;
        }

        viewPanel.style.left = x;
        viewPanel.style.top = y;
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

    viewPanel; 

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
                if(!dL.grid.visibility){
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
                dL.mouseLogic(e, 'down');
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

    static initViewPanel(){
        let viewPanel = document.createElement("div"); 
        viewPanel.setAttribute('class', 'coordView');

        Interface.cursorCanv.parentNode.appendChild(viewPanel);
        viewPanel.style.display = 'none';
        Interface.viewPanel = viewPanel;
    }

    //initial menus

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
                    call: Interface.openLineList,
                },
            },
            'Save as image': {
                call: Interface.saveAsImage,
            },
            'Save as line list': {
                call: Interface.saveAsLineList,
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
                call: () =>{Interface.drawMode('line')}
            },
            'Circle': {
                call: () =>{Interface.drawMode('circle')}
            },
            'Bezier curve': {
                call: () =>{Interface.drawMode('bezierCurve')}
            }
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

    static drawMode(value){
        dL.changeDrawMode(value);
        if(value == 'circle'){
            dL.cursor.visibility = false;
        }
    }

    static CoordViewPanel() {
        let viewPanel = Interface.viewPanel;
        let switchable = Interface.menu.View.CoordView.switchable;

        if(switchable.innerHTML == 'Off'){
            viewPanel.style.display = 'block';
        }else if(switchable.innerHTML == 'On'){
            viewPanel.style.display = 'none';
        }
    }

    static CreateNewDoc() {
        dL.history.length = 0;
        dL.clear(Interface.drawBoxCtx);
    }

    static gridView(){
        if(!dL.grid.visibility){
            dL.drawGrid();
            dL.grid.visibility = true;
        }else{
            dL.clear();
            dL.grid.visibility = false;
        }
    }

    static changeBackground(){
        backgroundCanv.style.backgroundImage = "url('" + prompt('Change image url for background') + "')";
    }

    static saveAsLineList(){
        let a = document.createElement("a"); 

        document.body.appendChild(a);
        a.style.display = 'none';

        let str = JSON.stringify(dL.history);
        
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
                
                dL.history = dL.history.concat(parseData); 
                
                dL.drawLinesFromObject(parseData);
            };
            reader.readAsText(file);
        });

        input.click();
        input.parentNode.removeChild(input);
    }

    static saveAsImage() {
        let url = Interface.drawBoxCanv.toDataURL();

        let a = document.createElement("a"); 

        document.body.appendChild(a);
        a.style.display = 'none';
        
        a.href = url;
        a.download = 'My image';
        a.click();
        
        a.parentNode.removeChild(a);
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