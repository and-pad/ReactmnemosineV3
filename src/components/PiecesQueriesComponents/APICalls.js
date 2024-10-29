
import SETTINGS from "../Config/settings";

export const API_RequestInventoryEdit = async ({ accessToken, refreshToken, _id ,changes }) => {
    console.log(accessToken);
    console.log(refreshToken,"refresh")
    const url = SETTINGS.URL_ADDRESS.server_api_commands + `authenticated/inventory_query/edit/${_id}/`;
    console.log("nose que", changes);
    try {

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                //aqui es donde enviamos el token mismo que es tomado al hacer la peticion
                //por eso en este caso el body va vacío.
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ changes }),
        });
        if(response.ok){
            const data = await response.json();
            console.log('data response from save',data);
            return data;

        }

        return true;
    } catch {
        return false;
    }

}