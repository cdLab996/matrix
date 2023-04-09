import Keyv from "keyv";
import { KeyvFile } from "keyv-file";
import path from "path";
import { KEYV_STORAGE_TYPE, KEYV_STORAGE_PATH } from "../env.js";
import { ConversationGraph } from "./types.js";

export let db: Keyv | null = null; // store conversation id
export let conversation_db: Keyv | null = null; // store conversation 

export function createDB(namespace: string) {
  try {
    console.log("keystore", KEYV_STORAGE_TYPE)
    if (KEYV_STORAGE_TYPE === "file") {
      // all the data will be storaged with json file 
      db = new Keyv({ store: new KeyvFile({ filename: path.join(KEYV_STORAGE_PATH, `chat_gpt_bot.json`) }) });
      conversation_db = new Keyv({ store: new KeyvFile({ filename: path.join(KEYV_STORAGE_PATH, `chat_gpt_conversation.json`) }) });
      console.log("convesationdb", conversation_db)
    } else {
      // all the data will be storaged in the mem
      // db = new Keyv()
    }
  } catch (error) {
    console.log("🚀 ~ file: index.ts:23 ~ createDB ~ error:", error)
  }
}

export function storeValue<T>(key: string, value: T) {
  db?.set(key, value);
}

export function readValue<T>(key: string): Promise<T | undefined> {
  return db?.get(key);
}

export function storeConversationToDB(conversation: ConversationGraph) {
  const { roomId, ...rest } = conversation;
  storeValue(roomId, rest);
}

export async function readConversationFromDB(roomId: string): Promise<ConversationGraph | null> {
  const result = await readValue<ConversationGraph>(roomId);
  if (result) return result;
  return null;
}
