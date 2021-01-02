import { Grid       } from "../Interface/DrawArea/grid.js";
import { Menu       } from "../Interface/menu.js";
import { ToolsMenu  } from "../Interface/toolsMenu.js";
import { WheelColor } from "../Interface/wheelColor.js";
import { CoordPanel } from "../Interface/DrawArea/coordPanel.js";
import { DrawSpace  } from "../Interface/drawSpace.js";
import { Line       } from "../DrawTools/line.js";

import EventList from "./eventList.js";

export class DrawLine {

    static init(){
        //create menus
        Menu.initMenu();
        console.log("Init menu");
        ToolsMenu.initTools()
        console.log("Init tools menu");

        //create wheel color plane
        WheelColor.init();
        console.log("Init wheel color picker");

        //create canvases
        DrawSpace.initCanvases(DrawSpace.drawBoxSize.width, DrawSpace.drawBoxSize.height);
        console.log("Init canvases");

        //create coord view panel
        CoordPanel.createCoordPanel();
        console.log("Init coord panel");

        //init events
        EventList.forEach((el)=>{
            el.initEvents();
        });
        
        console.log("Init events");

        //draw the grid in draw space
        Grid.drawGrid();
        console.log("Draw grid");

        //set draw mode (for draw line) (line is a custom draw mode)
        Line.setDrawMode();

        //run the app
        return new DrawLine();
    }
}

//folder dev: for add to window the classes links
import { viewClases } from "../dev/viewClasses.js";

//start the program
window.onload = function(){
    let drawLine = DrawLine.init();
    viewClases();
}