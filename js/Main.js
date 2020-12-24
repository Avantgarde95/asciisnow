'use strict';

function createMatrix(width, height, character) {
    var matrix = [],
        row,
        x, y;

    for (y = 0; y < height; y++) {
        row = [];

        for (x = 0; x < width; x++) {
            row.push(character);
        }

        matrix.push(row);
    }

    return matrix;
}

function copyMatrix(matrix) {
    return matrix.map(function (row) {
        return row.slice();
    });
}

function generateSnow(snowMatrix) {
    var width = snowMatrix[0].length,
        height = snowMatrix.length,
        x, y;

    for (y = height - 1; y > 0; y--) {
        snowMatrix[y] = snowMatrix[y - 1].slice();
    }

    for (x = 0; x < width; x++) {
        snowMatrix[0][x] = chooseRandomInteger(0, 12) === 0;
    }
}

function stackSnow(snowMatrix, stackStateMatrix, lowestPixelMatrix) {
    var width = snowMatrix[0].length,
        height = snowMatrix.length,
        x, y;

    for (y = 0; y < height; y++) {
        for (x = 0; x < width; x++) {
            if (
                snowMatrix[y][x]
                && stackStateMatrix[y][x] === 1
                && (y + 1 === height || stackStateMatrix[y + 1][x] !== 1)
            ) {
                stackStateMatrix[y][x] = 2;
            }

            if (lowestPixelMatrix[y][x]) {
                snowMatrix[y][x] = false;
            }
        }
    }
}

function drawSnowMatrix(element, snowMatrix, stackStateMatrix) {
    var width = snowMatrix[0].length,
        height = snowMatrix.length;

    element.innerHTML = snowMatrix.map(function (row, y) {
        return row.map(function (isSnow, x) {
            return (isSnow || stackStateMatrix[y][x] === 2) ? '#&nbsp;' : '&nbsp;&nbsp;';
        }).join('');
    }).join('<br>');
}

var links = getAllElements('Link'),
    queryMap = getQueryMap(),
    imagePathMap = {
        cat: 'image/Cat.png',
        christmas: 'image/Christmas.png'
    },
    i;

for (i = 0; i < links.length; i++) {
    links[i].setAttribute('target', '_blank');
    links[i].setAttribute('rel', 'noopener noreferrer');
}

if (!queryMap.hasOwnProperty('image')) {
    queryMap.image = 'cat';
}

loadImage(imagePathMap[queryMap.image.toLowerCase()], function (image) {
    var board = getElement('Board'),
        imageLink = getElement('ImageLink'),
        width = 40,
        height = 30,
        // true: Snow, false: Empty.
        snowMatrix = createMatrix(width, height, false),
        // 0: Ignore, 1: Should be stacked, 2: Already stacked.
        stackStateMatrix = createMatrix(width, height, 0),
        // true if pixel[Y][X] = max[0 <= y < height](pixel[y][X].alpha > 0).
        lowestPixelMatrix = createMatrix(width, height, false),
        pixels,
        x, y;

    console.log('Loaded the image!');
    imageLink.setAttribute('href', image.src);

    pixels = getImagePixels(image, width, height);
    console.log('Got the pixels!');

    for (y = 0; y < height; y++) {
        for (x = 0; x < width; x++) {
            if (pixels[(width * y + x) * 4 + 3] > 0) {
                stackStateMatrix[y][x] = 1;
            }
        }
    }

    for (x = 0; x < width; x++) {
        for (y = height - 1; y >= 0; y--) {
            if (stackStateMatrix[y][x] > 0) {
                lowestPixelMatrix[y][x] = true;
                break;
            }
        }
    }

    drawSnowMatrix(board, snowMatrix, stackStateMatrix);

    setInterval(function () {
        generateSnow(snowMatrix);
        stackSnow(snowMatrix, stackStateMatrix, lowestPixelMatrix);
        drawSnowMatrix(board, snowMatrix, stackStateMatrix);
    }, 100);
});
