export class WheelColor {
    wheelColorTag;
    static init(){
        let wheelColorTag = document.querySelector('.WheelColor');
        
        wheelColorTag.style.display = 'block';
        wheelColorTag.style.position = 'absolute';
        wheelColorTag.style.zIndex = '9999999';
        wheelColorTag.style.bottom = '0';
        WheelColor.wheelColorTag = wheelColorTag;
        
    }
}