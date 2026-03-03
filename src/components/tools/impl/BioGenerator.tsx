'use client';

import { memo, useState, useCallback } from 'react';

const templates = {
  professional: [
    '{{name}} is a {{role}} with {{years}}+ years of experience in {{industry}}. Specializing in {{specialty}}, {{pronoun}} has helped {{achievement}}. {{name}} is passionate about {{passion}} and currently {{currentRole}} at {{company}}.',
    'As a seasoned {{role}}, {{name}} brings {{years}} years of expertise in {{industry}}. {{pronoun_cap}} track record includes {{achievement}}, making {{pronoun_obj}} a go-to expert in {{specialty}}.',
    '{{name}} is a {{industry}} professional who {{achievement}}. With deep expertise in {{specialty}}, {{pronoun}} delivers results that matter.',
  ],
  casual: [
    'Hey! I\'m {{name}}, a {{role}} who loves {{passion}}. When I\'m not {{specialty}}, you\'ll find me {{hobby}}. Currently {{currentRole}} at {{company}}.',
    '{{name}} here! 👋 {{role}} by day, {{hobby}} enthusiast by night. {{years}}+ years of making {{specialty}} look easy.',
    'Just your friendly neighborhood {{role}}. I help {{achievement}} and have way too much fun doing it. {{passion}} is my superpower.',
  ],
  linkedin: [
    '{{name}} | {{role}} | {{specialty}} Expert\n\n{{years}}+ years helping companies {{achievement}}. Previously at {{company}}. Passionate about {{passion}}.\n\n💼 {{specialty}}\n📈 {{achievement}}\n🎯 {{passion}}',
    '{{role}} specializing in {{specialty}} | {{years}}+ years in {{industry}} | {{achievement}} | Currently {{currentRole}} at {{company}}',
  ],
  twitter: [
    '{{role}} 💼 | {{specialty}} | {{passion}} | {{achievement}} | Building @{{company}}',
    '{{name}} • {{role}} • {{specialty}} enthusiast • {{passion}}',
    '{{role}} helping {{achievement}} | {{passion}} | DMs open 📬',
  ],
};

function BioGenerator() {
  const [style, setStyle] = useState<keyof typeof templates>('professional');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [years, setYears] = useState('');
  const [industry, setIndustry] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [achievement, setAchievement] = useState('');
  const [passion, setPassion] = useState('');
  const [company, setCompany] = useState('');
  const [currentRole, setCurrentRole] = useState('');
  const [hobby, setHobby] = useState('');
  const [pronoun, setPronoun] = useState<'he' | 'she' | 'they'>('they');
  const [result, setResult] = useState<string[]>([]);

  const getPronounObj = (p: 'he' | 'she' | 'they') => {
    switch (p) {
      case 'he': return 'him';
      case 'she': return 'her';
      default: return 'them';
    }
  };

  const getPronounCap = (p: 'he' | 'she' | 'they') => {
    switch (p) {
      case 'he': return 'His';
      case 'she': return 'Her';
      default: return 'Their';
    }
  };

  const handleGenerate = useCallback(() => {
    const selectedTemplates = templates[style];
    const generated = selectedTemplates.map(template => {
      return template
        .replace(/{{name}}/g, name || 'John Doe')
        .replace(/{{role}}/g, role || 'Professional')
        .replace(/{{years}}/g, years || '5')
        .replace(/{{industry}}/g, industry || 'technology')
        .replace(/{{specialty}}/g, specialty || 'problem-solving')
        .replace(/{{achievement}}/g, achievement || 'drive meaningful results')
        .replace(/{{passion}}/g, passion || 'innovation')
        .replace(/{{company}}/g, company || 'TechCorp')
        .replace(/{{currentRole}}/g, currentRole || 'working as')
        .replace(/{{hobby}}/g, hobby || 'exploring new ideas')
        .replace(/{{pronoun}}/g, pronoun)
        .replace(/{{pronoun_obj}}/g, getPronounObj(pronoun))
        .replace(/{{pronoun_cap}}/g, getPronounCap(pronoun));
    });
    setResult(generated);
  }, [style, name, role, years, industry, specialty, achievement, passion, company, currentRole, hobby, pronoun]);

  return (
    <div className="space-y-6">
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Professional Bio Generator</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Bio Style</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value as keyof typeof templates)}
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="professional">Professional</option>
              <option value="casual">Casual/Friendly</option>
              <option value="linkedin">LinkedIn</option>
              <option value="twitter">Twitter/X</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Jane Smith"
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Role/Title</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g., Software Engineer"
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Years of Experience</label>
              <input
                type="text"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                placeholder="e.g., 8"
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Industry</label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g., fintech"
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Specialty</label>
              <input
                type="text"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                placeholder="e.g., full-stack development"
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Key Achievement</label>
              <input
                type="text"
                value={achievement}
                onChange={(e) => setAchievement(e.target.value)}
                placeholder="e.g., scale products to millions of users"
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Passion</label>
              <input
                type="text"
                value={passion}
                onChange={(e) => setPassion(e.target.value)}
                placeholder="e.g., building user-friendly products"
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Company</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g., Google"
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Pronoun</label>
              <select
                value={pronoun}
                onChange={(e) => setPronoun(e.target.value as 'he' | 'she' | 'they')}
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="he">He/Him</option>
                <option value="she">She/Her</option>
                <option value="they">They/Them</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Hobby (for casual)</label>
              <input
                type="text"
                value={hobby}
                onChange={(e) => setHobby(e.target.value)}
                placeholder="e.g., hiking"
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button
            onClick={handleGenerate}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Generate Bios
          </button>
        </div>
      </div>

      {result.length > 0 && (
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Generated Bios</h3>
          <div className="space-y-4">
            {result.map((bio, idx) => (
              <div
                key={idx}
                className="bg-zinc-900 rounded-lg p-4 border border-zinc-700"
              >
                <p className="text-zinc-300 whitespace-pre-wrap">{bio}</p>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-zinc-700">
                  <span className="text-zinc-500 text-sm">{bio.length} characters</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(bio)}
                    className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 text-white text-sm rounded transition-colors"
                  >
                    Copy
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(BioGenerator);
