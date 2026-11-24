import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CompareModal from './CompareModal';

const hydrogen = {
  symbol: 'H',
  name: 'Hydrogen',
  number: 1,
  atomic_mass: 1.008,
  category: 'diatomic nonmetal',
  phase: 'Gas',
  period: 1,
  group: 1,
};

const helium = {
  symbol: 'He',
  name: 'Helium',
  number: 2,
  atomic_mass: 4.0026,
  category: 'noble gas',
  phase: 'Gas',
  period: 1,
  group: 18,
};

describe('CompareModal', () => {
  it('renders a comparison for two selected elements and calls onClose when clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<CompareModal elements={[hydrogen, helium]} onClose={onClose} />);

    const dialog = screen.getByRole('dialog', {
      name: /hydrogen \(h\) vs\. helium \(he\)/i,
    });
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText('Hydrogen')).toBeInTheDocument();
    expect(within(dialog).getByText('Helium')).toBeInTheDocument();

    await user.click(within(dialog).getByRole('button', { name: /done/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});