/*const order_columns = ["inventory_number", "catalog_number", "origin_number", "genders_info", "subgenders_info", "type_object_info", "dominant_material_info", "location_info", "tags", "description_origin", "description_inventory", "research_info", "authors_info", "involved_creation_info", "period_info", "measure_with", "measure_without"];
const research_keys = ['title', 'keywords', 'technique', 'materials', 'acquisition_form', 'acquisition_source', 'acquisition_date', 'firm_description', 'short_description', 'formal_description', 'observation', 'publications', 'card'];*/

const langData = {
    LangDispo: {
        spanish: "Spanish",
        english: "Englis",
        french: "French",
    },
    StartMenu: {
        home: 'Start',
        queries: 'Piece Search',
        inventory: 'Inventory',
        research: 'Research',
        restoration: 'Restoration',
        movements: 'Movements',
        manage: 'Manage',
        loans: 'Loans',
        search: 'Search',
        institutions: 'Institutions',
        contacts: 'Contacts',
        expositions: 'Exhibitions',
        venues: 'Venues',
        reports: 'Reports',
        appraisals: 'Appraisals',
        users: 'Users',
        catalogs: 'Catalogs',
        genders: 'Genders',
        administration: 'Administration',
        
        language: 'Language',
    },
    dataTablesSearch: {
        place_holder: "Find something...",
        select_columns: "Select columns",
        advanced_search: "Advanced search",
        search_by_selection: "Search by selection",
        tooltip_selection: "Search just in the selected items",
        tooltip_accents: "Match withouth accents",
        tooltip_upper_lower: "Match case",
        tooltip_whole_word: "Match whole words only"
    },
    dataTableUserQueryNames: {
        inventory_number: 'Inventory No.',
        catalog_number: 'Catalog No.',
        origin_number: 'Origin No.',
        genders_info: 'Gender',
        subgenders_info: 'Subgender',
        type_object_info: 'Type object',
        dominant_material_info: 'Dominant Material',
        location_info: 'Location',
        tags: 'Cabinet',
        description_origin: 'Description origin',
        description_inventory: 'Description inventory',
        //research_info: '', este campo se elimina y se ponen sus elementos como columnas
        title: 'Title',
        authors_info: 'Autor(s)',
        keywords: 'Keywords',
        technique: 'Technique',
        materials: 'Materials',
        acquisition_form: 'Aquisition - Form',
        acquisition_source: 'Aquisition-Source/Place',
        acquisition_date: 'Aquisition-Date',
        firm_description: 'Signatures or Marks - Description',
        short_description: 'Short description',
        formal_description: 'Formal description',
        observation: 'Observations',
        publications: 'Publications featuring the work',
        card: 'Card',

        involved_creation_info: 'Those involved in its creation',
        period_info: 'Period',
        measure_with: 'Measurements with base/frame',
        measure_without: 'Measurements without base/frame',
        photo_thumb_info: 'Photo',
    },
    //Si bien estan repetidos y pude haber usado los de datatables es mejor tenerlos por separado
    //para que lleve mas orden
    pieceDetailDescriptors: {
        inventory: {
            inventory_number: 'Inventory No.',
            catalog_number: 'Catalog No.',
            origin_number: 'Origin No.',
            gender: 'Gender',
            subgenders_info: 'Subgender',
            type_object_info: 'Type object',
            dominant_material_info: 'Dominant Material',
            set: "Set",
            location_info: 'Location',
            tags: 'Cabinet',
            description_origin: 'Description origin',
            description_inventory: 'Description inventory',
            appraisal: "Appraisal",
            date_start_string: "Date of ",
            departure_date: "Departure",
            arrival_date: "Arrival",
            measure_without: "Measurenments without {} (cm)",
            measure_with: "Measurements with {} (cm)",
            base: 'base',
            frame: 'frame',
            height: "Height",
            width: "Width",
            depth: "Depth",
            diameter: "Diameter",
            appraisal_history_tooltip: "View appraisal history",
            associated_documents: "Assosiated documents",
            incidence: "Incidents",
            created_by: "Created by",
            updated_by: "Updated by",
        },
        research: {
            title: "Title",
            autor_s_: "Autor(s)",
            set: "Set",
            involved_creation_info: "Involveds in its creation",
            technique: "Technique",
            materials: "Materials",
            place_of_creation: "Place of creation",
            period: "Period",
            creation_date: "Creation date",
            keywords: "Keywords",
            acquisition_form: "Form",
            acquisition_source: "Source/place",
            acquisition_date: "Date",
            firm_description: "Signatures or marks",
            description: "Description",
            short_description: "Short description",
            formal_description: "Formal description",
            observation: "Observations",
            publications: "Publications featuring the work",
            card: "Card",
            foot_notes: "Foot notes",
            bibliography: "Bibliography",
            associated_documents: "Associated documents",
            provenance: "Prevenance",
            //firm description
            firm_yes: "Yes",
            firm_no: "No",

        },
        restoration: {
            preliminary_examination: "Preliminary examination",
            laboratory_analysis: "Laboratory analysis",
            proposal_of_treatment: "Proposal of treatment",
            treatment_description: "Treatment description",
            results: "Results and recomendations",
            observations: "Observations",
            treatment_date: "Date of treatment",
            responsible_restorer: "Responsible restorer",

            measure_without: "Measurements without base (cm)",
            measure_with: "Measurements with (cm)",
            height: "Height",
            width: "Width",
            depth: "Depth",
            diameter: "Diameter",
            associated_documents: "Associated documents",
            created_by: "Created by",
            //updated_by: "Actualizado por",
            modified_by: "Modified by",
        },
    },
    pieceDetailMenu: {
        nameMenu: "Piece detail",
        inventory: "Inventory",
        research: "Research",
        restoration: "Restoration",
        movements: "Movements",
    },
    pieceDetailAppraisalModal: {
        modalHeader: "Appraisal history",
        appraisal: "Appraisal",
        modified_by: "Modified by",
        date: "Date",
        close: "Close",
    },
    pieceDetailMovements: {
        headerTableMovements: {
            departure_date: "Departure date",
            arrival_date: "Arrival date",
            institution: "Institution",
            location_exhibition: "Location / Exhibition",
            venue: "Venue",
        }
    },
    pieceDetailImages:{
        inventory:{
            inventory_images:"Inventory images",
        },
        research:{
            research_images: "Research images"
        },
        restoration:{
        restoration_images: "Restoration images"
        },
    }


}

export default langData;