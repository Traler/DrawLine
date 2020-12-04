import { DrawLine } from './main.js';
import { Coord } from './cord.js';
import { Line } from './drawMods/line.js';
import { BezierCurve } from './drawMods/bezierCurve.js';
import { Circle } from './drawMods/circle.js';
import { Grid } from './drawMods/grid.js';
import { Figure } from './drawMods/figure.js';
import { History } from './history.js';


export class Interface {

    //is a value has got a current drawLogic function
    static drawMode;
    
    //is a canvases and contexts of canvas for draw a background

    static menu = {
        File: {
            'New document': {
                call: Interface.CreateNewDoc,
            },
            Import: {
                "Image background": {
                    call: Interface.changeBackground,
                },
                "Line list": {
                    call: ()=>{History.openLineList()},
                },
            },
            'Save as image': {
                call: ()=>{Interface.saveAsImage()},
            },
            'Save as line list': {
                call: ()=>{History.saveAsLineList()},
            },
        },
        View: {
            'CoordView': {
                call: Interface.CoordViewPanel,
                switchable: "Off",
            },
            'GridView': {
                call: ()=>{Grid.gridView()},
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

    //draw the coord panel
    static coordPanelLogic(){
        let viewPanel = DrawLine.viewPanel;
        let coordX = Math.round(Coord.coordX / Grid.widthCube);
        let coordY = Math.round(Coord.coordY / Grid.widthCube);

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
        let viewPanel = DrawLine.viewPanel;
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
                break;
            case "bezierCurve":
                Interface.drawMode = BezierCurve.bezierCurveLogic;
        }
        console.log('drawMode >'+ value +'< setted');
        Figure.clear(DrawLine.drawCtx);
    }

    static CreateNewDoc() {
        History.history.length = 0;
        Figure.clear(DrawLine.drawBoxCtx);
    }

    static saveAsImage(nameOfImg = 'My image') {
        let url = DrawLine.drawBoxCanv.toDataURL();

        let a = document.createElement("a"); 

        document.body.appendChild(a);
        a.style.display = 'none';
        
        a.href = url;
        a.download = nameOfImg;
        a.click();
        
        a.parentNode.removeChild(a);
    }

    static changeBackground(){
        backgroundCanv.style.backgroundImage = "url('" + prompt('Change image url for background') + "')";
    }
}