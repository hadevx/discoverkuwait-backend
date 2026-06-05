const quizzes = [
  /* ─────────────────────────────────────────────────────────────
     1. General Knowledge
  ───────────────────────────────────────────────────────────── */
  {
    title: { ar: "معلومات عامة عن الكويت", en: "General Knowledge About Kuwait" },
    difficulty: "medium",
    isActive: true,
    questions: [
      {
        category: "history",
        question: {
          ar: "في أي عام حصلت الكويت على استقلالها عن بريطانيا؟",
          en: "In which year did Kuwait gain independence from Britain?",
        },
        options: [
          { ar: "1961", en: "1961" },
          { ar: "1971", en: "1971" },
          { ar: "1951", en: "1951" },
          { ar: "1981", en: "1981" },
        ],
        answer: 0,
        explanation: {
          ar: "حصلت الكويت على استقلالها في 19 يونيو 1961، لتصبح دولة مستقلة ذات سيادة.",
          en: "Kuwait gained independence on June 19, 1961, becoming a fully sovereign state.",
        },
      },
      {
        category: "geography",
        question: {
          ar: "كم عدد محافظات الكويت؟",
          en: "How many governorates does Kuwait have?",
        },
        options: [
          { ar: "أربع محافظات",  en: "Four governorates"  },
          { ar: "خمس محافظات",  en: "Five governorates"  },
          { ar: "ست محافظات",   en: "Six governorates"   },
          { ar: "سبع محافظات",  en: "Seven governorates" },
        ],
        answer: 2,
        explanation: {
          ar: "تتكون الكويت من ست محافظات: العاصمة، حولي، الأحمدي، الجهراء، الفروانية، ومبارك الكبير.",
          en: "Kuwait is divided into six governorates: Capital, Hawalli, Ahmadi, Jahra, Farwaniya, and Mubarak Al-Kabeer.",
        },
      },
      {
        category: "landmarks",
        question: {
          ar: "ما هو أطول ناطحة سحاب في الكويت؟",
          en: "What is the tallest skyscraper in Kuwait?",
        },
        options: [
          { ar: "برج الحمراء",           en: "Al Hamra Tower"          },
          { ar: "أبراج الكويت",          en: "Kuwait Towers"            },
          { ar: "برج بيت الكويت",        en: "Baitak Tower"             },
          { ar: "المركز التجاري الكويتي", en: "Kuwait Commercial Center" },
        ],
        answer: 0,
        explanation: {
          ar: "برج الحمراء هو أطول مبنى في الكويت بارتفاع 412 متراً، ويُعدّ من أبرز معالم المنطقة.",
          en: "Al Hamra Tower stands at 412 metres, making it the tallest building in Kuwait and one of the region's most iconic landmarks.",
        },
      },
      {
        category: "traditions",
        question: {
          ar: "ما هو اللباس التقليدي للرجل الكويتي؟",
          en: "What is the traditional clothing of Kuwaiti men?",
        },
        options: [
          { ar: "الدشداشة", en: "Dishdasha" },
          { ar: "الجلابية", en: "Jalabiya"  },
          { ar: "القفطان",  en: "Kaftan"    },
          { ar: "البشت",    en: "Bisht"     },
        ],
        answer: 0,
        explanation: {
          ar: "الدشداشة هي الثوب الأبيض الفضفاض الذي يرتديه الرجل الكويتي في معظم المناسبات، وهي رمز للهوية الخليجية.",
          en: "The dishdasha is the traditional long white robe worn by Kuwaiti men on most occasions, and is a symbol of Gulf identity.",
        },
      },
      {
        category: "dialect",
        question: {
          ar: "ماذا تعني كلمة \"وايد\" في اللهجة الكويتية؟",
          en: "What does the word \"wayed\" mean in the Kuwaiti dialect?",
        },
        options: [
          { ar: "كثيراً / جداً", en: "A lot / Very much" },
          { ar: "قليلاً",        en: "A little"          },
          { ar: "سريعاً",        en: "Quickly"           },
          { ar: "أحياناً",       en: "Sometimes"         },
        ],
        answer: 0,
        explanation: {
          ar: "\"وايد\" من أكثر الكلمات شيوعاً في اللهجة الكويتية وتعني كثيراً أو جداً، مثل: \"وايد زين\" أي جيد جداً.",
          en: "\"Wayed\" is one of the most common words in Kuwaiti dialect, meaning \"a lot\" or \"very\", e.g. \"wayed zain\" means \"very good\".",
        },
      },
    ],
  },

  /* ─────────────────────────────────────────────────────────────
     2. Kuwaiti Words  (dialect-focused, easy)
  ───────────────────────────────────────────────────────────── */
  {
    title: { ar: "كلمات كويتية", en: "Kuwaiti Words" },
    difficulty: "easy",
    isActive: true,
    questions: [
      {
        category: "dialect",
        question: {
          ar: "ماذا تعني كلمة \"شلونك\" في اللهجة الكويتية؟",
          en: "What does \"shloonak\" mean in Kuwaiti dialect?",
        },
        options: [
          { ar: "كيف حالك؟",   en: "How are you?"    },
          { ar: "أين أنت؟",    en: "Where are you?"  },
          { ar: "ماذا تريد؟",  en: "What do you want?" },
          { ar: "من أنت؟",     en: "Who are you?"    },
        ],
        answer: 0,
        explanation: {
          ar: "\"شلونك\" هي التحية الأكثر شيوعاً في اللهجة الكويتية، وتعني \"كيف حالك\"، والرد المعتاد \"بخير\" أو \"زين\".",
          en: "\"Shloonak\" is the most common Kuwaiti greeting, meaning \"How are you?\" The typical reply is \"bkhair\" (fine) or \"zain\" (good).",
        },
      },
      {
        category: "dialect",
        question: {
          ar: "ماذا تعني عبارة \"هلا وغلا\" في اللهجة الكويتية؟",
          en: "What does \"hala w ghala\" mean in Kuwaiti dialect?",
        },
        options: [
          { ar: "أهلاً وسهلاً (ترحيب حار)", en: "Welcome (warm greeting)" },
          { ar: "إلى اللقاء",               en: "Goodbye"                 },
          { ar: "صباح الخير",               en: "Good morning"            },
          { ar: "شكراً جزيلاً",             en: "Thank you very much"     },
        ],
        answer: 0,
        explanation: {
          ar: "\"هلا وغلا\" عبارة ترحيب كويتية دافئة تعني \"أهلاً وسهلاً بك\"، وتُستخدم للترحيب بالضيوف والأصدقاء.",
          en: "\"Hala w ghala\" is a warm Kuwaiti welcoming phrase meaning \"You are most welcome,\" typically used to greet guests and friends.",
        },
      },
      {
        category: "dialect",
        question: {
          ar: "ماذا تعني كلمة \"يبيله\" في اللهجة الكويتية؟",
          en: "What does \"yabeelee\" mean in Kuwaiti dialect?",
        },
        options: [
          { ar: "يملكه", en: "He owns it"  },
          { ar: "يريده", en: "He wants it" },
          { ar: "أعطاه", en: "He gave it"  },
          { ar: "أخذه",  en: "He took it"  },
        ],
        answer: 1,
        explanation: {
          ar: "\"يبيله\" مشتقة من الفعل \"بيى\" أي أراد، وتعني \"يريده\"، وهي كثيرة الاستخدام في المحادثات اليومية.",
          en: "\"Yabeelee\" comes from the verb \"biy\" (to want), meaning \"He wants it.\" It is widely used in everyday Kuwaiti speech.",
        },
      },
      {
        category: "dialect",
        question: {
          ar: "ماذا تعني عبارة \"ما قصّرت\" في اللهجة الكويتية؟",
          en: "What does \"ma qassart\" mean in Kuwaiti dialect?",
        },
        options: [
          { ar: "أحسنت وشكراً",  en: "Well done, thank you" },
          { ar: "تأخرت",          en: "You were late"         },
          { ar: "أخطأت",          en: "You made a mistake"    },
          { ar: "لم تستطع",       en: "You couldn't do it"    },
        ],
        answer: 0,
        explanation: {
          ar: "\"ما قصّرت\" تعني حرفياً \"لم تُقصّر\"، وهي عبارة شكر وتقدير تُستخدم للثناء على شخص أحسن في شيء ما.",
          en: "\"Ma qassart\" literally means \"You did not fall short\" and is a sincere expression of praise and gratitude, similar to \"Well done!\"",
        },
      },
      {
        category: "dialect",
        question: {
          ar: "ماذا تعني كلمة \"وايه\" (وياه) في اللهجة الكويتية؟",
          en: "What does \"wayah\" mean in Kuwaiti dialect?",
        },
        options: [
          { ar: "لماذا",       en: "Why"              },
          { ar: "مع (بصحبة)", en: "With (together with)" },
          { ar: "الآن",        en: "Now"              },
          { ar: "أين",         en: "Where"            },
        ],
        answer: 1,
        explanation: {
          ar: "\"وايه\" أو \"وياه\" تعني \"مع\" أو \"بصحبة\"، مثل: \"رحت وياه\" أي \"ذهبت معه\".",
          en: "\"Wayah\" means \"with\" or \"together with.\" For example, \"racht wayah\" means \"I went with him.\"",
        },
      },
    ],
  },

  /* ─────────────────────────────────────────────────────────────
     3. Expert Challenge  (hard)
  ───────────────────────────────────────────────────────────── */
  {
    title: { ar: "تحدي الخبراء", en: "Expert Challenge" },
    difficulty: "hard",
    isActive: true,
    questions: [
      {
        category: "history",
        question: {
          ar: "في أي عام صدر أول دستور للكويت؟",
          en: "In what year was Kuwait's first constitution enacted?",
        },
        options: [
          { ar: "1961", en: "1961" },
          { ar: "1962", en: "1962" },
          { ar: "1963", en: "1963" },
          { ar: "1965", en: "1965" },
        ],
        answer: 1,
        explanation: {
          ar: "صدر أول دستور كويتي في 11 نوفمبر 1962، بعد عام واحد من الاستقلال، وهو من أوائل الدساتير العربية التي نصّت على سيادة الشعب.",
          en: "Kuwait's first constitution was enacted on November 11, 1962 — one year after independence — making it one of the earliest Arab constitutions to enshrine popular sovereignty.",
        },
      },
      {
        category: "geography",
        question: {
          ar: "ما هي المساحة التقريبية للكويت بالكيلومتر المربع؟",
          en: "What is the approximate area of Kuwait in square kilometres?",
        },
        options: [
          { ar: "11,000",  en: "11,000"  },
          { ar: "17,818",  en: "17,818"  },
          { ar: "24,000",  en: "24,000"  },
          { ar: "8,500",   en: "8,500"   },
        ],
        answer: 1,
        explanation: {
          ar: "تبلغ مساحة الكويت نحو 17,818 كم²، مما يجعلها من أصغر دول الخليج مساحةً لكن من أكثرها كثافةً سكانية نسبياً.",
          en: "Kuwait covers approximately 17,818 km², making it one of the smaller Gulf states by land area yet notably dense relative to its size.",
        },
      },
      {
        category: "traditions",
        question: {
          ar: "ما الذي يُعرف بـ\"الغواص\" في التراث الكويتي؟",
          en: "What is a \"ghawwas\" in Kuwaiti heritage?",
        },
        options: [
          { ar: "صياد الأسماك",  en: "Fisherman"    },
          { ar: "غوّاص اللؤلؤ", en: "Pearl diver"   },
          { ar: "صانع السفن",    en: "Boat builder"  },
          { ar: "تاجر البرّ",    en: "Land merchant" },
        ],
        answer: 1,
        explanation: {
          ar: "\"الغواص\" هو المتخصص في استخراج اللؤلؤ من قاع البحر، وكان ركيزة الاقتصاد الكويتي قبل اكتشاف النفط.",
          en: "A \"ghawwas\" is a professional pearl diver who retrieved oysters from the seabed. Pearl diving was the backbone of Kuwait's economy before oil was discovered.",
        },
      },
      {
        category: "landmarks",
        question: {
          ar: "في أي محافظة يقع قصر دسمان، المقرّ الرسمي لأمير الكويت؟",
          en: "In which governorate is Dasman Palace, the official residence of the Emir of Kuwait, located?",
        },
        options: [
          { ar: "الفروانية", en: "Farwaniya" },
          { ar: "العاصمة",  en: "Capital"   },
          { ar: "حولي",      en: "Hawalli"   },
          { ar: "الأحمدي",  en: "Ahmadi"    },
        ],
        answer: 1,
        explanation: {
          ar: "يقع قصر دسمان في محافظة العاصمة بالقرب من الخليج العربي، وهو المقرّ الرسمي لأمير الكويت ومن أبرز المعالم التاريخية.",
          en: "Dasman Palace is located in the Capital Governorate near the Arabian Gulf, serving as the official residence of the Emir and one of Kuwait's most historic landmarks.",
        },
      },
      {
        category: "dialect",
        question: {
          ar: "ماذا تعني أداة الخطاب \"ترا\" في اللهجة الكويتية؟",
          en: "What does the discourse particle \"tura\" mean in Kuwaiti dialect?",
        },
        options: [
          { ar: "هناك",          en: "Over there"       },
          { ar: "اعلم أنّ...",   en: "Be aware that..." },
          { ar: "إذا",           en: "If"               },
          { ar: "لكن",           en: "But"              },
        ],
        answer: 1,
        explanation: {
          ar: "\"ترا\" أداة خطابية تُستخدم لتنبيه المستمع أو التأكيد على شيء، مثل \"ترا البرد شديد اليوم\" أي \"اعلم أن الجو بارد جداً\".",
          en: "\"Tura\" is a discourse particle used to alert the listener or emphasise something. For example, \"tura il-bard shadeed\" means \"You should know, it's very cold today\" — similar to \"FYI\" or \"heads up.\"",
        },
      },
    ],
  },
];

module.exports = quizzes;
