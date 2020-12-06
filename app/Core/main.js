import { Events } from             "./evenst.js";
import {  Grid  } from   "../Interface/DrawArea/grid.js";
import { Interface } from             "../Interface/interface.js";

export class DrawLine {

    //is a size of canvases
    static drawBoxSize = {
        width: 601,
        height: 601,
    };

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

    static init(){
        //create menu
        DrawLine.initMenu();

        //create canvases
        DrawLine.initCanvases(DrawLine.drawBoxSize.width, DrawLine.drawBoxSize.height);
        console.log('Class >Interface< started');

        //create view panel
        DrawLine.initViewPanel();

        //draw the grid in draw space
        Grid.drawGrid();
        console.log('Method >Grid< drawed');

        //create envents for listen a click, mouseMove, mouseUp...
        Events.init();
        console.log('Method >drawCursor< started');

        //set draw mode (for draw line) (is a custom draw mode)
        Interface.setDrawMode('line');

        //run the app
        return new DrawLine();
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
            DrawLine.backgroundCanv = backgroundCanv;    
            DrawLine.backgroundCtx = backgroundCanv.getContext('2d');        
        }

        function createGrid() {
            let gridCanv = createCanv();
            gridCanv.setAttribute('id', 'gridCanv');
            DrawLine.gridCanv = gridCanv;
            DrawLine.gridCtx = gridCanv.getContext('2d');
        }

        function createDrawBox() {
            let drawBoxCanv = createCanv();
            drawBoxCanv.setAttribute('id', 'drawBoxCanv');
            DrawLine.drawBoxCanv = drawBoxCanv;
            DrawLine.drawBoxCtx = drawBoxCanv.getContext('2d');
        }

        function createAuxiliaries() {
            //actual cursor and drawing line
            function cursor(){
                let cursorCanv = createCanv();
                cursorCanv.setAttribute('id', 'cursorCanv');
                DrawLine.cursorCanv = cursorCanv;
                DrawLine.cursorCtx = cursorCanv.getContext('2d');
            }

            function draw(){
                let drawCanv = createCanv();
                drawCanv.setAttribute('id', 'drawCanv');
                DrawLine.drawCanv = drawCanv;
                DrawLine.drawCtx = drawCanv.getContext('2d');
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

        DrawLine.cursorCanv.parentNode.appendChild(viewPanel);
        viewPanel.style.display = 'none';
        DrawLine.viewPanel = viewPanel;
    }

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
}

//start the program
window.onload = function(){
    let drawLine = DrawLine.init();
}