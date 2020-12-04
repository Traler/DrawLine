import {Figure} from './figure.js';
import { Coord } from '../cord.js';
import { DrawLine } from '../main.js';
import {  Grid  } from   "./grid.js";
import { History } from '../history.js';


export class Circle extends Figure {

  static endAngle = Math.PI * 2;
  static startAngle = 0;
  static arrow = false;
  static radius = 60.1;

  static drawCircle(ctx = DrawLine.drawBoxCtx){
      Circle.radius = Grid.widthCube;
      ctx.strokeStyle = Circle.color;
      ctx.lineWidth = Circle.width;
      ctx.beginPath();
      ctx.arc(Coord.startedCoord.x,
          Coord.startedCoord.y,
          Circle.radius,
          Circle.startAngle,
          Circle.endAngle,
          Circle.arrow
      );
      
      ctx.stroke();
  }

  static circleLogic(e, value){

      Coord.customRound(e);
      Circle.clear(DrawLine.drawCtx)

      Coord.setEndedCoord();
      Coord.setStartedCoord();

      function click(){
          Circle.drawCircle();
          History.setHistory('circle');
          Coord.sayCoords('DRAWING IN');
      }

      function move(){
          Circle.drawCircle(DrawLine.drawCtx);
      }
      
      if(value == 'Click'){
          click();
      }else if(value == 'MouseMove'){
          move();
      }

  }
}