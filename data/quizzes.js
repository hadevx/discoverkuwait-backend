const quizzes = [
  {
    title: {
      ar: "معلومات عامة عن الكويت",
      en: "General Knowledge About Kuwait",
    },
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
          { ar: "أربع محافظات", en: "Four governorates" },
          { ar: "خمس محافظات", en: "Five governorates" },
          { ar: "ست محافظات",  en: "Six governorates"  },
          { ar: "سبع محافظات", en: "Seven governorates" },
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
];

module.exports = quizzes;
