const apiURL = 'https://api.ycp.campusgeo.com'

async function ApiRequest(controller, action, method, body = null) {
    let response = null;
    try {
        var request = {
            method: method,
        }

        if (body != null) {
            request.body = JSON.stringify(body);
            request.headers = {
                'Content-Type': 'application/json',
            };
            request.credentials = 'include';
        }

        response = await fetch(apiURL + '/' + controller + '/' + action, request);

        if (response.ok) {
            console.log(method + ' successful!');
        } else {
            console.log(method + ' failed.');
        }
    } catch (error) {
        console.error('Error:', error);
        console.log('An error occurred.');
    }

    return response;
}