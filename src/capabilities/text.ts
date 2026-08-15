import type { CapabilityDefinition } from "../core/types.js";

export const textCapability: CapabilityDefinition = {
  name: "text",
  description: "Deterministic text transformations for Hermes workflows.",
  skills: [
    {
      name: "transform",
      description: "Transform input text using a registered operation.",
      parameters: [
        { name: "input", type: "string", required: true, description: "Text to transform." },
        {
          name: "operation",
          type: "string",
          required: true,
          description: "Transformation to apply.",
          choices: ["uppercase", "lowercase", "reverse", "length"],
        },
      ],
      handler: ({ input, operation }) => {
        if (typeof input !== "string" || typeof operation !== "string") throw new Error("Invalid text parameters");
        if (operation === "uppercase") return input.toUpperCase();
        if (operation === "lowercase") return input.toLowerCase();
        if (operation === "reverse") return [...input].reverse().join("");
        return input.length;
      },
    },
  ],
};
