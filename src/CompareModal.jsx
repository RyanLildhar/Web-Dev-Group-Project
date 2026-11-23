//AI Usage... see AI-USAGE.md
import { useEffect } from 'react';

export default function CompareModal({ elements, onClose }) {
  const [first, second] = elements;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!first || !second) return null;

  const rows = [
    { label: 'Symbol', getValue: (el) => el.symbol },
    { label: 'Atomic Number', getValue: (el) => el.number },
    { label: 'Atomic Mass', getValue: (el) => el.atomic_mass ?? el.atomicMass ?? '—' },
    { label: 'Category', getValue: (el) => el.category ?? '—' },
    { label: 'Phase', getValue: (el) => el.phase ?? '—' },
    { label: 'Period / Group', getValue: (el) => `Period ${el.period ?? '—'}, Group ${el.group ?? '—'}` },
    { label: 'Electron Config', getValue: (el) => el.electron_configuration_semantic ?? el.electron_configuration ?? '—' },
    { label: 'Density', getValue: (el) => (el.density != null ? `${el.density}` : '—') },
    { label: 'Melting Point (K)', getValue: (el) => el.melt ?? '—' },
    { label: 'Boiling Point (K)', getValue: (el) => el.boil ?? '—' },
    { label: 'Electronegativity', getValue: (el) => el.electronegativity_pauling ?? '—' },
    { label: 'Discovered By', getValue: (el) => el.discovered_by ?? '—' },
  ];

  return (
    <div
      className="compare-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="compare-modal-title"
    >
      <div className="compare-modal" onClick={(e) => e.stopPropagation()}>
        <div className="compare-modal-header">
          <h2 id="compare-modal-title">
            {first.name} ({first.symbol}) vs. {second.name} ({second.symbol})
          </h2>
          <button
            type="button"
            className="compare-close-btn"
            onClick={onClose}
            aria-label="Close comparison"
          >
            ✕
          </button>
        </div>

        <div className="compare-table-wrapper">
          <table className="compare-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>{first.name}</th>
                <th>{second.name}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label}>
                  <td className="compare-prop-label">{row.label}</td>
                  <td>{row.getValue(first)}</td>
                  <td>{row.getValue(second)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="compare-modal-footer">
          <button type="button" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}