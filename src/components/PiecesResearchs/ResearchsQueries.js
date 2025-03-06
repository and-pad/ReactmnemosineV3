import React from 'react';
import { DatatableUserResearch } from '../Datatables/DatatablesResearch';//Componente Datatable de Consultas


export  function ResearchsQueries({ accessToken, refreshToken }) {

    
    return (       
            <>
                <div className="PiecesResearchs-container">
                    <DatatableUserResearch accessToken={accessToken} refreshToken={refreshToken}   />
                </div>
            </>        
    )
}

