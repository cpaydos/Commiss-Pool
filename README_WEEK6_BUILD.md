# Commiss Pool Week 6 build

- Built from the uploaded `Commiss-Pool-Week5-LOCKED-BASELINE(1).zip`.
- Week 1–4 historical records and score data preserved unchanged.
- Week 5 lines and picks are archived in `history[5]`; this baseline did not contain final Week 5 score/results or a verified Week 5 payout-winner list, so those historical rows are explicitly pending rather than fabricated.
- Week 6 title and current data are active. Week 6 has 69 games: 14 NFL and 55 NCAA. Bonus Max = 4.
- Week 6 picks are blank pending the Week 6 picks sheet. Existing entry IDs and names are retained.
- Jaguars are explicitly stored as the home team vs. Texans despite lowercase/mixed-case typography. Home/away is otherwise inferred from the uppercase-team convention in the supplied lines.
- ESPN/live-feed architecture, Favorites/localStorage behavior, Snake Bear Easter egg, and existing payout settings are preserved. ESPN endpoint and matching logic were not rewritten.
- Week 6 bonus eligibility is provisionally carried from the Week 5 eligibility list in the supplied baseline; verify/replace it with the finalized Week 5 bonus survivor outcomes before treating that count as final.
