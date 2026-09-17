import { episode1 } from "./episode1";
import { episode2 } from "./episode2";
import { episode3 } from "./episode3";
import { layer } from "./layer";
import type { Story } from "./types";

/* ===========================================================================
   Low Battery, whole: Episode 1 with every later episode laid over it
   (content/found/layer.ts).
   =========================================================================== */

export const story: Story = layer(layer(episode1, episode2), episode3);
