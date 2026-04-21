// vynqeContent.jsx
// Pure content — no styling, no UI. Import and use wherever needed.

export const industries = [

  // ─────────────────────────────────────────────
  //  MICROSITES
  // ─────────────────────────────────────────────
  {
    id: "microsites",
    name: "Microsites",
    stakeholders: ["Brand", "Marketing", "Product", "Customer", "Analytics", "Growth"],
    color: "#0D652D",
    products: [
      {
        id: "ms-1",
        level1: {
          title: "Message to Outcome Visibility",
          subtitle: "Understand how every message contributes to real user progression and final outcomes.",
        },
        level2: {
          title: "Message to Outcome Visibility",
          subtitle: "Go beyond delivery and engagement to see how communication drives actual user journeys.",
          description:
            "This capability connects messaging interactions with what users do next across their journey, giving a continuous view of how engagement evolves over time. Instead of treating messages, sessions, and touchpoints as separate events, it brings them together into a unified progression view. This makes it easier to understand how users move forward, where journeys lose momentum, and how different interactions contribute to outcomes.",
          howItWorks: [
            "Connects messaging interactions with user actions across the full journey",
            "Unifies messages, sessions, and touchpoints into a single progression view",
            "Reveals where journeys lose momentum and what drives outcomes",
          ],
          stat: "Move from measuring messages to understanding outcomes.",
        },
        level3: {
          hero: "Move from measuring messages to understanding outcomes.",
          positioning: "Unified message-to-outcome visibility across the full user journey.",
          theGap: {
            heading: "THE BEFORE STATE",
            points: [
              "Messaging platforms provide strong visibility into delivery and engagement, but the journey beyond that often becomes unclear.",
              "Once users move across touchpoints or return in later sessions, it becomes difficult to fully understand how communication influences their progression.",
              "This creates gaps between messaging activity and actual outcomes, limiting clarity on what truly drives results.",
            ],
          },
          ourBuild: {
            heading: "HOW IT WORKS",
            points: [
              "Brings together user interactions across different moments in the journey to create a connected view of progression.",
              "Captures how users respond, return, and move forward over time.",
              "Allows teams to see how communication aligns with actual behavior.",
              "Provides a cohesive understanding of how different interactions contribute to movement toward completion — without exposing underlying systems.",
            ],
          },
          whatWeSolve: {
            heading: "OUTCOMES",
            points: [
              "Teams gain a clearer understanding of how communication impacts real outcomes.",
              "Enables better decision-making and more effective optimization of user journeys.",
              "Improved conversion efficiency and stronger alignment between engagement and results.",
              "More confidence in campaign performance.",
            ],
          },
          output: {
            heading: "WHAT YOU STOP DOING",
            points: [
              "Relying on isolated engagement metrics or assumptions about what drives conversions.",
              "Piecing together fragmented journey data.",
              "Depending on guesswork when evaluating performance.",
            ],
            summary:
              "Connect every message to real user progression — replacing fragmented engagement metrics with a unified view of what actually drives outcomes.",
          },
        },
      },
      {
        id: "ms-2",
        level1: {
          title: "Microsite Engagement Intelligence",
          subtitle: "Don't just see who clicked—understand what they actually cared about.",
        },
        level2: {
          title: "Microsite Engagement Intelligence",
          subtitle: "See how users explore, what grabs their attention, and where real interest starts to build.",
          description:
            "Once someone lands on your microsite, this gives you a clearer sense of what they actually do next. You're not just looking at visits anymore — you start seeing how people move through the page, what they spend time on, and what seems to catch their interest. It helps you move from 'they clicked' to 'this is what they were actually looking for.'",
          howItWorks: [
            "Reveals how users move through the page and what they spend time on",
            "Surfaces patterns in attention and engagement depth",
            "Connects on-page behavior to actual user intent",
          ],
          stat: "Start seeing what your users actually care about—not just that they showed up.",
        },
        level3: {
          hero: "Start seeing what your users actually care about—not just that they showed up.",
          positioning: "Deep behavioral intelligence for what happens inside your microsite.",
          theGap: {
            heading: "THE BEFORE STATE",
            points: [
              "Most teams know when someone clicks a message and lands on a microsite, but after that, things get blurry.",
              "You can't really tell what they explored, what stood out to them, or whether they were genuinely interested or just passing through.",
              "Even though traffic is coming in, the actual story of user intent is still missing.",
            ],
          },
          ourBuild: {
            heading: "HOW IT WORKS",
            points: [
              "Brings the missing layer of on-site engagement into view.",
              "Helps you understand how users are actually engaging once they arrive — what they're paying attention to, how far they're exploring, and how their interest builds.",
              "Instead of guessing what worked, you start seeing patterns in how people behave and what draws them closer to taking action.",
            ],
          },
          whatWeSolve: {
            heading: "OUTCOMES",
            points: [
              "A much clearer sense of user intent, making it easier to improve your microsite experience.",
              "Follow-up that actually feels relevant to what users showed interest in.",
              "Better-quality leads, stronger engagement, and smoother paths to conversion.",
            ],
          },
          output: {
            heading: "WHAT YOU STOP DOING",
            points: [
              "Treating every click the same and guessing what users might have been interested in.",
              "Relying only on surface-level metrics.",
              "Making decisions without knowing what really happened on the page.",
            ],
            summary:
              "Go beyond traffic counts — understand what users actually explored, where interest built, and what drove them toward action.",
          },
        },
      },
      {
        id: "ms-3",
        level1: {
          title: "Cross-Session Journey Continuity",
          subtitle: "Pick up every user journey right where it left off.",
        },
        level2: {
          title: "Cross-Session Journey Continuity",
          subtitle: "See how users move across time, not just within a single visit.",
          description:
            "Users rarely complete a journey in one go. They drop off, come back later, and often return through a different channel. This helps you stay connected to that flow, so instead of seeing separate visits, you start seeing one continuous journey that unfolds over time.",
          howItWorks: [
            "Stitches disconnected sessions into a single continuous journey view",
            "Tracks how intent evolves across return visits and different channels",
            "Removes the friction of treating each visit as a fresh start",
          ],
          stat: "Stay connected to the journey—even when your users aren't.",
        },
        level3: {
          hero: "Stay connected to the journey—even when your users aren't.",
          positioning: "Continuous cross-session journey tracking that keeps context alive.",
          theGap: {
            heading: "THE BEFORE STATE",
            points: [
              "User journeys are often broken into separate sessions.",
              "Someone might explore today, return after a few days, and continue from where they left off — but these show up as disconnected interactions.",
              "This makes it hard to understand what influenced their decisions or how their journey actually progressed.",
            ],
          },
          ourBuild: {
            heading: "HOW IT WORKS",
            points: [
              "Brings disconnected moments together into a single, connected view.",
              "Helps you understand how users return, what they continue from, and how their intent evolves over time.",
              "Instead of treating each visit as new, you start seeing how everything connects — without needing to worry about how it's stitched together behind the scenes.",
            ],
          },
          whatWeSolve: {
            heading: "OUTCOMES",
            points: [
              "A clearer picture of the full journey, making it easier to engage users in a way that feels relevant to where they actually are.",
              "Smoother experiences and better conversion outcomes.",
            ],
          },
          output: {
            heading: "WHAT YOU STOP DOING",
            points: [
              "Treating every session like a fresh start.",
              "Guessing what a returning user has already done.",
              "Maintaining a fragmented understanding of the same journey.",
            ],
            summary:
              "See every return visit as a continuation — not a restart — and engage users with the full context of where they've already been.",
          },
        },
      },
      {
        id: "ms-4",
        level1: {
          title: "Campaign-to-Conversion Attribution",
          subtitle: "Know which conversations actually led to conversion.",
        },
        level2: {
          title: "Campaign-to-Conversion Attribution",
          subtitle: "Move beyond campaign metrics to understand what truly drives results.",
          description:
            "Campaigns rarely work in isolation. A user might engage with multiple messages, across different channels, before finally converting. This capability helps you see how those interactions come together, so you can understand which campaigns actually influenced the outcome — not just which ones got attention.",
          howItWorks: [
            "Maps the full multi-touchpoint journey leading to conversion",
            "Shows how engagement builds across campaigns over time",
            "Attributes outcomes to the interactions that actually made a difference",
          ],
          stat: "Know what actually drives conversion—not just what gets clicks.",
        },
        level3: {
          hero: "Know what actually drives conversion—not just what gets clicks.",
          positioning: "Multi-touch campaign attribution that connects effort to real outcomes.",
          theGap: {
            heading: "THE BEFORE STATE",
            points: [
              "Most teams can see how campaigns perform in terms of delivery, clicks, and engagement.",
              "But when it comes to understanding what actually led to a conversion, things get unclear.",
              "Users often interact with multiple touchpoints before taking action, making it difficult to pinpoint which campaign truly made the difference.",
              "This creates gaps in attribution and makes it harder to confidently optimize spend and strategy.",
            ],
          },
          ourBuild: {
            heading: "HOW IT WORKS",
            points: [
              "Brings clarity to the journey by helping you understand how different campaign interactions contribute to the final outcome.",
              "Looks at the journey as a whole, not just individual touchpoints.",
              "Shows how engagement builds over time and which interactions play a meaningful role in conversion — without exposing any underlying complexity.",
            ],
          },
          whatWeSolve: {
            heading: "OUTCOMES",
            points: [
              "A clearer understanding of what's actually working.",
              "Smarter decisions around campaign strategy and budget allocation.",
              "Focus on the interactions that truly drive results, improving overall marketing effectiveness and ROI.",
            ],
          },
          output: {
            heading: "WHAT YOU STOP DOING",
            points: [
              "Relying on last-click assumptions or giving credit to the wrong touchpoints.",
              "Guessing which campaigns are actually performing versus just generating engagement.",
            ],
            summary:
              "Replace last-click guesswork with a full-journey attribution model that shows which campaigns actually moved users to convert.",
          },
        },
      },
      {
        id: "ms-5",
        level1: {
          title: "Decision Transparency",
          subtitle: "Understand why users are receiving what they receive.",
        },
        level2: {
          title: "Decision Transparency",
          subtitle: "Bring clarity into how engagement decisions are made across the user journey.",
          description:
            "As communication becomes more automated, it can sometimes feel like messages are being sent without clear visibility into why. This capability helps you understand the reasoning behind user engagement — what triggered a message, why a certain path was taken, and how different signals contributed to that decision. It turns automated flows into something you can actually interpret and trust.",
          howItWorks: [
            "Surfaces the factors that influenced each engagement decision",
            "Provides a readable view of why users received specific messages",
            "Makes automated flows interpretable without exposing underlying logic",
          ],
          stat: "Understand the why behind every interaction.",
        },
        level3: {
          hero: "Understand the why behind every interaction.",
          positioning: "Transparent engagement decision visibility for automated communication flows.",
          theGap: {
            heading: "THE BEFORE STATE",
            points: [
              "With increasing automation, messages are often triggered based on multiple signals across systems.",
              "While these flows work in the background, teams don't always have clear visibility into why a user received a specific message or why a certain engagement path was chosen.",
              "This lack of clarity can make it difficult to optimize journeys, debug issues, or confidently refine strategies.",
            ],
          },
          ourBuild: {
            heading: "HOW IT WORKS",
            points: [
              "Brings visibility into how engagement decisions come together.",
              "Helps you understand the factors that influenced a particular interaction.",
              "Provides a clearer view of why users are being engaged in certain ways — without exposing any underlying logic or systems.",
              "Makes it easier to interpret and act on what's happening.",
            ],
          },
          whatWeSolve: {
            heading: "OUTCOMES",
            points: [
              "More confidence in how your engagement flows operate.",
              "Easier to optimize, refine, and govern flows over time.",
              "Better decision-making, improved user experiences, and more consistent outcomes.",
            ],
          },
          output: {
            heading: "WHAT YOU STOP DOING",
            points: [
              "Second-guessing your automation or trying to manually trace why something happened.",
              "Operating in the dark when it comes to engagement decisions.",
            ],
            summary:
              "Turn black-box automation into something you can read, trust, and improve — with clear visibility into why every engagement decision was made.",
          },
        },
      },
      {
        id: "ms-6",
        level1: {
          title: "High-Intent Conversion Detection",
          subtitle: "Spot when a user is actually ready to take action.",
        },
        level2: {
          title: "High-Intent Conversion Detection",
          subtitle: "Identify moments when user interest turns into real intent.",
          description:
            "Not all engagement is equal. Some users are just exploring, while others are getting close to making a decision. This capability helps you recognize those high-intent moments — when a user is actively considering taking the next step — so you can respond at the right time with the right nudge.",
          howItWorks: [
            "Identifies behavioral signals that indicate genuine readiness to convert",
            "Distinguishes casual browsing from high-intent decision-making",
            "Enables timely, relevant engagement at the moment it matters most",
          ],
          stat: "Act when it matters most—right at the moment of intent.",
        },
        level3: {
          hero: "Act when it matters most—right at the moment of intent.",
          positioning: "Behavioral intent detection that surfaces conversion-ready users in real time.",
          theGap: {
            heading: "THE BEFORE STATE",
            points: [
              "Most engagement signals are treated the same.",
              "A click, a visit, or an interaction might look similar on the surface, but they don't always reflect the same level of intent.",
              "This makes it difficult to distinguish between casual browsing and genuine readiness to convert, leading to missed opportunities or poorly timed follow-ups.",
            ],
          },
          ourBuild: {
            heading: "HOW IT WORKS",
            points: [
              "Helps you identify when a user is showing stronger intent through their behavior.",
              "Gives a clearer sense of when they are closer to taking action.",
              "Instead of reacting to every interaction in the same way, you can focus on moments that actually matter — when interest becomes serious and the likelihood of conversion is higher.",
            ],
          },
          whatWeSolve: {
            heading: "OUTCOMES",
            points: [
              "Engage users at the right moment, making your communication more timely and relevant.",
              "Improved conversion rates and reduced unnecessary noise.",
              "Prioritize efforts where they have the highest impact.",
            ],
          },
          output: {
            heading: "WHAT YOU STOP DOING",
            points: [
              "Treating every interaction as equally important.",
              "Following up too early or too late.",
              "Blanket engagement that ignores where the user actually is in their decision-making process.",
            ],
            summary:
              "Stop engaging everyone the same way — detect high-intent moments and act precisely when users are closest to converting.",
          },
        },
      },
    ],
  },

  // ─────────────────────────────────────────────
  //  ECOMMERCE
  // ─────────────────────────────────────────────
  {
    id: "ecommerce",
    name: "Ecommerce",
    stakeholders: ["Brand", "Shopper", "Merchandising", "Marketing", "Analytics", "Retention"],
    color: "#B06000",
    products: [
      {
        id: "ec-1",
        level1: {
          title: "Messaging-to-Revenue Attribution",
          subtitle: "See how your messages actually translate into revenue.",
        },
        level2: {
          title: "Messaging-to-Revenue Attribution",
          subtitle: "Move beyond engagement metrics to understand what drives actual purchases.",
          description:
            "Messages often play a role in driving purchases, but that connection isn't always clear. This capability helps you understand how messaging contributes to revenue by connecting user interactions with eventual transactions. Instead of just seeing engagement, you start seeing impact.",
          howItWorks: [
            "Connects messaging interactions to eventual purchase transactions",
            "Traces the path from engagement to revenue over time",
            "Shifts measurement from clicks and opens to actual business impact",
          ],
          stat: "See the revenue behind every message.",
        },
        level3: {
          hero: "See the revenue behind every message.",
          positioning: "Direct messaging-to-revenue attribution that replaces proxy metrics with real impact.",
          theGap: {
            heading: "THE BEFORE STATE",
            points: [
              "Most teams can see when messages are delivered, opened, or clicked.",
              "But when it comes to understanding how those interactions translate into actual revenue, the picture is incomplete.",
              "Users may engage with a message, browse products, and make a purchase later — but that connection often isn't clearly visible.",
              "This makes it difficult to measure true ROI or understand the real impact of messaging efforts.",
            ],
          },
          ourBuild: {
            heading: "HOW IT WORKS",
            points: [
              "Brings visibility into how messaging interactions influence purchasing behavior over time.",
              "Helps you see how engagement connects to eventual transactions.",
              "Gives a clearer understanding of which interactions contribute to revenue — without exposing any underlying systems or complexity.",
            ],
          },
          whatWeSolve: {
            heading: "OUTCOMES",
            points: [
              "A more accurate view of how messaging drives revenue.",
              "Better budget allocation, smarter campaign decisions, and stronger overall performance.",
              "Shifts the focus from engagement metrics to actual business impact.",
            ],
          },
          output: {
            heading: "WHAT YOU STOP DOING",
            points: [
              "Relying on proxy metrics like clicks or opens to measure success.",
              "Guessing which campaigns actually generated revenue.",
              "Overvaluing engagement that didn't lead to outcomes.",
            ],
            summary:
              "Replace click-based success metrics with real revenue attribution — connecting every message to the purchases it actually influenced.",
          },
        },
      },
      {
        id: "ec-2",
        level1: {
          title: "Product Interaction Context",
          subtitle: "Understand what users are actually interested in—not just that they visited.",
        },
        level2: {
          title: "Product Interaction Context",
          subtitle: "See how users explore products, compare options, and build intent before buying.",
          description:
            "When users browse an ecommerce experience, they leave behind signals of what they're actually interested in — what they look at, what they compare, and what they keep coming back to. This capability helps you understand that behavior in a more meaningful way, so you can respond based on real interest, not just activity.",
          howItWorks: [
            "Captures how users explore, compare, and revisit products",
            "Builds a richer picture of preference and decision-making patterns",
            "Enables engagement based on actual interest rather than isolated clicks",
          ],
          stat: "Engage based on what users care about—not just what they clicked.",
        },
        level3: {
          hero: "Engage based on what users care about—not just what they clicked.",
          positioning: "Richer product interaction context that reveals what users are actually considering.",
          theGap: {
            heading: "THE BEFORE STATE",
            points: [
              "Most systems can tell when a user clicks into a product or lands on a page.",
              "But they don't fully capture how that user is thinking or deciding.",
              "Whether someone is comparing products, exploring a category, or narrowing down choices often remains unclear.",
              "This makes it harder to personalize engagement or guide users effectively toward a decision.",
            ],
          },
          ourBuild: {
            heading: "HOW IT WORKS",
            points: [
              "Brings more context into how users interact with products during their journey.",
              "Helps you understand patterns in how they explore, what they seem to prefer, and how their interest evolves over time.",
              "Instead of reacting to isolated actions, you start responding to a more complete picture of user intent — without exposing any underlying tracking or logic.",
            ],
          },
          whatWeSolve: {
            heading: "OUTCOMES",
            points: [
              "Engage users in a way that feels more relevant and timely.",
              "Improved user experience and increased likelihood of conversion.",
              "Move from generic messaging to interactions that actually reflect what the user is considering.",
            ],
          },
          output: {
            heading: "WHAT YOU STOP DOING",
            points: [
              "Treating all product views the same.",
              "Sending generic follow-ups that don't reflect real interest.",
              "Guessing what a user might be looking for based on limited signals.",
            ],
            summary:
              "Go beyond page views — understand how users explore and compare products to engage them with context that matches where they actually are in their decision.",
          },
        },
      },
      {
        id: "ec-3",
        level1: {
          title: "Checkout Experience Insight",
          subtitle: "See what's really happening before a purchase is completed.",
        },
        level2: {
          title: "Checkout Experience Insight",
          subtitle: "Understand where users hesitate or drop off in the final step.",
          description:
            "Checkout is where decisions are made, but it's also where things often fall apart. This helps you see how users move through that final step — where they slow down, where they pause, and where they leave — so you're not left guessing what went wrong.",
          howItWorks: [
            "Reveals friction points and hesitation moments within the checkout flow",
            "Surfaces patterns in where users slow down, reconsider, or exit",
            "Enables contextual recovery rather than generic cart abandonment messages",
          ],
          stat: "Understand the drop-off—don't just react to it.",
        },
        level3: {
          hero: "Understand the drop-off—don't just react to it.",
          positioning: "Checkout behavior intelligence that turns drop-off patterns into actionable clarity.",
          theGap: {
            heading: "THE BEFORE STATE",
            points: [
              "You can usually tell when someone starts checkout and whether they finish it.",
              "But everything in between is a black box.",
              "When a user drops off, you don't really know what caused it — was it confusion, friction, or just hesitation?",
              "Without that clarity, improving the experience or recovering users becomes mostly guesswork.",
            ],
          },
          ourBuild: {
            heading: "HOW IT WORKS",
            points: [
              "Gives you a clearer sense of how users move through checkout and where things start to break.",
              "Helps you spot patterns — where people slow down, where they reconsider, and where they exit.",
              "Allows you to respond in a way that actually addresses what's happening, not just react to the drop-off itself.",
            ],
          },
          whatWeSolve: {
            heading: "OUTCOMES",
            points: [
              "Smooth out the checkout experience and reduce unnecessary drop-offs.",
              "Recover users in a more meaningful, context-aware way.",
              "Higher completion rates and a more reliable path to conversion.",
            ],
          },
          output: {
            heading: "WHAT YOU STOP DOING",
            points: [
              "Guessing why users didn't complete their purchase.",
              "Sending the same generic reminders to everyone.",
              "Reacting blindly without the context of what actually happened.",
            ],
            summary:
              "Stop treating checkout abandonment as a black box — understand exactly where and why users drop off, and recover them with relevant context.",
          },
        },
      },
      {
        id: "ec-4",
        level1: {
          title: "Cross-Device Commerce Journey",
          subtitle: "Follow the journey—even when users switch devices.",
        },
        level2: {
          title: "Cross-Device Commerce Journey",
          subtitle: "Understand how users move between devices before they buy.",
          description:
            "Users don't stick to one device. They might discover something on mobile, explore it later on desktop, and complete the purchase somewhere else entirely. This capability helps you stay connected to that journey, so it doesn't feel like separate interactions — it feels like one continuous experience.",
          howItWorks: [
            "Connects activity across mobile, desktop, and other devices into one journey",
            "Preserves context as users shift environments across the path to purchase",
            "Eliminates the fragmented view of multi-device behavior",
          ],
          stat: "Stay with the journey—no matter where it continues.",
        },
        level3: {
          hero: "Stay with the journey—no matter where it continues.",
          positioning: "Unified cross-device journey tracking from discovery to purchase.",
          theGap: {
            heading: "THE BEFORE STATE",
            points: [
              "User activity across devices often appears disconnected.",
              "A single journey can look like multiple unrelated interactions, making it difficult to understand how users actually move from discovery to purchase.",
              "This breaks the overall picture and limits how effectively you can guide or attribute the journey.",
            ],
          },
          ourBuild: {
            heading: "HOW IT WORKS",
            points: [
              "Brings device shifts into one connected view.",
              "Helps you understand how users continue their journey across different environments.",
              "Shows how earlier interactions carry forward — so you're not treating each device as a separate story, but as part of the same progression.",
              "Works without exposing any underlying complexity.",
            ],
          },
          whatWeSolve: {
            heading: "OUTCOMES",
            points: [
              "A clearer, more complete view of how users reach conversion.",
              "Easier to engage users consistently and make better decisions around timing and messaging.",
            ],
          },
          output: {
            heading: "WHAT YOU STOP DOING",
            points: [
              "Treating each device interaction as a new user or a new journey.",
              "Carrying a fragmented view of behavior.",
              "Missing context when users switch devices mid-journey.",
            ],
            summary:
              "Unify the purchase journey across every device — so switching from mobile to desktop never means losing the thread of who the user is or where they left off.",
          },
        },
      },
      {
        id: "ec-5",
        level1: {
          title: "Behavioral Decision Context",
          subtitle: "Understand what users are thinking while they're still deciding.",
        },
        level2: {
          title: "Behavioral Decision Context",
          subtitle: "See how users behave as they move closer—or further away—from a decision.",
          description:
            "Inside apps, users don't just take actions — they go through a decision process. They browse, pause, compare, reconsider, and sometimes drop off. This helps you understand those moments better, so you can tell when a user is moving forward, hesitating, or about to exit.",
          howItWorks: [
            "Recognizes behavioral patterns that signal exploration, hesitation, or readiness",
            "Provides context on the decision journey leading up to final actions",
            "Enables more thoughtful, timely engagement based on where users actually are",
          ],
          stat: "Understand decisions as they happen—not after they're made.",
        },
        level3: {
          hero: "Understand decisions as they happen—not after they're made.",
          positioning: "In-journey behavioral context that reveals how users make decisions in real time.",
          theGap: {
            heading: "THE BEFORE STATE",
            points: [
              "Most systems capture basic events like app opens, clicks, or add-to-cart actions.",
              "But the intent behind those actions is often unclear.",
              "When a user hesitates, explores multiple options, or drops off mid-journey, it's hard to understand what they were thinking or why they didn't move forward.",
              "This makes it difficult to engage users in a way that actually supports their decision-making process.",
            ],
          },
          ourBuild: {
            heading: "HOW IT WORKS",
            points: [
              "Brings more clarity into how users behave while they're making decisions.",
              "Helps you recognize patterns — when someone is exploring, when they're unsure, and when they're close to taking action.",
              "Instead of reacting only to final events, you start understanding the journey leading up to them — without exposing any underlying systems or logic.",
            ],
          },
          whatWeSolve: {
            heading: "OUTCOMES",
            points: [
              "Engage users in a more thoughtful and timely way, supporting them when they need it most.",
              "Reduced drop-offs, improved conversions, and a smoother overall experience.",
            ],
          },
          output: {
            heading: "WHAT YOU STOP DOING",
            points: [
              "Relying only on final actions to trigger engagement.",
              "Guessing why users didn't move forward.",
              "One-size-fits-all responses that ignore where the user is in their decision process.",
            ],
            summary:
              "Read the signals users send while they're still deciding — and engage in a way that supports their journey rather than interrupting it.",
          },
        },
      },
      {
        id: "ec-6",
        level1: {
          title: "Post-Purchase Lifecycle Insight",
          subtitle: "Stay connected to the customer even after the purchase is done.",
        },
        level2: {
          title: "Post-Purchase Lifecycle Insight",
          subtitle: "Understand what customers feel and do after they receive their order.",
          description:
            "The journey doesn't end at purchase. Customers continue to form opinions, consider returns, explore more products, or decide whether to come back. This helps you stay aware of that phase, so you can engage beyond just transactional updates.",
          howItWorks: [
            "Tracks customer behavior and signals in the post-delivery phase",
            "Surfaces signs of satisfaction, disengagement, or return intent",
            "Enables timely, relevant engagement that goes beyond transactional updates",
          ],
          stat: "Turn every purchase into the start of the next one.",
        },
        level3: {
          hero: "Turn every purchase into the start of the next one.",
          positioning: "Post-purchase lifecycle intelligence that builds retention, not just transactions.",
          theGap: {
            heading: "THE BEFORE STATE",
            points: [
              "Most communication after a purchase is transactional — order confirmations, shipping updates, delivery notifications.",
              "But what happens after delivery is often unclear.",
              "Whether the customer is satisfied, considering a return, or thinking about their next purchase isn't always visible.",
              "This makes it harder to build long-term engagement.",
            ],
          },
          ourBuild: {
            heading: "HOW IT WORKS",
            points: [
              "Gives you a better sense of how customers behave after their purchase is complete.",
              "Helps you understand how their experience evolves — whether they're satisfied, disengaging, or showing signs of coming back.",
              "Enables engagement that feels timely and relevant — without exposing any underlying systems.",
            ],
          },
          whatWeSolve: {
            heading: "OUTCOMES",
            points: [
              "Improved retention and stronger encouragement for repeat purchases.",
              "Stronger customer relationships built beyond one-time transactions.",
              "Shifts your focus from one-time transactions to long-term value.",
            ],
          },
          output: {
            heading: "WHAT YOU STOP DOING",
            points: [
              "Treating the purchase as the end of the journey.",
              "Relying only on transactional communication post-purchase.",
              "Missing out on opportunities to re-engage or build loyalty.",
            ],
            summary:
              "Make the post-purchase phase visible — understand how customers feel after delivery and engage in a way that builds loyalty, not just transactions.",
          },
        },
      },
    ],
  },
];

// ─── Convenience lookups ──────────────────────────────────────

/** Get a single industry by id */
export const getIndustry = (id) =>
  industries.find((ind) => ind.id === id);

/** Get a single product by its product id (e.g. "cp-1") */
export const getProduct = (productId) => {
  for (const ind of industries) {
    const product = ind.products.find((p) => p.id === productId);
    if (product) return { industry: ind, product };
  }
  return null;
};

export default industries;