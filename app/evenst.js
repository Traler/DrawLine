import { DrawLine } from             "./main.js";
import {  Grid  } from   "./drawMods/grid.js";
import {  Cursor  } from   "./cursor.js";
import {  Interface  } from   "./interface.js";
import { History } from './history.js';


export class Events {
    
    //add events
    static init(){
        Events.mouseEvents();
        Events.keyEvents();
        console.log('Class >Events< started');
    }

    //add mouse events
    static mouseEvents(){
        DrawLine.cursorCanv.addEventListener('mouseup', function(e) {
            Interface.drawMode(e, 'MouseUp');
        });
        
        DrawLine.cursorCanv.addEventListener('mousemove', function(e){
            Interface.drawMode(e, 'MouseMove');
            //draw the cursor
            Cursor.drawCursor();
            //draw the coord panel
            Interface.coordPanelLogic();
        });

        DrawLine.cursorCanv.addEventListener('mousedown', function(e) {
            Interface.drawMode(e, 'MouseDown');
        });

        DrawLine.cursorCanv.addEventListener('wheel', function(e){
            Grid.wheel(e);
        });

        DrawLine.cursorCanv.addEventListener('click', function(e){
            Interface.drawMode(e, 'Click');
        });
    }


    static keyEvents(){
        document.addEventListener('keydown', (e)=>{

            if(e.code == 'KeyS'){
                Interface.saveAsImage();
            }

            if(e.code == 'KeyG'){
                Grid.gridView(); 
            }

            if(e.code == 'KeyZ'){
                History.undo(); 
            }

        });
    }

    static clickEvents(){
        DrawLine.cursorCanv.addEventListener('click', function(e) {
            Interface.drawMode(e, 'Click');
        });
    }

}