export type Conversation = {
  id: number;
  name: string;
  messages: ConversationMsg[];
}

export type ConversationMsg = {
  role: Role;
  msg: string;
}

export type Role = "assistant" | "user";


export enum LLM {
  GPT_3_5 = "gpt-3.5-turbo",
  GPT_3_5_LEGACY = "gpt-3.5-turbo-0301",
  DALLE = "dalle",
  // GPT_4 = "gpt-4"
}

// Local storage keys
export enum LocalStKeys {
  //CONVERSATION = "conversation",
  CONV_HISTORY = "conversationHistory",
  SELECTED_CONV = "selectedConversation",
  DARK_MODE = "darkMode",
}
