"use client";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#15803d]/20 border-t border-[#15803d]/30 transition-theme">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-[#15803d] mb-4 transition-theme">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-[#15803d]/80 hover:text-[#15803d] transition-theme"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#15803d]/80 hover:text-[#15803d] transition-theme"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#15803d]/80 hover:text-[#15803d] transition-theme"
                >
                  Support
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#15803d]/80 hover:text-[#15803d] transition-theme"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-[#15803d] mb-4 transition-theme">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-[#15803d]/80 hover:text-[#15803d] transition-theme"
                >
                  API Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#15803d]/80 hover:text-[#15803d] transition-theme"
                >
                  Community
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#15803d]/80 hover:text-[#15803d] transition-theme"
                >
                  Release Notes
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#15803d]/80 hover:text-[#15803d] transition-theme"
                >
                  Status Page
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-[#15803d] mb-4 transition-theme">
              Contact
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:support@example.com"
                  className="text-[#15803d]/80 hover:text-[#15803d] transition-theme"
                >
                  support@example.com
                </a>
              </li>
              <li className="text-[#15803d]/80 transition-theme">
                +1 (555) 123-4567
              </li>
              <li className="text-[#15803d]/80 transition-theme">
                123 Government Street
              </li>
              <li className="text-[#15803d]/80 transition-theme">
                Tarlac City, Philippines
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#15803d]/30 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[#15803d]/80 transition-theme">
            © {currentYear} The Tarlac Chronicle. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-sm text-[#15803d]/80 hover:text-[#15803d] transition-theme"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-sm text-[#15803d]/80 hover:text-[#15803d] transition-theme"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-sm text-[#15803d]/80 hover:text-[#15803d] transition-theme"
            >
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}


