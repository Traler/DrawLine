import { DrawLine } from '../../Core/main.js';
import { Coord } from '../../Core/coord.js';
import { Grid } from '../../Interface/DrawArea/grid.js';
import { Menu } from '../../Interface/menu.js';

export class CoordPanel {

    //is a value has got a current drawLogic function
    static drawMode;

    static initEvents(){
        DrawLine.cursorCanv.addEventListener('mousemove', function(e){
            CoordPanel.coordPanelLogic();
        });
    }

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
        let switchable = Menu.menu.View.CoordView.switchable;

        if(switchable.innerHTML == 'Off'){
            viewPanel.style.display = 'block';
        }else if(switchable.innerHTML == 'On'){
            viewPanel.style.display = 'none';
        }
    }
}