
import SETTINGS from "../Config/settings";

export const API_RequestInventoryEdit = async ({ accessToken, refreshToken, _id, changes, changes_pics_inputs, changedPics }) => {

    const url = SETTINGS.URL_ADDRESS.server_api_commands + `authenticated/inventory_query/edit/${_id}/`;
    console.log("in api call");
    try {
        const formData = new FormData();
        // Agregar datos JSON
        formData.append('changes', JSON.stringify(changes || {}));
        formData.append('changes_pics_inputs', JSON.stringify(changes_pics_inputs || {}));
        // Agregar datos y archivos separados
        // Asegurarse de que changed_pics no sea null/undefined
        const files = {};
        console.log("fuera",changedPics);
        if (changedPics && Object.keys(changedPics).length > 0) {
            console.log("dentro");
            for (const [key, { _id, file }] of Object.entries(changedPics)) {
                formData.append(`files[${key}]`, file); // Archivos
                files[key] = { _id }; // Metadatos
            }
            console.log(files);
            formData.append('changed_pics', JSON.stringify(files));
        }
        // Enviar solo los metadatos como JSON
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                //aqui es donde enviamos el token mismo que es tomado al hacer la peticion
                //por eso en este caso el body va vacío.
                'Authorization': `Bearer ${accessToken}`,
            },
            body: formData,
        });
        if (response.ok) {
            const data = await response.json();

            return data;
        }
        return true;
    } catch (e) {

        console.log("in api call catch");
        console.error(e);

        return false;
    }

}

//tengo que ponerle al boton esta funcion para llamar a la api
export const API_SendApprovralDecision = async ({ accessToken, refreshToken, ID, isApproved }) => {
    console.log("ID", ID);
    console.log("accedd", accessToken);
    const url = SETTINGS.URL_ADDRESS.server_api_commands + `authenticated/inventory_query/edit/${ID}/`;
    try {

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                //aqui es donde enviamos el token mismo que es tomado al hacer la peticion
                //por eso en este caso el body va vacío.
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ isApproved: isApproved }),
        });

        if (response.ok) {
            const data = await response.json();
            //console.log('data response from save',data);
            return response;

        } else {
            const data = await response.json();
            console.log("error", data);
            return { "error": response }
        }
    } catch {


    }


}