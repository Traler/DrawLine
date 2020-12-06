import {  Grid  } from   "../Interface/DrawArea/grid.js";
import {  Cursor  } from   "../Interface/DrawArea/cursor.js";
import {  Interface  } from   "../Interface/interface.js";
import { History } from './history.js';

export class Events {    
    
    //add events
    static init(){
        Grid.ininEvents();
        History.initEvents();
        Interface.initEvents();
        Cursor.ininEvents();
        console.log('Class >Events< started');
    }
}