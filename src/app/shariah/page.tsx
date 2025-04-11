"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle, LockKeyhole, HandCoins } from "lucide-react";

export default function Shariah() {
  return (
    <div className="container mx-auto pt-24 pb-8 p-6 min-h-screen">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            Shariah Compliancy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            <strong>Effective Date:</strong> 7/3/2025
          </p>

          {/* Shariah Principles Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card className="p-4 bg-gray-50 border">
              <div className="flex flex-col items-start gap-2">
                <CheckCircle className="text-green-600 w-6 h-6" />
                <h3 className="font-semibold">Purpose of Funds</h3>
                <p className="text-sm text-gray-700">
                  Only Halal causes and 8 Asnaf categories for Zakat. Projects
                  are screened to avoid riba, gambling, or unethical practices.
                </p>
              </div>
            </Card>

            <Card className="p-4 bg-gray-50 border">
              <div className="flex flex-col items-start gap-2">
                <LockKeyhole className="text-blue-600 w-6 h-6" />
                <h3 className="font-semibold">Transparency & Accountability</h3>
                <p className="text-sm text-gray-700">
                  Full traceability via blockchain. Every transaction is
                  verifiable and public to ensure <em>Amanah</em> and{" "}
                  <em>‘Adl</em>.
                </p>
              </div>
            </Card>

            <Card className="p-4 bg-gray-50 border">
              <div className="flex flex-col items-start gap-2">
                <HandCoins className="text-yellow-600 w-6 h-6" />
                <h3 className="font-semibold">Service Fee Ethics</h3>
                <p className="text-sm text-gray-700">
                  A clear 2% fee funds platform operations. Never taken from
                  Zakat unless explicitly permitted by the donor.
                </p>
              </div>
            </Card>
          </div>

          {/* Full Text Details */}
          <h2 className="text-lg font-semibold mt-8">1. Purpose of Funds</h2>
          <p>
            Donations only go to causes that are Halal and permissible in Islam,
            in accordance with the principles of Shariah. For Zakat donations,
            we strictly follow the distribution guidelines for the eight
            categories of Asnaf as outlined in Surah At-Tawbah (9:60). Projects
            are vetted and verified to ensure funds are not used for activities
            involving riba (interest), gambling, or unethical practices.
          </p>

          <h2 className="text-lg font-semibold mt-4">
            2. Transparency and Accountability
          </h2>
          <p>
            Upholding the Islamic principle of <strong>Amanah</strong> (trust),
            all transactions and fund movements are recorded on the blockchain
            to ensure full transparency. Donors can trace where their funds go,
            how much is collected, and to whom it is distributed — ensuring no
            hidden intermediaries or unjust enrichment. The immutable ledger
            guarantees honesty, justice (<strong>‘Adl</strong>), and
            transparency in line with Islamic ethics.
          </p>

          <h2 className="text-lg font-semibold mt-4">
            3. Collection of Fee for Platform's Services
          </h2>
          <p>
            A modest 2% service fee is applied solely to support the operational
            and technical costs of maintaining this platform, including
            verification processes, blockchain infrastructure, and security. In
            Shariah, it is permissible to charge for{" "}
            <strong>legitimate services rendered</strong> as long as it is fair,
            disclosed upfront, and does not exploit the donor or recipient. This
            fee is not taken from the donation amount unless the donor
            explicitly agrees. For Zakat contributions, the fee is kept entirely
            separate, respecting the obligation that Zakat must be delivered in
            full to eligible Asnaf.
          </p>
          <p className="mt-2">
            Our fee structure follows Shariah principles such as{" "}
            <strong>clarity in contracts (Bay‘ al-Sarīh)</strong>,{" "}
            <strong>no ambiguity (Gharar)</strong>, and{" "}
            <strong>no unjust gain (Maysir)</strong>. Donors are fully informed,
            and their consent is obtained — ensuring the entire process is halal
            and ethical.
          </p>

          {/* FAQ Section */}
          <h2 className="text-lg font-semibold mt-8">
            Frequently Asked Questions
          </h2>

          <div className="mt-4 grid grid-cols-1 gap-4">
            <Card className="p-4">
              <CardHeader className="p-0 pb-2">
                <CardTitle className="text-base font-semibold">
                  Is it Halal to charge a fee on donations?
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-sm text-gray-700">
                Yes. According to Islamic finance principles, charging a fee for
                services like verification, security, and platform upkeep is
                permissible as long as it’s fair, disclosed, and doesn’t impact
                the integrity of the donation. For Zakat, we keep the fee
                separate unless the donor agrees to cover it.
              </CardContent>
            </Card>

            <Card className="p-4">
              <CardHeader className="p-0 pb-2">
                <CardTitle className="text-base font-semibold">
                  Do you take a cut from Zakat?
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-sm text-gray-700">
                No. Zakat must be given in full to the 8 eligible groups. We
                only charge a platform fee with donor consent, or offer donors
                the option to pay the fee separately.
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
