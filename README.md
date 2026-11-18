# CareerMatch AI

An AI-assisted job recommendation and career development website for students and job seekers.

## Features
- Account login and registration (separate profile per account)
- Job matching with a transparent score and reasons, missing-skill suggestions, filters and sorting
- Live vacancies from the Adzuna API through a small local Node.js server (keys stay in `.env`)
- Match any job you paste in from LinkedIn, Naukri, Indeed or a company site
- Resume analyzer with ATS-style scoring, and a resume builder with PDF export
- Skill gap analysis, career roadmap generator, AI career assistant and mock interviews
- Application tracker (Kanban, search, upcoming dates, status history)
- Projects and portfolio ideas, fresher and internship support, notifications, settings
- Salary and market insights page that clearly labels demo data

## Run it
See **[SETUP.md](SETUP.md)** for the step-by-step guide. In short: install Node.js, put your free
Adzuna keys in a `.env` file (copy `.env.example`), then run `start.bat` or `node server.js` and open http://localhost:3000.

## Project files
| File | Purpose |
|---|---|
| `index.html` | The whole website (HTML, CSS and JavaScript) |
| `server.js` | Local server that serves the site and fetches live jobs from Adzuna |
| `start.bat` | Windows shortcut to start the server |
| `.env.example` | Template for your API keys (copy to `.env`, never upload `.env`) |
| `package.json` | Project info, lets you run `npm start` |
| `.gitignore` | Keeps `.env` out of GitHub |
| `SETUP.md` | Setup and troubleshooting guide |

## Limitations
- Accounts are stored in the browser, not on a server, so this is not production-grade security.
- Live jobs come from Adzuna only. The AI features run on claude.ai and are off in the local version.
- Salary figures on the Insights page are demo data, not market data.
