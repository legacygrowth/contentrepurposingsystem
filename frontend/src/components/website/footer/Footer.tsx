import {
  IconBrandFacebook,
  IconBrandTwitter,
  IconBrandLinkedin,
  IconBrandInstagram,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t-2 bg-[var(--base-color)] px-5 py-10 text-[var(--contrast-color)] md:px-20">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 text-center md:grid-cols-3 md:text-left">
        {/* Company Logo */}
        <div>
          <img
            src="/logo/ES_logo.png"
            alt="YourCompany Logo"
            className="h-16 w-auto"
          />
          <p className="mt-2 text-sm">Innovate. Automate. Elevate.</p>
          <div className="mt-4 flex justify-center space-x-4 md:justify-start">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconBrandFacebook className="cursor-pointer text-xl hover:text-[var(--brand-color)]" />
            </a>
            <a
              href="https://www.twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconBrandTwitter className="cursor-pointer text-xl hover:text-[var(--brand-color)]" />
            </a>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconBrandLinkedin className="cursor-pointer text-xl hover:text-[var(--brand-color)]" />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconBrandInstagram className="cursor-pointer text-xl hover:text-[var(--brand-color)]" />
            </a>
          </div>
        </div>

        {/* Resources */}
        <div>
          <h3 className="mb-3 text-lg font-semibold">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/helpcenter" className="hover:underline">
                Help Center
              </Link>
            </li>
            <li>
              <Link to="/professionals" className="hover:underline">
                Product Updates
              </Link>
            </li>
            <li>
              <Link to="/pricing" className="hover:underline">
                Become an Affiliate
              </Link>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-3 text-lg font-semibold">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/integrations" className="hover:underline">
                Integrations
              </Link>
            </li>
            <li>
              <Link to="/pricing" className="hover:underline">
                Pricing
              </Link>
            </li>

            <li>
              <Link to="/terms-of-services" className="hover:underline">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="hover:underline">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-10 border-t border-gray-700 pt-5 text-center text-sm">
        &copy; {new Date().getFullYear()} Equip Scale Strategies LLC. All Rights
        Reserved.
      </div>
    </footer>
  );
}
