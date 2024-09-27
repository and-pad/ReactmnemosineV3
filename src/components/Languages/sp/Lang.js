/*const order_columns = ["inventory_number", "catalog_number", "origin_number", "genders_info", "subgenders_info", "type_object_info", "dominant_material_info", "location_info", "tags", "description_origin", "description_inventory", "research_info", "authors_info", "involved_creation_info", "period_info", "measure_with", "measure_without"];
const research_keys = ['title', 'keywords', 'technique', 'materials', 'acquisition_form', 'acquisition_source', 'acquisition_date', 'firm_description', 'short_description', 'formal_description', 'observation', 'publications', 'card'];*/

const langData = {
    LangDispo: {
        spanish: "Español",
        english: "Ingles",
        french: "Frances"
    },
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
        catalogs: 'Catálogos',
        genders: 'Géneros',
        administration: 'Administración',
        
        
        language: 'Idioma',

    },
    dataTablesSearch: {
        place_holder: "Encuentra algo...",
        select_columns: "Seleccionar columnas",
        advanced_search: "Busqueda avanzada",
        search_by_selection: "Busqueda por selección",
        tooltip_selection: "Busca solo en los campos seleccionados",
        tooltip_accents: "Hacer coincidir sin acentos",
        tooltip_upper_lower: "Hacer coincidir mayúsculas y minúsculas",
        tooltip_whole_word: "Hacer coincidir solo palabras completas"

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
            set: 'Conjunto',
            location_info: 'Ubicación',
            tags: 'Mueble',
            description_origin: 'Descripción de origen',
            description_inventory: 'Descripción de inventario',
            appraisal: "Avalúo",
            date_start_string: "Fecha de ",
            departure_date: "salida",
            arrival_date: "entrada",
            measure_without: "Medidas sin {} (cm)",
            measure_with: "Medidas con {} (cm)",
            base: "base",
            frame: "marco",
            height: "Alto",
            width: "Ancho",
            depth: "Profundo",
            diameter: "Diámetro",
            appraisal_history_tooltip: "Ver historial de avalúo",
            associated_documents: "Documentos asociados",
            incidence: "Incidencias",
            created_by: "Creado por",
            updated_by: "Actualizado por",

        },
        research: {
            title: "Título",
            autor_s_: "Autor(es)",
            set: "Conjunto",
            involved_creation_info: "Involucrados en su creación",
            technique: "Técnica",
            materials: "Materiales",
            place_of_creation: "Procedencia",
            period: "Epoca",
            creation_date: "Fecha de creación",
            keywords: "Palabras clave",
            acquisition_form: "Forma",
            acquisition_source: "Fuente/lugar",
            acquisition_date: "Fecha",
            firm_description: "Firmas o marcas",
            description: "Descripción",
            short_description: "Descripción abreviada",
            formal_description: "Descripción formal",
            observation: "Observaciones",
            publications: "Publicaciones en las que aparece la obra",
            card: "Cédula",
            foot_notes: "Notas al pie",
            bibliography: "Bibliografía",
            associated_documents: "Documentos asociados",
            provenance: "Proveniencia",
            //firm description
            firm_yes: "Si",
            firm_no: "No",

        },
        restoration: {
            preliminary_examination: "Exámen preliminar",
            laboratory_analysis: "Análisis de laboratorio",
            proposal_of_treatment: "Propuesta de tratamiento",
            treatment_description: "Descripción de tratamiento",
            results: "Resultado y recomendaciones",
            observations: "Observaciones",
            treatment_date: "Fecha de tratamiento",
            responsible_restorer: "Restaurador responsable",

            measure_without: "Medidas sin base (cm)",
            measure_with: "Medidas con base (cm)",
            height: "Alto",
            width: "Ancho",
            depth: "Profundo",
            diameter: "Diámetro",

            associated_documents: "Documentos asociados",

            created_by: "Creado por",
            //updated_by: "Actualizado por",
            modified_by: "Modificado por",

        },

    },
    pieceDetailMenu: {
        nameMenu: "Detalle de la pieza",
        inventory: "Inventario",
        research: "Investigación",
        restoration: "Restauración",
        movements: "Movimientos",
    },
    pieceDetailAppraisalModal: {
        modalHeader: "Historico de avalúo",
        appraisal: "Avalúo",
        modified_by: "Modificado por",
        date: "Fecha",
        close: "Cerrar",
    },
    pieceDetailMovements: {
        headerTableMovements: {
            departure_date: "Fecha salida",
            arrival_date: "Fecha entrada",
            institution: "Institucion",
            location_exhibition: "Ubicación / Exposición",
            venue: "Sede",
        }
    },
    pieceDetailImages:{
        inventory:{
            inventory_images:"Imagenes de inventario",
        },
        research:{
            research_images: "Imagenes de investigación"
        },
        restoration:{
        restoration_images: "Imagenes de restauración"
        },
    }

}

export default langData;