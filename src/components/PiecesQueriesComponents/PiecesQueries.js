//import { Navigate } from 'react-router-dom';
import { DatatableUserQuery } from '../Datatables/Datatables';//Componente Datatable de Consultas


export function PiecesQueries({ accessToken, refreshToken, handleDetailClick }) {    

    return (
        <>
            <div className="PiecesQueries-container">
                <DatatableUserQuery accessToken={accessToken} refreshToken={refreshToken} onDetailClick={handleDetailClick} />
            </div>
        </>


    );

}