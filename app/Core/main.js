import {  Cursor  } from   "../Interface/DrawArea/cursor.js";
import {  Grid  } from   "../Interface/DrawArea/grid.js";
import { Menu } from             "../Interface/menu.js";
import { ToolsMenu } from "../Interface/toolsMenu.js";
import { WheelColor } from "../Interface/wheelColor.js";
import { CoordPanel } from "../Interface/DrawArea/coordPanel.js";
import { DrawSpace } from "../Interface/drawSpace.js";
import { History } from "./history.js"

export class DrawLine {

    static init(){
        //create menus
        Menu.initMenu();
        ToolsMenu.initTools()

        //create wheel color plane
        WheelColor.init();

        //create canvases
        DrawSpace.initCanvases(DrawSpace.drawBoxSize.width, DrawSpace.drawBoxSize.height);
        console.log('Class >Interface< started');

        //create coord view panel
        CoordPanel.createCoordPanel();

        //draw the grid in draw space
        Grid.drawGrid();
        console.log('Method >Grid< drawed');

        //create envents
        Grid.ininEvents();
        History.initEvents();
        Cursor.ininEvents();
        Menu.initEvents();
        CoordPanel.initEvents();

        //set draw mode (for draw line) (is a custom draw mode)
        Menu.setDrawMode('line');

        //run the app
        return new DrawLine();
    }
}

//start the program
window.onload = function(){
    let drawLine = DrawLine.init();
}