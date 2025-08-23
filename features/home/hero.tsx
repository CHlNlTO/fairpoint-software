import { NextLogo } from "@/components/ui/next-logo";
import { SupabaseLogo } from "@/components/ui/supabase-logo";

export function Hero() {
  return (
    <div className="flex flex-col gap-16 items-center">
      <div className="flex gap-8 justify-center items-center">
      </div>
      <h1 className="sr-only">Fairpoint Software - Tax & Accounting Platform</h1>
      <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
        Professional tax and accounting software for{" "}
        <span className="font-bold text-primary">
          modern businesses
        </span>
      </p>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
    </div>
  );
}
