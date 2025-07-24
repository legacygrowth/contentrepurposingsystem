const PrivacyPolicy = () => {
  return (
    <div className="mt-18 flex min-h-screen items-center justify-center bg-gray-100 p-6 dark:bg-gray-900">
      <div className="max-w-3xl rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800">
        <h1 className="text-center text-4xl font-bold text-gray-900 dark:text-white">
          Privacy Policy
        </h1>
        <p className="mt-2 text-center text-gray-500 italic dark:text-gray-400">
          Updated Jan 01, 2024
        </p>
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Introduction:
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            At Trounce, we respect your privacy and are committed to protecting
            it. This Privacy Policy outlines how we collect, use, and safeguard
            your personal information when you visit our website.
          </p>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            We collect personal data such as your name, email address, and
            browsing behavior to enhance your experience and improve our
            services. Your information is securely stored and will not be shared
            without your consent.
          </p>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Our website uses cookies to track visitor behavior and analyze site
            performance. By continuing to browse, you consent to our use of
            cookies. You can manage cookie settings in your browser.
          </p>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            We implement industry-standard security measures to protect your
            data from unauthorized access, loss, or misuse. However, no internet
            transmission is completely secure, so please take precautions when
            sharing personal information.
          </p>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            We do not knowingly collect information from children under the age
            of 13. If you believe a child has provided us with their data,
            please contact us for removal.
          </p>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Third-party services linked to our website may have their own
            privacy policies. We are not responsible for how external sites
            handle your data, so please review their terms before engaging with
            them.
          </p>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            You have the right to request access to, correction, or deletion of
            your personal data. To exercise your rights, contact us through the
            information provided on our website.
          </p>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            We reserve the right to update this Privacy Policy at any time.
            Continued use of our website after changes implies acceptance of the
            modified terms.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
