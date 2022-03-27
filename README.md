# pyes

pyes is an ES module that allows you to run python from JavaScript

# Example

```js
import { pythonFunction, PythonInterpreter } from "pyes"

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
```

# How it works

Every time you define a new Python function, pyes spins up a new web worker where a python interpreter is run.
It feeds the function definition to the interpreter (which is run in interactive mode).
When you call the JS function that you get back as the first element of the return value of `pythonFunction`, pyes
encodes the argument you have passed as JSON and it then feeds some code to the python interpreter which:
- parses the JSONified argument back into a python value using `json.loads`
- calls your function with said parsed value
- gets the output of your function and it JSONify it and prints it

From JS, we then read the stdout and parse the JSON result and return it as the result of the function.