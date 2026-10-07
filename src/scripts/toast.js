let timer;
export function toast(message) {
  document.querySelector('.toast')?.remove();
  const t = document.createElement('div');
  t.className = 'toast';
  t.setAttribute('role', 'status');
  t.textContent = message;
  document.body.appendChild(t);
  clearTimeout(timer);
  timer = setTimeout(() => t.remove(), 3800);
}
