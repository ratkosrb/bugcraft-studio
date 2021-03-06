/* eslint-disable consistent-return, no-restricted-syntax,padded-blocks */
const createCamera = require('./logic/camera.js');

module.exports = (process, module, memory, window, patterns) => {

  const gameVersion = patterns.getVersion(memory);
  if (!gameVersion) {
    throw new Error('Unsupported game version :|');
  }

  const camera = createCamera(process, module, memory, window, patterns, gameVersion);

  const obj = {
    sendMessage: (kind, data) => {
      switch (kind) {
        case 'ENABLE_SPECTATOR':
          camera.enableSpectator();
          break;
        case 'SET_CAMERA_SPEED':
          camera.setSpeed(data);
          break;
        case 'SET_CAMERA_POSITION':
          camera.setPosition(data);
          break;
        case 'TOGGLE_CINEMATIC_BUILDER':
          camera.toggleCinematicBuilder(data);
          break;
        case 'ADD_CINEMATIC_LISTENER':
          camera.addCinematicListener(data);
          break;
        case 'PLAY_CINEMATIC':
          camera.setCameraView(data);
          break;
        default:
      }
    },
    getMessage: (kind) => {
      switch (kind) {
        case 'CAMERA_VIEW_MATRIX':
          return camera.getViewMatrix();
        case 'CAMERA_STATE':
          return camera.isSpectatorEnabled();
        case 'CAMERA_VIEW':
          return camera.getView();
        default:
      }
    },
  };

  global.obj = obj;

  return obj;
};
