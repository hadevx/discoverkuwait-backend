const topics = [
  // General topics
  {
    author: "Admin",
    title: "🎓 Welcome to AUKNOTES Forum",
    description: `
    <p>Welcome to the AUKNOTES community! 🎉</p>
    <p>This forum is a space for AUK students to connect, discuss university life, share notes, and support each other academically and socially.</p>
    <p>Please keep these guidelines in mind when posting:</p>
    <ul>
      <li>✅ Be respectful and considerate — everyone’s here to learn and grow.</li>
      <li>💬 Keep discussions meaningful and relevant to AUK students.</li>
      <li>🚫 Avoid spam, promotions, or inappropriate content.</li>
      <li>📘 Share knowledge, ask questions, and help others when you can.</li>
    </ul>
    <p>Let’s build a positive and helpful community together. Welcome aboard! 🌟</p>
  `,
    category: "General",
    isClosed: false,
    likes: [],
  },
  {
    author: "Admin",
    title: "👩‍🏫 Discuss Your Professors — Share & Learn Together",
    description: `
    <p>Welcome to the <strong>Professor Discussions</strong> section! 🎓</p>
    <p>This space is for students to share insights about professors — teaching styles, course tips, and classroom experiences — to help others make informed choices.</p>
    <p>Please follow these simple rules:</p>
    <ul>
      <li>✅ Be respectful — share constructive feedback, not personal attacks.</li>
      <li>💬 Keep discussions factual and related to learning experiences.</li>
      <li>🚫 No disrespectful, defamatory, or inappropriate comments.</li>
      <li>📘 Focus on helping fellow students, not gossip or complaints.</li>
    </ul>
    <p>Let’s keep this space helpful, respectful, and student-driven. 🌟</p>
  `,
    category: "Professor",
    isClosed: false,
    likes: [],
  },

  {
    author: "",
    title: "Best way to prepare for Data Structures exam?",
    description:
      "<p>Can anyone share useful notes or tips for the upcoming Data Structures exam? I’m struggling with linked lists and trees.</p>",
    category: "General",
    isClosed: false,
    likes: [],
  },
  {
    author: "",
    title: "Where can I find previous year physics papers?",
    description:
      "<p>Hey everyone, does anyone have a collection of previous year physics papers? Preferably 2023–2024.</p>",
    category: "General",
    isClosed: false,
    likes: [],
  },
  {
    author: "",
    title: "Share your best productivity tools!",
    description:
      "<p>What apps or browser extensions do you use to stay focused during study sessions? I personally use Notion + Pomofocus.</p>",
    category: "General",
    isClosed: false,
    likes: [],
  },
  {
    author: "",
    title: "Need help understanding recursion",
    description:
      "<p>I can’t wrap my head around recursion in JavaScript. Could someone explain it with a simple example?</p>",
    category: "General",
    isClosed: false,
    likes: [],
  },

  // Professor topics (reviews/questions)
  {
    author: "",
    title: "Professor Smith – Teaching Style",
    description:
      "<p>How does Professor Smith explain complex topics? Is the class engaging or mostly lectures?</p>",
    category: "Professor",
    isClosed: false,
    likes: [],
  },
  {
    author: "",
    title: "Professor Johnson – Difficulty Level",
    description:
      "<p>Has anyone taken Professor Johnson's AI course? How tough is it compared to other courses?</p>",
    category: "Professor",
    isClosed: false,
    likes: [],
  },
  {
    author: "",
    title: "Professor Lee – Exam Preparation Tips",
    description:
      "<p>How should I prepare for Professor Lee’s exams? Any advice or past experiences?</p>",
    category: "Professor",
    isClosed: false,
    likes: [],
  },
  {
    author: "",
    title: "Professor Adams – Recommended or Not?",
    description:
      "<p>Would you recommend taking Professor Adams’ course next semester? Why or why not?</p>",
    category: "Professor",
    isClosed: false,
    likes: [],
  },
];

module.exports = topics;
