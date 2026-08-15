import { describe, expect, test } from "bun:test";

async function runCli(args: string[]) {
  const process = Bun.spawn(["bun", "dist/cli.js", ...args], {
    stdout: "pipe",
    stderr: "pipe",
  });

  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(process.stdout).text(),
    new Response(process.stderr).text(),
    process.exited,
  ]);

  return { stdout, stderr, exitCode };
}

describe("agent-workspace CLI", () => {
  test("registered skill returns structured JSON", async () => {
    const result = await runCli([
      "run", "--capability", "text", "--skill", "transform",
      "--input", "Hello", "--operation", "uppercase",
    ]);

    expect(result.exitCode).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      ok: true,
      capability: "text",
      skill: "transform",
      result: "HELLO",
    });
  });

  test("unknown parameters are rejected", async () => {
    const result = await runCli([
      "run", "--capability", "text", "--skill", "transform",
      "--input", "Hello", "--operation", "uppercase", "--shell", "rm -rf /",
    ]);

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("Unknown parameter: --shell");
  });
});
