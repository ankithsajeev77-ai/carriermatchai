# CareerMatch AI: setup guide (about 10 minutes)

When you type a role in **My Profile**, the website asks a small server on your own computer
to look up real, current job vacancies from **Adzuna** (a job search service) and shows them
ranked against your skills. Each job links to the original posting.

## Step 1: Install Node.js (one time)
Download the **LTS** version from https://nodejs.org and install it with the default options.

## Step 2: Get free Adzuna keys (one time)
1. Go to https://developer.adzuna.com and register for a free account.
2. Copy your **Application ID** and **Application Key**.

## Step 3: Put your keys in the .env file
1. In this folder, make a copy of `.env.example` and name the copy exactly `.env`
   (Windows tip: turn on "File name extensions" in File Explorer > View so it doesn't become `.env.txt`).
2. Open `.env` in Notepad and paste your two keys after the `=` signs. Save.
3. Never share the `.env` file or upload it to GitHub (the `.gitignore` file already protects it).

## Step 4: Start it
Double-click **start.bat**. A black window opens and your browser goes to http://localhost:3000.
(Or open a terminal in this folder and run `node server.js`.)
Leave the black window open while you use the site. Close it to stop.

## Step 5: Use it
Create an account, open **My Profile**, type a role such as "Python Developer" and a location.
The preview box shows live vacancies. **Job Matches** shows the full list with a source, posted date
and a link to the real posting. Pay is shown only when the posting provides it, and "(estimated)" means Adzuna estimated it.

## What to know
- **Not tested against live Adzuna here.** I tested the server with a stand-in for Adzuna, not the real service.
  If something fails, the page shows the reason (for example "Adzuna rejected your keys").
- Adzuna is one source, not "the whole internet". LinkedIn, Naukri and Indeed have no free open job API,
  so the search links to them stay on the Job Matches page.
- The server remembers each search for 10 minutes and allows 60 real Adzuna calls per hour to protect your free quota.
  Check Adzuna's terms for their own limits.
- Skills for each vacancy are read from its description using this app's list of known skills, so
  an unusual skill may be missed. Always confirm in the posting.
- **AI features** (roadmap, assistant, interview, resume suggestions) only work on the claude.ai page, not here.
  To make them work locally you would add an Anthropic API key to this server. That is a separate step I can build next.
- Accounts made here are saved in this browser only. They are separate from accounts on the claude.ai page.

## Nothing shows? Use the "Check live search" button
On **My Profile**, press **Check live search**. It tells you exactly what is wrong:
- *"You opened the HTML file directly"*: you double-clicked index.html. Close it and double-click **start.bat** instead, then use http://localhost:3000.
- *"Cannot reach the local server"*: the black start.bat window is closed. Start it again.
- *"no Adzuna keys"*: the `.env` file is missing, misnamed (`.env.txt`), or you did not restart start.bat after saving it.
- *"Adzuna rejected your keys"*: re-copy the Application ID and Key from developer.adzuna.com.
- *"hosted page"*: you are on the claude.ai link. Live search only works from this folder.
