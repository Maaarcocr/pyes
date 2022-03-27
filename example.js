import { pythonFunction, PythonInterpreter } from "./index.js"

const addBody = `
def add_impl(a, b):
  return a+b

def add(args):
  return add_impl(args[0], args[1])
`

const onReady = () => {console.log("Now the interpreter is ready")}
const interpreter = new PythonInterpreter(onReady);

const add = pythonFunction(interpreter, "add", addBody)
console.log(await add([1,2]));
interpreter.stop()