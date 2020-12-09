import { Coord } from '../../Core/coord.js';
import { Figure } from '../../DrawTools/figure.js';
import { DrawLine } from '../../Core/main.js';
import { DrawSpace } from "../drawSpace.js";

export class Cursor {

    static color = 'red';
    static radius = 3;

    static visibility = true;

    static ininEvents(){
        document.addEventListener('mousemove', (e)=>{
            Cursor.drawCursor();
        });
    }

    static drawCursor(ctx = DrawSpace.cursorCtx){

        if(!Cursor.visibility){
            return;
        }
        Figure.clear(ctx);

        ctx.fillStyle = Cursor.color;
        ctx.beginPath();
        ctx.arc(Coord.coordX, Coord.coordY, Cursor.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }
}