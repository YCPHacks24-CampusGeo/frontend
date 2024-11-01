var uploadObject = null;

async function loadMap(input) {
    var map = L.map('map').setView([39.946952, -76.727429], 18);
    var base64Img = await readURL(input)
    console.log(base64Img);

    L.tileLayer('https://map.ycp.campusgeo.com/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 20,
        minZoom: 14
    }).addTo(map);

    var clickedLatLng;
    var currentMarker = null;

    map.on('click', function (e) {
        if (currentMarker) {
            map.removeLayer(currentMarker);
        }

        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        currentMarker = L.marker([lat, lng]).addTo(map)
        clickedLatLng = e.latlng;
        console.log("Clicked coordinates: " + clickedLatLng.lat + ", " + clickedLatLng.lng);
    });

    document.getElementById('submit').addEventListener('click', async function () {
        if (clickedLatLng) {
            uploadObject = {
                location: {
                    Latitude: clickedLatLng.lat,
                    Longitude: clickedLatLng.lng
                },
                base64JPG: base64Img
            }

            await ApiRequest('locationupload', 'uploadlocation', 'POST', uploadObject);

        } else {
            console.log("No coordinates clicked yet.");
        }
    });
}

async function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        var base64 = await getBase64(input.files[0]);

        reader.onload = function (e) {
            const file = input.files[0];
            if (file) {
                const url = URL.createObjectURL(file);
                base64 = e.target.result;
                pannellum.viewer('panorama', {
                    "type": "equirectangular",
                    "panorama": url,
                    "autoLoad": true
                });
            }
        };
        reader.readAsDataURL(input.files[0]);
    }
    return base64;
}

async function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

document.getElementById('uploadForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData();
    const photo = document.getElementById('photo').files[0];
    const text = document.getElementById('text').value;

    formData.append('photo', photo);
    formData.append('text', text);

    try {
        const response = await fetch('YOUR_API_ENDPOINT', {
            method: 'POST',
            body: formData,
        });
        if (response.ok) {
            alert('Upload successful!');
        } else {
            alert('Upload failed.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred.');
    }
});
