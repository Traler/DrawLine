import { Events } from             "./evenst.js";
import {  Grid  } from   "../Interface/DrawArea/grid.js";
import { Menu } from             "../Interface/menu.js";
import { ToolsMenu } from "../Interface/toolsMenu.js";
import { WheelColor } from "../Interface/wheelColor.js";

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
        Menu.initMenu();
        ToolsMenu.initTools()
        WheelColor.init();

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
        Menu.setDrawMode('line');

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
}

//start the program
window.onload = function(){
    let drawLine = DrawLine.init();
}