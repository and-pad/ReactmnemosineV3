const research_keys = ['title', 'keywords', 'technique', 'materials', 'acquisition_form', 'acquisition_source', 'acquisition_date', 'firm_description', 'short_description', 'formal_description', 'observation', 'publications', 'card'];


function push_data(orderedData, column) {

    var data_c = [];

    data_c.push(orderedData);
    data_c.push(column);
    return data_c;
}

function push_array_data(orderedData, column) {
    var data_c = [];

    //console.log(orderedData['title']);
    var column_c;
    //console.log(column);
    if (column === 'research_info') {

        for (var i = 0; i < research_keys.length; i++) {
            column_c = research_keys[i];
            data_c.push(push_data(orderedData[column_c], research_keys[i]));
        }

        return data_c;
    }

    else if (column === 'location_info') {
        column_c = 'name';
    }
    else if (column === 'authors_info') {

        if (orderedData && orderedData.length > 0 && 'title' in orderedData[0]) {

            data_c.push(orderedData[0]['title']);
        }
    }

    else if (column === 'involved_creation_info') {

        if (orderedData && orderedData.length > 0 && 'title' in orderedData[0]) {
            data_c.push(orderedData[0]['title']);
        }

    }
    else if (column === 'period_info') {

        if (orderedData && orderedData.length > 0 && 'title' in orderedData[0]) {
            data_c.push(orderedData[0]['title']);
        }
    }

    else {
        column_c = 'title';
    }

    data_c.push(orderedData[column_c]);
    data_c.push(column);
    // console.log("este es el que si jala: ", data_c);
    return data_c;
    // console.log(column);


}


function structData(orderedData = null, column = null) {
    switch (column) {
        case 'inventory_number':
        case 'catalog_number':
        case 'origin_number':
        case 'tags':
        case 'description_origin':
        case 'description_inventory':
        case 'measure_with':
        case 'measure_without':

            return orderedData ? push_data(orderedData, column) : []; // Devuelve el resultado de push_data solo si orderedData no es nulo

        case 'genders_info':
        case 'subgenders_info':
        case 'type_object_info':
        case 'dominant_material_info':
        case 'location_info':
        case 'research_info':
        case 'authors_info':
        case 'involved_creation_info':
        case 'period_info':

            //console.log(orderedData);
            return orderedData ? push_array_data(orderedData, column) : [];





        default:
            return [];
    }
}

export function formatData(Dataquery) {

    var StructuredData = [];
    var StructuredColumns = [];
    //  var stColumn = [];


    const order_columns = ["inventory_number", "catalog_number", "origin_number", "genders_info", "subgenders_info", "type_object_info", "dominant_material_info", "location_info", "tags", "description_origin", "description_inventory", /*"set_info",*/ "research_info", "authors_info", "involved_creation_info", "period_info", "measure_with", "measure_without", "photo"];
    //const orderedData = {};


    const orderedData = {};
    const orderedDataArray = Dataquery.map(item => {
        var data_column = {};
        order_columns.forEach(column => {
            if (column === 'measure_with') {

                var measure_w = item['height_with_base'] + ' X ' + item['width_with_base'] + ' X ' + item['depth_with_base'] + ' ø' + item['diameter_with_base'];
                orderedData[column] = measure_w;
                data_column[column] = structData(orderedData[column], column);
                // console.log(measure_w);

                StructuredColumns.push(column);

            }

            else if (column === 'measure_without') {

                var measure_wo = item['height'] + ' X ' + item['width'] + ' X ' + item['depth'] + ' ø ' + item['diameter'];
                orderedData[column] = measure_wo;
                data_column[column] = structData(orderedData[column], column);

                StructuredColumns.push(column);


            }

            else if (column in item) {



                orderedData[column] = item[column];
                data_column[column] = structData(orderedData[column], column);
                if (data_column['research_info']) {
                    data_column[column].forEach(item => {
                        data_column[item[1]] = []
                        data_column[item[1]].push(item[0]);
                        data_column[item[1]].push(item[1]);

                    });
                    // console.log("dataaaa", data_column);
                    if (data_column.hasOwnProperty(column)) {
                        // Elimina la propiedad del objeto
                        delete data_column[column];
                    }

                }

                // Agregar la columna solo si no está presente
                if (column === 'research_info') {
                    research_keys.forEach(item => {

                        StructuredColumns.push(item);
                    });
                }

                else {
                    StructuredColumns.push(column);
                }
            }
            else {
                orderedData[column] = null;
            }
        });
        return data_column;
    });

    orderedDataArray.forEach(data_column => {
        const rowData = {};
        for (const key in data_column) {
            if (data_column[key].length > 0) {
                // Tomar el primer elemento del array como el valor real
                rowData[key] = data_column[key][0];
            }
        }
        StructuredData.push(rowData); // Agregar la fila completa a StructuredData
    });


    // Definir las columnas de la tabla
    const defColumns = [...new Set(StructuredColumns)].map(column => ({
        title: column,
        searchable: true
    }));

    // Mapear los datos para crear un array de arrays para la tabla
    //console.log(StructuredData);
    const tableData = StructuredData.map(item => {
        return defColumns.map(column => item[column.title] || ''); // Usar el título de la columna como clave
    });
    var TabCol = [];
    TabCol.push(tableData);
    TabCol.push(defColumns);
    return TabCol;

}