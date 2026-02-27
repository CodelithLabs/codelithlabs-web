'use client';
import { useState } from 'react';
import { Globe, Search } from 'lucide-react';

const COUNTRIES: Record<string, { name: string; capital: string; population: string; area: string; currency: string; languages: string; region: string; callingCode: string; tld: string; flag: string; driveSide: string }> = {
  IN: { name: 'India', capital: 'New Delhi', population: '1,428,627,663', area: '3,287,263 km²', currency: 'Indian Rupee (INR)', languages: 'Hindi, English +21', region: 'South Asia', callingCode: '+91', tld: '.in', flag: '🇮🇳', driveSide: 'Left' },
  US: { name: 'United States', capital: 'Washington D.C.', population: '339,996,563', area: '9,833,520 km²', currency: 'US Dollar (USD)', languages: 'English', region: 'North America', callingCode: '+1', tld: '.us', flag: '🇺🇸', driveSide: 'Right' },
  GB: { name: 'United Kingdom', capital: 'London', population: '67,736,802', area: '242,495 km²', currency: 'Pound Sterling (GBP)', languages: 'English', region: 'Northern Europe', callingCode: '+44', tld: '.uk', flag: '🇬🇧', driveSide: 'Left' },
  JP: { name: 'Japan', capital: 'Tokyo', population: '123,294,513', area: '377,975 km²', currency: 'Japanese Yen (JPY)', languages: 'Japanese', region: 'East Asia', callingCode: '+81', tld: '.jp', flag: '🇯🇵', driveSide: 'Left' },
  DE: { name: 'Germany', capital: 'Berlin', population: '84,482,267', area: '357,022 km²', currency: 'Euro (EUR)', languages: 'German', region: 'Western Europe', callingCode: '+49', tld: '.de', flag: '🇩🇪', driveSide: 'Right' },
  AU: { name: 'Australia', capital: 'Canberra', population: '26,439,111', area: '7,692,024 km²', currency: 'Australian Dollar (AUD)', languages: 'English', region: 'Oceania', callingCode: '+61', tld: '.au', flag: '🇦🇺', driveSide: 'Left' },
  BR: { name: 'Brazil', capital: 'Brasília', population: '216,422,446', area: '8,515,767 km²', currency: 'Brazilian Real (BRL)', languages: 'Portuguese', region: 'South America', callingCode: '+55', tld: '.br', flag: '🇧🇷', driveSide: 'Right' },
  CN: { name: 'China', capital: 'Beijing', population: '1,425,671,352', area: '9,596,961 km²', currency: 'Renminbi (CNY)', languages: 'Mandarin Chinese', region: 'East Asia', callingCode: '+86', tld: '.cn', flag: '🇨🇳', driveSide: 'Right' },
  BD: { name: 'Bangladesh', capital: 'Dhaka', population: '172,954,319', area: '147,570 km²', currency: 'Bangladeshi Taka (BDT)', languages: 'Bengali', region: 'South Asia', callingCode: '+880', tld: '.bd', flag: '🇧🇩', driveSide: 'Left' },
  NP: { name: 'Nepal', capital: 'Kathmandu', population: '30,896,590', area: '147,181 km²', currency: 'Nepalese Rupee (NPR)', languages: 'Nepali', region: 'South Asia', callingCode: '+977', tld: '.np', flag: '🇳🇵', driveSide: 'Left' },
  AE: { name: 'UAE', capital: 'Abu Dhabi', population: '9,441,129', area: '83,600 km²', currency: 'UAE Dirham (AED)', languages: 'Arabic', region: 'Western Asia', callingCode: '+971', tld: '.ae', flag: '🇦🇪', driveSide: 'Right' },
  SG: { name: 'Singapore', capital: 'Singapore', population: '5,917,648', area: '710 km²', currency: 'Singapore Dollar (SGD)', languages: 'English, Malay, Chinese, Tamil', region: 'Southeast Asia', callingCode: '+65', tld: '.sg', flag: '🇸🇬', driveSide: 'Left' },
  CA: { name: 'Canada', capital: 'Ottawa', population: '40,097,761', area: '9,984,670 km²', currency: 'Canadian Dollar (CAD)', languages: 'English, French', region: 'North America', callingCode: '+1', tld: '.ca', flag: '🇨🇦', driveSide: 'Right' },
  FR: { name: 'France', capital: 'Paris', population: '64,756,584', area: '551,695 km²', currency: 'Euro (EUR)', languages: 'French', region: 'Western Europe', callingCode: '+33', tld: '.fr', flag: '🇫🇷', driveSide: 'Right' },
};

export default function CountryInfo() {
  const [search, setSearch] = useState('');
  const [selectedCode, setSelectedCode] = useState('IN');

  const filtered = Object.entries(COUNTRIES).filter(([code, c]) =>
    c.name.toLowerCase().includes(search.toLowerCase()) || code.toLowerCase().includes(search.toLowerCase())
  );

  const c = COUNTRIES[selectedCode];

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <Globe className="w-4 h-4 inline mr-2" /><strong>Country Information:</strong> Quick reference for country details including capital, population, currency, and more.
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search country..." className="w-full bg-zinc-800 text-white p-3 pl-10 rounded-lg border border-zinc-700" />
      </div>
      <div className="flex gap-2 flex-wrap">
        {filtered.slice(0, 10).map(([code, c]) => (
          <button key={code} onClick={() => setSelectedCode(code)} className={`px-3 py-1.5 rounded-lg text-sm ${selectedCode === code ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'}`}>{c.flag} {c.name}</button>
        ))}
      </div>
      {c && (
        <div className="space-y-3">
          <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border border-blue-500/30 rounded-lg p-6 text-center">
            <div className="text-5xl mb-2">{c.flag}</div>
            <div className="text-2xl font-bold">{c.name}</div>
            <div className="text-sm text-gray-400">{c.region}</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
            {[
              { label: 'Capital', value: c.capital },
              { label: 'Population', value: c.population },
              { label: 'Area', value: c.area },
              { label: 'Currency', value: c.currency },
              { label: 'Languages', value: c.languages },
              { label: 'Calling Code', value: c.callingCode },
              { label: 'TLD', value: c.tld },
              { label: 'Drive Side', value: c.driveSide },
              { label: 'Country Code', value: selectedCode },
            ].map(r => (
              <div key={r.label} className="flex justify-between px-4 py-2 border-b border-zinc-800/50 text-sm">
                <span className="text-gray-400">{r.label}</span>
                <span className="font-medium text-white">{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
