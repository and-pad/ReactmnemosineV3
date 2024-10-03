//import { Navigate } from 'react-router-dom';
import { DatatableUserInventory, DatatableUserQuery } from '../Datatables/Datatables';//Componente Datatable de Consultas


export function PiecesQueries({ accessToken, refreshToken, handleDetailClick, module }) {

    if (module === "Query") {
        return (
            <>
                <div className="PiecesQueries-container">
                    <DatatableUserQuery accessToken={accessToken} refreshToken={refreshToken} onDetailClick={handleDetailClick}  />
                </div>
            </>
        );
    }
    else if (module === "Inventory") {
        return (
            <>
                <div className="PiecesQueries-container">
                    <DatatableUserInventory accessToken={accessToken} refreshToken={refreshToken} onDetailClick={handleDetailClick}  />
                </div>
            </>
        );
    }
    return null;
}