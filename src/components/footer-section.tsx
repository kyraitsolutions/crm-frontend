import { Link } from "react-router-dom";

export default function FooterSection() {
  return (
    <footer className="w-full bg-primary border-t border-gray-200">
      <div className="max-w-370 mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-2xl font-bold text-white">
              <span className="text-white">Kyra</span> CRM
            </h3>
            <p className="text-gray-200 max-w-sm">
              Build smart chatbots, capture high-intent leads, and convert conversations into revenue — all from one powerful CRM.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-4 pt-2">
              {[
                { href: "https://www.instagram.com/kyraitsolutions", label: "Instagram", icon: "IG" },
                { href: "https://www.linkedin.com/company/kyraitsolutions/", label: "LinkedIn", icon: "LI" },
                // { href: "#", label: "GitHub", icon: "GH" },
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  target="_blank"
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-200 hover:border-white hover:text-white transition"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 lg:col-span-3">

            {/* Product */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">
                Product
              </h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li><Link to="#" className="text-gray-200">Features</Link></li>
                <li><Link to="#pricing" className="text-gray-200">Pricing</Link></li>
                <li><Link to="#" className="text-gray-200">Integrations</Link></li>
                <li><Link to="#" className="text-gray-200">Live Preview</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">
                Company
              </h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li><Link to="/about" className="text-gray-200">About</Link></li>
                <li><Link to="#" className="text-gray-200">Team</Link></li>
                <li><Link to="#" className="text-gray-200">Careers</Link></li>
                <li><Link to="#" className="text-gray-200">Contact</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">
                Resources
              </h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li><Link to="#" className="text-gray-200">Documentation</Link></li>
                <li><Link to="#" className="text-gray-200">API Reference</Link></li>
                <li><Link to="#" className="text-gray-200">Community</Link></li>
                <li><Link to="#" className="text-gray-200">Support</Link></li>
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p className="text-gray-200">© {new Date().getFullYear()} Kyra IT Solutions. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/terms" className="text-gray-200">Terms</Link>
            <Link to="/privacy-policy" className="text-gray-200">Privacy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
