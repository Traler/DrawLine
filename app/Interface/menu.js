import { DrawSpace } from './drawSpace.js';
import { Grid } from '../Interface/DrawArea/grid.js';
import { Figure } from '../DrawTools/figure.js';
import { History } from '../Core/history.js';
import { CoordPanel } from './DrawArea/coordPanel.js';
import { Circle } from '../DrawTools/circle.js';
import { BezierCurve } from '../DrawTools/bezierCurve.js';

import { Line } from "../DrawTools/line.js";

export class Menu {

    static initMenu(){

        let headerTag = document.createElement("header");

        let menuTag = document.createElement("div");
        menuTag.setAttribute("class", "horizontal-menu");

        let menuUlTag = document.createElement("ul");

        menuTag.appendChild(menuUlTag);
        headerTag.appendChild(menuTag);

        document.body.appendChild(headerTag);

        function levelConstructor(contextTag, items) {
            let levelKeys = Object.keys(items);
        
            levelKeys.forEach((menuItemName) => {
                let liTag = document.createElement("li");
                let divTag = document.createElement("div");
                divTag.innerHTML = menuItemName;

                liTag.appendChild(divTag);

                contextTag.appendChild(liTag);

                const menuItem = items[menuItemName];
    
                if("call" in menuItem) {
                    liTag.addEventListener('click', menuItem.call);
                        if("switchable" in menuItem){
                            let rightLi = document.createElement('div');
                            liTag.appendChild(rightLi);
                            rightLi.innerHTML = menuItem.switchable;

                            liTag.addEventListener('click', function(e){
                                if(rightLi.innerHTML == 'On'){
                                    rightLi.innerHTML = 'Off';
                                }else if(rightLi.innerHTML == 'Off'){
                                    rightLi.innerHTML = 'On';
                                }
                               
                            });

                            menuItem.switchable = rightLi;
                            rightLi.setAttribute('class', 'rightLi');
                        }
                    return;
                }

                let ulTag = document.createElement("ul");
                liTag.appendChild(ulTag);

                levelConstructor(ulTag, menuItem);
            });
        }

        levelConstructor(menuUlTag, Menu.menu);
    }

    static menu = {
        File: {
            'New document': {
                call: Menu.CreateNewDoc,
            },
            Import: {
                "Image background": {
                    call: Menu.changeBackground,
                },
                "Line list": {
                    call: ()=>{History.openLineList()},
                },
            },
            'Save as image': {
                call: ()=>{Menu.saveAsImage()},
            },
            'Save as line list': {
                call: ()=>{History.saveAsLineList()},
            },
        },
        View: {
            'CoordView': {
                call: ()=>{CoordPanel.CoordViewPanel()},
                switchable: "Off",
            },
            'GridView': {
                call: ()=>{Grid.gridView()},
                switchable: "On",
            },
        },
        'Draw Mode':{
            'Line': {
                call: () => {Line.setDrawMode()},
            },
            'Circle': {
                call: () => {Circle.setDrawMode()},
            },
            'Bezier curve': {
                call: () => {BezierCurve.setDrawMode()},
            }
        }
    };

    static initEvents(){
        document.addEventListener('keydown', (e)=>{
            if(e.code == 'KeyS'){
                Menu.saveAsImage();
            }
        });
    }

    static CreateNewDoc() {
        History.history.length = 0;
        Figure.clear(DrawSpace.drawBoxCtx);
    }

    static saveAsImage(nameOfImg = 'My image') {
        let url = DrawSpace.drawBoxCanv.toDataURL();

        let a = document.createElement("a"); 

        document.body.appendChild(a);
        a.style.display = 'none';
        
        a.href = url;
        a.download = nameOfImg;
        a.click();
        
        a.parentNode.removeChild(a);
    }

    static changeBackground(){
        DrawSpace.backgroundCanv.style.backgroundImage = "url('" + prompt('Change image url for background') + "')";
    }
}