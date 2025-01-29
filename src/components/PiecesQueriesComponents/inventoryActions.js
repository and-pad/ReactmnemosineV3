import { useParams, useNavigate, Outlet } from 'react-router-dom';
import { createContext, useContext,useState ,useEffect} from 'react';
import SETTINGS from '../Config/settings';

const DataContext = createContext();


const accessTfetch = async (accessToken, _id) => {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
    };
    const url = SETTINGS.URL_ADDRESS.server_api_commands + `authenticated/inventory_query/edit/${_id}/`;
    const response = await fetch(url, requestOptions)
    return response;

};

const fetchInventoryEdit = async ( accessToken, refreshToken, _id ) => {
    
    const response = await accessTfetch(accessToken, _id);

    var data;
    if (response.ok) {
        data = await response.json();
        //console.log(data[appraisal],"Datatattatat");
        return data;
    } else {
        const errorData = await response.json();
        if (errorData.code === "token_not_valid") {
            try {

                //En esta url de api es para refrescar el accessToken con el refreshToken
                const url = SETTINGS.URL_ADDRESS.server_api_commands + 'auth/signin/';
                const response2 = await fetch(url, {
                    method: 'PUT',//En el metodo PUT es donde renovamos el accessToken
                    headers: {
                        'Content-Type': 'application/json',
                        /* 'Authorization': `Bearer ${accessToken}`,*/

                    },
                    body: JSON.stringify({ 'refresh': refreshToken }),//ponemos el RefreshToken en el body para que intente hacer la renovacion                        
                });
                //console.log({ refresh: refreshToken });
                if (response2.ok) {
                    //Esperamos a que nos de respuesta y lo convertimos en un objeto json.
                    //viene un json con un elemento llamado "access" que es el nuevo accessToken con tiempo renovado
                    
                }
                

            } catch {

            }
        } else {
            return 'error: impossible to comunicate to server';
        }
    }
}

export const InventoryEdit = ({ accessToken, refreshToken }) => {

    const { _id } = useParams();
    //const navigate = useNavigate();
    const [Data, setData] = useState();
    const [Documents, setDocuments] = useState();
    useEffect(()=>{

        fetchInventoryEdit(accessToken,refreshToken, _id)
    .then(data =>{
        //console.log(data,"datarecien")
        setData(data); 
        setDocuments(data["documents"]);
    })
    .catch(error =>{
        console.error("Error inesperado", error);
    });

    },[_id, accessToken, refreshToken]);    
    
    return (
        <DataContext.Provider value={Data}>
            
            <br/>
            {Documents?.map((document)=>{
                return document.file_name;
            })}
           
            <Outlet />
        </DataContext.Provider>
    )
}

export const useData = () => useContext(DataContext);