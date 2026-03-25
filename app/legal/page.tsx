import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Legal — TrailView",
  description:
    "TrailView terms of service, privacy policy, contributor agreement, and legal information.",
};

const LAST_UPDATED = "March 25, 2026";

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 bg-green-500 rounded-lg flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-brand-dark">TRAILVIEW</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-brand-dark mb-2">Legal</h1>
          <p className="text-gray-500 text-sm">Last updated: {LAST_UPDATED}</p>
        </div>

        {/* Quick nav */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Jump to</h2>
          <div className="flex flex-wrap gap-2">
            {[
              { id: "terms", label: "Terms of Service" },
              { id: "privacy", label: "Privacy Policy" },
              { id: "eula", label: "EULA" },
              { id: "contributor", label: "Contributor Agreement" },
              { id: "waiver", label: "Liability Waiver" },
              { id: "copyright", label: "Copyright & DMCA" },
              { id: "disclaimer", label: "Disclaimer" },
            ].map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-brand-dark/5 text-brand-dark hover:bg-brand-dark/10 transition-colors"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          {/* ──────────────────── TERMS OF SERVICE ──────────────────── */}
          <Section id="terms" title="Terms of Service">
            <H3>1. Acceptance of Terms</H3>
            <P>
              By accessing or using TrailView (&quot;the Platform&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, you must not use the Platform. We reserve the right to modify these Terms at any time. Continued use of the Platform after changes constitutes acceptance of the modified Terms.
            </P>

            <H3>2. Eligibility</H3>
            <P>
              You must be at least 18 years of age to create an account or upload content. By using the Platform, you represent and warrant that you meet this age requirement and have the legal capacity to enter into a binding agreement.
            </P>

            <H3>3. User Accounts</H3>
            <P>
              You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You agree to notify TrailView immediately of any unauthorized use of your account. TrailView is not liable for any loss arising from unauthorized access to your account.
            </P>

            <H3>4. Acceptable Use</H3>
            <P>You agree not to:</P>
            <UL>
              <li>Upload content that is illegal, harmful, threatening, defamatory, obscene, or otherwise objectionable</li>
              <li>Impersonate any person or entity or misrepresent your affiliation</li>
              <li>Interfere with or disrupt the Platform or its infrastructure</li>
              <li>Attempt to gain unauthorized access to any part of the Platform</li>
              <li>Use the Platform for any commercial purpose not expressly authorized by TrailView</li>
              <li>Upload content that infringes on any third party&apos;s intellectual property rights</li>
              <li>Upload misleading trail data that could endanger other users</li>
            </UL>

            <H3>5. Content Moderation</H3>
            <P>
              TrailView reserves the right to review, approve, reject, or remove any content uploaded to the Platform at our sole discretion. Content that violates these Terms, is inaccurate, or is deemed unsafe will be removed without notice.
            </P>

            <H3>6. Termination</H3>
            <P>
              We may suspend or terminate your account at any time, with or without cause and with or without notice. Upon termination, your right to use the Platform ceases immediately. Provisions that by their nature should survive termination will remain in effect.
            </P>

            <H3>7. Governing Law</H3>
            <P>
              These Terms are governed by and construed in accordance with the laws of the Province of British Columbia, Canada. Any disputes arising from these Terms shall be resolved in the courts of British Columbia.
            </P>
          </Section>

          {/* ──────────────────── PRIVACY POLICY ──────────────────── */}
          <Section id="privacy" title="Privacy Policy">
            <H3>1. Information We Collect</H3>
            <P>We collect the following types of information:</P>
            <UL>
              <li><strong>Account information:</strong> name, email address, password (hashed), selected activities, and home region</li>
              <li><strong>Uploaded content:</strong> GPX files, video links, trail metadata, and descriptions</li>
              <li><strong>Usage data:</strong> pages visited, features used, timestamps, and device/browser information</li>
              <li><strong>Location data:</strong> GPS coordinates contained within uploaded GPX files</li>
            </UL>

            <H3>2. How We Use Your Information</H3>
            <UL>
              <li>To operate and improve the Platform</li>
              <li>To display trail content to other users</li>
              <li>To process contributor earnings and payments</li>
              <li>To communicate with you about your account and submissions</li>
              <li>To enforce our Terms of Service and protect Platform integrity</li>
              <li>To comply with legal obligations</li>
            </UL>

            <H3>3. Information Sharing</H3>
            <P>
              We do not sell your personal information. We may share information with: service providers who assist in operating the Platform; law enforcement when required by law; and other users (limited to your public profile and uploaded trail content).
            </P>

            <H3>4. Data Retention</H3>
            <P>
              We retain your personal information for as long as your account is active or as needed to provide services. You may request deletion of your account and associated data by contacting us. Some data may be retained as required by law or for legitimate business purposes.
            </P>

            <H3>5. Data Security</H3>
            <P>
              We implement reasonable technical and organizational measures to protect your personal information. However, no method of transmission or storage is 100% secure, and we cannot guarantee absolute security.
            </P>

            <H3>6. Your Rights</H3>
            <P>You have the right to:</P>
            <UL>
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your personal information</li>
              <li>Withdraw consent for data processing</li>
              <li>Export your data in a portable format</li>
            </UL>

            <H3>7. Cookies</H3>
            <P>
              The Platform may use cookies and similar technologies to enhance your experience, analyze usage, and remember preferences. You can control cookie settings through your browser.
            </P>
          </Section>

          {/* ──────────────────── EULA ──────────────────── */}
          <Section id="eula" title="End User License Agreement (EULA)">
            <H3>1. License Grant</H3>
            <P>
              TrailView grants you a limited, non-exclusive, non-transferable, revocable license to access and use the Platform for personal, non-commercial purposes in accordance with these terms.
            </P>

            <H3>2. Restrictions</H3>
            <P>You may not:</P>
            <UL>
              <li>Copy, modify, distribute, or create derivative works of the Platform or its content</li>
              <li>Reverse engineer, decompile, or disassemble any part of the Platform</li>
              <li>Use automated systems (bots, scrapers, etc.) to access the Platform</li>
              <li>Download, record, or redistribute trail videos or GPS data without express written permission</li>
              <li>Remove or alter any proprietary notices, labels, or marks on the Platform</li>
              <li>Sublicense, lease, or lend your access to any third party</li>
            </UL>

            <H3>3. Intellectual Property</H3>
            <P>
              The Platform, including its design, code, logos, and branding, is the intellectual property of TrailView. Trail content (videos, GPX data) remains the property of respective contributors, licensed to TrailView as described in the Contributor Agreement.
            </P>

            <H3>4. Updates and Modifications</H3>
            <P>
              TrailView may update, modify, or discontinue the Platform or any features at any time without prior notice. We are not obligated to provide support, maintenance, or updates.
            </P>

            <H3>5. Limitation of Liability</H3>
            <P>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, TRAILVIEW SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE PLATFORM, INCLUDING BUT NOT LIMITED TO LOSS OF DATA, LOSS OF PROFITS, OR PERSONAL INJURY.
            </P>
          </Section>

          {/* ──────────────────── CONTRIBUTOR AGREEMENT ──────────────────── */}
          <Section id="contributor" title="Contributor Agreement">
            <H3>1. Content Ownership</H3>
            <P>
              You retain ownership of all content you upload to TrailView, including video footage and GPX data. By uploading content, you grant TrailView a worldwide, non-exclusive, royalty-free license to use, display, distribute, and create derivative works from your content for the purpose of operating the Platform.
            </P>

            <H3>2. Content Requirements</H3>
            <P>By uploading content, you represent and warrant that:</P>
            <UL>
              <li>You are the original creator of the content or have all necessary rights and permissions</li>
              <li>The content does not infringe on any third party&apos;s intellectual property, privacy, or other rights</li>
              <li>The content accurately represents the trail as filmed and the GPX data matches the video</li>
              <li>The content does not depict illegal activity, trespassing, or unsafe behaviour encouraged for others to replicate</li>
              <li>You had permission or legal right to access and film the trail depicted</li>
              <li>All people visible in the video have consented to being filmed and published</li>
            </UL>

            <H3>3. Revenue Share</H3>
            <P>
              Contributors may be eligible for revenue sharing based on views of their content. Revenue share rates are determined by TrailView and may change at any time. Current tiers are displayed on the Contribute page and are subject to modification. TrailView reserves the right to adjust, suspend, or terminate the revenue share program at any time. Payment of earnings is subject to minimum thresholds and verification requirements.
            </P>

            <H3>4. Content Review</H3>
            <P>
              All uploaded content is subject to review by TrailView before publication. TrailView may reject content for any reason, including but not limited to: quality concerns, safety issues, inaccurate data, duplicate trails, or policy violations. TrailView is under no obligation to publish any submitted content.
            </P>

            <H3>5. Content Removal</H3>
            <P>
              TrailView may remove any contributor content at any time for any reason. Contributors may request removal of their own content. Upon removal, the license granted to TrailView terminates, except for any copies or derivatives already in distribution.
            </P>

            <H3>6. Indemnification</H3>
            <P>
              You agree to indemnify and hold harmless TrailView, its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from your uploaded content or your breach of this Agreement.
            </P>
          </Section>

          {/* ──────────────────── LIABILITY WAIVER ──────────────────── */}
          <Section id="waiver" title="Liability Waiver &amp; Assumption of Risk">
            <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-4">
              <p className="text-red-800 font-semibold text-sm mb-2">IMPORTANT — PLEASE READ CAREFULLY</p>
              <p className="text-red-700 text-sm leading-relaxed">
                This waiver affects your legal rights. By using TrailView, you voluntarily assume all risks associated with outdoor recreational activities depicted on the Platform.
              </p>
            </div>

            <H3>1. Assumption of Risk</H3>
            <P>
              You acknowledge that outdoor recreational activities — including but not limited to mountain biking, motorcycling, ATV/UTV riding, skiing, snowboarding, snowmobiling, hiking, hunting, horseback riding, rock climbing, and all other activities depicted on TrailView — are inherently dangerous and carry significant risks of serious injury, permanent disability, or death. These risks include but are not limited to:
            </P>
            <UL>
              <li>Falls, collisions, and impacts with natural or man-made obstacles</li>
              <li>Equipment failure or malfunction</li>
              <li>Changing or adverse weather conditions</li>
              <li>Wildlife encounters</li>
              <li>Trail conditions that differ from those depicted in videos due to weather, erosion, construction, or other changes</li>
              <li>Getting lost, stranded, or separated from others</li>
              <li>Hypothermia, heat stroke, dehydration, altitude sickness, or other medical emergencies</li>
              <li>Actions of other people on or near trails</li>
            </UL>

            <H3>2. No Guarantee of Accuracy</H3>
            <P>
              TRAILVIEW DOES NOT GUARANTEE THE ACCURACY, COMPLETENESS, OR CURRENCY OF ANY TRAIL INFORMATION, GPS DATA, VIDEO CONTENT, DIFFICULTY RATINGS, OR OTHER INFORMATION ON THE PLATFORM. Trail conditions change constantly. Videos and GPS data represent conditions at the time of recording only. You must independently verify all trail conditions before use.
            </P>

            <H3>3. Not Professional Advice</H3>
            <P>
              Content on TrailView is provided for informational and entertainment purposes only. It does not constitute professional guidance, instruction, or advice for any outdoor activity. You should seek qualified instruction and use appropriate safety equipment for any outdoor activity.
            </P>

            <H3>4. Waiver and Release</H3>
            <P>
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, YOU HEREBY WAIVE, RELEASE, AND DISCHARGE TRAILVIEW, ITS OWNERS, OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, CONTRIBUTORS, AND AFFILIATES FROM ANY AND ALL LIABILITY, CLAIMS, DEMANDS, OR CAUSES OF ACTION ARISING FROM OR RELATED TO YOUR USE OF THE PLATFORM OR YOUR PARTICIPATION IN ANY ACTIVITY DEPICTED ON THE PLATFORM, INCLUDING BUT NOT LIMITED TO CLAIMS FOR PERSONAL INJURY, DEATH, PROPERTY DAMAGE, OR ECONOMIC LOSS, WHETHER CAUSED BY NEGLIGENCE OR OTHERWISE.
            </P>

            <H3>5. Indemnification</H3>
            <P>
              You agree to indemnify and hold harmless TrailView and its affiliates from any claims, damages, losses, or expenses (including legal fees) arising from your use of trail information obtained through the Platform, your outdoor activities, or your violation of these terms.
            </P>

            <H3>6. Medical Fitness</H3>
            <P>
              You represent that you are physically fit and have no medical condition that would prevent safe participation in outdoor activities. You are solely responsible for assessing your own fitness and ability level before attempting any trail depicted on the Platform.
            </P>
          </Section>

          {/* ──────────────────── COPYRIGHT & DMCA ──────────────────── */}
          <Section id="copyright" title="Copyright & DMCA Policy">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-4">
              <p className="text-blue-800 text-sm leading-relaxed">
                TrailView respects the intellectual property rights of others and expects users to do the same. All content on the Platform is protected by copyright law.
              </p>
            </div>

            <H3>1. Platform Copyright</H3>
            <P>
              Copyright 2026 TrailView. All rights reserved. The TrailView name, logo, website design, source code, user interface, and all original content created by TrailView are the exclusive property of TrailView and are protected by Canadian and international copyright laws, trade-mark laws, and other intellectual property laws. No part of the Platform may be reproduced, distributed, modified, or transmitted in any form without prior written consent from TrailView.
            </P>

            <H3>2. Contributor Content Copyright</H3>
            <P>
              Trail videos, GPS/GPX data, photographs, descriptions, and other content uploaded by contributors remain the copyright of their respective creators. Contributors grant TrailView a license to use this content as described in the Contributor Agreement. Unauthorized reproduction, download, recording, redistribution, or commercial use of contributor content is strictly prohibited.
            </P>

            <H3>3. Prohibited Uses</H3>
            <P>The following are expressly prohibited without written authorization:</P>
            <UL>
              <li>Downloading, screen-recording, or capturing trail videos from the Platform</li>
              <li>Extracting, copying, or scraping GPS/GPX data for use outside the Platform</li>
              <li>Reproducing trail descriptions, ratings, or metadata for competing services</li>
              <li>Using TrailView content to train machine learning models or AI systems</li>
              <li>Embedding or framing TrailView content on external websites</li>
              <li>Creating derivative works from any Platform content without permission</li>
              <li>Using automated tools (bots, scrapers, crawlers) to access or collect content</li>
              <li>Removing or altering copyright notices, watermarks, or attribution</li>
            </UL>

            <H3>4. DMCA Takedown Notices</H3>
            <P>
              If you believe that content on TrailView infringes your copyright, you may submit a Digital Millennium Copyright Act (DMCA) takedown notice to our designated agent. Your notice must include:
            </P>
            <UL>
              <li>Identification of the copyrighted work you claim has been infringed</li>
              <li>Identification of the material on TrailView that you claim is infringing, with sufficient detail to locate it</li>
              <li>Your contact information (name, address, phone number, email)</li>
              <li>A statement that you have a good faith belief that the use is not authorized by the copyright owner, its agent, or the law</li>
              <li>A statement, under penalty of perjury, that the information in the notice is accurate and that you are the copyright owner or authorized to act on behalf of the owner</li>
              <li>Your physical or electronic signature</li>
            </UL>
            <P>
              Send DMCA notices to: <span className="font-medium text-brand-dark">dmca@trailview.ca</span>
            </P>

            <H3>5. Counter-Notification</H3>
            <P>
              If you believe your content was removed in error, you may submit a counter-notification including: identification of the removed material and its prior location, a statement under penalty of perjury that the material was removed by mistake or misidentification, your name, address, and phone number, and consent to jurisdiction in the Federal Court of Canada. Counter-notifications should be sent to <span className="font-medium text-brand-dark">dmca@trailview.ca</span>.
            </P>

            <H3>6. Repeat Infringers</H3>
            <P>
              TrailView will terminate the accounts of users who are determined to be repeat copyright infringers. We maintain a policy of acting expeditiously to remove or disable access to infringing material upon receiving valid takedown notices.
            </P>

            <H3>7. Content Licensing &amp; Attribution</H3>
            <P>
              No content on TrailView is licensed under Creative Commons or any open license unless explicitly stated. All rights are reserved by the respective copyright holders. Any use of TrailView content for press, educational, or promotional purposes requires prior written approval. Contact <span className="font-medium text-brand-dark">legal@trailview.ca</span> for licensing inquiries.
            </P>
          </Section>

          {/* ──────────────────── DISCLAIMER ──────────────────── */}
          <Section id="disclaimer" title="General Disclaimer">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 mb-4">
              <p className="text-yellow-800 text-sm leading-relaxed">
                THE PLATFORM AND ALL CONTENT ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
              </p>
            </div>

            <H3>1. No Warranties</H3>
            <P>
              TrailView expressly disclaims all warranties, whether express, implied, or statutory, including but not limited to implied warranties of merchantability, fitness for a particular purpose, accuracy, and non-infringement. We do not warrant that the Platform will be uninterrupted, error-free, or free of harmful components.
            </P>

            <H3>2. Trail Information Disclaimer</H3>
            <P>
              Trail conditions, difficulty ratings, distances, elevation data, and all other trail information are approximate and may be inaccurate. Trails may be closed, rerouted, or significantly altered after content was recorded. Natural events (storms, fires, landslides, flooding) can dramatically change trail conditions without notice. Always check with local authorities and land managers for current trail status before heading out.
            </P>

            <H3>3. Third-Party Content</H3>
            <P>
              The Platform may contain links to third-party websites, videos hosted on external platforms (e.g., YouTube, Google Drive), and content uploaded by independent contributors. TrailView does not endorse, control, or assume responsibility for any third-party content or services.
            </P>

            <H3>4. Limitation of Liability</H3>
            <P>
              IN NO EVENT SHALL TRAILVIEW&apos;S TOTAL LIABILITY TO YOU EXCEED THE AMOUNT YOU HAVE PAID TO TRAILVIEW IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, OR ONE HUNDRED CANADIAN DOLLARS (CAD $100), WHICHEVER IS GREATER.
            </P>

            <H3>5. Severability</H3>
            <P>
              If any provision of these legal documents is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
            </P>

            <H3>6. Contact</H3>
            <P>
              For questions about these legal documents, contact us at: <span className="font-medium text-brand-dark">legal@trailview.ca</span>
            </P>
          </Section>
        </div>
      </div>
    </div>
  );
}

/* ── Shared layout components ── */

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 scroll-mt-24">
      <h2 className="text-xl font-bold text-brand-dark mb-4">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-bold text-gray-800 mt-5 mb-1">{children}</h3>;
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-gray-600 leading-relaxed">{children}</p>;
}

function UL({ children }: { children: React.ReactNode }) {
  return <ul className="list-disc list-inside text-sm text-gray-600 leading-relaxed space-y-1 ml-1">{children}</ul>;
}
