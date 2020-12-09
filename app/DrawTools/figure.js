import { DrawLine } from '../Core/main.js';
import { DrawSpace } from "../Interface/drawSpace.js";

//is abstract class for custom props for other figures
export class Figure {

    static drawing;
    static isMouseDown = false;

    static width = 1;
    static color = 'blue';
    static auxiliarieColor = 'red';

    static clear(ctx = DrawSpace.gridCtx){
        let width = DrawSpace.drawBoxSize.width;
        let height = DrawSpace.drawBoxSize.height;
        ctx.clearRect(0, 0, width, height); 
    }
}