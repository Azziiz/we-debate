export const FORMATS = [
  {
    id: 'bp',
    name: 'British Parliamentary (BP)',
    summary: 'Four teams of two compete in one debate: two on Government, two on Opposition. Used at the World Universities Debating Championship.',
    teams: ['Opening Government (OG)', 'Opening Opposition (OO)', 'Closing Government (CG)', 'Closing Opposition (CO)'],
    order: [
      'Prime Minister (OG)',
      'Leader of Opposition (OO)',
      'Deputy Prime Minister (OG)',
      'Deputy Leader of Opposition (OO)',
      'Member of Government (CG)',
      'Member of Opposition (CO)',
      'Government Whip (CG)',
      'Opposition Whip (CO)',
    ],
    timing: '7 minutes per speech. The first and last minute are protected; Points of Information (POIs) may be offered in between.',
    prep: '15 minutes',
    tips: [
      'Opening teams set up the debate: definitions, burden and core arguments.',
      'Closing teams must bring an "extension": new material that moves the debate forward.',
      'Whips summarise the clash, they do not add new arguments.',
      'Teams are ranked 1st to 4th, so you must beat the team on your own bench too.',
    ],
  },
  {
    id: 'wsdc',
    name: 'World Schools (WSDC)',
    summary: 'Two teams of three (Proposition and Opposition). The format of the World Schools Debating Championship, popular with high schools.',
    teams: ['Proposition', 'Opposition'],
    order: [
      '1st Proposition',
      '1st Opposition',
      '2nd Proposition',
      '2nd Opposition',
      '3rd Proposition',
      '3rd Opposition',
      'Opposition Reply (by 1st or 2nd speaker)',
      'Proposition Reply (by 1st or 2nd speaker)',
    ],
    timing: '8-minute substantive speeches (first and last minute protected), 4-minute reply speeches with no POIs.',
    prep: '1 hour for prepared motions; impromptu motions vary',
    tips: [
      'Judges weigh Style (40%), Content (40%) and Strategy (20%).',
      'Reply speeches are a biased summary: explain why your side won, no new arguments.',
      'The Opposition gives the first reply speech.',
      'Third speakers should focus on rebuttal and the main clashes.',
    ],
  },
  {
    id: 'club',
    name: 'Club sessions',
    summary: 'Our weekly sessions are flexible. We adapt the format to the number of members and the goal of the day.',
    teams: ['Two sides, or open floor'],
    order: ['Motion announced', 'Short prep', 'Speeches alternate between sides', 'Open floor questions', 'Feedback'],
    timing: 'Usually 3 to 5 minutes per speech, set with the speech timer.',
    prep: '5 to 15 minutes',
    tips: [
      'Everyone speaks at least once.',
      'Feedback is about growth: one thing that worked, one thing to improve.',
      'Walk & Talk sessions skip the formal structure and debate in pairs outdoors.',
    ],
  },
]

export const PRACTICE = [
  {
    title: 'One-minute impromptu',
    desc: 'Draw a random motion and speak for exactly one minute with 30 seconds of prep. Focus on a clear opening line.',
    tool: '/tools/motion',
  },
  {
    title: 'PEEL drill',
    desc: 'Build one argument using Point, Explanation, Example, Link. Present it in 90 seconds.',
  },
  {
    title: 'Rebuttal ping-pong',
    desc: 'In pairs: one person makes a claim, the other rebuts it in 20 seconds. Switch roles. Ten rounds.',
  },
  {
    title: 'POI practice',
    desc: 'One speaker gives a 3-minute speech while everyone else offers Points of Information. The speaker practises accepting and declining gracefully.',
    tool: '/tools/timer',
  },
  {
    title: 'Steelman',
    desc: 'Argue the side you personally disagree with, as convincingly as possible.',
  },
  {
    title: 'Filler-word challenge',
    desc: 'Speak for two minutes on any topic. A partner counts "um", "like" and "you know". Try to beat your score next week.',
  },
  {
    title: 'Weighing practice',
    desc: 'Take two arguments from opposite sides and explain which one matters more and why (scale, probability, urgency).',
  },
]
