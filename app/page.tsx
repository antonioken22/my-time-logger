"use client";

import { useState } from "react";

import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { TimeLogType } from "@/utils/dates";

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const sendTimeLog = async (logType: TimeLogType) => {
    setLoading(true);
    setMessage("");
    setError("");
    try {
      // Construct the URL with logType as a query parameter
      const url = `/api/send-time-log?logType=${encodeURIComponent(logType)}`;

      const response = await fetch(url, {
        method: "GET",
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(
          `Successfully sent Time ${logType} reply. Time: ${data.time}. Subject: ${data.subject}. Thread ID: ${data.threadId}`
        );
      } else {
        setError(
          `Failed to send email: ${data.message || "Unknown error from API"}`
        );
      }
    } catch (error) {
      setError("An unexpected error occurred: " + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 md:p-8">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">
            Automated Time Logger
          </CardTitle>
          <CardDescription className="text-muted-foreground pt-2">
            Reply to your HR time log thread automatically using the Gmail API.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              onClick={() => sendTimeLog("IN")}
              disabled={loading}
              size="lg"
              className="w-full text-base py-6 bg-green-600 hover:bg-green-700"
            >
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <CheckCircle2 className="mr-2 h-5 w-5" />
              )}
              Send Time IN (7:55-8:00 AM)
            </Button>
            <Button
              onClick={() => sendTimeLog("OUT")}
              disabled={loading}
              size="lg"
              variant="destructive"
              className="w-full text-base py-6 bg-red-600 hover:bg-red-700"
            >
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <AlertCircle className="mr-2 h-5 w-5" />
              )}
              Send Time OUT (5:00-5:10 PM)
            </Button>
          </div>

          {message && (
            <Alert variant="default" className="bg-green-50 border-green-300">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <AlertTitle className="font-semibold text-green-700">
                Success!
              </AlertTitle>
              <AlertDescription className="text-green-600">
                {message}
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle className="font-semibold">Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-start space-y-4 text-sm text-muted-foreground pt-6">
          <div className="w-full">
            <h3 className="font-semibold text-lg mb-2 text-foreground">
              Setup Reminders:
            </h3>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                Ensure Google Cloud Project, Gmail API, and OAuth 2.0
                credentials are correctly set up.
              </li>
              <li>
                Verify all required environment variables (
                <code>MY_GMAIL_ADDRESS</code>, <code>HR_EMAIL</code>, etc.) are
                set.
              </li>
              <li>
                The API route is at <code>/app/api/send-time-log/route.ts</code>
                .
              </li>
              <li>
                Utility functions (<code>googleAuth.ts</code>, etc.) should be
                correctly placed.
              </li>
            </ul>
          </div>
        </CardFooter>
      </Card>
      <p className="text-xs text-muted-foreground mt-8">
        Ensure cron jobs are configured in <code>vercel.json</code> for full
        automation.
      </p>
    </div>
  );
}
