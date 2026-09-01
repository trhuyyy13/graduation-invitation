import { promises as fs } from "fs";
import path from "path";

const MESSAGES_FILE = path.join(process.cwd(), "messages.json");

export type StoredMessage = {
  slug: string;
  name: string;
  message: string;
  submittedAt: string;
};

export async function readMessages(): Promise<StoredMessage[]> {
  try {
    const raw = await fs.readFile(MESSAGES_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function writeMessages(messages: StoredMessage[]): Promise<void> {
  await fs.writeFile(MESSAGES_FILE, JSON.stringify(messages, null, 2) + "\n", "utf-8");
}
