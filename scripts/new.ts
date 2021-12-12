#!/usr/bin/env deno run --allow-read --allow-write --allow-run --allow-net

import {
  bold,
  red,
  underline,
} from "https://deno.land/std@0.117.0/fmt/colors.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.19-alpha/deno-dom-wasm.ts";

const decoder = new TextDecoder();
const domParser = new DOMParser();

const now = {
  year: new Date().getFullYear().toString(),
  day: new Date().getDate().toString(),
};

{
  const topLevel = await getToplevel();
  const year = prompt("year", now.year) ?? now.year;
  const day = prompt("day", now.day) ?? now.day;

  const dirPath = `${year}/${day.padStart(2, "0")}`;
  await checkClean(dirPath);
  const dir = new URL(`${dirPath}/`, topLevel);
  const remote = new URL(`${year}/day/${day}`, "https://adventofcode.com/");

  const res = await fetch(remote);
  if (!res.ok) {
    console.error(
      `${bold(red("error"))}:`,
      underline(remote.href),
      red(String(res.status)),
      res.statusText,
    );
    Deno.exit(1);
  }
  const html = await res.text();
  const dom = domParser.parseFromString(html, "text/html");
  const title = dom?.querySelector("h2")?.textContent.slice(4, -4);
  const exampleInput = dom?.querySelector("pre code")?.textContent;

  console.log(underline(remote.href));

  await Deno.mkdir(dir, { recursive: true });
  await Deno.create(new URL("input.txt", dir));
  await Deno.writeTextFile(
    new URL("mod.ts", dir),
    `export function parseInput(input: string) {}
`,
  );
  await Deno.writeTextFile(
    new URL("readme.md", dir),
    `# [${title}](${remote.href})

\`\`\`sh
deno test --allow-read
\`\`\`
`,
  );
  await Deno.writeTextFile(
    new URL("test.ts", dir),
    `import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import { parseInput } from "./mod.ts";

const input = await Deno.readTextFile(new URL("input.txt", import.meta.url));

const exampleInput = \`${exampleInput}\`;
const exampleParsedInput: unknown = [];

Deno.test("parseInput", () => {
  assertEquals(parseInput(exampleInput), exampleParsedInput);
});
`,
  );
}

async function getToplevel() {
  const p = Deno.run({
    cmd: ["git", "rev-parse", "--show-toplevel"],
    stdout: "piped",
  });
  const [status, output] = await Promise.all([p.status(), p.output()]);
  p.close();
  if (!status.success) {
    Deno.exit(status.code);
  }
  const pathname = decoder.decode(output.slice(0, -1));
  return new URL(`file://${pathname}/`);
}

async function checkClean(pathspec: string) {
  const p = Deno.run({
    cmd: ["git", "status", "--porcelain", "--", pathspec],
    stdout: "piped",
  });
  const output = await p.output();
  p.close();
  if (output.length > 0) {
    console.error(`${bold(red("error"))}:`, pathspec, "dirty");
    await Deno.stderr.write(output);
    Deno.exit(1);
  }
  return output.length > 0;
}
