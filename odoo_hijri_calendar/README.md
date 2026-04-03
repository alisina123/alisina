# Hijri Calendar Auto Switch (Odoo 19)

## Behavior
- Languages starting with `ar` or `fa` use Hijri rendering/input.
- Other languages keep Gregorian behavior.
- Stored values remain Gregorian in database.

## Technical Notes
This module expects these vendor files:
- `static/lib/moment/moment.min.js`
- `static/lib/moment-hijri/moment-hijri.js`

If your deployment pipeline already bundles these globally, keep the asset entries or replace with your preferred bundling path.
