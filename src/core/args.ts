import type { ParameterDefinition, Primitive } from "./types.js";

export function parseCliArgs(argv: string[]): Record<string, string> {
  const result: Record<string, string> = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token?.startsWith("--")) throw new Error(`Expected --parameter, got: ${token ?? "end of input"}`);
    const name = token.slice(2);
    const value = argv[index + 1];
    if (!name || value === undefined || value.startsWith("--")) {
      throw new Error(`Parameter --${name || "?"} requires a value`);
    }
    result[name] = value;
    index += 1;
  }
  return result;
}

export function validateAndCoerce(
  raw: Record<string, string>,
  definitions: readonly ParameterDefinition[],
): Record<string, Primitive> {
  const known = new Set(definitions.map((definition) => definition.name));
  for (const name of Object.keys(raw)) {
    if (!known.has(name)) throw new Error(`Unknown parameter: --${name}`);
  }
  const output: Record<string, Primitive> = {};
  for (const definition of definitions) {
    const value = raw[definition.name];
    if (value === undefined) {
      if (definition.required) throw new Error(`Missing required parameter: --${definition.name}`);
      continue;
    }
    if (definition.choices && !definition.choices.includes(value)) {
      throw new Error(`--${definition.name} must be one of: ${definition.choices.join(", ")}`);
    }
    if (definition.type === "number") {
      const numberValue = Number(value);
      if (!Number.isFinite(numberValue)) throw new Error(`--${definition.name} must be a number`);
      output[definition.name] = numberValue;
    } else if (definition.type === "boolean") {
      if (value !== "true" && value !== "false") throw new Error(`--${definition.name} must be true or false`);
      output[definition.name] = value === "true";
    } else {
      output[definition.name] = value;
    }
  }
  return output;
}
