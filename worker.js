import {parentPort} from "worker_threads"
import crypto from "crypto";
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

function getRandomValues(array) {
  if (!ArrayBuffer.isView(array)) {
    throw new TypeError("Failed to execute 'getRandomValues' on 'Crypto': parameter 1 is not of type 'ArrayBufferView'");
  }
  const buffer = Buffer.from(array.buffer, array.byteOffset, array.byteLength);
  crypto.randomFillSync(buffer);
  return array;
}

var Module = {
  stdout: stdout,
  stderr: stderr,
  stdin: stdinBuffer.stdin,
  arguments: ["-i", "-q", "-"],
  onRuntimeInitialized: () => {
    parentPort.postMessage({type: 'ready', stdinBuffer: stdinBuffer.sab})
  },
}
if (typeof fetch === 'undefined') {
  globalThis.self = {}
  globalThis.self.location = {}
  globalThis.self.location.href = import.meta.url
  globalThis.importScripts = () => {}
  globalThis.crypto = {}
  globalThis.crypto.getRandomValues = getRandomValues
}

Python(Module);
  
