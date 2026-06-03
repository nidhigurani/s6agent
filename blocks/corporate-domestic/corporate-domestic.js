export default function decorate(block) {
    const rows = [...block.children];
    if (rows.length < 2) return;
  
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
  
    const headerRow = rows[0];
    const tr = document.createElement('tr');
    const th0 = document.createElement('th');
    th0.textContent = 'Corporate - Domestic';
    th0.setAttribute('rowspan', '2');
    tr.append(th0);
  
    const cells = [...headerRow.children];
    const changeTh = document.createElement('th');
    changeTh.textContent = 'Change fee';
    changeTh.setAttribute('colspan', '2');
    const cancelTh = document.createElement('th');
    cancelTh.textContent = 'Cancellation Fee';
    cancelTh.setAttribute('colspan', '2');
    tr.append(changeTh, cancelTh);
    thead.append(tr);
  
    const subHeaderRow = document.createElement('tr');
    cells.forEach((cell) => {
      const th = document.createElement('th');
      th.textContent = cell.textContent.trim();
      subHeaderRow.append(th);
    });
    thead.append(subHeaderRow);
  
    rows.slice(1).forEach((row) => {
      const dataRow = document.createElement('tr');
      const dataCells = [...row.children];
      dataCells.forEach((cell) => {
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
  
