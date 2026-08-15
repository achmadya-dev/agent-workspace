export type Primitive = string | number | boolean;
export type ParameterType = "string" | "number" | "boolean";

export interface ParameterDefinition {
  name: string;
  type: ParameterType;
  required?: boolean;
  description: string;
  choices?: readonly string[];
}

export interface SkillContext {
  capability: string;
  skill: string;
  requestId: string;
}

export type SkillHandler = (
  params: Record<string, Primitive>,
  context: SkillContext,
) => Promise<unknown> | unknown;

export interface SkillDefinition {
  name: string;
  description: string;
  parameters: readonly ParameterDefinition[];
  handler: SkillHandler;
}

export interface CapabilityDefinition {
  name: string;
  description: string;
  skills: readonly SkillDefinition[];
}
