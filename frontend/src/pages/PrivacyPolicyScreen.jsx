import { useState } from "react";
import { Link } from "react-router-dom";

const policyContent = [
  {
    section: 1,
    title: "Information We Collect",
    subsections: [
      {
        subtitle: "1.1 Personal Identification Information",
        content:
          "We may collect personal identification information from you when you visit our Website, register an account, place an order, subscribe to our newsletter, respond to a survey, or fill out a form. The personal identification information we collect may include your name, email address, mailing address, phone number, and payment details.",
      },
      {
        subtitle: "1.2 Non-personal Identification Information",
        content:
          "We may collect non-personal identification information about you whenever you interact with our Website. This may include the browser name, type of computer or device, operating system, Internet service provider, and other similar information.",
      },
    ],
  },
  {
    section: 2,
    title: "How We Use Collected Information",
    subsections: [
      {
        subtitle: "2.1 Purpose of Information",
        content:
          "We collect and use your personal identification information for the following purposes: To process and fulfill your orders; To communicate with you regarding your purchases and deliveries; To personalize your experience and provide you with personalized shopping recommendations; To improve our customer service and respond to your requests; To send periodic emails regarding your orders or to provide you with marketing and promotional materials.",
      },
      {
        subtitle: "2.2 Non-personal Use",
        content:
          "We may use non-personal identification information for system administration, troubleshooting, statistical analysis, and to improve the overall functionality and performance of the Website.",
      },
    ],
  },
  {
    section: 3,
    title: "How We Protect Your Information",
    subsections: [
      {
        subtitle: "3.1 Data Protection",
        content:
          "We adopt appropriate data collection, storage, and processing practices and security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information, username, password, transaction information, and data stored on our Website.",
      },
      {
        subtitle: "3.2 Encryption Technology",
        content:
          "We use industry-standard Secure Sockets Layer (SSL) technology to encrypt sensitive information transmitted between your browser and our Website.",
      },
    ],
  },
  {
    section: 4,
    title: "Sharing Your Personal Information",
    subsections: [
      {
        subtitle: "4.1 Information Sharing",
        content:
          "We do not sell, trade, or rent your personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners, trusted affiliates, and advertisers.",
      },
      {
        subtitle: "4.2 Disclosure in Specific Situations",
        content:
          "We may disclose your personal identification information in the following situations: To third-party service providers to assist us in operating our business and providing services to you; To comply with applicable laws, regulations, legal processes, or enforceable governmental requests.",
      },
    ],
  },
  {
    section: 5,
    title: "Third-Party Websites",
    subsections: [
      {
        subtitle: "5.1 External Links",
        content:
          "You may find advertising or other content on our Website that links to the sites and services of our partners, suppliers, advertisers, sponsors, licensors, and other third parties. We do not control the content or links that appear on these sites and are not responsible for the practices employed by websites linked to or from our Website.",
      },
      {
        subtitle: "5.2 Third-Party Policies",
        content:
          "Browsing and interaction on any other website, including websites that have a link to our Website, are subject to that website's own terms and policies. We encourage you to review the privacy policies of any third-party websites you visit.",
      },
    ],
  },
  {
    section: 6,
    title: "Changes to This Privacy Policy",
    subsections: [
      {
        subtitle: "6.1 Policy Updates",
        content:
          "We reserve the right to update or change this Privacy Policy at any time. When we do, we will provide notice of the changes by updating the 'Last Updated' date of this Privacy Policy.",
      },
    ],
  },
];

const PrivacyPolicyScreen = () => {
  return (
    <div className="bg-white">
      {/* Hero Banner */}
      <section className="relative h-64 md:h-80 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=85)",
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white">
          <h1 className="text-5xl md:text-6xl font-serif font-bold drop-shadow-lg mb-4">
            Privacy Policy
          </h1>
          <div className="flex items-center gap-2">
            <Link to="/" className="hover:text-rose-200 transition">
              Home
            </Link>
            <span>/</span>
            <span className="text-rose-200">Privacy Policy</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div>
          {/* Main Content Area */}
          <div>
            {/* Introduction */}
            <div className="mb-12 pb-8 border-b border-stone-200">
              <p className="text-stone-600 leading-relaxed">
                This Privacy Policy governs the manner in which BeautyBliss
                collects, uses, maintains, and discloses information collected
                from users ("you" or "your") of the BeautyBliss website (the
                "Website"). This Privacy Policy applies to the Website and all
                products and services offered by BeautyBliss.
              </p>
            </div>

            {/* Policy Sections */}
            <div className="space-y-12">
              {policyContent.map((section) => (
                <div key={section.section} className="pb-8 border-b border-stone-200 last:border-b-0">
                  <div className="mb-6 flex items-start gap-4">
                    <span className="text-3xl font-bold text-rose-600">
                      {section.section}.
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold text-stone-900 pt-1">
                      {section.title}
                    </h2>
                  </div>

                  <div className="space-y-6 ml-10">
                    {section.subsections.map((subsection, idx) => (
                      <div key={idx}>
                        <h3 className="font-bold text-stone-900 mb-3">
                          {subsection.subtitle}
                        </h3>
                        <p className="text-stone-600 leading-relaxed text-sm">
                          {subsection.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicyScreen;
