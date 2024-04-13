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
    // console.log(data_c);
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

    const order_columns = ["inventory_number", "catalog_number", "origin_number", "genders_info", "subgenders_info", "type_object_info", "dominant_material_info", "location_info", "tags", "description_origin", "description_inventory", "research_info", "authors_info", "involved_creation_info", "period_info", "measure_with", "measure_without"];

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
                if (column === 'description_inventory') {

                }
                data_column[column] = structData(orderedData[column], column);

                if (data_column['research_info']) {
                    data_column[column].forEach(item => {
                        data_column[item[1]] = []
                        data_column[item[1]].push(item[0]);
                        data_column[item[1]].push(item[1]);

                    });

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
        //aqui es donde se puede modificar la estructuctura de datos
        name: column,
        selector: row => row[column],
        sortable: true,
    }));

    // Mapear los datos para crear un array de arrays para la tabla

    const tableData = StructuredData/*.map(item => {
        return defColumns.map(column => item[column.name] || ''); // Usar el título de la columna como clave
    });*/


    var TabCol = [];
    //console.log('StructuredData', StructuredData);
    //console.log('tableData', tableData);
    TabCol.push(tableData);
    TabCol.push(defColumns);
    return TabCol;

}
/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/*******************************************Cache*Data*Handle*******************************************************************/

const dataBaseName = 'MnemosineV3';//Base de datos en cache
const storageName = 'Queries';// Esta seria como una tabla en una base de datos
const dataName = 'QueryData';//Y estos nombres de campos en la table
const queryDateName = 'QueryDate';//junto con este
export const saveToCache = (dataQuery) => {
    return new Promise((resolve, reject) => {//se crea una promesa ya que es algo externo, en este caso un indexedDB, el navegador lo maneja
        const request = indexedDB.open(dataBaseName, 1);//Abrimos la base de datos con el nombre dado 
        //declaramos las variables para la transaccion de lectura y escritura en la cache
        let db;
        let transaction;
        let store;
        //Esta funcion se desencadena cuando se necesita que se actualice en nuestro caso solo se lanza
        //cuando esta se crea.
        request.onupgradeneeded = function (event) {
            db = event.target.result;
            //En caso de que no exista la tabla en la base de datos la crea
            if (!db.objectStoreNames.contains(storageName)) {
                //aqui es donde crea la tabla "storageName"
                store = db.createObjectStore(storageName);
                console.log('Almacén de objetos Queries creado:', store.name);
            } else {
                //En caso de que ya exista entonces se la asignamos a store justo como arriba solo 
                //que en vez de crearla la leemos.
                store = event.target.transaction.objectStore(storageName);
                console.log('El almacén de objetos Queries ya existe.', store);
            }
        };

        request.onsuccess = function (event) {
            db = event.target.result;
            transaction = db.transaction([storageName], 'readwrite');
            store = transaction.objectStore(storageName);
            const putRequest = store.put(JSON.stringify(dataQuery), dataName);
            store.put(new Date().getTime() + 1 * 60 * 60 * 1000, queryDateName);
            putRequest.onsuccess = function () {
                db.close(); // Cerrar la base de datos después de completar la operación
                resolve('query saved');
            };
            putRequest.onerror = function () {
                db.close(); // Cerrar la base de datos después de completar la operación
                reject('query not saved');
            };
        };

        request.onerror = function (event) {
            console.error('Error al abrir la base de datos:', event.target.error);
            reject('error opening database');
        };
    });
};

export const getFromCache = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dataBaseName, 1);
        let db;
        let store;
        //Esta parte de la funcion es igual a saveToCache, solo que realmente se ejecuta aqui
        //cuando hacemos la primera busqueda en la logica se genera la base en cuanto le damos open
        //y entonces se lanza el evento onupgradeneeded, si no lo llenamos aqui, despues ya no se le puede agregar
        //entonces aqui le ponemos el nombre, y en save solo lo recuperamos, esta funcion nunca se ejecuta en saveTo Cache
        request.onupgradeneeded = function (event) {
            db = event.target.result;
            if (!db.objectStoreNames.contains(storageName)) {
                store = db.createObjectStore(storageName);
                console.log('Almacén de objetos Queries creado:', store.name);
            } else {
                store = event.target.transaction.objectStore(storageName);
                console.log('El almacén de objetos Queries ya existe.', store);
            }
        };

        request.onsuccess = function (event) {
            const db = event.target.result;
            let store;

            try {
                //si ya existen los datos entonces estas instrucciones se ejecutan
                //y le asignamos lectura y escritura a la base de datos
                const transaction = db.transaction([storageName], 'readwrite');
                //obtenemos la tabla
                store = transaction.objectStore(storageName);
                //Obtenemos aqui los datos guardados
                const getRequest = store.get(dataName);
                //si tuvo exito al acceder a los datos abre una funcion sobre el evento
                getRequest.onsuccess = function (event) {
                    const data = event.target.result;//obtiene en data el resultado del evento get
                    if (data) {//si hay data                        
                        const expirationDateRequest = store.get(queryDateName);//obtenemos el campo de fecha de expiracion
                        expirationDateRequest.onsuccess = function (event) {//si obtiene el campo de fecha
                            const expirationDate = event.target.result;//toma el campo
                            const currentDate = Date.now();//toma la fecha actual
                            if (expirationDate && expirationDate < currentDate) {//y compara la fecha de expiracion, con la fecha actual
                                //Si la fecha ya expiro borramos datos de la cache
                                store.delete(dataName);
                                store.delete(queryDateName);
                                console.log('Los datos han expirado y han sido eliminados.');
                                db.close(); // Cerrar la base de datos después de completar la operación
                                reject('data expired');//regresamos mensaje que expiró la base de datos
                            } else {
                                //                      console.log('Datos recuperados de IndexedDB:', JSON.parse(data));
                                db.close(); // Cerrar la base de datos después de completar la operación                                
                                resolve(data);//regresamos la base de datos obtenida despues de ver que aun esta vigente
                            }
                        };
                    } else {
                        //Si llegamos aqui es porque no existe aun la base de datos en el naveador
                        db.close(); // Cerrar la base de datos después de completar la operación
                        reject('no data');//regresamos el texto de la inexistencia de datos
                    }
                };
            } catch (error) {
                //En caso de cualquier error al intetar abrir el almacen de datos.
                console.log('No se pudo abrir el almacén de objetos.');
                reject('error opening object store');
            }
        };

        request.onerror = function (event) {
            //En caso de error al abrir el request manejamos el error
            console.error('Error al abrir la base de datos:', event.target.error);
            reject('error opening database');
        };
    });
};


const getDataFromCache = async () => {
    try {
        const data = await getFromCache();
        return JSON.parse(data); // Convertimos los datos a JSON
    } catch (error) {
        console.error('Error al obtener datos de la caché:', error);
        throw error; // Relanzamos el error para que se maneje en un nivel superior
    }
};

const fetchAndCacheData = async (accessToken) => {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
    };

    const response = await fetch('http://localhost:8000/authenticated/user_query/', requestOptions);
    const data = await response.json();
    const queryData = data.query;

    try {
        await saveToCache(queryData); // Guardamos los datos en la caché
        return queryData; // Devolvemos los datos obtenidos
    } catch (error) {
        console.error('Error al guardar datos en la caché:', error);
        throw error; // Relanzamos el error para que se maneje en un nivel superior
    }
};

export const fetchData = async (accessToken) => {
    try {
        const cachedData = await getDataFromCache();
        console.log('Datos recuperados de la caché:');
        return cachedData;
    } catch (error) {
        console.log('No hay datos almacenados en la caché. Obteniendo datos del servidor...');
        const freshData = await fetchAndCacheData(accessToken);
        console.log('Datos obtenidos del servidor y guardados en la caché:', freshData);
        return freshData;
    }
};