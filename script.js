// `mouse` is the position of the actual mouse, while `cursor` is the
// position of the mirrored mouse
let mouse = { x: -1, y: -1 };
let cursor = { x: -1, y: -1 };
let os = 10;

// Fragments of the poems
let p1 = ['as i', 'as we', 'as they'];
let p2 = ['embrace', 'resist', 'contemplate', 'speculate', 'tempt'];
let p3 = ['the future', 'the present', 'the past'];
let p4 = ['we work', 'i struggle', 'we begin', 'they fail', 'the nature dances'];
let p5 = ['to understand', 'to find', 'to unbraid', 'to accept', 'to question'];
let p6 = ['the grief', 'the grief', 'the joy', 'the optimism'];
let p7 = ['we shift', 'we wield', 'we bury'];
let p8 = ['into light', 'as ash'];
let p9 = ['across our faces'];

let ps = [p1, p2, p3, p4, p5, p6, p7, p8, p9];
let i = 0;

function randomXCoordinate(w) {
    const min = Math.ceil(0.1 * w);
    const max = Math.floor(0.9 * w);

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomYCoordinate(h) {
    const min = 1;
    const max = Math.floor(0.9 * h);

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

$(document).ready(function () {
    if (window.matchMedia("(min-width: 768px)").matches) {
        $(document).mousemove(function (event) {
            let width = $(window).innerWidth();
            let height = $(window).innerHeight();

            mouse.x = event.pageX;
            mouse.y = event.pageY;

            cursor.x = width - (mouse.x + os);
            cursor.y = height - (mouse.y + os);

            $('.mirrored-cursor').css({
                'transform': 'translate(' + cursor.x + 'px , ' + cursor.y + 'px)',
                'display': 'block'
            });
        });

        function checkDivCollision(div, existingDivs) {
            for (let d of existingDivs) {
                if (div.top + div.height > d.top &&
                    div.top < d.top + d.height &&
                    div.left + div.width > d.left &&
                    div.left < d.left + d.width) return true;
            }
            return false;
        }

        // Putting poem fragments onto the page
        function putWords() {
            let fragments = ps[i];

            // Dummy container used for detecting div collision
            const container = $('<div style="position: absolute; visibility: hidden; width: 100vw; height: 100vh;"></div>');
            $('body').append(container);

            fragments.forEach(f => {
                const fDiv = $('<div class="words"></div>').text(f).hide();
                container.append(fDiv);

                let earth = $('#earth');

                let collision = true;
                let x, y;

                while (collision) {
                    x = randomXCoordinate(earth.width());
                    y = randomYCoordinate(earth.height());

                    collision = checkDivCollision({
                        left: x,
                        top: y,
                        width: fDiv.width(),
                        height: fDiv.height()
                    }, $('.words'));
                }
                fDiv.css({ left: x, top: y });

                earth.append(fDiv);
                fDiv.fadeIn(2000);
            });

            container.remove();
        }
        putWords();

        var prevStarCoords = null;
        $(document).on('click', '.words', function (event) {
            if (i >= ps.length) return;
            // Add fragments to poems
            $("#poem").append($(this).html() + ' ');
            i++;
            if (i % 3 === 0) {
                $("#poem").append('<br>');
            }

            // Placing stars
            let width = $(window).innerWidth();
            let height = $(window).innerHeight();

            let x = width - event.clientX;
            let y = height - event.clientY;

            let star = $("<div>").addClass("star").html("★").css({
                left: x + "px",
                top: y + "px"
            });
            $("body").append(star);

            // drawing lines between them
            if (prevStarCoords !== null) {
                var distance = Math.sqrt(Math.pow(prevStarCoords[0] - x, 2) + Math.pow(prevStarCoords[1] - y, 2));
                var angle = Math.atan2(y - prevStarCoords[1], x - prevStarCoords[0]);

                var lineElement = $("<div>").addClass("line").css({
                    left: (prevStarCoords[0] + os) + "px",
                    top: (prevStarCoords[1] + os) + "px",
                    width: distance + "px",
                    transform: "rotate(" + angle + "rad)"
                });

                $("body").append(lineElement);
            };
            prevStarCoords = [x, y];

            // Delete the previous fragments, generate new ones
            $("#earth").children().fadeOut(2000, function () {
                $(this).remove();
            });
            putWords();
        });
    }
});