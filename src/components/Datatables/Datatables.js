import React, { useEffect, useRef } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "jquery/dist/jquery";
import $ from 'jquery';
import 'datatables/media/css/jquery.dataTables.min.css';
import 'datatables.net-buttons/js/dataTables.buttons.min.js';
import 'datatables.net-buttons/js/buttons.html5.min.js';
import 'datatables.net-buttons/js/buttons.print.min.js';
import { formatData } from './dataHandler';

export function DatatableUserQuery({ accessToken }) {
    const tableRef = useRef(null);
    const dataTableRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            };

            const response = await fetch('http://localhost:8000/authenticated/user_query/', requestOptions);
            const data = await response.json();
            const Dataquery = data.query;
            const arrayTabCol = formatData(Dataquery);
            const tableData = arrayTabCol[0];
            const defColumns = arrayTabCol[1];
            var table;
            if (!dataTableRef.current) {
                table = $(tableRef.current).DataTable({
                    dom: 'Blfrtip',
                    buttons: ['copy', 'csv', 'excel', 'pdf', 'print'],
                    data: tableData,
                    columns: defColumns,
                });

                dataTableRef.current = table;
            } else {
                dataTableRef.current.clear();
                dataTableRef.current.rows.add(tableData);
                dataTableRef.current.columns.adjust().draw();
            }

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
        };

        fetchData();

        return () => {
            if (dataTableRef.current) {
                dataTableRef.current.destroy();
                dataTableRef.current = null;
            }
        };
    }, [accessToken]);

    return (
        <>
            <table ref={tableRef}></table>
        </>
    );
}
