/*const order_columns = ["inventory_number", "catalog_number", "origin_number", "genders_info", "subgenders_info", "type_object_info", "dominant_material_info", "location_info", "tags", "description_origin", "description_inventory", "research_info", "authors_info", "involved_creation_info", "period_info", "measure_with", "measure_without"];
const research_keys = ['title', 'keywords', 'technique', 'materials', 'acquisition_form', 'acquisition_source', 'acquisition_date', 'firm_description', 'short_description', 'formal_description', 'observation', 'publications', 'card'];*/

const langData = {
    StartMenu: {
        home: 'Inicio',
        queries: 'Consultas',
        inventory: 'Inventario',
        research: 'Investigación',
        restoration: 'Restauración',
        movements: 'Movimientos',
        manage: 'Gestionar',
        loans: 'Préstamos',
        search: 'Buscar',
        institutions: 'Instituciones',
        contacts: 'Contactos',
        expositions: 'Exposiciones',
        venues: 'Sedes',
        reports: 'Reportes',
        appraisals: 'Avalúos',
        users: 'Usuarios',
        catalogs: 'Catalogos',
        genders: 'Géneros',

    },
    dataTableUserQueryNames: {
        inventory_number: 'No. inventario',
        catalog_number: 'No. catálogo',
        origin_number: 'No. procedencia',
        genders_info: 'Género',
        subgenders_info: 'Subgénero',
        type_object_info: 'Tipo de objeto',
        dominant_material_info: 'Material dominante',
        location_info: 'Ubicación',
        tags: 'Mueble',
        description_origin: 'Descripción de origen',
        description_inventory: 'Descripción de inventario',
        //research_info: '', este campo se elimina y se ponen sus elementos como columnas
        title: 'Título',
        authors_info: 'Autor(es)',
        keywords: 'Palabras clave',
        technique: 'Técnica',
        materials: 'Materiales',
        acquisition_form: 'Proveniencia - Forma',
        acquisition_source: 'Proveniencia-Fuente/lugar',
        acquisition_date: 'Proveniencia-Fecha',
        firm_description: 'Firmas o marcas-Descripción',
        short_description: 'Descripción abreviada',
        formal_description: 'Descripción formal',
        observation: 'Observaciones',
        publications: 'Publicaciones en las que aparece la obra',
        card: 'Cédula',

        involved_creation_info: 'Involucrados en su creación',
        period_info: 'Epoca',
        measure_with: 'Medidas con base/marco',
        measure_without: 'Medidas sin base/marco',
        photo_thumb_info: 'Foto',
    },
    //Si bien estan repetidos y pude haber usado los de datatables es mejor tenerlos por separado
    //para que lleve mas orden
    pieceDetailDescriptors: {
        inventory: {
            inventory_number: 'No. inventario',
            catalog_number: 'No. catálogo',
            origin_number: 'No. procedencia',
            gender: 'Género',
            subgenders_info: 'Subgénero',
            type_object_info: 'Tipo de objeto',
            dominant_material_info: 'Material dominante',
            location_info: 'Ubicación',
            tags: 'Mueble',
            description_origin: 'Descripción de origen',
            description_inventory: 'Descripción de inventario',
            appraisal: "Avalúo",
            departure_date: "Fecha de salida",
            arrival_date: "Fecha de entrada",
            measure_without: "Medidas sin base (cm)",
            measure_with: "Medidas con base (cm)",
            height: "Alto",
            width: "Ancho",
            depth: "Profundo",
            diameter: "Diámetro",

        }


    }

}

export default langData;