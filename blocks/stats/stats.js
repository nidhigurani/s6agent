export default function decorate(block) {
  const items = [...block.children];
  items.forEach((item, index) => {
    item.classList.add('stats-item');
    if (index === 0) item.classList.add('stats-item-featured');
  });
}
