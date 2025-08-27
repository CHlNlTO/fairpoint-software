import BubbleBackground from "@/components/animate-ui/backgrounds/bubble";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LiquidButton from "@/components/buttons/liquid";

export default function Page() {
  return (
    <div className="relative min-h-svh w-full flex items-center justify-center overflow-hidden">
      <BubbleBackground className="absolute inset-0 z-0" />
      <div className="relative z-10 w-full max-w-sm flex flex-col gap-8 p-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              Thank you for signing up!
            </CardTitle>
            <CardDescription>Check your email to confirm</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              You&apos;ve successfully signed up. Please check your email to
              confirm your account before signing in.
            </p>
          </CardContent>
        </Card>
        <LiquidButton>
          Go to Sign In
        </LiquidButton>
      </div>
    </div>
  );
}