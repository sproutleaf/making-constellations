if (window.matchMedia("(min-width: 768px)").matches) {
    function setup() {
        let canvas = createCanvas(windowWidth, windowHeight);
        canvas.style('position', 'fixed');
        canvas.style('top', '0');
        canvas.style('z-index', '-1');
    }

    function windowResized() {
        resizeCanvas(windowWidth, windowHeight);
    }

    function mouseMoved() {
        let width = windowWidth;
        let height = windowHeight;

        clear();
        let cursorX = width - mouseX;
        let cursorY = height - mouseY;

        strokeWeight(1);
        line(mouseX, mouseY, cursorX, cursorY);
    }
}