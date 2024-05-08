const csv = require('csv-parser');
const fs = require('fs');

const parseCsvData = (fileName = 'pano.csv') => {
  return new Promise((resolve) => {
    const csvParsed = [];
    fs.createReadStream(fileName)
      .pipe(csv({
        separator: '; ',
      }))
      .on('data', (data) => {
        csvParsed.push({
          w: data.pano_ori_w,
          x: data.pano_ori_x,
          y: data.pano_ori_y,
          z: data.pano_ori_z,
          expected: data.correct_angle ?? data.angle_expected,
          image: data.filename,
        });
      })
      .on('end', () => {
        console.log(`Parsed "${fileName}". Entries: `, csvParsed.length);
        resolve(csvParsed);
      });
  });
}


module.exports = { parseCsvData };
