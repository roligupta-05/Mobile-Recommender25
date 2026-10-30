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
  Filter,
  ArrowUpDown
} from 'lucide-react';

// Cleaned Dataset of 413 Smartphones from PJ1_Dataset.xlsx
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
  score?: number;
  scoreBreakdown?: Record<string, number>;
  matchExplanation?: string;
}

export interface PersonaConfig {
  id: string;
  title: string;
  icon: any;
  desc: string;
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
    desc: 'Focuses on maximum price-to-performance value, long battery life, and generous storage for study media.',
    weights: { priceValue: 0.35, ram: 0.15, camera: 0.10, battery: 0.20, storage: 0.10, display: 0.05, lightweight: 0.05, rating: 0.0 },
    explanationTemplate: (p) => `Ideal student pick offering high $${p.price} value, a huge ${p.battery}mAh battery, and ${p.ram}GB RAM for multitasking during long study sessions.`
  },
  gamer: {
    id: 'gamer',
    title: 'Gamer',
    icon: Gamepad2,
    desc: 'Prioritizes maximum RAM bandwidth, high processor throughput, vibrant display, and heavy thermal battery endurance.',
    weights: { priceValue: 0.05, ram: 0.35, camera: 0.05, battery: 0.20, storage: 0.15, display: 0.10, lightweight: 0.0, rating: 0.10 },
    explanationTemplate: (p) => `Top gaming performer packed with ${p.ram}GB RAM, ${p.processor} processing speed, and a massive ${p.display_size}" display.`
  },
  photography: {
    id: 'photography',
    title: 'Photography Enthusiast',
    icon: CameraIcon,
    desc: 'Max camera sensor resolution, high-color OLED display accuracy, and ample cloud/local media storage.',
    weights: { priceValue: 0.10, ram: 0.10, camera: 0.45, battery: 0.10, storage: 0.15, display: 0.10, lightweight: 0.0, rating: 0.0 },
    explanationTemplate: (p) => `Outstanding optical choice featuring an ultra-high ${p.camera}MP primary camera system and ${p.storage_gb}GB local media storage.`
  },
  business: {
    id: 'business',
    title: 'Business Professional',
    icon: Briefcase,
    desc: 'Requires all-day operational uptime, lightweight ergonomic mobility, fast app switching, and huge storage capacity.',
    weights: { priceValue: 0.15, ram: 0.20, camera: 0.05, battery: 0.25, storage: 0.20, display: 0.05, lightweight: 0.10, rating: 0.0 },
    explanationTemplate: (p) => `Reliable productivity flagship weighing only ${p.weight}g with ${p.battery}mAh battery endurance and ${p.ram}GB RAM.`
  },
  everyday: {
    id: 'everyday',
    title: 'Everyday User',
    icon: UserCheck,
    desc: 'Balanced, highly rated daily driver prioritizing ease of use, dependable battery life, and solid user feedback.',
    weights: { priceValue: 0.20, ram: 0.10, camera: 0.15, battery: 0.25, storage: 0.10, display: 0.10, lightweight: 0.0, rating: 0.10 },
    explanationTemplate: (p) => `All-round crowd favorite with a stellar ${p.rating}★ user rating, balanced ${p.camera}MP camera, and dependable battery.`
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

  // Raw dataset cast
  const phonesList: Phone[] = useMemo(() => datasetJson as Phone[], []);

  // Compute recommendation scores using Min-Max Scaling and WLC
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

    // Extract Min/Max for Normalization
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
        scoreBreakdown: {
          PriceValue: Math.round(pNorm * 100),
          RAM: Math.round(rNorm * 100),
          Camera: Math.round(cNorm * 100),
          Battery: Math.round(bNorm * 100),
          Storage: Math.round(sNorm * 100),
        },
        matchExplanation: personaConfig.explanationTemplate(p)
      };
    });

    // Sorting Logic
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
    <div className={`min-h-screen font-sans transition-colors duration-300 ${darkMode ? 'bg-[#0B0F19] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Navigation Bar */}
      <nav className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-300 ${darkMode ? 'bg-[#111827]/90 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="p-2.5 bg-emerald-500 text-slate-950 rounded-xl font-bold shadow-lg shadow-emerald-500/20">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight">MobileFinder<span className="text-emerald-500">Pro</span></span>
              <span className="block text-[10px] text-slate-400 -mt-1 font-mono uppercase tracking-widest">PJ1 Engine</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1 bg-slate-800/40 dark:bg-slate-900/60 p-1 rounded-xl border border-slate-700/50">
            {(['home', 'recommendations', 'discover', 'compare', 'about'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                  activeTab === tab
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setDarkMode(!darkMode)} 
              className={`p-2 rounded-xl border transition-all ${darkMode ? 'bg-slate-800 border-slate-700 text-amber-400' : 'bg-slate-100 border-slate-200 text-slate-700'}`}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {comparedPhones.length > 0 && (
              <button 
                onClick={() => setActiveTab('compare')}
                className="px-3 py-1.5 bg-emerald-500 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1 shadow-md"
              >
                <Scale className="w-3.5 h-3.5" /> Compare ({comparedPhones.length})
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Body Routing */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        
        {/* HERO / HOME TAB */}
        {activeTab === 'home' && (
          <div className="space-y-12 py-8">
            <div className="text-center space-y-6 max-w-3xl mx-auto">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Zap className="w-3.5 h-3.5" /> Data-Driven Recommendation Engine
              </span>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none">
                Find the Perfect Phone for Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">Unique Lifestyle</span>
              </h1>
              <p className={`text-sm sm:text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Stop sorting through endless specs. Our algorithm analyzes 413 real smartphone models against 5 custom buyer personas using Weighted Linear Combination scoring.
              </p>
              <div className="flex items-center justify-center gap-4 pt-2">
                <button 
                  onClick={() => setActiveTab('recommendations')}
                  className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-bold text-sm shadow-xl shadow-emerald-500/20 transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" /> Find My Phone
                </button>
                <button 
                  onClick={() => setActiveTab('discover')}
                  className={`px-6 py-3.5 rounded-xl font-bold text-sm border transition-all ${darkMode ? 'border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'}`}
                >
                  Explore All Phones
                </button>
              </div>
            </div>

            {/* Persona Quick Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-6">
              {Object.entries(BUYER_PERSONAS).map(([key, p]) => {
                const IconComponent = p.icon;
                return (
                  <div 
                    key={key} 
                    onClick={() => { setSelectedPersona(key); setActiveTab('recommendations'); }}
                    className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer hover:-translate-y-1 ${
                      darkMode ? 'bg-[#111827] border-slate-800 hover:border-emerald-500/50' : 'bg-white border-slate-200 hover:border-emerald-500/50 shadow-sm'
                    }`}
                  >
                    <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl w-fit mb-3">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-sm mb-1">{p.title}</h3>
                    <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{p.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* RECOMMENDATIONS TAB */}
        {activeTab === 'recommendations' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Sidebar Controls */}
            <aside className="lg:col-span-4 space-y-5">
              
              {/* Persona Selector */}
              <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200'}`}>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-500" /> Select Buyer Persona
                </h3>
                <div className="space-y-2">
                  {Object.entries(BUYER_PERSONAS).map(([key, p]) => {
                    const isActive = selectedPersona === key;
                    const IconComp = p.icon;
                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedPersona(key)}
                        className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center gap-3 ${
                          isActive
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold'
                            : darkMode ? 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        <IconComp className="w-4 h-4 shrink-0 text-emerald-500" />
                        <div>
                          <div className="font-bold text-sm">{p.title}</div>
                          <div className="text-[10px] opacity-80">{p.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Range Slider */}
              <div className={`p-5 rounded-2xl border space-y-3 ${darkMode ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-500" /> Max Budget Filter
                  </span>
                  <span className="text-sm font-mono font-extrabold text-emerald-400">${maxBudget}</span>
                </div>
                <input 
                  type="range" min={100} max={1200} step={20}
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-slate-700 h-2 rounded-lg cursor-pointer"
                />
              </div>

            </aside>

            {/* Main Recommendations Display */}
            <main className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-500" /> Top 5 Matches for {BUYER_PERSONAS[selectedPersona].title}
                </h2>
                <span className="text-xs text-slate-400 font-mono">Found {recommendations.length} eligible devices</span>
              </div>

              {topRecommendations.length === 0 ? (
                <div className={`p-12 text-center rounded-2xl border space-y-3 ${darkMode ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200'}`}>
                  <Info className="w-8 h-8 text-slate-500 mx-auto" />
                  <p className="text-sm">No smartphones available within this budget threshold. Increase the budget slider.</p>
                </div>
              ) : (
                topRecommendations.map((phone, idx) => {
                  const isCompared = comparedPhones.some(p => p.id === phone.id);
                  return (
                    <div 
                      key={phone.id}
                      className={`p-5 rounded-2xl border transition-all duration-300 relative ${
                        idx === 0 
                          ? 'border-emerald-500/80 shadow-lg bg-gradient-to-r from-emerald-500/5 via-transparent to-transparent'
                          : darkMode ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-emerald-500">#{idx + 1} Recommendation</span>
                            <span className="text-xs text-slate-400 font-bold">• {phone.rating} ★</span>
                          </div>
                          <h3 className="text-lg font-extrabold">{phone.name}</h3>
                          
                          {/* Specs breakdown */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-2">
                            <div className="flex items-center gap-1.5 text-slate-400"><Cpu className="w-3.5 h-3.5 text-blue-400" /> {phone.processor}</div>
                            <div className="flex items-center gap-1.5 text-slate-400"><Camera className="w-3.5 h-3.5 text-emerald-400" /> {phone.camera} MP</div>
                            <div className="flex items-center gap-1.5 text-slate-400"><Battery className="w-3.5 h-3.5 text-purple-400" /> {phone.battery} mAh</div>
                            <div className="flex items-center gap-1.5 text-slate-400"><HardDrive className="w-3.5 h-3.5 text-amber-400" /> {phone.ram}GB RAM / {phone.storage_gb}GB</div>
                          </div>

                          {/* Match Explanation */}
                          <p className="text-xs text-slate-400 italic pt-2 bg-emerald-500/5 p-2.5 rounded-lg border border-emerald-500/10">
                            "{phone.matchExplanation}"
                          </p>
                        </div>

                        {/* Price & WLC Score */}
                        <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-slate-800 gap-3">
                          <div className="text-right">
                            <div className="text-2xl font-black font-mono text-emerald-400">${phone.price}</div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">WLC Match: {phone.score}/100</div>
                          </div>
                          <button
                            onClick={() => toggleCompare(phone)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${
                              isCompared ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                            }`}
                          >
                            <Scale className="w-3.5 h-3.5" /> {isCompared ? 'Added' : 'Compare'}
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

        {/* DISCOVER ALL PHONES TAB */}
        {activeTab === 'discover' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search by model or processor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-9 pr-4 py-2 border rounded-xl text-xs ${darkMode ? 'bg-[#111827] border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'}`}
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <select 
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className={`px-3 py-2 border rounded-xl text-xs font-semibold ${darkMode ? 'bg-[#111827] border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'}`}
                >
                  <option value="score">Sort by Relevance</option>
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                  <option value="rating">Highest Rating</option>
                  <option value="camera">Highest Camera MP</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.slice(0, 24).map(phone => (
                <div key={phone.id} className={`p-4 rounded-xl border space-y-3 ${darkMode ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-sm truncate">{phone.name}</h4>
                    <span className="text-emerald-400 font-mono font-bold text-sm">${phone.price}</span>
                  </div>
                  <div className="text-xs text-slate-400 space-y-1 font-mono">
                    <div>Rating: {phone.rating} ★</div>
                    <div>Processor: {phone.processor}</div>
                    <div>RAM/Storage: {phone.ram}GB / {phone.storage_gb}GB</div>
                    <div>Camera: {phone.camera} MP</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COMPARE TAB */}
        {activeTab === 'compare' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-500" /> Side-by-Side Comparison
            </h2>

            {comparedPhones.length === 0 ? (
              <div className={`p-12 text-center rounded-2xl border space-y-2 ${darkMode ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200'}`}>
                <Scale className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="text-sm">No smartphones selected for comparison. Click "Compare" on phone cards to compare up to 3 devices.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {comparedPhones.map(phone => (
                  <div key={phone.id} className={`p-5 rounded-2xl border space-y-3 relative ${darkMode ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200'}`}>
                    <button onClick={() => toggleCompare(phone)} className="absolute top-3 right-3 text-slate-400 hover:text-slate-200"><X className="w-4 h-4" /></button>
                    <h3 className="font-bold text-base pr-6">{phone.name}</h3>
                    <div className="text-xl font-extrabold text-emerald-400 font-mono">${phone.price}</div>
                    <div className="space-y-2 text-xs border-t border-slate-800 pt-3 text-slate-300">
                      <div><strong>Rating:</strong> {phone.rating} ★</div>
                      <div><strong>Processor:</strong> {phone.processor}</div>
                      <div><strong>RAM:</strong> {phone.ram} GB</div>
                      <div><strong>Storage:</strong> {phone.storage_gb} GB</div>
                      <div><strong>Camera:</strong> {phone.camera} MP</div>
                      <div><strong>Battery:</strong> {phone.battery} mAh</div>
                      <div><strong>Display:</strong> {phone.display_size}" {phone.display_type}</div>
                      <div><strong>Weight:</strong> {phone.weight} g</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ABOUT TAB */}
        {activeTab === 'about' && (
          <div className={`p-8 rounded-2xl border space-y-4 max-w-3xl mx-auto ${darkMode ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200'}`}>
            <h2 className="text-xl font-extrabold text-emerald-400">About MobileFinder Pro Engine</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              MobileFinder Pro was built as part of the Samsung Innovation Campus (SIC) curriculum[cite: 7]. It solves the problem of e-commerce overload by converting user lifestyle priorities into exact algorithmic multipliers[cite: 7].
            </p>
            <div className="text-xs text-slate-400 space-y-2 pt-2 border-t border-slate-800 font-mono">
              <div>Dataset Size: 413 Smartphones (Cleaned & Standardized)[cite: 7]</div>
              <div>Primary Currency: USD ($)</div>
              <div>Algorithm: Min-Max Feature Scaling & Weighted Linear Combination (WLC)</div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}