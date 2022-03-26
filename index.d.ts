type PythonFunction = [(args: any) => Promise<any>, () => void]
export function pythonFunction(funcName: string, funcBody: string): PythonFunction;