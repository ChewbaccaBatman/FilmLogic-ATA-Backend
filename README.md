# Film Logic — ATA Carnet Billing Tool

A full-stack AI-powered billing schedule generator for Film Logic International Freight & Customs Brokerage. Built to speed up the quoting process for ATA Carnet import and export shipments.

---

## Live URLs

| Resource | URL |
|---|---|
| **Front-end tool** | https://chewbaccabatman.github.io/FilmLogic-ATA-Backend |
| **Backend API** | https://filmlogic-ata-backend-production.up.railway.app |
| **Health check** | https://filmlogic-ata-backend-production.up.railway.app/api/health |

---

## What It Does

Employees paste a client email or fill in a form — the tool generates a complete, itemized ATA Carnet billing schedule that can be exported as a PDF or copied in Film Logic's standard quote format.

### Features
- **AI email agent** — paste any client email, AI extracts all shipment details automatically
- **Manual entry** — 3-step form for entering shipment details by hand
- **Import tab** — dedicated fee structure for gear arriving INTO the US
- **Export tab** — dedicated fee structure for gear LEAVING the US
- **Editable billing schedule** — click any line to edit, drag to reorder, delete or add custom lines
- **Smart edit merge** — editing job details updates only the relevant fees without wiping manual edits
- **PDF export** — formatted quote document with Film Logic branding and cargo disclosure
- **Copy quote** — copies in Film Logic's standard text format
- **History log** — all quotes saved permanently in the browser, searchable by client name, carnet number, or production title
- **200+ global airports** — grouped by region, covering every major hub Film Logic ships to/from
- **Dimensional weight calculator** — dimensions in inches, IATA standard (L×W×H ÷ 166 ÷ 2.2046 = kgs)
- **48-hour urgency detection** — auto-adds $250 expedite fee when email mentions urgent/ASAP/today
- **Outport detection** — auto-applies $150 outport fee and $125 messenger rate for any port other than LAX/LGB

---

## Fee Structure

All fees are based on **Film Logic's Standard Brokerage Fees & ATA Carnet Fees** document (pages 7–9).

### ATA Carnet Import Fees
| Fee | Amount |
|---|---|
| Duties & Taxes (ATA Carnet) | Free |
| ACE User Fees | $24.50 |
| Brokerage Fees – ATA Carnet | $195.00 (flat per carnet) |
| CTPAT Fees | $25.00 |
| TSA Cyber Security Fee | $12.50 |
| Messenger Fees | $95.00 (LAX/LGB) / $125.00 (outport) |
| Outport Fee | $150.00 (any port other than LAX/LGB) |
| Import Service Fees at Cost | $295.00 |
| Disbursement Fees | $25.00 minimum |
| Fuel Surcharge | 47.5% of Airport Recovery & Delivery fee |
| Overtime Services | $200.00 (if applicable) |
| GPS Trackers | $125.00 |
| Lost GPS Trackers | $175.00 |
| ATA Carnet Airline Recovery | $135.00 |

### ATA Carnet Export Fees
| Fee | Amount |
|---|---|
| Export Brokerage – Validation/Execution (Standard) | $150.00 |
| Export Brokerage – Validation/Execution (Overtime) | $200.00 |
| CTPAT Fees | $25.00 |
| Messenger Fees | $95.00 |
| Disbursement Fees | $25.00 minimum |
| Fuel Surcharge | 47.5% of Collection & Delivery fee |

### US Council Carnet Charges (by declared value)
| Declared Value | Council Fee | Issuance Fee |
|---|---|---|
| $1 – $9,999 | $305.00 | $150.00 |
| $10,000 – $49,999 | $350.00 | $200.00 |
| $50,000 – $149,999 | $415.00 | $250.00 |
| $150,000 – $399,999 | $475.00 | $300.00 |
| $400,000 – $999,999 | $530.00 | $350.00 |
| $1,000,000+ | $595.00 | $400.00 |

### Bond Fee Formula
- **General commodities:** 40% of value × 1.5% / minimum $125
- **Vehicles (Corporation):** 100% of value × 1.5% / minimum $125
- **Vehicles (Individual):** 150% of value × 1.5% / minimum $125

### Additional Carnet Issuance Fees
| Fee | Amount |
|---|---|
| ATA Carnet Closing Fees | $75.00 |
| Expedite Fees | $250.00 |
| General List Continuation Sheet | $17.00/side |
| Additional Counterfoil Vouchers | $30.00/side |
| Minimum for Reorder | $100.00 |
| Lost Document Fee | $45.00 |
| Off-Site Printing Fee | $100.00 |
| Extension Application Fee | $375.00 |
| Activation Fee | $275.00 |

### Cargo Insurance (by number of countries)
| Countries | Rate | Minimum |
|---|---|---|
| 1–3 | $0.96 per $100 | $125.00 |
| 4–7 | $1.26 per $100 | $125.00 |
| 8–11 | $1.86 per $100 | $125.00 |
| 12–15 | $2.16 per $100 | $125.00 |

---

## System Architecture

```
Client email / manual form
        ↓
[index.html — GitHub Pages]
        ↓ (email agent only)
[server.js — Railway backend]
        ↓
[Claude API — claude-sonnet-4-6]
        ↓
Structured quote data returned
        ↓
Editable billing schedule
        ↓
PDF export / Copy quote / History
```

---

## Files

| File | Location | Purpose |
|---|---|---|
| `index.html` | GitHub repo root | The entire front-end tool — single HTML file with all CSS and JS |
| `server.js` | GitHub repo root | Node.js/Express backend — receives email text, calls Claude API, returns structured quote data |
| `package.json` | GitHub repo root | Node.js dependencies |
| `.gitignore` | GitHub repo root | Keeps `.env` and `node_modules` out of GitHub |

---

## Backend Setup (Railway)

The backend is a Node.js Express server hosted on Railway. It:
1. Receives a POST request with an email body
2. Sends it to the Claude API with Film Logic's fee schedule as context
3. Returns structured JSON with all extracted shipment details

### Environment Variables (set in Railway dashboard)
| Variable | Description |
|---|---|
| `ANTHROPIC_API_KEY` | Your Anthropic API key from console.anthropic.com |
| `PORT` | Set automatically by Railway |

### API Endpoints
| Endpoint | Method | Description |
|---|---|---|
| `/api/health` | GET | Health check — returns `{"status":"ok"}` |
| `/api/parse-email` | POST | Parses email body and returns structured quote data |

---

## Local Development

If you ever need to run the backend locally for testing:

```bash
# Navigate to the project folder
cd ~/Desktop/film-logic-ata

# Install dependencies (first time only)
npm install

# Create .env file with your API key
cp .env.example .env
# Then edit .env and add your ANTHROPIC_API_KEY

# Start the server
npm run dev
# Server runs at http://localhost:3001
```

---

## Deploying Updates

### Update the front-end (index.html)
1. Go to `github.com/ChewbaccaBatman/FilmLogic-ATA-Backend`
2. Click **Add file → Upload files**
3. Upload the new `index.html`
4. Click **Commit changes**
5. GitHub Pages updates automatically within ~60 seconds

### Update the backend (server.js)
```bash
cd ~/Desktop/film-logic-ata
# Make your changes to server.js
git add .
git commit -m "describe your change"
git pull --rebase
git push
# Railway auto-deploys within ~30 seconds
```

---

## Built With

- **Front-end:** Vanilla HTML/CSS/JavaScript (single file, no framework)
- **Back-end:** Node.js + Express
- **AI:** Anthropic Claude API (claude-sonnet-4-6)
- **Hosting:** GitHub Pages (front-end) + Railway (back-end)
- **Version control:** GitHub

---

## Company Info

**Film Logic International Freight & Customs Brokerage**
15100 S. Broadway, Gardena, CA 90248
Tel: 310.352.1122
www.filmlogicchb.com

---

## Notes

- Quote estimates are valid for **7 days**
- All fees are based on the official Film Logic Standard Brokerage Fees & ATA Carnet Fees document (pages 7–9)
- Dimensional weight uses IATA standard: L × W × H (inches) ÷ 166 = lbs ÷ 2.2046 = kgs
- Chargeable weight = whichever is greater between actual and dimensional weight
- History is saved in browser localStorage — clearing browser data will clear history
