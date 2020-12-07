import { Figure } from './figure.js';
import { Coord } from '../Core/coord.js';
import { DrawLine } from '../Core/main.js';
import { Menu } from '../Interface/menu.js';
import { History } from '../Core/history.js';

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
            console.log(BezierCurve.inclineX, BezierCurve.inclineY);
        }

        function up(){
            BezierCurve.clear(Menu.drawCtx);

            Coord.setEndedCoord();
            if(BezierCurve.isMouseDown && BezierCurve.drawing){
                BezierCurve.drawBezierCurve(Menu.drawBoxCtx);
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
                BezierCurve.clear(Menu.drawCtx);
                if(Coord.inclineX !== 601/2){
                    BezierCurve.drawBezierCurve(Menu.drawCtx);
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
                BezierCurve: BezierCurve.inclineX,
                BezierCurve: BezierCurve.inclineY,
            },
            'bezierCurve',
        ]);
    }

    static reDraw(history, ctx = DrawLine.drawBoxCtx){
        history.forEach((drawList) => {
            
            ctx.strokeStyle = drawList[2]['color'];
            ctx.lineWidth = drawList[2]['width'];
            ctx.beginPath();
    
            if(drawList[3] == 'bezierCurve'){
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