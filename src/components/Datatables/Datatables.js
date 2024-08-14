import React, { useEffect, useState, useMemo, useRef } from 'react';
import Datatable from 'react-data-table-component';
import GoogleFontLoader from 'react-google-font-loader';
import { formatData, fetchData, ConstructElementsToHide } from './dataHandler'; // Importamos fetchData
import customStyles from './datatableCustomCellStyle';
import '../Datatables/datatable.css';
import { SearchBox, SelectColumn, filterSearch } from './FilterComponents/Filter';
import { getTranslations } from '../Languages/i18n';
const langData = getTranslations();

//columnas del datatables

const columns = ["inventory_number", "catalog_number", "origin_number", "genders_info", "subgenders_info", "type_object_info", "dominant_material_info", "location_info", "tags", "description_origin", "description_inventory", "authors_info", "involved_creation_info", "period_info", "research_info", "measure_without", "measure_with", 'title', 'keywords', 'technique', 'materials', 'acquisition_form', 'acquisition_source', 'acquisition_date', 'firm_description', 'short_description', 'formal_description', 'observation', 'publications', 'card', 'photo_thumb_info', '_id'];
// Define el componente personalizado para la fila expandida
const ExpandableComponent = props => {
    //console.log('props', props);
    let content = [];
    content.push(
        <GoogleFontLoader
            key="google-font-loader" // Agregar una key única para GoogleFontLoader
            fonts={[
                {
                    font: 'Marko One',
                    weights: [300],
                },
                {
                    font: 'Asap Condensed',
                    weights: [300],
                },
            ]}
        />
    );

    if (props.defColumnsOut !== undefined) {
        console.log('props', props.defColumnsOut);
        props.defColumnsOut.forEach((element, index) => {
            if (columns.includes(element.id)) {
                if ('show' in element) {
                    if (element.show === true) {
                        const Stag = element.id === 'tags' ? true : false;
                        if (Stag) {
                            var Arrayelements;
                            if (props.data[element.id] !== undefined) {

                                Arrayelements = props.data[element.id].split(",");
                            }
                            else { Arrayelements = [] };
                        }
                        content.push(
                            Stag ? (
                                <div
                                    style={{
                                        fontFamily: 'Asap Condensed',
                                        fontSize: '15px'
                                    }}
                                    className="text-start mt-2 ms-2 mb-0 border-bottom pb-0"
                                    key={`${element.name}-${index}`} // Usar una combinación única de propiedades
                                >
                                    {element.name}:

                                    <div className="d-flex flex-wrap" key={`${element.name + '1'}-${index}`} style={{ fontFamily: 'Asap Condensed, sans-serif', fontSize: '1.1em' }}>
                                        {Arrayelements.map((element, index) => (
                                            <div key={`${element}-${index}`} className="me-2 mb-2">
                                                <a href='#temp' style={{ textDecoration: 'none', height: '1.2em', paddingTop: '1px',  backgroundColor:"#1e80e1" }} className="badge rounded-pill text-dark ">{element}</a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                                :
                                (
                                    <div
                                        style={{
                                            fontFamily: 'Asap Condensed',
                                            fontSize: '15px'
                                        }}
                                        className="text-start mt-2 ms-2 mb-0 border-bottom pb-0"
                                        key={`${element.name}-${index}`} // Usar una combinación única de propiedades
                                    >
                                        {element.name}:

                                        <div className="text-info" key={`${element.name + '1'}-${index}`} style={{ fontFamily: 'Asap Condensed, sans-serif', fontSize: '1em' }}>
                                            {props.data[element.id]}
                                        </div>
                                    </div>)
                        );
                    }
                }
            }
        });
    }
    return (
        <div>
            {content}
        </div>
    );
};
//var arrayTabColOut;
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
    }, [size,timerIdRef ]);

    // var prop ;
    useEffect(() => {
        const filtered = () => {
            return filterSearch(defColumns, tableData, filterText, rm_accents, upper_lower, wordComplete, checkboxSearchValues, disableChecks);
     
         };
        const fetchDataAndFormat = async () => {
            try {
                let fetch;
                let first;
                if (dataQuery.length === 0) {
                    fetch = await fetchData(accessToken, refreshToken);
                   // console.log(fetch);
                    setDataQuery(fetch);
                    first = true;
                } else {
                    fetch = dataQuery;
                    first = false;
                }
    
                let arrayTabColOut;
    
                if (first) {
                    arrayTabColOut = formatData(fetch, size, true, onDetailClick);
                    setFilteredTableData(arrayTabColOut[0]);

                } else {
                    arrayTabColOut = formatData(dataQuery, size, false, onDetailClick, defColumns, tableData);
                }
    
                // Guardar en estado local y actualizar referencias
                setTableData(arrayTabColOut[0]);
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
    }, [ accessToken, size, dataQuery, onDetailClick, checkboxSearchValues,disableChecks ,filterText,rm_accents,upper_lower,wordComplete,setTableData,setDefColumns ]);
    
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
  
    /*Effect para la busqueda*/
   // useEffect(() => {
        

    //}, [tableData, filterText, defColumns, rm_accents, upper_lower, wordComplete, checkboxSearchValues, disableChecks]);

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

    }, [filterText, checkboxValues, checkboxSearchValues, disableChecks, defColumns ,size]);
    
    return (
        <div className="container-fluid  mt-3">

            <GoogleFontLoader
                fonts={[
                    {
                        font: 'Asap Condensed', // Nombre de tu fuente
                        weights: [400, 700], // Especifica los pesos que deseas cargar
                    },
                ]}
            />
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

                highlightOnHover
                expandableRows
                expandableRowsComponent={ExpandableComponent}
                expandableRowsComponentProps={propsColumns}
                customStyles={customStyles}
                theme={'dark'}
            />
        </div>
    );
}
