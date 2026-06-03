export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  const headerRow = rows[0];
  const headerCells = [...headerRow.children];

  const tr = document.createElement('tr');
  const thZone = document.createElement('th');
  thZone.textContent = 'Zone';
  thZone.setAttribute('rowspan', '2');
  const thRegion = document.createElement('th');
  thRegion.textContent = 'Region';
  thRegion.setAttribute('rowspan', '2');
  const changeTh = document.createElement('th');
  changeTh.textContent = 'Change fee';
  changeTh.setAttribute('colspan', '2');
  const cancelTh = document.createElement('th');
  cancelTh.textContent = 'Cancellation Fee';
  cancelTh.setAttribute('colspan', '2');
  tr.append(thZone, thRegion, changeTh, cancelTh);
  thead.append(tr);

  const subHeaderRow = document.createElement('tr');
  headerCells.forEach((cell) => {
    const th = document.createElement('th');
    th.textContent = cell.textContent.trim();
    subHeaderRow.append(th);
  });
  thead.append(subHeaderRow);

  rows.slice(1).forEach((row) => {
    const dataRow = document.createElement('tr');
    [...row.children].forEach((cell) => {
      const td = document.createElement('td');
      td.textContent = cell.textContent.trim();
      dataRow.append(td);
    });
    tbody.append(dataRow);
  });

  table.append(thead, tbody);
  block.textContent = '';
  block.append(table);
}
