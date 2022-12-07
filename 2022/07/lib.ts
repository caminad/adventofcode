export function* parse(input: string): IterableIterator<string[]> {
  for (const [line] of input.matchAll(/.+/gm)) {
    yield line.split(" ");
  }
}

const parent = Symbol("parent");

export interface Dir {
  [parent]?: Dir;
  [name: string]: Dir | number;
}

function cd(dir: Dir, name: string): Dir {
  switch (name) {
    case "..":
      return dir[parent] ?? dir;
    case "/":
      while (dir[parent]) {
        dir = dir[parent];
      }
      return dir;
    default: {
      const child = dir[name];
      if (!child) {
        throw Error(`No such directory: ${name}`);
      }
      if (typeof child === "number") {
        throw Error(`Not a directory: ${name}`);
      }
      return child;
    }
  }
}

export function run(cmds: Iterable<string[]>): Dir {
  const root: Dir = {};
  let pwd = root;
  for (const cmd of cmds) {
    if (cmd[0] === "$" && cmd[1] === "cd") {
      pwd = cd(pwd, cmd[2]);
    } else if (cmd[0] === "dir") {
      pwd[cmd[1]] = { [parent]: pwd };
    } else if (/^\d+$/.test(cmd[0])) {
      pwd[cmd[1]] = Number(cmd[0]);
    }
  }
  return root;
}

export function* sizes(path: string[], entry: Dir | number): IterableIterator<{
  path: string[];
  type: "dir" | "file";
  size: number;
}> {
  if (typeof entry === "number") {
    yield { path, type: "file", size: entry };
  } else {
    let size = 0;
    for (const [name, child] of Object.entries(entry)) {
      for (const s of sizes([...path, name], child)) {
        yield s;
        if (s.type === "file") {
          size += s.size;
        }
      }
    }
    yield { path, type: "dir", size };
  }
}
