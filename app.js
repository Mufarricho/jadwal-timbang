

document.addEventListener('DOMContentLoaded', (event) => {
    loadElements();
});

function tambahElement(status, inputId, containerId) {
    const tanggalInput = document.getElementById(inputId);
    const tanggal = new Date(tanggalInput.value);
    if (isNaN(tanggal)) {
        alert('Please select a valid date.');
        return;
    }

    const formattedDate = tanggal.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });

    const newElement = {
        date: formattedDate,
        status: status,
        containerId: containerId
    };

    saveElement(newElement);
    addElementToDOM(newElement);
}

function saveElement(element) {
    let elements = JSON.parse(localStorage.getItem('elements')) || [];
    elements.push(element);
    localStorage.setItem('elements', JSON.stringify(elements));
}

function loadElements() {
    const elements = JSON.parse(localStorage.getItem('elements')) || [];
    elements.forEach(element => {
        addElementToDOM(element);
    });
}

function addElementToDOM(element) {
    const container = document.getElementById(element.containerId);
    const div = document.createElement('div');
    div.className = 'alert alert-secondary';
    div.innerHTML = `${element.date} ${element.status} <button class="btn btn-sm btn-danger float-end" onclick="deleteElement(this, '${element.date}', '${element.status}', '${element.containerId}')">Delete</button>`;
    container.appendChild(div);
}

function deleteElement(button, date, status, containerId) {
    const div = button.parentElement;
    const container = document.getElementById(containerId);
    container.removeChild(div);

    let elements = JSON.parse(localStorage.getItem('elements')) || [];
    elements = elements.filter(e => e.date !== date || e.status !== status || e.containerId !== containerId);
    localStorage.setItem('elements', JSON.stringify(elements));
}