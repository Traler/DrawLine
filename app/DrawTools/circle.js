import { Figure    } from './figure.js';
import { Coord     } from '../Core/coord.js';
import { Grid      } from   "../Interface/DrawArea/grid.js";
import { History   } from '../Core/history.js';
import { DrawSpace } from "../Interface/drawSpace.js";

export class Circle extends Figure {

  static endAngle = Math.PI * 2;
  static startAngle = 0;
  static arrow = false;
  static radius = 60.1;

  static drawCircle(ctx = DrawSpace.drawBoxCtx){
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

  static drawLogic(e, value){

      Coord.customRound(e);
      Circle.clear(DrawSpace.drawCtx)

      Coord.setEndedCoord();
      Coord.setStartedCoord();

      function click(){
          Circle.drawCircle();
          Circle.setHistory();
          Coord.sayCoords('DRAWING IN');
      }

      function move(){
          Circle.drawCircle(DrawSpace.drawCtx);
      }
      
      if(value == 'Click'){
          click();
      }else if(value == 'MouseMove'){
          move();
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
            color: Circle.color,
            width: Circle.width,
        },
        {
            Radius: Circle.radius,
            StartAngle: Circle.startAngle,
            EndAngle: Circle.endAngle,
            Arrow: Circle.arrow,
        },
        "circle",
    ]);
  }

  static reDraw(history, ctx = DrawSpace.drawBoxCtx){
    history.forEach((drawList) => {
            
        ctx.strokeStyle = drawList[2]['color'];
        ctx.lineWidth = drawList[2]['width'];
        ctx.beginPath();

        if(drawList[3] == 'circle'){
            ctx.arc(
                drawList[0].x,
                drawList[0].y,
                drawList[2].Radius,
                drawList[2].StartAngle,
                drawList[2].EndAngle,
                drawList[2].Arrow,
            );
        }
        ctx.stroke();
        ctx.closePath();
        
    });
  }
}