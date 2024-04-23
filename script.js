// `mouse` is the position of the actual mouse, while `cursor` is the
// position of the mirrored mouse
let mouse = { x: -1, y: -1 };
let cursor = { x: -1, y: -1 };
let os = 5;
let fadeSpeed = 2000;

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
let mainDivs = ["#poem", "#constellation", "#earth"];

let timesOfDay;
// For intro sequence
const intro = ["TAKE A DEEP BREATH", "PICK YOUR FAVORITE WORDS, AND MAKE A CONSTELLATION."];
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
    for (let d of existingDivs) {
        if (div.top + div.height > d.top &&
            div.top < d.top + d.height &&
            div.left + div.width > d.left &&
            div.left < d.left + d.width) {
            console.log("collision detected!");
            return true;
        }
    }
    return false;
}

function getLocalTime() {
    var date = new Date();

    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();

    hours = (hours < 10 ? '0' : '') + hours;
    minutes = (minutes < 10 ? '0' : '') + minutes;
    seconds = (seconds < 10 ? '0' : '') + seconds;

    var timeString = hours + ':' + minutes + ':' + seconds;

    document.getElementById('local-time').innerHTML = 'Your local time is: ' + timeString;
}

function getLocationAndTimes() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getTimesFromLocation, showError);
    } else {
        document.getElementById('location').innerHTML = 'Geolocation is not supported by this browser.';
    }
}

function getTimesFromLocation(location) {
    var lat = location.coords.latitude;
    var long = location.coords.longitude;

    // Using https://sunrisesunset.io/api/ to fetch the specific times of day;
    // the time data is used to generate different background effects and
    // experiences.
    const url = `https://api.sunrisesunset.io/json?lat=${lat}&lng=${long}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            timesOfDay = data.results;
        })
        .catch(error => console.error('Error:', error));
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            document.getElementById('location').innerHTML = 'User denied the request for Geolocation.';
            break;
        case error.POSITION_UNAVAILABLE:
            document.getElementById('location').innerHTML = 'Location information is unavailable.';
            break;
        case error.TIMEOUT:
            document.getElementById('location').innerHTML = 'The request to get user location timed out.';
            break;
        case error.UNKNOWN_ERROR:
            document.getElementById('location').innerHTML = 'An unknown error occurred.';
            break;
    }
}

function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        } else {
            reject("Geolocation is not supported by this browser.");
        }
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
    // Reset initial states
    i = 0;
    prevStarCoords = null;

    // Remove everything already on the screen—poems, constellations, words
    let divsCompleted = 0;
    for (const div of mainDivs) {
        $(div).fadeOut(fadeSpeed, function () {
            $(this).empty();
            divsCompleted++;
            if (divsCompleted === mainDivs.length) {
                putWords();
            }
        });
    }
}

// Putting poem fragments onto the page
function putWords() {
    if ($("#constellation").is(":empty")) {
        $("#constellation").append($("<div id='poem'></div>"));
    }
    for (const div of mainDivs) {
        if ($(div).css("display") === "none") $(div).show();
    }

    let earth = $('#earth');
    let selectedFragments = generateRandomFragments(ps[i], lengths[i]);

    selectedFragments.forEach(f => {
        const fDiv = $('<div class="words"></div>').text(f.toUpperCase()).hide().appendTo("#help");

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
        fDiv.css({ left: x, top: y }).appendTo(earth).fadeIn(2000);
    });
}

function enter() {
    $(document).off("click", enter);
    if (clickCount === 2) {
        $("#intro").fadeOut(fadeSpeed, putWords);
        $(document).off('click', enter);
        main = true;
    }
    $(".l").fadeOut(fadeSpeed, function () {
        $(".l").text(intro[clickCount]).fadeIn(fadeSpeed, () => {
            clickCount++;
            if (clickCount === 2) {
                console.log("begin fade in");
                $("#begin").hide().fadeIn(fadeSpeed * 2);
            }
            $(document).on("click", enter);
        });
    });
}

function moveGradientCircle(event) {
    $("#gradient-circle").css({
        left: event.clientX + "px",
        top: event.clientY + "px"
    });
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
    $(document).one('click', () => $('#bg')[0].play());
    $(document).mousemove(moveGradientCircle);
    $(document).mousemove(handleMirroredCursor);

    // getLocalTime();
    getLocationAndTimes();

    $(document).on('click', '.words', function (event) {
        if (i === 8) {
            main = false;
            $("#mirrored-cursor").css("visibility", "hidden");
            $("#metadata").hide().fadeIn(fadeSpeed);
        }

        if (i >= ps.length) return;

        if (i === 2) {
            $("#poem").append($(this).html() + ',');
        } else {
            $("#poem").append($(this).html() + ' ');
        }
        i++;

        if (i % 3 === 0) {
            $("#poem").append('<br>');
        }

        // Placing stars
        let width = $(window).innerWidth();
        let height = $(window).innerHeight();

        let x = width - event.clientX;
        let y = height - event.clientY;

        let star = $("<div>").addClass("star").html("✱").css({
            left: x + "px",
            top: y + "px"
        });
        $("#constellation").append(star);

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

            $("#constellation").append(lineElement);
        };
        prevStarCoords = [x, y];

        // Delete the previous fragments, generate new ones
        $("#earth").children().fadeOut(2000, function () {
            $(this).remove();
        });

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

    $("#about").click(function () {
        $(this).toggleClass('underline');

        let info = $('#detailed-info');
        info.toggle();
        if (info.is(':visible')) {
            info.css('display', 'inline-block');
        }
    })

    $("#reset").on("click", function () {
        main = true;
        startWeaving();
        $("#metadata").fadeOut(fadeSpeed, function () {
            $(this).hide();
        });
    });
});