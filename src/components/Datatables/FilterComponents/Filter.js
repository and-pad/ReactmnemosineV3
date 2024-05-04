import React, { useState, useEffect } from 'react';


export const SearchBox = ({ placeholder, columns, onFilter, filterText }) => {
    //const [searchText, setSearchText] = useState('');
    const [checks, setChecks] = useState([]);

    useEffect(() => {
        const checksList = columns.map((element, index) => {
            if (element.show) {
                return (
                    <div key={index} className="form-check form-check-inline  mb-0 mt-0 " >
                        <input className="form-check-input mt-2 ms-0  me-0" type="checkbox" id={element.id} value="" style={{ width: '.7em', height: '.8em' }} />
                        <label style={{ fontFamily: 'Asap Condensed', fontSize: '1em', }} className="form-check-label ps-1 ms-1 mb-0 mt-0 " htmlFor={element.id}>{element.name}</label>
                    </div>
                );
            } else {
                return null;
            }
        });
        setChecks(checksList);
    }, [columns]);

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
        } else if (element.show) {
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
    //<input className="form-check-input mt-2 me-0" type="checkbox" id={element.id} value="" style={{ width: '.7em', height: '.7em' }} />
    //                     <label style={{ fontFamily: 'Asap Condensed', fontSize: '.9em', }} className="form-check-label ms-0 " htmlFor={element.id}>{element.name}</label>

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

