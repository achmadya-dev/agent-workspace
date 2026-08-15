import { CapabilityRegistry } from "./core/registry.js";
import { textCapability } from "./capabilities/text.js";

export function createRegistry(): CapabilityRegistry {
  return new CapabilityRegistry().register(textCapability);
}
