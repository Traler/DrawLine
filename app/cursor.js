import { DrawLine } from './main.js';
import { Coord } from './cord.js';
import { Figure } from './drawMods/figure.js';

export class Cursor {

    static color = 'red';
    static radius = 3;

    static visibility = true;

    static drawCursor(ctx = DrawLine.cursorCtx){

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