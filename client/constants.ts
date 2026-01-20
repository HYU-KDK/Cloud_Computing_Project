
import { Paper } from './types';

export const STAGE_THRESHOLDS = [5, 15, 30, 50, 75];

export const MOCK_PAPERS: Paper[] = [
  {
    id: '1',
    title: 'Attention Is All You Need',
    authors: ['Vaswani', 'Shazeer', 'Parmar'],
    url: 'https://arxiv.org/abs/1706.03762',
    source: 'ArXiv',
    venue: 'NeurIPS',
    year: '2017',
    abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks...',
    recommendationReason: 'The foundation of Modern Transformers.'
  },
  {
    id: '2',
    title: 'Generative Adversarial Nets',
    authors: ['Goodfellow', 'Pouget-Abadie', 'Mirza'],
    url: 'https://arxiv.org/abs/1406.2661',
    source: 'ArXiv',
    venue: 'NeurIPS',
    year: '2014',
    abstract: 'We propose a new framework for estimating generative models via an adversarial process...',
    recommendationReason: 'Essential for understanding GANs.'
  },
  {
    id: '3',
    title: 'BERT: Pre-training of Deep Bidirectional Transformers',
    authors: ['Devlin', 'Chang', 'Lee', 'Toutanova'],
    url: 'https://arxiv.org/abs/1810.04805',
    source: 'ArXiv',
    venue: 'NAACL',
    year: '2019',
    abstract: 'We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers...',
    recommendationReason: 'Key breakthrough in NLP pre-training.'
  },
  {
    id: '4',
    title: 'ResNet: Deep Residual Learning for Image Recognition',
    authors: ['He', 'Zhang', 'Ren', 'Sun'],
    url: 'https://arxiv.org/abs/1512.03385',
    source: 'ArXiv',
    venue: 'CVPR',
    year: '2016',
    abstract: 'Deeper neural networks are more difficult to train. We present a residual learning framework to ease the training of networks...',
    recommendationReason: 'Fundamental for computer vision.'
  },
  {
    id: '5',
    title: 'Mastering the Game of Go with Deep Neural Networks',
    authors: ['Silver', 'Huang', 'Maddison'],
    url: 'https://www.nature.com/articles/nature16961',
    source: 'Nature',
    venue: 'Nature',
    year: '2016',
    abstract: 'The game of Go has long been viewed as the most challenging of classic games for artificial intelligence...',
    recommendationReason: 'Major achievement in Reinforcement Learning.'
  },
  {
    id: '6',
    title: 'Adam: A Method for Stochastic Optimization',
    authors: ['Kingma', 'Ba'],
    url: 'https://arxiv.org/abs/1412.6980',
    source: 'ICLR',
    venue: 'ICLR',
    year: '2015',
    abstract: 'We introduce Adam, an algorithm for first-order gradient-based optimization of stochastic objective functions...',
    recommendationReason: 'Universal optimizer in Deep Learning.'
  },
  {
    id: '7',
    title: 'Language Models are Few-Shot Learners',
    authors: ['Brown', 'Mann', 'Ryder'],
    url: 'https://arxiv.org/abs/2005.14165',
    source: 'ArXiv',
    venue: 'NeurIPS',
    year: '2020',
    abstract: 'We demonstrate that scaling up language models greatly improves few-shot performance...',
    recommendationReason: 'The GPT-3 breakthrough paper.'
  },
  {
    id: '8',
    title: 'Molecular Structure of Nucleic Acids',
    authors: ['Watson', 'Crick'],
    url: 'https://www.nature.com/articles/171737a0',
    source: 'Nature',
    venue: 'Nature',
    year: '1953',
    abstract: 'We wish to suggest a structure for the salt of deoxyribose nucleic acid (D.N.A.)...',
    recommendationReason: 'Foundational Molecular Biology.'
  },
  {
    id: '9',
    title: 'Computing Machinery and Intelligence',
    authors: ['Alan Turing'],
    url: 'https://example.com/turing-test',
    source: 'Mind',
    venue: 'Mind',
    year: '1950',
    abstract: 'I propose to consider the question, "Can machines think?"...',
    recommendationReason: 'The origin of AI Philosophy.'
  },
  {
    id: '10',
    title: 'A Mathematical Theory of Communication',
    authors: ['Claude Shannon'],
    url: 'https://example.com/shannon',
    source: 'Bell System',
    venue: 'BSTJ',
    year: '1948',
    abstract: 'The recent development of various methods of modulation...',
    recommendationReason: 'Foundation of Information Theory.'
  }
];

export const INTEREST_OPTIONS = [
  // 1. Natural Sciences (자연과학)
  'Physics', 'Quantum Mechanics (QM)', 'Particle Physics', 'Astrophysics', 'Cosmology', 'Condensed Matter Physics', 'String Theory', 'Thermodynamics', 'Fluid Dynamics', 'Optics', 'Nuclear Physics', 'General Relativity (GR)', 'High Energy Physics (HEP)', 'Electromagnetism',
  'Organic Chemistry', 'Inorganic Chemistry', 'Biochemistry', 'Molecular Biology', 'Physical Chemistry', 'Analytical Chemistry', 'Polymer Chemistry', 'Medicinal Chemistry', 'Structural Biology', 'Quantum Chemistry', 'Electrochemistry',
  'Genetics', 'Evolutionary Biology', 'Ecology', 'Microbiology', 'Botany', 'Zoology', 'Marine Biology', 'Mycology', 'Virology', 'Immunology', 'Cell Biology', 'Neurobiology', 'Computational Biology', 'Genomics', 'Proteomics',
  'Calculus', 'Linear Algebra', 'Number Theory', 'Topology', 'Differential Equations', 'Abstract Algebra', 'Real Analysis', 'Complex Analysis', 'Probability Theory', 'Mathematical Logic', 'Graph Theory', 'Statistics', 'Bayesian Statistics',
  'Geology', 'Oceanography', 'Meteorology', 'Paleontology', 'Seismology', 'Volcanology', 'Atmospheric Science', 'Geophysics', 'Hydrology', 'Geomorphology', 'Climatology', 'Mineralogy',

  // 2. Engineering & Technology (공학 및 기술)
  'Computer Science (CS)', 'Machine Learning (ML)', 'Deep Learning (DL)', 'Neural Networks (NN)', 'Natural Language Processing (NLP)', 'Large Language Models (LLM)', 'Generative AI (GenAI)', 'Computer Vision (CV)', 'Robotics', 'Artificial Intelligence (AI)',
  'Reinforcement Learning (RL)', 'Bayesian Inference', 'Stochastic Processes', 'Information Theory', 'Cybersecurity', 'Cryptography', 'Blockchain', 'Web Development', 'Software Engineering (SE)', 'Distributed Systems',
  'Cloud Computing', 'Edge AI', 'Human-Computer Interaction (HCI)', 'Internet of Things (IoT)', 'Data Science', 'Big Data', 'Parallel Computing', 'Algorithm Design', 'Game Development', 'Operating Systems (OS)', 'Compiler Construction',
  'Sentiment Analysis', 'Named Entity Recognition (NER)', 'Machine Translation (MT)', 'Question Answering (QA)', 'Text Summarization', 'Speech-to-Text (STT)', 'Text-to-Speech (TTS)',
  'Mechanical Engineering (ME)', 'Mechatronics', 'Control Systems', 'Electrical Engineering (EE)', 'Power Electronics', 'VLSI Design', 'Embedded Systems', 'Signal Processing', 'Wireless Communication', 'Photonics',
  'Chemical Engineering', 'Process Systems', 'Civil Engineering', 'Structural Engineering', 'Environmental Engineering', 'Geotechnical Engineering', 'Aerospace Engineering', 'Avionics', 'Propulsion Systems',
  'Materials Science', 'Nanotechnology', 'Biomedical Engineering (BME)', 'Bioinformatics', 'Synthetic Biology', 'Automation', 'Energy Systems', 'Renewable Energy', 'Nuclear Engineering',

  // 3. Medicine & Health (의약학)
  'Anatomy', 'Physiology', 'Pathology', 'Pharmacology', 'Immunology', 'Neuroscience', 'Clinical Medicine', 'Internal Medicine', 'Surgery', 'Pediatrics', 'Obstetrics and Gynecology (OB/GYN)', 'Oncology',
  'Cardiology', 'Neurology', 'Gastroenterology', 'Dermatology', 'Endocrinology', 'Hematology', 'Infectious Diseases', 'Psychiatry', 'Radiology', 'Emergency Medicine', 'Ophthalmology', 'Otolaryngology', 'Urology',
  'Public Health', 'Epidemiology', 'Health Policy', 'Nursing Science', 'Dentistry', 'Oral Surgery', 'Pharmacogenomics', 'Toxicology', 'Biophysics', 'Medical Imaging (MRI/CT)', 'Telemedicine', 'Gerontology', 'Nutrition Science',

  // 4. Social Sciences (사회과학)
  'Sociology', 'Social Theory', 'Urban Sociology', 'Criminology', 'Economics', 'Macroeconomics', 'Microeconomics', 'Econometrics', 'Development Economics', 'Behavioral Economics', 'Labor Economics', 'Financial Economics',
  'Political Science', 'Comparative Politics', 'International Relations (IR)', 'Public Administration', 'Political Theory', 'Geopolitics', 'Psychology', 'Cognitive Science', 'Social Psychology', 'Developmental Psychology',
  'Neuropsychology', 'Clinical Psychology', 'Experimental Psychology', 'Anthropology', 'Cultural Anthropology', 'Archaeology', 'Education Policy', 'Pedagogy', 'Higher Education', 'Special Education', 'Educational Technology',
  'Communication Studies', 'Media Studies', 'Journalism', 'Business Administration (MBA)', 'Marketing', 'Strategic Management', 'Finance', 'Accounting', 'Law', 'Jurisprudence', 'International Law', 'Human Rights Law', 'Corporate Law',

  // 5. Humanities (인문학)
  'Philosophy', 'Ethics', 'Epistemology', 'Metaphysics', 'Logic', 'Phenomenology', 'Existentialism', 'Political Philosophy', 'Philosophy of Science', 'World History', 'Ancient History', 'Medieval History',
  'Modern History', 'Linguistics', 'Semantics', 'Phonetics', 'Phonology', 'Syntax', 'Pragmatics', 'Sociolinguistics', 'Historical Linguistics', 'Literature', 'Comparative Literature', 'Poetry', 'Drama', 'Prose',
  'Classical Studies', 'Theology', 'Religious Studies', 'Comparative Religion', 'Cultural Studies', 'Art History', 'Museum Studies', 'Hermeneutics', 'Epigraphy', 'Paleography',

  // 6. Arts & Sports (예술 및 체육)
  'Fine Arts', 'Painting', 'Sculpture', 'Photography', 'Graphic Design', 'Industrial Design', 'Visual Communication', 'Cinematography', 'Animation', 'Digital Art', 'Fashion Design', 'UI/UX Design', 'Interaction Design',
  'Music Theory', 'Composition', 'Musicology', 'Ethnomusicology', 'Music Production', 'Performance Art', 'Theater', 'Dance', 'Choreography', 'Physical Education', 'Kinesiology', 'Biomechanics', 'Exercise Physiology',
  'Sports Management', 'Sports Psychology', 'Sports Nutrition', 'Athletic Training', 'Sports Sociology', 'Sports Data Analysis'
];
