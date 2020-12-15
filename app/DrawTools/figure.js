import { DrawSpace } from "../Interface/drawSpace.js";

//is abstract class for custom props for other figures
export class Figure {

    static drawing;
    static isMouseDown = false;

    static width = 1;
    static color = '#00ff08';
    static auxiliarieColor = 'red';

    static #drawMode;

    static clear(ctx = DrawSpace.gridCtx){
        let width = DrawSpace.drawBoxSize.width;
        let height = DrawSpace.drawBoxSize.height;
        ctx.clearRect(0, 0, width, height); 
    }

    //is for create events for draw and
    //is for not copy to other class
    static #initEvents(){
        DrawSpace.cursorCanv.addEventListener('click', function(e){
            Figure.#drawMode(e, 'Click');
        });
        DrawSpace.cursorCanv.addEventListener('mouseup', function(e) {
            Figure.#drawMode(e, 'MouseUp');
        });
        
        DrawSpace.cursorCanv.addEventListener('mousemove', function(e){
            Figure.#drawMode(e, 'MouseMove');
        });

        DrawSpace.cursorCanv.addEventListener('mousedown', function(e) {
            Figure.#drawMode(e, 'MouseDown');
        });
    }

    static setDrawMode(that = this){
        Figure.#drawMode = that.drawLogic;
        console.log("DrawMode >" + that.name + "< is changed");
        Figure.clear(DrawSpace.drawCtx);
    }

    //for create the events
    static initEvents(){
        Figure.#initEvents();
    }
}