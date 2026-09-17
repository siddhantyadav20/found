import { layer } from "@/content/found/layer";
import type { Story } from "@/content/found/types";
import { episode1 } from "./episode1";
import { episode2 } from "./episode2";
import { episode3 } from "./episode3";

/* ===========================================================================
   The Blue Room, whole: Episode 1 with Episodes 2 and 3 laid over it. Each
   later part only adds, gated on its episode's flag (content/found/layer.ts).
   =========================================================================== */

export const story: Story = layer(layer(episode1, episode2), episode3);
