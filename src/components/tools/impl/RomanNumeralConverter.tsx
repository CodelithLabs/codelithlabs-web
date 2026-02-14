'use client';
import { useState } from 'react';
export default function RomanNumeralConverter() {
  const [num, setNum] = useState(2024);
  const toRoman = (num: number) => {
    const lookup: Record<string, number> = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1};
    let roman = '', i;
    for ( i in lookup ) { while ( num >= lookup[i] ) { roman += i; num -= lookup[i]; } }
    return roman;
  };
  return (
    <div className="bg-zinc-800 p-6 rounded-xl text-center max-w-sm mx-auto">
      <input type="number" value={num} onChange={e => setNum(Number(e.target.value))} className="w-full p-3 bg-zinc-900 text-white rounded text-xl text-center mb-4"/>
      <div className="text-4xl font-serif text-yellow-500 font-bold">{toRoman(num)}</div>
    </div>
  );
}
