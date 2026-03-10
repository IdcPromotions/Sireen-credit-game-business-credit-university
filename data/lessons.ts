export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
}

export interface ContentBlock {
  type: "paragraph" | "list" | "heading" | "tip";
  text?: string;
  items?: string[];
}

export interface Lesson {
  id: number;
  title: string;
  subtitle: string;
  objective: string;
  content: ContentBlock[];
  keyTerms?: string[];
  missionTip: string;
  isPremium: boolean;
  isUniversity?: boolean;
  xpReward: number;
  quiz: QuizQuestion[];
  badge?: string;
  badgeIcon?: string;
}

export const LESSONS: Lesson[] = [
  {
    id: 1,
    title: "Welcome to the Credit Arena",
    subtitle: "Understanding Your Financial Battlefield",
    objective: "Introduce the player to the world of credit, what the app does, and how the mission system works.",
    isPremium: false,
    xpReward: 50,
    badge: "First Mission",
    badgeIcon: "flag",
    missionTip: "You cannot fix what you do not understand.",
    keyTerms: ["Credit Profile", "Credit Bureau", "Tradeline", "Negative Item", "Score Factor"],
    content: [
      {
        type: "paragraph",
        text: "Credit is a financial reputation system. Lenders, banks, landlords, and even some employers use it to judge your financial reliability. Every financial move you make — on time or late — is recorded and reported.",
      },
      {
        type: "heading",
        text: "Why Credit Matters (Even at 16)",
      },
      {
        type: "paragraph",
        text: "If you are 16 years old or older, you are already living in a world where credit affects opportunity. Credit is not just a score — it is a system that follows you throughout your entire financial life.",
      },
      {
        type: "heading",
        text: "Credit Determines:",
      },
      {
        type: "list",
        items: [
          "Whether you can rent an apartment",
          "Whether you can finance a car",
          "Whether you qualify for a mortgage",
          "What interest rate you pay on loans and credit cards",
          "Sometimes even whether you get hired for a job",
        ],
      },
      {
        type: "tip",
        text: "The good news: You have legal rights. The better news: You can fix damaged credit legally, ethically, and strategically.",
      },
      {
        type: "heading",
        text: "Your Mission in SIREEN CREDIT GAME",
      },
      {
        type: "list",
        items: [
          "Understand the rules of credit",
          "Identify weaknesses in your credit file",
          "Learn how to challenge inaccurate reporting",
          "Rebuild your score with strategy and precision",
        ],
      },
      {
        type: "heading",
        text: "How the Mission System Works",
      },
      {
        type: "paragraph",
        text: "Each lesson is a mission. Complete the content, pass the checkpoint quiz with 80% or higher, and unlock the next level. The higher your score, the more XP you earn.",
      },
      {
        type: "paragraph",
        text: "Your credit profile is your file — the compiled record of every account, payment, inquiry, and public record tied to your name. Three companies maintain these files: Experian, Equifax, and TransUnion. They are your primary targets for dispute and correction.",
      },
      {
        type: "tip",
        text: "Credit repair is documentation, timelines, legal enforcement, strategic negotiation, and consistent habits. Your power is not in anger — your power is in procedure.",
      },
    ],
    quiz: [
      {
        id: "1-1",
        question: "What is credit in the financial system?",
        options: [
          "A financial reputation system",
          "A type of bank loan",
          "A government benefit program",
          "A type of debit card",
        ],
      },
      {
        id: "1-2",
        question: "Which three companies are the major credit bureaus?",
        options: [
          "Experian, Equifax, TransUnion",
          "Chase, Wells Fargo, Citibank",
          "FICO, VantageScore, Experian",
          "Moody's, S&P, Fitch",
        ],
      },
      {
        id: "1-3",
        question: "What is a tradeline?",
        options: [
          "An account listed on your credit report",
          "A type of credit dispute letter",
          "A credit repair company",
          "A government credit program",
        ],
      },
      {
        id: "1-4",
        question: "True or False: You can successfully fix credit problems you do not understand.",
        options: ["True", "False"],
      },
    ],
  },
  {
    id: 2,
    title: "The 5 Credit Score Stats",
    subtitle: "Know Your Score Breakdown",
    objective: "Teach the five major credit score categories and their relative impact.",
    isPremium: false,
    xpReward: 50,
    badge: "Score Tracker",
    badgeIcon: "bar-chart",
    missionTip: "Payment history and utilization are usually the biggest pressure points.",
    keyTerms: ["Payment History", "Utilization", "Length of History", "Credit Mix", "New Credit", "FICO Score"],
    content: [
      {
        type: "paragraph",
        text: "Your credit score is a number calculated from your credit report. The most common scoring model is the FICO Score, with a typical range of 300 to 850. Understanding each category is essential before you can develop any real repair strategy.",
      },
      {
        type: "heading",
        text: "The 5 Score Categories (FICO Breakdown)",
      },
      {
        type: "list",
        items: [
          "35% — Payment History — Do you pay on time? This is the most critical factor.",
          "30% — Credit Utilization — How much of your available credit are you using? Keep it under 30%, ideally under 10%.",
          "15% — Length of Credit History — How long have your accounts been open? Older is better.",
          "10% — Credit Mix — Do you have a variety of credit types? Cards, loans, and installments.",
          "10% — New Credit — Have you recently applied for multiple new accounts? Each inquiry can temporarily lower your score.",
        ],
      },
      {
        type: "paragraph",
        text: "Payment history and utilization together make up 65% of your score weight. This is where most repair leverage exists. Fix these two before anything else.",
      },
      {
        type: "heading",
        text: "Credit Utilization Example",
      },
      {
        type: "paragraph",
        text: "If your credit limit is $1,000, keep your balance below $100 to $300. Pay high balances first. Do not close old accounts unless absolutely necessary — closing them reduces your available credit and increases your utilization ratio.",
      },
      {
        type: "heading",
        text: "Why This Matters",
      },
      {
        type: "paragraph",
        text: "If you don't know which category is dragging your score down, you'll waste time fixing the wrong things. Identify your weakest stat first. Then build your strategy around it.",
      },
    ],
    quiz: [
      {
        id: "2-1",
        question: "Which credit score factor typically carries the most weight?",
        options: [
          "Payment History",
          "Credit Mix",
          "Length of History",
          "New Credit",
        ],
      },
      {
        id: "2-2",
        question: "What does credit utilization refer to?",
        options: [
          "How much credit you use vs. what is available",
          "The number of credit accounts you have",
          "How long your credit history is",
          "The types of credit you hold",
        ],
      },
      {
        id: "2-3",
        question: "Which two factors are usually the biggest pressure points on your score?",
        options: [
          "Payment History and Utilization",
          "Credit Mix and New Credit",
          "Length of History and Credit Mix",
          "Utilization and New Credit",
        ],
      },
      {
        id: "2-4",
        question: "How many major credit score categories are there?",
        options: ["5", "3", "7", "10"],
      },
    ],
  },
  {
    id: 3,
    title: "Reading a Credit Report Like a Pro",
    subtitle: "Forensic Analysis of Your File",
    objective: "Teach users how to identify the main parts of a credit report and audit every detail.",
    isPremium: false,
    xpReward: 50,
    badge: "Report Reader",
    badgeIcon: "file-text",
    missionTip: "Never skim a report. Audit every single line.",
    keyTerms: ["Credit Report", "Account History", "Inquiries", "Public Records", "Collections"],
    content: [
      {
        type: "paragraph",
        text: "A credit report is a file about you. It is not just a list of accounts — it is a detailed document with multiple sections, each carrying potential for errors that can damage your score. Three major credit bureaus keep these files: Equifax, Experian, and TransUnion. These companies collect and sell your financial data.",
      },
      {
        type: "heading",
        text: "How Data Gets on Your Report",
      },
      {
        type: "paragraph",
        text: "The credit bureaus receive data from companies known as furnishers. Furnishers are organizations that report information about your accounts. These include banks, credit card companies, auto lenders, mortgage lenders, and collection agencies. Because multiple entities report information, errors can occur frequently.",
      },
      {
        type: "heading",
        text: "The Four Sections of a Credit Report",
      },
      {
        type: "heading",
        text: "1. Personal Information",
      },
      {
        type: "list",
        items: [
          "Full name and name variations",
          "Social Security number (partially masked)",
          "Current and previous addresses",
          "Employers",
        ],
      },
      {
        type: "paragraph",
        text: "Errors in this section can indicate mixed credit files, where someone else's information has been merged with yours. Common issues include incorrect addresses, multiple name spellings, and employers you never worked for. While these may seem small, they can affect identity verification during disputes.",
      },
      {
        type: "heading",
        text: "2. Tradelines (Account History)",
      },
      {
        type: "paragraph",
        text: "Tradelines are the accounts that make up your credit history. They are the most important part of your report because they influence your credit score directly.",
      },
      {
        type: "list",
        items: [
          "Creditor name and account type",
          "Date opened and credit limit",
          "Current balance and payment history",
          "Account status (open, closed, charged-off)",
        ],
      },
      {
        type: "paragraph",
        text: "When reviewing tradelines, pay attention to late payments, incorrect balances, accounts that are not yours, and accounts reported multiple times.",
      },
      {
        type: "heading",
        text: "3. Collections",
      },
      {
        type: "paragraph",
        text: "Collections are debts transferred to third-party collection agencies after the original creditor stops attempting to collect. Collection accounts can significantly lower credit scores. However, they are also one of the most strategically removable items on a credit report when approached properly.",
      },
      {
        type: "heading",
        text: "4. Public Records",
      },
      {
        type: "list",
        items: [
          "Bankruptcies",
          "Civil judgments",
          "Tax liens (rare on modern reports)",
        ],
      },
      {
        type: "paragraph",
        text: "These items typically stay on reports for longer periods and require specific strategies to address.",
      },
      {
        type: "heading",
        text: "What to Look For",
      },
      {
        type: "paragraph",
        text: "Errors exist in every section. Incorrect addresses can link you to accounts that are not yours. Old employers can connect your file to another consumer. Inaccurate account balances inflate your utilization. Duplicate accounts double-count negative data.",
      },
      {
        type: "heading",
        text: "Key Items to Highlight During Review",
      },
      {
        type: "list",
        items: [
          "Incorrect balances",
          "Wrong dates",
          "Duplicate accounts",
          "Accounts that are not yours",
          "Incorrect personal information",
          "Accounts reporting after the legal reporting period",
        ],
      },
      {
        type: "paragraph",
        text: "The most important sections for repair are Account History and Collections. These contain the items that directly impact your score and are most frequently inaccurate.",
      },
      {
        type: "tip",
        text: "Each bureau maintains its own database. Information on one report may not match another. It is very common for an account to appear on two reports but not the third, or for balances and payment histories to differ. Always order from all three bureaus.",
      },
    ],
    quiz: [
      {
        id: "3-1",
        question: "Which of the following is NOT typically a section of a credit report?",
        options: [
          "Bank account balances",
          "Personal information",
          "Account history",
          "Public records",
        ],
      },
      {
        id: "3-2",
        question: "What does auditing a credit report mean?",
        options: [
          "Reviewing every line carefully",
          "Paying off your debts",
          "Opening new accounts",
          "Disputing everything immediately",
        ],
      },
      {
        id: "3-3",
        question: "True or False: You should quickly skim your credit report.",
        options: ["True", "False"],
      },
    ],
  },
  {
    id: 4,
    title: "Negative Items and What They Mean",
    subtitle: "Learning the Language of Damage",
    objective: "Teach the user the language of credit damage and what each negative item actually represents.",
    isPremium: false,
    xpReward: 50,
    badge: "Threat Analyst",
    badgeIcon: "alert-triangle",
    missionTip: "Know your enemy before you engage it.",
    keyTerms: ["Late Payment", "Collection", "Charge-Off", "Repossession", "Bankruptcy", "High Utilization"],
    content: [
      {
        type: "paragraph",
        text: "Not all negative items are the same. Each type carries different damage levels, reporting timelines, and dispute strategies. You must understand what you're dealing with before you can fight it.",
      },
      {
        type: "heading",
        text: "The 6 Types of Negative Items",
      },
      {
        type: "list",
        items: [
          "Late Payments — Payments made 30, 60, or 90+ days after due date. They stay on your report for 7 years.",
          "Collections — When a debt is sold to a collection agency. Highly damaging to your score.",
          "Charge-Offs — When a creditor writes off the debt as uncollectable. Does not eliminate what you owe.",
          "Repossessions — Vehicle or property taken back by a lender due to non-payment.",
          "Bankruptcy — Legal declaration of inability to repay debts. Chapter 7 stays 10 years, Chapter 13 stays 7 years.",
          "High Utilization — Using over 30% of your available credit signals financial stress.",
        ],
      },
      {
        type: "heading",
        text: "What You Can Dispute",
      },
      {
        type: "paragraph",
        text: "You can dispute incorrect data, unverifiable data, or incomplete data. You should not dispute accurate late payments — instead, use goodwill strategies for those (covered in later missions).",
      },
      {
        type: "heading",
        text: "Reporting Time Limits",
      },
      {
        type: "paragraph",
        text: "Under the Fair Credit Reporting Act (FCRA), most negative items can only remain on your report for 7 years from the Date of First Delinquency (DOFD). Bankruptcies can remain up to 10 years. After the reporting limit, these items must be removed.",
      },
    ],
    quiz: [
      {
        id: "4-1",
        question: "Which of the following is NOT a negative credit item?",
        options: [
          "On-time payment",
          "Late payment",
          "Collection account",
          "Charge-off",
        ],
      },
      {
        id: "4-2",
        question: "Why is high credit utilization considered negative?",
        options: [
          "It suggests you may be financially over-extended",
          "It reduces your credit mix",
          "It shortens your credit history",
          "It triggers hard inquiries",
        ],
      },
      {
        id: "4-3",
        question: "True or False: A repossession is a positive item on your credit report.",
        options: ["True", "False"],
      },
    ],
  },
  {
    id: 5,
    title: "Credit Myths That Keep Players Losing",
    subtitle: "Eliminating False Beliefs",
    objective: "Break false credit beliefs before entering repair mode.",
    isPremium: false,
    xpReward: 75,
    badge: "Myth Buster",
    badgeIcon: "x-circle",
    missionTip: "Operating on false data is more dangerous than having no data at all.",
    content: [
      {
        type: "paragraph",
        text: "Most people approach credit repair with at least one false belief. These myths cost real money and real time. Clear your mental file before you enter the repair system.",
      },
      {
        type: "heading",
        text: "Myth #1: Closing Old Accounts Helps Your Score",
      },
      {
        type: "paragraph",
        text: "FALSE. Closing old accounts reduces your available credit limit, which increases your utilization ratio. It also shortens your length of credit history. Both factors lower your score.",
      },
      {
        type: "heading",
        text: "Myth #2: Checking Your Own Credit Hurts Your Score",
      },
      {
        type: "paragraph",
        text: "FALSE. Checking your own credit is a soft inquiry. Only hard inquiries — initiated by lenders when you apply for credit — can temporarily impact your score. You can check your own report as often as needed.",
      },
      {
        type: "heading",
        text: "Myth #3: Paying a Collection Always Removes It",
      },
      {
        type: "paragraph",
        text: "FALSE. Paying a collection account updates its status to 'paid,' but does not automatically remove it from your report. To get deletion, you must negotiate a pay-for-delete agreement in writing before making any payment.",
      },
      {
        type: "heading",
        text: "Myth #4: You Only Have One Credit Score",
      },
      {
        type: "paragraph",
        text: "FALSE. There are dozens of FICO scoring models plus VantageScore. Each bureau also generates its own version of your score using the same data in slightly different ways. You have multiple scores.",
      },
      {
        type: "heading",
        text: "Myth #5: Credit Repair Is Illegal or Magic",
      },
      {
        type: "paragraph",
        text: "FALSE. Credit repair is not magic and it is not illegal loopholes. It is documentation, timelines, legal enforcement, strategic negotiation, and consistent habits. The laws — FCRA, FDCPA, and CFPB procedures — give you the legal tools to do it yourself.",
      },
      {
        type: "tip",
        text: "Enter repair mode only after you've cleared these myths. Your strategy must be based on facts, not assumptions.",
      },
    ],
    quiz: [
      {
        id: "5-1",
        question: "Which of the following is a common credit myth?",
        options: [
          "Closing old accounts improves your score",
          "Payment history matters most",
          "High utilization can hurt your score",
          "You can dispute inaccurate items",
        ],
      },
      {
        id: "5-2",
        question: "True or False: Checking your own credit score hurts it.",
        options: ["True", "False"],
      },
      {
        id: "5-3",
        question: "True or False: Paying off a collection always removes it from your credit report.",
        options: ["True", "False"],
      },
    ],
  },
  // PREMIUM LESSONS 6–18
  {
    id: 6,
    title: "Credit Report Audit Mission",
    subtitle: "Full Forensic Bureau-by-Bureau Analysis",
    objective: "Perform a complete forensic audit of your credit report to identify all negative accounts before disputing.",
    isPremium: true,
    xpReward: 100,
    badge: "Auditor",
    badgeIcon: "search",
    missionTip: "Credit repair does not start with disputes. It starts with analysis.",
    content: [
      {
        type: "paragraph",
        text: "A credit report audit examines every account, identifier, and piece of reported data across all three bureaus to determine what exists, what is negative, and what may violate reporting rules. This is Phase 1 of the 90-Day Credit Repair Framework.",
      },
      {
        type: "heading",
        text: "Phase 1: Foundation & Assessment (Weeks 1–2)",
      },
      {
        type: "paragraph",
        text: "Goal: Understand what you are fixing. This is not random — it is sequential and strategic.",
      },
      {
        type: "list",
        items: [
          "Pull all three credit reports from Experian, Equifax, and TransUnion",
          "Highlight incorrect balances, wrong dates, duplicate accounts, and accounts not yours",
          "Organize all documents for tracking",
        ],
      },
      {
        type: "heading",
        text: "What to Examine During an Audit",
      },
      {
        type: "list",
        items: [
          "Incorrect addresses you never lived at",
          "Names never used or misspelled",
          "Wrong employers listed",
          "Account balances and past due amounts",
          "Payment history accuracy",
          "Date Opened vs Date of First Delinquency (DOFD)",
        ],
      },
      {
        type: "heading",
        text: "Identifying High-Impact Errors",
      },
      {
        type: "paragraph",
        text: "During your audit, your goal is not simply to find mistakes but to identify high-impact opportunities. When these types of inaccuracies are successfully removed, scores often increase substantially.",
      },
      {
        type: "list",
        items: [
          "Accounts that do not belong to you",
          "Duplicate collection accounts",
          "Incorrect late payment histories",
          "Incorrect account balances",
          "Accounts reporting after the legal reporting period",
        ],
      },
      {
        type: "heading",
        text: "Categorizing Accounts for Strategy",
      },
      {
        type: "paragraph",
        text: "Once the audit is complete, accounts should be categorized. This creates structure in your repair process.",
      },
      {
        type: "list",
        items: [
          "Category A — Inaccurate Accounts: Contains incorrect information. Strategy: Dispute with credit bureaus.",
          "Category B — Accurate but Negative Accounts: Valid but damaging. Strategy: Negotiation, settlement, pay-for-delete, or waiting for aging.",
          "Category C — Positive Accounts: Helps your credit profile. Strategy: Protect them at all costs. Do not dispute positive accounts unless there is a major error.",
        ],
      },
      {
        type: "heading",
        text: "Creating Your Dispute Map",
      },
      {
        type: "paragraph",
        text: "A dispute map is your credit repair roadmap. It answers: Which accounts will be disputed first? Which require validation? Which require negotiation? Which should be left alone temporarily?",
      },
      {
        type: "tip",
        text: "Without a plan, many people send dozens of disputes at once. This can raise red flags with credit bureaus. Strategic timing produces better results. Never approach credit repair emotionally — approach it like an investigation.",
      },
      {
        type: "heading",
        text: "Credit Audit Checklist",
      },
      {
        type: "list",
        items: [
          "1. Obtain reports from all three bureaus",
          "2. Highlight every negative item",
          "3. Review payment histories for errors",
          "4. Check balances for accuracy",
          "5. Identify duplicate accounts",
          "6. Verify collection ownership",
          "7. Confirm account dates",
        ],
      },
      {
        type: "heading",
        text: "Credit Law Connection",
      },
      {
        type: "list",
        items: [
          "FCRA §611 — Your right to dispute inaccurate information",
          "FCRA §623 — Responsibilities of furnishers (creditors)",
          "FCRA §605 — Reporting time limits on negative items",
        ],
      },
    ],
    quiz: [
      { id: "6-1", question: "What is the first operational step in credit repair?", options: ["Perform a credit report audit", "Send dispute letters immediately", "Pay off all collections", "Open new accounts"] },
      { id: "6-2", question: "Which companies maintain your credit reports?", options: ["Experian, Equifax, TransUnion", "FICO, VantageScore, Experian", "Chase, Wells Fargo, Citi", "Moody's, S&P, Fitch"] },
      { id: "6-3", question: "What does DOFD stand for?", options: ["Date of First Delinquency", "Date of Final Debt", "Division of Financial Documents", "Default of Financial Duty"] },
      { id: "6-4", question: "True or False: Every bureau always shows identical information.", options: ["True", "False"] },
      { id: "6-5", question: "True or False: A credit audit helps identify inaccurate reporting.", options: ["True", "False"] },
      { id: "6-6", question: "Yes or No: Should negative accounts be classified before disputing?", options: ["Yes", "No"] },
    ],
  },
  {
    id: 7,
    title: "Personal Information Cleanup",
    subtitle: "Removing Incorrect Identifiers",
    objective: "Remove incorrect personal identifiers before disputing accounts to strengthen your file.",
    isPremium: true,
    xpReward: 100,
    badge: "ID Cleaner",
    badgeIcon: "user-check",
    missionTip: "Incorrect identifiers can block your disputes from succeeding.",
    content: [
      { type: "paragraph", text: "Credit bureaus use identity matching systems comparing name, SSN, birth date, and address history. Incorrect identifiers may strengthen the verification of incorrect accounts." },
      { type: "heading", text: "What to Clean Up" },
      { type: "list", items: ["Addresses you never lived at", "Misspelled name variations", "Old or incorrect employers", "Former name variations that could create mixed file errors"] },
      { type: "heading", text: "Why This Matters for Disputes" },
      { type: "paragraph", text: "When you dispute an account, the bureau uses your personal identifiers to verify it. If incorrect addresses or names on your file match the disputed account, the bureau may verify it as yours even when it is not. Cleaning up identifiers first removes this obstacle." },
      { type: "tip", text: "Always clean personal information before sending account disputes. This is a foundational step in the 90-day framework." },
    ],
    quiz: [
      { id: "7-1", question: "What is the purpose of personal information cleanup?", options: ["Strengthen identity accuracy before disputing accounts", "Remove collections automatically", "Open new tradelines", "Lower your utilization"] },
      { id: "7-2", question: "True or False: Removing an address automatically deletes accounts linked to it.", options: ["True", "False"] },
      { id: "7-3", question: "Yes or No: Can incorrect identifiers contribute to mixed file errors?", options: ["Yes", "No"] },
    ],
  },
  {
    id: 8,
    title: "Dispute System Fundamentals",
    subtitle: "The Structured Dispute Process",
    objective: "Teach the structured process of disputing inaccurate credit report information under the FCRA.",
    isPremium: true,
    xpReward: 100,
    badge: "Dispute Operator",
    badgeIcon: "send",
    missionTip: "Disputes must be specific, accurate, and documented to be effective.",
    content: [
      { type: "paragraph", text: "Under the Fair Credit Reporting Act, you have the right to dispute inaccurate or unverifiable information on your credit report. Bureaus have 30 days to investigate and respond. This is where most people fail — they do not know their legal power." },
      { type: "heading", text: "The Laws That Protect You" },
      { type: "paragraph", text: "The Fair Credit Reporting Act (FCRA) regulates credit bureaus and data furnishers. These are the key sections every credit repair operator must know:" },
      { type: "list", items: [
        "FCRA §611 (15 U.S.C. §1681i) — Gives you the right to dispute inaccurate information. Credit bureaus must investigate within 30 days.",
        "FCRA §609 (15 U.S.C. §1681g) — Gives you the right to request documentation used to verify accounts. If they cannot provide documentation, the account must be deleted.",
        "FCRA §611(a)(7) — Method of Verification: You can demand who verified the account, how it was verified, and contact info of the furnisher.",
      ] },
      { type: "heading", text: "When You Should Dispute" },
      { type: "list", items: [
        "Information that is inaccurate",
        "Information that is incomplete",
        "Information that is outdated",
        "Information that is unverifiable",
        "Accounts that do not belong to you",
        "Incorrect payment histories or duplicate reporting",
      ] },
      { type: "heading", text: "When You Should NOT Dispute" },
      { type: "paragraph", text: "Many people mistakenly dispute everything. However, some disputes can backfire." },
      { type: "list", items: [
        "Active accounts in good standing — disputing can cause lenders to review and update negatively",
        "Accurate recently late payments — these are verifiable and will be confirmed",
        "Accounts you plan to settle soon — disputes may interfere with negotiations",
        "Accounts currently under negotiation — disputing can reset the process",
      ] },
      { type: "heading", text: "Step-by-Step Dispute Strategy" },
      { type: "paragraph", text: "Step 1: Identify the inaccuracy. Dispute only incorrect data, unverifiable data, or incomplete data. Do not dispute accurate information." },
      { type: "paragraph", text: "Step 2: Send an FCRA §611 Dispute Letter. State the account, explain what is inaccurate, and demand investigation. Keep it simple and specific." },
      { type: "paragraph", text: "Step 3: Wait 30 days. They must verify, correct, or delete. No response equals a violation of your rights." },
      { type: "paragraph", text: "Step 4: If verified but still wrong, send a Method of Verification letter. Demand the name of the verifier and the process used." },
      { type: "heading", text: "The Investigation Process" },
      { type: "paragraph", text: "When a dispute is filed, the bureau contacts the creditor (furnisher) that reported the account and asks them to verify the information. The creditor must confirm that the information is accurate and supported by records. If they cannot verify the account, the bureau must remove it." },
      { type: "heading", text: "Dispute Cycle Timeline" },
      { type: "list", items: [
        "Day 1–5: Dispute letter sent",
        "Day 7–10: Bureau receives dispute",
        "Day 30: Investigation deadline",
        "Day 35–45: Results delivered to you",
      ] },
      { type: "paragraph", text: "Sending follow-ups before the 30-day deadline is ineffective. Patience is critical during this stage." },
      { type: "heading", text: "Core Dispute Categories" },
      { type: "list", items: ["Account Not Mine", "Incorrect Balance", "Duplicate Tradeline", "Incorrect Late Payment", "Incorrect Account Status"] },
      { type: "tip", text: "Use certified mail with return receipt for all disputes. Track the date sent, date received, and 30-day deadline. This documentation is your proof if escalation becomes necessary." },
    ],
    quiz: [
      { id: "8-1", question: "What law gives consumers the right to dispute credit report information?", options: ["Fair Credit Reporting Act", "Fair Debt Collection Practices Act", "Truth in Lending Act", "Consumer Protection Act"] },
      { id: "8-2", question: "True or False: Disputes should be vague and general.", options: ["True", "False"] },
      { id: "8-3", question: "Yes or No: Should disputes match the specific type of inaccuracy?", options: ["Yes", "No"] },
    ],
  },
  {
    id: 9,
    title: "Collections Attack Mode",
    subtitle: "Challenging Collection Accounts",
    objective: "Teach players how to challenge and remove collection accounts using legal strategies.",
    isPremium: true,
    xpReward: 100,
    badge: "Collections Slayer",
    badgeIcon: "shield",
    missionTip: "A collector must validate the debt if you request it in writing.",
    content: [
      { type: "paragraph", text: "A collection account occurs when a debt is transferred or sold to a collection agency. Collection agencies purchase debts for significantly less than the original amount — often pennies on the dollar. Because of this, they are often willing to negotiate settlements. Collectors must follow the Fair Debt Collection Practices Act (FDCPA) — a law that protects consumers from abusive collection tactics." },
      { type: "heading", text: "The Fair Debt Collection Practices Act (FDCPA)" },
      { type: "paragraph", text: "This law controls debt collectors. It gives you powerful legal rights that most consumers never use." },
      { type: "heading", text: "Your Rights Under the FDCPA" },
      { type: "list", items: [
        "Request debt validation — demand proof you owe the debt",
        "Demand proof of the amount owed and ownership of the debt",
        "Stop harassment — collectors cannot harass or threaten you",
        "Stop contact entirely with a written cease communication request",
        "Collectors cannot misrepresent the debt amount",
      ] },
      { type: "heading", text: "When a Debt Collector Contacts You" },
      { type: "paragraph", text: "DO NOT admit the debt immediately. DO NOT make any payment without validation first." },
      { type: "paragraph", text: "DO send a Debt Validation Letter. This is your legal right under the FDCPA." },
      { type: "heading", text: "What They Must Provide" },
      { type: "list", items: [
        "Original creditor name",
        "Exact amount owed",
        "Documentation of ownership of the debt",
        "Proof that the debt belongs to you",
      ] },
      { type: "heading", text: "Understanding Statute of Limitations" },
      { type: "paragraph", text: "Every state has laws that limit how long creditors can sue you for a debt. These are called statutes of limitations. This is separate from the 7-year credit reporting window." },
      { type: "tip", text: "Making payments or acknowledging debts can restart the legal statute of limitations clock. Always verify statutes before making any payment on old debts. If the statute has expired, the collector cannot sue you — but the debt may still appear on your credit report until the 7-year reporting window closes." },
    ],
    quiz: [
      { id: "9-1", question: "What law regulates debt collectors?", options: ["Fair Debt Collection Practices Act", "Fair Credit Reporting Act", "Truth in Lending Act", "Dodd-Frank Act"] },
      { id: "9-2", question: "True or False: Debt collectors can legally threaten arrest for non-payment.", options: ["True", "False"] },
      { id: "9-3", question: "Yes or No: Can consumers request debt validation from collectors?", options: ["Yes", "No"] },
    ],
  },
  {
    id: 10,
    title: "Charge-Off Attack Mode",
    subtitle: "Dismantling Charge-Off Accounts",
    objective: "Understand charge-offs, verify accuracy, and execute the correct challenge strategy.",
    isPremium: true,
    xpReward: 100,
    badge: "Charge-Off Hunter",
    badgeIcon: "zap",
    missionTip: "A charge-off does not mean the debt disappeared — it means the creditor gave up collecting it.",
    content: [
      { type: "paragraph", text: "A charge-off occurs when a creditor writes off a debt after severe delinquency (typically 180 days). This does not automatically eliminate the debt or your obligation — it transfers the problem." },
      { type: "heading", text: "What to Verify on a Charge-Off" },
      { type: "list", items: ["Balance accuracy — Is the reported amount correct?", "Date of First Delinquency (DOFD) — Is the account within the 7-year reporting window?", "Ownership — Has the debt been sold to a collector?"] },
      { type: "heading", text: "Dispute Strategy for Charge-Offs" },
      { type: "paragraph", text: "Under FCRA §611, you can dispute inaccurate charge-off information. If the balance is wrong, the dates are incorrect, or the account has been sold but both the original creditor and collector are reporting it, these are legitimate grounds for dispute." },
      { type: "tip", text: "If a charge-off has been sold to a collection agency, both the original creditor and the collector should not be reporting the same debt. This is a duplicate tradeline and can be disputed." },
    ],
    quiz: [
      { id: "10-1", question: "What does DOFD stand for in the context of charge-offs?", options: ["Date of First Delinquency", "Debt Outstanding Final Date", "Date of Final Default", "Division of First Debt"] },
      { id: "10-2", question: "True or False: A charge-off means the debt automatically disappears.", options: ["True", "False"] },
      { id: "10-3", question: "Yes or No: Must creditors report accurate balances on charge-off accounts?", options: ["Yes", "No"] },
    ],
  },
  {
    id: 11,
    title: "Late Payment Recovery Mode",
    subtitle: "Dispute vs. Goodwill Strategy",
    objective: "Learn when to dispute a late payment and when to request a goodwill adjustment.",
    isPremium: true,
    xpReward: 100,
    badge: "Recovery Agent",
    badgeIcon: "clock",
    missionTip: "Dispute if inaccurate — goodwill if accurate. Know the difference.",
    content: [
      { type: "paragraph", text: "Not every late payment can be disputed as inaccurate. If the late payment was accurately reported, you have two options: accept it or request a goodwill adjustment from the creditor." },
      { type: "heading", text: "Two Strategies" },
      { type: "list", items: ["Dispute Route — Use if the late payment was reported in error or is past the 7-year limit", "Goodwill Letter Route — Request removal from a creditor you have an otherwise positive relationship with"] },
      { type: "heading", text: "When Goodwill Letters Work Best" },
      { type: "paragraph", text: "Goodwill letters are most effective when you made a genuine mistake but now have a good payment history. They work best with original creditors, small banks, and credit unions — institutions that value customer relationships." },
      { type: "paragraph", text: "In your goodwill letter, acknowledge the mistake, explain any circumstances that led to it, highlight your positive history since then, and politely request removal as a courtesy." },
      { type: "tip", text: "Goodwill is not a legal right — it is a request. Be respectful and genuine. Some creditors have policies against goodwill adjustments, but many will grant them for loyal customers." },
    ],
    quiz: [
      { id: "11-1", question: "What is the correct strategy for an accurately reported late payment?", options: ["Dispute if inaccurate; goodwill if accurate", "Dispute all late payments regardless", "Ignore it and wait for it to fall off", "Pay it again to reset the clock"] },
      { id: "11-2", question: "True or False: You can dispute a late payment that was accurately reported.", options: ["True", "False"] },
    ],
  },
  {
    id: 12,
    title: "Debt Validation Strategy",
    subtitle: "Making Collectors Prove It",
    objective: "Force collectors to validate their debt claims before you take any action.",
    isPremium: true,
    xpReward: 100,
    badge: "Validation Expert",
    badgeIcon: "check-circle",
    missionTip: "Never pay a debt a collector cannot validate.",
    content: [
      { type: "paragraph", text: "Under the FDCPA, you have the right to request validation of any debt a collector claims you owe. They must provide the original creditor name, the amount owed, and proof that you are responsible for it." },
      { type: "heading", text: "What to Request in Validation" },
      { type: "list", items: ["Original creditor name", "Amount owed and how it was calculated", "Proof you are responsible for this specific debt", "Contract or agreement bearing your signature"] },
      { type: "heading", text: "What Happens If They Cannot Validate" },
      { type: "paragraph", text: "If the collector cannot provide proper validation, they must cease all collection activity and remove the account from your credit report. This is one of the strongest consumer protections in the FDCPA." },
      { type: "heading", text: "Timing Is Critical" },
      { type: "paragraph", text: "Send your debt validation request within 30 days of the collector's first contact. While you can still request validation after 30 days, doing so within the window gives you the strongest legal position and requires the collector to stop collection until validation is provided." },
      { type: "tip", text: "Always send validation requests via certified mail with return receipt. Keep copies of everything. If a collector continues collection activity without providing validation, they are violating the FDCPA." },
    ],
    quiz: [
      { id: "12-1", question: "What must a collector provide in debt validation?", options: ["Original creditor, amount, and proof of responsibility", "Just the account number", "A verbal confirmation", "Payment options only"] },
      { id: "12-2", question: "Yes or No: Should you request validation before paying any collection account?", options: ["Yes", "No"] },
    ],
  },
  {
    id: 13,
    title: "Goodwill and Settlement Plays",
    subtitle: "Negotiation Tactics That Work",
    objective: "Use goodwill letters, settlement negotiations, and pay-for-delete to clean your file.",
    isPremium: true,
    xpReward: 100,
    badge: "Negotiator",
    badgeIcon: "briefcase",
    missionTip: "Always get settlement and deletion agreements in writing before any payment.",
    content: [
      { type: "paragraph", text: "Three powerful negotiation tools exist: goodwill adjustments, debt settlements, and pay-for-delete agreements. Each requires a different approach and different timing." },
      { type: "heading", text: "The Three Plays" },
      { type: "list", items: ["Goodwill Letter — Ask a creditor to remove an accurate negative item as a courtesy for your overall positive history", "Settlement Negotiation — Offer to pay a reduced amount to settle the account and close it", "Pay-for-Delete — Offer payment in exchange for written agreement to remove the account from all bureaus"] },
      { type: "heading", text: "Pay-for-Delete Strategy" },
      { type: "paragraph", text: "Pay-for-delete is used specifically for collection accounts. You offer a settlement payment in exchange for full deletion from your credit report — not just marking it as 'paid.' The key difference is that a paid collection still hurts your score, while a deleted one is gone entirely." },
      { type: "heading", text: "How to Negotiate Strategically" },
      { type: "paragraph", text: "Never begin negotiations by admitting responsibility for the debt. Instead, follow this sequence:" },
      { type: "list", items: [
        "1. Confirm reporting details — verify what they are reporting and to which bureaus",
        "2. Ask if they accept settlement offers",
        "3. Request pay-for-delete agreements",
      ] },
      { type: "paragraph", text: "Collection agencies frequently accept settlements between 30–60% of the balance because they purchased the debt for far less than face value." },
      { type: "heading", text: "Critical Rules for Negotiation" },
      { type: "list", items: [
        "Always get the pay-for-delete agreement in writing before making any payment",
        "Never make a payment without a written agreement confirming deletion",
        "Start your settlement offer low — many collectors will accept 30-50% of the original balance",
        "Get the agreement on the collector's company letterhead if possible",
      ] },
      { type: "heading", text: "Goodwill Letter Best Practices" },
      { type: "paragraph", text: "Goodwill letters work best with original creditors, small banks, and credit unions. They are used when you made a legitimate mistake but now have good history. Be genuine, acknowledge the situation, and highlight your positive relationship." },
      { type: "tip", text: "Never admit to owing a debt in writing to a collector without first receiving validation. Separate your goodwill requests (for original creditors) from your pay-for-delete negotiations (for collectors)." },
    ],
    quiz: [
      { id: "13-1", question: "What is the purpose of a settlement negotiation?", options: ["Negotiate a reduced balance for account closure", "Request a refund from the creditor", "Open a new credit line", "Transfer the debt to another agency"] },
      { id: "13-2", question: "Yes or No: Should pay-for-delete agreements be confirmed in writing before paying?", options: ["Yes", "No"] },
      { id: "13-3", question: "True or False: A goodwill letter is used to dispute an inaccurate item.", options: ["True", "False"] },
    ],
  },
  {
    id: 14,
    title: "Escalation and Compliance Mode",
    subtitle: "Second-Round Disputes and CFPB",
    objective: "Escalate persistent disputes using MOV requests, furnisher disputes, and CFPB complaints.",
    isPremium: true,
    xpReward: 100,
    badge: "Escalation Commander",
    badgeIcon: "trending-up",
    missionTip: "When bureaus fail to correct errors, escalate to regulators.",
    content: [
      { type: "paragraph", text: "If a bureau verifies an item you know is inaccurate, you can escalate. Request the Method of Verification (MOV) — they must tell you how they verified it. If they cannot prove it, it must be removed. This is Phase 4 of the 90-Day Framework (Weeks 9–12)." },
      { type: "heading", text: "Escalation Tools" },
      { type: "list", items: ["Method of Verification (MOV) Request — Ask the bureau exactly how it verified the disputed item, who verified it, and their contact information", "Direct Furnisher Dispute — Dispute directly with the original creditor, not just the bureau", "CFPB Complaint — File a complaint with the Consumer Financial Protection Bureau"] },
      { type: "heading", text: "Consumer Financial Protection Bureau (CFPB)" },
      { type: "paragraph", text: "The CFPB is a federal agency that protects consumers. You can file complaints when credit bureaus ignore your disputes, when collectors violate the law, or when inaccurate information remains on your report after proper dispute procedures." },
      { type: "heading", text: "When to File a CFPB Complaint" },
      { type: "list", items: [
        "Bureau failed to investigate within 30 days",
        "Bureau verified information without proper investigation",
        "Collector continued collection after failing to validate debt",
        "Inaccurate information remains after multiple dispute rounds",
        "Bureau refused to provide Method of Verification",
      ] },
      { type: "tip", text: "CFPB complaints are highly effective. Bureaus and furnishers take them seriously because the CFPB tracks response rates and can take enforcement action. File factually and include all documentation." },
    ],
    quiz: [
      { id: "14-1", question: "What does MOV stand for in credit disputes?", options: ["Method of Verification", "Method of Validation", "Maximum Outstanding Value", "Mode of Verification"] },
      { id: "14-2", question: "Yes or No: Can you file a complaint with the CFPB if bureaus fail to correct errors?", options: ["Yes", "No"] },
      { id: "14-3", question: "Yes or No: Can you dispute directly with the original creditor (furnisher)?", options: ["Yes", "No"] },
    ],
  },
  {
    id: 15,
    title: "Credit Rebuild and Score Growth",
    subtitle: "Building Forward While Repairing",
    objective: "Begin actively building positive credit history while the repair process continues.",
    isPremium: true,
    xpReward: 100,
    badge: "Builder Pro",
    badgeIcon: "activity",
    missionTip: "Repair removes damage. Building adds strength. You need both.",
    content: [
      { type: "paragraph", text: "Credit repair removes negative information, but rebuilding creates positive credit history. Without rebuilding, scores will not improve significantly. The goal of rebuilding is to create strong, consistent reporting patterns." },
      { type: "heading", text: "Secured Credit Cards" },
      { type: "paragraph", text: "Secured cards require a refundable deposit. The deposit becomes the credit limit. They are ideal for individuals starting or rebuilding credit because approval requirements are lower. When used responsibly, secured cards can convert into regular unsecured credit cards over time." },
      { type: "heading", text: "Credit Builder Loans" },
      { type: "paragraph", text: "Credit builder loans are designed specifically for individuals with limited credit history. Your payments are held in a savings account until the loan is paid off. These loans create positive payment history and give you savings when complete." },
      { type: "heading", text: "Authorized User Strategy" },
      { type: "paragraph", text: "Get added to a trusted person's account as an authorized user. Their positive payment history can appear on your report, boosting your score. Choose someone with a long history of on-time payments and low utilization." },
      { type: "heading", text: "Credit Utilization Optimization" },
      { type: "paragraph", text: "Credit utilization measures how much of your available credit you are using. The formula is: Balance ÷ Credit Limit × 100. High utilization lowers credit scores." },
      { type: "list", items: [
        "Stay under 30% utilization",
        "Ideal range is 1–10%",
        "Pay high utilization cards first",
        "Do not close old accounts — they increase available credit",
      ] },
      { type: "heading", text: "Utilization Example" },
      { type: "paragraph", text: "If your credit limit is $1,000, keep your balance below $100 to $300. If you have multiple cards, pay the highest utilization cards first." },
      { type: "heading", text: "Requesting Credit Limit Increases" },
      { type: "paragraph", text: "Higher credit limits reduce your utilization ratio without requiring you to pay down balances. Request limit increases after six months of on-time payments, maintaining low utilization, and showing score improvement. Responsible usage increases approval likelihood." },
      { type: "heading", text: "Long-Term Credit Aging" },
      { type: "paragraph", text: "Credit scores benefit from long histories. Older accounts demonstrate reliability. For this reason, consumers should avoid closing their oldest credit accounts unless absolutely necessary. Maintaining aged accounts strengthens the credit profile over time." },
      { type: "heading", text: "Core Rebuild Strategies" },
      { type: "list", items: ["On-time payments — Every single payment matters. Never miss one during the rebuild phase.", "Low credit utilization — Keep usage below 10% for maximum score impact", "Maintain oldest accounts — Length of history is 15% of your score", "Limit new applications — Each hard inquiry can temporarily lower your score", "Request limit increases after 6 months of responsible use"] },
      { type: "tip", text: "Pay on time. Every time. This is the single most important habit for credit building. Payment history is 35% of your score — no strategy can overcome consistent late payments." },
    ],
    quiz: [
      { id: "15-1", question: "What are the core credit rebuild strategies?", options: ["On-time payments, low utilization, secured cards", "Open many new accounts quickly", "Close old accounts and pay off all debt", "Only dispute — never build"] },
      { id: "15-2", question: "True or False: Keeping utilization below 10% can help maximize your score.", options: ["True", "False"] },
      { id: "15-3", question: "Yes or No: Can a secured credit card help build positive credit history?", options: ["Yes", "No"] },
    ],
  },
  {
    id: 16,
    title: "Advanced Case Strategy Lab",
    subtitle: "Complex File Scenarios",
    objective: "Handle mixed files, identity theft cases, and complex multi-account disputes.",
    isPremium: true,
    xpReward: 125,
    badge: "Advanced Strategist",
    badgeIcon: "layers",
    missionTip: "Complex cases require layered strategy, not single-shot disputes.",
    content: [
      { type: "paragraph", text: "Some credit files are more complex than standard disputes. Mixed files, identity theft, and duplicate accounts require specific multi-step approaches. These cases demand layered strategy, not single-shot disputes." },
      { type: "heading", text: "Complex Case Types" },
      { type: "list", items: ["Mixed Files — Accounts from another consumer merged into your file due to similar identifiers", "Identity Theft — Fraudulent accounts opened in your name without your knowledge", "Duplicate Accounts — Same account reported multiple times across bureaus"] },
      { type: "heading", text: "What Is Identity Theft?" },
      { type: "paragraph", text: "Identity theft occurs when someone uses your personal information without permission to open credit accounts or conduct financial transactions. These fraudulent accounts can damage your credit profile quickly. However, federal law provides strong protections for identity theft victims." },
      { type: "heading", text: "Filing an Identity Theft Report" },
      { type: "paragraph", text: "Victims should file a report with the Federal Trade Commission (FTC). The FTC provides an identity theft affidavit, recovery guidance, and the documentation required for disputes. This affidavit serves as official proof of identity theft." },
      { type: "heading", text: "Identity Theft Protection Protocol" },
      { type: "list", items: [
        "Step 1: File an identity theft report at IdentityTheft.gov (FTC affidavit)",
        "Step 2: File a police report with your local law enforcement — include description of fraudulent activity, accounts involved, and identity theft statement",
        "Step 3: Send fraud dispute letters to all three credit bureaus with your FTC affidavit and police report",
        "Step 4: Request blocking of all fraudulent accounts",
      ] },
      { type: "paragraph", text: "A police report strengthens disputes significantly. In many cases, credit bureaus or creditors will require one to verify the fraud claim." },
      { type: "heading", text: "Fraud Alerts vs. Credit Freezes" },
      { type: "paragraph", text: "Fraud alerts notify creditors to verify your identity before issuing credit. Credit freezes prevent creditors from accessing your credit report entirely. Both tools help prevent additional fraudulent activity, but they serve different purposes." },
      { type: "heading", text: "Blocking Fraudulent Accounts" },
      { type: "paragraph", text: "Under FCRA Section 605B, credit bureaus must block fraudulent accounts within four business days after receiving proper documentation. Once blocked, the accounts cannot reappear unless verified as legitimate." },
      { type: "tip", text: "Identity theft cases are Phase 3 of the 90-Day Framework (Weeks 7–8). If you discover fraudulent accounts during your audit, handle them with this specific protocol — they require different documentation than standard inaccuracy disputes." },
    ],
    quiz: [
      { id: "16-1", question: "What is a mixed file in credit reporting?", options: ["Mixed file or identity theft scenario", "Two accounts merged into one", "A file with too many inquiries", "A file with no negative items"] },
      { id: "16-2", question: "Yes or No: Does identity theft require a specialized dispute strategy?", options: ["Yes", "No"] },
      { id: "16-3", question: "True or False: Duplicate accounts always appear on all three bureaus simultaneously.", options: ["True", "False"] },
    ],
  },
  {
    id: 17,
    title: "90-Day Execution Plan",
    subtitle: "Week-by-Week Structured Action",
    objective: "Execute a structured 90-day credit repair plan with weekly targets and measurable outcomes.",
    isPremium: true,
    xpReward: 125,
    badge: "Execution Specialist",
    badgeIcon: "calendar",
    missionTip: "A plan without execution is just information. Execute weekly without fail.",
    content: [
      { type: "paragraph", text: "The 90-day execution plan structures your entire credit repair operation into four strategic phases. Each phase builds on the previous one. This is not random — it is sequential and strategic." },
      { type: "heading", text: "Phase 1: Foundation & Assessment (Weeks 1–2)" },
      { type: "list", items: [
        "Pull all three bureau reports from Experian, Equifax, and TransUnion",
        "Complete full forensic audit of every account and identifier",
        "Highlight incorrect balances, wrong dates, duplicate accounts, and accounts not yours",
        "Classify all negative items by type and priority",
        "Organize all documents for tracking",
      ] },
      { type: "heading", text: "Phase 2: Initial Disputes (Weeks 3–6)" },
      { type: "list", items: [
        "Send FCRA §611 Dispute Letters for all identified inaccuracies",
        "Send FCRA §609 Verification Requests for unverifiable accounts",
        "Request debt validation from all collection agencies (FDCPA)",
        "Use certified mail with return receipt for everything",
        "Track date sent, date received, and 30-day deadline for each dispute",
      ] },
      { type: "heading", text: "Phase 3: Fraud & Identity Theft (Weeks 7–8)" },
      { type: "list", items: [
        "If fraudulent accounts exist: File FTC affidavit at IdentityTheft.gov",
        "File police report for identity theft",
        "Send fraud dispute letters with documentation to all bureaus",
        "Request blocking of fraudulent accounts under FCRA",
      ] },
      { type: "heading", text: "Phase 4: Escalation & Negotiation (Weeks 9–12)" },
      { type: "list", items: [
        "Send Method of Verification (MOV) letters for items verified but still wrong",
        "Negotiate pay-for-delete agreements with collectors",
        "Send goodwill letters to original creditors",
        "File CFPB complaints for unresolved disputes",
        "Begin active credit rebuilding: secured cards, credit builder loans, authorized user accounts",
      ] },
      { type: "tip", text: "The people who win at credit repair know the laws, use written documentation, stay organized, and follow structured timelines. Execute each phase completely before moving to the next." },
    ],
    quiz: [
      { id: "17-1", question: "How many weeks does the structured execution plan cover?", options: ["12", "4", "8", "6"] },
      { id: "17-2", question: "True or False: The plan starts with sending dispute letters in week one.", options: ["True", "False"] },
    ],
  },
  {
    id: 18,
    title: "Final Boss — Full Credit Repair System",
    subtitle: "Combining All Systems Into One",
    objective: "Master the complete end-to-end credit repair system: Audit, Dispute, Escalate, Rebuild.",
    isPremium: true,
    xpReward: 200,
    badge: "Elite Restorer",
    badgeIcon: "award",
    missionTip: "The full system is not four steps — it is one continuous mission.",
    content: [
      { type: "paragraph", text: "The complete credit repair system integrates every skill you've learned into a unified, continuous operation. There is no finish line — only higher levels of financial strength." },
      { type: "heading", text: "The Four-Phase System" },
      { type: "list", items: ["Phase 1: AUDIT — Forensic analysis of all three bureau reports", "Phase 2: DISPUTE — Targeted challenges of inaccurate and unverifiable items", "Phase 3: ESCALATE — Method of Verification, furnisher disputes, CFPB complaints", "Phase 4: REBUILD — Positive account building while repair continues"] },
      { type: "heading", text: "Your Legal Arsenal" },
      { type: "list", items: [
        "FCRA §611 — Right to dispute inaccurate information (30-day investigation requirement)",
        "FCRA §609 — Right to request verification documentation",
        "FDCPA — Right to demand debt validation from collectors",
        "CFPB — Federal escalation when bureaus and collectors fail to comply",
      ] },
      { type: "heading", text: "Long-Term Maintenance Habits" },
      { type: "paragraph", text: "Once your credit is rebuilt, protect it. Credit maintenance is an ongoing discipline, not a one-time fix." },
      { type: "list", items: [
        "Monitor reports monthly — catch new errors before they cause damage",
        "Avoid excessive inquiries — only apply for credit when you need it",
        "Keep utilization low — under 30%, ideally under 10%",
        "Maintain oldest accounts — never close your longest-standing accounts without good reason",
        "Dispute errors immediately — do not let inaccuracies linger on your report",
      ] },
      { type: "heading", text: "Final Thoughts" },
      { type: "paragraph", text: "Credit repair is not magic. It is not illegal loopholes. It is not emotional. It is documentation, timelines, legal enforcement, strategic negotiation, and consistent habits. Even at 16, you can understand and execute this system." },
      { type: "paragraph", text: "A credit profile under repair is a living document. It changes monthly. Your strategy must adapt with it. Review your reports quarterly, dispute new issues as they appear, and continue building positive history indefinitely." },
      { type: "tip", text: "Credit is not just about borrowing money. It is about control — control over interest, control over opportunity. The people who win know the laws, use written documentation, stay organized, and follow structured timelines." },
    ],
    quiz: [
      { id: "18-1", question: "What are the four phases of the complete credit repair system?", options: ["Audit, Dispute, Escalate, Rebuild", "Apply, Dispute, Pay, Wait", "Check, Fix, Pay, Close", "Audit, Pay, Wait, Apply"] },
      { id: "18-2", question: "True or False: The credit repair process has a definitive end point where no more work is needed.", options: ["True", "False"] },
    ],
  },
];

export const FREE_LESSON_IDS = [1, 2, 3, 4, 5];
export const PREMIUM_LESSON_IDS = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

import { BCU_LESSONS } from "./bcu-lessons";

export const ALL_LESSONS = [...LESSONS, ...BCU_LESSONS];

export const getLessonById = (id: number): Lesson | undefined =>
  ALL_LESSONS.find((l) => l.id === id);
