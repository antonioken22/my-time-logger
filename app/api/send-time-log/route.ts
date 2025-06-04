import { NextResponse } from "next/server";
import { getGmailClient } from "@/utils/googleAuth";

import {
  getCurrentDateFormatted,
  getRandomizedTime,
  TimeLogType,
} from "@/utils/dates";
import { findThreadBySubjectAndParticipant } from "@/utils/emails";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const logType = searchParams.get("logType") as TimeLogType | null;

    if (!logType || (logType !== "IN" && logType !== "OUT")) {
      return NextResponse.json(
        { message: 'Invalid or missing logType. Must be "IN" or "OUT".' },
        { status: 400 }
      );
    }

    const hrEmail = process.env.HR_EMAIL;
    let initialMessageId = process.env.HR_GMAIL_MESSAGE_ID;
    const myEmail = process.env.MY_GMAIL_ADDRESS;
    const myName = process.env.MY_FULL_NAME_IN_GMAIL;
    const hrOriginalSubject = process.env.HR_ORIGINAL_SUBJECT;

    if (!hrEmail || !myEmail || !hrOriginalSubject) {
      console.error("Missing one or more critical environment variables:", {
        hrEmail,
        myEmail,
        hrOriginalSubject,
      });
      return NextResponse.json(
        {
          message:
            "Server configuration error: Missing HR_EMAIL, MY_GMAIL_ADDRESS, or HR_ORIGINAL_SUBJECT.",
        },
        { status: 500 }
      );
    }

    const gmail = await getGmailClient();
    let threadId: string | null = null;

    // Try to find thread by subject and participant
    if (hrOriginalSubject && hrEmail) {
      console.info(
        `Attempting to find thread using subject: "${hrOriginalSubject}" and participant: "${hrEmail}"`
      );
      threadId = await findThreadBySubjectAndParticipant(
        gmail,
        hrOriginalSubject,
        hrEmail
      );
    }

    if (!threadId) {
      return NextResponse.json(
        {
          message: `Could not determine thread ID. Tried finding by subject "${hrOriginalSubject}" and participant "${hrEmail}", and by message ID "${
            initialMessageId || "not provided"
          }".`,
        },
        { status: 500 }
      );
    }

    const currentDate = getCurrentDateFormatted();
    const currentTime = getRandomizedTime(logType);

    // Use the known original subject for the reply
    const subject = `Re: ${hrOriginalSubject}`;

    const emailBodyContent = `[${currentDate}] Time ${
      logType === "IN" ? "In" : "Out"
    }: ${currentTime}`;

    const inReplyToHeader = initialMessageId
      ? `<${initialMessageId}>`
      : undefined;
    const referencesHeader = initialMessageId
      ? `<${initialMessageId}>`
      : undefined;

    // Construct headers as an array of strings
    const headersArray = [
      `To: ${hrEmail}`,
      `From: "${myName}" <${myEmail}>`,
      `Subject: ${subject}`,
    ];
    if (inReplyToHeader) headersArray.push(`In-Reply-To: ${inReplyToHeader}`);
    if (referencesHeader) headersArray.push(`References: ${referencesHeader}`);
    headersArray.push(
      "Content-Type: text/plain; charset=utf-8",
      "MIME-Version: 1.0"
    );

    const emailContent = headersArray.join("\n") + "\n\n" + emailBodyContent;

    const base64EncodedEmail = Buffer.from(emailContent).toString("base64url");

    await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: base64EncodedEmail,
        threadId: threadId,
      },
    });

    console.info(
      `Email reply sent successfully to thread ${threadId}: ${subject} with body: ${emailBodyContent}`
    );
    return NextResponse.json(
      {
        message: "Email reply sent successfully!",
        subject,
        threadId,
        time: currentTime,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to send email reply:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
