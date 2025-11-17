
import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import InventoryTwoToneIcon from "@mui/icons-material/InventoryTwoTone";
import Datatable from "react-data-table-component";
import { columnsSelector, structureData } from "./utils_edit";
//import customStyles from "./custom_styles";


import "../Datatables/datatable.css";
import customStyles from "../Datatables/datatableCustomCellStyle";
//import { lang } from "moment";

export const SelectDatatable = ({restorations}) => {



    const [theme, setTheme] = useState("custom-dark");
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [restorationsData, setRestorationsData] = useState([]);

    useEffect(() => {
      let data = [];
      console.log("restorations", restorations);
      for (var i = 0; i < restorations.length; i++) {
       data[i] = structureData(restorations[i]);
       console.log("restorations", restorations[i]);
       console.log("data[i]", data[i]);
      }
      
      setRestorationsData(data);
      console.log("columnSelector", columnsSelector);

    }, [restorations]);



    return (
<>
<div className="container mt-4">
<Datatable
        columns={columnsSelector}
        data={restorationsData.slice((page - 1) * rowsPerPage, page * rowsPerPage)} // 👈 aquí el corte
        pagination
        paginationComponentOptions={{
          rowsPerPageText: "Filas por página:",
          rangeSeparatorText: "de",
        }}
        paginationServer
        paginationTotalRows={restorationsData.length}
        paginationPerPage={rowsPerPage}
        paginationDefaultPage={page}
        onChangePage={(page) => setPage(page)}
        onChangeRowsPerPage={(newPerPage, page) => {
          setRowsPerPage(newPerPage);
          setPage(page);
        }}
        
        noDataComponent={
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100px",
              color: "gray",
            }}
          >
            <InventoryTwoToneIcon sx={{ fontSize: 48, marginBottom: 1 }} />
            <Typography variant="body1">
              No hay registros para mostrar
            </Typography>
          </Box>
        }
        dense
        responsive
        striped
        highlightOnHover
        customStyles={customStyles}
        theme={theme}
      />
</div>
      </>

    )
}