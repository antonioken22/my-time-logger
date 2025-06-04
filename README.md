# Automated Time Logger

By Kenette John Antonio

## Prerequisites Before Running Locally

### I. Install the following into your own computer:

1. [git](https://git-scm.com/downloads)

2. [Visual Studio Code](https://code.visualstudio.com/download)

3. [Node.js](https://nodejs.org/en/download/package-manager) (Install the LTS Version)

4. [Bun (Package Manager)](https://bun.sh/docs/installation)

> _Note: Alternatively, you can use npm or yarn for package management if bun install is not preferred, but update the "Running Locally" section accordingly_

### II. Google Cloud Platform & Gmail API Setup

0. Make sure your account has 2-Step Verification enabled to prevent problems down the line.

1. Create Google Cloud Project

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create new project (e.g., "My Time Logger Bot")

2. Enable Gmail API

   - Navigate to **APIs & Services > Library**
   - Search for "Gmail API" and enable it

3. Configure OAuth Consent Screen
   - Go to **APIs & Services > OAuth consent screen**
   - **User Type:** External
   - **App name:** "NextJS Time Logger"
4. **User support email:** Your bot's Gmail (e.g., `juan.delacruz@gmail.com`)
5. **Developer contact:** Your Gmail
6. Add test users (your bot's Gmail)
7. Save configuration

### III. Create OAuth 2.0 Credentials

1. Navigate to **Credentials**
2. Click **+ CREATE CREDENTIALS > OAuth client ID**
3. **Application type:** Web application
4. **Name:** "Time Logger Web Client"
5. **Authorized redirect URIs:**
   ```cmd
   https://developers.google.com/oauthplayground
   ```
6. Note generated Client ID and Client Secret

### IV. Obtain Refresh Token

1. Go to [OAuth 2.0 Playground](https://developers.google.com/oauthplayground)
2. ⚙️ > **OAuth 2.0 configuration** > Use your credentials
3. Select scope: `https://mail.google.com/`
4. **Authorize APIs** > Complete authentication
5. **Exchange authorization code for tokens**
6. Note generated Refresh Token (Copy this as fast as possible)

### V. Configure HR Reply Thread Variables

You'll need the following information from the email thread you intend to reply to:

1.  **`HR_EMAIL`**:

    - This is the email address of the HR person or department who sends the email you need to reply to.
    - Example: `hr@company.com`

2.  **`HR_ORIGINAL_SUBJECT`**:

    - This is the exact subject line of the email thread initiated by HR.
    - Open the email thread in Gmail and copy its subject line.
    - Example: `Daily Time Log Submission` or `OJT Time In/Out`

3.  **`HR_GMAIL_MESSAGE_ID`** (This is a Message ID from an email within the thread):
    - Open Gmail and navigate to the specific email thread.
    - Open any email message within that thread (preferably the first one from HR).
    - Click the **three vertical dots** (More options) icon, usually at the top-right of that specific email message.
    - Select "**Show original**".
    - A new tab will open displaying the raw source of the email.
    - Look for a line that starts with `Message-ID:` (you can use Ctrl+F or Cmd+F to search).
    - The value will look something like `<ABC123xyz789@mail.gmail.com>`.
    - **Copy only the part _inside_ the angle brackets (`< >`)**. Do not include the angle brackets themselves.
    - Example: `ABC123xyz789@mail.gmail.com`

### VI. Configure .env

- On Linux/macOS:

```cmd
cp env.template .env.local
```

- On Windows (Command Prompt):

```cmd
copy env.template .env.local
```

## Running Locally

1. Clone this repository into your computer.

2. Run this code in your terminal to install all dependencies used in this project.

```cmd
bun install
```

> _(If not using Bun, use npm install or yarn install)_

3. Build and run your web app at `http://localhost:3000` by running the code below in the terminal.

```cmd
bun run dev
```

> _(If not using Bun, use npm run dev or yarn dev)_


## Deploying to Vercel

1. Connect your Git Repository to Vercel.

2. Configure Environment Variables in Vercel.

3. Set up Cron Jobs using `vercel.json`.

4. Deploy.

5. Monitor.

## References

1. Built with Google Gemini's 2.5 Pro (preview)
