import {
  Blocks,
  Bot,
  FileCheck2,
  FlaskConical,
  FolderKanban,
  Library,
  Lock,
  MessagesSquare,
  Paperclip,
  Puzzle,
  Shapes,
  Share2,
  ShieldCheck,
  SlidersHorizontal,
  SquareTerminal,
  Target,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import type { ProductSlug } from "@/content/products";

// One icon per mode, beside its name in the showcase.
export const MODE_ICON: Record<ProductSlug, LucideIcon> = {
  workspace: SquareTerminal,
  arena: UsersRound,
  "developer-space": Puzzle,
};

// Each mode's feature icons, in the order of its features in
// content/product-modes.ts. Change both lists together.
export const MODE_ICONS: Record<ProductSlug, LucideIcon[]> = {
  workspace: [FolderKanban, Paperclip, SlidersHorizontal, Bot, FileCheck2],
  arena: [MessagesSquare, Bot, Lock, Target, ShieldCheck],
  "developer-space": [Blocks, Shapes, FlaskConical, Library, Share2],
};
