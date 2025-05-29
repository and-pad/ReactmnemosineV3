import { useParams,  Outlet } from 'react-router-dom';
import { createContext, useContext,useState ,useEffect} from 'react';

import { fetchInventoryEdit } from './APICalls';
const DataContext = createContext();


const HasntPermission = () => {
    return (
        <div>
            <h1> No tienes permiso para editar</h1>
        </div>
    )
}

export const InventoryEdit = ({ accessToken, refreshToken, permissions }) => {

    const { _id } = useParams();
    //const navigate = useNavigate();
    const [Data, setData] = useState();
    const [Documents, setDocuments] = useState();
    const [hasPermission, setHasPermission] = useState(true);
    useEffect(()=>{
        
    if( permissions.includes("editar_inventario")){
    
        fetchInventoryEdit(accessToken,refreshToken, _id)
    .then(data =>{
        //console.log(data,"datarecien")
        setData(data); 
        setDocuments(data["documents"]);
        setHasPermission(true);
    })
    .catch(error =>{
        console.error("Error inesperado", error);
    });
    } else {
        setHasPermission(false);
    }




    },[_id, accessToken, refreshToken]);    
    
    return (
        <DataContext.Provider value={Data}>
            
            <br/>
            {Documents?.map((document)=>{
                return document.file_name;
            })}
           {hasPermission ? (<Outlet />) : <HasntPermission />}
            
            
        </DataContext.Provider>
    )
}

export const useData = () => useContext(DataContext);