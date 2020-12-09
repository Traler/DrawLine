import { Figure } from '../../DrawTools/figure.js';
import { DrawLine } from '../../Core/main.js';
import { DrawSpace } from "../drawSpace.js";

//is a class for grid.
//grid logic and how to draw a grid
export class Grid {
    static drawMode = 'grid';

    static color = 'white';
    static width = 0.1;

    static cellCount = 10;
    static widthCube;

    static visibility = true;
    static wheelGrid = true;

    static ininEvents(){

        document.addEventListener('keydown', function(e){
            if(e.code == 'KeyG'){
                Grid.gridView(); 
            }
        });
        
        document.addEventListener('wheel', function(e){
            Grid.wheel(e);
        }); 
    }

    static drawGrid(cellCount = Grid.cellCount, ctx = DrawSpace.gridCtx){
        if(!Grid.visibility){
            return;
        }
        Figure.clear(ctx);

        Grid.widthCube = DrawSpace.drawBoxSize.width / cellCount;

        ctx.lineWidth = Grid.width;
        ctx.strokeStyle = Grid.color;
    
        for (let n = 0; n < cellCount*Grid.widthCube; n+=Grid.widthCube) {
        for (let t = 0; t < cellCount*Grid.widthCube; t+=Grid.widthCube){
            ctx.beginPath();
            ctx.strokeRect(n, t, Grid.widthCube, Grid.widthCube);
            ctx.closePath();
            ctx.stroke();
            }
        }
    }

    static gridView(){
        if(Grid.visibility){
            Grid.visibility = false;
            Grid.wheelGrid = false;
            Figure.clear();
        }else{
            Grid.visibility = true;
            Grid.wheelGrid = true;
          
            Grid.drawGrid();
        }
    }

    //function for wheel the grid in draw space
    static wheel(e){   
        if(!Grid.wheelGrid){
            return;
        }

        let max = Grid.cellCount <= 300;
        let min = Grid.cellCount >= 1;
        let interval = max && min;

        if(interval && e.deltaY > 0 || !max){
            Grid.cellCount -= 1;
        }else{
            Grid.cellCount += 1;
        }
        Grid.drawGrid(Grid.cellCount);
}

}