// Empty idea list
let ideas = [];
let nextId = 1;

// which idea (if any) is currently being edited
let editingId = null; 

// Constants
const input = document.querySelector('#idea-input');
const addBtn = document.querySelector('#add-btn');
const list = document.querySelector('#idea-list');

// Functions

// Rendering the website
function render() {
  list.innerHTML = '';
  const sorted = getSortedIdeas();
  sorted.forEach(idea => {
    const li = document.createElement('li');
    li.className = 'idea-item';
    li.dataset.id = idea.id;

    if (idea.id === editingId) {
      const editInput = document.createElement('input');
      editInput.type = 'text';
      editInput.className = 'edit-input';
      editInput.value = idea.text;

      const saveBtn = document.createElement('button');
      saveBtn.className = 'save-btn';
      saveBtn.textContent = 'Save';

      li.appendChild(editInput);
      li.appendChild(saveBtn);
    } else {
      const span = document.createElement('span');
      span.className = 'idea-text';
      span.textContent = idea.text;

      const editBtn = document.createElement('button');
      editBtn.className = 'edit-btn';
      editBtn.textContent = 'Edit';

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.textContent = 'Delete';

      li.appendChild(span);
      li.appendChild(editBtn);
      li.appendChild(deleteBtn);
    }

    list.appendChild(li);
  });
}

// Saving the idea list
function saveIdeas() {
  localStorage.setItem('ideas', JSON.stringify(ideas));
}

// Adding an idea
function addIdea() {
  const text = input.value.trim();
  if (!text) return;
  ideas.push({ id: nextId++, text, createdAt: Date.now() });
  input.value = '';
  saveIdeas();
  render();
}

// Loading the idea list
function loadIdeas() {
  const saved = localStorage.getItem('ideas');
  if (saved) {
    ideas = JSON.parse(saved);
    // rebuild nextId so new ideas don't reuse an old id
    nextId = ideas.length ? Math.max(...ideas.map(i => i.id)) + 1 : 1;
  }
}

// Sorting the ideas 
// Current sort functions: Time, Alphabet.
function getSortedIdeas() {
  const sortMode = document.querySelector('#sort-select').value;
  const copy = [...ideas]; // never sort the original array in place

  switch (sortMode) {
    case 'newest': return copy.sort((a, b) => b.createdAt - a.createdAt);
    case 'oldest': return copy.sort((a, b) => a.createdAt - b.createdAt);
    case 'az':     return copy.sort((a, b) => a.text.localeCompare(b.text));
    case 'za':     return copy.sort((a, b) => b.text.localeCompare(a.text));
    default:       return copy;
  }
}
///////////////////////////////////////////////////////////////////////////////////////
// Adding an idea
addBtn.addEventListener('click', addIdea);
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addIdea();
});

list.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.target.classList.contains('edit-input')) {
    e.target.closest('.idea-item').querySelector('.save-btn').click();
  }
});

// Make items clickable
list.addEventListener('click', (e) => {
  const item = e.target.closest('.idea-item');
  if (!item) return;
  const id = Number(item.dataset.id);

  if (e.target.closest('.delete-btn')) {
    ideas = ideas.filter(i => i.id !== id);
    saveIdeas();
    render();
    return;
  }

  if (e.target.closest('.edit-btn')) {
    editingId = id;
    render();
    return;
  }

  if (e.target.closest('.save-btn')) {
    const newText = item.querySelector('.edit-input').value.trim();
    if (newText) {
      ideas.find(i => i.id === id).text = newText;
    }
    editingId = null;
    saveIdeas();
    render();
    return;
  }

  if (e.target.closest('.edit-input')) return; // clicking inside the field shouldn't select

  // Fallback: clicked the idea itself — this is where step 8's mindmap opens later
  document.querySelectorAll('.idea-item').forEach(el => el.classList.remove('selected'));
  item.classList.add('selected');
  console.log('Clicked idea:', ideas.find(i => i.id === id));
});

  // Placeholder — this is exactly where the mindmap will open once you
  // build step 8. For now, just prove the click is wired up.
  document.querySelectorAll('.idea-item').forEach(el => el.classList.remove('selected'));
  item.classList.add('selected');
  console.log('Clicked idea:', idea);
;     

document.querySelector('#sort-select').addEventListener('change', render);

loadIdeas();
render();