# LinkedIn Job Scraper

## Description
This is an automation API that scrapes job postings from LinkedIn. It was built as a task/assessment project.

## Backend Features
- Automates job search workflow using browser automation (`Playwright`)
- Scrapes jobs related to specific keywords from the feed
- Uses `Nodemailer` to authenticate with Gmail and send emails to extracted recruiter contacts with an attached resume (currently restricted to a single recipient in demo mode).

## Frontend
A simple React frontend is included to trigger the backend automation API.

## Screenshots 
Below are sample outputs from the automation flow:
![Screenshot 1](screenshots/Screenshot-1.png)
![Screenshot 2](screenshots/Screenshot-2.png)
![Screenshot 3](screenshots/Screenshot-3.png)
Currently the emails are sent only to my own Gmail for demo purposes

## Project Structure

```bash
project-root/
│
├── backend/
│   ├── automation.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── screenshots/
│
└── README.md
```
## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/username/linkedin-job-scrapper.git
cd linkedin-job-scrapper
```

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

## Usage

### Note
- Uncomment the line (`bcc: emails`) to send emails to the extracted recruiter list in sendEmail function inside backend/automation.js.
- Before running as a CLI script, uncomment the last line that calls the function.

---

### Run Automation via CLI

```bash
node automation.js
```

### Run as backend server
```bash
npm start
```

### Run Frontend

```bash
npm run dev
```

# Important Note

- Make sure `.env` file is properly configured before running
- Use responsibly to avoid LinkedIn/Gmail restrictions

## Requirements
- Node.js >= 18
- Google App Password enabled (for Gmail SMTP)

## Tech Stack

### Backend
- Node.js
- Express.js
- Playwright
- Nodemailer

### Frontend
- React
- Vite

## Environment Variables

### Backend
``` bash
PORT=your port number
EMAIL=your email (gmail only)
LINKEDIN_PASSWORD=your LinkedIn password
GOOGLE_APP_PASSWORD=your google app password
RESUME_FILE_PATH=path to resume
```
### Frontend
```bash
VITE_API_URL=http://localhost:3000
```

Or your deployed backend URL.
