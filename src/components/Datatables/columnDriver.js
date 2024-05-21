import langData from '../Languages/sp/Lang';
import SETTINGS from "../Config/settings";
import { Link, useNavigate } from 'react-router-dom';


const CustomCell = ({ row, column }) => (
    <div>
        <div style={{ textAlign: 'justify' }}>
            <p className="col text-wrap  ">{row[column]}</p>
        </div>
    </div>
);

const CustomTag = ({ row, column }) => {
    const textColumn = row[column];
    let Arrayelements;
    if (textColumn !== undefined) {
        Arrayelements = textColumn.split(",");
    }
    else { Arrayelements = [] };
    return (
        <div className="mt-2">
            {Arrayelements.map((element, index) => (
                <div key={`${element}-${index}`}>
                    <a href='' style={{ textDecoration: 'none', height: '1.2em', paddingTop: '1px' }} className="badge rounded-pill text-bg-info ">{element}</a>
                    <div style={{ height: '.2em' }}></div>
                </div>
            ))}
        </div>
    );
};

const detailClick = ({ row, navigate }) => {
    //console.log('row', row._id[0]);
    navigate(`/mnemosine/piece_queries/detail/${encodeURIComponent(row._id[0])}`);
};

// `/piece_queries/detail / ${ encodeURIComponent(Row) }`

const CustomPhoto = ({ row, column, onDetailClick }) => {
    //   const navigatess = useNavigate();
    //  const history = useHistory();    
    const fileName = row[column];
    const AddrImgName = SETTINGS.URL_ADDRESS.server_url + SETTINGS.URL_ADDRESS.thumbnails + fileName;
    // console.log('addrImg', AddrImgName);
    const navigate = useNavigate();


    return (
        <>
            <div className="position-relative d-inline-block" style={{ width: '110px' }}>

                <div className="position-absolute top-0 end-0 rounded" style={{ backgroundColor: 'rgba(210, 210, 210, .7)', marginTop: '4px', marginRight: '4px', cursor: 'pointer' }} onClick={() => detailClick({ row, navigate })} >
                    <i className='fas fa-eye' style={{ fontSize: '10px', border: '1px solid #fff', borderRadius: '50%', padding: '2px', margin: '2px', color: 'blue' }}></i>
                </div>

                <div key={fileName + column} className="text-center frameThmb" style={{ width: "100px" }}>
                    <img src={AddrImgName} />
                </div>
            </div>
        </>
    );
}


export const applyLogicToColumn = (columnName, columnProps, onDetailClick) => {
    // Aplica la lógica según el nombre de la columna
    switch (columnName) {
        case "inventory_number":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.inventory_number,
                reorder: true,
                show: true,
                width: '110',
                minWidth: '90px',
                // Otras propiedades específicas de "inventory_number" aquí
            };
        case "catalog_number":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.catalog_number,
                reorder: true,
                show: true,
                // Otras propiedades específicas de "catalog_number" aquí
            };
        case "origin_number":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.origin_number,
                reorder: true,
                show: true,
                // Otras propiedades específicas de "origin_number" aquí
            };
        case "genders_info":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.genders_info,
                reorder: true,
                show: true,
                cell: row => <CustomCell row={row} column={columnName} />,
                // Otras propiedades específicas de "genders_info" aquí
            };
        case "subgenders_info":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.subgenders_info,
                reorder: true,
                show: true,
                cell: row => <CustomCell row={row} column={columnName} />,
                // Otras propiedades específicas de "subgenders_info" aquí
            };
        case "type_object_info":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.type_object_info,
                reorder: true,
                omit: true,
                cell: row => <CustomCell row={row} column={columnName} />,
                // Otras propiedades específicas de "type_object_info" aquí
            };
        case "dominant_material_info":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.dominant_material_info,
                reorder: true,
                omit: true,
                cell: row => <CustomCell row={row} column={columnName} />,
                // Otras propiedades específicas de "dominant_material_info" aquí
            };
        case "location_info":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.location_info,
                reorder: true,
                show: true,
                cell: row => <CustomCell row={row} column={columnName} />,
                // Otras propiedades específicas de "location_info" aquí
            };
        case "tags":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.tags,
                reorder: true,
                show: true,
                cell: row => <CustomTag row={row} column={columnName} />,
                // Otras propiedades específicas de "tags" aquí
            };
        case "description_origin":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.description_origin,
                show: true,
                cell: row => <CustomCell row={row} column={columnName} />,
                // Otras propiedades específicas de "description_origin" aquí
            };
        case "description_inventory":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.description_inventory,
                omit: true,
                cell: row => <CustomCell row={row} column={columnName} />,
                // Otras propiedades específicas de "description_inventory" aquí
            };
        case "title":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.title,
                // Otras propiedades específicas de "title" aquí
                omit: true,
                cell: row => <CustomCell row={row} column={columnName} />,
            };
        case "authors_info":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.authors_info,
                omit: true,
                cell: row => <CustomCell row={row} column={columnName} />,
                // Otras propiedades específicas de "authors_info" aquí
            };
        case "keywords":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.keywords,
                omit: true,
                cell: row => <CustomCell row={row} column={columnName} />,
                // Otras propiedades específicas de "keywords" aquí
            };
        case "technique":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.technique,
                omit: true,
                cell: row => <CustomCell row={row} column={columnName} />,
                // Otras propiedades específicas de "technique" aquí
            };
        case "materials":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.materials,
                omit: true,
                cell: row => <CustomCell row={row} column={columnName} />,
                // Otras propiedades específicas de "materials" aquí
            };
        case "acquisition_form":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.acquisition_form,
                omit: true,
                cell: row => <CustomCell row={row} column={columnName} />,
                // Otras propiedades específicas de "acquisition_form" aquí
            };
        case "acquisition_source":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.acquisition_source,
                omit: true,
                cell: row => <CustomCell row={row} column={columnName} />,
                // Otras propiedades específicas de "acquisition_source" aquí
            };
        case "acquisition_date":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.acquisition_date,
                omit: true,
                cell: row => <CustomCell row={row} column={columnName} />,
                // Otras propiedades específicas de "acquisition_date" aquí
            };
        case "firm_description":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.firm_description,
                omit: true,
                cell: row => <CustomCell row={row} column={columnName} />,
                // Otras propiedades específicas de "firm_description" aquí
            };
        case "short_description":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.short_description,
                omit: true,
                cell: row => <CustomCell row={row} column={columnName} />,
                // Otras propiedades específicas de "short_description" aquí
            };
        case "formal_description":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.formal_description,
                omit: true,
                cell: row => <CustomCell row={row} column={columnName} />,
                // Otras propiedades específicas de "formal_description" aquí
            };
        case "observation":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.observation,
                omit: true,
                cell: row => <CustomCell row={row} column={columnName} />,
                // Otras propiedades específicas de "observation" aquí
            };
        case "publications":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.publications,
                show: true,
                cell: row => <CustomCell row={row} column={columnName} />,
                // Otras propiedades específicas de "publications" aquí
            };
        case "card":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.card,
                show: true,
                cell: row => <CustomCell row={row} column={columnName} />,
                // Otras propiedades específicas de "card" aquí
            };
        case "involved_creation_info":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.involved_creation_info,
                show: true,
                cell: row => <CustomCell row={row} column={columnName} />,
                // Otras propiedades específicas de "involved_creation_info" aquí
            };
        case "period_info":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.period_info,
                omit: true,
                cell: row => <CustomCell row={row} column={columnName} />,
                // Otras propiedades específicas de "period_info" aquí
            };
        case "measure_with":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.measure_with,
                sortable: false,
                show: true,
                // Otras propiedades específicas de "measure_with" aquí                
                cell: row => <CustomCell row={row} column={columnName} />,
            };
        case "measure_without":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.measure_without,
                sortable: false,
                show: true,
                cell: row => <CustomCell row={row} column={columnName} />,
                // Otras propiedades específicas de "measure_without" aquí
            };
        case "photo_thumb_info":
            return {
                ...columnProps,
                name: langData.dataTableUserQueryNames.photo_thumb_info,
                sortable: false,
                show: true,
                maxWidth: '125px',
                cell: row => <CustomPhoto row={row} column={columnName} onDetailClick={onDetailClick} />,
                // Otras propiedades específicas de "measure_without" aquí
            };

        case "_id":
            return {
                ...columnProps,
                name: '_id',
                sortable: false,
                show: false,
            };
        // Continúa agregando más casos según sea necesario para otras columnas
        default:
            return columnProps; // Mantén las propiedades predeterminadas si no hay lógica específica
    }
};