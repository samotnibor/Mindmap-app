let ideas = [];
let nextId = 1;

// Idea list
const list = document.querySelector('#idea-list');

function render() {
  list.innerHTML = ''; // wipe and rebuild
  ideas.forEach(idea => {
    const li = document.createElement('li');
    li.textContent = idea.text;
    li.className = 'idea-item';
    li.dataset.id = idea.id; // stash the id on the element itself
    list.appendChild(li);
  });
}

// Adding an idea
const input = document.querySelector('#idea-input');
const addBtn = document.querySelector('#add-btn');

function addIdea() {
  const text = input.value.trim();
  if (!text) return;
  ideas.push({ id: nextId++, text });
  input.value = '';
  render();
}

addBtn.addEventListener('click', addIdea);
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addIdea();
});

// Make ites clickable
list.addEventListener('click', (e) => {
  const item = e.target.closest('.idea-item');
  if (!item) return;

  const id = Number(item.dataset.id);
  const idea = ideas.find(i => i.id === id);

  // Placeholder — this is exactly where the mindmap will open once you
  // build step 8. For now, just prove the click is wired up.
  document.querySelectorAll('.idea-item').forEach(el => el.classList.remove('selected'));
  item.classList.add('selected');
  console.log('Clicked idea:', idea);
});