import { Figure } from './figure.js';
import { DrawSpace } from "../Interface/drawSpace.js";
import { History } from '../Core/history.js';
import { Coord } from '../Core/coord.js';

//is a class for draw line
//and how to draw a line
export class Line extends Figure {

    //how to draw the line
    static drawLine(ctx, color = Line.color){
        let startedCoord = Coord.startedCoord;
        let endedCoord = Coord.endedCoord;

        ctx.strokeStyle = color;
        ctx.lineWidth = Line.width;
        ctx.beginPath();
        ctx.moveTo(startedCoord.x, startedCoord.y);
        ctx.lineTo(endedCoord.x, endedCoord.y); 
        ctx.stroke();
        ctx.closePath();
    }

    //logic for draw the line
    static drawLogic(e, value){

        Coord.customRound(e);

        function up(){
            Line.clear(DrawSpace.drawCtx);

            Coord.setEndedCoord();
            if(Line.isMouseDown && Line.drawing){
                Line.drawLine(DrawSpace.drawBoxCtx, Line.color)
                Coord.sayCoords('DRAWING END');
                Line.setHistory();
            }
            Line.isMouseDown = false;
            Line.drawing = false;
        }

        function move(){
            Coord.setEndedCoord();

            if (Line.isMouseDown && !Line.drawing){
                Coord.sayCoords('DRAWING FROM');
                Line.drawing = true;
            
                Coord.setStartedCoord();
            }

            //draw the line
            
            if(Line.isMouseDown && Line.drawing) {
                Line.clear(DrawSpace.drawCtx);
                Line.drawLine(DrawSpace.drawCtx, Line.auxiliarieColor);
            }
        }

        if(value == 'MouseUp'){
            up();
        }else if(value == 'MouseMove'){
            move();
        }

        if(value == 'MouseDown'){
            Line.isMouseDown = true;
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
                color: Line.color,
                width: Line.width,
            },
            'line',
        ]);
    }

    static reDraw(history, ctx = DrawSpace.drawBoxCtx){
        history.forEach((drawList) => {
            
            ctx.strokeStyle = drawList[2]['color'];
            ctx.lineWidth = drawList[2]['width'];
            ctx.beginPath();

            if(drawList[3] == 'line'){
                ctx.moveTo(drawList[0].x, drawList[0].y);
                ctx.lineTo(drawList[1].x, drawList[1].y);
            }
            ctx.stroke();
            ctx.closePath();
            
        });
    }
}