// Variabel libur untuk setiap orang
let libur = {
    sutaji: 0,
    sugeng: 0,
    satria: 0,
    nasir: 0,
    rico: 0
};

// Array untuk menyimpan elemen yang telah ditambahkan
let elements = [];

// Saat halaman dimuat, kita memuat elemen yang ada dan memperbarui tampilan
document.addEventListener('DOMContentLoaded', (event) => {
    loadElements();
    updateAllLiburDisplay();
});

// Fungsi untuk menambah elemen (LIBUR atau MASUK)
function tambahElement(status, inputId, containerId, liburId) {
    const tanggalInput = document.getElementById(inputId);
    const tanggal = new Date(tanggalInput.value);
    if (isNaN(tanggal)) {
        alert('Lebokno sek tanggalane ! ⚠️');
        return;
    }

    const formattedDate = tanggal.toISOString().split('T')[0]; // Format YYYY-MM-DD

    // Update libur sesuai status
    const person = liburId.replace('Libur', '').toLowerCase();
    if (status === 'LIBUR') {
        libur[person]++;
    } else {
        libur[person]--;
    }

    // Simpan elemen dan tambahkan ke DOM
    const element = { date: formattedDate, status, containerId, liburId };
    saveElement(element);
    addElementToDOM(element);
    updateLiburDisplay(liburId);
    tanggalInput.value = ''; // Reset input date
}

// Fungsi untuk menyimpan elemen
function saveElement(element) {
    elements.push(element); // Tambahkan elemen ke array
    localStorage.setItem('elements', JSON.stringify(elements)); // Simpan ke localStorage
}

// Fungsi untuk memuat elemen dari localStorage
// Fungsi untuk memuat elemen dari localStorage
function loadElements() {
    elements = JSON.parse(localStorage.getItem('elements')) || [];
    
    // Reset libur ke 0 jika tidak ada elemen yang ditemukan
    if (elements.length === 0) {
        Object.keys(libur).forEach(person => {
            libur[person] = 0; // Reset semua libur ke 0
            updateLiburDisplay(`${person}Libur`); // Perbarui tampilan
        });
    } else {
        elements.forEach((element) => {
            addElementToDOM(element);
            // Update libur untuk setiap elemen
            const person = element.liburId.replace('Libur', '').toLowerCase();
            if (element.status === 'LIBUR') {
                libur[person]++;
            } else {
                libur[person]--;
            }
        });
    }
}

// Fungsi untuk menambahkan elemen ke DOM
function addElementToDOM(element) {
    const listContainer = document.getElementById(element.containerId);
    const newDiv = document.createElement('div');
    newDiv.classList.add('alert', element.status === 'MASUK' ? 'alert-danger' : 'alert-success');
    newDiv.textContent = `${element.date} : ${element.status}`;
    newDiv.dataset.liburId = element.liburId; // Simpan ID libur pada elemen
    newDiv.innerHTML += `<button class="btn btn-danger btn-sm float-end" onclick="hapusElement(this, '${element.date}', '${element.status}', '${element.liburId}')">HAPUS</button>`; // Tombol hapus
    listContainer.appendChild(newDiv);
}

// Fungsi untuk menghapus elemen dari DOM dan localStorage
function hapusElement(button, date, status, liburId) {
    const parent = button.parentElement; // Mendapatkan parent div
    const index = elements.findIndex(el => el.date === date && el.status === status && el.liburId === liburId);
    
    if (index !== -1) {
        // Update libur
        const person = liburId.replace('Libur', '').toLowerCase();
        if (status === 'LIBUR') {
            libur[person]--;
        } else {
            libur[person]++;
        }

        elements.splice(index, 1); // Hapus elemen dari array
        localStorage.setItem('elements', JSON.stringify(elements)); // Simpan perubahan ke localStorage
        parent.remove(); // Hapus elemen dari DOM
        updateLiburDisplay(liburId); // Perbarui tampilan libur
    }
}

// Fungsi untuk mereset data di DOM
function resetData(containerId, liburId) {
    const listContainer = document.getElementById(containerId);
    while (listContainer.firstChild) {
        listContainer.firstChild.remove(); // Hapus semua child dari container
    }

    // Reset libur untuk orang tersebut
    const person = liburId.replace('Libur', '').toLowerCase();
    libur[person] = 0;
    updateLiburDisplay(liburId); // Perbarui tampilan libur

    // Hapus elemen dari localStorage
    elements = elements.filter(el => el.liburId !== liburId); // Filter elemen berdasarkan liburId
    localStorage.setItem('elements', JSON.stringify(elements)); // Simpan perubahan ke localStorage
}

// Fungsi untuk memperbarui tampilan libur di DOM
function updateLiburDisplay(liburId) {
    const person = liburId.replace('Libur', '');  // Mendapatkan nama orang dari liburId
    const liburValue = libur[person];
    const liburElement = document.getElementById(liburId);
    const celengan = Math.abs(liburValue);
    const hutang = Math.max(liburValue, 0);

    if (liburValue === 0) {
        liburElement.textContent = 'LUNAS';
    } else if (liburValue > 0) {
        liburElement.textContent = `Hutang: ${hutang}`;
    } else {
        liburElement.textContent = `Celengan: ${celengan}`;
    }
}

// Fungsi untuk memperbarui tampilan libur semua orang saat halaman dimuat
function updateAllLiburDisplay() {
    updateLiburDisplay('sutajiLibur');
    updateLiburDisplay('sugengLibur');
    updateLiburDisplay('satriaLibur');
    updateLiburDisplay('nasirLibur');
    updateLiburDisplay('ricoLibur');
}
