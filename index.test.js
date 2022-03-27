import { pythonFunction, PythonInterpreter } from "./index.js"

const addBody = `
def add_impl(a, b):
  return a+b

def add(args):
  return add_impl(args[0], args[1])
`

const testFromWil = `
def run(a):
  return True is False
`

const interpreter = new PythonInterpreter();

test('adds 1 + 2 to equal 3', async () => {
  const add = pythonFunction(interpreter, "add", addBody)
  expect(await add([1,2])).toBe(3);
});

test('true is not false', async () => {
  const run = pythonFunction(interpreter, "run", testFromWil)
  expect(await run({})).toBe(false);
});

afterAll(() => {
  interpreter.stop()
});
