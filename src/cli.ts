#!/usr/bin/env bun
import { randomUUID } from "node:crypto";
import { Command } from "commander";
import { parseCliArgs, validateAndCoerce } from "./core/args.js";
import type { CapabilityDefinition, SkillDefinition } from "./core/types.js";
import { createRegistry } from "./registry.js";

const registry = createRegistry();
const program = new Command();

program
  .name("agent-workspace")
  .description("Registered Hermes capability and skill executor")
  .version("0.1.0");

function metadata(definition: CapabilityDefinition | SkillDefinition): unknown {
  if ("handler" in definition) {
    const { handler: _handler, ...publicDefinition } = definition;
    return publicDefinition;
  }
  return definition;
}

program.command("list")
  .description("List registered capabilities and skills")
  .action(() => {
    console.log(JSON.stringify(registry.list().map((capability) => ({
      name: capability.name,
      description: capability.description,
      skills: capability.skills.map((skill) => skill.name),
    })), null, 2));
  });

program.command("describe")
  .description("Describe a registered capability")
  .requiredOption("-c, --capability <name>", "Capability name")
  .action(({ capability }: { capability: string }) => {
    console.log(JSON.stringify(metadata(registry.get(capability) as CapabilityDefinition), null, 2));
  });

const runCommand = program.command("run")
  .description("Execute one registered skill")
  .requiredOption("-c, --capability <name>", "Capability name")
  .requiredOption("-s, --skill <name>", "Skill name")
  // Skill parameters are dynamic because each registered skill owns its schema.
  .allowUnknownOption(true)
  .allowExcessArguments(true);

runCommand.action(async () => {
  const raw = parseCliArgs(process.argv.slice(3));
  const capabilityName = raw.capability;
  const skillName = raw.skill;
  if (!capabilityName || !skillName) throw new Error("run requires --capability and --skill");

  const capability = registry.get(capabilityName) as CapabilityDefinition;
  const skill = registry.get(capabilityName, skillName) as SkillDefinition;
  const params = { ...raw };
  delete params.capability;
  delete params.skill;
  const result = await skill.handler(
    validateAndCoerce(params, skill.parameters),
    { capability: capability.name, skill: skill.name, requestId: randomUUID() },
  );
  console.log(JSON.stringify({ ok: true, capability: capability.name, skill: skill.name, result }));
});

program.parseAsync().catch((error: unknown) => {
  console.error(JSON.stringify({ ok: false, error: error instanceof Error ? error.message : String(error) }));
  process.exitCode = 1;
});
