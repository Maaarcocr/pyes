import {parentPort} from "worker_threads"
import StdinBuffer from './stdinBuffer.js'
import Python from './python.js';

const stdout = (charCode) => {
  if (charCode) {
      parentPort.postMessage({
          type: 'stdout',
          stdout: String.fromCharCode(charCode),
      })
  } else {
      console.log(typeof charCode, charCode)
  }
}

const stderr = (charCode) => {
  if (charCode) {
      parentPort.postMessage({
          type: 'stderr',
          stderr: String.fromCharCode(charCode),
      })
  } else {
      console.log(typeof charCode, charCode)
  }
}

let stdinBuffer = new StdinBuffer();

var Module = {
  stdout: stdout,
  stderr: stderr,
  stdin: stdinBuffer.stdin,
  arguments: ["-i", "-q", "-"],
  locateFile: function (path, scriptDir) { return scriptDir + path; }
}
if (typeof fetch === 'undefined') {
  const imports = [
    import('path').then(path => globalThis.__dirname = path.dirname(import.meta.url).substring(7)), 
    import('module').then(module => globalThis.require = module.createRequire(import.meta.url)),
  ]
  Promise.all(imports).then(() => {
    Python(Module)
  })
} else {
  Python(Module);
}
  
