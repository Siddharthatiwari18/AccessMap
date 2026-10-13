# AccessMap project overview

## Problem
Wheelchair users and people planning visits often cannot find reliable, detailed access information before leaving home. A venue's general listing rarely answers practical questions such as whether there is a step-free entrance or accessible toilet.

## MVP citizen journey
1. Open Explore on a phone or laptop.
2. Search or filter the sample place list.
3. Review the reported access details and locate sample pins on a map.
4. Ask the assistant a question using text or supported browser voice input.
5. Submit an observation so the community can share more detail.

## Safety and trust choices
- Status values distinguish YES, NO, LIMITED, and UNKNOWN.
- Reports are labelled as community-reported, not official certification.
- AI answers should only summarize data available to the application.
- The prototype does not collect a real name, phone number, or precise user location.
- Sample venue names and coordinates are illustrative demo data, not real accessibility claims.

## Current limitations
- Data is in memory and resets when the backend restarts.
- No user accounts, photo uploads, moderation workflow, or production OpenAI integration.
- Leaflet map tiles require internet access.
- Voice input depends on browser support and may send audio/transcription to browser speech services.
