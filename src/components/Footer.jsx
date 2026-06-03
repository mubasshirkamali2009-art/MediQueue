import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0f1b2d] text-gray-400 pt-14 pb-6 px-6">

      {/* Top Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-10">

        {/* Col 1: Brand */}
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-white text-xl font-medium tracking-tight">
              Medi<span className="text-[#5ba3d9]">Queue</span>
            </span>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed">
            Smart tutor booking for focused learners. Browse, book, and manage your sessions — all in one place.
          </p>
        </div>

        {/* Col 2: Learning Services */}
        <div>
          <p className="text-white text-xs font-semibold uppercase tracking-widest mb-4">
            Learning Services
          </p>
          <ul className="space-y-3">
            {[
              "Browse Tutors",
              "Subject Catalogue",
              "Book a Session",
              "My Session Tokens",
              "Upcoming Classes",
              "Become a Tutor",
            ].map((label) => (
              <li key={label}>
                <Link
                  href="#"
                  className="text-sm text-gray-400 hover:text-[#5ba3d9] transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Support */}
        <div>
          <p className="text-white text-xs font-semibold uppercase tracking-widest mb-4">
            Support
          </p>
          <ul className="space-y-3">
            {[
              "Help Centre",
              "How It Works",
              "FAQs",
              "Safety Policy",
              "Blog",
              "Live Chat",
            ].map((label) => (
              <li key={label}>
                <Link
                  href="#"
                  className="text-sm text-gray-400 hover:text-[#5ba3d9] transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4: Contact */}
        <div>
          <p className="text-white text-xs font-semibold uppercase tracking-widest mb-4">
            Contact Us
          </p>
          <ul className="space-y-4">
            <li className="text-sm text-gray-400 leading-relaxed">
              123 Learning Lane, Education Hub,<br />Singapore 048623
            </li>
            <li className="text-sm">
              <a
                href="mailto:hello@mediqueue.io"
                className="text-gray-400 hover:text-[#5ba3d9] transition-colors"
              >
                hello@mediqueue.io
              </a>
            </li>
            <li className="text-sm text-gray-400">+65 6123 4567</li>
            <li className="text-sm text-gray-400">Mon – Fri, 9 am – 6 pm SGT</li>
          </ul>
        </div>

      </div>

      {/* Divider */}
      <div className="max-w-6xl mx-auto border-t border-[#1a2f48]"></div>

      {/* Bottom Bar */}
      <div className="max-w-6xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
        <span>© 2026 MediQueue Pte. Ltd. All rights reserved.</span>
        <div className="flex flex-wrap justify-center gap-4">
          {["Privacy Policy", "Terms of Use", "Cookie Settings", "Accessibility"].map((item) => (
            <Link key={item} href="#" className="hover:text-[#5ba3d9] transition-colors">
              {item}
            </Link>
          ))}
        </div>
      </div>

    </footer>
  );
}