import React, { useEffect, useRef } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "jquery/dist/jquery";
//import DataTable from 'datatables.net-dt';

import $ from 'jquery';
import 'datatables/media/css/jquery.dataTables.min.css';
import 'datatables.net-buttons/js/dataTables.buttons.min.js';
import 'datatables.net-buttons/js/buttons.html5.min.js';
import 'datatables.net-buttons/js/buttons.print.min.js';

import { formatData } from './dataHandler';

export function DatatableUserQuery({ accessToken }) {
    const tableRef = useRef(null);

    useEffect(() => {

        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
        };
        console.log('desde datatables', accessToken);
        fetch('http://localhost:8000/authenticated/user_query/', requestOptions)
            .then(response => response.json())
            .then(data => {
                const Dataquery = data.query;
                var arrayTabCol = formatData(Dataquery);
                var tableData = arrayTabCol[0];
                var defColumns = arrayTabCol[1];
                // Crear la tabla DataTable
                const table = $(tableRef.current).DataTable({
                    dom: 'Blfrtip',
                    buttons: ['copy', 'csv', 'excel', 'pdf', 'print'],
                    data: tableData,
                    columns: defColumns,
                    //searching: true
                });

                table.columns().every(function () {
                    const column = this;
                    const columnIndex = column.index();
                    const columnHeader = $(tableRef.current).find('thead th').eq(columnIndex);

                    $('<input type="text" placeholder="Search"/>')
                        .appendTo($(columnHeader))
                        .on('keyup change', function () {
                            column.search(this.value).draw();
                        });
                    return true;
                });
                // Destruir DataTables al desmontar el componente
                return () => {
                    table.destroy();
                };
            });


    }, [accessToken]);

    return (
        <>
            <table ref={tableRef}></table>
        </>
    );
}
