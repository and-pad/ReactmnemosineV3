import React, { useState, useEffect } from 'react';

const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
export const filterSearch = (defColumns, tableData, filterText, rm_accents, upper_lower, wordComplete, checkboxSearchValues, disableChecks) => {
    let filteredItems;//variable donde se obtendran los items filtrados a regresar
    let itemsToFilter;//variable para seleccionar de defColumns donde buscar
    if (!disableChecks) {
        //si no esta habilitado el selector de filtrado por columnas pasa por aqui
        itemsToFilter = defColumns
            .filter(item => item.show && checkboxSearchValues[item.id])
            //mapeamos solo el elemento id, que es el que necesitamos y descartamos todos los demas campos
            .map(item => item.id);

    } else {
        //En caso contrario que este deshabilitado el selector de filtrado por seleccion, toma todas las visibles
        itemsToFilter = defColumns
            .filter(item => item.show) // Filtra las columnas visibles
            .map(item => item.id); // Obtiene los nombres de las columnas visibles
    }
    if (filterText !== '') {
        let handlefilterText = filterText;
        //Este es el filtrado principal del elemento SearchBox
        filteredItems = tableData.filter(item => {
            //some nos regresa true o false, para indicarle a filter si se incluira el termino en su busqueda
            return itemsToFilter.some(column => {
                let columnValue = String(item[column]); // Convierte el valor a cadena de texto
                // Si se requiere eliminar acentos
                if (rm_accents) {
                    columnValue = removeAccents(columnValue);//Enviamos la variable a la función para remover acentos
                    handlefilterText = removeAccents(filterText);//Removemos los acentos de la caja de texto también por si los colocaron quitarlos
                }
                // Si no se requiere convertir a minúsculas
                if (!upper_lower) {
                    //Normalmente no toma en cuenta las Mayuculas al habilitar este boton quita el lower case
                    columnValue = columnValue.toLowerCase();
                }
                // Búsqueda por palabra
                if (wordComplete) {
                    const searchPattern = new RegExp(`(?:^|[^\\p{L}])${handlefilterText}(?:$|[^\\p{L}])`, !upper_lower ? 'iu' : 'u');
                    return searchPattern.test(columnValue);
                }
                // Verificar la inclusión
                return columnValue.includes(upper_lower ? handlefilterText : handlefilterText.toLowerCase());
            });
        });
    } else {
        //Si no hay nada en filterText entonces regresamos los datos completos para mostrar
        filteredItems = tableData;
    }
    //Aqui regresamos los datos que se filtraron
    return filteredItems;
};


export const SearchBox = ({ placeholder, columns, onFilter, filterText, checkboxSearchValues, handleCheckboxChange, setRmAccents, setUpperLower, disableChecks, setdisbleChecks, setWordComplete }) => {
    //const [searchText, setSearchText] = useState('');
    const [checks, setChecks] = useState([]);


    useEffect(() => {
        const checksList = columns.map((element, index) => {
            const ishecked = checkboxSearchValues[element.id];
            //  console.log('is', ishecked);
            if (element.show) {
                return (
                    <div key={index} className="form-check form-check-inline  mb-0 mt-0 " >
                        <input
                            className="form-check-input mt-2 ms-0  me-0"
                            type="checkbox" id={element.id} value=""
                            style={{ width: '.7em', height: '.8em' }}
                            onChange={() => handleCheckboxChange(element.id)}
                            checked={ishecked}
                            disabled={disableChecks}
                        />
                        <label style={{ fontFamily: 'Asap Condensed', fontSize: '1em', }} className="form-check-label ps-1 ms-1 mb-0 mt-0 " htmlFor={element.id}>{element.name}</label>
                    </div>
                );
            } else {
                return null;
            }
        });
        setChecks(checksList);
    }, [columns, checkboxSearchValues, disableChecks, handleCheckboxChange]);

    // Calculando el número de elementos en cada columna
    const countElements = checks.filter(check => check !== null).length;
    let numPerColumn = Math.floor(countElements / 2);
    const modP = countElements % 2;

    if (modP !== 0) {
        numPerColumn += modP;
    }

    // Dividiendo la lista de checks en dos sublistas
    const checksFirstColumn = checks.slice(0, numPerColumn);
    const checksSecondColumn = checks.slice(numPerColumn);


    return (
        <>
            <div className="d-flex align-items-center ">
                <div className="mb-3 mt-3">
                    <input
                        style={{ fontFamily: 'Asap Condensed', height: '1.6em' }}
                        type="text"
                        className="form-control"
                        onChange={onFilter}
                        id="search"
                        placeholder={placeholder}
                        value={filterText}

                    />
                </div>
                <button type="button" className="btn btn-primary pb-4 pt-0 ms-2 me-3" style={{ fontFamily: 'Asap Condensed', height: '1.6em' }} data-bs-toggle="collapse" data-bs-target="#AdvancedSearch">Busqueda avanzada</button>
            </div>
            <div id="AdvancedSearch" className="collapse">
                <div className="card p-3" style={{ borderRadius: '5px', color: 'whitesmoke', background: '#8F8F8F', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {/* Nuevo recuadro arriba de los primeros checks */}
                    <div className="d-flex justify-content-between " style={{ color: 'whitesmoke', background: '#daebff', borderRadius: '5px' }}>
                        <div className="d-flex ms-1" style={{ fontFamily: 'Asap Condensed', fontSize: '.9em', flex: '1' }}>

                            <div style={{ background: '#5e5e5e', borderRadius: '4px' }} className="form-check form-switch ms-1 mt-1 ps-5 pe-2" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Busca solo en los campos seleccionados, si no hay ninguno seleccionado se seguira buscando en todos">
                                <input
                                    style={{ width: '1.8em' }}
                                    className="form-check-input mt-1 "
                                    type="checkbox"
                                    id="flexSwitchCheckDefault1"
                                    onChange={() => setdisbleChecks(prevState => !prevState)}
                                />
                                <label className="form-check-label " htmlFor="flexSwitchCheckDefault1">Busqueda por selección</label>
                            </div>


                            <div style={{ background: '#5e5e5e', borderRadius: '4px' }} className="form-check form-switch ms-1 mt-1 ps-5 pe-2" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Hacer coincidir sin acentos">
                                <input
                                    style={{ width: '1.8em' }}
                                    className="form-check-input mt-1 "
                                    type="checkbox"
                                    id="flexSwitchCheckDefault1"
                                    onChange={() => setRmAccents(prevState => !prevState)}
                                />
                                <label className="form-check-label " htmlFor="flexSwitchCheckDefault1">áa</label>
                            </div>

                            <div style={{ background: '#5e5e5e', borderRadius: '4px' }} className="form-check form-switch ms-1 mt-1 ps-5 pe-2" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Hacer coincidir mayúsculas y minúsculas">
                                <input
                                    style={{ width: '1.8em' }}
                                    className="form-check-input mt-1"
                                    type="checkbox"
                                    id="flexSwitchCheckDefault2"
                                    onChange={() => setUpperLower(prevState => !prevState)}
                                />
                                <label className="form-check-label" htmlFor="flexSwitchCheckDefault2">Aa</label>
                            </div>

                            <div style={{ background: '#5e5e5e', borderRadius: '4px' }} className="form-check form-switch ms-1 mt-1 ps-5 pe-2" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Hacer coincidir palabras completas">
                                <input
                                    style={{ width: '1.8em' }}
                                    className="form-check-input mt-1"
                                    type="checkbox"
                                    id="flexSwitchCheckDefault2"
                                    onChange={() => setWordComplete(prevState => !prevState)}
                                />
                                <label className="form-check-label" htmlFor="flexSwitchCheckDefault2">Palabra</label>
                            </div>


                        </div>

                    </div>
                    <div className="d-flex flex-wrap">
                        <div className="d-flex flex-column" style={{ flex: '1' }}>
                            {checksFirstColumn}
                        </div>
                        <div className="d-flex flex-column" style={{ flex: '1' }}>
                            {checksSecondColumn}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};



export const SelectColumn = ({ handleChange, columns, checkboxValues, }) => {

    var countElements = 0;
    const checks = columns.map((element, index) => {
        const isChecked = checkboxValues[element.id] || false;
        if (!element.show) {
            countElements += 1;
            return (
                <div key={index} className="form-check form-check-inline mb-0 mt-0">
                    <input
                        className="form-check-input mt-2"
                        type="checkbox"
                        id={element.id}
                        onChange={() => handleChange(element.id)}
                        value={false}
                        checked={isChecked}
                        style={{ width: '.7em', height: '.8em' }}
                    />
                    <label
                        className="form-check-label"
                        htmlFor={element.id}
                        style={{ fontFamily: 'Asap Condensed', fontSize: '1em', }}
                    >{element.name}</label>
                </div>
            );
        } else /*if (element.show)*/ {
            countElements += 1;
            return (
                <div key={index} className="form-check form-check-inline mb-0 mt-0">
                    <input
                        className="mt-2 form-check-input "
                        type="checkbox"
                        id={element.id}

                        value={true}
                        checked={isChecked}
                        onChange={() => handleChange(element.id)}
                        style={{ width: '.7em', height: '.8em' }}
                    />
                    <label
                        className="form-check-label "
                        htmlFor={element.id + '_idS'}
                        style={{ fontFamily: 'Asap Condensed', fontSize: '1em', }}
                    >{element.name}</label>
                </div>
            );
        }
    });

    let numPerColumn = Math.floor(countElements / 2);
    const modP = countElements % 2;
    //console.log('Mod', modP);
    if (modP !== 0) {
        numPerColumn += modP;
        //console.log(numPerColumn);
    }
    const checksFirstColumn = checks.slice(0, numPerColumn);
    const checksSecondColumn = checks.slice(numPerColumn);

    return (
        <><div className='text-end'>
            <button type="button" className="btn btn-primary pb-4 pt-0 mb-3 ms-2 me-3" style={{ fontFamily: 'Asap Condensed', height: '1.6em' }} data-bs-toggle="collapse" data-bs-target="#SelectColumn">Seleccionar columnas</button>
        </div>
            <div className='text-start'>
                <div id="SelectColumn" className="collapse">
                    <div className="card p-3" style={{ borderRadius: '5px', color: 'whitesmoke', background: '#8F8F8F', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div className="d-flex flex-wrap">
                            <div className="d-flex flex-column" style={{ flex: '1' }}>
                                {checksFirstColumn}
                            </div>
                            <div className="d-flex flex-column" style={{ flex: '1' }}>
                                {checksSecondColumn}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>

    );

};

