import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

export const metadata = getSEOTags({
  title: `Privacy Policy | ${config.appName}`,
  canonicalUrlRelative: "/privacy-policy",
});

const PrivacyPolicy = () => {
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
          </svg>{" "}
          Back
        </Link>
        <h1 className="text-3xl font-extrabold pb-6">
          Privacy Policy for {config.appName}
        </h1>

        <pre
          className="leading-relaxed whitespace-pre-wrap"
          style={{ fontFamily: "sans-serif" }}
        >
          {`Last Updated: 2024-05-18

Welcome to ConvertPopup ("we", "our", "us"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website ConvertPopup.co and use our services. By using our website and services, you agree to the collection and use of information in accordance with this policy.

1. Information We Collect

Personal Data:
We collect personal information that you voluntarily provide to us when you register on the website, subscribe to our services, or contact us. This includes:

Name
Email address
Payment information
Non-Personal Data:
We also collect non-personal information automatically as you navigate through our site. This information may include:

Web cookies
IP address
Browser type and version
Operating system
Referring URLs
Page views and site navigation patterns
2. How We Use Your Information

We use the information we collect in the following ways:

To provide, operate, and maintain our website and services
To improve, personalize, and expand our website and services
To understand and analyze how you use our website and services
To process your transactions and manage your subscriptions
To communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes
To send you emails
To find and prevent fraud
To comply with legal obligations
3. Sharing Your Information

We do not sell, trade, or otherwise transfer to outside parties your personal information, except in the following situations:

With service providers who assist us in operating our website and services, conducting our business, or serving our users, so long as those parties agree to keep this information confidential
To comply with legal obligations, such as responding to subpoenas, court orders, or other legal processes
To protect and defend our rights or property, and to investigate and prevent any wrongdoing in connection with our services
In connection with a merger, acquisition, or sale of all or a portion of our assets
4. Cookies and Tracking Technologies

We use cookies and similar tracking technologies to track the activity on our website and store certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.

5. Data Security

We implement a variety of security measures to maintain the safety of your personal information when you enter, submit, or access your personal information. However, no method of transmission over the Internet, or method of electronic storage, is 100% secure, and we cannot guarantee its absolute security.

6. Third-Party Links

Our website may contain links to other sites that are not operated by us. If you click on a third-party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.

7. Children's Privacy

Our website and services are not intended for anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us. If we discover that a child under 13 has provided us with personal information, we will delete such information from our servers immediately.

8. Changes to This Privacy Policy

We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Effective Date" at the top. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.

9. Contact Us

If you have any questions about this Privacy Policy, please contact us at:

Email: mirzabiz2000@gmail.com

By using ConvertPopup, you consent to the terms of this Privacy Policy.`}
        </pre>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
