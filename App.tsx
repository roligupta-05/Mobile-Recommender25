import React, { useState, useMemo } from 'react';
import { 
  Smartphone, 
  Sliders, 
  Award, 
  Sparkles, 
  Info, 
  Battery, 
  Camera, 
  Cpu, 
  Monitor, 
  DollarSign, 
  Search, 
  Star, 
  Scale, 
  X, 
  Printer, 
  Check, 
  Sun, 
  Moon,
  HardDrive,
  Briefcase,
  Gamepad2,
  GraduationCap,
  Camera as CameraIcon,
  UserCheck,
  Zap,
  ArrowRight,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

import datasetJson from './data/cleaned_pj1_dataset.json';

export interface Phone {
  id: number;
  name: string;
  rating: number;
  price: number;
  camera: number;
  display_type: string;
  display_size: number;
  battery: number;
  storage_gb: number;
  ram: number;
  weight: number;
  processor: string;
  image: string;
  score?: number;
  scoreBreakdown?: Record<string, number>;
  matchExplanation?: string;
}

export interface PersonaConfig {
  id: string;
  title: string;
  icon: any;
  desc: string;
  badge: string;
  accentColor: string;
  weights: {
    priceValue: number;
    ram: number;
    camera: number;
    battery: number;
    storage: number;
    display: number;
    lightweight: number;
    rating: number;
  };
  explanationTemplate: (p: Phone) => string;
}

const BUYER_PERSONAS: Record<string, PersonaConfig> = {
  student: {
    id: 'student',
    title: 'Student',
    icon: GraduationCap,
    desc: 'Affordable, long-lasting performance for classes, campus life, and everyday multitasking.',
    badge: 'Value & Battery Focus',
    accentColor: 'from-pink-500 to-rose-400',
    weights: { priceValue: 0.35, ram: 0.15, camera: 0.10, battery: 0.20, storage: 0.10, display: 0.05, lightweight: 0.05, rating: 0.0 },
    explanationTemplate: (p) => `Exceptional value at $${p.price} with a durable ${p.battery}mAh battery and ${p.ram}GB RAM for campus multitasking.`
  },
  gamer: {
    id: 'gamer',
    title: 'Gamer',
    icon: Gamepad2,
    desc: 'High memory, strong processing, and battery life built for demanding games.',
    badge: 'Performance & RAM',
    accentColor: 'from-violet-500 to-purple-400',
    weights: { priceValue: 0.05, ram: 0.35, camera: 0.05, battery: 0.20, storage: 0.15, display: 0.10, lightweight: 0.0, rating: 0.10 },
    explanationTemplate: (p) => `Built for high-fps gaming with ${p.ram}GB RAM, ${p.processor} core processing, and a vibrant ${p.display_size}" display.`
  },
  photography: {
    id: 'photography',
    title: 'Photography Enthusiast',
    icon: CameraIcon,
    desc: 'Excellent cameras and ample storage for photos, videos, and creative work.',
    badge: 'Optics & Storage',
    accentColor: 'from-red-500 to-pink-400',
    weights: { priceValue: 0.10, ram: 0.10, camera: 0.45, battery: 0.10, storage: 0.15, display: 0.10, lightweight: 0.0, rating: 0.0 },
    explanationTemplate: (p) => `Stunning imaging choice featuring a high-resolution ${p.camera}MP camera system and ${p.storage_gb}GB storage for RAW media.`
  },
  business: {
    id: 'business',
    title: 'Business Professional',
    icon: Briefcase,
    desc: 'Reliable battery life, light portability, and storage for work on the move.',
    badge: 'Mobility & Battery',
    accentColor: 'from-teal-500 to-sea-green-400',
    weights: { priceValue: 0.15, ram: 0.20, camera: 0.05, battery: 0.25, storage: 0.20, display: 0.05, lightweight: 0.10, rating: 0.0 },
    explanationTemplate: (p) => `Professional-grade reliability weighing only ${p.weight}g with robust ${p.battery}mAh battery endurance.`
  },
  everyday: {
    id: 'everyday',
    title: 'Everyday User',
    icon: UserCheck,
    desc: 'A balanced combination of value, features, and dependable performance.',
    badge: 'Balanced All-Rounder',
    accentColor: 'from-cyan-500 to-teal-400',
    weights: { priceValue: 0.20, ram: 0.10, camera: 0.15, battery: 0.25, storage: 0.10, display: 0.10, lightweight: 0.0, rating: 0.10 },
    explanationTemplate: (p) => `Balanced crowd favorite with a stellar ${p.rating}★ user rating, versatile ${p.camera}MP camera, and dependable battery.`
  }
};

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'home' | 'recommendations' | 'discover' | 'compare' | 'about'>('home');
  const [selectedPersona, setSelectedPersona] = useState<string>('student');
  const [maxBudget, setMaxBudget] = useState<number>(1200);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRam, setSelectedRam] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'score' | 'priceAsc' | 'priceDesc' | 'rating' | 'camera'>('score');
  const [comparedPhones, setComparedPhones] = useState<Phone[]>([]);

  const phonesList: Phone[] = useMemo(() => datasetJson as Phone[], []);

  const recommendations = useMemo(() => {
    let filtered = phonesList.filter(p => p.price <= maxBudget);

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.processor.toLowerCase().includes(q));
    }

    if (selectedRam > 0) {
      filtered = filtered.filter(p => p.ram >= selectedRam);
    }

    if (filtered.length === 0) return [];

    const minMax = {
      price: { min: Math.min(...filtered.map(p => p.price)), max: Math.max(...filtered.map(p => p.price)) },
      ram: { min: Math.min(...filtered.map(p => p.ram)), max: Math.max(...filtered.map(p => p.ram)) },
      camera: { min: Math.min(...filtered.map(p => p.camera)), max: Math.max(...filtered.map(p => p.camera)) },
      battery: { min: Math.min(...filtered.map(p => p.battery)), max: Math.max(...filtered.map(p => p.battery)) },
      storage: { min: Math.min(...filtered.map(p => p.storage_gb)), max: Math.max(...filtered.map(p => p.storage_gb)) },
      display: { min: Math.min(...filtered.map(p => p.display_size)), max: Math.max(...filtered.map(p => p.display_size)) },
      weight: { min: Math.min(...filtered.map(p => p.weight)), max: Math.max(...filtered.map(p => p.weight)) },
      rating: { min: Math.min(...filtered.map(p => p.rating)), max: Math.max(...filtered.map(p => p.rating)) },
    };

    const norm = (val: number, min: number, max: number) => (max === min ? 1 : (val - min) / (max - min));
    const invNorm = (val: number, min: number, max: number) => (max === min ? 1 : (max - val) / (max - min));

    const personaConfig = BUYER_PERSONAS[selectedPersona] || BUYER_PERSONAS.student;
    const w = personaConfig.weights;

    const scored = filtered.map(p => {
      const pNorm = invNorm(p.price, minMax.price.min, minMax.price.max);
      const rNorm = norm(p.ram, minMax.ram.min, minMax.ram.max);
      const cNorm = norm(p.camera, minMax.camera.min, minMax.camera.max);
      const bNorm = norm(p.battery, minMax.battery.min, minMax.battery.max);
      const sNorm = norm(p.storage_gb, minMax.storage.min, minMax.storage.max);
      const dNorm = norm(p.display_size, minMax.display.min, minMax.display.max);
      const wNorm = invNorm(p.weight, minMax.weight.min, minMax.weight.max);
      const ratNorm = norm(p.rating, minMax.rating.min, minMax.rating.max);

      const score = (
        (pNorm * w.priceValue) +
        (rNorm * w.ram) +
        (cNorm * w.camera) +
        (bNorm * w.battery) +
        (sNorm * w.storage) +
        (dNorm * w.display) +
        (wNorm * w.lightweight) +
        (ratNorm * w.rating)
      ) * 100;

      return {
        ...p,
        score: Math.round(score),
        matchExplanation: personaConfig.explanationTemplate(p)
      };
    });

    if (sortBy === 'priceAsc') scored.sort((a, b) => a.price - b.price);
    else if (sortBy === 'priceDesc') scored.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') scored.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'camera') scored.sort((a, b) => b.camera - a.camera);
    else scored.sort((a, b) => (b.score || 0) - (a.score || 0));

    return scored;
  }, [phonesList, maxBudget, searchQuery, selectedRam, selectedPersona, sortBy]);

  const topRecommendations = recommendations.slice(0, 5);

  const toggleCompare = (phone: Phone) => {
    if (comparedPhones.find(p => p.id === phone.id)) {
      setComparedPhones(comparedPhones.filter(p => p.id !== phone.id));
    } else {
      if (comparedPhones.length >= 3) {
        setComparedPhones([...comparedPhones.slice(1), phone]);
      } else {
        setComparedPhones([...comparedPhones, phone]);
      }
    }
  };

  return (
    <div className={`min-h-screen font-sans selection:bg-pink-500 selection:text-white transition-colors duration-500 ${darkMode ? 'bg-[#07090E] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'}`}>
      
      {/* Navigation Bar */}
      <nav className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-300 ${darkMode ? 'bg-[#07090E]/80 border-slate-800/80' : 'bg-white/80 border-slate-200/80'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('home')}>
            <div className="p-2.5 bg-gradient-to-tr from-pink-500 via-violet-500 to-teal-400 text-white rounded-2xl font-bold shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform relative overflow-hidden">
              <Smartphone className="w-5 h-5" />
              {/* Corner mini phone badge */}
              <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-rose-400 rounded-full border border-white"></div>
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight">MobileFinder<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-violet-400">Pro</span></span>
              <span className="block text-[10px] text-slate-400 -mt-1 font-mono uppercase tracking-widest">PJ1 Algorithmic Engine</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1.5 p-1.5 rounded-2xl border bg-slate-900/20 dark:bg-slate-900/40 border-slate-700/30">
            {(['home', 'recommendations', 'discover', 'compare', 'about'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-pink-500 via-violet-500 to-teal-500 text-white shadow-md shadow-violet-500/20 font-extrabold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/20'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setDarkMode(!darkMode)} 
              className={`p-2.5 rounded-2xl border transition-all ${darkMode ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-sm'}`}
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {comparedPhones.length > 0 && (
              <button 
                onClick={() => setActiveTab('compare')}
                className="px-4 py-2.5 bg-gradient-to-r from-pink-500 to-violet-500 hover:opacity-90 text-white rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-pink-500/20 transition-all animate-pulse"
              >
                <Scale className="w-3.5 h-3.5" /> Compare ({comparedPhones.length})
              </button>
            )}
          </div>

        </div>
      </nav>

      {/* Main Content Sections */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {/* HOME / HERO TAB */}
        {activeTab === 'home' && (
          <div className="space-y-16 py-6">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left relative">
                {/* Corner decorative phone badge */}
                <div className="absolute -top-6 -left-6 w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 shadow-lg hidden sm:flex">
                  <Smartphone className="w-5 h-5" />
                </div>

                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-pink-500/10 text-pink-400 border border-pink-500/20 shadow-sm">
                  <Zap className="w-3.5 h-3.5" /> Powered by 413 Verified Smartphones Dataset
                </span>
                
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08]">
                  Precision Mobile Recommendations for <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-violet-400 to-teal-300">Your Lifestyle</span>
                </h1>
                
                <p className={`text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Move beyond basic price filters. Our multicolour-styled scoring engine evaluates 413 real models across camera, RAM, battery, and storage to rank top devices for your exact needs.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                  <button 
                    onClick={() => setActiveTab('recommendations')}
                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-pink-500 via-violet-500 to-teal-500 hover:opacity-90 text-white rounded-2xl font-extrabold text-sm shadow-xl shadow-violet-500/25 transition-all flex items-center justify-center gap-2 group"
                  >
                    <Sparkles className="w-4 h-4" /> Find My Phone <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button 
                    onClick={() => setActiveTab('discover')}
                    className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-sm border transition-all ${darkMode ? 'border-slate-800 bg-slate-900/50 text-slate-200 hover:bg-slate-800' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-sm'}`}
                  >
                    Explore All Phones
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-800/50 max-w-lg mx-auto lg:mx-0">
                  <div>
                    <div className="text-2xl font-black text-pink-400 font-mono">413</div>
                    <div className="text-xs text-slate-500">Verified Models</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-violet-400 font-mono">5</div>
                    <div className="text-xs text-slate-500">Buyer Personas</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-teal-400 font-mono">WLC</div>
                    <div className="text-xs text-slate-500">Scoring Engine</div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 relative">
                <div className="absolute -inset-1.5 bg-gradient-to-r from-pink-500 via-violet-500 to-teal-500 rounded-3xl blur-2xl opacity-20 animate-pulse"></div>
                
                {/* Corner phone badge illustration on card */}
                <div className="absolute -top-4 -right-4 w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-500 to-pink-500 p-0.5 shadow-xl z-20 flex items-center justify-center">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-white">
                    <Smartphone className="w-5 h-5 text-pink-400" />
                  </div>
                </div>

                <div className={`relative p-6 rounded-3xl border backdrop-blur-xl space-y-6 ${darkMode ? 'bg-[#111827]/90 border-slate-800' : 'bg-white border-slate-200 shadow-xl'}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-pink-400 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" /> Featured Flagship Model
                    </span>
                    <span className="text-xs font-mono text-slate-400">PJ1 Dataset</span>
                  </div>

                 <div className="relative h-60 rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center border border-slate-800">
                    <img 
                      src="https://png.pngtree.com/background/20230524/original/pngtree-d-rendering-of-a-3d-android-phone-with-app-icons-on-picture-image_2711792.jpg"
                      alt="Featured Phone" 
                      className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs font-mono font-bold text-pink-400">
                      $1,200 Max Tier
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-extrabold">Voltix Hyper67 5G</h3>
                    <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Ranked #1 for Photography & Power Users with 200MP optical sensors and 4,700mAh battery.
                    </p>
                  </div>

                  <button 
                    onClick={() => setActiveTab('recommendations')} 
                    className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all border border-slate-700"
                  >
                    View Recommendation Breakdown <ChevronRight className="w-3.5 h-3.5 text-pink-400" />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-8">
              <div className="text-center space-y-2 max-w-xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Select Your Buyer Persona</h2>
                <p className={`text-xs sm:text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Click any persona to instantly load tailored algorithm weights and find your top 5 recommended phones.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {Object.entries(BUYER_PERSONAS).map(([key, p]) => {
                  const IconComp = p.icon;
                  return (
                    <div 
                      key={key}
                      onClick={() => { setSelectedPersona(key); setActiveTab('recommendations'); }}
                      className={`p-6 rounded-3xl border transition-all duration-300 cursor-pointer group hover:-translate-y-1.5 relative overflow-hidden ${
                        darkMode 
                          ? 'bg-[#111827]/80 border-slate-800 hover:border-pink-500/50 hover:bg-[#151D2F]' 
                          : 'bg-white border-slate-200 hover:border-pink-500/50 shadow-sm hover:shadow-md'
                      }`}
                    >
                      {/* Corner phone badge */}
                      <div className="absolute top-2 right-2 text-slate-700 dark:text-slate-800 group-hover:text-pink-400 transition-colors">
                        <Smartphone className="w-4 h-4 opacity-40" />
                      </div>

                      <div className={`p-3.5 bg-gradient-to-tr ${p.accentColor} text-white rounded-2xl w-fit mb-4 group-hover:scale-110 transition-transform shadow-md`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono font-bold text-pink-400 uppercase tracking-wider">{p.badge}</span>
                      <h3 className="font-extrabold text-base mt-1 mb-2">{p.title}</h3>
                      <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{p.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* RECOMMENDATIONS TAB */}
        {activeTab === 'recommendations' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-4">
            
            <aside className="lg:col-span-4 space-y-6">
              <div className={`p-6 rounded-3xl border space-y-5 relative ${darkMode ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                {/* Corner phone badge */}
                <div className="absolute top-3 right-3 text-pink-500/30"><Smartphone className="w-5 h-5" /></div>

                <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-pink-400">
                  <UserCheck className="w-4 h-4" /> Select Buyer Persona
                </h3>
                <div className="space-y-2.5">
                  {Object.entries(BUYER_PERSONAS).map(([key, p]) => {
                    const isActive = selectedPersona === key;
                    const IconComp = p.icon;
                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedPersona(key)}
                        className={`w-full p-3.5 rounded-2xl border text-left text-xs transition-all flex items-center gap-3.5 ${
                          isActive
                            ? 'bg-gradient-to-r from-pink-500/10 via-violet-500/10 to-teal-500/10 border-pink-500 text-pink-400 font-bold shadow-sm'
                            : darkMode ? 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <div className={`p-2 rounded-xl text-white bg-gradient-to-tr ${p.accentColor} shadow-sm`}>
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-extrabold text-sm">{p.title}</div>
                          <div className="text-[10px] opacity-75">{p.badge}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className={`p-6 rounded-3xl border space-y-4 ${darkMode ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-pink-400">
                    <DollarSign className="w-4 h-4" /> Max Budget Filter
                  </span>
                  <span className="text-sm font-mono font-black text-pink-400 bg-pink-500/10 px-3 py-1 rounded-xl border border-pink-500/20">
                    ${maxBudget}
                  </span>
                </div>
                <input 
                  type="range" min={100} max={1200} step={20}
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(Number(e.target.value))}
                  className="w-full accent-pink-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
              </div>
            </aside>

            <main className="lg:col-span-8 space-y-5">
              <div className="flex items-center justify-between pb-2">
                <div>
                  <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                    <Award className="w-5 h-5 text-pink-500" /> Top 5 Matches for {BUYER_PERSONAS[selectedPersona].title}
                  </h2>
                  <p className="text-xs text-slate-400">Ranked using weighted linear combination on {recommendations.length} matching devices.</p>
                </div>
              </div>

              {topRecommendations.length === 0 ? (
                <div className={`p-12 text-center rounded-3xl border space-y-3 ${darkMode ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <Info className="w-10 h-10 text-slate-500 mx-auto" />
                  <p className="text-sm font-bold">No smartphones match this budget threshold.</p>
                  <p className="text-xs text-slate-400">Try increasing your max budget using the slider on the left.</p>
                </div>
              ) : (
                topRecommendations.map((phone, idx) => {
                  const isCompared = comparedPhones.some(p => p.id === phone.id);
                  return (
                    <div 
                      key={phone.id}
                      className={`p-6 rounded-3xl border transition-all duration-300 relative group overflow-hidden ${
                        idx === 0 
                          ? 'border-pink-500/80 shadow-xl bg-gradient-to-r from-pink-500/5 via-violet-500/5 to-transparent'
                          : darkMode ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                      }`}
                    >
                      {/* Corner phone badge at top-left/right */}
                      <div className="absolute top-2 left-2 text-pink-500/20 group-hover:text-pink-400 transition-colors">
                        <Smartphone className="w-4 h-4" />
                      </div>

                      {idx === 0 && (
                        <div className="absolute top-0 right-0 bg-gradient-to-r from-pink-500 to-violet-500 text-white text-[10px] font-black px-4 py-1 rounded-bl-2xl uppercase tracking-wider flex items-center gap-1 shadow-md">
                          <Sparkles className="w-3 h-3" /> #1 Best Match
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-6 items-start">
                        <div className="w-full sm:w-32 h-32 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shrink-0 flex items-center justify-center p-2 relative">
                          <img src="https://png.pngtree.com/background/20230524/original/pngtree-d-rendering-of-a-3d-android-phone-with-app-icons-on-picture-image_2711792.jpg" alt={phone.name} className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform" />
                          <div className="absolute bottom-1 right-1 text-white/50"><Smartphone className="w-3 h-3" /></div>
                        </div>

                        <div className="flex-1 space-y-3 w-full">
                          <div>
                            <div className="flex items-center gap-2 text-xs font-mono">
                              <span className="text-pink-400 font-bold">Rank #{idx + 1}</span>
                              <span className="text-slate-600">•</span>
                              <span className="text-amber-400 font-bold flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400" /> {phone.rating}</span>
                            </div>
                            <h3 className="text-lg font-black">{phone.name}</h3>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono text-slate-300 bg-slate-900/50 p-3 rounded-2xl border border-slate-800/60">
                            <div><span className="text-slate-500 block text-[10px]">CPU</span> {phone.processor}</div>
                            <div><span className="text-slate-500 block text-[10px]">CAMERA</span> {phone.camera} MP</div>
                            <div><span className="text-slate-500 block text-[10px]">BATTERY</span> {phone.battery} mAh</div>
                            <div><span className="text-slate-500 block text-[10px]">RAM/STORAGE</span> {phone.ram}GB / {phone.storage_gb}GB</div>
                          </div>

                          <p className="text-xs text-slate-400 italic bg-pink-500/5 p-3 rounded-xl border border-pink-500/10">
                            "{phone.matchExplanation}"
                          </p>
                        </div>

                        <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800 gap-3">
                          <div className="text-right">
                            <div className="text-2xl font-black font-mono text-pink-400">${phone.price}</div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">Match: {phone.score}/100</div>
                          </div>
                          <button
                            onClick={() => toggleCompare(phone)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                              isCompared ? 'bg-gradient-to-r from-pink-500 to-violet-500 text-white font-extrabold shadow-md' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                            }`}
                          >
                            <Scale className="w-3.5 h-3.5" /> {isCompared ? 'Comparing' : 'Compare'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </main>
          </div>
        )}

        {/* DISCOVER TAB */}
        {activeTab === 'discover' && (
          <div className="space-y-6 py-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h2 className="text-2xl font-black tracking-tight">Smartphone Directory</h2>
                <p className="text-xs text-slate-400">Explore all 413 devices loaded from PJ1_Dataset.xlsx.</p>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search model or processor..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-2xl text-xs transition-all ${darkMode ? 'bg-[#111827] border-slate-800 text-slate-200 focus:border-pink-500' : 'bg-white border-slate-200 text-slate-800 shadow-sm'}`}
                  />
                </div>

                <select 
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className={`px-4 py-2.5 border rounded-2xl text-xs font-semibold ${darkMode ? 'bg-[#111827] border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800 shadow-sm'}`}
                >
                  <option value="score">Sort by Relevance</option>
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                  <option value="rating">Highest Rating</option>
                  <option value="camera">Highest Camera MP</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {recommendations.slice(0, 30).map(phone => (
                <div key={phone.id} className={`p-5 rounded-3xl border space-y-3 hover:border-pink-500/50 transition-all relative overflow-hidden ${darkMode ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <div className="absolute top-2 right-2 text-pink-500/20"><Smartphone className="w-4 h-4" /></div>
                  <div className="flex justify-between items-start">
                    <h4 className="font-extrabold text-sm truncate pr-4">{phone.name}</h4>
                    <span className="text-pink-400 font-mono font-bold text-sm">${phone.price}</span>
                  </div>
                  <div className="text-xs text-slate-400 space-y-1 font-mono">
                    <div className="flex justify-between"><span>Rating:</span> <strong className="text-amber-400">{phone.rating} ★</strong></div>
                    <div className="flex justify-between"><span>Processor:</span> <strong className="text-slate-300">{phone.processor}</strong></div>
                    <div className="flex justify-between"><span>RAM / Storage:</span> <strong className="text-slate-300">{phone.ram}GB / {phone.storage_gb}GB</strong></div>
                    <div className="flex justify-between"><span>Camera:</span> <strong className="text-slate-300">{phone.camera} MP</strong></div>
                  </div>
                  <button 
                    onClick={() => toggleCompare(phone)} 
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all border border-slate-700"
                  >
                    {comparedPhones.some(p => p.id === phone.id) ? 'Remove from Compare' : 'Add to Compare'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COMPARE TAB */}
        {activeTab === 'compare' && (
          <div className="space-y-6 py-4">
            <h2 className="text-2xl font-black flex items-center gap-2">
              <Scale className="w-6 h-6 text-pink-500" /> Side-by-Side Comparison
            </h2>

            {comparedPhones.length === 0 ? (
              <div className={`p-16 text-center rounded-3xl border space-y-3 ${darkMode ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <Scale className="w-10 h-10 text-slate-500 mx-auto" />
                <p className="text-base font-bold">No smartphones selected for comparison.</p>
                <p className="text-xs text-slate-400">Click the Compare button on any phone card to compare up to 3 devices side-by-side.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {comparedPhones.map(phone => (
                  <div key={phone.id} className={`p-6 rounded-3xl border space-y-4 relative overflow-hidden ${darkMode ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200 shadow-md'}`}>
                    <div className="absolute top-2 right-2 text-pink-500/20"><Smartphone className="w-4 h-4" /></div>
                    <button onClick={() => toggleCompare(phone)} className="absolute top-4 right-8 p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"><X className="w-4 h-4" /></button>
                    <h3 className="font-extrabold text-base pr-12">{phone.name}</h3>
                    <div className="text-2xl font-black text-pink-400 font-mono">${phone.price}</div>
                    
                    <div className="space-y-2.5 text-xs border-t border-slate-800 pt-4 text-slate-300 font-mono">
                      <div className="flex justify-between"><strong>Rating:</strong> <span className="text-amber-400">{phone.rating} ★</span></div>
                      <div className="flex justify-between"><strong>Processor:</strong> <span>{phone.processor}</span></div>
                      <div className="flex justify-between"><strong>RAM:</strong> <span>{phone.ram} GB</span></div>
                      <div className="flex justify-between"><strong>Storage:</strong> <span>{phone.storage_gb} GB</span></div>
                      <div className="flex justify-between"><strong>Camera:</strong> <span>{phone.camera} MP</span></div>
                      <div className="flex justify-between"><strong>Battery:</strong> <span>{phone.battery} mAh</span></div>
                      <div className="flex justify-between"><strong>Display:</strong> <span>{phone.display_size}" {phone.display_type}</span></div>
                      <div className="flex justify-between"><strong>Weight:</strong> <span>{phone.weight} g</span></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ABOUT TAB */}
        {activeTab === 'about' && (
          <div className={`p-8 sm:p-12 rounded-3xl border space-y-6 max-w-3xl mx-auto my-6 relative overflow-hidden ${darkMode ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200 shadow-md'}`}>
            <div className="absolute top-3 right-3 text-pink-500/20"><Smartphone className="w-6 h-6" /></div>
            <h2 className="text-2xl font-black text-pink-400">About MobileFinder Pro Engine</h2>
            <p className="text-sm leading-relaxed text-slate-400">
              MobileFinder Pro was developed as part of the Samsung Innovation Campus (SIC) curriculum. It solves e-commerce choice overload by transforming user lifestyle requirements into mathematical weight vectors, ranking 413 real smartphone models via Min-Max Feature Scaling and Weighted Linear Combination.
            </p>
            <div className="text-xs text-slate-400 space-y-2 pt-4 border-t border-slate-800 font-mono">
              <div className="flex justify-between"><span>Dataset Source:</span> <strong className="text-slate-200">PJ1_Dataset.xlsx (413 rows, 11 columns)</strong></div>
              <div className="flex justify-between"><span>Normalization:</span> <strong className="text-slate-200">Min-Max Feature Scaling</strong></div>
              <div className="flex justify-between"><span>Ranking Algorithm:</span> <strong className="text-slate-200">Weighted Linear Combination (WLC)</strong></div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}