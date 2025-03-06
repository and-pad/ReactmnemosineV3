import React, { useEffect, useState, useMemo, useRef } from 'react';
import Datatable from 'react-data-table-component';
//import GoogleFontLoader from 'react-google-font-loader';
import { formatData, fetchData, ConstructElementsToHide } from './dataHandler'; // Importamos fetchData
import customStyles from './datatableCustomCellStyle';
import '../Datatables/datatable.css';
import { SearchBox, SelectColumn, filterSearch } from './FilterComponents/Filter';
import { getTranslations } from '../Languages/i18n';
//import { createTheme } from 'react-data-table-component'
import Box from '@mui/material/Box'; // Para el contenedor estilizado
import Typography from '@mui/material/Typography'; // Para el texto
import { Button } from '@mui/material'; // Botón de Material UI
import CircularProgress from '@mui/material/CircularProgress';
import InventoryTwoToneIcon from '@mui/icons-material/InventoryTwoTone';
import {ExpandableComponent} from './DatatableComponents/datatableComponents';

const langData = getTranslations();

export  function CircularIndeterminate() {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%', // Abarca todo el ancho
                height: '30vh', // Abarca toda la altura de la pantalla
                //backgroundColor: '#f0f0f0', // Fondo gris claro
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column', // Apilamos el CircularProgress y el texto
                    alignItems: 'center', // Centramos horizontalmente
                    justifyContent: 'center', // Centramos verticalmente dentro del cuadro
                    backgroundColor: '#ffffff', // Fondo blanco del cuadro
                    padding: '2rem', // Espaciado interno generoso
                    borderRadius: '12px', // Bordes redondeados
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Sombra suave
                    minWidth: '200px', // Ancho mínimo para el cuadro
                }}
            >
                <CircularProgress color="primary" size="5rem" />
                <Box
                    sx={{
                        marginTop: '1rem', // Espacio entre el ícono y el texto
                        color: '#333', // Color oscuro para contraste
                        fontSize: '1.2rem', // Tamaño del texto
                        fontWeight: '500', // Peso de fuente para mayor legibilidad
                        textAlign: 'center', // Asegura que el texto esté centrado
                    }}
                >
                    Cargando...
                </Box>
            </Box>
        </Box>
    );
}



//columnas del datatables
//const columns = ["inventory_number", "catalog_number", "origin_number", "genders_info", "subgenders_info", "type_object_info", "dominant_material_info", "location_info", "tags", "description_origin", "description_inventory", "authors_info", "involved_creation_info", "period_info", "research_info", "measure_without", "measure_with", 'title', 'keywords', 'technique', 'materials', 'acquisition_form', 'acquisition_source', 'acquisition_date', 'firm_description', 'short_description', 'formal_description', 'observation', 'publications', 'card', 'photo_thumb_info', '_id'];
// Define el componente personalizado para la fila expandida

//var arrayTabColOut;
/********************************************************************************************************************/
/********************************************************************************************************************/
/********************************************************************************************************************/
/********************************************************************************************************************/
/********************************************************************************************************************/
/********************************************************************************************************************/
export function DatatableUserQuery({ accessToken, refreshToken, onDetailClick }) {
    const [defColumns, setDefColumns] = useState([]);
    const [tableData, setTableData] = useState([]);

    const [filteredTableData, setFilteredTableData] = useState([]);

    const [defColumnsOut, setDefColumnsOut] = useState([]);
    const [size, setSize] = useState(null);
    const [dataQuery, setDataQuery] = useState([]);
    const [checkboxValues, setCheckboxValues] = useState([]);
    const [filterText, setFilterText] = useState('');

    const [rm_accents, setRmAccents] = useState(false);
    const [upper_lower, setUpperLower] = useState(false);
    const [wordComplete, setWordComplete] = useState(false);

    const [checkboxSearchValues, setCheckboxSearchValues] = useState('');
    const [disableChecks, setdisbleChecks] = useState(true);
    const [theme, setTheme] = useState('custom-dark'); // Estado para el tema
    const [pending, setPending] = useState(true);


    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'custom-light' ? 'custom-dark' : 'custom-light'));
    };


    //var size;
    /***************************************************************************** */
    const timerIdRef = useRef();
    useEffect(() => {

        const handleResize = () => {
            const width = window.innerWidth;
            let newSize = size;


            if (width >= 1463 && width < 2000) {
                newSize = 11;
            } else if (width >= 1249 && width < 1463) {
                newSize = 9;
            } else if (width >= 1040 && width < 1249) {
                newSize = 7;
            } else if (width >= 800 && width < 1040) {
                newSize = 6;
            }
            else if (width >= 600 && width < 800) {
                newSize = 5;
            }
            else if (width >= 550 && width < 600) {
                newSize = 4;
            }
            else if (width >= 300 && width < 550) {
                newSize = 3;
            }
            if (newSize !== size || size == null) {
                clearTimeout(timerIdRef.current);
                timerIdRef.current = setTimeout(() => {
                    setSize(newSize);
                }, 2);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            clearTimeout(timerIdRef.current);
            window.removeEventListener('resize', handleResize);
        };
    }, [size, timerIdRef]);

    // var prop ;
    const [hasFetched, setHasFetched] = useState(false);


    useEffect(() => {
        const filtered = () => {
            return filterSearch(defColumns, tableData, filterText, rm_accents, upper_lower, wordComplete, checkboxSearchValues, disableChecks);

        };
        if (!hasFetched) {

            const fetchDataAndFormat = async () => {
                try {
                    let fetch;
                    let first;
                    if (dataQuery.length === 0) {
                        fetch = await fetchData(accessToken, refreshToken);
                        // console.log(fetch);

                        setDataQuery(fetch);
                        first = true;
                        setPending(false);
                    } else {
                        fetch = dataQuery;
                        first = false;
                        setPending(false);
                    }

                    let arrayTabColOut;
                    const module = 'Query'
                    if (first) {
                        arrayTabColOut = formatData(fetch, size, true, onDetailClick, module);
                        setFilteredTableData(arrayTabColOut[0]);

                    } else {
                        arrayTabColOut = formatData(dataQuery, size, false, onDetailClick, defColumns, tableData, module);
                    }
                    console.log('arrayTabColOut Table data', arrayTabColOut[0]);
                    // Guardar en estado local y actualizar referencias
                    setTableData(arrayTabColOut[0]);
                    console.log('arrayTabColOut Columns Names', arrayTabColOut[2]);
                    setDefColumnsOut(arrayTabColOut[2]);
                    // setArrayTabColOutState(arrayTabColOut); // Guardar en estado local

                    // Actualizar almacenamiento local si es necesario
                    const getdefColumn = localStorage.getItem('showColumns');
                    if (getdefColumn === null || getdefColumn === 'undefined') {
                        //console.log('null');
                        setDefColumns(arrayTabColOut[1]);
                        setDefColumnsOut(arrayTabColOut[2]);
                        localStorage.setItem('showColumns', JSON.stringify(arrayTabColOut[1]));
                    } else {
                        //    console.log('not null');
                        const savedColumns = JSON.parse(getdefColumn);
                        const tdefColumn = arrayTabColOut[1];
                        tdefColumn.forEach((column, index) => {
                            column.show = savedColumns[index].show;
                            if (!savedColumns[index].show) {
                                column.omit = true;
                            }
                        });
                        setDefColumns(tdefColumn);
                        const Cout = ConstructElementsToHide(tdefColumn, size);
                        setDefColumnsOut(Cout);
                    }

                } catch (error) {
                    console.error('Error al procesar los datos:', error);
                }
            };

            fetchDataAndFormat();

            setHasFetched(true);
        }
        setFilteredTableData(filtered());

        // Inicializar checkboxValues con valores predeterminados
        // aqui podemos hacer un guardado de localstorage para traer los datos locales
        // de que columnas se muestran
        const Values = {};
        //const initialValuesSearch = {};
        defColumns.forEach(element => {
            if (!element.show) {
                Values[element.id] = false;
                // initialValuesSearch[element.id] = false;
            } else {
                Values[element.id] = true;
                //initialValuesSearch[element.id] = false;
            }
        });
        setCheckboxValues(Values);
        // setCheckboxSearchValues(initialValuesSearch);
        //filtered();
        // Si cambian ciertas dependencias clave, reiniciar el estado
        return () => {
            setHasFetched(false);
        };
    }, [accessToken, refreshToken, size, setHasFetched, dataQuery, onDetailClick, checkboxSearchValues, disableChecks, filterText, rm_accents, upper_lower, wordComplete, setTableData, setDefColumns, /*setPending*/]);
    // Estado local para almacenar arrayTabColOut        
    // Puedes acceder a arrayTabColOutState donde lo necesites en el componente     

    /*****************************************************************************
     *****************************************************************************/
    const propsColumns = {
        defColumnsOut
    };
    /******************************************************************************** */
    // Función para manejar el cambio de las checkboses de seacrh
    //
    const handleSearchboxChange = (id) => {
        // console.log('id', id);
        setCheckboxSearchValues(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
        // console.log(checkboxSearchValues[id]);

    };

    const subHeaderComponentMemo = useMemo(() => {
        /******************************************************************************** */
        // Función para manejar el cambio en el orden de las columnas
        // Objeto para almacenar el nuevo orden
        var hideConstructor = [];
        const handleSelectColumnChange = (id) => {
            console.log('idS', id);
            setCheckboxValues(prevState => ({
                ...prevState,
                [id]: !prevState[id]
            }));
            // console.log(checkboxValues[id]);
            const index = defColumns.findIndex(column => column.id === id);
            var updatedColumns;
            if (index !== -1) {
                //console.log('dfCol', defColumns[index]);
                updatedColumns = [...defColumns];
                updatedColumns[index].show = !updatedColumns[index].show;
                if (updatedColumns[index].show === false) {
                    updatedColumns[index].omit = true;
                } else {
                    updatedColumns[index].omit = false;
                }
                //console.log('opdCol', updatedColumns[index]);
                updatedColumns.forEach(column => {

                    if (column.show) {
                        hideConstructor.push(column);
                    }
                });
                setDefColumns(updatedColumns);
                setDefColumnsOut([]);
                //esto es necesario para guardar el selector que es una funcion, como cadena        
                localStorage.setItem('showColumns', JSON.stringify(updatedColumns));
            }

            var out;

            if (hideConstructor.length >= size) {
                let quitElements = hideConstructor.length - size;
                quitElements = (quitElements + 1) * -1;
                // const dentro = hideConstructor.slice(0, size); // Elementos dentro del tamaño
                out = hideConstructor.slice(quitElements, -1); // Elementos que están fuera del tamaño

                out.forEach(element => {
                    const id = element.id;
                    const correspondingElement = updatedColumns.find(item => item.id === id);
                    if (correspondingElement) {
                        correspondingElement.omit = true;
                    }
                    setDefColumns(updatedColumns);
                    setDefColumnsOut(out);
                    localStorage.setItem('showColumns', JSON.stringify(updatedColumns));

                });
            }
        };

        return (
            <div className="container-fluid ">
                <div className="row justify-content-center">
                    <div className="col-6 mb-2 mt-2 text-start">
                        <SearchBox
                            placeholder={langData.dataTablesSearch.place_holder}
                            columns={defColumns}
                            onFilter={event => setFilterText(event.target.value)}
                            filterText={filterText}
                            checkboxSearchValues={checkboxSearchValues}
                            handleCheckboxChange={handleSearchboxChange}
                            setRmAccents={setRmAccents}
                            setUpperLower={setUpperLower}
                            disableChecks={disableChecks}
                            setdisbleChecks={setdisbleChecks}
                            setWordComplete={setWordComplete}
                        />
                    </div>
                    <div className="col-6 mb-2 mt-4 ">
                        <SelectColumn
                            columns={defColumns}
                            handleChange={handleSelectColumnChange}
                            checkboxValues={checkboxValues}
                        />
                    </div>
                </div>
            </div>
        );

    }, [filterText, checkboxValues, checkboxSearchValues, disableChecks, defColumns, size]);

    return (
        <div className="container-fluid  mt-3">

            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={2}
                padding={1}
                borderBottom="1px solid #ccc"
            >
                <Typography variant="h5" component="h1" fontWeight="bold">
                    Consultas
                </Typography>
                <Button sx={{ textTransform: 'none' }}
                    variant="contained" color="primary" onClick={toggleTheme}>
                    Tema
                </Button>
            </Box>



            <Datatable
                // style={{ width: "100vw" }}
                className=""
                columns={defColumns}
                data={filteredTableData}
                pagination

                dense
                responsive
                // onColumnOrderChange={handleColumnOrderChange}
                striped
                subHeader
                subHeaderComponent={subHeaderComponentMemo}
                //subHeaderComponentProps={ }

                progressPending={pending}
                progressComponent={<CircularIndeterminate />}

                noDataComponent={
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100px',
                            color: 'gray',
                        }}
                    >
                        <InventoryTwoToneIcon sx={{ fontSize: 48, marginBottom: 1 }} />
                        <Typography variant="body1">
                            No hay registros para mostrar
                        </Typography>
                    </Box>
                }

                highlightOnHover
                expandableRows
                expandableRowsComponent={ExpandableComponent}
                expandableRowsComponentProps={propsColumns}
                customStyles={customStyles}
                theme={theme}
            />
        </div>
    );
}
/**************************************************************************************************************/
/**************************************************************************************************************/
/**************************************************************************************************************/
/**************************************************************************************************************/
/************************************Datatable for Inventory*************************************************/

export function DatatableUserInventory({ accessToken, refreshToken, onDetailClick }) {

    const [defColumns, setDefColumns] = useState([]);
    const [tableData, setTableData] = useState([]);

    const [filteredTableData, setFilteredTableData] = useState([]);

    const [defColumnsOut, setDefColumnsOut] = useState([]);
    const [size, setSize] = useState(null);
    const [dataQuery, setDataQuery] = useState([]);
    const [checkboxValues, setCheckboxValues] = useState([]);
    const [filterText, setFilterText] = useState('');

    const [rm_accents, setRmAccents] = useState(false);
    const [upper_lower, setUpperLower] = useState(false);
    const [wordComplete, setWordComplete] = useState(false);

    const [checkboxSearchValues, setCheckboxSearchValues] = useState('');
    const [disableChecks, setdisbleChecks] = useState(true);
    const [theme, setTheme] = useState('custom-dark'); // Estado para el tema
    const [pending, setPending] = useState(true);


    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'custom-light' ? 'custom-dark' : 'custom-light'));
    };

    //var size;
    /***************************************************************************** */
    const timerIdRef = useRef();
    useEffect(() => {

        const handleResize = () => {
            const width = window.innerWidth;
            let newSize = size;


            if (width >= 1463 && width < 2000) {
                newSize = 11;
            } else if (width >= 1249 && width < 1463) {
                newSize = 9;
            } else if (width >= 1040 && width < 1249) {
                newSize = 7;
            } else if (width >= 800 && width < 1040) {
                newSize = 6;
            }
            else if (width >= 600 && width < 800) {
                newSize = 5;
            }
            else if (width >= 550 && width < 600) {
                newSize = 4;
            }
            else if (width >= 300 && width < 550) {
                newSize = 3;
            }
            if (newSize !== size || size == null) {
                clearTimeout(timerIdRef.current);
                timerIdRef.current = setTimeout(() => {
                    setSize(newSize);
                }, 2);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            clearTimeout(timerIdRef.current);
            window.removeEventListener('resize', handleResize);
        };
    }, [size, timerIdRef]);

    // var prop ;
    const [hasFetched, setHasFetched] = useState(false);
    useEffect(() => {
        const filtered = () => {
            return filterSearch(defColumns, tableData, filterText, rm_accents, upper_lower, wordComplete, checkboxSearchValues, disableChecks);

        };
        if (!hasFetched) {

            const fetchDataAndFormat = async () => {
                try {
                    let fetch;
                    let first;
                    if (dataQuery.length === 0) {
                        fetch = await fetchData(accessToken, refreshToken);
                        // console.log(fetch);
                        setDataQuery(fetch);
                        first = true;
                        setPending(false);
                    } else {
                        fetch = dataQuery;
                        first = false;
                        setPending(false);
                    }

                    let arrayTabColOut;
                    const module = "Inventory"
                    if (first) {
                        arrayTabColOut = formatData(fetch, size, true, onDetailClick, null, null, module);
                        setFilteredTableData(arrayTabColOut[0]);

                    } else {
                        arrayTabColOut = formatData(dataQuery, size, false, onDetailClick, defColumns, tableData, module);
                    }

                    // Guardar en estado local y actualizar referencias
                    setTableData(arrayTabColOut[0]);
                    setDefColumnsOut(arrayTabColOut[2]);
                    // setArrayTabColOutState(arrayTabColOut); // Guardar en estado local

                    // Actualizar almacenamiento local si es necesario
                    const getdefColumn = localStorage.getItem('showColumnsInventory');
                    if (getdefColumn === null || getdefColumn === 'undefined') {
                        //console.log('null');
                        setDefColumns(arrayTabColOut[1]);
                        setDefColumnsOut(arrayTabColOut[2]);
                        localStorage.setItem('showColumnsInventory', JSON.stringify(arrayTabColOut[1]));
                    } else {
                        //    console.log('not null');
                        const savedColumns = JSON.parse(getdefColumn);
                        const tdefColumn = arrayTabColOut[1];
                        tdefColumn.forEach((column, index) => {
                            console.log(savedColumns[index]);
                            column.show = savedColumns[index].show;
                            if (!savedColumns[index].show) {
                                column.omit = true;
                            }
                        });
                        setDefColumns(tdefColumn);
                        const Cout = ConstructElementsToHide(tdefColumn, size);
                        setDefColumnsOut(Cout);
                    }

                } catch (error) {
                    console.error('Error al procesar los datos:', error);
                }
            };

            fetchDataAndFormat();
            setHasFetched(true);
        }
        setFilteredTableData(filtered());

        // Inicializar checkboxValues con valores predeterminados
        // aqui podemos hacer un guardado de localstorage para traer los datos locales
        // de que columnas se muestran
        const Values = {};
        //const initialValuesSearch = {};
        defColumns.forEach(element => {
            if (!element.show) {
                Values[element.id] = false;
                // initialValuesSearch[element.id] = false;
            } else {
                Values[element.id] = true;
                //initialValuesSearch[element.id] = false;
            }
        });
        setCheckboxValues(Values);
        // setCheckboxSearchValues(initialValuesSearch);
        //filtered();
        // Si cambian ciertas dependencias clave, reiniciar el estado
        return () => {
            setHasFetched(false);
        };
    }, [accessToken, refreshToken, size, setHasFetched, dataQuery, onDetailClick, checkboxSearchValues, disableChecks, filterText, rm_accents, upper_lower, wordComplete, setTableData, setDefColumns]);

    /*****************************************************************************
     *****************************************************************************/
    const propsColumns = {
        defColumnsOut
    };
    /******************************************************************************** */
    // Función para manejar el cambio de las checkboses de seacrh
    //
    const handleSearchboxChange = (id) => {
        // console.log('id', id);
        setCheckboxSearchValues(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
        // console.log(checkboxSearchValues[id]);

    };

    const subHeaderComponentMemo = useMemo(() => {
        /******************************************************************************** */
        // Función para manejar el cambio en el orden de las columnas
        // Objeto para almacenar el nuevo orden
        var hideConstructor = [];
        const handleSelectColumnChange = (id) => {
            console.log('idS', id);
            setCheckboxValues(prevState => ({
                ...prevState,
                [id]: !prevState[id]
            }));
            // console.log(checkboxValues[id]);
            const index = defColumns.findIndex(column => column.id === id);
            var updatedColumns;
            if (index !== -1) {
                //console.log('dfCol', defColumns[index]);
                updatedColumns = [...defColumns];
                updatedColumns[index].show = !updatedColumns[index].show;
                if (updatedColumns[index].show === false) {
                    updatedColumns[index].omit = true;
                } else {
                    updatedColumns[index].omit = false;
                }
                //console.log('opdCol', updatedColumns[index]);
                updatedColumns.forEach(column => {

                    if (column.show) {
                        hideConstructor.push(column);
                    }
                });
                setDefColumns(updatedColumns);
                setDefColumnsOut([]);
                //esto es necesario para guardar el selector que es una funcion, como cadena        
                localStorage.setItem('showColumnsInventory', JSON.stringify(updatedColumns));
            }

            var out;

            if (hideConstructor.length >= size) {
                let quitElements = hideConstructor.length - size;
                quitElements = (quitElements + 1) * -1;
                // const dentro = hideConstructor.slice(0, size); // Elementos dentro del tamaño
                out = hideConstructor.slice(quitElements, -1); // Elementos que están fuera del tamaño

                out.forEach(element => {
                    const id = element.id;
                    const correspondingElement = updatedColumns.find(item => item.id === id);
                    if (correspondingElement) {
                        correspondingElement.omit = true;
                    }
                    setDefColumns(updatedColumns);
                    setDefColumnsOut(out);
                    localStorage.setItem('showColumnsInventory', JSON.stringify(updatedColumns));

                });
            }
        };

        return (
            <div className="container-fluid ">
                <div className="row justify-content-center">
                    <div className="col-6 mb-2 mt-2 text-start">
                        <SearchBox
                            placeholder={langData.dataTablesSearch.place_holder}
                            columns={defColumns}
                            onFilter={event => setFilterText(event.target.value)}
                            filterText={filterText}
                            checkboxSearchValues={checkboxSearchValues}
                            handleCheckboxChange={handleSearchboxChange}
                            setRmAccents={setRmAccents}
                            setUpperLower={setUpperLower}
                            disableChecks={disableChecks}
                            setdisbleChecks={setdisbleChecks}
                            setWordComplete={setWordComplete}
                        />
                    </div>
                    <div className="col-6 mb-2 mt-4 ">
                        <SelectColumn
                            columns={defColumns}
                            handleChange={handleSelectColumnChange}
                            checkboxValues={checkboxValues}
                        />
                    </div>
                </div>
            </div>
        );

    }, [filterText, checkboxValues, checkboxSearchValues, disableChecks, defColumns, size]);

    return (
        <div className="container-fluid  mt-3">
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={2}
                padding={1}
                borderBottom="1px solid #ccc"
            >
                <Typography variant="h5" component="h1" fontWeight="bold">
                    Inventario
                </Typography>
                <Button sx={{ textTransform: 'none' }}
                    variant="contained" color="primary" onClick={toggleTheme}>
                    Tema
                </Button>
            </Box>

            <Datatable
                // style={{ width: "100vw" }}
                className=""
                columns={defColumns}
                data={filteredTableData}
                pagination

                dense
                responsive
                // onColumnOrderChange={handleColumnOrderChange}
                //striped
                subHeader
                subHeaderComponent={subHeaderComponentMemo}
                //subHeaderComponentProps={ }
                progressPending={pending}
                progressComponent={<CircularIndeterminate />}

                highlightOnHover
                expandableRows
                expandableRowsComponent={ExpandableComponent}
                expandableRowsComponentProps={propsColumns}
                customStyles={customStyles}
                theme={theme}
            />
        </div>
    );




}