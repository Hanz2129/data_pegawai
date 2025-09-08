// script.js
let employeesData = [];
let currentFilter = 'all';
let currentEmployeeData = null;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadEmployees();
    
    // Add enter key support for search
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchEmployees();
        }
    });
    
    // Close modal when clicking outside
    window.onclick = function(event) {
        const modal = document.getElementById('employeeModal');
        if (event.target == modal) {
            closeModal();
        }
    }
});

// Load employees data from PHP
async function loadEmployees() {
    try {
        const response = await fetch('get_employees.php');
        const data = await response.json();
        
        if (data.success) {
            employeesData = data.employees;
            displayEmployees(employeesData);
        } else {
            console.error('Error loading employees:', data.message);
            showError('Gagal memuat data pegawai: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        // Fallback to sample data if PHP is not available
        loadSampleData();
    }
}

// Fallback sample data (for demo purposes)
function loadSampleData() {
    employeesData = [
        {
            id: 1,
            nama: "Dr. Ahmad Suharto, M.Si",
            nip: "196501121990031001",
            status: "ASN",
            jabatan: "Camat",
            jenis_kelamin: "Laki-laki",
            tanggal_lahir: "1965-01-12",
            alamat: "Jl. Medan-Binjai KM. 12, Medan",
            foto: "uploads/default-male.jpg"
        },
        {
            id: 2,
            nama: "Siti Maryam, S.Pd",
            nip: "197203151998022002",
            status: "ASN",
            jabatan: "Sekretaris Camat",
            jenis_kelamin: "Perempuan",
            tanggal_lahir: "1972-03-15",
            alamat: "Jl. Gaperta No. 45, Medan",
            foto: "uploads/default-female.jpg"
        },
        {
            id: 3,
            nama: "Budi Santoso",
            nip: "198505202010121001",
            status: "Honorer",
            jabatan: "Staff Administrasi",
            jenis_kelamin: "Laki-laki",
            tanggal_lahir: "1985-05-20",
            alamat: "Jl. Karya Jaya No. 12, Medan",
            foto: "uploads/default-male.jpg"
        },
        {
            id: 4,
            nama: "Supriyadi",
            nip: "196712101995031003",
            status: "Kepling",
            jabatan: "Lurah Kelurahan Gedung Johor",
            jenis_kelamin: "Laki-laki",
            tanggal_lahir: "1967-12-10",
            alamat: "Jl. Gedung Johor Raya No. 8, Medan",
            foto: "uploads/default-male.jpg"
        },
        {
            id: 5,
            nama: "Rina Wulandari, S.E",
            nip: "198012152005022001",
            status: "ASN",
            jabatan: "Kepala Seksi Pembangunan",
            jenis_kelamin: "Perempuan",
            tanggal_lahir: "1980-12-15",
            alamat: "Jl. Perjuangan No. 23, Medan",
            foto: "uploads/default-female.jpg"
        },
        {
            id: 6,
            nama: "Dedi Kurniawan",
            nip: "199001102015051001",
            status: "Honorer",
            jabatan: "Security",
            jenis_kelamin: "Laki-laki",
            tanggal_lahir: "1990-01-10",
            alamat: "Jl. Veteran No. 67, Medan",
            foto: "uploads/default-male.jpg"
        }
    ];
    
    displayEmployees(employeesData);
}

function displayEmployees(employees) {
    const grid = document.getElementById('employeesGrid');
    
    if (employees.length === 0) {
        grid.innerHTML = '<div class="no-results">Tidak ada data pegawai yang ditemukan.</div>';
        return;
    }
    
    grid.innerHTML = employees.map(emp => `
        <div class="employee-card" onclick="showEmployeeDetail(${emp.id})">
            <img src="${emp.foto || 'uploads/default.jpg'}" alt="${emp.nama}" class="employee-photo" 
                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjNjY3ZWVhIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iNDgiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiI+Pz88L3RleHQ+Cjwvc3ZnPgo='">
            <h3 class="employee-name">${emp.nama}</h3>
            <p class="employee-nip">NIP: ${emp.nip}</p>
            <span class="employee-status status-${emp.status.toLowerCase()}">${emp.status}</span>
        </div>
    `).join('');
}

function filterEmployees(status) {
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    currentFilter = status;
    let filteredData = employeesData;
    
    if (status !== 'all') {
        filteredData = employeesData.filter(emp => emp.status === status);
    }
    
    displayEmployees(filteredData);
}

function searchEmployees() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    
    let filteredData = employeesData;
    
    // Apply current filter first
    if (currentFilter !== 'all') {
        filteredData = filteredData.filter(emp => emp.status === currentFilter);
    }
    
    // Then apply search
    if (searchTerm) {
        filteredData = filteredData.filter(emp => 
            emp.nama.toLowerCase().includes(searchTerm) || 
            emp.nip.includes(searchTerm)
        );
    }
    
    displayEmployees(filteredData);
}

async function showEmployeeDetail(employeeId) {
    try {
        const response = await fetch(`get_employee_detail.php?id=${employeeId}`);
        const data = await response.json();
        
        if (data.success) {
            const employee = data.employee;
            currentEmployeeData = employee;
            
            // Populate modal with employee data
            document.getElementById('modalPhoto').src = employee.foto || 'uploads/default.jpg';
            document.getElementById('modalPhoto').onerror = function() {
                this.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjNjY3ZWVhIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iNDgiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiI+Pz88L3RleHQ+Cjwvc3ZnPgo=";
            };
            
            document.getElementById('modalName').textContent = employee.nama;
            document.getElementById('modalNip').textContent = employee.nip;
            document.getElementById('modalJabatan').textContent = employee.jabatan;
            document.getElementById('modalStatus').textContent = employee.status;
            document.getElementById('modalGender').textContent = employee.jenis_kelamin;
            document.getElementById('modalBirth').textContent = formatDate(employee.tanggal_lahir);
            document.getElementById('modalAddress').textContent = employee.alamat;
            
            // Show modal
            document.getElementById('employeeModal').style.display = 'block';
            document.body.style.overflow = 'hidden';
        } else {
            console.error('Error loading employee detail:', data.message);
            showError('Gagal memuat detail pegawai: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        // Fallback to local data
        const employee = employeesData.find(emp => emp.id === employeeId);
        if (employee) {
            showEmployeeDetailLocal(employee);
        } else {
            showError('Data pegawai tidak ditemukan');
        }
    }
}

function showEmployeeDetailLocal(employee) {
    currentEmployeeData = employee;
    
    // Populate modal with employee data
    document.getElementById('modalPhoto').src = employee.foto || 'uploads/default.jpg';
    document.getElementById('modalName').textContent = employee.nama;
    document.getElementById('modalNip').textContent = employee.nip;
    document.getElementById('modalJabatan').textContent = employee.jabatan;
    document.getElementById('modalStatus').textContent = employee.status;
    document.getElementById('modalGender').textContent = employee.jenis_kelamin;
    document.getElementById('modalBirth').textContent = formatDate(employee.tanggal_lahir);
    document.getElementById('modalAddress').textContent = employee.alamat;
    
    // Show modal
    document.getElementById('employeeModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('employeeModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function downloadData() {
    if (!currentEmployeeData) return;
    
    const emp = currentEmployeeData;
    const dataText = `
BIODATA PEGAWAI
Kecamatan Medan Perjuangan

Nama: ${emp.nama}
NIP: ${emp.nip}
Jabatan: ${emp.jabatan}
Status: ${emp.status}
Jenis Kelamin: ${emp.jenis_kelamin}
Tanggal Lahir: ${formatDate(emp.tanggal_lahir)}
Alamat: ${emp.alamat}

Dicetak pada: ${new Date().toLocaleString('id-ID')}
    `.trim();
    
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(dataText));
    element.setAttribute('download', `Biodata_${emp.nama.replace(/\s+/g, '_')}.txt`);
    element.style.display = 'none';
    
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// Utility Functions
function formatDate(dateString) {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    
    return date.toLocaleDateString('id-ID', options);
}

function showError(message) {
    const grid = document.getElementById('employeesGrid');
    grid.innerHTML = `<div class="no-results" style="color: #e74c3c;">❌ ${message}</div>`;
}