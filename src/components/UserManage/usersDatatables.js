import React, { useState , useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from './Users';
import Datatable from 'react-data-table-component';
//import Box from '@mui/material/Box'; // Para el contenedor estilizado
//import Typography from '@mui/material/Typography'; // Para el texto
//import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined'; 
import InventoryTwoToneIcon from '@mui/icons-material/InventoryTwoTone';
import { Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { createTheme } from 'react-data-table-component';
import { API_NewUser } from './ApiCalls';
//import { Button } from '@mui/material'; // Botón de Material UI
//import { useState } from 'react';
//import initializeThemes from '../Datatables/datatables_themes/dataTables_themes';
//import { create } from 'qrcode';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid2
} from '@mui/material';
// Crear un tema personalizado

createTheme('custom-dark', {
  text: {
    primary: '#FFFFFF', // Color del texto principal
    secondary: '#FFFFFF', // Color del texto secundario
  },
  background: {
    default: '#535353', // Fondo general del modo oscuro
  },
  context: {
    background: '#383838', // Fondo del contexto (como al seleccionar filas)
    text: '#FFFFFF',
  },
  divider: {
    default: '#bababa', // Color de los divisores
  },
  button: {
    default: '#1f1f1f', // Color de botones
    hover: '#FFFFFF', // Color de hover en botones
    focus: '#757575', // Color de focus en botones
  },
  highlightOnHover: {
    default: '#2a2a2a', // Color al pasar el cursor sobre una fila
    text: '#FFFFFF',
  },
  striped: {
    default: '#5e5e5e', // Fondo de filas alternas (ajusta este valor)
    text: '#FFFFFF',
  },
});

createTheme('custom-light', {
  text: {
    primary: '#4f4f4f',  // Texto principal más gris
    secondary: '#6c6c6c',  // Texto secundario más gris
  },
  background: {
    default: '#E6E6E6',  // Fondo general con un gris suave
  },
  context: {
    background: '#D3D3D3',  // Fondo del contexto un poco más oscuro
    text: '#333333',  // Texto en contexto más oscuro para contraste
  },
  divider: {
    default: '#B0B0B0',  // Líneas divisorias más sutiles
  },
  button: {
    default: '#626262',  // Fondo por defecto de botones
    hover: '#929292',  // Hover con un gris más marcado
    focus: '#B3B3B3',  // Focus en un gris medio
  },
  highlightOnHover: {
    default: '#F4F4F4',  // Color al pasar el cursor sobre una fila (gris muy suave)
    text: '#333333',  // Texto resaltado en gris oscuro
  },
  striped: {
    default: '#F0F0F0',  // Fondo de filas alternas (gris muy suave)
    text: '#333333',  // Texto en las filas alternas (gris oscuro)
  },
  buttonActive: {
    default: '#D3D3D3',  // Fondo de botón activo más claro
    text: '#333333',  // Texto en botón activo
  }
});


export const ActiveUsersDatatable = () => {
  const [theme, setTheme] = useState('custom-dark'); // Estado para el tema

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'custom-light' ? 'custom-dark' : 'custom-light'));
  };

  const { userActiveData, columns_active_users } = useData();
  console.log("check", userActiveData);

  return (
    <div className="container mb-3">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
        padding={1}
        borderBottom="1px solid #ccc"
      >
        <Typography variant="h5" component="h1" fontWeight="bold">
          Usuarios Activos
        </Typography>
        <Button sx={{ textTransform: 'none' }}
          variant="contained" color="primary" onClick={toggleTheme}>
          Tema
        </Button>
      </Box>

      <Datatable
        columns={columns_active_users}
        data={userActiveData}
        pagination
        paginationComponentOptions={{
          rowsPerPageText: "Filas por página:",
          rangeSeparatorText: "de",
        }}
        noDataComponent={
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100px',
              color: 'gray',
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
        theme={theme}
      />
    </div>
  );
}

export const InactiveUsersDatatable = () => {

  const { userInactiveData, columns_inactive_users } = useData();

  return (
    <div className="mb-3">
      Usuarios Borrables
      <Datatable
        columns={columns_inactive_users}
        data={userInactiveData}
        pagination
        dense
        responsive

        striped
        highlightOnHover
        theme='light'

      />
    </div>
  );
}

export const CreateUserForm = ({ accessToken, refreshToken }) => {
  const { setUserInactiveData, setUserActiveData, fetchUsers, setRoles, roles } = useData();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  useEffect(() => {
  console.log("roles", roles[0]?.name || '');
  setFormData({
    ...formData,
    role : 8
  });
  console.log("ver",{
    ...formData,
    role : roles[0]?.name || ''
  })
}, [roles]);
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    handleNewUser({ formData });

  };
  const handleNewUser = async ({ formData }) => {
    try {
      const data = await API_NewUser({ accessToken, refreshToken, formData });
      console.log(data);
      if (data["message"] === "new_user_added") {
        console.log("Nuevo usuario agregado");

        // Aquí puedes volver a cargar los usuarios desde la API
        fetchUsers(setUserActiveData, setUserInactiveData, accessToken, refreshToken, setRoles);
        navigate('/mnemosine/administration/user_manage/user/users_active');
      } else {
        console.error("No se pudo inactivar el usuario.");
      }
    } catch (error) {
      console.error("Error al inactivar el usuario:", error);
    }
  };


  return (
    <Grid2 container justifyContent="center" alignItems="center" style={{ minHeight: '50vh', minWidth: '650px' }}>
      <Grid2 item xs={12} sm={10} md={8} lg={6}>
        <Paper elevation={3} sx={{ padding: 4, width: '450px', margin: '0 auto' }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Crear Nuevo Usuario
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                label="Nombre"
                name="name"
                variant="outlined"
                fullWidth
                required
                value={formData.name}
                onChange={handleChange}
              />
              <TextField
                label="Correo Electrónico"
                name="email"
                type="email"
                variant="outlined"
                fullWidth
                required
                value={formData.email}
                onChange={handleChange}
              />
              <TextField
                label="Contraseña"
                name="password"
                type="password"
                variant="outlined"
                fullWidth
                required
                value={formData.password}
                onChange={handleChange}
              />
              {/* Campo para seleccionar el Rol */}
              <FormControl fullWidth required>
                <InputLabel>Rol</InputLabel>
                <Select
                  label="Rol"
                  name="role"
                  value={formData.role || ''}
                  onChange={handleChange}
                >
                  {roles.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.name} {/* Aquí solo renderizas el name */}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>


              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                sx={{ mt: 2 }}
              >
                Crear Usuario
              </Button>
            </Box>
          </form>
        </Paper>
      </Grid2>
    </Grid2>
  );
};
