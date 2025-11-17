
import { TextField, Paper } from "@mui/material";

export const Field =({formDataRestoration, handleInputChange, ID, Label}) => {
  //console.log("ID", ID)
  //console.log("Data", formDataRestoration[ID])

return(
<div className="row">
        <Paper
          elevation={6}
          sx={{
            paddingLeft: 1,
            paddingRight: 1,
            paddingBottom: 0,
            paddingTop: 1,
            marginRight: 1,
            marginBottom: 1,
          }}
        >
          <div className="mb-2">
            <TextField
              id={ID}
              variant="outlined"
              fullWidth
              label={Label}
              multiline
              size="small"
              rows={1}
              value={formDataRestoration?.[ID] || ""}
              onChange={(e) => {
                handleInputChange(e);
                // Ajusta la altura del textarea:
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
              sx={{
                "& .MuiInputLabel-root": {
                  color: "#6c757d", // Label en gris
                },
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#ffffff",
                  
                },
                "& textarea": {
                  resize: "none", // Evita redimensionar manualmente
                  overflow: "hidden", // Sin barra de desplazamiento
                  
                  marginBottom: -.3,
                  marginTop: -.4,
                  
                },
              }}
            />
          </div>
        </Paper>
      </div>
)
}