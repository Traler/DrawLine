import { Grid   }   from  "./drawMods/grid.js";
import { DrawLine } from './main.js';

export class Coord {

    //is a first coord
    static endedCoord = {
        x: -1,
        y: -1,
    }
    
    //is a second coord
    static startedCoord = {
        x: -1,
        y: -1,
    }

    //Is a magnetized coordinates to the grid
    static coordX = -1;
    static coordY = -1;

    //set a coordX and coordY
    static customRound(e) {
        let x = e.layerX - DrawLine.gridCanv.offsetLeft;
        let y = e.layerY - DrawLine.gridCanv.offsetTop;
        Coord.coordX = Grid.widthCube * Math.round(x / Grid.widthCube);
        Coord.coordY = Grid.widthCube * Math.round(y / Grid.widthCube);
    }

    //set 'endedCoord' for draw
    static setEndedCoord(){
        Coord.endedCoord.x = Coord.coordX;
        Coord.endedCoord.y = Coord.coordY;
    }

    //set 'startedCoord' for draw
    static setStartedCoord(){
        Coord.startedCoord.x = Coord.coordX;
        Coord.startedCoord.y = Coord.coordY;
    }

    //say the cords
    static sayCoords(event){

        let coordX = Coord.coordX;
        let coordY = Coord.coordY;

        console.log(event, coordX / Grid.widthCube, coordY / Grid.widthCube);
    }
    
}