import { createWorker } from 'tesseract.js';
import * as cv from 'opencv';
// var cv = require('opencv');

const worker = createWorker({
    langPath: 'lang-data'
    // logger: m => console.log(m)
});

var WHITE = [255, 255, 255]; // B, G, R

async function test() {

    cv.readImage("./b.jpg", (err, im) => {
    //     if (im.width() < 1 || im.height() < 1) throw new Error('Image has no size');
        // cv.readImage("./zi2.jpg", (err, im2) => {
        //     // let img_gray = im.copy();
        //     // img_gray.convertGrayscale();
        //     let output = im.matchTemplateByMatrix(im2, 3);
        //     let matches = output.templateMatches(0.80, 1.0, 5, false);
        //     console.log(matches);
        // })
        let scale = 3000 / im.width()
        im.resize(3000, im.height() * scale)
        var out = new cv.Matrix(im.height(), im.width());
        let img_gray = im.copy();
        img_gray.convertGrayscale();
        let bw = img_gray.adaptiveThreshold(255, 1, 0, 15, 2)
        var vertical = bw.clone();

        // vertical.gaussianBlur([11, 11])
        // img_gray.medianBlur(3);
        // vertical.bilateralFilter(5, 5, 5);
        // vertical.erode(3);
        // vertical.dilate(3);
        var contours = vertical.findContours(1);
        for (let i = 0; i < contours.size(); i++) {
            if (contours.area(i) < 30) continue;
            if (contours.area(i) > 5000) continue;
            // console.log(`area`);
            out.drawContour(contours, i, WHITE, -1);
            // switch(contours.cornerCount(i)) {
            //     case 3:
            //       out.drawContour(contours, i, WHITE);
            //       break;
            //     case 4:
            //       out.drawContour(contours, i, RED);
            //       break;
            //     default:
            //       out.drawContour(contours, i, WHITE);
            //   }
        }
        out.save(`./temp/shapes.png`);
        vertical.save('./temp/note.png');
        img_gray.save('./temp/gray.png');
        // recognize()
    })

};


async function recognize() {
    await worker.load();
    await worker.loadLanguage('chi_sim');
    await worker.initialize('chi_sim');
    // for (let index = 0; index < 3; index++) {
    //     console.log(`./${index}.jpg`);

    const { data: { text } } = await worker.recognize(`./z.jpg`);
    console.log(text);
    // }
    await worker.terminate();
}

test();