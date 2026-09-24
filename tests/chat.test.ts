import { describe, expect, it } from "vitest";

import type { Thread } from "@/content/types";
import { conversation, openReply } from "@/lib/game/chat";
import { add, newCase } from "@/lib/game/engine";

/**
 * A chat, in the order it happened: messages that arrive during the night
 * sit where they arrived, and each reply the player picks sits where they
 * picked it, followed by what came back.
 */

const thread: Thread = {
  id: "t",
  app: "whatsapp",
  name: "Someone",
  messages: [
    { id: "old", from: "them", at: "09:00", day: "Monday", text: "old" },
    { id: "late", from: "them", at: "01:00", requires: ["fired:late"], text: "late" },
  ],
  replies: [
    { id: "first", requires: ["fired:early"], options: [{ id: "a", text: "a", sets: ["did:a"], then: [{ id: "a-back", from: "them", at: "00:40", text: "back" }] }] },
    { id: "second", requires: ["fired:late"], options: [{ id: "b", text: "b", sets: ["did:b"] }] },
  ],
};

const s0 = newCase("t", 0);

describe("a conversation", () => {
  it("puts an exchange where it happened, before what arrived after it", () => {
    const s = add(s0, "fired:early", "did:a", "fired:late");
    expect(conversation(s, thread, "Sunday").map((m) => m.id)).toEqual(["old", "said-a", "a-back", "late"]);
  });

  it("dates what's said on the story's day, and times it by the reply", () => {
    const said = conversation(add(s0, "fired:early", "did:a"), thread, "Sunday").find((m) => m.id === "said-a");
    expect(said?.day).toBe("Sunday");
    expect(said?.with).toBe("first");
  });

  it("offers the newest exchange whose moment has come, and lets an unanswered older one lapse", () => {
    expect(openReply(s0, thread)).toBeUndefined();
    expect(openReply(add(s0, "fired:early"), thread)?.id).toBe("first");
    expect(openReply(add(s0, "fired:early", "fired:late"), thread)?.id).toBe("second");
    expect(openReply(add(s0, "fired:early", "fired:late", "did:b"), thread)).toBeUndefined();
  });
});
