import { Link } from 'react-router-dom';
import Newsletter from '../../../components/HomePage/Newsletter/Newsletter';

function Footer() {
  return (
    <footer className="w-full bg-[var(--navy-blue-color)] text-white">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-10">

        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              Erasmus Mundus Association
            </h2>

            <p className="mt-1 text-2xl font-semibold text-white/70">
              Bangladesh
            </p>

            <p className="mt-5 max-w-md text-sm leading-6 text-white/55">
              Connecting Erasmus+ students, alumni and the wider community
              through collaboration, knowledge sharing and meaningful
              opportunities.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">
              Explore
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  to="/about"
                  className="text-sm text-white/60 transition hover:text-white"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  to="/team"
                  className="text-sm text-white/60 transition hover:text-white"
                >
                  Our Team
                </Link>
              </li>

              <li>
                <Link
                  to="/events"
                  className="text-sm text-white/60 transition hover:text-white"
                >
                  Events
                </Link>
              </li>

              <li>
                <Link
                  to="/blog"
                  className="text-sm text-white/60 transition hover:text-white"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">
              Information
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  to="/student-alumni"
                  className="text-sm text-white/60 transition hover:text-white"
                >
                  Student & Alumni
                </Link>
              </li>

              <li>
                <Link
                  to="/faq"
                  className="text-sm text-white/60 transition hover:text-white"
                >
                  FAQ
                </Link>
              </li>

              <li>
                <Link
                  to="/terms"
                  className="text-sm text-white/60 transition hover:text-white"
                >
                  Terms of Service
                </Link>
              </li>

              <li>
                <Link
                  to="/privacy"
                  className="text-sm text-white/60 transition hover:text-white"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="text-sm text-white/60 transition hover:text-white"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Newsletter */}
        <div className="mt-14 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-7 sm:px-8">
          <div className="grid items-center gap-6 lg:grid-cols-[1fr_1.5fr]">

            <div>
              <h3 className="text-base md:text-lg font-semibold">
                Stay connected with EMA BD
              </h3>

              <p className="mt-1.5 text-sm leading-6 text-white/55">
                Subscribe for updates, events and opportunities.
              </p>
            </div>

            <Newsletter />

          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-white/10 pt-6">
          <div className="flex flex-col gap-3 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">

            <p>
              © EMA BD 2026. All rights reserved.
            </p>

            <p>
              Created by{' '}
              <Link
                to="/developers"
                className="font-medium text-white/80 transition hover:text-white"
              >
                EMA BD IT Team
              </Link>
            </p>

          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;