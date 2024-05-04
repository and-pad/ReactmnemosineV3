import { Routes, Route } from 'react-router-dom';
import { DatatableUserQuery } from '../Datatables/Datatables';//Componente Datatable de Consultas
import { PieceDetail } from './PieceDetail'


export function PiecesQueries({ accessToken }) {

    return (
        <>
            <div className="PiecesQueries-container">
                <DatatableUserQuery accessToken={accessToken} />
            </div>
            <Routes>
                {/* Ruta para la página /inicio/piece */}
                <Route path='/detail' element={<PieceDetail />} />
                {/* Otras rutas dentro de la página de inicio */}
            </Routes>

        </>


    );

}