import Footer from '@/components/footer';
import Header from '@/components/header';
import { createClient } from '@/lib/supabase/server';
import { hasEnvVars } from '@/lib/utils';
import {
  BarChart,
  FileText,
  Globe,
  Shield,
  Star,
  Users,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

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
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <span className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm px-3 py-1 rounded-full mb-4">
              Built for Philippine Taxation
            </span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            Smart Accounting for{' '}
            <span className="text-[#38B6FF]">Businesses</span>
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Automate your Philippine tax computations, manage your books, and
            stay compliant with BIR requirements. Built by accountants, for
            Filipino entrepreneurs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/auth/sign-up"
              className="bg-[#38B6FF] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#2BA3E6] transition-all transform hover:scale-105 text-center"
            >
              Get Started Free
            </Link>
            <button className="border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-8 py-4 rounded-lg text-lg font-semibold hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              Watch Demo
            </button>
          </div>

          {/* Social Proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="font-medium">4.9/5 Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="font-medium">500 Customers</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="font-medium">1000+ Businesses</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 px-6 lg:px-8 bg-white dark:bg-slate-800"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Everything you need for Philippine accounting
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              From BIR forms to financial reports, we've got you covered with
              automated computations and compliance assurance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Auto Tax Computation */}
            <div className="bg-slate-50 dark:bg-slate-700 rounded-2xl p-8 hover:shadow-lg dark:hover:shadow-2xl transition-shadow">
              <div className="w-12 h-12 bg-[#38B6FF]/10 dark:bg-[#38B6FF]/20 rounded-lg flex items-center justify-center mb-6">
                <BarChart className="w-6 h-6 text-[#38B6FF]" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                Auto Tax Computation
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                Automatically compute withholding taxes, VAT, and income tax
                based on Philippine tax laws. Stay stress-free from manual
                calculations.
              </p>
            </div>

            {/* BIR Forms Generation */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-8 hover:shadow-lg dark:hover:shadow-2xl transition-shadow">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-800/30 rounded-lg flex items-center justify-center mb-6">
                <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                BIR Forms Generation
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                Generate BIR forms 2307, 2306C, 1701, and others with ease. Get
                accurate data from your transactions.
              </p>
            </div>

            {/* Financial Reports */}
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-8 hover:shadow-lg dark:hover:shadow-2xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-800/30 rounded-lg flex items-center justify-center mb-6">
                <BarChart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                Financial Reports
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                Generate comprehensive financial statements including income
                statement, balance sheet and cash flow reports with just a
                click.
              </p>
            </div>

            {/* Smart Automation */}
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-8 hover:shadow-lg dark:hover:shadow-2xl transition-shadow">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-800/30 rounded-lg flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                Smart Automation
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                Automate recurring entries, bank reconciliations, and invoice
                generation. Focus on growing your business instead.
              </p>
            </div>

            {/* Compliance Monitoring */}
            <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-8 hover:shadow-lg dark:hover:shadow-2xl transition-shadow">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-800/30 rounded-lg flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                Compliance Monitoring
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                Stay compliant with BIR deadlines and requirements with
                automated reminders and compliance checklists.
              </p>
            </div>

            {/* Multi-User Access */}
            <div className="bg-teal-50 dark:bg-teal-900/20 rounded-2xl p-8 hover:shadow-lg dark:hover:shadow-2xl transition-shadow">
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-800/30 rounded-lg flex items-center justify-center mb-6">
                <Globe className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                Multi-User Access
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                Collaborate with your team and accountant with role-based access
                controls and real-time data sharing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 lg:px-8 bg-gradient-to-r from-[#38B6FF] to-[#2BA3E6]">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">
            Ready to simplify your accounting?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of Filipino businesses who trust Fairpoint for their
            accounting needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/sign-up"
              className="bg-white text-[#38B6FF] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors text-center"
            >
              Get Started Free
            </Link>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/10 transition-colors">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}