import {
  Bot,
  FileCheck2,
  FolderKanban,
  Lock,
  MessagesSquare,
  Paperclip,
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
  private: SquareTerminal,
  arena: UsersRound,
};

// Each mode's feature icons, in the order of its features in
// content/product-modes.ts. Change both lists together.
export const MODE_ICONS: Record<ProductSlug, LucideIcon[]> = {
  private: [FolderKanban, Paperclip, SlidersHorizontal, Bot, FileCheck2],
  arena: [MessagesSquare, Bot, Lock, Target, ShieldCheck],
};
