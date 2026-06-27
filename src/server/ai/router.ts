import type { Employee, EmployeeRole } from "@/modules/employees/types";
import type { AIProvider, ChatMessage } from "./provider";
import { GeminiProvider } from "./gemini";
import { PromptBuilder  } from "./promptBuilder";

/**
 * AIRouter — single entry point for all AI chat requests.
 *
 * Responsibilities:
 *   1. Resolve the active provider from environment config (AI_PROVIDER)
 *   2. Delegate prompt assembly to PromptBuilder (including knowledge loading)
 *   3. Forward the BuiltPrompt to the provider
 *
 * Public interface: chat(history, message) — unchanged.
 * Route Handler, GeminiProvider: unchanged.
 */
export class AIRouter {
  private readonly provider:            AIProvider;
  private readonly promptBuilder:       PromptBuilder;
  private readonly temperature:         number;
  private readonly employeeName:        string;
  private readonly employeeRole:        EmployeeRole;
  private readonly systemInstructions:  string;
  private readonly employeeId:          string;
  /** employee.organizationId === clerkUserId (mapped in repository) */
  private readonly clerkUserId:         string;

  constructor(employee: Employee) {
    this.provider           = AIRouter.resolveProvider();
    this.promptBuilder      = new PromptBuilder();
    this.temperature        = employee.config.temperature;
    this.employeeName       = employee.name;
    this.employeeRole       = employee.role;
    this.systemInstructions = employee.config.systemInstructions;
    this.employeeId         = employee.id;
    this.clerkUserId        = employee.organizationId;
  }

  private static resolveProvider(): AIProvider {
    const providerName = process.env.AI_PROVIDER ?? "gemini";

    switch (providerName) {
      case "gemini": {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
          throw new Error(
            "GEMINI_API_KEY is not configured. Add it to .env.local.\n" +
            "Get one at: https://aistudio.google.com/apikey"
          );
        }
        return new GeminiProvider(apiKey, process.env.GEMINI_MODEL ?? "gemini-2.5-flash");
      }

      default:
        throw new Error(
          `Unknown AI provider: "${providerName}". Set AI_PROVIDER to one of: gemini`
        );
    }
  }

  /**
   * Stream a chat response.
   *
   * @param history  Prior turns (oldest first), excluding the current message
   * @param message  The current user message
   */
  async chat(
    history: ChatMessage[],
    message: string
  ): Promise<ReadableStream<Uint8Array>> {
    const prompt = await this.promptBuilder.build({
      systemInstructions: this.systemInstructions,
      role:               this.employeeRole,
      name:               this.employeeName,
      employeeId:         this.employeeId,
      clerkUserId:        this.clerkUserId,
      history,
      message,
    });

    return this.provider.chatStream({
      prompt,
      temperature: this.temperature,
    });
  }
}
