import Python from './python.mjs';

if (typeof fetch === 'undefined') {
  await import('path').then(path => globalThis.__dirname = path.dirname(import.meta.url).substring(7));
  await import('module').then(module => globalThis.require = module.createRequire(import.meta.url));
}

export const executePython = async (python) => {
  let index = 0;
  let stdout = '';
  let stderr = '';
  let x = await Python({ 
    locateFile: (path, scriptDir) => { return scriptDir + path; }, 
    thisProgram: 'python',
    stdin: () => {
      if (index >= python.length) return null;
      let result = python.charCodeAt(index)
      index += 1;
      return result;  
    },
    stdout: (c) => {stdout += String.fromCharCode(c)},
    stderr: (c) => {stderr += String.fromCharCode(c)}
  });
  return {stderr, stdout}
}

export const pythonFunction = (funcName, funcBody) => {
  return async (args) => {
    let argsJson = JSON.stringify(args)
    let pythonCode = `import json
args = json.loads("""${argsJson}""")
${funcBody}
print(json.dumps(${funcName}(args)), end='')
`
    let {stdout, stderr} = await executePython(pythonCode);
    return JSON.parse(stdout)
  }
}
