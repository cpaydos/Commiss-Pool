WEEK 2 LIVE FEED CHANGE

Surgical change from commiss-pool-week2-stable-130-survivors-v2.zip.

Unchanged:
- scoring and matching rules
- picks / entries
- payouts
- Week 1 history and 130 survivors
- static scheduled kickoff times
- UI structure
- NFL scoreboard retrieval

Changed:
- Keep the existing ESPN scoreboard retrieval.
- If an NCAA Commiss game is missing from that scoreboard, fetch the home team's ESPN season schedule and locate the exact matchup.
- The schedule event supplies scheduled time, status, period/clock when available, and scores when available.
- Team catalog is loaded once; schedule responses are cached for 2 minutes to avoid hammering ESPN every 30 seconds.
- Only missing NCAA games use the fallback.

This is the first production-style test of the targeted endpoint finding from the Stanford/Duke diagnostic.
