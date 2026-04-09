import Link from "next/link";
import {
  Scale,
  MessageSquare,
  BarChart3,
  Plug,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Nav */}
      <nav className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg">Legal Intake</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm mb-6">
          <Zap className="w-4 h-4" />
          AI-Powered Legal Intake
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold leading-tight max-w-3xl mx-auto">
          An Intake Department
          <br />
          <span className="text-blue-400">That Never Sleeps</span>
        </h1>
        <p className="text-xl text-gray-400 mt-6 max-w-2xl mx-auto">
          Qualify leads 24/7 with AI chat. Reduce intake costs by 80%. Convert
          more prospects into signed cases. One script tag on your website.
        </p>
        <div className="flex items-center justify-center gap-4 mt-8">
          <Link
            href="/demo"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            Try Live Demo
          </Link>
          <Link
            href="/signup"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            Start Free Trial
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-500">
          {["No credit card required", "5-minute setup", "Cancel anytime"].map(
            (t) => (
              <div key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                {t}
              </div>
            ),
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-gray-800 bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { stat: "80%", label: "Reduction in intake costs" },
            { stat: "24/7", label: "Lead qualification" },
            { stat: "< 60s", label: "Average response time" },
            { stat: "3x", label: "More qualified leads" },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-3xl font-bold text-white">{item.stat}</p>
              <p className="text-sm text-gray-400 mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">Everything Your Firm Needs</h2>
          <p className="text-gray-400 mt-3 max-w-xl mx-auto">
            From first contact to signed retainer — AI handles the heavy lifting
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: MessageSquare,
              title: "AI Chat Intake",
              desc: "Conversational AI that asks the right questions, shows empathy, and qualifies cases in real-time.",
            },
            {
              icon: BarChart3,
              title: "Lead Scoring",
              desc: "Every lead gets a qualification score based on injury severity, liability, insurance, and more.",
            },
            {
              icon: Shield,
              title: "Case Templates",
              desc: "Pre-built qualification flows for PI, auto accidents, med mal, workers comp, and more.",
            },
            {
              icon: Plug,
              title: "CRM Integration",
              desc: "Push qualified leads directly to Lead Docket, Filevine, SmartAdvocate, or any CRM via webhooks.",
            },
            {
              icon: Zap,
              title: "One-Line Install",
              desc: "Single script tag. Works with WordPress, Squarespace, Webflow, Wix, or any custom site.",
            },
            {
              icon: Scale,
              title: "Customizable Logic",
              desc: "Define your own qualification criteria, thresholds, and AI behavior — strict or lenient.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                <feature.icon className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm mt-2">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-gray-800 bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Lead Arrives",
                desc: "Visitor clicks the chat widget on your website",
              },
              {
                step: "2",
                title: "AI Qualifies",
                desc: "Conversational AI gathers case details naturally",
              },
              {
                step: "3",
                title: "Scores & Summarizes",
                desc: "Lead gets scored with qualification flags",
              },
              {
                step: "4",
                title: "Routes & Signs",
                desc: "Qualified leads pushed to your CRM or staff",
              },
            ].map((step) => (
              <div key={step.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg mx-auto">
                  {step.step}
                </div>
                <h3 className="text-white font-semibold mt-4">{step.title}</h3>
                <p className="text-gray-400 text-sm mt-2">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              See It In Action — Live Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-4">Simple Pricing</h2>
        <p className="text-gray-400 text-center mb-12">
          Start small, scale as you grow
        </p>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            {
              plan: "Starter",
              price: "$1,000",
              features: [
                "AI Chat Widget",
                "100 conversations/mo",
                "Lead scoring",
                "1 CRM integration",
                "Email notifications",
              ],
            },
            {
              plan: "Professional",
              price: "$2,000",
              popular: true,
              features: [
                "Everything in Starter",
                "Unlimited conversations",
                "Custom AI training",
                "3 CRM integrations",
                "Priority support",
                "Advanced analytics",
              ],
            },
            {
              plan: "Enterprise",
              price: "$4,000+",
              features: [
                "Everything in Professional",
                "Voice AI intake",
                "Multi-location support",
                "Custom integrations",
                "Dedicated success manager",
                "SLA guarantee",
              ],
            },
          ].map((tier) => (
            <div
              key={tier.plan}
              className={`rounded-xl p-6 ${
                tier.popular
                  ? "bg-blue-600 border-2 border-blue-500 relative"
                  : "bg-gray-900 border border-gray-800"
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-400 text-blue-900 text-xs font-bold px-3 py-1 rounded-full">
                  MOST POPULAR
                </span>
              )}
              <h3 className="text-lg font-semibold text-white">{tier.plan}</h3>
              <p className="mt-2">
                <span className="text-3xl font-bold">{tier.price}</span>
                <span
                  className={`text-sm ${tier.popular ? "text-blue-200" : "text-gray-500"}`}
                >
                  /mo
                </span>
              </p>
              <ul className="mt-6 space-y-3">
                {tier.features.map((f) => (
                  <li
                    key={f}
                    className={`flex items-center gap-2 text-sm ${tier.popular ? "text-blue-100" : "text-gray-400"}`}
                  >
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 ${tier.popular ? "text-blue-200" : "text-emerald-500"}`}
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className={`mt-6 block text-center py-2.5 rounded-lg font-medium text-sm transition-colors ${
                  tier.popular
                    ? "bg-white text-blue-600 hover:bg-blue-50"
                    : "bg-gray-800 text-white hover:bg-gray-700"
                }`}
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl font-bold">Ready to Automate Your Intake?</h2>
          <p className="text-gray-400 mt-3 max-w-lg mx-auto">
            Join firms that are converting more leads with less staff. Set up in
            5 minutes.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors mt-6"
          >
            Start Free Trial
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4" />
            Legal Intake
          </div>
          <p>
            &copy; {new Date().getFullYear()} Legal Intake. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
