import { Coord       } from '../Core/coord.js';
import { History     } from '../Core/history.js';

import { Line        } from "../DrawTools/line.js";
import { Circle      } from '../DrawTools/circle.js';
import { BezierCurve } from '../DrawTools/bezierCurve.js';
import { Figure      } from '../DrawTools/figure.js';

import { DrawSpace   } from '../Interface/drawSpace.js';
import { Menu        } from '../Interface/menu.js';
import { ToolsMenu   } from "../Interface/toolsMenu.js";
import { WheelColor  } from "../Interface/wheelColor.js";

export function viewClases(){
    window.dev = {
        "coord"       : Coord,
        "history"     : History,
        "line"        : Line,
        "circle"      : Circle,
        "bezierCurve" : BezierCurve,
        "figure"      : Figure,
        "drawSpace"   : DrawSpace,
        "menu"        : Menu,
        "toolsMenu"   : ToolsMenu,
        "wheelColor"  : WheelColor,
    }
    console.dir(dev);
}