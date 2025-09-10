import { EnvVarWarning } from "@/components/ui/env-var-warning";
import { AuthButton } from "@/features/auth/auth-button";
import { Hero } from "@/features/home/hero";
import React from 'react';
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { ThemeSwitch } from "@/components/ui/theme-switch";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  // Check if user is authenticated and redirect to dashboard
  if (hasEnvVars) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    if (data?.claims) {
      redirect("/dashboard");
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
                <Link href="/">
                <img
                  src="/logo.png"
                  alt="Fairpoint Logo"
                  width={80}
                  height={40}
                />
                </Link>
            </div>
            {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
          </div>
        </nav>

        {/* Professional Accounting Software Hero Section */}
        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-[#38B6FF]/10 dark:bg-[#38B6FF]/20 text-[#38B6FF] rounded-full text-sm font-medium mb-8">
              <span className="w-2 h-2 bg-[#38B6FF] rounded-full mr-2 animate-pulse"></span>
              Professional Accounting Software
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-8 leading-tight">
              Professional tax and
              <span className="block text-[#38B6FF]">
                accounting software
              </span>
              <span className="block">for modern businesses</span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Streamline your financial operations with our comprehensive accounting
              solution. From invoicing to tax management, we've got everything your
              business needs.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <Link href="/auth/sign-up">
                  <button className="group bg-[#38B6FF] hover:bg-[#2A9DE8] text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center">
                  Start Free Trial
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  </button>
                </Link>
            </div>

            <div className="flex items-center justify-center space-x-6 text-sm text-slate-500 dark:text-slate-400 mb-16">
              <span className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                No credit card required
              </span>
              <span className="flex items-center">
                <svg className="w-4 h-4 text-[#38B6FF] mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                14-day free trial
              </span>
              <span className="flex items-center">
                <svg className="w-4 h-4 text-orange-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Cancel anytime
              </span>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-20">
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200/50 dark:border-slate-700/50">
                <div className="w-12 h-12 bg-[#38B6FF] rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Smart Invoicing</h3>
                <p className="text-slate-600 dark:text-slate-300">Create professional invoices in seconds with automated calculations and payment tracking.</p>
              </div>

              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200/50 dark:border-slate-700/50">
                <div className="w-12 h-12 bg-[#38B6FF] rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Tax Management</h3>
                <p className="text-slate-600 dark:text-slate-300">Automate tax calculations and stay compliant with built-in tax rules and reporting.</p>
              </div>

              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200/50 dark:border-slate-700/50">
                <div className="w-12 h-12 bg-[#38B6FF] rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Financial Reports</h3>
                <p className="text-slate-600 dark:text-slate-300">Generate comprehensive reports with real-time insights into your business performance.</p>
              </div>
            </div>
          </div>

        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-4">
          <p>
            Powered by{" "}
            <a
              href="https://ckdigitals.com"
              target="_blank"
              className="font-bold hover:underline text-[#38B6FF]"
              rel="noreferrer"
            >
              CKDigitals
            </a>
          </p>
          <ThemeSwitch />
        </footer>
      </div>
    </main>
  );
}