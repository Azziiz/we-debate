// Starter motions, used by the tools and library until the club adds its own
// to Firestore (and as an offline fallback).
export const TOPICS = ['Education', 'Technology', 'Society', 'Politics', 'Environment', 'Economy', 'Culture', 'Ethics', 'Sports', 'Health']
export const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced']

export const SEED_MOTIONS = [
  { text: 'This House would ban homework in primary and secondary schools', topic: 'Education', difficulty: 'Beginner' },
  { text: 'This House would make learning a second foreign language compulsory', topic: 'Education', difficulty: 'Beginner' },
  { text: 'This House believes that school uniforms do more harm than good', topic: 'Education', difficulty: 'Beginner' },
  { text: 'This House would replace final exams with continuous assessment', topic: 'Education', difficulty: 'Intermediate' },
  { text: 'This House would pay students for good grades', topic: 'Education', difficulty: 'Beginner' },
  { text: 'This House would ban smartphones in schools', topic: 'Technology', difficulty: 'Beginner' },
  { text: 'This House regrets the rise of social media influencers', topic: 'Technology', difficulty: 'Intermediate' },
  { text: 'This House would allow students to use AI tools in all assessments', topic: 'Technology', difficulty: 'Intermediate' },
  { text: 'This House believes that AI will create more jobs than it destroys', topic: 'Technology', difficulty: 'Advanced' },
  { text: 'This House would ban social media for users under 16', topic: 'Technology', difficulty: 'Beginner' },
  { text: 'This House believes that fame does more harm than good', topic: 'Society', difficulty: 'Beginner' },
  { text: 'This House believes that it is better to be a big fish in a small pond', topic: 'Society', difficulty: 'Beginner' },
  { text: 'This House regrets the glorification of hustle culture', topic: 'Society', difficulty: 'Intermediate' },
  { text: 'This House believes that young people should leave their home country to build their careers', topic: 'Society', difficulty: 'Intermediate' },
  {
    text: 'This House, as a young person in a small town, would leave for a big city',
    topic: 'Society',
    difficulty: 'Advanced',
    infoSlide: 'Opposition may argue for staying and building opportunities locally.',
  },
  { text: 'This House would lower the voting age to 16', topic: 'Politics', difficulty: 'Intermediate' },
  { text: 'This House would make voting compulsory', topic: 'Politics', difficulty: 'Intermediate' },
  { text: 'This House would ban single-use plastics', topic: 'Environment', difficulty: 'Beginner' },
  { text: 'This House would limit tourism to protect fragile environments', topic: 'Environment', difficulty: 'Intermediate' },
  { text: 'This House believes that individuals, not governments, should lead the fight against climate change', topic: 'Environment', difficulty: 'Intermediate' },
  { text: 'This House would introduce a universal basic income', topic: 'Economy', difficulty: 'Advanced' },
  { text: 'This House believes that working from home does more good than harm', topic: 'Economy', difficulty: 'Beginner' },
  { text: 'This House believes that cultural traditions should never be exempt from criticism', topic: 'Culture', difficulty: 'Advanced' },
  { text: 'This House would require museums to return artefacts to their countries of origin', topic: 'Culture', difficulty: 'Intermediate' },
  { text: 'This House would ban zoos', topic: 'Ethics', difficulty: 'Beginner' },
  { text: 'This House believes that lying is sometimes the right thing to do', topic: 'Ethics', difficulty: 'Beginner' },
  { text: 'This House would allow athletes to use performance-enhancing drugs', topic: 'Sports', difficulty: 'Intermediate' },
  { text: 'This House believes that e-sports should be in the Olympics', topic: 'Sports', difficulty: 'Beginner' },
  { text: 'This House would tax junk food', topic: 'Health', difficulty: 'Beginner' },
  { text: 'This House would make organ donation opt-out', topic: 'Health', difficulty: 'Intermediate' },
].map((m, i) => ({ id: `seed-${i}`, approved: true, ...m }))
