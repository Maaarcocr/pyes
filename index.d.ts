type PythonFunction = (args: any) => Promise<any>
export function pythonFunction(funcName: string, funcBody: string): PythonFunction;
export class PythonInterpreter {
    stop: () => void
}