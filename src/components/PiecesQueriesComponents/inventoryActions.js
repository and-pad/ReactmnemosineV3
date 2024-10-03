import { useParams, useNavigate, Outlet } from 'react-router-dom';
import { createContext, useContext } from 'react';

const DataContext = createContext();


export const InventoryEdit =({accessToken, refreshToken }) => {

    const { _id } = useParams();
    const navigate = useNavigate();

    return (
        <DataContext.Provider value={'Edit for now'}>
        {_id}
        <div>***********************-------------------*********************</div>
        <Outlet />
        </DataContext.Provider>
    )


}

export const useData = () => useContext(DataContext);