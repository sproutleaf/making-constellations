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
        cursor.x = width - (mouse.x + 10);
        cursor.y = height - (mouse.y + 10);

        $('.mirrored-cursor').css({
            'transform': 'translate(' + cursor.x + 'px , ' + cursor.y + 'px)',
            'display': 'block'
        });
    });

    var prevStarCoords = null;
    $(".words").click(function (event) {
        console.log("hehe");

        let width = $(window).innerWidth();
        let height = $(window).innerHeight();

        let x = width - event.clientX;
        let y = height - event.clientY;

        let star = $("<div>").addClass("star").html("★").css({
            left: x + "px",
            top: y + "px"
        });
        $("body").append(star);

        if (prevStarCoords !== null) {
            var distance = Math.sqrt(Math.pow(prevStarCoords[0] - x, 2) + Math.pow(prevStarCoords[1] - y, 2));
            var angle = Math.atan2(y - prevStarCoords[1], x - prevStarCoords[0]);

            var lineElement = $("<div>").addClass("line").css({
                left: (prevStarCoords[0] + 10) + "px",
                top: (prevStarCoords[1] + 10) + "px",
                width: distance + "px",
                transform: "rotate(" + angle + "rad)"
            });

            $("body").append(lineElement);
        };

        prevStarCoords = [x, y];
        console.log(starCoordinates);
    });
}