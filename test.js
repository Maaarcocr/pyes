import { pythonFunction } from "./index.js"

const addBody = `
def add_impl(a, b):
  return a+b

def add(args):
  return add_impl(args[0], args[1])
`
const [add, stopWorker] = pythonFunction("add", addBody)

console.log(await add([1,2]))
console.log(await add([1,5]))
stopWorker()