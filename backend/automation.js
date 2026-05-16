import { chromium } from "playwright";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// API 1 (FULLTIME/C-C): Use Gmail Id
// STEP1: We need to have something which can help us to login LINKEDIN AUTOMATICALLY.
// STEP2: Which can search JOBS POSTED IN POSTS SECTION RECENTLY(LAST 24 HOURS MAXIMUM) for specific keywords like “JAVA DEVELOPER” AND “CONTRACT” in linkedin, it should have recruiter email id too
// STEP3: You need to login GMAIL ID and compose New email
// STEP4: You need to send an email to the recruiter email id with formal message for applying job, Attaching resume of a candidate with submission details

async function authenticateLinkedIn(page) {
  await page.goto("https://www.linkedin.com/login");

  await page.locator("#username").fill(process.env.EMAIL);
  await page.locator("#password").fill(process.env.LINKEDIN_PASSWORD);
  await page.click('button[type="submit"]');

  await page.waitForURL(/.*feed.*/, { timeout: 30000 });
}
function isWithin24Hours(timeText) {
  if (!timeText) return false;

  timeText = timeText.toLowerCase();

  const dayMatch = timeText.match(/(\d+)\s*d/);
  if (dayMatch) {
    return parseInt(dayMatch[1]) <= 1;
  }

  const hourMatch = timeText.match(/(\d+)\s*h/);
  if (hourMatch) {
    return parseInt(hourMatch[1]) <= 24;
  }

  if (timeText.includes("m") || timeText.includes("now")) {
    return true;
  }

  return false;
}
async function searchJobs(page, roleKeywords, hiringWords) {
  // mails and urls are stored in format : {post : [emails/urls]}
  let mails = {},
    urls = {};
  await page.goto("https://www.linkedin.com/feed/");

  for (let i = 0; i < 5; i++) {
    await page.mouse.wheel(0, 3000);
    await page.waitForTimeout(3000 + Math.random() * 2000);
  }

  const posts = await page.locator("div.feed-shared-update-v2").all();

  for (const post of posts) {
    const text = await post.innerText().catch(() => "");
    if (!text) continue;

    const timeText = await post
      .locator("span.update-components-actor__sub-description")
      .innerText()
      .catch(() => null);

    if (!isWithin24Hours(timeText)) continue;

    const lowerText = text.toLowerCase();
    const matchedKeywords = hiringWords.filter((hw) =>
      lowerText.includes(hw.toLowerCase()),
    );

    if (matchedKeywords.length === 0) continue;

    let postTitle = "General Position";
    for (const role of roleKeywords) {
      if (lowerText.includes(role.toLowerCase())) {
        postTitle = role.charAt(0).toUpperCase() + role.slice(1);
        break;
      }
    }

    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}/g;
    const emails = text.match(emailRegex) || [];
    const cleanEmails = emails != [] ? emails.filter(
      (e) => !e.toLowerCase().includes("noreply"),
    ) : [];

    const urlRegex = /https?:\/\/[^\s]+/g;
    const urlsFound = (text.match(urlRegex) || []).map((url) =>
      url.replace(/[.,!?;:]+$/, ""),
    );

    mails[postTitle] ||= [];
    urls[postTitle] ||= [];

    mails[postTitle].push(...cleanEmails);
    urls[postTitle].push(...urlsFound);
  }
  for (const key in mails) {
    mails[key] = [...new Set(mails[key])];
    urls[key] = [...new Set(urls[key])];
  }
  return { mails, urls };
}

async function createGMailTransporter() {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.GOOGLE_APP_PASSWORD,
    },
  });
  await transporter.verify();
  return transporter;
}

async function sendEmail(transporter, resume_file_path, post, emails, msg) {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to: process.env.EMAIL,
    // bcc: emails,
    subject: `Application for ${post} Position`,
    text: msg,
    attachments: [
      {
        filename: "resume.pdf",
        path: resume_file_path,
      },
    ],
  });
}

export  async function runAutomation() {
  const browser = await chromium.launch({
    headless: true,
  });
  try {
    const context = await browser.newContext();
    const page = await context.newPage();

    // STEP1: Login to LinkedIn
    await authenticateLinkedIn(page);

    // STEP2: Search for jobs posted in the last 24 hours with specific keywords
    const hiringWords = [
      "hiring",
      "opening",
      "looking for",
      "opportunity",
      "position",
      "vacancy",
    ];
    //   const roleKeywords = ["java developer", "contract", "full-time"];
    const roleKeywords = [
      "java developer",
      "java engineer",
      "software developer",
      "software engineer",
      "frontend developer",
      "frontend engineer",
      "backend developer",
      "backend engineer",
      "full stack developer",
      "fullstack developer",
      "full stack engineer",
      "fullstack engineer",
    ];
    const { mails: recruiterEmails, urls: recruitingUrls } = await searchJobs(
      page,
      roleKeywords,
      hiringWords,
    );

    // remove duplicacy
    const uniqueRecruiterEmails = new Set();

    for (const post in recruiterEmails) {
      const emails = recruiterEmails[post];

      let newmails = [];
      for (const email of emails) {
        if (!uniqueRecruiterEmails.has(email)) {
          uniqueRecruiterEmails.add(email);
          newmails.push(email);
        }
      }
      recruiterEmails[post] = newmails;
    }

    // STEP 3: Login to Gmail and compose a new email

    const resume_file_path = process.env.RESUME_FILE_PATH;
    if (!resume_file_path) {
      throw new Error("RESUME_FILE_PATH missing in .env");
    }
    const transporter = await createGMailTransporter();

    // STEP 4: Send an email to the recruiter with a formal message and attach the resume
    if (Object.keys(recruiterEmails).length === 0) {
      console.log(
        "No recruiter emails found for any position. Skipping email sending.",
      );
    } else {
      for (const post in recruiterEmails) {
        let msg = `Dear Recruiter,\n\nI am writing to express my interest in the ${post} position you have posted on LinkedIn. I have attached my resume for your review.\n\nThank you for considering my application. I look forward to the opportunity to discuss how my skills and experience align with the requirements of the role.\n\nBest regards,\nMenuka Hansda`;
        const emails = recruiterEmails[post] || [];
        if (!emails.length) {
          console.log(
            `No recruiter email found for ${post} position. Skipping email sending.`,
          );
          continue;
        }
        await sendEmail(transporter, resume_file_path, post, emails, msg);
      }
    }
    console.log("Recruiting URLs found:");
    for (const post in recruitingUrls) {
      const urls = recruitingUrls[post];
      if (urls.length > 0) {
        console.log(`${post} Position:`);
        urls.forEach((url) => console.log(`- ${url}`));
      }
    }
    console.log("Recruiting emails found:");
    for (const post in recruiterEmails) {
      const emails = recruiterEmails[post];
      if (emails.length > 0) {
        console.log(`${post} Position:`);
        emails.forEach((email) => console.log(`- ${email}`));
      }
    }
  } finally {
    await browser.close();
  }
}

// runAutomation().catch(console.error);


