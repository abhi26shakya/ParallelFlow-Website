import { z } from "zod";
import { isRateLimited } from "@/lib/waitlist/rate-limit";
import { waitlistRequestSchema } from "@/lib/waitlist/schema";
import { getSupabaseAdmin } from "@/lib/supabase/server";

const MIN_FILL_MS = 2000;
const UNIQUE_VIOLATION = "23505";

function json(body: Record<string, unknown>, status: number) {
  return Response.json(body, { status });
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return (
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(request: Request) {
  const now = Date.now();

  if (isRateLimited(clientIp(request), now)) {
    return json(
      { error: "Too many attempts. Please wait a few minutes and try again." },
      429,
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  const parsed = waitlistRequestSchema.safeParse(body);
  if (!parsed.success) {
    // A filled honeypot is a bot; don't say which field gave it away.
    const honeypotHit = parsed.error.issues.some((i) => i.path[0] === "website");
    if (honeypotHit) {
      return json({ error: "We couldn't process this submission." }, 400);
    }
    return json(
      {
        error: "Please check the highlighted fields.",
        fieldErrors: z.flattenError(parsed.error).fieldErrors,
      },
      400,
    );
  }

  const { website: _website, startedAt, ...signup } = parsed.data;
  void _website;
  if (startedAt === undefined || now - startedAt < MIN_FILL_MS) {
    return json({ error: "We couldn't process this submission." }, 400);
  }

  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch (err) {
    console.error("[waitlist] configuration error:", err);
    return json(
      { error: "Signup is temporarily unavailable. Please try again later." },
      500,
    );
  }

  const nonEmpty = <T>(list: T[] | undefined) =>
    list && list.length > 0 ? list : null;

  const { error } = await supabase.from("waitlist_signups").insert({
    full_name: signup.full_name,
    email: signup.email,
    role: signup.role ?? null,
    team_size: signup.team_size ?? null,
    current_ai_tools: nonEmpty(signup.current_ai_tools),
    workflow_challenges: nonEmpty(signup.workflow_challenges),
    early_access_interest: signup.early_access_interest ?? null,
    organization_interest: signup.organization_interest ?? null,
    source: "website",
  });

  // An existing row means this email is already saved: confirmed, and the
  // first signup's answers are left untouched.
  if (error && error.code !== UNIQUE_VIOLATION) {
    console.error("[waitlist] insert failed:", error);
    return json(
      { error: "We couldn't save your signup. Please try again." },
      500,
    );
  }

  return json({ ok: true }, 200);
}
