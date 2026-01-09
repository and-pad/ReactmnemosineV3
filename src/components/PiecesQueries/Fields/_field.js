import { Paper, TextField  } from "@mui/material";
export const Field =({formData, handleInputChange, ID, Label}) => {

const value = formData?.[ID] || "";
return (
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
            minRows={1}
            maxRows={200}
            value={value}
  
            onChange={(e) => {
              handleInputChange(e);
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
            sx={{
              "& .MuiInputLabel-root": {
                color: "#6c757d",
              },
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#ffffff",
              },
              "& textarea": {
                resize: "none",
                overflow: "hidden",
                marginBottom: -0.3,
                marginTop: -0.2,
              },
            }}
          />
        </div>
      </Paper>
    </div>
  );

};