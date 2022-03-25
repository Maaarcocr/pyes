import Worker from 'web-worker';
import Channel from './channel.js';

class PythonInterpreter {
  constructor() {
    this.worker = new Worker(
      new URL('./worker.mjs', import.meta.url),
      { type: 'module' }
    );
    this.stdin = new Channel();
    this.stderrBuffer = '';
    this.stdoutBuffer = '';
    this.stdout = new Channel();
    this.stderr = new Channel();
    this.initialiseWorker()
  }

  initialiseWorker = () => {
    this.worker.addEventListener('message', this.handleEvent);
  }

  stopWorker = () => {
    this.worker.terminate()
  }

  handleStdinData = (inputValue) => {
    if (this.stdinbuffer && this.stdinbufferInt) {
      let startingIndex = 1
      if (this.stdinbufferInt[0] > 0) {
        startingIndex = this.stdinbufferInt[0]
      }
      const data = new TextEncoder().encode(inputValue)
      data.forEach((value, index) => {
        this.stdinbufferInt[startingIndex + index] = value
      })

      this.stdinbufferInt[0] = startingIndex + data.length - 1
      Atomics.notify(this.stdinbufferInt, 0, 1)
    }
  }

  handleEvent = (e) => {
    const type = e.data.type
    switch (type) {
      case "stderr":
        if (e.data.stderr == '\n') {
          console.log(this.stderrBuffer)
          this.stderr.put(this.stderrBuffer)
          this.stderrBuffer = ''
        }
        else {
          this.stderrBuffer += e.data.stderr
        }
        break;
      case "stdout":
        if (e.data.stdout == '\n') {
          this.stdout.put(this.stdoutBuffer)
          this.stdoutBuffer = ''
        }
        else {
          this.stdoutBuffer += e.data.stdout
        }
        break;
      case "stdin":
        this.stdinbuffer = e.data.buffer;
        this.stdinbufferInt = new Int32Array(this.stdinbuffer)
        this.stdin.take().then(value => this.handleStdinData(value))
        break;
      default:
        console.log(e.data)
    }
  }
}

export default PythonInterpreter