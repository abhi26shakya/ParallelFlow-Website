---
description: Start a ParallelFlow build phase in a fresh session
---
This is a fresh session. Do Phase $ARGUMENTS only.

1. Read CLAUDE.md, PROJECT_BRIEF.md Part 1 (build order and guardrails) and PROGRESS.md.
2. Read only the other parts of PROJECT_BRIEF.md that Phase $ARGUMENTS needs.
3. Tell me what Phase $ARGUMENTS covers and what its "done when" condition is.
4. Check PROGRESS.md and the code for anything left unfinished from earlier phases. If something is, stop and tell me.
5. Give me a short plan and wait for my approval before changing any files.
6. After approval, build it. Then run lint, type-check and build, and check the result.
7. Do not commit until I have looked at it in the browser.
8. Finish with the end-of-phase handoff described in CLAUDE.md.
