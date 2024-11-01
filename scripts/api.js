const apiURL = 'https://api.ycp.campusgeo.com'

async function ApiRequest(controller, action, method, body = null) {
    try {
        var request = {
            method: method,
        }

        if (body != null) {
            request.body = JSON.stringify(body);
            request.headers = {
                'Content-Type': 'application/json',
            };
        }

        const response = await fetch(apiURL + '/' + controller + '/' + action, request);

        if (response.ok) {
            console.log(method + ' successful!');
            alert(method + ' successful!');
            return response.status;
        } else {
            console.log(method + ' failed.');
            alert(method + ' failed!');
            return response.status;
        }
    } catch (error) {
        console.error('Error:', error);
        console.log('An error occurred.');
        alert(method + ' error!');
    }

    return -1;
}