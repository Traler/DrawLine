import { DrawLine } from             "./main.js";
import { Figure } from '../DrawTools/figure.js';
import { Line } from '../DrawTools/line.js';
import { Circle } from '../DrawTools/circle.js';
import { BezierCurve } from '../DrawTools/bezierCurve.js';
import { DrawSpace } from "../Interface/drawSpace.js";


export class History {

    static history = [];

    static drawLinesFromObject(drawHistory) {
        Line.reDraw(drawHistory);
        Circle.reDraw(drawHistory);
        BezierCurve.reDraw(drawHistory);
    }

    static undo(history = History.history){
        history.pop();
        Figure.clear(DrawSpace.drawBoxCtx);
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