import { Navigate } from 'react-router-dom';
import { DatatableUserQuery } from '../Datatables/Datatables';//Componente Datatable de Consultas


export function PiecesQueries({ accessToken, handleDetailClick }) {



    return (
        <>
            <div className="PiecesQueries-container">
                <DatatableUserQuery accessToken={accessToken} onDetailClick={handleDetailClick} />
            </div>


        </>


    );

}