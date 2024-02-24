// `mouse` is the position of the actual mouse, while `cursor` is the
// position of the mirrored mouse
let mouse = { x: -1, y: -1 };
let cursor = { x: -1, y: -1 };

if (window.matchMedia("(min-width: 768px)").matches) {
    $(document).mousemove(function (event) {
        let width = $(window).innerWidth();
        let height = $(window).innerHeight();

        mouse.x = event.pageX;
        mouse.y = event.pageY;

        // Hardcoded offsets... no measurements just vibes
        cursor.x = width - (mouse.x + 3);
        cursor.y = height - (mouse.y + 10);

        $('.mirrored-cursor').css({
            'transform': 'translate(' + cursor.x + 'px , ' + cursor.y + 'px)',
            'display': 'block'
        });
    });
}