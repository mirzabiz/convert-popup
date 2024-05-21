import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";


export const metadata = getSEOTags({
  title: `Terms and Conditions | ${config.appName}`,
  canonicalUrlRelative: "/tos",
});

const TOS = () => {
  return (
    <main className="max-w-xl mx-auto">
      <div className="p-5">
        <Link href="/" className="btn btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z"
              clipRule="evenodd"
            />
          </svg>
          Back
        </Link>
        <h1 className="text-3xl font-extrabold pb-6">
          Terms and Conditions for {config.appName}
        </h1>

        <pre
          className="leading-relaxed whitespace-pre-wrap"
          style={{ fontFamily: "sans-serif" }}
        >
          {`Last Updated: May 18, 2024

Welcome to ConvertPopup ("Service"), provided by ConvertPopup. By using the Service, you agree to be bound by the following terms and conditions (the "Terms of Service"). If you do not agree to these Terms of Service, please do not use the Service.

Use of the Service
The Service allows users to increase their conversion rate by showing recent transactions in a popup. Users are granted a license to use the Service for personal or commercial use, including integrating the Service into their own websites, provided that they comply with the terms and conditions of the Service.

Subscription and Payment
ConvertPopup operates on a subscription-based model. Users will provide their Stripe API key and add the widget to their website. Payment information, including name, email, and payment details, will be collected and securely stored.

Data Collection
ConvertPopup collects both personal and non-personal data. Personal data includes name, email, and payment information. Non-personal data includes web cookies.

Modification and Discontinuation of Service
ConvertPopup reserves the right to modify or discontinue the Service, or any portion thereof, at any time without notice. ConvertPopup will not be liable to you or any third party for any modification, suspension, or discontinuation of the Service.

Limitation of Liability
ConvertPopup will not be liable for any damages arising out of or in connection with your use of the Service, including but not limited to direct, indirect, incidental, special, consequential, or punitive damages, regardless of the form of action or the basis of the claim, even if ConvertPopup has been advised of the possibility of such damages. Some jurisdictions do not allow the exclusion or limitation of incidental or consequential damages, so this limitation and exclusion may not apply to you.

Warranty Disclaimer
The Service is provided "as is" and ConvertPopup makes no warranties, express or implied, including but not limited to implied warranties of merchantability and fitness for a particular purpose. ConvertPopup does not warrant that the Service will be uninterrupted or error-free, and will not be liable for any interruptions or errors. ConvertPopup does not endorse, warrant, or guarantee any third-party content or service that may be accessed through the Service.

Indemnification
You agree to indemnify and hold ConvertPopup, its directors, officers, employees, agents, and assigns, harmless from any claims, losses, damages, liabilities, and expenses (including reasonable attorneys' fees) arising out of or in connection with your use of the Service, or any violation of these Terms of Service.

Governing Law
These Terms of Service shall be governed by the laws of France without giving effect to any principles of conflicts of law. Any disputes arising out of or in connection with these Terms of Service will be resolved in the courts of France.

Updates to the Terms
ConvertPopup may update these Terms of Service from time to time. Users will be notified of any changes by email.

Contact Us
For any questions or concerns regarding the Service or these Terms of Service, please contact us at mirzabiz2000@gmail.com.
`}
        </pre>
      </div>
    </main>
  );
};

export default TOS;
