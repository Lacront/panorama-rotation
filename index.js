const Quaternion = require('quaternion');
const { parseCsvData } = require('./inputValues');

const urlTemplate = 'http://localhost:3000/?img=$IMAGE_LINK$&yaw=$YAW$';
const angleResultToleranceDegrees = 20;

const buildUrl = (img, yaw) => {
  return urlTemplate.replace('$IMAGE_LINK$', img)
    .replace('$YAW$', yaw);
};

const angleDiff = (angle1, angle2) => {
  let difference = Math.abs(angle1 - angle2);
  if (difference > 180) {
    difference = 360 - difference;
  }
  return difference;
};

const radToDeg = (angle) => {
  return angle * (180 / Math.PI);
};

const normalizeDegrees = (degree) => {
  let result = degree;
  while (result >= 360) {
    result -= 360;
  }
  while (result < 0) {
    result += 360;
  }
  return result;
};

const calculateRotationForInputMine = (input, originQuaternion, additionalRotation) => {
  const quaternion = new Quaternion(input.w, input.x, input.y, input.z);
  const [axis, angle] = quaternion.toAxisAngle();

  const degrees = radToDeg(angle);

  let degreesToReachZero = degrees;
  if (axis[0] > 0 && axis[1] > 0 && axis[2] < 0) {
    degreesToReachZero -= 180;
  } else if (axis[0] > 0 && axis[1] < 0 && axis[2] < 0) {
    degreesToReachZero -= 180;
  } else if (axis[2] < 0) {
    degreesToReachZero = 360 - degreesToReachZero;
  }
  let result = degreesToReachZero + additionalRotation;

  let isValid = true;
  if (input.expected) {
    const diff = angleDiff(normalizeDegrees(parseInt(input.expected)), normalizeDegrees(result));
    isValid = diff < angleResultToleranceDegrees || (diff < 360 && diff > (360 - angleResultToleranceDegrees));
  }

  console.log('-------------------------------------');

  if (isValid) {
    console.log(`[${input.image}]`, 'VALID', normalizeDegrees(result), buildUrl(input.image, normalizeDegrees(result)), axis);
  } else {
    console.log(`[${input.image}]`, 'INVALID', normalizeDegrees(result), buildUrl(input.image, normalizeDegrees(result)), axis);
    console.log(`Angle: `, degrees, axis.map(radToDeg));
    console.log(`degreesToReachZero: `, degreesToReachZero, buildUrl(input.image, normalizeDegrees(degreesToReachZero)));
    console.log(`Result: `, normalizeDegrees(result), buildUrl(input.image, normalizeDegrees(result)));
    console.log(`Expected: `, normalizeDegrees(parseInt(input.expected)));
  }
};

const calculateRotationForInput = (input, originQuaternion, additionalRotation) => {
  // TODO: Calculate the `yaw` angle in degrees that the panorama needs to be rotated to face North
  const quaternion = new Quaternion(input.w, input.x, input.y, input.z);
  const axis = quaternion.toEuler('XYZ');

  const degrees = radToDeg(axis[2]) + additionalRotation;
  const resultAngle = normalizeDegrees(degrees);

  const expected = normalizeDegrees(Number.parseFloat(input.expected));
  const deltaExpectedResult = Math.abs(resultAngle - expected);
  const isValid = deltaExpectedResult < angleResultToleranceDegrees || (deltaExpectedResult < 360 && deltaExpectedResult > (360 - angleResultToleranceDegrees));

  console.log('-------------------------------------');
  console.log(`[${input.image}], ${isValid ? 'VALID' : 'INVALID'}, Delta:`, deltaExpectedResult.toFixed(2), buildUrl(input.image, resultAngle));

  if (!isValid) {
    console.log(`Expected: `, expected, buildUrl(input.image, expected));
    console.log('Result:', resultAngle);
    console.log('Angle:', degrees);
  }
};

const additionalRotation = -90;

parseCsvData('pano.csv')
  .then((data) => {
    const originData = data[0];
    const originQuaternion = new Quaternion(originData.w, originData.x, originData.y, originData.z);

    return data.forEach((input) => {
      // calculateRotationForInputMine(input, originQuaternion, additionalRotation);
      calculateRotationForInput(input, originQuaternion, additionalRotation);
    });
  });


