import { Grid      } from "../Interface/DrawArea/grid.js";
import { DrawSpace } from "./drawSpace.js";

export class ToolsMenu {

    input;

    static initTools(){
        let menuTag = document.createElement("div");
        menuTag.setAttribute("class", "vertical-menu");
        document.body.appendChild(menuTag);
        
        let input = document.createElement('input');
        input.setAttribute('type', 'color');
        menuTag.appendChild(input);
        ToolsMenu.input = input;
        ToolsMenu.initEvents();
    }

    static changeColor(color){
        Grid.color = color;
    }

    static initEvents(){
        ToolsMenu.input.addEventListener('change', (e)=>{
            Grid.color = ToolsMenu.input.value;
            Grid.drawGrid();
        });
    }
}