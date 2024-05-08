# panorama-rotation

## Setup

To setup the project, run:
```bash
npm install
```

## Start
To start the panorama viewer, run:
```bash
npm run panorama
```

To run the panorama rotation logic, run:
```bash
npm run rotate
```

## Panorama Rotation
Given the `pano.csv` data, we want to rotate every panorama to face North. In the `index.js` file you will find an existing logic `calculateRotationForInputMine`, that sadly did not work with a few panoramas.

When running the panorama rotation logic, you will see in the console the expected `yaw` value that we want (faces north) and a link to view the rotation result in the panorama viewer.
