import PythonInterpreter from './pythonInterpreter.js';

export const pythonFunction = (funcName, funcBody) => {
  const interpreter = new PythonInterpreter();
  interpreter.stdin.put(funcBody+"\n")
  return [async (args) => {
    let argsJson = JSON.stringify(args)
    let pythonCode = `import json
args = json.loads("""${argsJson}""")
print("")
print(json.dumps({"result": ${funcName}(args)}))
`
    interpreter.stdin.put(pythonCode);
    while (true) {
      const line = await interpreter.stdout.take()
      try {
        return JSON.parse(line)["result"]
      } catch {}
    }
  }, interpreter.stopWorker]
}
