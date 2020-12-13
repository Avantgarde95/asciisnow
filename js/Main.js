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

function updateMatrix(matrix) {
    var width = matrix[0].length,
        height = matrix.length,
        x, y;

    for (y = height - 1; y > 0; y--) {
        matrix[y] = matrix[y - 1].slice();
    }

    for (x = 0; x < width; x++) {
        if (chooseRandomInteger(0, 20) === 0) {
            matrix[0][x] = '#&nbsp;';
        } else {
            matrix[0][x] = '&nbsp;&nbsp;';
        }
    }
}

function drawMatrix(element, matrix, maskPixels) {
    var maskedMatrix = copyMatrix(matrix),
        width = maskedMatrix[0].length,
        height = maskedMatrix.length,
        x, y;

    for (y = 0; y < height; y++) {
        for (x = 0; x < width; x++) {
            if (maskPixels[(width * y + x) * 4 + 3] > 0) {
                maskedMatrix[y][x] = '&nbsp;&nbsp;';
            }
        }
    }

    element.innerHTML = maskedMatrix.map(function (row) {
        return row.join('');
    }).join('<br>');
}

var links = getAllElements('Link'),
    i;

for (i = 0; i < links.length; i++) {
    links[i].setAttribute('target', '_blank');
    links[i].setAttribute('rel', 'noopener noreferrer');
}

loadImage('./image/Cat.png', function (image) {
    var board = getElement('Board'),
        imageLink = getElement('ImageLink'),
        width = 40,
        height = 30,
        matrix = createMatrix(width, height, '&nbsp;&nbsp;'),
        pixels;

    console.log('Loaded the image!');
    imageLink.setAttribute('href', image.src);

    pixels = getImagePixels(image, width, height);
    console.log('Got the pixels!');

    drawMatrix(board, matrix, pixels);

    setInterval(function () {
        updateMatrix(matrix);
        drawMatrix(board, matrix, pixels);
    }, 200);
});
