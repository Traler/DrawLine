import { Figure } from './figure.js';
import { DrawLine } from '../main.js';

import { History } from '../history.js';

import { Coord } from '../cord.js';

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
    static lineLogic(e, value){

        Coord.customRound(e);

        function up(){
            Line.clear(DrawLine.drawCtx);

            Coord.setEndedCoord();
            if(Line.isMouseDown && Line.drawing){
                Line.drawLine(DrawLine.drawBoxCtx, Line.color)
                Coord.sayCoords('DRAWING END');
                History.setHistory('line');
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
                Line.clear(DrawLine.drawCtx);
                Line.drawLine(DrawLine.drawCtx, Line.auxiliarieColor);
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
}