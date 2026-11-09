import {
  Activity,
  Bot,
  CircleCheckBig,
  EyeOff,
  FileCheck2,
  FolderKanban,
  KeyRound,
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

// One icon per mode, beside its name.
export const MODE_ICON: Record<ProductSlug, LucideIcon> = {
  private: SquareTerminal,
  arena: UsersRound,
};

// Each mode's row and feature icons, in the order of its rows (and features,
// which follow the same order) in content/product-modes.ts. Change both lists
// together.
export const MODE_ICONS: Record<ProductSlug, LucideIcon[]> = {
  private: [FolderKanban, Paperclip, SlidersHorizontal, Bot, FileCheck2],
  arena: [MessagesSquare, Bot, Lock, Target, ShieldCheck],
};

// The work loop guardrails, in PRODUCT_PAGE.loop.guardrails order.
export const OVERSIGHT_ICONS: LucideIcon[] = [
  CircleCheckBig,
  KeyRound,
  EyeOff,
  Activity,
];
