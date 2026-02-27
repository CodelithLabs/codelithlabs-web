'use client';
import { useState } from 'react';
import { FileText, Plus, Trash2, Download } from 'lucide-react';

interface InvoiceItem { description: string; qty: number; rate: number; }

export default function InvoiceGenerator() {
  const [from, setFrom] = useState({ name: '', email: '', address: '' });
  const [to, setTo] = useState({ name: '', email: '', address: '' });
  const [invoiceNo, setInvoiceNo] = useState(`INV-${Date.now().toString(36).toUpperCase()}`);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([{ description: '', qty: 1, rate: 0 }]);
  const [taxRate, setTaxRate] = useState('18');
  const [notes, setNotes] = useState('');

  const addItem = () => setItems([...items, { description: '', qty: 1, rate: 0 }]);
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i: number, field: keyof InvoiceItem, val: string | number) => { const u = [...items]; const item = { ...u[i] }; if (field === 'description') item.description = val as string; else if (field === 'qty') item.qty = val as number; else item.rate = val as number; u[i] = item; setItems(u); };

  const subtotal = items.reduce((s, i) => s + i.qty * i.rate, 0);
  const tax = subtotal * ((parseFloat(taxRate) || 0) / 100);
  const total = subtotal + tax;

  const generateText = () => {
    let text = `INVOICE\n${'='.repeat(50)}\nInvoice #: ${invoiceNo}\nDate: ${date}${dueDate ? `\nDue Date: ${dueDate}` : ''}\n\nFrom: ${from.name}\n${from.email}\n${from.address}\n\nBill To: ${to.name}\n${to.email}\n${to.address}\n\n${'─'.repeat(50)}\n`;
    text += `${'Description'.padEnd(25)} ${'Qty'.padStart(5)} ${'Rate'.padStart(10)} ${'Amount'.padStart(12)}\n${'─'.repeat(50)}\n`;
    items.forEach(i => { text += `${(i.description || 'Item').padEnd(25)} ${String(i.qty).padStart(5)} ${i.rate.toFixed(2).padStart(10)} ${(i.qty * i.rate).toFixed(2).padStart(12)}\n`; });
    text += `${'─'.repeat(50)}\n${'Subtotal:'.padStart(42)} ${subtotal.toFixed(2).padStart(10)}\n${'Tax (' + taxRate + '%):'.padStart(42)} ${tax.toFixed(2).padStart(10)}\n${'TOTAL:'.padStart(42)} ${total.toFixed(2).padStart(10)}\n`;
    if (notes) text += `\nNotes: ${notes}`;
    return text;
  };

  const download = () => {
    const blob = new Blob([generateText()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${invoiceNo}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <FileText className="w-4 h-4 inline mr-2" /><strong>Invoice Generator:</strong> Create professional invoices with itemized billing, tax calculations, and downloadable output.
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div><label className="text-sm block mb-1">Invoice #</label><input value={invoiceNo} onChange={e => setInvoiceNo(e.target.value)} className="w-full bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700 text-sm" /></div>
        <div><label className="text-sm block mb-1">Date</label><input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700 text-sm" /></div>
        <div><label className="text-sm block mb-1">Due Date</label><input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700 text-sm" /></div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-2">
          <div className="text-sm font-semibold mb-1">From</div>
          <input placeholder="Business Name" value={from.name} onChange={e => setFrom({ ...from, name: e.target.value })} className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700 text-sm" />
          <input placeholder="Email" value={from.email} onChange={e => setFrom({ ...from, email: e.target.value })} className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700 text-sm" />
          <textarea placeholder="Address" value={from.address} onChange={e => setFrom({ ...from, address: e.target.value })} rows={2} className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700 text-sm" />
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-2">
          <div className="text-sm font-semibold mb-1">Bill To</div>
          <input placeholder="Client Name" value={to.name} onChange={e => setTo({ ...to, name: e.target.value })} className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700 text-sm" />
          <input placeholder="Email" value={to.email} onChange={e => setTo({ ...to, email: e.target.value })} className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700 text-sm" />
          <textarea placeholder="Address" value={to.address} onChange={e => setTo({ ...to, address: e.target.value })} rows={2} className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700 text-sm" />
        </div>
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <div className="flex justify-between items-center mb-3"><span className="text-sm font-semibold">Items</span><button onClick={addItem} className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"><Plus className="w-3 h-3" />Add Item</button></div>
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-center">
              <input placeholder="Description" value={item.description} onChange={e => updateItem(i, 'description', e.target.value)} className="col-span-5 bg-zinc-800 text-white p-2 rounded border border-zinc-700 text-sm" />
              <input type="number" placeholder="Qty" value={item.qty} onChange={e => updateItem(i, 'qty', parseInt(e.target.value) || 0)} className="col-span-2 bg-zinc-800 text-white p-2 rounded border border-zinc-700 text-sm" />
              <input type="number" placeholder="Rate" value={item.rate} onChange={e => updateItem(i, 'rate', parseFloat(e.target.value) || 0)} className="col-span-2 bg-zinc-800 text-white p-2 rounded border border-zinc-700 text-sm" />
              <div className="col-span-2 text-right font-mono text-sm">${(item.qty * item.rate).toFixed(2)}</div>
              <button onClick={() => removeItem(i)} className="col-span-1 text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div><label className="text-sm block mb-1">Tax Rate (%)</label><input type="number" value={taxRate} onChange={e => setTaxRate(e.target.value)} className="w-full bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700 text-sm" /></div>
        <div><label className="text-sm block mb-1">Notes</label><input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Payment terms, bank details..." className="w-full bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700 text-sm" /></div>
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-1 text-right">
        <div className="flex justify-between text-sm"><span className="text-gray-400">Subtotal</span><span className="font-mono">${subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between text-sm"><span className="text-gray-400">Tax ({taxRate}%)</span><span className="font-mono">${tax.toFixed(2)}</span></div>
        <div className="flex justify-between text-lg font-bold border-t border-zinc-700 pt-2 mt-2"><span>Total</span><span className="text-green-400">${total.toFixed(2)}</span></div>
      </div>
      <button onClick={download} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2"><Download className="w-4 h-4" />Download Invoice</button>
    </div>
  );
}
