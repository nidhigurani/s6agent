export default function decorate(block) {
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Breadcrumb');

  const ol = document.createElement('ol');
  ol.className = 'breadcrumb-list';

  const listItems = block.querySelectorAll('li');

  listItems.forEach((item, index) => {
    const li = document.createElement('li');
    const anchor = item.querySelector('a');

    if (index === listItems.length - 1 || !anchor) {
      li.setAttribute('aria-current', 'page');
      const span = document.createElement('span');
      span.textContent = item.textContent.trim();
      li.append(span);
    } else {
      li.append(anchor.cloneNode(true));
    }
    ol.append(li);
  });

  nav.append(ol);
  block.textContent = '';
  block.append(nav);
}
