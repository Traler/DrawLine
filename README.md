# DrawLine

## **Documentation**

## Classes

- **DrawLine** – is a base class. Is started the other classes.
- **Interface** – is a class for draw menus, canvases and user interaction. 
- **Events** – is a class for create and use the events. 
- **Coord** – is a class for getting or set cords for draw. 
- **Grid** – is a grid in draw space (canvases). It turns on automatically in *DrawLine*. 
- **Cursor** – is a specific figure. Is drawing when mouse move. 
- **Figure** – is abstract class. He has got a methods and variables for other figures. 
- **Line** – is class for draw the line. He has got a methods and variables for draw line and when draw the line.

## Interaction of classes

**`DrawLine`** is start a **`Interface`**, **`Events`** and **`Grid`**.

- **`Interface`** is started because I want to see the menu, and I want to draw nothing without setting up.

- **`Events`** is started because I want get the cords for draw.

- **`Grid`** is started because I view the grid in draw space.
