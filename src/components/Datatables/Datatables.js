import React, { useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Datatable from 'react-data-table-component';


//import { jQquery } from "jquery/dist/jquery";
import $ from 'jquery/dist/jquery';

//import 'datatables/media/css/jquery.dataTables.css';

//import 'bootstrap/dist/js/bootstrap.min.js';
//import 'bootstrap/dist/css/bootstrap.min.css';

//import { DataTable } from 'datatables/media/js/jquery.dataTables.js';


//import 'datatables.net-buttons/js/dataTables.buttons.js';
//import 'datatables.net-buttons/js/buttons.html5.js';

//import 'datatables.net-buttons/js/buttons.print.js';

import { formatData, fetchData } from './dataHandler'; // Importamos fetchData


const hoursToMiliseconds = (hours) => {
    return hours * 60 * 60 * 1000; // Horas a milisegundos
};


export function DatatableUserQuery({ accessToken, useQuery }) {
    const [defColumns, setDefColumns] = useState([]);
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        const fetchDataAndFormat = async () => {
            try {
                const dataQuery = await fetchData(accessToken);
                const arrayTabCol = formatData(dataQuery);

                setTableData(arrayTabCol[0]);
                setDefColumns(arrayTabCol[1]);
            } catch (error) {
                console.error('Error al procesar los datos:', error);
            }
        };

        fetchDataAndFormat();
    }, [accessToken]);

    return (
        <div className="container  mt-3">
            <Datatable
                columns={defColumns}
                data={tableData}
                pagination
                fixedHeader
            />
        </div>
    );
}
/*<>
    <table ref={tableRef}></table>

    <script src="https://cdn.datatables.net/2.0.3/js/dataTables.min.js"></script>
</>*/