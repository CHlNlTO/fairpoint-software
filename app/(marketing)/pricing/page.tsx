'use client';
import Header from '@/components/header';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Check } from 'lucide-react';
import { useState } from 'react';

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>(
    'monthly'
  );

  const plans = [
    {
      id: 'starter',
      name: 'Starter Plan',
      monthlyPrice: 1500,
      yearlyPrice: 15000,
      description: 'Perfect for small businesses and freelancers',
      popular: false,
      features: [
        'Up to 50 transactions per month',
        'Basic BIR forms generation',
        'Income and expense tracking',
        'Monthly financial reports',
        'Email support',
        'Mobile app access',
      ],
    },
    {
      id: 'professional',
      name: 'Professional Plan',
      monthlyPrice: 3500,
      yearlyPrice: 35000,
      description: 'Ideal for growing businesses with more complex needs',
      popular: true,
      features: [
        'Up to 500 transactions per month',
        'All BIR forms generation',
        'Advanced financial reporting',
        'Bank reconciliation',
        'Multi-user access (up to 3 users)',
        'Priority email support',
        'Audit trail and compliance monitoring',
        'Custom chart of accounts',
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise Plan',
      monthlyPrice: 7500,
      yearlyPrice: 75000,
      description: 'For established businesses requiring full features',
      popular: false,
      features: [
        'Unlimited transactions',
        'All BIR forms and compliance features',
        'Advanced analytics and dashboards',
        'Multiple company management',
        'Unlimited users',
        'Phone and email support',
        'Dedicated account manager',
        'API access',
        'Custom integrations',
        'Advanced security features',
      ],
    },
  ];

  const consultingServices = [
    {
      title: 'BIR Registration Setup',
      price: '₱5,000.00 PHP',
      description: 'Complete BIR registration assistance for new businesses',
    },
    {
      title: 'Tax Compliance Audit',
      price: '₱15,000.00 PHP',
      description: 'Comprehensive review of your tax compliance status',
    },
    {
      title: 'Financial Statement Preparation',
      price: '₱8,000.00 PHP',
      description: 'Professional financial statement preparation and review',
    },
    {
      title: 'Bookkeeping Setup',
      price: '₱3,000.00 PHP',
      description: 'Initial chart of accounts and bookkeeping system setup',
    },
    {
      title: 'Monthly Bookkeeping Service',
      price: '₱12,000.00 PHP',
      description: 'Complete monthly bookkeeping and reconciliation service',
    },
    {
      title: 'Annual Tax Filing',
      price: '₱6,000.00 PHP',
      description: 'Complete annual tax return preparation and filing',
    },
  ];

  const faqs = [
    {
      question: 'How does Fairpoint pricing work?',
      answer:
        'We offer simple, transparent pricing based on the number of transactions and features you need. You can choose monthly or yearly billing, with yearly plans offering significant savings.',
    },
    {
      question: 'Can I change my plan anytime?',
      answer:
        "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle, and we'll prorate any differences.",
    },
    {
      question: 'Is there a setup fee?',
      answer:
        'No, there are no setup fees for any of our plans. You can get started immediately after signing up.',
    },
    {
      question: 'Do you offer refunds?',
      answer:
        "We offer a 30-day money-back guarantee for all plans. If you're not satisfied within the first 30 days, we'll provide a full refund.",
    },
    {
      question: "What's included in the consultation?",
      answer:
        'Our consulting services include personalized guidance from certified Filipino accountants who understand local BIR requirements and can help optimize your business processes.',
    },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getPrice = (plan: (typeof plans)[0]) => {
    return billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
  };

  const getSavings = (plan: (typeof plans)[0]) => {
    const yearlyTotal = plan.monthlyPrice * 12;
    const savings = yearlyTotal - plan.yearlyPrice;
    return savings;
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Simple, Transparent Pricing
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            Choose the perfect plan for your business needs. All plans include
            our core accounting features and BIR compliance tools, with
            Philippine tax automation.
          </p>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Try free for 14 days • No setup fees
          </p>
        </div>
      </section>

      {/* Billing Toggle */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-12">
        <div className="flex justify-center">
          <Card className="p-1">
            <div className="flex">
              <Button
                variant={billingPeriod === 'monthly' ? 'default' : 'ghost'}
                onClick={() => setBillingPeriod('monthly')}
                className={`rounded-r-none ${
                  billingPeriod === 'monthly'
                    ? 'bg-[#38B6FF] hover:bg-[#2BA3E6] text-white'
                    : ''
                }`}
              >
                Monthly
              </Button>
              <Button
                variant={billingPeriod === 'yearly' ? 'default' : 'ghost'}
                onClick={() => setBillingPeriod('yearly')}
                className={`rounded-l-none ${
                  billingPeriod === 'yearly'
                    ? 'bg-[#38B6FF] hover:bg-[#2BA3E6] text-white'
                    : ''
                }`}
              >
                Yearly (Save up to 17%)
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Pricing Plans */}
      <section className="py-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {plans.map(plan => (
              <Card
                key={plan.id}
                className={`relative ${
                  plan.popular ? 'ring-2 ring-[#38B6FF] scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-[#38B6FF] hover:bg-[#2BA3E6]">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-base">
                    {plan.description}
                  </CardDescription>

                  <div className="pt-4">
                    <span className="text-4xl font-bold text-slate-900 dark:text-white">
                      {formatPrice(getPrice(plan))}
                    </span>
                    <span className="text-slate-600 dark:text-slate-300 ml-2">
                      /{billingPeriod === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>

                  {billingPeriod === 'yearly' && (
                    <div className="text-sm text-green-600 dark:text-green-400">
                      Save {formatPrice(getSavings(plan))} per year
                    </div>
                  )}
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-600 dark:text-slate-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${
                      plan.popular ? 'bg-[#38B6FF] hover:bg-[#2BA3E6]' : ''
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    Choose {plan.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Consulting Services */}
      <section className="py-20 px-6 lg:px-8 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Consulting Services
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Get expert advice from certified professionals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {consultingServices.map((service, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-[#38B6FF] to-[#2563eb] rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                {/* Header */}
                <div className="text-white text-lg font-medium mb-4">
                  Consult with
                </div>

                {/* Professional Image */}
                <div className="bg-white bg-opacity-20 rounded-xl p-4 mb-6 flex items-center justify-center h-32">
                  <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                </div>

                {/* Service Details */}
                <div className="bg-white rounded-xl p-4 mb-4">
                  <div className="text-sm text-gray-600 mb-1">Consult with</div>
                  <div className="text-lg font-semibold text-gray-800 mb-3">
                    {service.title}
                  </div>
                  <div className="text-xl font-bold text-gray-900">
                    {service.price}
                  </div>
                </div>

                {/* Book Button */}
                <Button className="w-full bg-[#38B6FF] hover:bg-[#2BA3E6] text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 shadow-md hover:shadow-lg">
                  Book Consultation
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-slate-200 dark:border-slate-700 rounded-lg px-6"
              >
                <AccordionTrigger className="text-left font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 dark:text-slate-300 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </main>
  );
}
