const blogs = [
  {
    id: 'from-electrical-engineering-to-web-development',
    title:
      'From Electrical Engineering to Web Development: My Unexpected Journey into Coding',
    excerpt:
      'If someone had asked me during my first year of college whether I would ever lead the technical team of a coding club, I would have laughed. This is the story of how curiosity slowly turned into passion.',
    content: [
      {
        type: 'heading',
        text: 'Introduction',
      },
      {
        type: 'paragraph',
        text: 'If someone had asked me during my first year of college whether I would ever lead the technical team of a coding club, I would have laughed and said no. I am an Electrical Engineering student, and when I entered college, coding was not even on my radar. I had no real idea what software development meant, how websites were built, or what developers actually did.',
      },
      {
        type: 'paragraph',
        text: 'But college has a funny way of changing people. Sometimes all it takes is one small exposure, one event, or one conversation to shift your direction completely. This blog is about how that shift happened for me and how curiosity slowly turned into passion.',
      },
      {
        type: 'heading',
        text: 'First Year: A Student Without Direction in Coding',
      },
      {
        type: 'paragraph',
        text: 'When I joined college as a first year Electrical Engineering student, my focus was simple. Attend classes, adjust to hostel life, make friends, and understand how college works. Coding felt like something only Computer Science students did. I believed it was too late for me to even think about entering that world.',
      },
      {
        type: 'paragraph',
        text: 'During our induction program, the college introduced us to different student clubs. There were clubs for robotics, photography, music, literature, and of course, coding. At that time, I did not have any clear interests, so I decided to explore everything. I joined almost every club just to see what each one offered.',
      },
      {
        type: 'paragraph',
        text: 'One of those clubs was our college coding club, Codebreakers. At that moment, joining it felt like just another item on the list. I did not know it would end up changing my college life.',
      },
      {
        type: 'heading',
        text: 'The Day That Sparked My Curiosity',
      },
      {
        type: 'paragraph',
        text: 'When I attended my first session with Codebreakers, everything felt new and exciting. Seniors were talking about different domains like web development, app development, open source, UI/UX, and competitive programming.',
      },
      {
        type: 'paragraph',
        text: 'It was the first time I realized that coding is not just about writing difficult programs. It is about building things. Real things. Websites, apps, tools, and ideas that people actually use.',
      },
      {
        type: 'paragraph',
        text: 'That session planted a small seed of curiosity in my mind. I returned to my hostel room that day thinking about what I had heard. For the first time, I wanted to try building something myself.',
      },
      {
        type: 'heading',
        text: 'Starting With the Basics: HTML, CSS, and JavaScript',
      },
      {
        type: 'paragraph',
        text: 'Luckily, I had a tiny advantage. During my +2, I had learned the basics of HTML. It was very basic knowledge, but it gave me the confidence to start somewhere.',
      },
      {
        type: 'paragraph',
        text: 'That night, I opened my laptop and decided to build a simple webpage. Nothing fancy. Just text, colors, and a few buttons. But the feeling of creating something that worked in a browser was amazing.',
      },
      {
        type: 'paragraph',
        text: 'From there, I started learning:',
      },
      {
        type: 'list',
        items: [
          'HTML to structure pages',
          'CSS to style them',
          'JavaScript to add interactivity',
        ],
      },
      {
        type: 'paragraph',
        text: 'I began building small projects:',
      },
      {
        type: 'list',
        items: [
          'Personal profile pages',
          'Simple landing pages',
          'Small interactive web elements',
        ],
      },
      {
        type: 'paragraph',
        text: 'Every small project made me more curious. I wanted to know how real websites worked. Slowly, my interest in development started growing.',
      },
      {
        type: 'heading',
        text: 'Learning Without Courses',
      },
      {
        type: 'paragraph',
        text: 'One thing about my journey is that I did not follow traditional learning paths. I did not enroll in paid courses or follow long playlists.',
      },
      {
        type: 'paragraph',
        text: 'Instead, I focused mainly on documentation. Yes, official documentation. Whenever I picked a new technology, I would go straight to the official website and read the docs. At first, it felt difficult. Documentation can look scary when you are a beginner. But over time, I realized that docs are the most reliable and up to date learning resource.',
      },
      {
        type: 'paragraph',
        text: 'My learning process became simple:',
      },
      {
        type: 'list',
        items: [
          'Pick a tech stack',
          'Read the official documentation',
          'Try building something with it',
          'Learn by doing',
        ],
      },
      {
        type: 'paragraph',
        text: 'And whenever I got stuck or faced errors, I followed a simple habit. I copied the error and searched for solutions. Often, I would ask ChatGPT to explain the error, understand the problem, and then try to fix the code myself. This helped me understand the logic behind mistakes instead of just copying solutions.',
      },
      {
        type: 'paragraph',
        text: 'This approach is often called learning by building, and it worked perfectly for me.',
      },
      {
        type: 'heading',
        text: 'Discovering React: A Turning Point',
      },
      {
        type: 'paragraph',
        text: 'After building several small websites using HTML, CSS, and JavaScript, I started hearing a lot about React. Many developers in the club were talking about it, and I kept seeing it mentioned in developer discussions.',
      },
      {
        type: 'paragraph',
        text: 'So I decided to explore it. Learning React felt like a big step forward. At first, concepts like components, props, and state felt confusing. But once things started making sense, everything clicked.',
      },
      {
        type: 'paragraph',
        text: 'React changed how I thought about development:',
      },
      {
        type: 'list',
        items: [
          'I understood how modern web apps are structured',
          'I learned how to break big problems into small components',
          'I started writing cleaner and reusable code',
        ],
      },
      {
        type: 'paragraph',
        text: 'Working with React gave me confidence. For the first time, I felt like I truly understood the basics of development.',
      },
      {
        type: 'heading',
        text: 'From Member to Leader',
      },
      {
        type: 'paragraph',
        text: 'As months passed, I kept building projects and staying active in the coding club. I participated in discussions, helped juniors when I could, and kept improving my skills.',
      },
      {
        type: 'paragraph',
        text: 'Without realizing it, coding had become a major part of my daily routine. What started as curiosity turned into passion.',
      },
      {
        type: 'paragraph',
        text: 'Eventually, I got the opportunity to lead the technical team of Codebreakers. Becoming the Technical Lead of the college coding club was something I never imagined when I first walked into that induction program.',
      },
      {
        type: 'paragraph',
        text: 'Along with this, I also became the Campus Mantri of GeeksforGeeks for my college, Government College of Engineering, Kalahandi. This role gave me the chance to connect students with learning resources, organize technical events, and help more students start their journey in tech.',
      },
      {
        type: 'paragraph',
        text: 'Now, I help:',
      },
      {
        type: 'list',
        items: [
          'Organize technical sessions',
          'Guide juniors starting their coding journey',
          'Share resources and learning paths',
          'Encourage students from non-CS branches to start coding',
        ],
      },
      {
        type: 'paragraph',
        text: 'Because I know exactly how it feels to start from zero.',
      },
      {
        type: 'heading',
        text: 'Lessons From My Journey',
      },
      {
        type: 'list',
        items: [
          'You do not need to be from Computer Science to start coding. I come from Electrical Engineering, and many amazing developers come from non-CS backgrounds.',
          'Start small. Your first webpage does not need to be perfect. Just start building.',
          'Documentation is powerful. Learning how to read docs is a superpower for developers.',
          'Errors are part of learning. Every error is a lesson in disguise.',
          'Curiosity can change your path. All it takes is one step to discover a new passion.',
        ],
      },
      {
        type: 'heading',
        text: 'Where I Am Now',
      },
      {
        type: 'paragraph',
        text: 'Today, I am still learning, still building, and still exploring. Development is a field where learning never stops. Every new project teaches something new.',
      },
      {
        type: 'paragraph',
        text: 'And it all started with a single club session during the college induction program.',
      },
      {
        type: 'paragraph',
        text: 'If you are someone who feels late, confused, or unsure about starting coding, I hope my story gives you confidence. You do not need a perfect beginning. You just need the courage to take the first step.',
      },
      {
        type: 'heading',
        text: 'Final Thoughts',
      },
      {
        type: 'paragraph',
        text: 'My journey into development was unexpected, unplanned, and completely self driven. From knowing nothing about coding to leading the technical team of a coding club and becoming the Campus Mantri of GeeksforGeeks, the journey has been exciting and full of learning.',
      },
      {
        type: 'paragraph',
        text: 'And this is just the beginning.',
      },
    ],
    date: '2025-11-12',
    updatedAt: '2026-02-25',
    tags: ['Personal', 'Web Development', 'React', 'Career', 'Learning'],
  },
    {
    id: 'cve-2025-55184-and-cve-2025-55183',
    title:
      "CVE-2025-55184 and CVE-2025-55183: What They Are, Who's at Risk, and How to Patch Fast",
    excerpt:
      'React Server Components (RSC) have pushed the React ecosystem into a new era — but that power has expanded the security surface. Two follow-on CVEs affecting RSC packages demand immediate attention.',
    content: [
      {
        type: 'paragraph',
        text: 'React Server Components (RSC) have pushed the React ecosystem into a new era: more code runs on the server, more data flows through framework-owned endpoints, and more "magic" happens between the browser and your backend. That power is exactly why the security surface area has expanded. In December 2025, the React team (and vendors like Vercel) highlighted two follow-on vulnerabilities affecting React Server Components packages and the frameworks that ship them: CVE-2025-55184 (pre-auth DoS) and CVE-2025-55183 (source code exposure in specific configurations). This post breaks down what these CVEs mean in practical terms, what "affected" really looks like in a modern Next.js or RSC setup, and how to reduce risk quickly without turning your incident response into a week-long refactor.',
      },
      {
        type: 'heading',
        text: 'Quick context: why these CVEs showed up now',
      },
      {
        type: 'paragraph',
        text: 'If you followed the earlier "React2Shell" disclosure (CVE-2025-55182), you already know the pattern: once a major issue is reported, a lot of researchers and defenders start auditing nearby code paths and edge cases. Vercel\'s bulletin explicitly calls these "follow-on" findings after the earlier disclosure and stresses that they still require immediate patching.',
      },
      {
        type: 'paragraph',
        text: 'Two important points that help frame the risk: these two CVEs are not remote code execution — Vercel calls that out directly. But they still matter a lot operationally. One can hang your server process (availability impact), and the other can disclose server-side code under certain conditions (confidentiality impact).',
      },
      {
        type: 'heading',
        text: 'What software is affected',
      },
      {
        type: 'paragraph',
        text: 'Both CVEs target the React Server Components implementation packages: react-server-dom-webpack, react-server-dom-parcel, and react-server-dom-turbopack — and affect a set of React 19.x versions called out by NVD and vendor guidance.',
      },
      {
        type: 'heading',
        text: 'Why Next.js teams should care',
      },
      {
        type: 'paragraph',
        text: "In the RSC world, frameworks often provide endpoints and wiring that you didn't explicitly build yourself. React's guidance notes that apps can be impacted if they support React Server Components, even if they don't think they \"implemented\" specific endpoints.",
      },
      {
        type: 'paragraph',
        text: "Vercel also states that these issues affect React 19 and Next.js versions across major lines (13.x through 16.x) depending on how RSC is used. If you are running any RSC-capable stack (Next.js App Router, or other frameworks/plugins embedding RSC), you should assume you're in scope until you verify versions.",
      },
      {
        type: 'heading',
        text: 'CVE-2025-55184: pre-auth denial of service via unsafe deserialization',
      },
      {
        type: 'paragraph',
        text: 'CVE-2025-55184 is a pre-auth DoS vulnerability where a crafted HTTP request sent to a "Server Function" style endpoint can trigger behavior that results in an infinite loop, effectively hanging the server process and preventing it from serving future requests. NVD\'s description is very direct: unsafe deserialization of request payloads can cause an infinite loop that hangs the server process.',
      },
      {
        type: 'paragraph',
        text: 'A DoS bug is not just "the server slows down." In the RSC case, the impact can be worse because it is pre-auth (the attacker does not need a login session), it can hang a process (if your deployment model is a small number of long-lived Node processes, a hang can starve the service), and it can cascade (once health checks fail and instances restart, repeated requests can keep pushing the system into instability).',
      },
      {
        type: 'list',
        items: [
          'Sudden spikes in CPU with no corresponding traffic increase.',
          'Node process event loop lag and timeouts.',
          'Requests hanging rather than failing quickly.',
          "Autoscaling events that don't stabilize error rate.",
          'A pattern of repeated requests to RSC-related endpoints, often with unusual payload size or shape.',
        ],
      },
      {
        type: 'paragraph',
        text: "React's advisory lists CVE-2025-55184 as high severity with CVSS 7.5.",
      },
      {
        type: 'heading',
        text: 'CVE-2025-55183: source code exposure in specific configurations',
      },
      {
        type: 'paragraph',
        text: 'CVE-2025-55183 is an information leak where a specially crafted HTTP request to a vulnerable Server Function can cause the server to return the source code of Server Functions (or compiled server action code, depending on the framework and setup). In specific configurations, a crafted HTTP request may unsafely return the source code of any Server Function.',
      },
      {
        type: 'paragraph',
        text: 'Vercel frames the impact similarly and adds an important nuance: it can reveal business logic, but it would not expose secrets unless you hardcoded them into the server action\'s code. Even so, disclosed server code can still be damaging through business logic leakage, security weakness discovery, and follow-on exploits — source disclosure often turns "hard to find" vulnerabilities into "easy to weaponize" ones.',
      },
      {
        type: 'paragraph',
        text: "React's advisory lists CVE-2025-55183 as medium severity with CVSS 5.3.",
      },
      {
        type: 'heading',
        text: 'Am I vulnerable? A practical checklist',
      },
      {
        type: 'list',
        items: [
          "Are you using React 19 with RSC support? If your stack includes RSC packages (directly or via a framework), you're in the blast radius.",
          "Are you on Next.js App Router (or similar RSC-backed routing)? Vercel's bulletin specifically discusses App Router endpoints and Next.js affected ranges.",
          "What versions are you actually running in production? Don't trust package.json alone. Confirm deployed artifact versions (lockfile resolution, build cache, container layers, etc.).",
        ],
      },
      {
        type: 'heading',
        text: 'How to fix: patching guidance that actually works',
      },
      {
        type: 'paragraph',
        text: 'The priority order: upgrade to patched versions (this is the real fix), add WAF / edge protections to reduce exposure while rolling out updates, and assume potential disclosure and rotate sensitive material if there is any chance it could have been in code or logs.',
      },
      {
        type: 'paragraph',
        text: 'React\'s official advisory includes concrete Next.js upgrade commands for multiple release lines, pointing to specific patched versions (examples include next@14.2.35, next@15.0.7, and other 15.x/16.x patch versions). Vercel\'s bulletin also provides a "Patched versions" table across Next.js release trains, and notes that Pages Router apps are not affected.',
      },
      {
        type: 'paragraph',
        text: 'If you are using RSC via other frameworks, bundlers, or plugins, the key is still: move off the affected RSC package versions and onto patched ones. Vercel lists examples of other frameworks/plugins that can be affected if they embed or depend on RSC implementations.',
      },
      {
        type: 'heading',
        text: 'Mitigations while you patch',
      },
      {
        type: 'paragraph',
        text: 'Vercel says it deployed WAF rules to help protect projects hosted on Vercel and emphasizes that WAF rules are an additional layer, not a substitute for upgrading. If you are not on Vercel, use your CDN/WAF (Cloudflare, Fastly, Akamai, etc.) to block known malicious request patterns, rate limit suspicious clients, and add stricter request size limits on relevant routes.',
      },
      {
        type: 'list',
        items: [
          'Per-IP and per-token rate limits, especially unauthenticated.',
          'Timeouts around server function execution.',
          'Global concurrency caps for server action handlers.',
          'Health checks that detect event loop stalls and remove instances quickly.',
        ],
      },
      {
        type: 'heading',
        text: 'Post-patch hygiene: assume the worst',
      },
      {
        type: 'paragraph',
        text: 'If CVE-2025-55183 could have applied, treat it like a "code exposure" incident. Vercel notes secrets are only exposed if hardcoded, but "hardcoded secrets" happen more than teams want to admit — including accidentally (temporary debug keys, copied snippets, or test credentials).',
      },
      {
        type: 'list',
        items: [
          'Search server action / server function code for anything that looks like secrets (API keys, tokens, private URLs).',
          'Rotate environment variables that would be damaging if discovered.',
          'Check logs for unusual requests to RSC endpoints and for responses that look like code.',
          'Add targeted monitoring around RSC endpoints: request volume, error rate, high CPU with low throughput, and long request durations.',
        ],
      },
      {
        type: 'heading',
        text: 'What not to do',
      },
      {
        type: 'paragraph',
        text: "Don't rely on \"we're behind auth\" unless you proved it — CVE-2025-55184 is pre-auth by design, and framework routing can expose endpoints you didn't expect. Don't assume your WAF fully solves it — even Vercel, while providing WAF protection, still requires upgrading. Don't treat source exposure as harmless — code disclosure accelerates future attacks, even without secrets.",
      },
      {
        type: 'heading',
        text: 'A simple action plan you can execute today',
      },
      {
        type: 'list',
        items: [
          'Inventory where React 19 RSC packages are used (directly or via Next.js / bundler plugins).',
          'Upgrade Next.js or your RSC packages to the patched versions for your release line.',
          'Deploy temporary protections (WAF rules, rate limits) during rollout.',
          'Rotate secrets if there is any chance they were hardcoded or could have been disclosed.',
          'Add monitoring specifically for RSC endpoints and server action routes.',
        ],
      },
      {
        type: 'paragraph',
        text: 'RSC is not "unsafe," but it is new enough that patterns are still settling, and attackers are paying attention because the payoff is high: server endpoints that parse complex payloads, often reachable without auth, inside widely deployed frameworks. CVE-2025-55184 (DoS) and CVE-2025-55183 (source disclosure) are exactly the sort of issues you should expect to see more of as the ecosystem matures. Patch quickly, add guardrails, and assume anything "automatic" in your framework deserves the same threat modeling you would apply to an API endpoint you wrote by hand.',
      },
    ],
    date: '2025-12-18',
    updatedAt: '2025-12-18',
    tags: ['React', 'RSC', 'Next.js', 'CVE', 'Security'],
  },
];

export default blogs;