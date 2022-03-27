export {default as PythonInterpreter} from './pythonInterpreter.js'

export const pythonFunction = (interpreter, funcName, funcBody) => {
  interpreter.stdin.put("\n"+funcBody+"\n")
  return async (args) => {
    let argsJson = JSON.stringify(args)
    let pythonCode = `
import json
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
  }
}

