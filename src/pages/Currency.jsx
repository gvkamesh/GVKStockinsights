import { useEffect, useState } from 'react';
import { fetchMockRates } from '../utils/mockData';
import { ArrowRightLeft } from 'lucide-react';

export default function Currency() {
  const [rates, setRates] = useState([]);
  const [amount, setAmount] = useState(100);

  useEffect(() => {
    fetchMockRates().then(setRates);
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-6">
          <ArrowRightLeft size={32} />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Live Currency Exchange</h1>
        <p className="text-gray-500 mt-2">Real-time USD conversions updating automatically.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Base Amount (USD $)</label>
          <input 
            type="number" 
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full text-3xl font-black text-gray-900 p-4 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-0 outline-none transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rates.map(rate => (
            <div key={rate.currency} className="p-6 rounded-2xl bg-emerald-50/30 border border-emerald-100 hover:bg-emerald-50 transition-colors">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-500 font-medium">{rate.currency}</span>
                <span className="text-2xl">{rate.symbol}</span>
              </div>
              <p className="text-3xl font-black text-emerald-900">
                {(amount * rate.rate).toFixed(2)}
              </p>
              <p className="text-xs text-emerald-600 mt-2 font-medium">Rate: {rate.rate}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
