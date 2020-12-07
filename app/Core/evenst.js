import {  Grid  } from   "../Interface/DrawArea/grid.js";
import {  Cursor  } from   "../Interface/DrawArea/cursor.js";
import {  Menu  } from   "../Interface/menu.js";
import {  CoordPanel  } from   "../Interface/DrawArea/coordPanel.js";
import { History } from './history.js';

export class Events {    
    
    //add events
    static init(){
        Grid.ininEvents();
        History.initEvents();
        Menu.initEvents();
        Cursor.ininEvents();
        CoordPanel.initEvents();
        console.log('Class >Events< started');
    }
}