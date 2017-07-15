var robot   = require('robot-js');

var Memory  = robot.Memory;
var Window  = robot.Window;

module.exports = (cb) => {

  let memory;
  let process;
  let module;
  let window;


  function selectByWindow(wind) {
    // Check if arguments are correct
    if (!(wind instanceof Window)) {
      throw new TypeError('Invalid arguments');
    }

    // Check if the window title correctly matches
    if (wind.getTitle() !== "World of Warcraft") {
      return false;
    }

    process = wind.getProcess();
    // Ensure that the process was opened
    if (!process.isValid()) return false;
    /* eslint-disable quotes, no-useless-escape */
    module = process.getModules(".*\.exe")[0];
    if (!module) return false;
    module = module.getBase();

    // Determine if game is 64Bit
    let is64Bit = process.is64Bit();

    if (is64Bit) {
      return cb(new Error('64bit process is not supported at the moment'));
    }

    // Create a new memory object
    memory = Memory(process);
    memory.readMultiLevelPtr = readMultiLevelPtr;
    window = wind;
    return true;
  }

  for (let w of Window.getList("World of Warcraft")) {
    if (selectByWindow(w)) {
      return cb(null, process, module, memory, w);
    }
  }

  return cb(new Error('Cannot find "World of Warcraft" window'));
};