import { Grid } from "../Interface/DrawArea/grid.js";


export class ToolsMenu {
    static initTools(){
        let menuTag = document.createElement("div");
        menuTag.setAttribute("class", "vertical-menu");
        document.body.appendChild(menuTag);
        
        let input = document.createElement('input');
        input.setAttribute('type', 'color');
        menuTag.appendChild(input);
    }

    static changeColor(color){
        Grid.color = color;
    }
}