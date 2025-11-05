import { AzureOpenAI } from "openai";

export class OpenAIAssistant {
  constructor(apiKey, azureEndpoint, apiVersion, deploymentName) {
    this.client = new AzureOpenAI({
      endpoint: azureEndpoint,
      apiKey: apiKey,
      apiVersion: apiVersion,
      dangerouslyAllowBrowser: true
    });
    this.deploymentName = deploymentName;
    this.assistant = null;
    this.thread = null;
  }

  async initialize(instructions = `You are AKIRA, an AI-powered guide to insights & reports. Help users by:
    - Providing clear and concise answers
    - Explaining concepts with examples
    - Being friendly and engaging
    - Giving actionable insights
    Be conversational and always give concise answers.`) {
    
    this.assistant = await this.client.beta.assistants.create({
      name: "AKIRA Assistant",
      instructions,
      tools: [],
      model: this.deploymentName,
    });

    this.thread = await this.client.beta.threads.create();
  }

  async getResponse(userMessage) {
    if (!this.assistant || !this.thread) {
      throw new Error("Assistant not initialized. Call initialize() first.");
    }

    await this.client.beta.threads.messages.create(this.thread.id, {
      role: "user",
      content: userMessage,
    });

    const run = await this.client.beta.threads.runs.createAndPoll(
      this.thread.id,
      { assistant_id: this.assistant.id }
    );

    if (run.status === "completed") {
      const messages = await this.client.beta.threads.messages.list(
        this.thread.id
      );

      const lastMessage = messages.data.filter(
        (msg) => msg.role === "assistant"
      )[0];

      if (lastMessage && lastMessage.content[0].type === "text") {
        return lastMessage.content[0].text.value;
      }
    }

    return "Sorry, I couldn't process your request.";
  }
}