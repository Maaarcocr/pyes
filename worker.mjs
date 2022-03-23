import StdinBuffer from './stdinBuffer.js'
import Python from './python.mjs';

const stdout = (charCode) => {
  if (charCode) {
      postMessage({
          type: 'stdout',
          stdout: String.fromCharCode(charCode),
      })
  } else {
      console.log(typeof charCode, charCode)
  }
}

const stderr = (charCode) => {
  if (charCode) {
      postMessage({
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
  arguments: ["-i", "-"],
  locateFile: function (path, scriptDir) { return scriptDir + path; }
}

if (typeof fetch === 'undefined') {
  await import('path').then(path => globalThis.__dirname = path.dirname(import.meta.url).substring(7));
  await import('module').then(module => globalThis.require = module.createRequire(import.meta.url));
}
  
await Python(Module);
