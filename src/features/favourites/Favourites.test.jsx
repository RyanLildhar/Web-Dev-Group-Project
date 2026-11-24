import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, within, renderHook, act, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FavouriteButton from './components/FavouriteButton';
import FavouritesPage from './FavouritesPage';
import useFavourites from './hooks/useFavourites';
// AI-assisted - see AI-USAGE.md #3
const STORAGE_KEY = 'elementBohrd:favourites';

// vitest doesn't auto-clean rendered components, so do it after every test
afterEach(cleanup);

const elements = [
  { symbol: 'H', name: 'Hydrogen', number: 1, category: 'diatomic nonmetal', summary: 'Lightest element.' },
  { symbol: 'He', name: 'Helium', number: 2, category: 'noble gas', summary: 'Noble gas.' },
  { symbol: 'Li', name: 'Lithium', number: 3, category: 'alkali metal', summary: 'Soft metal.' },
];

describe('FavouriteButton', () => {
  it('shows the unsaved state and calls onToggle with the atomic number without triggering the parent click', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    const onParentClick = vi.fn();

    render(
      <div onClick={onParentClick}>
        <FavouriteButton element={elements[0]} isFavourite={false} onToggle={onToggle} />
      </div>
    );

    const button = screen.getByRole('button', { name: /add hydrogen to favourites/i });
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button).toHaveTextContent('Save');

    await user.click(button);
    expect(onToggle).toHaveBeenCalledWith(1);
    expect(onParentClick).not.toHaveBeenCalled();
  });

  it('shows the saved state when the element is a favourite', () => {
    render(<FavouriteButton element={elements[0]} isFavourite={true} onToggle={() => {}} />);

    const button = screen.getByRole('button', { name: /remove hydrogen from favourites/i });
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveTextContent('Saved');
  });
});

describe('FavouritesPage', () => {
  it('shows an empty message when there are no favourites', () => {
    render(
      <FavouritesPage elements={elements} favourites={[]} onSelect={() => {}} onToggleFavourite={() => {}} />
    );

    expect(screen.getByText(/no favourites yet/i)).toBeInTheDocument();
  });

  it('shows only saved elements in saved order and supports select and remove', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const onToggleFavourite = vi.fn();

    const { container } = render(
      <FavouritesPage
        elements={elements}
        favourites={[3, 1]}
        onSelect={onSelect}
        onToggleFavourite={onToggleFavourite}
      />
    );

    const page = within(container);
    const removeButtons = page.getAllByRole('button', { name: /from favourites/i });
    expect(removeButtons).toHaveLength(2);
    expect(removeButtons[0]).toHaveAccessibleName(/lithium/i);
    expect(removeButtons[1]).toHaveAccessibleName(/hydrogen/i);
    expect(page.queryByRole('button', { name: /helium/i })).not.toBeInTheDocument();

    await user.click(removeButtons[0]);
    expect(onToggleFavourite).toHaveBeenCalledWith(3);
    expect(onSelect).not.toHaveBeenCalled();

    await user.click(page.getAllByRole('article')[1]);
    expect(onSelect).toHaveBeenCalledWith(elements[0]);
  });
});

describe('useFavourites', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('toggles favourites on and off and saves them to localStorage', () => {
    const { result } = renderHook(() => useFavourites());
    expect(result.current.favourites).toEqual([]);

    act(() => result.current.toggleFavourite(1));
    expect(result.current.favourites).toEqual([1]);
    expect(result.current.isFavourite(1)).toBe(true);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toEqual([1]);

    act(() => result.current.toggleFavourite(1));
    expect(result.current.favourites).toEqual([]);
    expect(result.current.isFavourite(1)).toBe(false);
  });

  it('loads saved favourites and ignores corrupt data', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([2, 'x', 5]));
    const { result } = renderHook(() => useFavourites());
    expect(result.current.favourites).toEqual([2, 5]);

    localStorage.setItem(STORAGE_KEY, '{not json');
    const { result: corrupt } = renderHook(() => useFavourites());
    expect(corrupt.current.favourites).toEqual([]);
  });
});