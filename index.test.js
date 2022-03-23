import { pythonFunction } from "./index.js"

const addBody = `
def add_impl(a, b):
  return a+b
def add(args):
  return add_impl(args[0], args[1])
`
const add = pythonFunction("add", addBody)

test('adds 1 + 2 to equal 3', () => {
  expect(add([1,2])).toBe(3);
});