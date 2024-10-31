function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            const file = input.files[0];
            if (file) {
                const url = URL.createObjectURL(file);
                pannellum.viewer('panorama', {
                    "type": "equirectangular",
                    "panorama": url,
                    "autoLoad": true
                });
            }
        };
        reader.readAsDataURL(input.files[0]);
    }
}