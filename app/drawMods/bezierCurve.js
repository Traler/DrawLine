import { Figure } from './figure.js';
import { Coord } from '../cord.js';
import { DrawLine } from '../main.js';
import { Interface } from '../interface.js';
import { History } from '../history.js';

export class BezierCurve extends Figure {

    static inclineX = 601/2;
    static inclineY = 601/2;

    static drawBezierCurve(ctx = DrawLine.drawBoxCtx){
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

    static bezierCurveLogic(e, value){

        Coord.customRound(e);
        
        function click(){
            BezierCurve.inclineX = Coord.startedCoord.x;
            BezierCurve.inclineY = Coord.startedCoord.y;
        }

        function up(){
            BezierCurve.clear(Interface.drawCtx);

            Coord.setEndedCoord();
            if(BezierCurve.isMouseDown && BezierCurve.drawing){
                BezierCurve.drawBezierCurve(Interface.drawBoxCtx);
                Coord.sayCoords('DRAWING END');
                History.setHistory('bezierCurve');
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
                BezierCurve.clear(Interface.drawCtx);
                if(Coord.inclineX !== 601/2){
                    BezierCurve.drawBezierCurve(Interface.drawCtx);
                }
            }
        }
        

        if(value == 'Click'){
            click();
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
}