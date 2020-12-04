import { DrawLine } from '../main.js';
//is abstract class for custom props for other figures
export class Figure {

    static drawing;
    static isMouseDown = false;

    static width = 1;
    static color = 'blue';
    static auxiliarieColor = 'red';

    static clear(ctx = DrawLine.gridCtx){
        let width = DrawLine.drawBoxSize.width;
        let height = DrawLine.drawBoxSize.height;
        ctx.clearRect(0, 0, width, height); 
    }
}