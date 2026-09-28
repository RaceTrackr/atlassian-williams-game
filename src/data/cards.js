/* ------------------------------------------------------------------
   MOCK DATA SET
   ------------------------------------------------------------------
   This module is the single source of truth for the demo's cards.
   It is deliberately plain data so it can later be swapped for an API
   response without touching any component.

   CONTENT RULES (per project brief):
   - Drivers, Team Principals and chassis are REAL Williams history.
     Their cards carry factual `legacy` notes only — no invented
     quotes, advice or biography is attributed to a real person.
   - All other staff (engineering, pit crew, media, performance) are
     ENTIRELY FICTIONAL placeholders (`fictional: true`) and carry the
     invented bio fields (education / advice / quote / secret skill).

   RARITY STAT BANDS
     bronze 40-55 | silver 55-70 | gold 70-85 | legend 85-100
------------------------------------------------------------------- */

export const RARITIES = {
  bronze: { label: 'Bronze', color: '#CD7F32', min: 40, max: 55 },
  silver: { label: 'Silver', color: '#C0C0C0', min: 55, max: 70 },
  gold: { label: 'Gold', color: '#FFD700', min: 70, max: 85 },
  legend: {
    label: 'Legend',
    color: '#FFD700',
    gradient: 'linear-gradient(135deg, #FFD700, #FFFFFF, #FFD700)',
    min: 85,
    max: 100,
  },
}

export const DEPARTMENTS = {
  teamPrincipal: {
    key: 'teamPrincipal',
    label: 'Team Principal',
    slots: 1,
    hasLead: false,
    statLabel: 'Leadership',
    color: '#C8102E',
    affects: 'Flat multiplier on FINAL squad power (+0.5% per Leadership point).',
  },
  engineering: {
    key: 'engineering',
    label: 'Engineering',
    slots: 6,
    hasLead: true,
    statLabel: 'Aero IQ',
    color: '#0072CE',
    affects: 'Synergy multiplier on aero parts: nose, rear wing, diffuser.',
  },
  pitCrew: {
    key: 'pitCrew',
    label: 'Pit Crew',
    slots: 4,
    hasLead: true,
    statLabel: 'Pit Rhythm',
    color: '#FF8A00',
    affects: 'Synergy on undertray + sidepods, and the width of the Pit Stop perfect zone.',
  },
  media: {
    key: 'media',
    label: 'Media',
    slots: 1,
    hasLead: false,
    statLabel: 'Fan Hype',
    color: '#9B5DE5',
    affects: 'Fill rate of the in-battle Fan Hype meter.',
  },
  performance: {
    key: 'performance',
    label: 'Performance',
    slots: 1,
    hasLead: false,
    statLabel: 'Recovery Boost',
    color: '#00C48C',
    affects: 'Driver conditioning decay/recovery and Recovery Challenge payout.',
  },
}

export const PART_SLOTS = {
  nose: { key: 'nose', label: 'Nose', dept: 'engineering' },
  rearWing: { key: 'rearWing', label: 'Rear Wing', dept: 'engineering' },
  diffuser: { key: 'diffuser', label: 'Diffuser', dept: 'engineering' },
  undertray: { key: 'undertray', label: 'Undertray', dept: 'pitCrew' },
  sidepods: { key: 'sidepods', label: 'Sidepods', dept: 'pitCrew' },
}

/* ------------------------------ DRIVERS ------------------------------ */
/* Real Williams race drivers. Stats are game balance, not a ranking.   */

export const drivers = [
  {
    id: 'drv-mansell',
    type: 'driver',
    name: 'Nigel Mansell',
    rarity: 'legend',
    era: 'retro',
    years: '1985–1988, 1991–1992, 1994',
    legacy:
      '1992 World Champion with Williams, taking a then-record 9 wins in a single season aboard the FW14B.',
    stats: { racecraft: 95, consistency: 88, overtaking: 97, conditioning: 90 },
  },
  {
    id: 'drv-prost',
    type: 'driver',
    name: 'Alain Prost',
    rarity: 'legend',
    era: 'retro',
    years: '1993',
    legacy:
      'Won the 1993 title in his only Williams season — his fourth and final Drivers’ Championship.',
    stats: { racecraft: 96, consistency: 97, overtaking: 86, conditioning: 88 },
  },
  {
    id: 'drv-senna',
    type: 'driver',
    name: 'Ayrton Senna',
    rarity: 'legend',
    era: 'retro',
    years: '1994',
    legacy:
      'Three-time World Champion who joined Williams for 1994 and took pole position in all three races he started for the team. He died following a crash at Imola on 1 May 1994.',
    stats: { racecraft: 99, consistency: 90, overtaking: 97, conditioning: 92 },
  },
  {
    id: 'drv-jones',
    type: 'driver',
    name: 'Alan Jones',
    rarity: 'gold',
    era: 'retro',
    years: '1978–1981',
    legacy:
      'Delivered Williams its first Drivers’ Championship in 1980, the year of the team’s first Constructors’ title.',
    stats: { racecraft: 84, consistency: 79, overtaking: 82, conditioning: 85 },
  },
  {
    id: 'drv-rosberg',
    type: 'driver',
    name: 'Keke Rosberg',
    rarity: 'gold',
    era: 'retro',
    years: '1982–1985',
    legacy: '1982 World Champion with Williams, famously on a single race win across the season.',
    stats: { racecraft: 83, consistency: 72, overtaking: 85, conditioning: 80 },
  },
  {
    id: 'drv-piquet',
    type: 'driver',
    name: 'Nelson Piquet',
    rarity: 'gold',
    era: 'retro',
    years: '1986–1987',
    legacy: 'Took his third world title in 1987 with Williams and the turbocharged FW11B.',
    stats: { racecraft: 85, consistency: 82, overtaking: 78, conditioning: 77 },
  },
  {
    id: 'drv-hill',
    type: 'driver',
    name: 'Damon Hill',
    rarity: 'gold',
    era: 'retro',
    years: '1993–1996',
    legacy: '1996 World Champion with Williams, 21 of his 22 career wins came in a Williams.',
    stats: { racecraft: 82, consistency: 84, overtaking: 75, conditioning: 81 },
  },
  {
    id: 'drv-villeneuve',
    type: 'driver',
    name: 'Jacques Villeneuve',
    rarity: 'gold',
    era: 'modern',
    years: '1996–1998',
    legacy: 'Won the 1997 championship in his second season, the team’s most recent drivers’ title.',
    stats: { racecraft: 80, consistency: 74, overtaking: 83, conditioning: 79 },
  },
  {
    id: 'drv-patrese',
    type: 'driver',
    name: 'Riccardo Patrese',
    rarity: 'silver',
    era: 'retro',
    years: '1988–1992',
    legacy: 'Runner-up in 1992 and a cornerstone of the Williams–Renault era.',
    stats: { racecraft: 68, consistency: 66, overtaking: 61, conditioning: 64 },
  },
  {
    id: 'drv-montoya',
    type: 'driver',
    name: 'Juan Pablo Montoya',
    rarity: 'silver',
    era: 'modern',
    years: '2001–2004',
    legacy: 'Seven wins for Williams, including the 2003 Monaco Grand Prix.',
    stats: { racecraft: 69, consistency: 58, overtaking: 70, conditioning: 65 },
  },
  {
    id: 'drv-boutsen',
    type: 'driver',
    name: 'Thierry Boutsen',
    rarity: 'bronze',
    era: 'retro',
    years: '1989–1990',
    legacy: 'Three wins for Williams, including a wet-weather masterclass in Canada in 1989.',
    stats: { racecraft: 53, consistency: 54, overtaking: 44, conditioning: 48 },
  },
]

/* -------------------------------- CARS -------------------------------- */
/* Real, historical Williams chassis. Part slots start empty.            */

export const cars = [
  {
    id: 'car-fw14b',
    type: 'car',
    name: 'FW14B',
    rarity: 'legend',
    era: 'retro',
    years: '1992',
    legacy: 'Active suspension, semi-automatic gearbox and traction control — a generational leap.',
    stats: { speed: 97, reliability: 88, aero: 96 },
    parts: { nose: null, undertray: null, rearWing: null, diffuser: null, sidepods: null },
  },
  {
    id: 'car-fw18',
    type: 'car',
    name: 'FW18',
    rarity: 'legend',
    era: 'retro',
    years: '1996',
    legacy: 'Won 12 of 16 races on the way to the 1996 Constructors’ and Drivers’ titles.',
    stats: { speed: 92, reliability: 90, aero: 89 },
    parts: { nose: null, undertray: null, rearWing: null, diffuser: null, sidepods: null },
  },
  {
    id: 'car-fw07b',
    type: 'car',
    name: 'FW07B',
    rarity: 'gold',
    era: 'retro',
    years: '1980',
    legacy: 'The ground-effect car that took Williams to its first Constructors’ Championship.',
    stats: { speed: 78, reliability: 74, aero: 84 },
    parts: { nose: null, undertray: null, rearWing: null, diffuser: null, sidepods: null },
  },
  {
    id: 'car-fw11b',
    type: 'car',
    name: 'FW11B',
    rarity: 'gold',
    era: 'retro',
    years: '1987',
    legacy: 'Honda turbo power and 9 wins, sealing the 1987 Constructors’ title.',
    stats: { speed: 85, reliability: 71, aero: 76 },
    parts: { nose: null, undertray: null, rearWing: null, diffuser: null, sidepods: null },
  },
  {
    id: 'car-fw26',
    type: 'car',
    name: 'FW26',
    rarity: 'silver',
    era: 'modern',
    years: '2004',
    legacy: 'The distinctive “walrus nose” car — a win at Monza in the hands of Montoya.',
    stats: { speed: 66, reliability: 58, aero: 62 },
    parts: { nose: null, undertray: null, rearWing: null, diffuser: null, sidepods: null },
  },
  {
    id: 'car-fw08',
    type: 'car',
    name: 'FW08',
    rarity: 'bronze',
    era: 'retro',
    years: '1982',
    legacy: 'Short, stubby and effective — carried Keke Rosberg to the 1982 Drivers’ title.',
    stats: { speed: 52, reliability: 50, aero: 45 },
    parts: { nose: null, undertray: null, rearWing: null, diffuser: null, sidepods: null },
  },
]

/* -------------------------------- PARTS ------------------------------- */
/* Fictional component cards, era tag is flavour only.                   */

export const parts = [
  {
    id: 'prt-nose-blade',
    type: 'part',
    name: 'Blade Nose Assembly',
    slot: 'nose',
    rarity: 'gold',
    era: 'modern',
    statBonus: { stat: 'aero', value: 14 },
    flavour: 'Narrow tip, high outwash. Feeds everything downstream.',
  },
  {
    id: 'prt-nose-chisel',
    type: 'part',
    name: 'Chisel Nose Cone',
    slot: 'nose',
    rarity: 'silver',
    era: 'retro',
    statBonus: { stat: 'aero', value: 9 },
    flavour: 'Blunt, honest, forgiving over kerbs.',
  },
  {
    id: 'prt-rw-highdf',
    type: 'part',
    name: 'High-Downforce Rear Wing',
    slot: 'rearWing',
    rarity: 'gold',
    era: 'modern',
    statBonus: { stat: 'aero', value: 12 },
    flavour: 'Monaco spec. Drag you can live with.',
  },
  {
    id: 'prt-rw-lowdrag',
    type: 'part',
    name: 'Low-Drag Rear Wing',
    slot: 'rearWing',
    rarity: 'silver',
    era: 'retro',
    statBonus: { stat: 'speed', value: 10 },
    flavour: 'Skinny spec for the long straights.',
  },
  {
    id: 'prt-diff-double',
    type: 'part',
    name: 'Double Diffuser',
    slot: 'diffuser',
    rarity: 'legend',
    era: 'modern',
    statBonus: { stat: 'aero', value: 18 },
    flavour: 'Reads the regulations very carefully.',
  },
  {
    id: 'prt-diff-stepped',
    type: 'part',
    name: 'Stepped Diffuser',
    slot: 'diffuser',
    rarity: 'bronze',
    era: 'retro',
    statBonus: { stat: 'aero', value: 6 },
    flavour: 'Simple, sealed, dependable.',
  },
  {
    id: 'prt-ut-active',
    type: 'part',
    name: 'Active-Ride Undertray',
    slot: 'undertray',
    rarity: 'legend',
    era: 'retro',
    statBonus: { stat: 'speed', value: 16 },
    flavour: 'Holds ride height like it is on rails.',
  },
  {
    id: 'prt-ut-plank',
    type: 'part',
    name: 'Plank Floor Undertray',
    slot: 'undertray',
    rarity: 'bronze',
    era: 'modern',
    statBonus: { stat: 'reliability', value: 7 },
    flavour: 'Legal, measurable, unexciting.',
  },
  {
    id: 'prt-sp-slim',
    type: 'part',
    name: 'Slimline Sidepods',
    slot: 'sidepods',
    rarity: 'gold',
    era: 'modern',
    statBonus: { stat: 'aero', value: 11 },
    flavour: 'Tight packaging. The cooling team have opinions.',
  },
  {
    id: 'prt-sp-cooling',
    type: 'part',
    name: 'High-Flow Cooling Pods',
    slot: 'sidepods',
    rarity: 'silver',
    era: 'retro',
    statBonus: { stat: 'reliability', value: 12 },
    flavour: 'Runs cool in Malaysia, costs you in Monza.',
  },
]

/* -------------------------------- STAFF ------------------------------- */

/* Team Principal cards — REAL people, factual legacy notes only. */
const teamPrincipals = [
  {
    id: 'stf-tp-frank-williams',
    type: 'staff',
    name: 'Sir Frank Williams',
    role: 'Founder & Team Principal',
    department: 'teamPrincipal',
    rarity: 'legend',
    era: 'retro',
    fictional: false,
    years: '1977–2020',
    primaryStat: { key: 'leadership', label: 'Leadership', value: 98 },
    legacy:
      'Founded Williams Grand Prix Engineering in 1977 with Patrick Head. Under his leadership the team won 9 Constructors’ Championships and 7 Drivers’ Championships. Knighted in 1999.',
  },
  {
    id: 'stf-tp-patrick-head',
    type: 'staff',
    name: 'Patrick Head',
    role: 'Co-founder & Engineering Director',
    department: 'teamPrincipal',
    rarity: 'legend',
    era: 'retro',
    fictional: false,
    years: '1977–2011',
    primaryStat: { key: 'leadership', label: 'Leadership', value: 92 },
    legacy:
      'Co-founded the team and led its technical side through the title-winning FW07, FW11 and FW14B eras.',
  },
  {
    id: 'stf-tp-claire-williams',
    type: 'staff',
    name: 'Claire Williams',
    role: 'Deputy Team Principal',
    department: 'teamPrincipal',
    rarity: 'gold',
    era: 'modern',
    fictional: false,
    years: '2013–2020',
    primaryStat: { key: 'leadership', label: 'Leadership', value: 78 },
    legacy:
      'Served as Deputy Team Principal from 2013 to 2020, leading the team through its independent final years.',
  },
  {
    id: 'stf-tp-james-vowles',
    type: 'staff',
    name: 'James Vowles',
    role: 'Team Principal',
    department: 'teamPrincipal',
    rarity: 'gold',
    era: 'modern',
    fictional: false,
    years: '2023–present',
    primaryStat: { key: 'leadership', label: 'Leadership', value: 83 },
    legacy:
      'Appointed Team Principal in 2023, tasked with rebuilding the team’s infrastructure and competitiveness.',
  },
]

/* Every card below is a FICTIONAL placeholder. Any resemblance to a real
   Williams employee is unintended — names, bios and quotes are invented. */
const supportStaff = [
  /* ---- ENGINEERING (needs 6 to fill: 5 regular + 1 Lead) ---- */
  {
    id: 'stf-eng-01',
    name: 'Dr. Priya Raghunathan',
    role: 'Head of Aerodynamics',
    department: 'engineering',
    rarity: 'legend',
    era: 'modern',
    isLead: true,
    primaryStat: { key: 'aeroIq', label: 'Aero IQ', value: 93 },
    bio: {
      education: 'MEng Aeronautical Engineering, then a PhD in unsteady wake modelling.',
      adviceForStudents:
        'Learn to explain your result in one sentence. If you cannot, you do not understand it yet.',
      topQuote: 'The wind tunnel does not care how clever your idea was on Friday.',
      secretSkill: 'Can sketch a working front wing concept on a napkin in under two minutes.',
    },
  },
  {
    id: 'stf-eng-02',
    name: 'Tobias Lindqvist',
    role: 'CFD Engineer',
    department: 'engineering',
    rarity: 'gold',
    era: 'modern',
    primaryStat: { key: 'aeroIq', label: 'Aero IQ', value: 81 },
    bio: {
      education: 'BSc Physics, MSc Computational Fluid Dynamics.',
      adviceForStudents: 'Get good at scripting. The simulation is only half the job.',
      topQuote: 'Every millisecond is hiding somewhere in the mesh.',
      secretSkill: 'Competitive speed-cuber.',
    },
  },
  {
    id: 'stf-eng-03',
    name: 'Amara Okonkwo',
    role: 'Vehicle Dynamics Engineer',
    department: 'engineering',
    rarity: 'gold',
    era: 'modern',
    primaryStat: { key: 'aeroIq', label: 'Aero IQ', value: 76 },
    bio: {
      education: 'MEng Mechanical Engineering, Formula Student suspension lead.',
      adviceForStudents: 'Join a Formula Student team. Nothing on a CV beats having built the car.',
      topQuote: 'Balance is a feeling before it is a number.',
      secretSkill: 'Plays double bass in a jazz trio.',
    },
  },
  {
    id: 'stf-eng-04',
    name: 'Hugo Maréchal',
    role: 'Composites Design Lead',
    department: 'engineering',
    rarity: 'silver',
    era: 'retro',
    primaryStat: { key: 'aeroIq', label: 'Aero IQ', value: 68 },
    bio: {
      education: 'Apprenticeship in composite manufacturing, later a part-time engineering degree.',
      adviceForStudents: 'There is more than one door into this paddock. Mine had a toolbox by it.',
      topQuote: 'Carbon tells you the truth about your laminate schedule.',
      secretSkill: 'Restores vintage racing bicycles.',
    },
  },
  {
    id: 'stf-eng-05',
    name: 'Sofia Bertrand',
    role: 'Simulation Engineer',
    department: 'engineering',
    rarity: 'silver',
    era: 'modern',
    primaryStat: { key: 'aeroIq', label: 'Aero IQ', value: 61 },
    bio: {
      education: 'BSc Software Engineering, converted into motorsport via a simulator internship.',
      adviceForStudents: 'Code is an engineering skill now. Treat it like one.',
      topQuote: 'If the driver does not believe the sim, the sim is wrong.',
      secretSkill: 'Fluent in four languages, including Finnish.',
    },
  },
  {
    id: 'stf-eng-06',
    name: 'Dev Chatterjee',
    role: 'Junior Aero Technician',
    department: 'engineering',
    rarity: 'bronze',
    era: 'modern',
    primaryStat: { key: 'aeroIq', label: 'Aero IQ', value: 49 },
    bio: {
      education: 'Level 3 Engineering apprenticeship, currently on a degree apprenticeship.',
      adviceForStudents: 'Ask the boring question. Half the room wanted to.',
      topQuote: 'First season. Still cannot believe the wing parts are mine.',
      secretSkill: 'Bakes for the whole department on race weekends.',
    },
  },
  {
    id: 'stf-eng-07',
    name: 'Marguerite Sowande',
    role: 'Aero Performance Analyst',
    department: 'engineering',
    rarity: 'gold',
    era: 'modern',
    primaryStat: { key: 'aeroIq', label: 'Aero IQ', value: 79 },
    bio: {
      education: 'MMath Applied Mathematics, moved into motorsport data three years ago.',
      adviceForStudents: 'Statistics is the most transferable skill you can leave university with.',
      topQuote: 'Correlation between tunnel and track is the whole job.',
      secretSkill: 'Holds a private pilot licence.',
    },
  },

  /* ---- PIT CREW (needs 4 to fill: 3 regular + 1 Lead) ---- */
  {
    id: 'stf-pit-01',
    name: 'Danny Okafor',
    role: 'Chief Mechanic',
    department: 'pitCrew',
    rarity: 'legend',
    era: 'modern',
    isLead: true,
    primaryStat: { key: 'pitRhythm', label: 'Pit Rhythm', value: 90 },
    bio: {
      education: 'Motorsport Engineering HND, fifteen years in the pit lane.',
      adviceForStudents: 'Practise until it is boring. Boring is what survives the pressure.',
      topQuote: 'Two seconds is a long time if you rush it.',
      secretSkill: 'Can identify any wheel gun by sound alone.',
    },
  },
  {
    id: 'stf-pit-02',
    name: 'Ines Valdés',
    role: 'Front Jack',
    department: 'pitCrew',
    rarity: 'gold',
    era: 'modern',
    primaryStat: { key: 'pitRhythm', label: 'Pit Rhythm', value: 80 },
    bio: {
      education: 'Sports science degree, recruited from a professional athletics background.',
      adviceForStudents: 'Fitness is not a side project in this job. It is the job.',
      topQuote: 'You get one chance to be standing in the right place.',
      secretSkill: 'National-level sprinter before joining the team.',
    },
  },
  {
    id: 'stf-pit-03',
    name: 'Rory Fitzpatrick',
    role: 'Wheel Gun, Front Left',
    department: 'pitCrew',
    rarity: 'silver',
    era: 'retro',
    primaryStat: { key: 'pitRhythm', label: 'Pit Rhythm', value: 66 },
    bio: {
      education: 'Time-served mechanic, came up through club racing.',
      adviceForStudents: 'Volunteer at a local circuit. That is where the contacts are.',
      topQuote: 'The gun does not lie, but it will embarrass you.',
      secretSkill: 'Plays in a pit-lane five-a-side team that has never won a match.',
    },
  },
  {
    id: 'stf-pit-04',
    name: 'Yuki Hartmann',
    role: 'Tyre Technician',
    department: 'pitCrew',
    rarity: 'silver',
    era: 'modern',
    primaryStat: { key: 'pitRhythm', label: 'Pit Rhythm', value: 59 },
    bio: {
      education: 'Engineering diploma, joined via a team apprenticeship scheme.',
      adviceForStudents: 'Nobody remembers who set the tyres. Everyone remembers if you got it wrong.',
      topQuote: 'Blankets off at exactly the right moment. That is the whole skill.',
      secretSkill: 'Keeps bees at home.',
    },
  },
  {
    id: 'stf-pit-05',
    name: 'Bea Nowak',
    role: 'Rear Jack',
    department: 'pitCrew',
    rarity: 'gold',
    era: 'modern',
    primaryStat: { key: 'pitRhythm', label: 'Pit Rhythm', value: 73 },
    bio: {
      education: 'Mechanical Engineering degree, pit crew training programme.',
      adviceForStudents: 'Say yes to the unglamorous job. It is a door.',
      topQuote: 'Head down, car up.',
      secretSkill: 'Powerlifting competitor in the off-season.',
    },
  },
  {
    id: 'stf-pit-06',
    name: 'Caleb Mensah',
    role: 'Garage Technician',
    department: 'pitCrew',
    rarity: 'bronze',
    era: 'modern',
    primaryStat: { key: 'pitRhythm', label: 'Pit Rhythm', value: 47 },
    bio: {
      education: 'College motorsport course, first full season with the team.',
      adviceForStudents: 'Turn up early. It is the cheapest way to look brilliant.',
      topQuote: 'Everything in the garage has a home. Learn where.',
      secretSkill: 'Unbeaten at table tennis in the hospitality unit.',
    },
  },

  /* ---- MEDIA ---- */
  {
    id: 'stf-med-01',
    name: 'Naomi Adeyemi',
    role: 'Head of Digital Content',
    department: 'media',
    rarity: 'gold',
    era: 'modern',
    primaryStat: { key: 'fanHype', label: 'Fan Hype', value: 84 },
    bio: {
      education: 'BA Journalism, then a decade in sports broadcasting.',
      adviceForStudents: 'Make things now. A portfolio beats a plan.',
      topQuote: 'The fans are part of the team. Talk to them like it.',
      secretSkill: 'Edits a full race-weekend recap on a phone, on a plane.',
    },
  },
  {
    id: 'stf-med-02',
    name: 'Oskar Brandt',
    role: 'Social Media Producer',
    department: 'media',
    rarity: 'silver',
    era: 'modern',
    primaryStat: { key: 'fanHype', label: 'Fan Hype', value: 63 },
    bio: {
      education: 'Film Production degree, started by filming karting for free.',
      adviceForStudents: 'Learn to shoot, cut and write. Being the whole crew gets you hired.',
      topQuote: 'The best clip of the weekend is usually in the garage, not on track.',
      secretSkill: 'Does a note-perfect impression of every commentator on the grid.',
    },
  },

  /* ---- PERFORMANCE ---- */
  {
    id: 'stf-perf-01',
    name: 'Dr. Lena Vogel',
    role: 'Head of Driver Performance',
    department: 'performance',
    rarity: 'legend',
    era: 'modern',
    primaryStat: { key: 'recoveryBoost', label: 'Recovery Boost', value: 88 },
    bio: {
      education: 'MSc Sports Physiology, PhD in heat stress and cognitive load.',
      adviceForStudents: 'Sleep is a performance tool. Start treating it as one at school.',
      topQuote: 'A tired driver makes a cheap mistake at an expensive moment.',
      secretSkill: 'Open-water swimmer, all year round.',
    },
  },
  {
    id: 'stf-perf-02',
    name: 'Marcus Oyelaran',
    role: 'Performance Coach',
    department: 'performance',
    rarity: 'silver',
    era: 'retro',
    primaryStat: { key: 'recoveryBoost', label: 'Recovery Boost', value: 64 },
    bio: {
      education: 'Sports Science degree, S&C accreditation.',
      adviceForStudents: 'Consistency beats intensity. Every single time.',
      topQuote: 'Neck training is nobody’s favourite hour. Do it anyway.',
      secretSkill: 'Marathon runner with a sub-three personal best.',
    },
  },
]

export const staff = [
  ...teamPrincipals,
  ...supportStaff.map((s) => ({ ...s, type: 'staff', fictional: true })),
]

/* ------------------------- COMBINED LOOKUPS ------------------------- */

export const allCards = [...drivers, ...cars, ...parts, ...staff]

export const cardsById = allCards.reduce((acc, c) => {
  acc[c.id] = c
  return acc
}, {})

/* Cards the player owns at the start of the demo. Everything else shows
   as locked/greyed in the Collection until unlocked from a pack. */
export const startingCollection = [
  'drv-hill',
  'drv-patrese',
  'drv-boutsen',
  'car-fw07b',
  'car-fw11b',
  'car-fw08',
  'prt-nose-chisel',
  'prt-rw-lowdrag',
  'prt-diff-stepped',
  'prt-ut-plank',
  'prt-sp-cooling',
  'prt-sp-slim',
  'stf-tp-frank-williams',
  'stf-tp-james-vowles',
  'stf-tp-claire-williams',
  'stf-eng-02',
  'stf-eng-03',
  'stf-eng-04',
  'stf-eng-06',
  'stf-pit-02',
  'stf-pit-03',
  'stf-pit-04',
  'stf-med-02',
  'stf-perf-02',
]

/* ------------------------- OPPONENT SQUAD ------------------------- */
/* A pre-set mock rival. Phase ratings are fixed so the demo battle is
   readable and repeatable — no opponent squad-building required.
   They are tuned just ABOVE a squad auto-built from the starting
   collection, so the first race is losable and squad-building (or a
   perfect pit stop) is what flips each phase. */
export const opponentSquad = {
  name: 'Grove Rivals GP',
  short: 'RIV',
  phaseRatings: {
    start: 190,
    openingStint: 360,
    pitWindow: 250,
    closingStint: 500,
  },
}
