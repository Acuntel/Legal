import Link from "next/link";
import { Scale, ArrowLeft, Phone, MapPin, Clock, Star } from "lucide-react";
import DemoWidget from "@/components/DemoWidget";

export const metadata = {
  title: "Live Demo - Legal Intake AI",
  description: "See how the AI intake widget works on a real law firm website",
};

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Demo banner */}
      <div className="bg-blue-600 text-white text-center py-2.5 px-4 text-sm">
        <span className="font-medium">Live Demo</span> — This is a simulated law
        firm website with our AI intake widget. Try the chat bubble in the
        bottom-right corner.{" "}
        <Link href="/signup" className="underline font-medium">
          Get this for your firm &rarr;
        </Link>
      </div>

      {/* Back to main site */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-6xl mx-auto px-6 py-2 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Legal Intake
          </Link>
          <Link
            href="/signup"
            className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Mock law firm website */}
      <nav className="bg-[#1e3a5f] text-white">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Scale className="w-8 h-8 text-[#d4a535]" />
            <div>
              <div className="font-bold text-lg leading-tight">
                The Kryder Law Group
              </div>
              <div className="text-[#d4a535] text-xs">
                Personal Injury Attorneys
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm">
            <span className="hover:text-[#d4a535] cursor-pointer transition-colors">
              Practice Areas
            </span>
            <span className="hover:text-[#d4a535] cursor-pointer transition-colors">
              Our Team
            </span>
            <span className="hover:text-[#d4a535] cursor-pointer transition-colors">
              Results
            </span>
            <span className="hover:text-[#d4a535] cursor-pointer transition-colors">
              Contact
            </span>
            <div className="flex items-center gap-2 bg-[#d4a535] text-[#1e3a5f] font-semibold px-4 py-2 rounded-lg">
              <Phone className="w-4 h-4" />
              (312) 223-1700
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1e3a5f] to-[#0f1f33] text-white py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl">
            <p className="text-[#d4a535] font-semibold text-sm uppercase tracking-wider mb-4">
              Chicago Personal Injury Lawyers
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
              Injuries Hurt. We Make the Legal Process{" "}
              <span className="text-[#d4a535]">Painless.</span>
            </h1>
            <p className="text-lg text-gray-300 mt-6">
              Over $100 million recovered for our clients. 22+ years of
              experience. No fees unless we win your case.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <button className="bg-[#d4a535] hover:bg-[#c09530] text-[#1e3a5f] font-semibold px-6 py-3 rounded-lg transition-colors">
                Free Case Review
              </button>
              <div className="flex items-center gap-2 text-gray-300">
                <Phone className="w-5 h-5" />
                <span>Call (312) 223-1700</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-gray-50 border-y py-6">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-center justify-center gap-8 text-center">
          <div>
            <p className="text-2xl font-bold text-[#1e3a5f]">$100M+</p>
            <p className="text-xs text-gray-500">Recovered</p>
          </div>
          <div className="w-px h-10 bg-gray-300 hidden sm:block" />
          <div>
            <p className="text-2xl font-bold text-[#1e3a5f]">22+</p>
            <p className="text-xs text-gray-500">Years Experience</p>
          </div>
          <div className="w-px h-10 bg-gray-300 hidden sm:block" />
          <div className="flex items-center gap-1">
            <p className="text-2xl font-bold text-[#1e3a5f]">4.9</p>
            <Star className="w-5 h-5 text-[#d4a535] fill-[#d4a535]" />
          </div>
          <div className="-ml-6">
            <p className="text-xs text-gray-500">535+ Google Reviews</p>
          </div>
          <div className="w-px h-10 bg-gray-300 hidden sm:block" />
          <div>
            <p className="text-2xl font-bold text-[#1e3a5f]">17</p>
            <p className="text-xs text-gray-500">Office Locations</p>
          </div>
        </div>
      </section>

      {/* Practice areas */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-[#1e3a5f] mb-12">
            Practice Areas
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Car Accidents",
              "Truck Accidents",
              "Medical Malpractice",
              "Workers Compensation",
              "Slip and Fall",
              "Wrongful Death",
            ].map((area) => (
              <div
                key={area}
                className="border rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <h3 className="text-lg font-semibold text-[#1e3a5f] group-hover:text-[#d4a535] transition-colors">
                  {area}
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                  Experienced representation for {area.toLowerCase()} cases
                  across Illinois and beyond.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-[#1e3a5f] text-white py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold">Free Case Review</h2>
          <p className="text-gray-300 mt-3 max-w-lg mx-auto">
            Not sure if you have a case? Talk to our team — there&apos;s no cost
            and no obligation.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#d4a535]" />
              (312) 223-1700
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#d4a535]" />
              134 N LaSalle St, Suite 1515, Chicago, IL
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#d4a535]" />
              Available 24/7
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f1f33] text-gray-400 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} The Kryder Law Group, LLC. All
            rights reserved.
          </p>
          <p className="mt-2 text-gray-500">
            This is a demo website. The AI chat widget in the bottom-right
            corner is powered by Legal Intake.
          </p>
        </div>
      </footer>

      {/* Load the demo widget */}
      <DemoWidget />
    </div>
  );
}
