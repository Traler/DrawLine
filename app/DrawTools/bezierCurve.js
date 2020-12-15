import { Figure    } from './figure.js';
import { Coord     } from '../Core/coord.js';
import { DrawSpace } from "../Interface/drawSpace.js";
import { History   } from '../Core/history.js';

export class BezierCurve extends Figure {

    static inclineX = 601/2;
    static inclineY = 601/2;

    static drawBezierCurve(ctx = DrawSpace.drawBoxCtx){
        ctx.beginPath();
        ctx.strokeStyle = BezierCurve.color;
        ctx.lineWidth = BezierCurve.width;
        ctx.bezierCurveTo(
            Coord.endedCoord.x,
            Coord.endedCoord.y,
            BezierCurve.inclineX,
            BezierCurve.inclineY,
            Coord.startedCoord.x,
            Coord.startedCoord.y
        );
        ctx.stroke();
        ctx.closePath();
    }

    static drawLogic(e, value){

        Coord.customRound(e);
        
        function click(){
            BezierCurve.inclineX = Coord.startedCoord.x;
            BezierCurve.inclineY = Coord.startedCoord.y;
        }

        function up(){
            BezierCurve.clear(DrawSpace.drawCtx);

            Coord.setEndedCoord();
            if(BezierCurve.isMouseDown && BezierCurve.drawing){
                BezierCurve.drawBezierCurve(DrawSpace.drawBoxCtx);
                Coord.sayCoords('DRAWING END');
                BezierCurve.setHistory();
            }
            BezierCurve.isMouseDown = false;
            BezierCurve.drawing = false;
        }

        function move(){
            Coord.setEndedCoord();

            if (BezierCurve.isMouseDown && !BezierCurve.drawing){
                Coord.sayCoords('DRAWING FROM');
                BezierCurve.drawing = true;
                
                Coord.setStartedCoord();
            
            }

            if(BezierCurve.isMouseDown && BezierCurve.drawing) {
                BezierCurve.clear(DrawSpace.drawCtx);
               
                BezierCurve.drawBezierCurve(DrawSpace.drawCtx);
                
            }
        }

        if(value == 'Click'){
            Coord.setStartedCoord();
            click();
            console.log(BezierCurve.inclineX, BezierCurve.inclineY, Coord.startedCoord.x);
        }

        if(value == 'MouseMove'){
            move();
        }

        if(value == 'MouseUp'){
            up();
        }

        if(value == 'MouseDown'){
            BezierCurve.isMouseDown = true;
        }
    }

    static setHistory(){
        console.log(History.history);

        History.history.push([
            {
                x: Coord.startedCoord.x,
                y: Coord.startedCoord.y
            },
            {
                x: Coord.endedCoord.x,
                y: Coord.endedCoord.y
            },
            {
                color: BezierCurve.color,
                width: BezierCurve.width,
            },
            {
                inclineX: BezierCurve.inclineX,
                inclineY: BezierCurve.inclineY,
            },
            'bezierCurve',
        ]);
    }

    static reDraw(history, ctx = DrawSpace.drawBoxCtx){
        history.forEach((drawList) => {
            
            ctx.strokeStyle = drawList[2]['color'];
            ctx.lineWidth = drawList[2]['width'];
            ctx.beginPath();
    
            if(drawList[4] == 'bezierCurve'){
                ctx.bezierCurveTo(
                    drawList[1].x,
                    drawList[1].y,
                    drawList[3].inclineX,
                    drawList[3].inclineY,
                    drawList[0].x,
                    drawList[0].y,
                );
            }
            ctx.stroke();
            ctx.closePath();
            
        });
    }
}