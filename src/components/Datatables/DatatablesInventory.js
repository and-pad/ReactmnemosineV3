//import { useEffect, useState,  useRef } from "react";

//import GoogleFontLoader from 'react-google-font-loader';
//import "../Datatables/datatable.css";
//import { createTheme } from 'react-data-table-component'
//import Box from "@mui/material/Box"; // Para el contenedor estilizado
//import Typography from "@mui/material/Typography"; // Para el texto
//import { Button } from "@mui/material"; // Botón de Material UI
//import { DatatableBase } from "./datatableBase";
import { BaseDatatable } from "./datatableStructurer" 




//columnas del datatables
//const columns = ["inventory_number", "catalog_number", "origin_number", "genders_info", "subgenders_info", "type_object_info", "dominant_material_info", "location_info", "tags", "description_origin", "description_inventory", "authors_info", "involved_creation_info", "period_info", "research_info", "measure_without", "measure_with", 'title', 'keywords', 'technique', 'materials', 'acquisition_form', 'acquisition_source', 'acquisition_date', 'firm_description', 'short_description', 'formal_description', 'observation', 'publications', 'card', 'photo_thumb_info', '_id'];
// Define el componente personalizado para la fila expandida


/**************************************************************************************************************/
/**************************************************************************************************************/
/**************************************************************************************************************/
/**************************************************************************************************************/
/************************************Datatable for Inventory*************************************************/

export function DatatableUserInventory({
  accessToken,
  refreshToken,
  permissions,
  module,
  title,
 
  //onDetailClick,
}) {

  return BaseDatatable({ accessToken, refreshToken, module, title, permissions});
}


