import "https://deno.land/std@0.170.0/dotenv/load.ts";
import { Temporal } from "npm:@js-temporal/polyfill";
import { NodeHtmlMarkdown } from "npm:node-html-markdown";
import { parse } from "npm:node-html-parser";

// Updates are released around 05:00 UTC
const now = Temporal.Now.zonedDateTimeISO("EST");

const day = Deno.args.at(0) ??
  (now.month < 12 ? 25 : Math.min(now.day, 25)).toString();

const year = Deno.args.at(1) ??
  (now.month < 12 ? now.year - 1 : now.year).toString();

const cookie = Deno.env.get("AOC_COOKIE") ?? prompt("cookie") ?? "";

const res = await fetch(`https://adventofcode.com/${year}/day/${day}`, {
  headers: { cookie },
});

if (!res.ok) {
  throw Error(`Failed to fetch ${res.url}: ${res.status} ${res.statusText}`);
}

console.info(`Fetched ${res.url}`);

const container = parse("<main></main>");
{
  const document = parse(await res.text());
  for (const desc of document.querySelectorAll(".day-desc")) {
    container.appendChild(desc);
  }

  const title = container.querySelector("h2")!;
  title.tagName = "h1";
  title.innerHTML = title.innerHTML
    .replaceAll("---", "")
    .replace(/Day \d+/, `<a href="${res.url}">Day ${day}</a>`)
    .trim();

  const part2 = container.querySelector("#part2");
  if (part2) {
    part2.tagName = "hr";
    part2.textContent = "";
  }
}

for (const link of container.querySelectorAll("a")) {
  const href = link.getAttribute("href");
  if (!href) {
    continue;
  }
  if (/^\d+$/.test(href)) {
    link.setAttribute("href", `../${href.padStart(2, "0")}/README.md`);
  }
  if (href.startsWith("/")) {
    link.setAttribute("href", new URL(href, res.url).href);
  }
}

const dir = new URL(`../${year}/${day.padStart(2, "0")}/`, import.meta.url);
await Deno.mkdir(dir, { recursive: true });

{
  const readme = new URL("README.md", dir);

  const p = Deno.run({
    cmd: [Deno.execPath(), "fmt", "--ext=md", "-"],
    stdin: "piped",
    stdout: "piped",
  });

  const te = new TextEncoder();
  const nhm = new NodeHtmlMarkdown({ codeBlockStyle: "indented" });
  const md = nhm.translate(container.innerHTML)
    // fix emphasized code like <code><em>...</em></code>
    .replace(/`_([^`_]+)_`/g, "_`$1`_");

  await p.stdin.write(te.encode(md));
  p.stdin.close();

  await Deno.writeFile(readme, await p.output());
  p.close();

  console.info(`Wrote ${readme}`);
}

{
  const input = new URL("input.txt", dir);

  const inputRes = await fetch(`${res.url}/input`, {
    headers: { cookie },
  });
  if (inputRes.ok) {
    await Deno.writeTextFile(input, await inputRes.text());

    console.info(`Wrote ${input}`);
  }
}

const createFile = (dir: URL, name: string): (template: {
  raw: readonly string[];
}, ...substitutions: unknown[]) => Promise<void> => {
  const path = new URL(name, dir);
  return async (template, ...substitutions): Promise<void> => {
    const data = String.raw(template, ...substitutions).trimStart();
    try {
      await Deno.writeTextFile(path, data, { createNew: true });
      console.info(`Wrote ${path}`);
    } catch (e) {
      if (e instanceof Deno.errors.AlreadyExists) {
        console.info(`Exists ${path}`);
      } else {
        throw e;
      }
    }
  };
};

await createFile(dir, "lib.ts")`
export function* parse(input: string): IterableIterator<string> {
  for (const [token] of input.matchAll(/\S+/g)) {
    yield token;
  }
}
`;

await createFile(dir, "test.ts")`
import { assertEquals } from "testing/asserts.ts";
import { parse } from "./lib.ts";

const input = Deno.readTextFileSync(new URL("input.txt", import.meta.url));

Deno.test("parse", () => {
  assertEquals([...parse("")], []);
});
`;
