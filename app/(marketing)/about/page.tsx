'use client';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Award, Eye, Heart } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const coreValues = [
    {
      icon: Award,
      title: 'Integrity',
      description:
        'We maintain the highest standards of accuracy and transparency in all our financial services and interactions.',
    },
    {
      icon: Heart,
      title: 'Empathy',
      description:
        'We understand the challenges Filipino business owners face and provide compassionate, personalized support.',
    },
    {
      icon: Award,
      title: 'Excellence',
      description:
        'We continuously innovate and improve our platform to deliver exceptional accounting solutions.',
    },
  ];

  const teamMembers = [
    {
      name: 'Victor Franz Roxas',
      position: 'Founder & CEO',
      expertise: 'CPA, MBA',
      image:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
    },
    {
      name: 'Ana Santos',
      position: 'CTO',
      expertise: 'MS Computer Science',
      image:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
    },
    {
      name: 'Clark Wayne Abutal',
      position: 'Founder & Developer',
      expertise: 'PHP, Vue, React, Next.js',
      image:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    },
    {
      name: 'Victor Roxas Jr.',
      position: 'Founder & Developer',
      expertise: 'PHP, Vue, React, Next.js',
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    },
  ];

  const stats = [
    {
      number: '1,000+',
      label: 'Active Users',
    },
    {
      number: '50,000+',
      label: 'Transactions Processed',
    },
    {
      number: '₱2B+',
      label: 'Transaction Value Handled',
    },
    {
      number: '99.9%',
      label: 'Uptime Guarantee',
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <span className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm px-3 py-1 rounded-full mb-4">
              About Fairpoint
            </span>
          </div>

          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Empowering Businesses with Smart Accounting
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto">
            Founded by certified public accountants who understand the unique
            challenges of Philippine taxation and business compliance, FairPoint
            is dedicated to simplifying accounting for every entrepreneur.
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 px-6 lg:px-8 bg-slate-100 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Mission */}
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-[#38B6FF] rounded-full flex items-center justify-center mr-3">
                  <Award className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Our Mission
                </h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                To democratize professional accounting services for Filipino
                businesses by providing intelligent, automated solutions that
                ensure BIR compliance while saving time and reducing costs.
              </p>
            </div>

            {/* Vision */}
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-[#38B6FF] rounded-full flex items-center justify-center mr-3">
                  <Eye className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Our Vision
                </h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                To become the leading accounting platform in the Philippines,
                empowering every business owner with the financial clarity and
                compliance confidence they need to grow and succeed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {coreValues.map((value, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-[#38B6FF] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-[#38B6FF]" />
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-6 lg:px-8 bg-slate-100 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Certified professionals dedicated to your success
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-4">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription className="text-sm font-medium text-[#38B6FF]">
                    {member.position}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {member.expertise}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 px-6 lg:px-8 bg-gradient-to-r from-[#38B6FF] to-[#2BA3E6]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-4xl font-bold">{stat.number}</div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
            Ready to join thousands of satisfied clients?
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
            Experience the difference that professional, automated accounting
            can make for your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-[#38B6FF] hover:bg-[#2BA3E6]"
            >
              <Link href="/auth/sign-up">Start Free Trial</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#contact">Schedule Demo</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
