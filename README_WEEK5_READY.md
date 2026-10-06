# Week 5 Ready Baseline

Built from the verified Week 4 FAVORITES-STABLE baseline.

## Mandatory Week 5 carry-forward
- Preserve Weeks 1-3 history.
- Pull Week 4 final results into Historical.
- Carry Week 4 bonus survivors into Week 5 Bonus.
- Carry Week 4 payout results into Payouts, including the Week 4 4-0 bounty and any applicable payout awards.
- Preserve the original permanent entry IDs. Do not renumber entries when Rooster is excluded.
- Preserve the Week 3 Back-to-Back 0's correction (THE HORSE and SEAL WITH IT, $325 each) in history.
- Preserve 136 active pool entries and exclude removed Rooster from active views.
- Preserve ESPN/live-feed startup architecture.
- Validate games, picks, results, payouts, bonus status, and historical data before finalizing.

## Favorites
Favorites now persist by entry name in addition to the legacy numeric-ID storage. Existing `commissFavorites` selections are migrated to `commissFavoriteNames` using the current permanent entry mapping. This prevents future entry-ID changes from silently changing a player's starred teams.

## Current baseline
- Current week: 4
- Week 4 games: 72
- Active entries: 136
- Week 4 bonus picks: 73
- Week 4 bonus max: 6


### Snake Bear Easter Egg
Hidden long-press (~750ms) on the Snake Bear entry (Entry 112) reveals the Snake Bear artwork. The reveal shakes the screen and closes on any tap. This feature is isolated from pool logic, favorites, and ESPN live scoring.
