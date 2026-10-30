import React, { useState, useMemo } from 'react';
import { 
  Smartphone, 
  Sliders, 
  Award, 
  Sparkles, 
  Info,
  Layers,
  Battery,
  Camera,
  Cpu,
  Monitor,
  IndianRupee,
  Search,
  Star,
  Scale,
  X,
  Printer,
  Tag,
  Check,
  Sun,
  Moon
} from 'lucide-react';

interface Phone {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  discount: string;
  rating: number;
  reviews: string;
  image: string;
  performance: number;
  camera: number;
  battery: number;
  display: number;
  weight: string;
  badge: string;
  specs: {
    processor: string;
    mainCam: string;
    display: string;
    battery: string;
  };
  score?: number;
}

const PHONE_DATASET: Phone[] = [
  { 
    id: 1, 
    name: "Samsung Galaxy S24 Ultra 5G", 
    brand: "Samsung", 
    price: 129999, 
    originalPrice: 139999,
    discount: "7% OFF",
    rating: 4.8,
    reviews: "12,420",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80",
    performance: 98, 
    camera: 97, 
    battery: 92, 
    display: 99,
    weight: "232g",
    badge: "Flagship Titan",
    specs: { processor: "Snapdragon 8 Gen 3", mainCam: "200MP Quad Cam", display: "6.8\" QHD+ Dynamic AMOLED 2X", battery: "5000 mAh" }
  },
  { 
    id: 2, 
    name: "Apple iPhone 15 Pro Max", 
    brand: "Apple", 
    price: 139900, 
    originalPrice: 159900,
    discount: "12% OFF",
    rating: 4.9,
    reviews: "18,950",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80",
    performance: 99, 
    camera: 98, 
    battery: 94, 
    display: 97,
    weight: "221g",
    badge: "Pro Benchmark",
    specs: { processor: "A17 Pro Chip", mainCam: "48MP Triple Cam", display: "6.7\" Super Retina XDR", battery: "4422 mAh" }
  },
  { 
    id: 3, 
    name: "OnePlus 12 5G", 
    brand: "OnePlus", 
    price: 64999, 
    originalPrice: 69999,
    discount: "7% OFF",
    rating: 4.6,
    reviews: "8,310",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80",
    performance: 94, 
    camera: 90, 
    battery: 96, 
    display: 95,
    weight: "220g",
    badge: "Value Leader",
    specs: { processor: "Snapdragon 8 Gen 3", mainCam: "50MP Hasselblad", display: "6.82\" 2K 120Hz ProXDR", battery: "5400 mAh" }
  },
  { 
    id: 4, 
    name: "Google Pixel 8 Pro", 
    brand: "Google", 
    price: 106999, 
    originalPrice: 115999,
    discount: "8% OFF",
    rating: 4.5,
    reviews: "5,120",
    image: "https://images.unsplash.com/photo-1598327106026-d9521da673d1?auto=format&fit=crop&w=600&q=80",
    performance: 88, 
    camera: 99, 
    battery: 88, 
    display: 96,
    weight: "213g",
    badge: "AI Imaging Pro",
    specs: { processor: "Google Tensor G3", mainCam: "50MP Triple AI Cam", display: "6.7\" Super Actua OLED", battery: "5050 mAh" }
  },
  { 
    id: 5, 
    name: "iQOO 12 5G", 
    brand: "iQOO", 
    price: 52999, 
    originalPrice: 59999,
    discount: "11% OFF",
    rating: 4.7,
    reviews: "6,400",
    image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=600&q=80",
    performance: 96, 
    camera: 87, 
    battery: 93, 
    display: 92,
    weight: "203g",
    badge: "Gaming Beast",
    specs: { processor: "Snapdragon 8 Gen 3 + Q1", mainCam: "50MP Telephoto", display: "6.78\" 144Hz AMOLED", battery: "5000 mAh" }
  },
  { 
    id: 6, 
    name: "Nothing Phone (2)", 
    brand: "Nothing", 
    price: 37999, 
    originalPrice: 44999,
    discount: "15% OFF",
    rating: 4.4,
    reviews: "9,150",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80",
    performance: 85, 
    camera: 82, 
    battery: 89, 
    display: 90,
    weight: "201g",
    badge: "Iconic Design",
    specs: { processor: "Snapdragon 8+ Gen 1", mainCam: "50MP Dual Sony", display: "6.7\" LTPO OLED", battery: "4700 mAh" }
  },
  { 
    id: 7, 
    name: "Redmi Note 13 Pro+ 5G", 
    brand: "Xiaomi", 
    price: 31999, 
    originalPrice: 35999,
    discount: "11% OFF",
    rating: 4.3,
    reviews: "14,800",
    image: "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?auto=format&fit=crop&w=600&q=80",
    performance: 80, 
    camera: 84, 
    battery: 91, 
    display: 88,
    weight: "204.5g",
    badge: "Budget Champ",
    specs: { processor: "Dimensity 7200 Ultra", mainCam: "200MP OIS Cam", display: "6.67\" 1.5K Curved 120Hz", battery: "5000 mAh" }
  },
  { 
    id: 8, 
    name: "Realme GT 6T 5G", 
    brand: "Realme", 
    price: 30999, 
    originalPrice: 33999,
    discount: "8% OFF",
    rating: 4.5,
    reviews: "7,320",
    image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=600&q=80",
    performance: 87, 
    camera: 80, 
    battery: 97, 
    display: 89,
    weight: "191g",
    badge: "Monster Battery",
    specs: { processor: "Snapdragon 7+ Gen 3", mainCam: "50MP Sony LYT-600", display: "6.78\" 6000nits LTPO", battery: "5500 mAh" }
  }
];

const BUYER_PERSONAS: Record<string, { title: string; desc: string; weights: { performance: number; camera: number; battery: number; display: number } }> = {
  gamer: {
    title: "Mobile Gaming Pro",
    desc: "Max raw performance & smooth high refresh rate",
    weights: { performance: 0.50, display: 0.25, battery: 0.20, camera: 0.05 }
  },
  photographer: {
    title: "Content & Camera Creator",
    desc: "Focuses on high-res sensor & optical clarity",
    weights: { camera: 0.55, display: 0.25, performance: 0.15, battery: 0.05 }
  },
  powerUser: {
    title: "All-Day Power User",
    desc: "Heavy multi-tasking & long battery endurance",
    weights: { battery: 0.40, performance: 0.35, display: 0.15, camera: 0.10 }
  },
  balanced: {
    title: "Everyday Balanced",
    desc: "Equal priority across speed, camera & battery",
    weights: { performance: 0.25, camera: 0.25, battery: 0.25, display: 0.25 }
  }
};

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [selectedPersona, setSelectedPersona] = useState<string>('balanced');
  const [maxBudget, setMaxBudget] = useState<number>(150000);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [comparedPhones, setComparedPhones] = useState<Phone[]>([]);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);
  const [weights, setWeights] = useState(BUYER_PERSONAS.balanced.weights);

  const handlePersonaSelect = (key: string) => {
    setSelectedPersona(key);
    setWeights(BUYER_PERSONAS[key].weights);
  };

  const toggleCompare = (phone: Phone) => {
    if (comparedPhones.find(p => p.id === phone.id)) {
      setComparedPhones(comparedPhones.filter(p => p.id !== phone.id));
    } else {
      if (comparedPhones.length >= 2) {
        setComparedPhones([comparedPhones[1], phone]);
      } else {
        setComparedPhones([...comparedPhones, phone]);
      }
    }
  };

  const brands = useMemo(() => {
    return ['All', ...Array.from(new Set(PHONE_DATASET.map(p => p.brand)))];
  }, []);

  const recommendations = useMemo(() => {
    let filtered = PHONE_DATASET.filter(p => p.price <= maxBudget);

    if (selectedBrand !== 'All') {
      filtered = filtered.filter(p => p.brand === selectedBrand);
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
    }

    if (filtered.length === 0) return [];

    const minMax = {
      perf: { min: Math.min(...filtered.map(p => p.performance)), max: Math.max(...filtered.map(p => p.performance)) },
      cam: { min: Math.min(...filtered.map(p => p.camera)), max: Math.max(...filtered.map(p => p.camera)) },
      bat: { min: Math.min(...filtered.map(p => p.battery)), max: Math.max(...filtered.map(p => p.battery)) },
      disp: { min: Math.min(...filtered.map(p => p.display)), max: Math.max(...filtered.map(p => p.display)) }
    };

    const normalize = (val: number, min: number, max: number) => (max === min ? 1 : (val - min) / (max - min));

    return filtered.map(phone => {
      const normPerf = normalize(phone.performance, minMax.perf.min, minMax.perf.max);
      const normCam = normalize(phone.camera, minMax.cam.min, minMax.cam.max);
      const normBat = normalize(phone.battery, minMax.bat.min, minMax.bat.max);
      const normDisp = normalize(phone.display, minMax.disp.min, minMax.disp.max);

      const score = (
        (normPerf * weights.performance) +
        (normCam * weights.camera) +
        (normBat * weights.battery) +
        (normDisp * weights.display)
      ) * 100;

      return { ...phone, score: Math.round(score) };
    }).sort((a, b) => (b.score || 0) - (a.score || 0));
  }, [maxBudget, weights, selectedBrand, searchQuery]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-[#090D16] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'}`}>
      
      {/* Top Header */}
      <header className={`backdrop-blur-md border-b sticky top-0 z-40 transition-colors duration-300 ${darkMode ? 'bg-[#0D1322]/90 border-white/10' : 'bg-white/90 border-slate-200 shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 rounded-xl font-bold shadow-lg shadow-emerald-500/20">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className={`text-base sm:text-lg font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    Mobile Finder Pro
                  </h1>
                  <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase tracking-wider">
                    WLC Engine
                  </span>
                </div>
                <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Algorithmic Smartphone Selection & Comparison</p>
              </div>
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-xl border transition-all ${darkMode ? 'bg-[#131B2E] border-white/10 text-amber-400' : 'bg-slate-100 border-slate-200 text-slate-700'}`}
                title="Toggle Theme"
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              {comparedPhones.length > 0 && (
                <button 
                  onClick={() => setShowCompareModal(true)} 
                  className="px-3 py-1.5 bg-emerald-500 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1 shadow-md"
                >
                  <Scale className="w-3.5 h-3.5" /> ({comparedPhones.length})
                </button>
              )}
            </div>
          </div>

          <div className="relative w-full md:w-80">
            <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-slate-400' : 'text-slate-400'}`} />
            <input 
              type="text" 
              placeholder="Search by brand or model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-4 py-2 border rounded-xl text-xs transition-all shadow-inner focus:outline-none focus:border-emerald-500 ${
                darkMode 
                  ? 'bg-[#131B2E] border-white/10 text-slate-200 placeholder-slate-500' 
                  : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
              }`}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-semibold ${
                darkMode 
                  ? 'bg-[#131B2E] border-white/10 text-amber-400 hover:bg-[#1A243B]' 
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
              title="Toggle Light/Dark Theme"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>

            <button 
              onClick={() => window.print()} 
              className={`px-3 py-2 border rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                darkMode ? 'bg-[#131B2E] hover:bg-[#1A243B] border-white/10 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
              }`}
            >
              <Printer className="w-3.5 h-3.5 text-emerald-500" /> Print
            </button>
            {comparedPhones.length > 0 && (
              <button 
                onClick={() => setShowCompareModal(true)} 
                className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all"
              >
                <Scale className="w-3.5 h-3.5" /> Compare Specs ({comparedPhones.length})
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Sidebar Controls */}
        <aside className="lg:col-span-4 space-y-5">
          <div className={`border rounded-2xl p-5 shadow-xl transition-colors duration-300 ${darkMode ? 'bg-[#111827] border-white/10' : 'bg-white border-slate-200'}`}>
            <h2 className={`text-xs font-bold uppercase tracking-wider mb-3.5 flex items-center gap-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              <Layers className="w-4 h-4 text-emerald-500" /> Select Buyer Persona
            </h2>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(BUYER_PERSONAS).map(([key, persona]) => {
                const isActive = selectedPersona === key;
                return (
                  <button
                    key={key}
                    onClick={() => handlePersonaSelect(key)}
                    className={`p-3 text-left rounded-xl border transition-all text-xs relative ${
                      isActive 
                        ? darkMode ? 'bg-[#182238] border-emerald-500 text-white shadow-md' : 'bg-emerald-50 border-emerald-500 text-slate-900 shadow-sm' 
                        : darkMode ? 'bg-[#131B2E]/50 border-white/5 text-slate-400 hover:border-white/15 hover:text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-bold text-sm ${isActive ? 'text-emerald-500' : darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{persona.title}</span>
                      {isActive && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                    </div>
                    <p className={`text-[11px] mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{persona.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className={`border rounded-2xl p-5 shadow-xl space-y-4 transition-colors duration-300 ${darkMode ? 'bg-[#111827] border-white/10' : 'bg-white border-slate-200'}`}>
            <div className="flex justify-between items-center">
              <label className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                <IndianRupee className="w-4 h-4 text-emerald-500" /> Max Budget Filter
              </label>
              <span className="text-sm font-mono font-extrabold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                ₹{maxBudget.toLocaleString('en-IN')}
              </span>
            </div>
            <input 
              type="range" min={30000} max={150000} step={5000}
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-200 dark:bg-slate-800 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className={`border rounded-2xl p-5 shadow-xl space-y-4 transition-colors duration-300 ${darkMode ? 'bg-[#111827] border-white/10' : 'bg-white border-slate-200'}`}>
            <h2 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              <Sliders className="w-4 h-4 text-emerald-500" /> WLC Attribute Weights
            </h2>
            <div className="space-y-3.5">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className={`flex items-center gap-1.5 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}><Cpu className="w-3.5 h-3.5 text-blue-500" /> Performance</span>
                  <span className="font-mono text-emerald-500">{Math.round(weights.performance * 100)}%</span>
                </div>
                <input type="range" min={0} max={1} step={0.05} value={weights.performance} onChange={(e) => setWeights({ ...weights, performance: parseFloat(e.target.value) })} className="w-full accent-blue-500 bg-slate-200 dark:bg-slate-800 h-1.5 rounded-lg" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className={`flex items-center gap-1.5 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}><Camera className="w-3.5 h-3.5 text-emerald-500" /> Camera</span>
                  <span className="font-mono text-emerald-500">{Math.round(weights.camera * 100)}%</span>
                </div>
                <input type="range" min={0} max={1} step={0.05} value={weights.camera} onChange={(e) => setWeights({ ...weights, camera: parseFloat(e.target.value) })} className="w-full accent-emerald-500 bg-slate-200 dark:bg-slate-800 h-1.5 rounded-lg" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className={`flex items-center gap-1.5 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}><Battery className="w-3.5 h-3.5 text-purple-500" /> Battery</span>
                  <span className="font-mono text-emerald-500">{Math.round(weights.battery * 100)}%</span>
                </div>
                <input type="range" min={0} max={1} step={0.05} value={weights.battery} onChange={(e) => setWeights({ ...weights, battery: parseFloat(e.target.value) })} className="w-full accent-purple-500 bg-slate-200 dark:bg-slate-800 h-1.5 rounded-lg" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className={`flex items-center gap-1.5 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}><Monitor className="w-3.5 h-3.5 text-amber-500" /> Display</span>
                  <span className="font-mono text-emerald-500">{Math.round(weights.display * 100)}%</span>
                </div>
                <input type="range" min={0} max={1} step={0.05} value={weights.display} onChange={(e) => setWeights({ ...weights, display: parseFloat(e.target.value) })} className="w-full accent-amber-500 bg-slate-200 dark:bg-slate-800 h-1.5 rounded-lg" />
              </div>
            </div>
          </div>
        </aside>

        {/* Right Main Content */}
        <main className="lg:col-span-8 space-y-5">
          <div className={`p-3 rounded-2xl border shadow-sm overflow-x-auto flex items-center justify-between gap-2 transition-colors duration-300 ${darkMode ? 'bg-[#111827] border-white/10' : 'bg-white border-slate-200'}`}>
            <span className={`text-xs font-semibold px-2 flex items-center gap-1.5 whitespace-nowrap ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              <Tag className="w-3.5 h-3.5 text-emerald-500" /> Brand Filter:
            </span>
            <div className="flex items-center gap-1.5">
              {brands.map(brand => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    selectedBrand === brand
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : darkMode ? 'bg-[#131B2E] text-slate-400 border border-white/5 hover:text-slate-200' : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h2 className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              <Award className="w-4 h-4 text-emerald-500" /> Ranked Recommendations
            </h2>
            <span className={`text-xs font-mono ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Found <strong className="text-emerald-500">{recommendations.length}</strong> devices
            </span>
          </div>

          {recommendations.length === 0 ? (
            <div className={`p-12 text-center rounded-2xl border space-y-3 ${darkMode ? 'bg-[#111827] border-white/10' : 'bg-white border-slate-200'}`}>
              <Info className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className={`text-base font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>No smartphones match your filters.</h3>
            </div>
          ) : (
            <div className="space-y-4">
              {recommendations.map((phone, idx) => {
                const isCompared = comparedPhones.some(p => p.id === phone.id);
                return (
                  <div 
                    key={phone.id} 
                    className={`rounded-2xl border transition-all duration-300 overflow-hidden relative group ${
                      idx === 0 
                        ? darkMode ? 'border-emerald-500/60 shadow-xl bg-gradient-to-r from-[#111827] via-[#111827] to-[#151F33]' : 'border-emerald-500 shadow-lg bg-gradient-to-r from-white via-white to-emerald-50/30' 
                        : darkMode ? 'bg-[#111827] border-white/10' : 'bg-white border-slate-200'
                    }`}
                  >
                    {idx === 0 && (
                      <div className="bg-emerald-500 text-slate-950 text-[10px] font-extrabold px-3 py-1 flex items-center justify-between uppercase tracking-wider">
                        <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> #1 Algorithmic Match</span>
                      </div>
                    )}

                    <div className="p-5 flex flex-col sm:flex-row gap-5 items-start">
                      <div className={`relative w-full sm:w-36 h-36 rounded-xl overflow-hidden shrink-0 border flex items-center justify-center p-2 ${darkMode ? 'bg-[#0D1322] border-white/10' : 'bg-slate-100 border-slate-200'}`}>
                        <img src={phone.image} alt={phone.name} className="w-full h-full object-cover rounded-lg" />
                        <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-md border backdrop-blur-md ${darkMode ? 'bg-[#090D16]/80 text-emerald-400 border-white/10' : 'bg-white/90 text-emerald-600 border-slate-200'}`}>
                          {phone.badge}
                        </span>
                      </div>

                      <div className="flex-1 space-y-2.5 w-full">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">{phone.brand}</span>
                            <span className="text-slate-400">•</span>
                            <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                              <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {phone.rating}
                            </div>
                          </div>
                          <h3 className={`text-base sm:text-lg font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{phone.name}</h3>
                        </div>

                        <div className={`grid grid-cols-2 gap-2 text-[11px] p-2.5 rounded-xl border ${darkMode ? 'bg-[#0D1322]/80 border-white/5 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                          <div><span className="text-slate-400">Processor:</span> {phone.specs.processor}</div>
                          <div><span className="text-slate-400">Camera:</span> {phone.specs.mainCam}</div>
                          <div><span className="text-slate-400">Display:</span> {phone.specs.display}</div>
                          <div><span className="text-slate-400">Battery:</span> {phone.specs.battery}</div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                          <div className="flex items-baseline gap-2">
                            <span className={`text-lg sm:text-xl font-extrabold font-mono ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                              ₹{phone.price.toLocaleString('en-IN')}
                            </span>
                            <span className="text-xs text-slate-400 line-through font-mono">
                              ₹{phone.originalPrice.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                              {phone.discount}
                            </span>
                          </div>

                          <button
                            onClick={() => toggleCompare(phone)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                              isCompared 
                                ? 'bg-emerald-500 text-slate-950 shadow-md' 
                                : darkMode ? 'bg-[#151F33] hover:bg-[#1A253D] text-slate-300 border border-white/10' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                            }`}
                          >
                            <Scale className="w-3.5 h-3.5" /> {isCompared ? 'Compared' : 'Compare'}
                          </button>
                        </div>
                      </div>

                      <div className={`shrink-0 flex flex-col items-center justify-center p-3.5 rounded-2xl border min-w-[85px] ${darkMode ? 'bg-[#0D1322] border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="text-2xl font-black font-mono text-emerald-500">{phone.score}</div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">WLC Match</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {showCompareModal && comparedPhones.length > 0 && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className={`border w-full max-w-3xl rounded-2xl p-6 shadow-2xl relative space-y-5 ${darkMode ? 'bg-[#111827] border-white/10 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`}>
            <div className="flex justify-between items-center border-b pb-4 border-slate-200 dark:border-white/10">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Scale className="w-4 h-4 text-emerald-500" /> Side-by-Side Spec Comparison
              </h3>
              <button onClick={() => setShowCompareModal(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {comparedPhones.map(phone => (
                <div key={phone.id} className={`p-4 rounded-xl border space-y-3 ${darkMode ? 'bg-[#0D1322] border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                  <img src={phone.image} alt={phone.name} className="w-full h-32 object-cover rounded-lg" />
                  <div>
                    <h4 className="font-bold text-sm">{phone.name}</h4>
                    <p className="text-emerald-500 font-mono font-bold text-xs mt-0.5">₹{phone.price.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="space-y-1.5 text-xs border-t pt-2 border-slate-200 dark:border-white/10">
                    <p><strong>Processor:</strong> {phone.specs.processor}</p>
                    <p><strong>Camera:</strong> {phone.specs.mainCam}</p>
                    <p><strong>Display:</strong> {phone.specs.display}</p>
                    <p><strong>Battery:</strong> {phone.specs.battery}</p>
                    <p><strong>Weight:</strong> {phone.weight}</p>
                    <p className="text-emerald-500 font-mono font-bold pt-1"><strong>WLC Score:</strong> {phone.score}/100</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-right">
              <button 
                onClick={() => setShowCompareModal(false)} 
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}