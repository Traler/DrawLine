

export class DrawSpace {
    static drawBoxSize = {
        width: 601,
        height: 601,
    };

    backgroundCtx;
    backgroundCanv;

    gridCtx;
    gridCanv;

    drawBoxCtx;
    drawBoxCanv;

    cursorCtx;
    cursorCanv;

    drawCtx;
    drawCanv;

    //draw canvases
    static initCanvases(width, height){

        //create the canvas
        function createContainerForCanvases(){
            let paint = document.createElement('div');
            paint.setAttribute('class', 'paint');

            let canvases = document.createElement("div");
            canvases.setAttribute("class", 'canvases');
            paint.appendChild(canvases);
            canvases.setAttribute('width', width);
            canvases.setAttribute('height', height);

            document.body.appendChild(paint);

            canvases.style.border = '1px solid white';
            return canvases;
        }

        let canvases = createContainerForCanvases();

        function createCanv(){
                let canv = document.createElement('canvas');
                canv.setAttribute('class', 'canvas');
                canvases.appendChild(canv);
                canv.setAttribute('width', width);
                canv.setAttribute('height', height);
                return canv;
        }

        function createBackground() {
            let backgroundCanv = createCanv();
            backgroundCanv.setAttribute('id', 'backgroundCanv');
            DrawSpace.backgroundCanv = backgroundCanv;    
            DrawSpace.backgroundCtx = backgroundCanv.getContext('2d');        
        }

        function createGrid() {
            let gridCanv = createCanv();
            gridCanv.setAttribute('id', 'gridCanv');
            DrawSpace.gridCanv = gridCanv;
            DrawSpace.gridCtx = gridCanv.getContext('2d');
        }

        function createDrawBox() {
            let drawBoxCanv = createCanv();
            drawBoxCanv.setAttribute('id', 'drawBoxCanv');
            DrawSpace.drawBoxCanv = drawBoxCanv;
            DrawSpace.drawBoxCtx = drawBoxCanv.getContext('2d');
        }

        function createAuxiliaries() {
            //actual cursor and drawing line
            function cursor(){
                let cursorCanv = createCanv();
                cursorCanv.setAttribute('id', 'cursorCanv');
                DrawSpace.cursorCanv = cursorCanv;
                DrawSpace.cursorCtx = cursorCanv.getContext('2d');
            }

            function draw(){
                let drawCanv = createCanv();
                drawCanv.setAttribute('id', 'drawCanv');
                DrawSpace.drawCanv = drawCanv;
                DrawSpace.drawCtx = drawCanv.getContext('2d');
            }
            draw();
            cursor();
        }

        createBackground();
        createGrid();
        createDrawBox();
        createAuxiliaries();
    }
}