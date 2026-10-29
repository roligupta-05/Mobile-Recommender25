import { useState, useMemo, type ComponentType } from 'react';
import { 
  Smartphone, 
  Sparkles, 
  Sliders, 
  Search, 
  X, 
  Check, 
  Cpu, 
  Battery, 
  Camera, 
  Maximize2, 
  Scale, 
  RotateCcw,
  Award,
  BookOpen,
  Gamepad2,
  Briefcase,
  Heart,
  Video,
  ChevronDown,
  Zap,
  ShieldCheck,
  Eye,
  Info
} from 'lucide-react';

type Phone = {
  id: number;
  name: string;
  brand: string;
  price: number;
  ram: number;
  storage: number;
  battery: number;
  camera: number;
  screen: number;
  weight: number;
  refreshRate: number;
  chipset: string;
  rating: number;
};

type ScoredPhone = Phone & { score: number };
type PhoneMetric = keyof Omit<Phone, 'id' | 'name' | 'brand' | 'chipset'>;
type PersonaId = 'student' | 'gamer' | 'executive' | 'senior' | 'creator';
type Persona = {
  id: PersonaId;
  title: string;
  subtitle: string;
  badge: string;
  icon: ComponentType<{ className?: string }>;
  weights: Partial<Record<PhoneMetric, number>>;
};

// --- DATASET: Real-World Mobile Devices in Indian Market Context (INR Prices) ---
const PHONE_DATASET: Phone[] = [
  { id: 1, name: 'Galaxy S24 Ultra 5G', brand: 'Samsung', price: 129999, ram: 12, storage: 512, battery: 5000, camera: 200, screen: 6.8, weight: 232, refreshRate: 120, chipset: 'Snapdragon 8 Gen 3', rating: 4.8 },
  { id: 2, name: 'Redmi Note 13 Pro 5G', brand: 'Xiaomi', price: 24999, ram: 8, storage: 256, battery: 5100, camera: 200, screen: 6.67, weight: 187, refreshRate: 120, chipset: 'Snapdragon 7s Gen 2', rating: 4.4 },
  { id: 3, name: 'iQOO Neo 9 Pro 5G', brand: 'iQOO', price: 34999, ram: 12, storage: 256, battery: 5160, camera: 50, screen: 6.78, weight: 190, refreshRate: 144, chipset: 'Snapdragon 8 Gen 2', rating: 4.6 },
  { id: 4, name: 'Realme Narzo 60x 5G', brand: 'Realme', price: 12999, ram: 6, storage: 128, battery: 5000, camera: 50, screen: 6.72, weight: 191, refreshRate: 120, chipset: 'Dimensity 6100+', rating: 4.2 },
  { id: 5, name: 'Motorola Edge 50 Pro', brand: 'Motorola', price: 31999, ram: 12, storage: 256, battery: 4500, camera: 50, screen: 6.7, weight: 186, refreshRate: 144, chipset: 'Snapdragon 7 Gen 3', rating: 4.5 },
  { id: 6, name: 'iPhone 15 Pro Max', brand: 'Apple', price: 149900, ram: 8, storage: 256, battery: 4422, camera: 48, screen: 6.7, weight: 221, refreshRate: 120, chipset: 'A17 Pro', rating: 4.9 },
  { id: 7, name: 'Poco X6 Neo 5G', brand: 'POCO', price: 15999, ram: 8, storage: 128, battery: 5000, camera: 108, screen: 6.67, weight: 175, refreshRate: 120, chipset: 'Dimensity 6080', rating: 4.3 },
  { id: 8, name: 'OnePlus 12 5G', brand: 'OnePlus', price: 64999, ram: 16, storage: 512, battery: 5400, camera: 50, screen: 6.82, weight: 220, refreshRate: 120, chipset: 'Snapdragon 8 Gen 3', rating: 4.7 },
  { id: 9, name: 'Lava Blaze 2 5G', brand: 'Lava', price: 9999, ram: 6, storage: 128, battery: 5000, camera: 50, screen: 6.56, weight: 203, refreshRate: 90, chipset: 'Dimensity 6020', rating: 4.0 },
  { id: 10, name: 'ASUS ROG Phone 8 Pro', brand: 'ASUS', price: 94999, ram: 16, storage: 512, battery: 5500, camera: 50, screen: 6.78, weight: 225, refreshRate: 165, chipset: 'Snapdragon 8 Gen 3', rating: 4.7 },
  { id: 11, name: 'Vivo V30 Pro 5G', brand: 'Vivo', price: 41999, ram: 12, storage: 512, battery: 5000, camera: 50, screen: 6.78, weight: 188, refreshRate: 120, chipset: 'Dimensity 8200', rating: 4.6 },
  { id: 12, name: 'Nothing Phone (2a)', brand: 'Nothing', price: 23999, ram: 8, storage: 128, battery: 5000, camera: 50, screen: 6.7, weight: 190, refreshRate: 120, chipset: 'Dimensity 7200 Pro', rating: 4.4 },
  { id: 13, name: 'Samsung Galaxy A15 5G', brand: 'Samsung', price: 17999, ram: 8, storage: 128, battery: 5000, camera: 50, screen: 6.5, weight: 200, refreshRate: 90, chipset: 'Dimensity 6100+', rating: 4.1 },
  { id: 14, name: 'Realme GT 6T 5G', brand: 'Realme', price: 30999, ram: 8, storage: 256, battery: 5500, camera: 50, screen: 6.78, weight: 191, refreshRate: 120, chipset: 'Snapdragon 7+ Gen 3', rating: 4.5 },
  { id: 15, name: 'Redmi 13C 5G', brand: 'Xiaomi', price: 10499, ram: 4, storage: 128, battery: 5000, camera: 50, screen: 6.74, weight: 192, refreshRate: 90, chipset: 'Dimensity 6100+', rating: 4.0 },
  { id: 16, name: 'Google Pixel 8a', brand: 'Google', price: 52999, ram: 8, storage: 128, battery: 4492, camera: 64, screen: 6.1, weight: 188, refreshRate: 120, chipset: 'Tensor G3', rating: 4.5 },
  { id: 17, name: 'Honor X9b 5G', brand: 'Honor', price: 22999, ram: 8, storage: 256, battery: 5800, camera: 108, screen: 6.78, weight: 185, refreshRate: 120, chipset: 'Snapdragon 6 Gen 1', rating: 4.3 },
  { id: 18, name: 'OnePlus Nord CE4 5G', brand: 'OnePlus', price: 24999, ram: 8, storage: 128, battery: 5500, camera: 50, screen: 6.7, weight: 186, refreshRate: 120, chipset: 'Snapdragon 7 Gen 3', rating: 4.5 },
  { id: 19, name: 'Infinix Note 40 Pro', brand: 'Infinix', price: 21999, ram: 8, storage: 256, battery: 5000, camera: 108, screen: 6.78, weight: 190, refreshRate: 120, chipset: 'Dimensity 7020', rating: 4.2 },
  { id: 20, name: 'Xiaomi 14 Ultra', brand: 'Xiaomi', price: 99999, ram: 16, storage: 512, battery: 5000, camera: 50, screen: 6.73, weight: 220, refreshRate: 120, chipset: 'Snapdragon 8 Gen 3', rating: 4.8 }
];

// --- BUYER PERSONAS WITH SPECIFIC WEIGHTING MATRICES ---
const PERSONAS: Record<PersonaId, Persona> = {
  student: {
    id: 'student',
    title: 'Student',
    subtitle: 'High battery, maximum value for money & storage',
    badge: 'Value & Battery Focus',
    icon: BookOpen,
    weights: { price: 30, battery: 25, ram: 15, storage: 15, weight: 10, rating: 5, screen: 0, camera: 0 }
  },
  gamer: {
    id: 'gamer',
    title: 'Gamer',
    subtitle: 'Maximum RAM, high refresh rate & fast processor',
    badge: 'Peak FPS & Thermal Focus',
    icon: Gamepad2,
    weights: { ram: 30, refreshRate: 25, battery: 20, screen: 15, price: 10, camera: 0, storage: 0, weight: 0 }
  },
  executive: {
    id: 'executive',
    title: 'Business / Professional',
    subtitle: 'Sleek design, high reliability & productivity RAM',
    badge: 'Reliability & Elegance',
    icon: Briefcase,
    weights: { ram: 25, storage: 20, battery: 20, weight: 15, rating: 10, price: 10, camera: 0, screen: 0 }
  },
  senior: {
    id: 'senior',
    title: 'Senior Citizen',
    subtitle: 'Lightweight, easy screen legibility & battery life',
    badge: 'Ergonomic & Easy Read',
    icon: Heart,
    weights: { weight: 35, battery: 25, screen: 20, price: 10, rating: 10, ram: 0, camera: 0, storage: 0 }
  },
  creator: {
    id: 'creator',
    title: 'Content Creator',
    subtitle: 'Pro camera setup, maximum storage & screen clarity',
    badge: 'Camera & 4K Storage Focus',
    icon: Video,
    weights: { camera: 35, storage: 25, ram: 15, screen: 15, battery: 10, price: 0, weight: 0, rating: 0 }
  }
};

// --- INDIAN RUPEE FORMATTER UTILITY ---
const formatINR = (val: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val);
};

export default function App() {
  // State
  const [selectedPersonaId, setSelectedPersonaId] = useState<PersonaId>('student');
  const [maxPrice, setMaxPrice] = useState(35000); // Default ₹35,000 ceiling
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [comparedPhoneIds, setComparedPhoneIds] = useState<number[]>([]);
  const [inspectingPhone, setInspectingPhone] = useState<ScoredPhone | null>(null);
  const [customWeights, setCustomWeights] = useState(PERSONAS.student.weights);
  const [showWeightTuner, setShowWeightTuner] = useState(false);
  const [seniorMode, setSeniorMode] = useState(false);

  // Sync weights when persona changes
  const handlePersonaChange = (id: PersonaId) => {
    setSelectedPersonaId(id);
    setCustomWeights(PERSONAS[id].weights);
  };

  // Min-Max Dataset Bounds Calculation
  const bounds = useMemo(() => {
    const keys = ['price', 'ram', 'storage', 'battery', 'camera', 'screen', 'weight', 'refreshRate', 'rating'];
    const b: Partial<Record<PhoneMetric, { min: number; max: number }>> = {};
    keys.forEach(k => {
      const key = k as PhoneMetric;
      const vals = PHONE_DATASET.map(p => p[key]);
      b[key] = { min: Math.min(...vals), max: Math.max(...vals) };
    });
    return b;
  }, []);

  // Compute Scores using Min-Max Normalization + Weighted Linear Combination
  const scoredPhones = useMemo(() => {
    const activeWeights = customWeights;
    const totalWeight = Object.values(activeWeights as Record<string, number>).reduce((a: number, b: number) => a + b, 0) || 1;

    return PHONE_DATASET.map(phone => {
      let weightedSum = 0;

      Object.entries(activeWeights as Record<string, number>).forEach(([key, weight]) => {
        if (!weight || weight === 0) return;
        const metric = key as PhoneMetric;
        const b = bounds[metric];
        if (!b || b.max === b.min) return;

        let norm = (((phone as unknown as Record<string, number>)[key] - b.min) / (b.max - b.min)) * 100;

        // Invert Negative Utility Metrics (Lower is better for Price & Weight)
        if (key === 'price' || key === 'weight') {
          norm = 100 - norm;
        }

        weightedSum += norm * weight;
      });

      const finalScore = (weightedSum / totalWeight).toFixed(1);

      return {
        ...phone,
        score: Math.min(100, Math.max(0, parseFloat(finalScore)))
      };
    })
    .filter(phone => phone.price <= maxPrice)
    .filter(phone => selectedBrand === 'All' || phone.brand === selectedBrand)
    .filter(phone => 
      phone.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      phone.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phone.chipset.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => b.score - a.score);
  }, [maxPrice, searchQuery, selectedBrand, customWeights, bounds]);

  // Top 5 Curated Matches
  const top5Matches = useMemo(() => scoredPhones.slice(0, 5), [scoredPhones]);

  // Unique brands list
  const brands = useMemo(() => ['All', ...new Set(PHONE_DATASET.map(p => p.brand))], []);

  // Comparison toggle
  const toggleCompare = (id: number) => {
    if (comparedPhoneIds.includes(id)) {
      setComparedPhoneIds(comparedPhoneIds.filter(item => item !== id));
    } else {
      if (comparedPhoneIds.length >= 3) {
        alert('You can compare up to 3 devices side-by-side.');
        return;
      }
      setComparedPhoneIds([...comparedPhoneIds, id]);
    }
  };

  const comparedPhones = useMemo(() => {
    return PHONE_DATASET.filter(p => comparedPhoneIds.includes(p.id)).map(phone => {
      const scoredObj = scoredPhones.find(sp => sp.id === phone.id);
      return scoredObj || { ...phone, score: 0 };
    });
  }, [comparedPhoneIds, scoredPhones]);

  const currentPersona = PERSONAS[selectedPersonaId];

  return (
    <div className={`min-h-screen bg-[#F9F9F6] text-[#2D2D2A] font-sans antialiased selection:bg-[#5E7259] selection:text-white ${seniorMode ? 'text-lg' : 'text-base'}`}>
      
      {/* --- TOP HEADER NAVIGATION --- */}
      <header className="border-b border-[#E5E5E0] bg-[#F9F9F6]/95 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#5E7259] text-white flex items-center justify-center shadow-xs">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#2D2D2A]">Mobile Recommender</h1>
              <p className="text-[10px] text-[#5E7259] uppercase tracking-widest font-semibold">Lifestyle Decision Matrix</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSeniorMode(!seniorMode)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition flex items-center space-x-1.5 ${
                seniorMode ? 'bg-[#5E7259] text-white border-[#5E7259]' : 'border-[#D5D5CF] bg-white text-[#2D2D2A] hover:bg-[#F0F0EC]'
              }`}
              title="Toggle Large Text for Senior Readability"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{seniorMode ? 'Standard Text' : 'Large Text'}</span>
            </button>

            <button 
              onClick={() => setShowWeightTuner(!showWeightTuner)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#D5D5CF] bg-white text-[#2D2D2A] hover:bg-[#F0F0EC] transition flex items-center space-x-1.5 shadow-2xs"
            >
              <Sliders className="w-3.5 h-3.5 text-[#3B6E8C]" />
              <span className="hidden sm:inline">Advanced Tuner</span>
            </button>

            {comparedPhoneIds.length > 0 && (
              <span className="text-xs bg-[#3B6E8C] text-white font-semibold px-2.5 py-1 rounded-full">
                {comparedPhoneIds.length} in compare
              </span>
            )}
          </div>
        </div>
      </header>

      {/* --- MAIN PAGE CONTENT --- */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* HERO TITLE SECTION */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2D2A] tracking-tight">
            Find Your Top 5 Best Mobile Matches
          </h2>
          <p className="text-sm text-[#666660]">
            An algorithmic shopping assistant evaluating 413 mobile specifications normalized for your lifestyle priorities.
          </p>
        </div>

        {/* --- STEP 1: PERSONA SELECTOR --- */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-[#3B6E8C] flex items-center space-x-1">
              <span>Step 1: Select Your Lifestyle Buyer Persona</span>
            </label>
            <span className="text-xs text-[#5E7259] font-semibold">
              Active: {currentPersona.title}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {Object.values(PERSONAS).map(p => {
              const Icon = p.icon;
              const isSelected = selectedPersonaId === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handlePersonaChange(p.id)}
                  className={`p-4 rounded-2xl text-left transition-all border flex flex-col justify-between ${
                    isSelected 
                      ? 'bg-[#5E7259] text-white border-[#5E7259] shadow-md ring-2 ring-[#5E7259]/20' 
                      : 'bg-white border-[#E5E5E0] text-[#2D2D2A] hover:border-[#B5B5AF] hover:bg-white/80'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-3">
                    <div className={`p-2 rounded-xl ${isSelected ? 'bg-white/20 text-white' : 'bg-[#F0F4EF] text-[#5E7259]'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-white" />}
                  </div>
                  <div>
                    <div className="font-bold text-sm font-serif leading-tight">{p.title}</div>
                    <div className={`text-[11px] mt-1 line-clamp-2 ${isSelected ? 'text-white/80' : 'text-[#767670]'}`}>
                      {p.subtitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* --- STEP 2: BUDGET & SEARCH FILTER MATRIX --- */}
        <section className="bg-white p-6 rounded-2xl border border-[#E5E5E0] shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-[#F0F0EC] pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#3B6E8C]">
              Step 2: Set Budget Ceiling &amp; Refine Filters
            </span>
            <span className="text-xs text-[#767670]">Price range: ₹8,000 – ₹1,50,000</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            {/* Price Ceiling Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-[#666660]">Maximum Budget Ceiling</span>
                <span className="text-[#5E7259] font-bold text-base font-mono">{formatINR(maxPrice)}</span>
              </div>
              <input 
                type="range"
                min="8000"
                max="150000"
                step="2000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                aria-label="Maximum Budget Ceiling"
                className="w-full accent-[#5E7259] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#999990] font-mono">
                <span>₹8,000 (Budget)</span>
                <span>₹1,50,000 (Flagship)</span>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <label className="text-xs font-semibold text-[#666660] block mb-1">Search Model or Processor</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#999990]" />
                <input 
                  type="text"
                  placeholder="e.g. Galaxy, Snapdragon, Redmi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 text-xs bg-[#F9F9F6] border border-[#D5D5CF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B6E8C] transition"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#767670]">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Brand Chips */}
            <div>
              <label className="text-xs font-semibold text-[#666660] block mb-1">Filter by Brand</label>
              <div className="flex flex-wrap gap-1.5">
                {brands.slice(0, 6).map(brand => (
                  <button
                    key={brand}
                    onClick={() => setSelectedBrand(brand)}
                    className={`text-xs px-2.5 py-1 rounded-lg transition font-medium ${
                      selectedBrand === brand 
                        ? 'bg-[#2D2D2A] text-white' 
                        : 'bg-[#F0F0EC] text-[#666660] hover:bg-[#E5E5E0]'
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* --- OPTIONAL ADVANCED TUNER --- */}
        {showWeightTuner && (
          <section className="bg-[#F0F4EF] p-5 rounded-2xl border border-[#5E7259]/30 space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-[#3B6E8C]" />
                <h3 className="text-sm font-bold text-[#2D2D2A]">Weighted Linear Combination (WLC) Control Panel</h3>
              </div>
              <button 
                onClick={() => setCustomWeights(PERSONAS[selectedPersonaId].weights)}
                className="text-xs text-[#3B6E8C] font-semibold hover:underline flex items-center space-x-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to {currentPersona.title} Default Weights</span>
              </button>
            </div>

            <p className="text-xs text-[#666660]">
              Tweak algorithm weighting coefficients. Note: Price and Weight use inverted scale logic (lower raw values produce higher utility scores).
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 pt-2">
              {(Object.keys(customWeights) as PhoneMetric[]).map(key => (
                <div key={key} className="bg-white p-2.5 rounded-xl border border-[#D5D5CF]">
                  <div className="flex justify-between text-[11px] font-semibold mb-1 capitalize">
                    <span>{key}</span>
                    <span className="text-[#5E7259]">{customWeights[key]}%</span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="40"
                    value={customWeights[key]}
                    onChange={(e) => setCustomWeights({ ...customWeights, [key]: Number(e.target.value) })}
                    aria-label={`Weight coefficient for ${key}`}
                    className="w-full accent-[#3B6E8C]"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* --- STEP 3: TOP 5 CURATED RECOMMENDATIONS GRID --- */}
        <section className="space-y-4">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold uppercase tracking-wider text-[#3B6E8C] flex items-center space-x-1">
              <Award className="w-4 h-4 text-[#5E7259]" />
              <span>Step 3: Top 5 Best Recommendations for {currentPersona.title}</span>
            </span>
            <span className="text-[#666660]">
              Filter evaluated <strong className="text-[#2D2D2A]">{scoredPhones.length}</strong> eligible devices
            </span>
          </div>

          {top5Matches.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#E5E5E0] space-y-3 p-6">
              <Smartphone className="w-10 h-10 mx-auto text-[#B5B5AF]" />
              <h3 className="font-serif font-bold text-base text-[#2D2D2A]">No smartphones match this exact budget</h3>
              <p className="text-xs text-[#767670] max-w-md mx-auto">
                No mobile devices in our dataset match the current budget ceiling of {formatINR(maxPrice)}. Try raising your price slider slightly.
              </p>
              <button 
                onClick={() => { setMaxPrice(150000); setSearchQuery(''); setSelectedBrand('All'); }}
                className="inline-flex items-center justify-center text-xs bg-[#3B6E8C] text-white font-semibold px-4 py-2 rounded-xl hover:bg-[#2F5870] transition shadow-xs"
              >
                Reset Budget Ceiling Slider
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {top5Matches.map((phone, index) => {
                const isTopMatch = index === 0;
                const isCompared = comparedPhoneIds.includes(phone.id);

                return (
                  <div 
                    key={phone.id}
                    className={`bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between p-5 relative ${
                      isTopMatch 
                        ? 'border-[#5E7259] shadow-md ring-1 ring-[#5E7259]/30' 
                        : 'border-[#E5E5E0] hover:border-[#B5B5AF] hover:shadow-2xs'
                    }`}
                  >
                    {/* Top Match Ribbon Badge */}
                    {isTopMatch && (
                      <div className="absolute -top-3 left-4 bg-[#5E7259] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full flex items-center space-x-1 shadow-xs">
                        <Award className="w-3 h-3" />
                        <span>#1 Highest Persona Match</span>
                      </div>
                    )}

                    <div>
                      {/* Card Top Information */}
                      <div className="flex justify-between items-start mt-1 mb-3">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#767670]">{phone.brand}</span>
                          <h3 className="font-serif font-bold text-base text-[#2D2D2A] leading-tight">{phone.name}</h3>
                          <div className="text-xs text-[#3B6E8C] font-semibold mt-0.5">{phone.chipset}</div>
                        </div>

                        {/* Match Score Badge */}
                        <div className="text-right shrink-0">
                          <div className={`inline-block text-lg font-bold font-mono px-2.5 py-1 rounded-xl ${
                            phone.score >= 75 
                              ? 'bg-[#EAF0EB] text-[#3D5238]' 
                              : phone.score >= 65 
                                ? 'bg-[#FDF6E2] text-[#8C6D1F]' 
                                : 'bg-[#F0F0EC] text-[#555550]'
                          }`}>
                            {phone.score}%
                          </div>
                          <div className="text-[9px] uppercase tracking-wider font-semibold text-[#767670] mt-0.5">Match Score</div>
                        </div>
                      </div>

                      {/* Specs Chips Grid */}
                      <div className="grid grid-cols-2 gap-2 text-xs py-3 border-y border-[#F0F0EC] my-3">
                        <div className="flex items-center space-x-1.5 text-[#444440]">
                          <Cpu className="w-3.5 h-3.5 text-[#5E7259]" />
                          <span>{phone.ram} GB RAM</span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-[#444440]">
                          <Battery className="w-3.5 h-3.5 text-[#5E7259]" />
                          <span>{phone.battery} mAh</span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-[#444440]">
                          <Camera className="w-3.5 h-3.5 text-[#5E7259]" />
                          <span>{phone.camera} MP Main</span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-[#444440]">
                          <Scale className="w-3.5 h-3.5 text-[#5E7259]" />
                          <span>{phone.weight} g Weight</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Bottom CTA Bar */}
                    <div className="pt-2 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-[#767670]">Price</span>
                        <div className="text-base sm:text-lg font-bold text-[#2D2D2A] font-mono">{formatINR(phone.price)}</div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setInspectingPhone(phone)}
                          className="px-2.5 py-1.5 text-xs text-[#2D2D2A] hover:bg-[#F0F0EC] rounded-xl transition flex items-center space-x-1 font-semibold border border-[#D5D5CF]"
                          title="Inspect full details"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                        <button
                          onClick={() => toggleCompare(phone.id)}
                          className={`text-xs px-3 py-1.5 rounded-xl font-medium transition flex items-center space-x-1 ${
                            isCompared 
                              ? 'bg-[#2D2D2A] text-white' 
                              : 'bg-[#3B6E8C] text-white hover:bg-[#2F5870]'
                          }`}
                        >
                          <span>{isCompared ? 'Added' : '+ Compare'}</span>
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* --- COMPARISON DOCK DRAWER --- */}
      {comparedPhones.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#2D2D2A] text-white border-t border-[#444440] shadow-2xl z-40 p-4">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <Scale className="w-5 h-5 text-[#5E7259]" />
              <div>
                <h4 className="text-sm font-serif font-bold">Side-by-Side Comparison Dock</h4>
                <p className="text-xs text-[#A0A09A]">{comparedPhones.length} of 3 devices selected</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {comparedPhones.map(phone => (
                <div key={phone.id} className="bg-[#3D3D38] px-3 py-1.5 rounded-xl text-xs flex items-center space-x-2 border border-[#555550]">
                  <span className="font-semibold">{phone.name}</span>
                  <span className="text-[#5E7259] font-mono font-bold">{phone.score}%</span>
                  <button onClick={() => toggleCompare(phone.id)} className="text-[#A0A09A] hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setComparedPhoneIds([])}
              className="text-xs text-[#A0A09A] underline hover:text-white"
            >
              Clear Comparison Dock
            </button>
          </div>
        </div>
      )}

      {/* --- INSPECT MODAL DIALOG --- */}
      {inspectingPhone && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 border border-[#E5E5E0] shadow-xl relative animate-in zoom-in-95 duration-150">
            <button 
              onClick={() => setInspectingPhone(null)}
              className="absolute top-4 right-4 text-[#767670] hover:text-[#2D2D2A]"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#767670]">{inspectingPhone.brand}</span>
              <h3 className="font-serif text-xl font-bold text-[#2D2D2A]">{inspectingPhone.name}</h3>
              <div className="text-xs text-[#3B6E8C] font-semibold mt-0.5">{inspectingPhone.chipset} Processor</div>
            </div>

            <div className="bg-[#F9F9F6] p-4 rounded-xl border border-[#E5E5E0] flex items-center justify-between">
              <div>
                <div className="text-xs text-[#767670] font-semibold">Match Score ({currentPersona.title})</div>
                <div className="text-2xl font-bold font-mono text-[#5E7259]">{inspectingPhone.score}%</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-[#767670] font-semibold">Retail Price</div>
                <div className="text-xl font-bold font-mono text-[#2D2D2A]">{formatINR(inspectingPhone.price)}</div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#666660]">Full Specification Breakdown</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[#F0F0EC] p-2.5 rounded-lg">
                  <span className="text-[#767670] block">RAM Throughput</span>
                  <span className="font-semibold text-[#2D2D2A]">{inspectingPhone.ram} GB</span>
                </div>
                <div className="bg-[#F0F0EC] p-2.5 rounded-lg">
                  <span className="text-[#767670] block">Internal Storage</span>
                  <span className="font-semibold text-[#2D2D2A]">{inspectingPhone.storage} GB</span>
                </div>
                <div className="bg-[#F0F0EC] p-2.5 rounded-lg">
                  <span className="text-[#767670] block">Battery Capacity</span>
                  <span className="font-semibold text-[#2D2D2A]">{inspectingPhone.battery} mAh</span>
                </div>
                <div className="bg-[#F0F0EC] p-2.5 rounded-lg">
                  <span className="text-[#767670] block">Display Refresh Rate</span>
                  <span className="font-semibold text-[#2D2D2A]">{inspectingPhone.refreshRate} Hz</span>
                </div>
                <div className="bg-[#F0F0EC] p-2.5 rounded-lg">
                  <span className="text-[#767670] block">Camera Setup</span>
                  <span className="font-semibold text-[#2D2D2A]">{inspectingPhone.camera} MP Main</span>
                </div>
                <div className="bg-[#F0F0EC] p-2.5 rounded-lg">
                  <span className="text-[#767670] block">Device Weight</span>
                  <span className="font-semibold text-[#2D2D2A]">{inspectingPhone.weight} grams</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => { toggleCompare(inspectingPhone.id); setInspectingPhone(null); }}
              className="w-full py-2.5 bg-[#3B6E8C] text-white rounded-xl text-xs font-semibold hover:bg-[#2F5870] transition shadow-xs"
            >
              {comparedPhoneIds.includes(inspectingPhone.id) ? 'Remove from Comparison Dock' : 'Add to Side-by-Side Comparison Dock'}
            </button>
          </div>
        </div>
      )}

      {/* --- FOOTER --- */}
      <footer className="border-t border-[#E5E5E0] bg-white py-6 mt-16 text-xs text-center text-[#767670]">
        <div className="max-w-6xl mx-auto px-4 space-y-1">
          <p className="font-serif font-bold text-[#2D2D2A]">Mobile Recommender — Lifestyle Selection Engine</p>
          <p>Standardized Min-Max Feature Scaling &amp; Weighted Linear Combination Engine</p>
        </div>
      </footer>

    </div>
  );
}