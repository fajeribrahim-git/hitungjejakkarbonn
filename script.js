document.addEventListener('DOMContentLoaded', function() {
    // Konstanta untuk faktor emisi
    const EMISSION_FACTORS = {
        mobil: 0.12,   // kg CO2 per km
        laptop: 0.05,  // kg CO2 per jam
        tv: 0.1,       // kg CO2 per jam
        lampu: 0.02,   // kg CO2 per jam
        kipas: 0.03,   // kg CO2 per jam
        ac: 0.5,       // kg CO2 per jam
        kulkas: 0.1    // kg CO2 per jam
    };

    const deviceLabels = {
        mobil: {
            unit: 'Kilometer',
            usage: 'per bulan'
        },
        laptop: {
            unit: 'Unit',
            usage: 'jam per hari'
        },
        tv: {
            unit: 'Unit',
            usage: 'jam per hari'
        },
        lampu: {
            unit: 'Unit',
            usage: 'jam per hari'
        },
        kipas: {
            unit: 'Unit',
            usage: 'jam per hari'
        },
        ac: {
            unit: 'Unit',
            usage: 'jam per hari'
        },
        kulkas: {
            unit: 'Unit',
            usage: 'jam per hari'
        }
    };

    let devices = [];
    let deviceCounter = 0;

    document.getElementById('add-device').addEventListener('click', function() {
        const deviceType = document.getElementById('device-type').value;
        if (!deviceType) return;

        const deviceId = `device-${deviceCounter++}`;
        const device = { id: deviceId, type: deviceType };
        devices.push(device);

        const deviceElement = createDeviceElement(device);
        document.getElementById('device-list').appendChild(deviceElement);
        updateEmissions();
    });

    function createDeviceElement(device) {
        const div = document.createElement('div');
        div.className = 'device-item';
        div.id = device.id;

        const labels = deviceLabels[device.type];
        const capitalizedType = device.type.charAt(0).toUpperCase() + device.type.slice(1);

        div.innerHTML = `
            <h3>
                ${capitalizedType}
                <button class="remove-device" data-id="${device.id}">Hapus</button>
            </h3>
            <div class="device-inputs">
                <div class="input-group">
                    <label for="${device.id}-units">${labels.unit}</label>
                    <input type="number" id="${device.id}-units" min="0" placeholder="0">
                </div>
                <div class="input-group">
                    <label for="${device.id}-usage">${labels.usage}</label>
                    <input type="number" id="${device.id}-usage" min="0" placeholder="0">
                </div>
            </div>
        `;

        div.querySelector('.remove-device').addEventListener('click', function() {
            devices = devices.filter(d => d.id !== device.id);
            div.remove();
            updateEmissions();
        });

        div.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', updateEmissions);
        });

        return div;
    }

    function calculateDeviceEmissions(device) {
        const units = parseFloat(document.getElementById(`${device.id}-units`).value) || 0;
        const usage = parseFloat(document.getElementById(`${device.id}-usage`).value) || 0;
        
        if (device.type === 'mobil') {
            // Untuk mobil, usage adalah kilometer per bulan
            return units * usage * EMISSION_FACTORS[device.type];
        } else {
            // Untuk perangkat lain, hitung penggunaan harian * 30 hari
            return units * usage * EMISSION_FACTORS[device.type] * 30;
        }
    }

    function updateEmissions() {
        const breakdownDiv = document.getElementById('emissions-breakdown');
        breakdownDiv.innerHTML = '';
        
        let totalEmissions = 0;
        
        devices.forEach(device => {
            const emissions = calculateDeviceEmissions(device);
            totalEmissions += emissions;
            
            const capitalizedType = device.type.charAt(0).toUpperCase() + device.type.slice(1);
            const p = document.createElement('p');
            p.innerHTML = `
                <span>${capitalizedType}</span>
                <span>${emissions.toFixed(2)} kg CO2/bulan</span>
            `;
            breakdownDiv.appendChild(p);
        });

        document.getElementById('total').textContent = `${totalEmissions.toFixed(2)} kg CO2/bulan`;
    }
});