import { Coord } from './coord.js';
import { Line } from '../DrawTools/line.js';
import { Circle } from '../DrawTools/circle.js';
import { BezierCurve } from '../DrawTools/bezierCurve.js';
import { DrawLine } from             "./main.js";
import { Figure } from '../DrawTools/figure.js';

export class History {

    static history = [];

    static setHistory(type){

        History.history.push(
            [
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
                type,
            ]
        );

        if(type == 'circle'){
            const length = History.history.length - 1;
            History.history[length].push(
                {
                    Radius: Circle.radius,
                    StartAngle: Circle.startAngle,
                    EndAngle: Circle.endAngle,
                    Arrow: Circle.arrow,
                }
            );
        }

        if(type == 'bezierCurve'){
            const length = History.history.length - 1;
            History.history[length].push(
                {
                    BezierCurve: BezierCurve.inclineX,
                    BezierCurve: BezierCurve.inclineY,
                }
            );
        }
    }

    static drawLinesFromObject(lineList, ctx = DrawLine.drawBoxCtx) {

        lineList.forEach((lineCoords) => {
            
            ctx.strokeStyle = lineCoords[2]['color'];
            ctx.lineWidth = lineCoords[2]['width'];
            ctx.beginPath();

            if(lineCoords[3] == 'line'){
                ctx.moveTo(lineCoords[0].x, lineCoords[0].y);
                ctx.lineTo(lineCoords[1].x, lineCoords[1].y);
            }
            
            if (lineCoords[3] == 'bezierCurve'){
                ctx.bezierCurveTo(
                    lineCoords[1].x,
                    lineCoords[1].y, 
                    lineCoords[4].inclineX, 
                    lineCoords[4].inclineY, 
                    lineCoords[0].x, 
                    lineCoords[0].y
                );
            }
            
            if(lineCoords[3] == 'circle'){
                ctx.arc(
                    lineCoords[1].x,
                    lineCoords[1].y,
                    lineCoords[4].Radius,
                    lineCoords[4].StartAngle,
                    lineCoords[4].EndAngle,
                    lineCoords[4].Arrow,
                );
            }

            ctx.stroke();
            ctx.closePath();
            
        });

    }

    static undo(history = History.history){
        history.pop();
        Figure.clear(DrawLine.drawBoxCtx);
        History.drawLinesFromObject(history);
    }

    static initEvents(){
        document.addEventListener('keydown', function(e){
            if(e.code == 'KeyZ'){
                History.undo(); 
            }
        });
    }

    static saveAsLineList(history = History.history){
        let a = document.createElement("a"); 

        document.body.appendChild(a);
        a.style.display = 'none';

        let str = JSON.stringify(history, null, 3);
        
        let file = new Blob([str], {type: "text/javascript"});
        a.href = URL.createObjectURL(file);
        a.download = 'Line List.txt';
        a.click();
        
        a.parentNode.removeChild(a);
    }

    static openLineList(color, width){

        let input = document.createElement("input"); 

        document.body.appendChild(input);
        input.style.display = 'none';
        input.type = 'file';

        input.addEventListener('change', function(e){
            let file = e.target.files[0];

            if (!file) {
                return;
            }
            let reader = new FileReader();

            reader.onload = function(e) {
                let data = e.target.result;
                
                let parseData = JSON.parse(data);

                if(data == "" || typeof parseData[0] != 'object'){
             
                    console.error('Is not LineList');
                    return;
                }

                color = prompt('color:', '#00ff08');
                width = prompt('width:', 1);
                width = Number(width);

                if(typeof color == 'string' && typeof width == 'number'){
                    parseData.forEach(function(item, index){
                        parseData[index][2].width = width;
                        parseData[index][2].color = color;
                    })
                }
                
                History.history = History.history.concat(parseData); 
                
                History.drawLinesFromObject(parseData);
            };
            reader.readAsText(file);
        });

        input.click();
        input.parentNode.removeChild(input);
    }
}