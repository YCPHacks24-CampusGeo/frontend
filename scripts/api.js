const apiURL = 'https://api.ycp.campusgeo.com'

async function ApiRequest(controller, action, method, body = null) {
    let response = null;
    try {
        let request = {
            method: method,
            credentials: 'include'
        }

        if (body != null) {
            request.body = JSON.stringify(body);
            request.headers = {
                'Content-Type': 'application/json',
            };
            //Remove the following line of code
            //request.credentials = 'include';
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

//This does not promise that every request possesses the cookies in the