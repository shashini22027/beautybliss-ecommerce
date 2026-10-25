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
          "Depending on how you use BeautyBliss, we collect account details such as your name and email; contact and delivery details; order, wishlist, saved skincare routine, and appointment information; newsletter preferences; and messages or comments you submit. Card numbers and CVVs are entered into Stripe's payment interface. BeautyBliss stores order and payment status details, not raw card numbers or CVVs.",
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
          "We use this information to operate your account, save addresses and skincare routines, process orders and payments, provide delivery updates, respond to support requests, manage consultation requests and reminders, publish comments you submit, and send newsletters when you subscribe. Consultation suggestions are cosmetic guidance and are not a medical assessment.",
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
          "Account passwords are stored as salted password hashes. The application uses service providers for database hosting, payment processing, email, and image storage. No online service can guarantee absolute security; use a unique password and contact support if you suspect account misuse.",
      },
      {
        subtitle: "3.2 Encryption Technology",
        content:
          "The live site should be accessed over HTTPS. Local development may use HTTP. Stripe handles card entry and payment processing through its payment interface; BeautyBliss does not store raw card numbers or CVVs.",
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
          "BeautyBliss uses service providers needed to run the store, including Stripe for payments, database and hosting providers, email delivery, and image storage. They process information needed to provide those services. We do not use consultation photos for advertising or clinical analysis.",
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
  {
    section: 7,
    title: "Photos, Browser Storage, and Comments",
    subsections: [
      {
        subtitle: "7.1 Virtual Makeup Preview",
        content: "If you choose the virtual makeup preview, camera frames or a selected photo are processed in your browser for the visual preview. The preview does not upload the photo to BeautyBliss, does not analyze skin health, and does not guarantee an exact shade. You can remove the selected image by resetting or closing the preview.",
      },
      {
        subtitle: "7.2 Browser Storage and Public Comments",
        content: "The site uses browser storage to keep local shopping and session preferences. Guest shopping data may stay on the device you use. Blog comments display the name and comment you submit publicly; do not include private information in a comment.",
      },
    ],
  },
  {
    section: 8,
    title: "Your Choices and Privacy Requests",
    subsections: [
      {
        subtitle: "8.1 Access, Correction, and Deletion Requests",
        content: "You can edit account details, saved addresses, and saved routines from My Account. For help accessing or correcting other information, or to request account deletion, contact BeautyBliss through the Contact page. Some transaction or support records may need to be retained to manage orders and resolve disputes.",
      },
      {
        subtitle: "8.2 Newsletter Preferences",
        content: "Newsletter sign-ups are recorded so BeautyBliss can manage subscription requests. To change or remove a subscription, contact us through the Contact page. Order, appointment, and account service messages may still be sent when needed to provide the requested service.",
      },
    ],
  },
];

const PrivacyPolicyScreen = () => {
  return (
    <div className="bg-white">
      {/* Hero Banner */}
      <section className="bb-page-title-banner flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url(/images/banner.jpg)",
          }}
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 flex w-full items-center justify-center text-white">
          <h1>
            Privacy Policy
          </h1>
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
