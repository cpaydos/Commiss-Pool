# Week 7 Bonus Eligibility Fix

- Week 7 bonus entries are sourced from the BONUS column of the uploaded Week 7 Picks.xlsx.
- The 10 entries with submitted bonus picks are explicitly recorded as alive entering Week 7.
- Bonus tab renders only those 10 entries and their submitted bonus picks.
- Week 7 regular picks were not modified by this bonus-only fix.
- Week 6 historical records were preserved.
- Added week7BonusAliveIdsEnteringWeek and count fields as a starting pattern for preserving week-ending alive lists and carrying them into the next week.
- Service worker cache version bumped to v19.
