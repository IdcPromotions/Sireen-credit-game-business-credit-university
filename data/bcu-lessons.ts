import { Lesson } from "./lessons";

export const BCU_LESSONS: Lesson[] = [
  {
    id: 101,
    title: "Business Credit Bureaus",
    subtitle: "Understanding Where Business Credit Data Comes From",
    objective:
      "Learn how business credit bureaus collect data and the difference between Dun & Bradstreet, Experian Business, and Equifax Business.",
    isPremium: true,
    isUniversity: true,
    xpReward: 75,
    badge: "Intel Operative",
    badgeIcon: "search",
    missionTip:
      "A business will not automatically appear in all credit bureaus. Strategic credit building requires accounts that report to multiple bureaus.",
    keyTerms: [
      "D-U-N-S Number",
      "PAYDEX Score",
      "Intelliscore Plus",
      "Business Credit Risk Score",
      "Tradeline",
    ],
    content: [
      {
        type: "heading",
        text: "Where Business Credit Information Comes From",
      },
      {
        type: "paragraph",
        text: "Before a business can build or repair its credit profile, the owner must understand where business credit information actually comes from.",
      },
      {
        type: "paragraph",
        text: "Many entrepreneurs assume business credit bureaus create credit profiles automatically. That is not how the system works.",
      },
      {
        type: "paragraph",
        text: "Business credit data is created through reporting sources. These sources send financial activity information to business credit reporting agencies. Those agencies collect, organize, and publish that data into a business credit report.",
      },
      {
        type: "list",
        items: [
          "Business Credit Bureaus",
          "Reporting Vendors and Trade Accounts",
          "Financial Institutions and Lenders",
          "Public Records and Government Filings",
        ],
      },
      {
        type: "heading",
        text: "The Three Major Business Credit Bureaus",
      },
      {
        type: "paragraph",
        text: "Unlike personal credit, which relies on three major bureaus, business credit has several different reporting agencies. The three most influential are Dun & Bradstreet, Experian Business, and Equifax Business.",
      },
      {
        type: "heading",
        text: "Dun & Bradstreet",
      },
      {
        type: "paragraph",
        text: "Dun & Bradstreet (D&B) is one of the oldest and most widely used business credit reporting agencies. Businesses are identified in the D&B system through a unique identifier called a D-U-N-S Number.",
      },
      {
        type: "paragraph",
        text: "D&B calculates several important scores including the PAYDEX Score, Delinquency Predictor Score, and Failure Score. The PAYDEX score is the most widely used and is based largely on vendor payment history.",
      },
      {
        type: "heading",
        text: "Experian Business",
      },
      {
        type: "paragraph",
        text: "Experian Business collects data from banks, credit card companies, trade vendors, leasing companies, and utility providers. Experian produces the Intelliscore Plus, which predicts the likelihood that a business will become delinquent on payments.",
      },
      {
        type: "heading",
        text: "Equifax Business",
      },
      {
        type: "paragraph",
        text: "Equifax Business gathers data from financial institutions, leasing companies, equipment lenders, and public records. Equifax calculates the Business Credit Risk Score.",
      },
      {
        type: "tip",
        text: "A business may have a strong D&B profile but no Experian profile. Strategic credit building requires accounts that report to multiple bureaus.",
      },
    ],
    quiz: [
      {
        id: "101-1",
        question: "Which organization issues the D-U-N-S number?",
        options: ["Experian", "Dun & Bradstreet", "Equifax"],
      },
      {
        id: "101-2",
        question: "What is the most widely used D&B score?",
        options: ["PAYDEX", "Intelliscore", "Business Risk Index"],
      },
      {
        id: "101-3",
        question:
          "Do business credit bureaus create the credit data themselves?",
        options: ["Yes", "No"],
      },
      {
        id: "101-4",
        question: "Which bureau calculates the Intelliscore Plus?",
        options: ["Experian", "Equifax", "D&B"],
      },
      {
        id: "101-5",
        question:
          "Can a business have credit with one bureau but not another?",
        options: ["Yes", "No"],
      },
    ],
  },
  {
    id: 102,
    title: "Reporting Vendors & Tradelines",
    subtitle: "The Foundation of Business Credit",
    objective:
      "Understand how vendor trade accounts create tradelines and why early payments build stronger credit scores.",
    isPremium: true,
    isUniversity: true,
    xpReward: 75,
    missionTip:
      "Not all vendors report to credit bureaus. Always confirm which bureau the vendor reports to and how frequently they report.",
    keyTerms: [
      "Net-30",
      "Net-45",
      "Tradeline",
      "PAYDEX",
      "Reporting Vendor",
    ],
    content: [
      {
        type: "heading",
        text: "What Are Reporting Vendors?",
      },
      {
        type: "paragraph",
        text: "One of the most powerful sources of business credit data comes from reporting vendors, often referred to as trade accounts. Trade vendors are companies that allow businesses to purchase products or services with Net payment terms.",
      },
      {
        type: "list",
        items: ["Net-30: Pay within 30 days", "Net-45: Pay within 45 days", "Net-60: Pay within 60 days"],
      },
      {
        type: "heading",
        text: "Why Vendor Accounts Are Important",
      },
      {
        type: "paragraph",
        text: "Vendor tradelines are often the first accounts used to build business credit. They are easier to obtain because many vendors do not require long business history, large revenue, or personal guarantees.",
      },
      {
        type: "heading",
        text: "Early Payments Build Stronger Scores",
      },
      {
        type: "paragraph",
        text: "Paying invoices before the due date can produce higher PAYDEX scores. Dun & Bradstreet PAYDEX scoring roughly follows this structure: 100 = Early payments, 80 = On-time payments, Below 80 = Late payments.",
      },
      {
        type: "tip",
        text: "One of the biggest mistakes entrepreneurs make is opening vendor accounts that do not report to credit bureaus. If a vendor does not report payment activity, the account does not build business credit.",
      },
      {
        type: "heading",
        text: "Building the Foundation",
      },
      {
        type: "paragraph",
        text: "Most strong business credit profiles start with 5 to 10 vendor tradelines. These tradelines demonstrate that the business can handle credit responsibly, pay suppliers consistently, and maintain financial discipline.",
      },
    ],
    quiz: [
      {
        id: "102-1",
        question: "What is a trade vendor?",
        options: ["A bank", "A supplier offering payment terms", "A credit bureau"],
      },
      {
        id: "102-2",
        question: "What does Net-30 mean?",
        options: ["Pay within 30 days", "Pay immediately", "Pay in 60 days"],
      },
      {
        id: "102-3",
        question: "Do all vendors report payment history?",
        options: ["Yes", "No"],
      },
      {
        id: "102-4",
        question:
          "What type of accounts are usually used first to build business credit?",
        options: ["Bank loans", "Vendor tradelines", "Mortgages"],
      },
      {
        id: "102-5",
        question: "Does paying invoices early improve PAYDEX scores?",
        options: ["Yes", "No"],
      },
    ],
  },
  {
    id: 103,
    title: "Banks & Business Lenders",
    subtitle: "Financial Tradelines That Build Credibility",
    objective:
      "Learn how bank accounts, credit cards, and business loans create financial tradelines and what personal guarantees mean.",
    isPremium: true,
    isUniversity: true,
    xpReward: 75,
    missionTip:
      "Once a business builds strong credit profiles, it may qualify for no-PG financing — a major milestone in business credit development.",
    keyTerms: [
      "Financial Tradeline",
      "Personal Guarantee (PG)",
      "No-PG Financing",
      "Credit Utilization",
      "SBA Loan",
    ],
    content: [
      {
        type: "heading",
        text: "Financial Institutions as Credit Sources",
      },
      {
        type: "paragraph",
        text: "Another major source of business credit information comes from financial institutions including banks, credit card issuers, equipment financing companies, and commercial lenders.",
      },
      {
        type: "list",
        items: [
          "Business credit cards",
          "Lines of credit",
          "Equipment loans",
          "Vehicle financing",
          "SBA loans",
        ],
      },
      {
        type: "heading",
        text: "Why Financial Tradelines Matter",
      },
      {
        type: "paragraph",
        text: "Vendor tradelines help establish the foundation of business credit, but financial tradelines demonstrate larger borrowing capacity. A vendor account might report a $200 payment, but a bank credit card may report a $10,000 limit.",
      },
      {
        type: "heading",
        text: "Personal Guarantee vs No PG",
      },
      {
        type: "paragraph",
        text: "Many business loans require a personal guarantee (PG). A personal guarantee means the owner becomes personally responsible if the business fails to repay the debt. However, once a business builds strong credit profiles, it may qualify for no-PG financing.",
      },
      {
        type: "tip",
        text: "High balances relative to credit limits may increase risk scores. Paying balances consistently improves credit strength.",
      },
    ],
    quiz: [
      {
        id: "103-1",
        question: "Which institutions provide financial tradelines?",
        options: ["Banks", "Lenders", "Credit card companies", "All of the above"],
      },
      {
        id: "103-2",
        question: "What is a personal guarantee?",
        options: [
          "Business insurance",
          "Owner promises to repay debt personally",
          "Vendor payment plan",
        ],
      },
      {
        id: "103-3",
        question: "What type of accounts show larger borrowing capacity?",
        options: ["Vendor accounts", "Financial tradelines", "Utility bills"],
      },
      {
        id: "103-4",
        question: "Can strong business credit lead to no-PG financing?",
        options: ["Yes", "No"],
      },
      {
        id: "103-5",
        question:
          "What factor measures how much credit is used compared to limits?",
        options: ["Credit utilization", "Credit velocity", "Credit age"],
      },
    ],
  },
  {
    id: 104,
    title: "Public Records & Government Data",
    subtitle: "Legal and Regulatory Credit Factors",
    objective:
      "Understand how UCC filings, tax liens, judgments, and business registrations affect business credit reports.",
    isPremium: true,
    isUniversity: true,
    xpReward: 75,
    missionTip:
      "Strong businesses maintain clean public records. Tax liens and excessive UCC filings can severely damage lending decisions.",
    keyTerms: [
      "UCC Filing",
      "Tax Lien",
      "Secretary of State",
      "Judgment",
      "Bankruptcy Filing",
    ],
    content: [
      {
        type: "heading",
        text: "Public Records in Business Credit",
      },
      {
        type: "paragraph",
        text: "The final major source of business credit information comes from public records and government filings. Business credit bureaus collect legal and regulatory information from public databases.",
      },
      {
        type: "list",
        items: [
          "Business registrations",
          "UCC filings",
          "Tax liens",
          "Judgments",
          "Bankruptcy filings",
        ],
      },
      {
        type: "heading",
        text: "UCC Filings",
      },
      {
        type: "paragraph",
        text: "A Uniform Commercial Code (UCC) filing occurs when a lender places a claim on business assets used as collateral. While UCC filings are not always negative, excessive filings may indicate heavy debt exposure.",
      },
      {
        type: "heading",
        text: "Tax Liens",
      },
      {
        type: "paragraph",
        text: "A tax lien occurs when a business fails to pay taxes owed to government agencies. Tax liens signal serious financial distress and can negatively impact lending decisions.",
      },
      {
        type: "heading",
        text: "Business Registration Data",
      },
      {
        type: "paragraph",
        text: "Credit bureaus also gather information from business registration records including Secretary of State filings, business formation records, and corporate officers. This information verifies the legitimacy and legal structure of the business.",
      },
      {
        type: "tip",
        text: "Public records give lenders insight into legal risks, outstanding liabilities, and financial obligations. Keep your records clean.",
      },
    ],
    quiz: [
      {
        id: "104-1",
        question: "What does UCC stand for?",
        options: [
          "Uniform Commercial Code",
          "United Credit Corporation",
          "Unified Corporate Credit",
        ],
      },
      {
        id: "104-2",
        question: "What does a UCC filing represent?",
        options: ["Loan collateral claim", "Tax refund", "Credit score"],
      },
      {
        id: "104-3",
        question: "Which government system tracks business registrations?",
        options: ["Secretary of State", "IRS only", "Local banks"],
      },
      {
        id: "104-4",
        question: "What public record indicates unpaid taxes?",
        options: ["Tax lien", "Trade account", "Vendor line"],
      },
      {
        id: "104-5",
        question: "Do lenders review public records before issuing credit?",
        options: ["Yes", "No"],
      },
    ],
  },
  {
    id: 105,
    title: "Vendor Credit Foundations",
    subtitle: "Building Your First Business Tradelines",
    objective:
      "Learn how to strategically open and manage vendor accounts to create the foundation of your business credit profile.",
    isPremium: true,
    isUniversity: true,
    xpReward: 75,
    badge: "Vendor Specialist",
    badgeIcon: "shopping-cart",
    missionTip:
      "Open multiple reporting vendor accounts, make small purchases regularly, and pay invoices before the due date.",
    keyTerms: [
      "Net Payment Terms",
      "EIN Verification",
      "Payment History",
      "Credit Score Generation",
      "Reporting Activity",
    ],
    content: [
      {
        type: "heading",
        text: "The Foundation of Business Credit",
      },
      {
        type: "paragraph",
        text: "The foundation of business credit begins with vendor tradelines. These are supplier accounts that allow a business to purchase goods or services and pay later under structured terms.",
      },
      {
        type: "paragraph",
        text: "Vendor credit is often the first stage in building business credit profiles, because most vendors do not require strong financial history to approve new accounts.",
      },
      {
        type: "list",
        items: [
          "Business registration",
          "EIN verification",
          "Business address legitimacy",
          "Payment behavior",
        ],
      },
      {
        type: "heading",
        text: "Why Vendor Accounts Are Critical",
      },
      {
        type: "paragraph",
        text: "Without reporting tradelines, bureaus may not have enough data to create a credit score for the business. Many business credit programs recommend establishing at least 5 reporting vendor accounts.",
      },
      {
        type: "heading",
        text: "Vendor Payment Behavior and Scores",
      },
      {
        type: "paragraph",
        text: "Business credit scoring models reward companies that pay invoices early. PAYDEX: 100 = Early, 80 = On time, Below 80 = Late. Businesses that consistently pay 10–20 days early may achieve scores above 90.",
      },
      {
        type: "tip",
        text: "Not every vendor reports to credit bureaus. If the vendor does not report, the account will not build business credit. Always verify reporting activity.",
      },
    ],
    quiz: [
      {
        id: "105-1",
        question: "What is a vendor tradeline?",
        options: [
          "A supplier credit account",
          "A bank loan",
          "A government filing",
        ],
      },
      {
        id: "105-2",
        question: "What does Net-30 mean?",
        options: [
          "Payment required within 30 days",
          "Payment due immediately",
          "Payment due in 90 days",
        ],
      },
      {
        id: "105-3",
        question:
          "How many vendor tradelines are usually recommended to start building business credit?",
        options: ["2", "5", "20"],
      },
      {
        id: "105-4",
        question: "Which behavior improves PAYDEX scores?",
        options: ["Paying early", "Paying late", "Ignoring invoices"],
      },
      {
        id: "105-5",
        question: "Do all vendors report to credit bureaus?",
        options: ["Yes", "No"],
      },
    ],
  },
  {
    id: 106,
    title: "Business Credit Score Systems",
    subtitle: "PAYDEX, Intelliscore & Risk Scores Explained",
    objective:
      "Understand the different business credit scoring models and what ranges indicate strong creditworthiness.",
    isPremium: true,
    isUniversity: true,
    xpReward: 75,
    missionTip:
      "Each bureau collects different data. A business should aim to build credit profiles across multiple bureaus for the strongest overall position.",
    keyTerms: [
      "PAYDEX",
      "Intelliscore Plus",
      "Business Credit Risk Score",
      "Delinquency Prediction",
      "Multi-Bureau Profile",
    ],
    content: [
      {
        type: "heading",
        text: "Multiple Scoring Systems",
      },
      {
        type: "paragraph",
        text: "Unlike personal credit, which uses FICO and VantageScore models, business credit relies on multiple independent scoring systems. These scores help lenders determine the risk level of extending credit to a business.",
      },
      {
        type: "heading",
        text: "Dun & Bradstreet PAYDEX Score",
      },
      {
        type: "paragraph",
        text: "The PAYDEX score ranges from 0 to 100 and measures how quickly a business pays its invoices. 90–100 = Early, 80–89 = On time, 70–79 = Up to 15 days late, Below 70 = Increasing risk. Lenders often require 80 or higher.",
      },
      {
        type: "heading",
        text: "Experian Intelliscore Plus",
      },
      {
        type: "paragraph",
        text: "Experian's business score ranges from 1 to 100. The Intelliscore predicts the likelihood that a business will become seriously delinquent within the next 12 months. It analyzes payment history, credit utilization, public records, business age, and industry risk.",
      },
      {
        type: "heading",
        text: "Equifax Business Credit Risk Score",
      },
      {
        type: "paragraph",
        text: "Equifax produces a Business Credit Risk Score ranging from 101 to 992. This score estimates the probability that a business will become 90 days delinquent on financial obligations.",
      },
      {
        type: "tip",
        text: "Not all creditors report to every bureau. A business may have a strong D&B score but a weak Equifax score simply because different vendors report to different bureaus.",
      },
    ],
    quiz: [
      {
        id: "106-1",
        question: "What score does Dun & Bradstreet use?",
        options: ["PAYDEX", "FICO", "VantageScore"],
      },
      {
        id: "106-2",
        question: "What range does PAYDEX use?",
        options: ["0–100", "300–850", "1–500"],
      },
      {
        id: "106-3",
        question: "What does Experian Intelliscore measure?",
        options: [
          "Likelihood of delinquency",
          "Tax liability",
          "Revenue growth",
        ],
      },
      {
        id: "106-4",
        question: "What does Equifax Business Credit Risk Score predict?",
        options: [
          "Probability of delinquency",
          "Number of employees",
          "Stock performance",
        ],
      },
      {
        id: "106-5",
        question: "Do all bureaus collect the same information?",
        options: ["Yes", "No"],
      },
    ],
  },
  {
    id: 107,
    title: "Tiered Credit Building System",
    subtitle: "From Vendor Credit to Cash Credit",
    objective:
      "Learn the four-tier progression system for building business credit from vendor accounts to traditional financing.",
    isPremium: true,
    isUniversity: true,
    xpReward: 75,
    badge: "Tier Strategist",
    badgeIcon: "layers",
    missionTip:
      "Each tier unlocks higher levels of financing access. Master vendor credit before attempting retail or cash credit applications.",
    keyTerms: [
      "Vendor Tier",
      "Retail Tier",
      "Fleet Tier",
      "Cash Credit Tier",
      "Credit Progression",
    ],
    content: [
      {
        type: "heading",
        text: "The Four-Tier System",
      },
      {
        type: "paragraph",
        text: "Business credit development typically follows a tier-based progression system. Each tier represents a different level of financial credibility. Businesses move through these tiers as they demonstrate stronger payment history and financial stability.",
      },
      {
        type: "heading",
        text: "Tier 1 — Vendor Credit",
      },
      {
        type: "paragraph",
        text: "Vendor credit is the starting point. Businesses open accounts with suppliers offering Net payment terms. The goal is to establish reporting tradelines and payment history. Recommended milestone: 5–8 reporting vendor accounts.",
      },
      {
        type: "heading",
        text: "Tier 2 — Retail Credit",
      },
      {
        type: "paragraph",
        text: "Once vendor tradelines are established, businesses may qualify for retail store credit accounts. These include office supply retailers, hardware stores, and technology stores. Retail accounts usually offer higher limits than vendor accounts.",
      },
      {
        type: "heading",
        text: "Tier 3 — Fleet Credit",
      },
      {
        type: "paragraph",
        text: "Fleet credit is designed for businesses operating vehicles. These accounts may be used for fuel purchases, vehicle maintenance, and fleet services. Fleet accounts often provide large revolving limits.",
      },
      {
        type: "heading",
        text: "Tier 4 — Cash Credit",
      },
      {
        type: "paragraph",
        text: "The final stage is traditional financing: business credit cards, lines of credit, equipment financing, and working capital loans. At this stage, lenders rely heavily on the business credit profile rather than personal credit.",
      },
    ],
    quiz: [
      {
        id: "107-1",
        question: "What is the first tier of business credit?",
        options: ["Vendor tier", "Cash tier", "Fleet tier"],
      },
      {
        id: "107-2",
        question: "What comes after vendor credit?",
        options: ["Retail credit", "Mortgage credit", "Government credit"],
      },
      {
        id: "107-3",
        question: "What tier includes fuel cards?",
        options: ["Fleet tier", "Vendor tier", "Retail tier"],
      },
      {
        id: "107-4",
        question: "Which tier includes bank credit cards?",
        options: ["Cash credit", "Vendor credit", "Fleet credit"],
      },
      {
        id: "107-5",
        question:
          "What must businesses build before reaching cash credit tiers?",
        options: ["Payment history", "Tax debt", "Legal filings"],
      },
    ],
  },
  {
    id: 108,
    title: "Net-30 Vendors That Build Credit",
    subtitle: "Finding Vendors That Actually Report",
    objective:
      "Identify which Net-30 vendors report to business credit bureaus and learn the strategy for building tradelines effectively.",
    isPremium: true,
    isUniversity: true,
    xpReward: 75,
    missionTip:
      "The strongest credit profiles include tradelines reporting to multiple bureaus. Always verify which bureaus each vendor reports to.",
    keyTerms: [
      "Net-30 Vendor",
      "Reporting Vendor",
      "Bureau Verification",
      "Tradeline Strategy",
      "Multi-Bureau Reporting",
    ],
    content: [
      {
        type: "heading",
        text: "Why Net-30 Vendors Come First",
      },
      {
        type: "paragraph",
        text: "One of the most important steps in building business credit is opening vendor accounts that actually report payment activity to business credit bureaus. Many business owners mistakenly open accounts that do not report.",
      },
      {
        type: "paragraph",
        text: "Net-30 vendors are often the easiest accounts for new businesses to obtain because many evaluate applications based on business legitimacy rather than financial history.",
      },
      {
        type: "list",
        items: [
          "Business registration status",
          "EIN verification",
          "Business address and phone listing",
          "Website presence",
        ],
      },
      {
        type: "heading",
        text: "Sample Reporting Vendors",
      },
      {
        type: "paragraph",
        text: "Some well-known vendor accounts that have historically reported include Uline, Quill, Grainger, Summa Office Supplies, Crown Office Supplies, Strategic Network Solutions, Shirtsy, and Creative Analytics.",
      },
      {
        type: "tip",
        text: "Reporting policies can change. Always verify which bureaus each vendor reports to. Some report to D&B only, some to Experian only, and some to multiple bureaus.",
      },
      {
        type: "heading",
        text: "Vendor Tradeline Strategy",
      },
      {
        type: "paragraph",
        text: "Open 5–8 reporting vendor accounts. Make small purchases regularly. Pay invoices early whenever possible. Maintain consistent payment history. Within several months, you can move into higher credit tiers.",
      },
    ],
    quiz: [
      {
        id: "108-1",
        question: "What is a Net-30 vendor?",
        options: [
          "A supplier allowing payment within 30 days",
          "A bank loan provider",
          "A credit bureau",
        ],
      },
      {
        id: "108-2",
        question: "Why are vendor accounts often used first?",
        options: [
          "They are easier to obtain",
          "They offer large loans",
          "They replace bank credit",
        ],
      },
      {
        id: "108-3",
        question: "How many vendor tradelines are usually recommended?",
        options: ["1–2", "5–8", "20+"],
      },
      {
        id: "108-4",
        question:
          "What must a vendor do for an account to build credit?",
        options: [
          "Report payment activity",
          "Offer discounts",
          "Provide large credit limits",
        ],
      },
      {
        id: "108-5",
        question:
          "Should businesses verify which bureau a vendor reports to?",
        options: ["Yes", "No"],
      },
    ],
  },
  {
    id: 109,
    title: "Building $50K–$150K Business Credit",
    subtitle: "Progressive Credit Tier Execution",
    objective:
      "Learn the step-by-step process to build $50,000 to $150,000 in available business credit within 12–24 months.",
    isPremium: true,
    isUniversity: true,
    xpReward: 100,
    badge: "Capital Commander",
    badgeIcon: "trending-up",
    missionTip:
      "When executed properly, businesses can build $50K–$150K in available credit within 12–24 months by following the tier progression system.",
    keyTerms: [
      "Credit Tier Progression",
      "PAYDEX 80+",
      "Revolving Credit",
      "Working Capital",
      "No-PG Financing",
    ],
    content: [
      {
        type: "heading",
        text: "The Path to Significant Business Credit",
      },
      {
        type: "paragraph",
        text: "Once a business establishes vendor tradelines and strong payment history, it can begin qualifying for larger financing accounts through progressive credit tiers.",
      },
      {
        type: "heading",
        text: "Step 1 — Establish Vendor Credit",
      },
      {
        type: "paragraph",
        text: "Aim for 5–8 vendor accounts reporting to D&B or Experian. A PAYDEX score of 80 or higher is usually required before advancing to the next tier.",
      },
      {
        type: "heading",
        text: "Step 2 — Retail Store Credit",
      },
      {
        type: "paragraph",
        text: "After vendor tradelines are established, businesses may qualify for retail store credit cards from office supply stores, hardware stores, and technology retailers. These provide revolving credit limits of $1,000 to $10,000.",
      },
      {
        type: "heading",
        text: "Step 3 — Fleet Credit",
      },
      {
        type: "paragraph",
        text: "Fleet credit accounts for fuel purchases, vehicle maintenance, and fleet expenses. Fleet credit limits may reach $10,000 or more.",
      },
      {
        type: "heading",
        text: "Step 4 — Cash Credit",
      },
      {
        type: "paragraph",
        text: "Cash credit is the highest tier: business credit cards, lines of credit, working capital financing, and equipment loans. Businesses with strong credit may qualify for $25,000–$50,000 credit cards. Multiple approvals can create significant available capital.",
      },
    ],
    quiz: [
      {
        id: "109-1",
        question: "What is the first stage of business credit building?",
        options: ["Vendor credit", "Fleet credit", "Cash credit"],
      },
      {
        id: "109-2",
        question: "What PAYDEX score is usually required to advance tiers?",
        options: ["60", "80", "100"],
      },
      {
        id: "109-3",
        question: "Which tier comes after vendor credit?",
        options: ["Retail credit", "Fleet credit", "Bank loans"],
      },
      {
        id: "109-4",
        question: "What is the highest tier of business credit?",
        options: ["Cash credit", "Vendor credit", "Retail credit"],
      },
      {
        id: "109-5",
        question:
          "Can businesses build over $50K in credit through tier progression?",
        options: ["Yes", "No"],
      },
    ],
  },
  {
    id: 110,
    title: "Business Credit Dispute System",
    subtitle: "Correcting Errors on Business Credit Reports",
    objective:
      "Learn how to identify errors on business credit reports and submit disputes to correct inaccurate information.",
    isPremium: true,
    isUniversity: true,
    xpReward: 75,
    missionTip:
      "Regularly review reports from all three bureaus. Monitoring helps identify errors early before they damage financing opportunities.",
    keyTerms: [
      "Dispute Process",
      "Reporting Source",
      "Credit Report Monitoring",
      "Data Verification",
      "Error Correction",
    ],
    content: [
      {
        type: "heading",
        text: "Errors Happen in Business Credit Too",
      },
      {
        type: "paragraph",
        text: "Even though business credit reporting systems are separate from personal credit, errors still occur frequently. Incorrect information can include wrong payment history, duplicate tradelines, incorrect balances, accounts belonging to another business, and outdated public records.",
      },
      {
        type: "heading",
        text: "Step 1 — Review Business Credit Reports",
      },
      {
        type: "paragraph",
        text: "Businesses should regularly review reports from Dun & Bradstreet, Experian Business, and Equifax Business. Monitoring helps identify errors early.",
      },
      {
        type: "heading",
        text: "Step 2 — Identify Reporting Source",
      },
      {
        type: "paragraph",
        text: "Once an error is discovered, identify the source: vendors, banks, collection agencies, or public records. Contacting the source directly may resolve the issue faster.",
      },
      {
        type: "heading",
        text: "Step 3 — Submit a Dispute",
      },
      {
        type: "paragraph",
        text: "Disputes should include business name and EIN, account information being disputed, explanation of the error, and supporting documentation. The bureau then contacts the reporting source to verify the data.",
      },
      {
        type: "heading",
        text: "Step 4 — Monitor Results",
      },
      {
        type: "paragraph",
        text: "After submitting a dispute, monitor reports to ensure corrections appear. Maintaining accurate credit reports helps protect financing opportunities.",
      },
    ],
    quiz: [
      {
        id: "110-1",
        question: "Can business credit reports contain errors?",
        options: ["Yes", "No"],
      },
      {
        id: "110-2",
        question: "What should businesses review regularly?",
        options: ["Credit reports", "Employee schedules", "Vendor invoices"],
      },
      {
        id: "110-3",
        question: "What must be identified before submitting disputes?",
        options: ["Reporting source", "Business revenue", "Tax status"],
      },
      {
        id: "110-4",
        question: "What happens if information cannot be verified?",
        options: [
          "It may be removed",
          "It remains permanently",
          "It becomes a loan",
        ],
      },
      {
        id: "110-5",
        question: "Why is monitoring credit reports important?",
        options: [
          "Protect financing opportunities",
          "Increase revenue automatically",
          "Avoid taxes",
        ],
      },
    ],
  },
  {
    id: 111,
    title: "How Lenders Evaluate Businesses",
    subtitle: "Risk Factors That Determine Approval",
    objective:
      "Understand the key factors lenders analyze when evaluating a business for financing and how to prepare stronger applications.",
    isPremium: true,
    isUniversity: true,
    xpReward: 75,
    missionTip:
      "Lower-risk businesses receive larger credit limits and lower interest rates. Focus on building every factor lenders evaluate.",
    keyTerms: [
      "Risk Classification",
      "Time in Business",
      "Revenue Threshold",
      "Credit Exposure",
      "Payment Consistency",
    ],
    content: [
      {
        type: "heading",
        text: "What Lenders Look For",
      },
      {
        type: "paragraph",
        text: "When lenders evaluate businesses for financing, they analyze several key risk factors to determine the probability that the business will repay its obligations.",
      },
      {
        type: "heading",
        text: "Business Credit Scores",
      },
      {
        type: "paragraph",
        text: "Lenders review business credit scores from reporting agencies. Higher scores indicate lower risk.",
      },
      {
        type: "heading",
        text: "Time in Business",
      },
      {
        type: "paragraph",
        text: "Companies operating for longer periods are considered more stable. Many lenders prefer businesses with 2+ years of operating history.",
      },
      {
        type: "heading",
        text: "Revenue & Payment History",
      },
      {
        type: "paragraph",
        text: "Revenue demonstrates the ability to repay debt. Some lenders require minimum annual revenue thresholds. Consistent early or on-time payments signal reliability.",
      },
      {
        type: "heading",
        text: "Credit Exposure & Risk Classification",
      },
      {
        type: "paragraph",
        text: "Lenders review how much credit the business currently uses. High utilization may indicate financial stress. Businesses are categorized into low, moderate, or high risk tiers. Lower-risk businesses receive larger limits and lower interest rates.",
      },
    ],
    quiz: [
      {
        id: "111-1",
        question: "What do lenders evaluate first?",
        options: ["Credit scores", "Office location", "Employee uniforms"],
      },
      {
        id: "111-2",
        question: "Why does time in business matter?",
        options: ["Shows stability", "Reduces taxes", "Improves marketing"],
      },
      {
        id: "111-3",
        question: "What demonstrates ability to repay loans?",
        options: ["Revenue", "Business name", "Logo design"],
      },
      {
        id: "111-4",
        question: "What indicates financial stress?",
        options: [
          "High credit utilization",
          "Early payments",
          "Long business history",
        ],
      },
      {
        id: "111-5",
        question: "What classification receives best lending terms?",
        options: ["Low risk", "High risk"],
      },
    ],
  },
  {
    id: 112,
    title: "Funding Stack Strategy",
    subtitle: "Advanced Multi-Account Credit Building",
    objective:
      "Learn the funding stacking strategy to secure multiple credit accounts and build $50K–$150K in available business capital.",
    isPremium: true,
    isUniversity: true,
    xpReward: 100,
    badge: "Funding Master",
    badgeIcon: "award",
    missionTip:
      "Funding stacking must be used responsibly. Borrow only what you can repay and maintain low credit utilization.",
    keyTerms: [
      "Funding Stacking",
      "Strategic Applications",
      "Credit Timing",
      "Responsible Use",
      "Capital Access",
    ],
    content: [
      {
        type: "heading",
        text: "What Is Funding Stacking?",
      },
      {
        type: "paragraph",
        text: "One of the most advanced strategies in business credit is called funding stacking. Funding stacking means securing multiple credit accounts within a short time period.",
      },
      {
        type: "paragraph",
        text: "Because lenders often check credit reports before issuing loans, applying strategically can allow businesses to receive multiple approvals before new accounts appear on reports.",
      },
      {
        type: "heading",
        text: "Example Funding Stack",
      },
      {
        type: "list",
        items: [
          "Two business credit cards",
          "One line of credit",
          "Equipment financing",
          "Working capital loan",
        ],
      },
      {
        type: "paragraph",
        text: "If approved, the business could access $50,000–$150,000 in total funding.",
      },
      {
        type: "heading",
        text: "Responsible Use",
      },
      {
        type: "paragraph",
        text: "Funding stacking must be used responsibly. Businesses should borrow only what they can repay, maintain low credit utilization, and make all payments on time. Responsible credit use strengthens long-term financing opportunities.",
      },
      {
        type: "tip",
        text: "This strategy works best after building a strong credit profile across multiple tiers. Never stack funding without the ability to service the debt.",
      },
    ],
    quiz: [
      {
        id: "112-1",
        question: "What is funding stacking?",
        options: [
          "Applying for multiple credit accounts strategically",
          "Combining two businesses",
          "Increasing vendor prices",
        ],
      },
      {
        id: "112-2",
        question: "Why do businesses apply within short time periods?",
        options: [
          "To secure multiple approvals",
          "To avoid paying loans",
          "To increase taxes",
        ],
      },
      {
        id: "112-3",
        question: "What could funding stacks reach?",
        options: ["$50K–$150K", "$500", "$1,000"],
      },
      {
        id: "112-4",
        question: "What must businesses maintain to protect credit?",
        options: ["On-time payments", "Late payments", "High utilization"],
      },
      {
        id: "112-5",
        question: "Should funding stacking be used responsibly?",
        options: ["Yes", "No"],
      },
    ],
  },
];

export const BCU_LESSON_IDS = BCU_LESSONS.map((l) => l.id);

export const getBcuLessonById = (id: number): Lesson | undefined =>
  BCU_LESSONS.find((l) => l.id === id);
