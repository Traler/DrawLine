import { DrawLine } from '../../Core/main.js';
import { Coord } from '../../Core/coord.js';
import { Grid } from '../../Interface/DrawArea/grid.js';
import { Menu } from '../../Interface/menu.js';
import { DrawSpace } from "../drawSpace.js";

export class CoordPanel {

    viewPanel;

    //is a value has got a current drawLogic function
    static drawMode;

    static initEvents(){
        DrawSpace.cursorCanv.addEventListener('mousemove', function(e){
            CoordPanel.coordPanelLogic();
        });
    }

    static createCoordPanel(){
        let viewPanel = document.createElement("div"); 
        viewPanel.setAttribute('class', 'coordView');

        DrawSpace.cursorCanv.parentNode.appendChild(viewPanel);
        viewPanel.style.display = 'none';
        CoordPanel.viewPanel = viewPanel;
    }

    //draw the coord panel
    static coordPanelLogic(){
        let viewPanel = CoordPanel.viewPanel;
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
        let viewPanel = CoordPanel.viewPanel;
        let switchable = Menu.menu.View.CoordView.switchable;

        if(switchable.innerHTML == 'Off'){
            viewPanel.style.display = 'block';
        }else if(switchable.innerHTML == 'On'){
            viewPanel.style.display = 'none';
        }
    }
}