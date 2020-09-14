//...

class DrawLine{
    drawBoxSize = {
        width: null,
        height: null,
    };

    constructor(width, height) {
        this.drawBoxSize.width = width;
        this.drawBoxSize.height = height;
    }

    static init(){
        return new DrawLine(600, 600);
    }
}

let drawLine = DrawLine.init();

class Interface{
    //horizontal-menu
    static initMenu(){
        //logic for menu
        //html, structure of menu, there methods

        // Creating HTML horizontal menu div - ul
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
                
                    return;
                }

                let ulTag = document.createElement("ul");
                liTag.appendChild(ulTag);

                levelConstructor(ulTag, menuItem);
            });
        }

        levelConstructor(menuUlTag, Interface.menu);
    }
    //vertical-menu
    static initTools(){
        //
    }

    static initCanvas(){
        //draw the canvas
        function createBackground() {

        }

        function createGrid() {

        }

        function createDrawBox() {

        }

        function createAuxiliaries() {
            //actual
        }


    }

    static menu = {
        File: {
            "New document": {
                call: Interface.CreateNewDoc,
            },
            "Import": {
                "Image background": {
                    call: () => {},
                },
                "Line list": {
                    call: () => {},
                },
            },
        },
        View: {
            CoordView: {
                call: Interface.CoordViewPanel,
                switchable: true,
            },
            Grid: {
                call: null,
                switchable: true,
            },
        }
    };

    static CoordViewPanel(switchState) {
        function activate() {
            coordView.style.display = 'block';
        }

        function deactivate() {
            coordView.style.display = 'none';
        }

        alert("CoordViewPanel logics...");
    }

    static CreateNewDoc() {
        alert("CreateNewDoc logics...");
    }
}