import type { CapabilityDefinition, SkillDefinition } from "./types.js";

export class CapabilityRegistry {
  private readonly capabilities = new Map<string, CapabilityDefinition>();

  register(capability: CapabilityDefinition): this {
    if (this.capabilities.has(capability.name)) {
      throw new Error(`Capability already registered: ${capability.name}`);
    }
    const skillNames = new Set<string>();
    for (const skill of capability.skills) {
      if (skillNames.has(skill.name)) {
        throw new Error(`Duplicate skill in ${capability.name}: ${skill.name}`);
      }
      skillNames.add(skill.name);
    }
    this.capabilities.set(capability.name, capability);
    return this;
  }

  list(): CapabilityDefinition[] {
    return [...this.capabilities.values()];
  }

  get(capabilityName: string, skillName?: string): CapabilityDefinition | SkillDefinition {
    const capability = this.capabilities.get(capabilityName);
    if (!capability) throw new Error(`Unknown capability: ${capabilityName}`);
    if (!skillName) return capability;
    const skill = capability.skills.find((item) => item.name === skillName);
    if (!skill) throw new Error(`Unknown skill: ${capabilityName}/${skillName}`);
    return skill;
  }
}
