import { gmail_v1 } from "googleapis";

/**
 * @author [Kenette John Antonio](https://github.com/antonioken22)
 * @createdAt June 8, 2025
 * @description Note: This queries for threads by triangulating it from the required parameters.
 * It can be not accurate if these parameters are not unique.
 *
 * @todo (June 8, 2025): Find a better way to query for threads more accurately.
 *
 * @param gmail - An authenticated Gmail client instance.
 * @param subjectQuery - A string to search for within the email subject lines.
 * @param participantEmail - The email address of the participant involved in the thread.
 * @returns A promise that resolves to the thread ID of the first matching thread or null if no match is found.
 */

export async function findThreadBySubjectAndParticipant(
  gmail: gmail_v1.Gmail,
  subjectQuery: string,
  participantEmail: string
): Promise<string | null> {
  try {
    console.info(
      `Searching for threads with subject containing "${subjectQuery}" and participant "${participantEmail}"`
    );
    const query = `subject:(${subjectQuery}) {from:${participantEmail} to:${participantEmail} cc:${participantEmail} bcc:${participantEmail}}`;

    console.info(`Using query: ${query}`);

    const listResponse = await gmail.users.threads.list({
      userId: "me",
      q: query,
      maxResults: 5,
    });

    if (listResponse.data.threads && listResponse.data.threads.length > 0) {
      // We'll take the first thread found. In a more complex scenario,
      // you might need to inspect messages within each thread to be more certain.
      const firstThread = listResponse.data.threads[0];
      if (firstThread.id) {
        console.info(`Found matching threadId: ${firstThread.id}`);

        const threadDetails = await gmail.users.threads.get({
          userId: "me",
          id: firstThread.id,
          format: "metadata",
        });

        if (
          threadDetails.data.messages &&
          threadDetails.data.messages.length > 0
        ) {
          const firstMessageInThread = threadDetails.data.messages[0];
          if (
            firstMessageInThread.payload &&
            firstMessageInThread.payload.headers
          ) {
            const subjectHeader = firstMessageInThread.payload.headers.find(
              (header: gmail_v1.Schema$MessagePartHeader) =>
                header.name !== null &&
                header.name !== undefined &&
                header.name.toLowerCase() === "subject"
            );
            if (subjectHeader && subjectHeader?.value?.includes(subjectQuery)) {
              console.info(
                `Confirmed subject "${subjectHeader.value}" for threadId: ${firstThread.id}`
              );
              return firstThread.id;
            } else {
              console.warn(
                `Found thread ${firstThread.id}, but subject "${subjectHeader?.value}" didn't precisely match query "${subjectQuery}". Returning it anyway.`
              );
              // Still return it, might be good enough
              return firstThread.id;
            }
          }
        }
        // Fallback if detailed check fails
        return firstThread.id;
      }
    }
    console.warn(`No threads found matching query.`);
    return null;
  } catch (error) {
    console.error("Error listing or getting threads:", error);
    return null;
  }
}
