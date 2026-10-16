import React, { useState } from 'react';

interface DeliverToModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentZip: string;
  onSaveZip: (zip: string, locationName: string) => void;
}

const PRESET_LOCATIONS = [
  { city: 'New York', state: 'NY', zip: '10001' },
  { city: 'San Francisco', state: 'CA', zip: '94105' },
  { city: 'Austin', state: 'TX', zip: '78701' },
  { city: 'Seattle', state: 'WA', zip: '98101' },
  { city: 'Chicago', state: 'IL', zip: '60601' },
  { city: 'Boston', state: 'MA', zip: '02110' },
];

export const DeliverToModal: React.FC<DeliverToModalProps> = ({
  isOpen,
  onClose,
  currentZip,
  onSaveZip,
}) => {
  const [zipInput, setZipInput] = useState(currentZip);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!zipInput.trim() || zipInput.trim().length < 5) {
      setError('Please enter a valid 5-digit US ZIP code.');
      return;
    }
    const match = PRESET_LOCATIONS.find((l) => l.zip === zipInput.trim());
    const name = match ? `${match.city} ${match.zip}` : `Zip ${zipInput.trim()}`;
    onSaveZip(zipInput.trim(), name);
    onClose();
  };

  const handleSelectPreset = (loc: typeof PRESET_LOCATIONS[0]) => {
    onSaveZip(loc.zip, `${loc.city} ${loc.zip}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        <div className="bg-slate-900 px-5 py-3 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-500 text-lg">location_on</span>
            <h3 className="font-bold text-sm">Choose your delivery location</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-1 rounded"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <div className="p-5 text-xs text-slate-700 space-y-4">
          <p className="text-slate-600 leading-relaxed">
            Delivery options, transit times, and priority hardware freight are calculated directly from your regional warehouse.
          </p>

          <form onSubmit={handleApply} className="space-y-3">
            <label className="block font-semibold text-slate-800">
              Enter a US ZIP Code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={5}
                value={zipInput}
                onChange={(e) => {
                  setZipInput(e.target.value);
                  setError('');
                }}
                placeholder="e.g. 10001"
                className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#FF9900] hover:bg-[#E68A00] text-slate-950 font-bold rounded shadow-xs text-xs"
              >
                Apply
              </button>
            </div>
            {error && <p className="text-red-600 text-xs font-medium">{error}</p>}
          </form>

          <div className="pt-2 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Major Enterprise Hubs
            </span>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_LOCATIONS.map((loc) => (
                <button
                  key={loc.zip}
                  type="button"
                  onClick={() => handleSelectPreset(loc)}
                  className={`text-left px-3 py-2 rounded border text-xs transition flex items-center justify-between ${
                    currentZip === loc.zip
                      ? 'border-amber-500 bg-amber-50/50 text-slate-900 font-semibold'
                      : 'border-slate-200 hover:border-slate-400 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span>{loc.city}, {loc.state}</span>
                  <span className="text-[11px] text-slate-400 font-mono">{loc.zip}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 border border-slate-300 text-slate-700 rounded hover:bg-slate-100 text-xs font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
