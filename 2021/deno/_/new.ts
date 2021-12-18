#!/usr/bin/env deno run --allow-read --allow-write --allow-run --allow-net

import {
  bold,
  red,
  underline,
} from "https://deno.land/std@0.118.0/fmt/colors.ts";
import * as path from "https://deno.land/std@0.118.0/path/mod.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.19-alpha/deno-dom-wasm.ts";

const decoder = new TextDecoder();
const domParser = new DOMParser();

const __filename = path.fromFileUrl(import.meta.url);
const __dirname = path.dirname(__filename);

const year = "2021";

{
  if (Deno.args.includes("-h") || Deno.args.includes("--help")) {
    console.error("USAGE:");
    console.error(`    ${path.relative(Deno.cwd(), __filename)} [DAY]`);
    Deno.exit(1);
  }

  const day = (Deno.args.at(0) || getDate().toString()).padStart(2, "0");

  const pageURL = new URL(`${year}/day/${day}`, "https://adventofcode.com/");

  const res = await fetch(pageURL);
  if (!res.ok) {
    console.error(
      `${bold(red("error"))}:`,
      underline(pageURL.href),
      red(String(res.status)),
      res.statusText,
    );
    Deno.exit(1);
  }
  const html = await res.text();
  const dom = domParser.parseFromString(html, "text/html");
  const title = dom?.querySelector("h2")?.textContent.slice(4, -4);
  const exampleInput = dom?.querySelector("pre code")?.textContent;

  console.log(underline(pageURL.href));

  const dir = path.resolve(__dirname, "..", day);

  if (await isDirty({ dir, cwd: __dirname })) {
    console.error(`${bold(red("error"))}:`, dir, "dirty");
    Deno.exit(1);
  }

  await Deno.mkdir(dir, { recursive: true });
  await Deno.writeTextFile(
    path.resolve(dir, "input.txt"),
    ``,
  );
  await Deno.writeTextFile(
    path.resolve(dir, "mod.ts"),
    `export function parseInput(input: string) {}
`,
  );
  await Deno.writeTextFile(
    path.resolve(dir, "readme.md"),
    `# [${title}](${pageURL.href})

\`\`\`sh
deno test --allow-read
\`\`\`
`,
  );
  await Deno.writeTextFile(
    path.resolve(dir, "test.ts"),
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

function getDate() {
  return new Date().getDate();
}

async function isDirty({ dir, cwd }: {
  dir: string;
  cwd: string;
}): Promise<string> {
  const p = Deno.run({
    cmd: ["git", "status", "--porcelain", "--", dir],
    cwd: cwd,
    stdout: "piped",
  });
  const [{ success, code }, output] = await Promise.all([
    p.status(),
    p.output(),
  ]);
  p.close();
  if (!success) Deno.exit(code);
  return decoder.decode(output).trim();
}
