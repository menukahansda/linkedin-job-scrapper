# LinkedIn Job Scrapper

## Description
This is an automation API that scrapes job postings from LinkedIn. It was built as a task/assessment project.

## Features
- Automatically logs in to your LinkedIn profile(but you need to approve of this api for first use for security reasons)
- Scraps jobs related to specific keywords from the feed
- Logins in to your gmail account and compose a new email and send them to each of the emails extracted from the feed page, attached with your resume.

## Screenshots 
![Screenshot 1](screenshots/Screenshot-1.png)
![Screenshot 2](screenshots/Screenshot-2.png)
![Screenshot 3](screenshots/Screenshot-3.png)
Currently the emails are only to my own gmail for demo purposes

## Installation
Clone the repository and install dependencies:

```bash
git clone https://github.com/username/linkedin-job-scrapper.git
cd backend
npm install
```

## Usage

- Run automation via CLI:
```bash
node automation.js
```

- Run as backend server:
```bash
npm start
```

# Important Note
- Uncomment line 122 (bcc: emails) to send emails to the extracted recruiter list
- Make sure .env file is properly configured before running
- Use responsibly to avoid LinkedIn/Gmail restrictions

## Structure of .env file

``` bash
PORT=your port number
EMAIL = your email (gmail only)
LINKEDIN_PASSWORD = your linked password
GOOGLE_APP_PASSWORD = your google app password
RESUME_FILE_PATH = path to resume
```