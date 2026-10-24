import type { NightBeat } from "../types";

/* ===========================================================================
   Your night (2026-10-24): the end card's timeline of what this player did,
   at the hour the story did it, and a version of each beat that spoils
   nothing for the share ("Made a call at 2:58"). Beats without `share` stay
   off the shared version.
   =========================================================================== */

export const night: readonly NightBeat[] = [
  { at: "11:40 PM", text: "Pulled the strip on a parcel meant for Meera Arora.", share: "Opened a parcel that wasn't mine.", needs: ["did:opened"] },
  { at: "11:46 PM", text: "Picked up when Raju rang, looking for his brother.", share: "Picked up a stranger's call.", needs: ["did:answered-raju"] },
  { at: "11:46 PM", text: "Let Raju ring out.", share: "Let a stranger's call ring out.", needs: ["did:declined-raju"] },
  { at: "12:58 AM", text: "Heard two firings where everyone said there was one.", share: "Found the second shot.", needs: ["link:two-firings"] },
  { at: "1:20 AM", text: "Put his phone in airplane mode, with Bhasin watching the map.", share: "Went dark.", needs: ["did:airplane"] },
  { at: "1:58 AM", text: "Opened “Agar kuch hua” with his birthday.", share: "Opened a note nobody was meant to.", needs: ["did:unlocked-insurance"] },
  { at: "2:33 AM", text: "Made Sameer say what he told Nitin at 1:52.", share: "Made him say it.", needs: ["did:confronted-sameer"] },
  { at: "2:33 AM", text: "Told Sameer he'd tried to save him.", share: "Believed him.", needs: ["did:gave-rescuer"] },
  { at: "2:40 AM", text: "Had the guard send the man in the safari suit away.", share: "Kept someone from my door.", needs: ["did:guard-held"] },
  { at: "2:50 AM", text: "Learned that nobody burned a body. Dilip is alive, in Fatehpur Beri.", share: "Got a message I didn't expect.", needs: ["did:knows-alive"] },
  { at: "2:58 AM", text: "Called Meera first.", share: "Made a call at 2:58.", needs: ["did:moment-after-meera"] },
  { at: "2:58 AM", text: "Called Raju first.", share: "Made a call at 2:58.", needs: ["did:moment-after-raju"] },
  { at: "2:58 AM", text: "Called Sameer first.", share: "Made a call at 2:58.", any: ["did:moment-after-sameer", "did:moment-after-sameer-faced"] },
  { at: "3:00 AM", text: "Froze, and called nobody.", share: "Waited too long.", needs: ["did:froze"] },
  { at: "3:01 AM", text: "Then Meera.", share: "Then another.", needs: ["did:call-meera"], any: ["did:moment-after-raju", "did:moment-after-sameer", "did:moment-after-sameer-faced"] },
  { at: "3:01 AM", text: "Then Raju.", share: "Then another.", needs: ["did:call-raju"], any: ["did:moment-after-meera", "did:moment-after-sameer", "did:moment-after-sameer-faced"] },
  { at: "3:01 AM", text: "Then Sameer.", share: "Then another.", needs: ["did:call-sameer"], any: ["did:moment-after-meera", "did:moment-after-raju"] },
  { at: "3:09 AM", text: "Called 112. The local station rang Bhasin.", share: "Called the police.", needs: ["did:call-police"] },
  { at: "3:12 AM", text: "Posted it from his Instagram. Bhasin read it.", share: "Posted it.", needs: ["did:call-post"] },
  { at: "3:24 AM", text: "Got there. Room 6, and Dilip opened his eyes.", share: "Got there before seven.", needs: ["did:saved"] },
  { at: "4:40 AM", text: "Sent the record to Meera.", share: "Sent the record.", needs: ["did:sent"] },
  { at: "4:40 AM", text: "Posted the record from @sk.weddings.", share: "Posted the record.", needs: ["did:posted"] },
  { at: "4:40 AM", text: "Taped the parcel shut: not the sender.", share: "Sent it back.", needs: ["did:returned"] },
  { at: "6:58 AM", text: "A white Innova left Bedi Nursing Home with its lights off.", share: "Didn't get there before seven.", needs: ["did:lost"] },
];
