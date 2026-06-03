export default function decorate(block) {
  const rows = [...block.children];
  block.textContent = '';

  const grid = document.createElement('div');
  grid.className = 'stats-grid';

  rows.forEach((row, index) => {
    const card = document.createElement('div');
    card.className = index === 0 ? 'stats-card stats-card-featured' : 'stats-card';

    const cols = [...row.children];
    const number = cols[0]?.textContent.trim() || '';
    const label = cols[1]?.textContent.trim() || '';

    const numberEl = document.createElement('span');
    numberEl.className = 'stats-number';
    numberEl.textContent = number;

    const labelEl = document.createElement('span');
    labelEl.className = 'stats-label';
    labelEl.textContent = label;

    card.append(numberEl, labelEl);
    grid.append(card);
  });

  block.append(grid);
}
