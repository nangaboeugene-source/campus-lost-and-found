const itemForm = document.getElementById('itemForm');
const itemsContainer = document.getElementById('itemsContainer');
const searchInput = document.getElementById('searchInput');

let allItems = [];

const fetchItems = async () => {
    const response = await fetch('/api/items');
    allItems = await response.json();
    renderItems(allItems);
};

const renderItems = (items) => {
    itemsContainer.innerHTML = '';
    if (items.length === 0) {
        itemsContainer.innerHTML = '<p>No items reported yet.</p>';
        return;
    }

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = item-card ${item.status.toLowerCase()};
        card.innerHTML = `
            <span class="badge ${item.type.toLowerCase()}">${item.type}</span>
            <h3>${item.title}</h3>
            <p><strong>Category:</strong> ${item.category}</p>
            <p><strong>Location:</strong> ${item.location}</p>
            <p>${item.description}</p>
            <small>Reported: ${item.date} | Status: <strong>${item.status}</strong></small>
            ${item.status === 'Unclaimed' 
                ? <button onclick="claimItem('${item.id}')">Verify & Claim</button> 
                : <p class="claimed-info">Claimed (Proof: ${item.claimNote})</p>}
        `;
        itemsContainer.appendChild(card);
    });
};

itemForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const payload = {
        title: document.getElementById('title').value,
        type: document.getElementById('type').value,
        category: document.getElementById('category').value,
        location: document.getElementById('location').value,
        description: document.getElementById('description').value
    };

    const response = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (response.ok) {
        itemForm.reset();
        fetchItems();
    }
});

window.claimItem = async (id) => {
    const proof = prompt('Enter proof of ownership (e.g., Serial number, Student ID, unique mark):');
    if (!proof) return;

    const response = await fetch(/api/items/${id}/claim, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verificationNote: proof })
    });

    if (response.ok) {
        fetchItems();
    }
};

searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = allItems.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
    );
    renderItems(filtered);
});

fetchItems();