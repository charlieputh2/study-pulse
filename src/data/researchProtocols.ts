export type ProductContent = {
  id: string;
  name: string;
  category: string;
  variations: { label: string; price: string }[];
  description: string;
  howItWorks?: string[];
  sideEffects?: string[];
  contraindications?: string[];
  protocol?: string;
  dosing?: string[];
  stacking?: string[];
};

export const discountTiers = [
  { threshold: '₱5,000', offer: '7% discount + free shipping via JNT' },
  { threshold: '₱10,000', offer: '10% discount + free shipping' },
  { threshold: '₱15,000+', offer: '10% discount + 1 FREE peptide of your choice + free shipping' },
];

export const discountTerms = [
  'Discounts apply to regular-priced items only.',
  'One free peptide per transaction.',
  'Free peptide is brand-selected (or specify available options).',
  'Promo cannot be combined with other offers.',
  'No cash equivalent.',
];

export const categories = [
  'METABOLIC & WEIGHT MANAGEMENT',
  'ENERGY',
  'BEAUTY & ANTI-AGING',
  'COGNITIVE SUPPORT',
  'HORMONAL & SEXUAL FUNCTION',
  'MUSCLE BUILDING/GROWTH HORMONE',
  'ANTIOXIDANT',
  'LONGEVITY',
  'INJURY RECOVERY',
  'ANTI-INFLAMMATORY',
  'SPECIAL BLENDS',
  'TOPICALS',
];

export const products: ProductContent[] = [
  {
    id: 'tirzepatide-15',
    name: 'Tirzepatide 15mg',
    category: 'A',
    variations: [
      { label: 'Set (w/ syringes, alcohol pads)', price: '₱2,800.00' },
      { label: 'Tirzepatide + Bac only', price: '₱2,700.00' },
      { label: 'Tirzepatide only', price: '₱2,600.00' },
    ],
    description:
      'Helps reduce appetite, improve satiety, and support weight loss via GLP-1 and GIP pathways.',
    howItWorks: [
      'GLP-1: signals fullness and slows gastric emptying.',
      'GIP: supports energy use and blood sugar control.',
    ],
    sideEffects: [
      'Upset stomach, nausea, vomiting, diarrhea or constipation',
      'Fatigue, reduced appetite, mild injection-site pain or redness, hair fall (rare)',
      'Rare: pancreatitis, gallbladder issues, thyroid tumors, severe hypoglycemia (with insulin)',
    ],
    contraindications: [
      'Pregnant or breastfeeding',
      'Personal/family history of rare thyroid cancer',
      'Type 1 diabetes or serious GI issues',
      'Allergy to Tirzepatide',
    ],
    protocol: 'Recon 15mg with 1.5mL bacteriostatic water. Stay on each dose ≥4 weeks before increasing.',
    dosing: [
      '15mg: 2.5mg / 25 units once weekly (fasted, same time).',
      'Best injected at night; maintain 3-hour fast before/after.',
    ],
    stacking: [
      'AOD-9604 & Tesamorelin for belly fat support',
      'Semax or Selank for mood/focus balance',
      'NAD+ or MOTS-C for energy and metabolism',
      'BPC-157 for gut support; GHK-Cu for skin/hair support',
    ],
  },
  {
    id: 'tirzepatide-30',
    name: 'Tirzepatide 30mg',
    category: 'A',
    variations: [
      { label: 'Set (w/ syringes, alcohol pads)', price: '₱4,200.00' },
      { label: 'Vial + Bac only', price: '₱4,100.00' },
      { label: 'Vial only', price: '₱4,000.00' },
    ],
    description: 'Same dual-pathway metabolic support at a higher strength for progressive dosing.',
    howItWorks: [
      'GLP-1: appetite control and satiety',
      'GIP: metabolic and glycemic support',
    ],
    sideEffects: [
      'GI upset (nausea, vomiting, diarrhea, constipation)',
      'Fatigue, reduced appetite, mild injection-site reactions, hair fall (rare)',
      'Rare: pancreatitis, gallbladder issues, thyroid tumors, severe hypoglycemia (with insulin)',
    ],
    contraindications: [
      'Pregnant or breastfeeding',
      'Thyroid cancer history',
      'Type 1 diabetes, serious GI disease, allergy to Tirzepatide',
    ],
    protocol: 'Recon 30mg with 3mL bacteriostatic water. Maintain ≥4 weeks per dose step.',
    dosing: [
      '30mg: 5mg / 50 units once weekly (fasted, same time).',
      'Best injected at night; 3-hour fast window.',
    ],
    stacking: [
      'AOD-9604 & Tesamorelin for fat loss',
      'Semax or Selank for mood/focus',
      'NAD+ or MOTS-C for energy and metabolism',
      'BPC-157; GHK-Cu for skin/hair support',
    ],
  },
  {
    id: 'retatrutide-10',
    name: 'Retatrutide 10mg',
    category: 'A',
    variations: [
      { label: 'Set (w/ syringes, alcohol pads)', price: '₱2,500.00' },
      { label: 'Vial + Bac only', price: '₱2,400.00' },
      { label: 'Vial only', price: '₱2,300.00' },
    ],
    description:
      'Triple-agonist metabolic peptide for fat loss, appetite control, and metabolic health.',
    howItWorks: [
      'GLP-1: fullness and appetite control',
      'GIP: blood sugar and fat handling',
      'Glucagon: increases energy use and fat burning',
    ],
    sideEffects: [
      'Nausea, vomiting, diarrhea, constipation',
      'Reduced appetite, mild injection-site reactions, hair fall (rare)',
    ],
    contraindications: [
      'Pregnant or breastfeeding',
      'Thyroid cancer history',
      'Type 1 diabetes, serious GI disease, allergy to peptide meds',
    ],
    protocol: 'Recon 10mg with 1mL bacteriostatic water.',
    dosing: [
      '0.5mg–2mg per week; stay on each dose ≥4 weeks.',
      'Inject weekly, fasted window 3 hours around dose.',
    ],
    stacking: [
      'AOD-9604 & Tesamorelin for fat burning',
      'Semax/Selank for mood/focus',
      'NAD+ or MOTS-C for energy',
      'BPC-157; GHK-Cu for recovery/skin',
    ],
  },
  {
    id: 'retatrutide-20',
    name: 'Retatrutide 20mg',
    category: 'A',
    variations: [
      { label: 'Set (w/ syringes, alcohol pads)', price: '₱4,000.00' },
      { label: 'Vial + Bac only', price: '₱3,900.00' },
      { label: 'Vial only', price: '₱3,800.00' },
    ],
    description: 'Higher-strength triple-agonist for progressive metabolic programs.',
    howItWorks: [
      'GLP-1, GIP, and Glucagon synergy for appetite, blood sugar, and fat burn',
    ],
    sideEffects: [
      'Nausea, vomiting, diarrhea, constipation',
      'Reduced appetite, mild injection-site reactions, hair fall (rare)',
    ],
    contraindications: [
      'Pregnant or breastfeeding',
      'Thyroid cancer history',
      'Type 1 diabetes, serious GI disease, allergy to peptide meds',
    ],
    protocol: 'Recon 20mg with 1.5mL bacteriostatic water.',
    dosing: [
      '0.5mg–2mg per week; stay on each dose ≥4 weeks.',
      'Inject weekly, fasted window 3 hours around dose.',
    ],
    stacking: [
      'AOD-9604 & Tesamorelin for fat burning',
      'Semax/Selank for mood/focus',
      'NAD+ or MOTS-C for energy',
      'BPC-157; GHK-Cu for recovery/skin',
    ],
  },
  {
    id: 'cagrilintide-5',
    name: 'Cagrilintide 5mg',
    category: 'A',
    variations: [
      { label: 'Set (w/ syringes, alcohol pads)', price: '₱1,750.00' },
      { label: 'Vial + Bac only', price: '₱1,650.00' },
      { label: 'Vial only', price: '₱1,550.00' },
    ],
    description: 'Amylin analogue that enhances satiety; pairs well with GLP-1 for weight loss synergy.',
    howItWorks: [
      'Amylin pathway: signals fullness and slows intake',
      'Synergizes with GLP-1 (Semaglutide/Tirzepatide)',
    ],
    sideEffects: [
      'Nausea, vomiting, diarrhea, constipation',
      'Injection site redness/itching; reduced appetite',
    ],
    contraindications: [
      'Pregnant or breastfeeding',
      'Thyroid cancer history',
      'Type 1 diabetes or serious GI issues',
      'Allergy to peptide medications',
    ],
    protocol: 'Recon 5mg with 1mL bacteriostatic water.',
    dosing: [
      '200mcg / 8 units per week; inject once weekly at same time.',
      'Do not inject same day as GLPs (space within the week).',
      'Fast 3 hours before/after dose.',
    ],
    stacking: [
      'Semaglutide or Tirzepatide for appetite control synergy',
      'Tesofensine for thermogenesis',
      'L-Carnitine for fat metabolism',
      'AOD-9604 for lipolysis support',
    ],
  },
  {
    id: 'cagrilintide-10',
    name: 'Cagrilintide 10mg',
    category: 'A',
    variations: [
      { label: 'Set (w/ syringes, alcohol pads)', price: '₱3,000.00' },
      { label: 'Vial + Bac only', price: '₱2,900.00' },
      { label: 'Vial only', price: '₱2,800.00' },
    ],
    description: 'Higher-dose amylin analogue for appetite control.',
    howItWorks: [
      'Amylin pathway satiety; synergizes with GLP-1',
    ],
    sideEffects: [
      'Nausea, vomiting, diarrhea, constipation',
      'Injection site redness/itching; reduced appetite',
    ],
    contraindications: [
      'Pregnant or breastfeeding',
      'Thyroid cancer history',
      'Type 1 diabetes or serious GI issues',
      'Allergy to peptide medications',
    ],
    protocol: 'Recon 10mg with 2mL bacteriostatic water.',
    dosing: [
      '400mcg / 8 units per week; inject once weekly at same time.',
      'Do not inject same day as GLPs (space within the week).',
      'Fast 3 hours before/after dose.',
    ],
    stacking: [
      'Semaglutide or Tirzepatide for appetite control synergy',
      'Tesofensine; L-Carnitine; AOD-9604',
    ],
  },
  {
    id: 'amino-1mq-50',
    name: '5-Amino-1MQ 50mg',
    category: 'A&B',
    variations: [
      { label: 'Set (w/ syringes, alcohol pads)', price: '₱3,000.00' },
      { label: 'Vial + Bac only', price: '₱2,900.00' },
      { label: 'Vial only', price: '₱2,800.00' },
    ],
    description: 'Supports mitochondrial function, fat loss, and energy production.',
    howItWorks: [
      'Boosts cellular NAD+ and mitochondrial efficiency',
      'Signals adipocytes to release stored fat',
    ],
    sideEffects: ['Mild headache, fatigue, upset stomach, temporary sleep changes'],
    contraindications: [],
    protocol: 'Recon 50mg with 3mL bacteriostatic water.',
    dosing: [
      'Dose range: 3–5 units (≈0.5–0.85mg) once daily, mornings, for 6–8 weeks.',
      'Break 2–4 weeks, then repeat if needed.',
    ],
    stacking: [
      'AOD-9604 for fat loss',
      'CJC-1295 + Ipamorelin for GH support',
      'GLP-1 agonists for appetite/insulin support',
      'Glutathione or NAD+ precursors for longevity',
    ],
  },
  {
    id: 'mots-c-10',
    name: 'MOTS-C 10mg',
    category: 'A&B',
    variations: [
      { label: 'Set (w/ syringes, alcohol pads)', price: '₱2,200.00' },
      { label: 'Vial + Pharma grade Bac only', price: '₱2,100.00' },
      { label: 'Vial only', price: '₱1,800.00' },
    ],
    description: 'Mitochondrial peptide that improves metabolism, energy, and longevity markers.',
    howItWorks: [
      'Enhances fat burning, glucose control, and energy output',
      'Supports muscle performance and reduces inflammation',
    ],
    sideEffects: ['Mild redness/soreness, headache, mild GI discomfort'],
    contraindications: [],
    protocol: 'Recon 10mg with 1mL pharma-grade bacteriostatic water.',
    dosing: [
      '1–3mg every morning, 2–3x per week, fasted.',
      'Can continue past 12 weeks as tolerated.',
    ],
    stacking: [
      'SS-31 before MOTS-C for mitochondrial priming',
      'Humanin for anti-aging synergy',
      'Tesofensine or AOD-9604 for fat loss',
      'BPC-157/TB-500 for recovery',
      'Glutathione or NAD+ precursors for longevity',
    ],
  },
  {
    id: 'nad-100',
    name: 'NAD+ 100mg',
    category: 'B',
    variations: [
      { label: 'Set (w/ syringes, alcohol pads)', price: '₱1,000.00' },
      { label: 'Vial only', price: '₱900.00' },
    ],
    description: 'Cellular energy and repair cofactor supporting healthy aging and metabolism.',
    howItWorks: [
      'Supports ATP production, DNA repair, and metabolic health',
    ],
    sideEffects: ['Upset stomach, diarrhea, easy bruising/bleeding, palpitations'],
    contraindications: [],
    protocol: 'Recon 100mg: add bacteriostatic water (per preference for sting reduction).',
    dosing: [
      '25mg 3x per week; increase by 25mg steps up to 200mg max.',
      'Cycle 6–15 weeks, break 2–4 weeks. Morning preferred.',
    ],
    stacking: [
      'Use with Glutathione or Vitamin C for antioxidant support',
      'Pairs with GLP-1s or metabolic stacks for energy',
    ],
  },
  {
    id: 'nad-500',
    name: 'NAD+ 500mg',
    category: 'B',
    variations: [
      { label: 'Set (w/ syringes, alcohol pads)', price: '₱1,500.00' },
      { label: 'Vial + Bac only', price: '₱1,400.00' },
      { label: 'Vial only', price: '₱1,300.00' },
    ],
    description: 'Higher-dose NAD+ for energy, brain, and cellular repair.',
    howItWorks: ['Supports ATP, DNA repair, metabolic and brain function'],
    sideEffects: ['Upset stomach, diarrhea, bruising/bleeding, palpitations'],
    contraindications: [],
    protocol: 'Recon 500mg with 5mL bacteriostatic water (add more if sting).',
    dosing: [
      '25mg 3x per week; increase by 25mg steps up to 200mg max.',
      'Cycle 6–15 weeks, break 2–4 weeks. Morning preferred.',
    ],
    stacking: [
      'Glutathione, GHK-Cu, Vitamin C for antioxidant/skin support',
      'AOD-9604 for metabolic synergy',
    ],
  },
  {
    id: 'epitalon-10',
    name: 'Epitalon 10mg',
    category: 'C/D/H',
    variations: [
      { label: 'Set (w/ syringes, alcohol pads)', price: '₱2,000.00' },
      { label: 'Vial + Bac only', price: '₱1,900.00' },
      { label: 'Vial only', price: '₱1,800.00' },
    ],
    description: 'Longevity peptide supporting telomere health, cellular repair, and sleep quality.',
    howItWorks: [
      'Protects telomeres to support healthy cell lifespan',
    ],
    sideEffects: ['Mild redness/itching at injection site; generally well tolerated'],
    contraindications: ['Active cancer', 'Seizure disorders'],
    protocol: 'Recon 10mg with 1mL bacteriostatic water.',
    dosing: [
      '5–10mg daily for 10–20 days, fasted; repeat 2–3x per year.',
    ],
    stacking: [
      'GHK-Cu for skin/cellular repair',
      'Thymosin Alpha-1 for immune support',
      'Glutathione; CJC-1295/Ipamorelin; BPC-157',
    ],
  },
  {
    id: 'pinealon-10',
    name: 'Pinealon 10mg',
    category: 'D',
    variations: [
      { label: 'Set (w/ syringes, alcohol pads)', price: '₱1,700.00' },
      { label: 'Vial + Bac only', price: '₱1,600.00' },
      { label: 'Vial only', price: '₱1,500.00' },
    ],
    description: 'Neuropeptide to support cognition, stress resilience, and sleep rhythm.',
    howItWorks: [
      'Supports neuronal repair and circadian balance',
    ],
    sideEffects: ['Mild headache/dizziness, sleep changes, fatigue or alertness shifts'],
    contraindications: ['Pregnancy/breastfeeding', 'Active cancer', 'Severe autoimmune disease', 'Allergy'],
    protocol: 'Recon with 1.5mL bacteriostatic water.',
    dosing: [
      '200mcg (≈1.5 units) AM fasted, 3–5x/week for 2 months on, 1 month off; up to 2mg as needed.',
    ],
    stacking: [
      'BPC-157 for neuroregeneration',
      'GHK-Cu for anti-aging synergy',
      'Thymosin Alpha-1 or Glutathione for immune support',
    ],
  },
  {
    id: 'selank-5',
    name: 'Selank 5mg',
    category: 'D',
    variations: [
      { label: 'Set (w/ syringes, alcohol pads)', price: '₱1,000.00' },
      { label: 'Vial + Bac only', price: '₱900.00' },
      { label: 'Vial only', price: '₱800.00' },
    ],
    description: 'Anxiolytic/neuroprotective peptide supporting calm, focus, and immunity.',
    howItWorks: [
      'Modulates neurochemistry for mood, focus, and immune support',
    ],
    sideEffects: ['Sore nose/skin, fatigue, headache, mild GI upset'],
    contraindications: [],
    protocol: 'Nasal: recon 5mg with 1mL bac water + 5mL saline. SubQ: recon 5mg with 1.5mL bac water.',
    dosing: [
      'Nasal: 250mcg (1–2 sprays/nostril) 1–2x daily; cycle 10–20 days on, 7–10 days off.',
      'SubQ: 300mcg daily AM fasted; 6 weeks on, 6 weeks off.',
    ],
    stacking: [
      'Semax for enhanced nootropic/mood effects',
      'BPC-157 for neuroregeneration',
      'GHK-Cu, L-Theanine, SSRIs adjunct, Lion’s Mane',
    ],
  },
  {
    id: 'selank-10',
    name: 'Selank 10mg',
    category: 'D',
    variations: [
      { label: 'Set (w/ syringes, alcohol pads)', price: '₱1,650.00' },
      { label: 'Vial + Bac only', price: '₱1,550.00' },
      { label: 'Vial only', price: '₁,450.00' },
    ],
    description: 'Higher-dose Selank for mood and cognitive support.',
    howItWorks: ['Similar to Selank 5mg with higher payload'],
    sideEffects: ['Sore nose/skin, fatigue, headache, mild GI upset'],
    contraindications: [],
    protocol: 'Nasal: recon 10mg with 2mL bac water + 10mL saline. SubQ: recon 10mg with 2.5mL bac water.',
    dosing: [
      'Nasal: 250mcg (1–2 sprays/nostril) 1–2x daily; cycle 10–20 days on, 7–10 days off.',
      'SubQ: 300mcg daily AM fasted; 6 weeks on, 6 weeks off.',
    ],
    stacking: [
      'Semax; BPC-157; GHK-Cu; L-Theanine; SSRIs adjunct; Lion’s Mane',
    ],
  },
  {
    id: 'semax-10',
    name: 'Semax 10mg',
    category: 'D',
    variations: [
      { label: 'Set (w/ syringes, alcohol pads)', price: '₱1,650.00' },
      { label: 'Vial + Bac only', price: '₱1,550.00' },
      { label: 'Vial only', price: '₱1,450.00' },
    ],
    description: 'Nootropic/neuroprotective peptide for focus, mood, and recovery.',
    howItWorks: [
      'Supports BDNF, neuroprotection, and neurochemical balance',
    ],
    sideEffects: ['Headache, nausea, insomnia, anxiety (dose-related)'],
    contraindications: [],
    protocol: 'Nasal: recon with 3mL saline. SubQ: recon with 3mL bacteriostatic water.',
    dosing: [
      'Nasal: 100–200mcg (1 spray/nostril) 1–2x daily; 10–20 days on, 7–10 days off.',
      'SubQ: 15–30 units daily AM fasted; 6 weeks on, 6 weeks off.',
    ],
    stacking: [
      'Selank for anxiolytic synergy',
      'BPC-157 for neurorepair',
      'GHK-Cu; Lion’s Mane',
    ],
  },
];
