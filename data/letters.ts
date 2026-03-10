export interface DisputeLetter {
  id: number;
  title: string;
  category: "Bureau" | "Collector" | "Creditor" | "Escalation";
  description: string;
  template: string;
}

export const DISPUTE_LETTERS: DisputeLetter[] = [
  {
    id: 1,
    title: "General Bureau Dispute",
    category: "Bureau",
    description: "Dispute inaccurate information at any credit bureau under the FCRA.",
    template: `[Your Name]
[Address]
[City, State ZIP]
DOB: [Date of Birth]
Last 4 SSN: XXXX
[Date]

[Credit Bureau Name]
[Bureau Address]

Re: Formal Dispute of Inaccurate Information

To Whom It May Concern,

I am writing to formally dispute inaccurate information appearing on my credit report.

Creditor Name: [Creditor Name]
Account Number: [Account Number]
Description of Inaccuracy: [Describe the error clearly]

Under the Fair Credit Reporting Act (FCRA) Section 611, I request a reasonable investigation of this matter and correction or deletion if the information cannot be verified.

Enclosed are copies of supporting documentation.

Please provide written confirmation of the results within 30 days.

Sincerely,
[Signature]
[Printed Name]`,
  },
  {
    id: 2,
    title: "Account Not Mine",
    category: "Bureau",
    description: "Dispute an account that does not belong to you.",
    template: `[Your Name]
[Address]
[City, State ZIP]
[Date]

[Credit Bureau / Creditor Name]
[Address]

Re: Account Not Mine — Dispute

To Whom It May Concern,

The following account appearing on my credit report does not belong to me:

Creditor Name: [Creditor Name]
Account Number: [Account Number]

I request immediate investigation and removal of this account if it cannot be verified as mine.

This letter is not an acknowledgment of any liability.

Sincerely,
[Printed Name]`,
  },
  {
    id: 3,
    title: "Incorrect Balance",
    category: "Bureau",
    description: "Correct an inaccurate balance being reported on your account.",
    template: `[Your Name]
[Address]
[City, State ZIP]
[Date]

[Credit Bureau / Creditor Name]
[Address]

Re: Incorrect Balance Reporting

To Whom It May Concern,

The balance reported on the following account is inaccurate:

Creditor Name: [Creditor Name]
Account Number: [Account Number]

My records indicate a balance of $[Correct Amount], not $[Reported Amount] as currently shown.

Please investigate and update accordingly.

Sincerely,
[Printed Name]`,
  },
  {
    id: 4,
    title: "Duplicate Account",
    category: "Bureau",
    description: "Remove an account that is being reported more than once.",
    template: `[Your Name]
[Address]
[City, State ZIP]
[Date]

[Credit Bureau Name]
[Bureau Address]

Re: Duplicate Account Reporting

To Whom It May Concern,

The following account appears multiple times on my credit report:

Creditor Name: [Creditor Name]
Account Number: [Account Number]

Please remove the duplicate reporting and ensure this account is listed only once across my credit file.

Sincerely,
[Printed Name]`,
  },
  {
    id: 5,
    title: "Incorrect Personal Info",
    category: "Bureau",
    description: "Correct wrong addresses, names, or employer information in your file.",
    template: `[Your Name]
[Address]
[City, State ZIP]
[Date]

[Credit Bureau Name]
[Bureau Address]

Re: Incorrect Personal Information

To Whom It May Concern,

The following personal information on my credit file is inaccurate:

Incorrect Item: [Incorrect Address / Name / Employer]
Correct Information: [Your Correct Information]

Please update my file to reflect accurate information. Enclosed are supporting documents for verification.

Sincerely,
[Printed Name]`,
  },
  {
    id: 6,
    title: "Debt Validation Request",
    category: "Collector",
    description: "Require a collector to validate a debt before you take any action.",
    template: `[Your Name]
[Address]
[City, State ZIP]
[Date]

[Collection Agency Name]
[Agency Address]

Re: Request for Debt Validation

To Whom It May Concern,

Please provide documentation verifying the following:

• Name and address of the original creditor
• Amount owed and how it was calculated
• Proof that I am legally responsible for this debt
• Copy of any original agreement bearing my signature

Until proper validation is provided, I request that you cease all collection activity and cease all credit reporting.

This request is made pursuant to the Fair Debt Collection Practices Act (FDCPA) 15 U.S.C. § 1692g.

Sincerely,
[Printed Name]`,
  },
  {
    id: 7,
    title: "Cease Communication",
    category: "Collector",
    description: "Legally stop a collector from contacting you.",
    template: `[Your Name]
[Address]
[City, State ZIP]
[Date]

[Collection Agency Name]
[Agency Address]

Re: Cease Communication Request

To Whom It May Concern,

I request that you immediately cease all communication with me regarding any debt you claim I owe.

As permitted under the Fair Debt Collection Practices Act (FDCPA) 15 U.S.C. § 1692c(c), any further contact should be limited to legally required notices only.

Sincerely,
[Printed Name]`,
  },
  {
    id: 8,
    title: "Settlement Offer",
    category: "Creditor",
    description: "Offer a partial payment to settle and close an account.",
    template: `[Your Name]
[Address]
[City, State ZIP]
[Date]

[Creditor / Collection Agency Name]
[Address]

Re: Settlement Offer

To Whom It May Concern,

I am offering $[Settlement Amount] as full and final settlement of the account listed below, contingent upon written agreement that the account will be marked "Settled in Full" and no further collection activity will occur.

Creditor Name: [Creditor Name]
Account Number: [Account Number]

Please confirm acceptance of this offer in writing before I submit payment.

Sincerely,
[Printed Name]`,
  },
  {
    id: 9,
    title: "Pay-for-Delete Request",
    category: "Collector",
    description: "Negotiate complete removal from all bureaus in exchange for payment.",
    template: `[Your Name]
[Address]
[City, State ZIP]
[Date]

[Collector Name]
[Collector Address]

Re: Pay-for-Delete Proposal

To Whom It May Concern,

I am willing to pay $[Offer Amount] in exchange for your written confirmation that this account will be permanently removed from all three credit reporting agencies (Experian, Equifax, and TransUnion) upon payment.

Creditor Name: [Creditor Name]
Account Number: [Account Number]

Please provide written acceptance before I submit any payment. I will not make payment without a signed agreement.

Sincerely,
[Printed Name]`,
  },
  {
    id: 10,
    title: "Goodwill Late Payment",
    category: "Creditor",
    description: "Request removal of an accurately reported late payment as a goodwill gesture.",
    template: `[Your Name]
[Address]
[City, State ZIP]
[Date]

[Creditor Name]
[Creditor Address]

Re: Goodwill Adjustment Request

To Whom It May Concern,

I am respectfully requesting consideration of removing the late payment reported on my account as a goodwill adjustment.

Account Number: [Account Number]
Date of Late Payment: [Date]

I value our relationship and have maintained a positive payment history overall. The late payment occurred due to [brief explanation], which is not representative of my usual financial habits.

Your courtesy in this matter would be greatly appreciated.

Sincerely,
[Printed Name]`,
  },
  {
    id: 11,
    title: "Paid Collection Update",
    category: "Bureau",
    description: "Update the status of a paid collection account to reflect accurate reporting.",
    template: `[Your Name]
[Address]
[City, State ZIP]
[Date]

[Credit Bureau or Collector Name]
[Address]

Re: Paid Account Status Update

To Whom It May Concern,

This account has been paid in full. Please update all reporting to reflect the accurate paid status.

Creditor Name: [Creditor Name]
Account Number: [Account Number]
Date of Payment: [Date]

Proof of payment is attached.

Sincerely,
[Printed Name]`,
  },
  {
    id: 12,
    title: "Method of Verification",
    category: "Escalation",
    description: "Request the exact method used to verify a disputed item that was confirmed.",
    template: `[Your Name]
[Address]
[City, State ZIP]
[Date]

[Credit Bureau Name]
[Bureau Address]

Re: Method of Verification Request

To Whom It May Concern,

I previously submitted a dispute regarding the following item:

Creditor Name: [Creditor Name]
Account Number: [Account Number]

Your bureau has indicated that this item was verified. I formally request the specific method used to verify this information as permitted under the FCRA.

Please provide this information in writing within 15 days.

Sincerely,
[Printed Name]`,
  },
  {
    id: 13,
    title: "Follow-Up Investigation",
    category: "Escalation",
    description: "Follow up on a dispute that has not received a response.",
    template: `[Your Name]
[Address]
[City, State ZIP]
[Date]

[Credit Bureau Name]
[Bureau Address]

Re: Follow-Up on Unresolved Dispute

To Whom It May Concern,

I submitted a formal dispute on [Date of Original Dispute] regarding the following item, but I have not received a response within the required 30-day period:

Creditor Name: [Creditor Name]
Account Number: [Account Number]

Please advise on the status of my dispute immediately. Failure to respond within the FCRA's required timeframe is a violation of federal law.

Sincerely,
[Printed Name]`,
  },
  {
    id: 14,
    title: "Bureau Escalation",
    category: "Escalation",
    description: "Escalate a persistent reporting error to bureau executive level.",
    template: `[Your Name]
[Address]
[City, State ZIP]
[Date]

[Credit Bureau Executive Office]
[Bureau Address]

Re: Escalation of Ongoing Reporting Issue

To Whom It May Concern,

Despite multiple formal disputes, the following inaccurate information continues to appear on my credit report:

Creditor Name: [Creditor Name]
Account Number: [Account Number]

I have complied with all FCRA dispute procedures. The bureau's continued reporting of unverified information is a violation of my consumer rights.

I request a formal escalation review, a written response within 15 days, and immediate suppression of this item pending final resolution.

If this is not resolved, I will file a complaint with the Consumer Financial Protection Bureau (CFPB) and seek legal counsel.

Sincerely,
[Printed Name]`,
  },
  {
    id: 15,
    title: "Identity Theft Dispute",
    category: "Escalation",
    description: "Report fraudulent accounts opened through identity theft.",
    template: `[Your Name]
[Address]
[City, State ZIP]
[Date]

[Credit Bureau / Furnisher Name]
[Address]

Re: Identity Theft — Fraudulent Account Dispute

To Whom It May Concern,

I am a victim of identity theft. The following account was opened fraudulently without my knowledge or consent:

Creditor Name: [Creditor Name]
Account Number: [Account Number]

I request immediate blocking of this fraudulent information under FCRA Section 605B.

Enclosed are copies of:
• Government-issued ID
• Proof of address
• FTC Identity Theft Report (filed at IdentityTheft.gov)
• Police report (if applicable)

Please block this account and send written confirmation within 4 business days.

Sincerely,
[Printed Name]`,
  },
];

export const getCategoryColor = (category: DisputeLetter["category"]): string => {
  switch (category) {
    case "Bureau": return "#00C8FF";
    case "Collector": return "#FF4757";
    case "Creditor": return "#D4AF37";
    case "Escalation": return "#FF6B35";
    default: return "#94A3B8";
  }
};
