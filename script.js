// `mouse` is the position of the actual mouse, while `cursor` is the
// position of the mirrored mouse
let mouse = { x: -1, y: -1 };
let cursor = { x: -1, y: -1 };
let os = 5;
let fadeSpeed = 2000;
let constellationCount = 0;

// Fragments of the poems
let p1 = ['as i', 'as you', 'as we', 'as they', 'if i', 'if you', 'if we', 'if they'];
let p2 = ['embrace', 'resist', 'contemplate', 'speculate', 'tempt', 'admire', 'desire', 'imagine', 'grasp', 'release', 'ruin', 'celebrate', 'sense', 'recognize', 'find', 'share', 'seek', 'notice', 'confess', 'swallow', 'promise'];
let p3 = ['the future', 'the present', 'the past', 'the secret', 'the path', 'the affirmation', 'the hope', 'the joy', 'the faith', 'the poetics', 'the suffering'];
let p4 = ['we work', 'i struggle', 'we begin', 'they fail', 'the nature dances', 'we allude', 'i mimic', 'they taunt'];
let p5 = ['to understand', 'to find', 'to unbraid', 'to accept', 'to question', 'to comprehend', 'to evade', 'to lick', 'to treasure', 'to abide', 'to absorb', 'to accentuate', 'to acclaim', 'to acquaint', 'to adore', 'to beckon', 'to beget', 'to bequeath', 'to blaze', 'to book', 'to caress'];
let p6 = ['the grief', 'the joy', 'the optimism', 'the love', 'the prayer', 'the meditation', 'the pain', 'the mistakes', 'the ennui', 'the passion', 'the dread', 'the kisses', 'the despair', 'the hope', 'the wound'];
let p7 = ['we shift', 'we wield', 'we bury', 'we catch', 'we chase',];
let p8 = ['into light', 'as ash', 'away from shadows',];
let p9 = ['across our faces', 'along the path', 'forever ago', 'gently', 'softly',];

let ps = [p1, p2, p3, p4, p5, p6, p7, p8, p9];
let lengths = [3, 4, 5, 3, 4, 3, 3, 2, 1];

// Initial states for a new poem/constellation
let i = 0;
let prevStarCoords = null;
let mainDivs = ["#poem", "#earth"];

// For intro sequence
const intro = [" Take a deep breath.", " Pick your favorite words,", " and make a constellation.", " Click anywhere to begin."];
let clickCount = 0;
// Checks if we have finished intro and arrived at the main experience
export let main = false;

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

function checkDivCollision(div, existingDivs) {
    let divArray = existingDivs.toArray();

    return divArray.some(d => {
        let dWidth = d.offsetWidth;
        let dHeight = d.offsetHeight;
        return div.top + div.height > d.offsetTop &&
            div.top < d.offsetTop + dHeight &&
            div.left + div.width > d.offsetLeft &&
            div.left < d.offsetLeft + dWidth;
    });
}

function generateRandomFragments(arr, l) {
    const randomFragments = [];
    const availableIndices = arr.map((_, index) => index);

    for (let i = 0; i < l; i++) {
        const randomIndex = Math.floor(Math.random() * availableIndices.length);
        const index = availableIndices.splice(randomIndex, 1)[0];
        randomFragments.push(arr[index]);
    }

    return randomFragments;
}

function startWeaving() {
    i = 0;
    prevStarCoords = null;

    $("#metadata").fadeOut(fadeSpeed, function () {
        $(this).hide();
    });

    for (let i = 0; i < constellationCount; i++) {
        let opacity = $(`constellation${i}`).css('opacity') || 1;
        let newOp = Math.max(0.1, opacity - 0.4);
        $(`#constellation${i}`).css('opacity', newOp);
    }

    $("#earth").fadeOut(fadeSpeed, function () {
        $(this).empty();
        putWords();
    });
}

// Putting poem fragments onto the page
function putWords() {
    let earth = $('#earth');
    if (earth.is(":empty")) {
        earth.append($("<div id='poem'></div>"));
    }
    for (const div of mainDivs) {
        if ($(div).css("display") === "none") $(div).show();
    }

    let selectedFragments = generateRandomFragments(ps[i], lengths[i]);

    selectedFragments.forEach(f => {
        const fDiv = $('<div class="words"></div>').text(f).hide().appendTo(earth);

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
            }, $(".words"));
        }
        fDiv.css({ left: x, top: y }).appendTo(earth).fadeIn(2000);
    });
}

function enter() {
    $(document).off("click", enter);
    if (clickCount === 4) {
        $("#intro").fadeOut(fadeSpeed, putWords);
        $(document).off('click', enter);
        main = true;
    } else {
        let div = $("#l");
        let text = div.text();
        div.html(`<span class="grey-text">${text}</span><span style="display: none;">${intro[clickCount++]}</span>`);
        div.children().last().fadeIn(fadeSpeed);
        $(document).on("click", enter);
    }
}

function handleMirroredCursor() {
    if (!main) return;

    if ($("#mirrored-cursor").css("visibility") === "hidden") {
        $("#mirrored-cursor").css("visibility", "visible");
    }

    let width = $(window).innerWidth();
    let height = $(window).innerHeight();

    mouse.x = event.pageX;
    mouse.y = event.pageY;

    cursor.x = width - (mouse.x + os);
    cursor.y = height - (mouse.y + os);

    $('#mirrored-cursor').css({
        'transform': 'translate(' + cursor.x + 'px , ' + cursor.y + 'px)',
        'display': 'block'
    });

}

$(document).ready(function () {
    $(document).on("click", enter);
    $(document).one('click', () => {
        $('#bg')[0].volume = 0.1;
        $('#bg')[0].play()
    });
    $(document).mousemove(handleMirroredCursor);

    $(document).on('click', '.words', function (event) {
        if (i > ps.length) return;

        if (i === 0) {
            $("<div>").attr("id", `constellation${constellationCount}`).appendTo("#constellation");
        }

        $("#poem").append($(this).html() + '<br>');
        i++;
        $("#poem").append((i % 3 === 0) ? '<br>' : '');

        // Placing stars
        let width = $(window).innerWidth();
        let height = $(window).innerHeight();

        let x = width - event.clientX;
        let y = height - event.clientY;

        let star = $("<div>").addClass("star").html("✱").css({
            left: x + "px",
            top: y + "px"
        });
        $(`#constellation${constellationCount}`).append(star);

        // drawing lines between them
        if (prevStarCoords !== null) {
            var distance = Math.sqrt(Math.pow(prevStarCoords[0] - x, 2) + Math.pow(prevStarCoords[1] - y, 2));
            var angle = Math.atan2(y - prevStarCoords[1], x - prevStarCoords[0]);

            var lineElement = $("<div>").addClass("line").css({
                left: (prevStarCoords[0] + os) + "px",
                top: (prevStarCoords[1] + 2 * os) + "px",
                width: distance + "px",
                transform: "rotate(" + angle + "rad)"
            });

            $(`#constellation${constellationCount}`).append(lineElement);
        };
        prevStarCoords = [x, y];

        // Delete the previous fragments, generate new ones
        $("#earth").children().not("#poem").fadeOut(2000, function () {
            $(this).remove();
        });

        if (i === ps.length) {
            main = false;
            constellationCount++;
            $("#mirrored-cursor").css("visibility", "hidden");
            $("#metadata").css("visibility", "visible").hide().fadeIn(fadeSpeed);
            return;
        }

        putWords();
    });

    $('#capture').click(function () {
        const options = {
            allowTaint: true,
            backgroundColor: `#090139`
        }
        html2canvas(document.getElementById("constellation"), options).then(function (canvas) {
            var imageData = canvas.toDataURL('image/png');
            var downloadLink = $('<a></a>').attr({
                'href': imageData,
                'download': 'making-constellation.png'
            }).appendTo('body');
            downloadLink[0].click();
            downloadLink.remove();
        });
    });

    $("#about").click(function (event) {
        event.stopPropagation();
        let t = $(this).text() === "( )" ?
            "( Making Constellations is a collaboration between Miaoye Que and Mouthwash Research Center. May 2024. )" : "( )";
        $(this).text(t);
    })

    $("#reset").on("click", function () {
        main = true;
        startWeaving();
    });
});