import { pythonFunction } from "./index.js"

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


test('adds 1 + 2 to equal 3', async () => {
  const [add, stopWorker] = pythonFunction("add", addBody)
  expect(await add([1,2])).toBe(3);
  stopWorker()
});

test('true is not false', async () => {
  const [run, stopWorker] = pythonFunction("run", testFromWil)
  expect(await run({})).toBe(false);
  stopWorker()
});
