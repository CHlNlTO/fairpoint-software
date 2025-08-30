import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Calculator,
  FileText,
  Search,
  HelpCircle,
} from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-r from-background to-card">
      {/* Main Content */}
      <div className="text-center space-y-8 max-w-2xl mx-auto">
        {/* Icon and Title Section */}
        <div className="space-y-6">
          <div className="mx-auto w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center">
            <Calculator className="w-12 h-12 text-muted-foreground" />
          </div>

          <div className="space-y-4">
            <h1 className="text-6xl font-bold tracking-tight text-foreground">
              404
            </h1>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">
              Balance Sheet Not Balanced
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-lg mx-auto">
              The page you&apos;re looking for doesn&apos;t exist in our ledger.
              It seems like this entry has been reconciled away.
            </p>
          </div>
        </div>

        {/* Separator */}
        <Separator className="w-32 mx-auto" />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild size="lg" className="min-w-[200px] w-full">
            <Link href="/" className="flex items-center gap-3">
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </Link>
          </Button>
        </div>

        {/* Additional Info */}
        <div className="space-y-6 pt-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-muted-foreground">
            <div className="flex flex-col items-center space-y-2">
              <FileText className="w-6 h-6" />
              <span>Check the URL</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Search className="w-6 h-6" />
              <span>Search our site</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <HelpCircle className="w-6 h-6" />
              <span>Contact support</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Need professional accounting assistance? Our team is here to help
              balance your books.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-center">
        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-background/80 px-4 py-2 rounded-full border border-border/50">
          <Calculator className="w-4 h-4" />
          <span>Error 404 • Fairpoint Software</span>
        </div>
      </div>
    </div>
  );
}
