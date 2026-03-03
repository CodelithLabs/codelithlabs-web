'use client';

import { memo, useState, useCallback } from 'react';

function ContractGenerator() {
  const [clientName, setClientName] = useState('');
  const [providerName, setProviderName] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('30');
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = useCallback(() => {
    if (!clientName || !providerName || !serviceDescription) {
      return;
    }

    const contract = `SERVICE AGREEMENT

This Service Agreement ("Agreement") is entered into as of ${startDate || '[DATE]'}

BETWEEN:

SERVICE PROVIDER:
${providerName}
(hereinafter referred to as "Provider")

AND

CLIENT:
${clientName}
(hereinafter referred to as "Client")

1. SERVICES
Provider agrees to provide the following services to Client:
${serviceDescription}

2. TERM
This Agreement shall commence on ${startDate || '[START DATE]'} and shall continue until ${endDate || '[END DATE]'}, unless terminated earlier in accordance with this Agreement.

3. COMPENSATION
Client agrees to pay Provider ${amount ? `₹${amount}` : '[AMOUNT]'} for the services described herein.

4. PAYMENT TERMS
Payment shall be due within ${paymentTerms} days of invoice date. Late payments shall incur interest at 1.5% per month.

5. CONFIDENTIALITY
Both parties agree to keep confidential any proprietary information received from the other party during the term of this Agreement.

6. INTELLECTUAL PROPERTY
All work product created by Provider under this Agreement shall be the property of Client upon full payment.

7. TERMINATION
Either party may terminate this Agreement with 30 days written notice. Client shall pay for all services rendered up to the termination date.

8. LIMITATION OF LIABILITY
Provider's liability shall be limited to the total amount paid by Client under this Agreement.

9. GOVERNING LAW
This Agreement shall be governed by the laws of India.

10. ENTIRE AGREEMENT
This Agreement constitutes the entire agreement between the parties and supersedes all prior negotiations and agreements.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.


_________________________          _________________________
${providerName}                    ${clientName}
Provider                           Client
Date: _______________              Date: _______________
`;

    setResult(contract);
  }, [clientName, providerName, serviceDescription, amount, startDate, endDate, paymentTerms]);

  const handleCopy = useCallback(() => {
    if (result) {
      navigator.clipboard.writeText(result);
    }
  }, [result]);

  return (
    <div className="space-y-6">
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Service Contract Generator</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Provider Name</label>
              <input
                type="text"
                value={providerName}
                onChange={(e) => setProviderName(e.target.value)}
                placeholder="e.g., ABC Solutions Pvt. Ltd."
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Client Name</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g., XYZ Corp"
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Service Description</label>
            <textarea
              value={serviceDescription}
              onChange={(e) => setServiceDescription(e.target.value)}
              placeholder="Describe the services to be provided..."
              rows={3}
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Amount (₹)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g., 50000"
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Payment Terms (days)</label>
            <select
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7">Net 7</option>
              <option value="15">Net 15</option>
              <option value="30">Net 30</option>
              <option value="45">Net 45</option>
              <option value="60">Net 60</option>
            </select>
          </div>
          <button
            onClick={handleGenerate}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Generate Contract
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Generated Contract</h3>
            <button
              onClick={handleCopy}
              className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 text-white text-sm rounded transition-colors"
            >
              Copy to Clipboard
            </button>
          </div>
          <pre className="bg-zinc-900 rounded-lg p-4 text-green-400 text-sm overflow-x-auto whitespace-pre-wrap font-mono max-h-96 overflow-y-auto">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}

export default memo(ContractGenerator);
