"use client";

import { GoogleSignInButton } from "@/components/google-signin-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestGooglePage() {
  return (
    <div className="container mx-auto max-w-md py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Google Auth Test</CardTitle>
          <CardDescription>
            Test page to verify Google Authentication integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Google Sign-In Button</h3>
            <GoogleSignInButton className="w-full" />
          </div>

          <div className="text-sm text-muted-foreground">
            <p>• Google One Tap is automatically loaded on this page</p>
            <p>• Check the browser console for any errors</p>
            <p>• Make sure you have configured your environment variables</p>
            <p>• FedCM has been disabled to avoid network errors</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
