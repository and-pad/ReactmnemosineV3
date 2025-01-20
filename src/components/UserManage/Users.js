import { useState, useEffect, useContext, createContext } from 'react';
import { API_RequestUsers, API_InactiveUser } from './ApiCalls';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { Button, IconButton } from '@mui/material'; // Botón de Material UI

const DataContext = createContext();

export function UsersNavBar({refreshToken, accessToken}) {

    
    return (
      <nav
        className="navbar navbar-expand-lg navbar-dark"
        style={{ backgroundColor: 'rgba(0, 100, 180, 0.612)' }}
      >
        <div className="container-fluid">
          <span
            className="navbar-brand text-dark"
            style={{ fontSize: '16px' }}
          >
            Usuarios
          </span>
  
          <Button
            variant="contained"
            color="primary"
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown2"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </Button>
  
          <div className="collapse navbar-collapse" id="navbarNavDropdown2">
            <ul className="navbar-nav" style={{ fontSize: '12px' }}>
              <Button variant="text" color="disabled">
                <li className="nav-item" style={{ fontSize: '11px', margin: '-5px' }}>
                  <Link
                    to="users_active"
                    className="nav-link text-white"
                    aria-current="page"
                  >
                    Usuarios activos
                  </Link>
                </li>
              </Button>
  
              <Button variant="text" color="disabled">
                <li className="nav-item" style={{ fontSize: '11px', margin: '-5px' }}>
                  <Link
                    to="users_inactive"
                    className="nav-link text-white"
                    aria-current="page"
                  >
                    Usuarios inactivos
                  </Link>
                </li>
              </Button>
            </ul>
          </div>
  
          {/* Botón para agregar usuario */}
          <div style={{ marginRight: '50px' }}>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              style={{ marginLeft: '1rem' }}
              
            >
              <Link
                    to="new_user"
                    className="nav-link text-white"
                    aria-current="page"
                  >
                    Agregar Usuario
              </Link>
            </Button>
          </div>
        </div>
      </nav>
    );
  }

const fetchUsers = async (setUserActiveData, setUserInactiveData, accessToken, refreshToken, setRoles) => {
    API_RequestUsers({ accessToken, refreshToken }).then((data) => {
        const { users_active, users_inactive, roles } = data;

        // Establecer los datos en los respectivos estados
        setUserActiveData(users_active);
        setUserInactiveData(users_inactive);
        setRoles(roles);
        console.log(data);


    });
}


export function UserManageDataTable({ accessToken, refreshToken }) {
    const [userData, setUserData] = useState([]);
    const [userActiveData, setUserActiveData] = useState([]);
    const [userInactiveData, setUserInactiveData] = useState([]);
    const [roles, setRoles] = useState([]);



    const editClick = ({ _id, navigate }) => {
        navigate(`/mnemosine/administration/user_manage/$0{encodeURIComponent(_id)}/edit`)
    }


    useEffect(() => {
        fetchUsers(setUserActiveData, setUserInactiveData, accessToken, refreshToken, setRoles);
    }, []);

    const columns_active_users = [
        {
            id: 'Username',
            name: 'Nombre',
            selector: row => row["user"],
            show: true,
            sortable: true,
        },
        {
            id: 'Email',
            name: 'Correo',
            selector: row => row["email"],
            show: true,
            sortable: true,
        },
        {
            id: 'Rol',
            name: 'Rol',
            selector: row => row["rol"],
            show: true,
            sortable: true,
        },

        {
            id: "Actions",
            name: "Acciones",
            selector: (row) => row["actions"],
            cell: row => <UsersActions row={row} setUserActiveData={setUserActiveData} setUserInactiveData={setUserInactiveData} accessToken={accessToken} refreshToken={refreshToken} setRoles={setRoles}/>,
        },
        {
            id: '_id',
            name: 'ID',
            selector: row => row["_id"],
            omit: true,

        },


    ];

    const columns_inactive_users = [

        {
            id: 'Username',
            name: 'Nombre',
            selector: row => row["user"],
            show: true,
            sortable: true,
        },
        {
            id: 'Email',
            name: 'Correo',
            selector: row => row["email"],
            show: true,
            sortable: true,
        },
        {
            id: 'Rol',
            name: 'Rol',
            selector: row => row["rol"],
            show: true,
            sortable: true,
        },

        {
            id: "Actions",
            name: "Acciones",
            selector: (row) => row["actions"],
            cell: row => <UsersActions row={row} />,
        },
        {
            id: '_id',
            name: 'ID',
            selector: row => row["_id"],
            omit: true,

        },
        {
            id: 'deletable',
            name: 'Deletable',
            selector: row => row["deletable"],
            cell: row => <div>{row["deletable"] ? "Si" : "No"}</div>,
            sortable: true,

        }


    ];
    return (
        <>
            <DataContext.Provider value={{ userActiveData, userInactiveData, columns_active_users, columns_inactive_users,setUserActiveData,setUserInactiveData, fetchUsers, setRoles, roles  }}>
                <UsersNavBar accessToken={accessToken} refreshToken={refreshToken} />

                <Outlet />

            </ DataContext.Provider>

        </>
    );

}

const UserModal = ({ row, setUserActiveData, setUserInactiveData, accessToken, refreshToken, setRoles }) => {
    const { _id, user, email, rol } = row;
    console.log("row", row);

    // Inactivar un usuario
    const handleInactivateUser = async () => {
        try {
            const data = await API_InactiveUser({ accessToken, refreshToken, user_id: _id });
            console.log(data);
            if (data["response"] === "record_changed") {
                console.log("Usuario inactivado correctamente.");

                // Aquí puedes volver a cargar los usuarios desde la API
                fetchUsers(setUserActiveData, setUserInactiveData, accessToken, refreshToken, setRoles);
            } else {
                console.error("No se pudo inactivar el usuario.");
            }
        } catch (error) {
            console.error("Error al inactivar el usuario:", error);
        }
    };

    return (

        <div className="modal fade text-dark" id={`UsersActiveModal${_id}`} tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Desactivar usuario</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body text-center">
                        <p>
                            Esto desactivará, pero no borrará, al siguiente usuario:
                        </p>
                        <ul className="list-unstyled">
                            <li>
                                <strong>Usuario:</strong> {user}
                            </li>
                            <li>
                                <strong>Correo:</strong> {email}
                            </li>
                            <li>
                                <strong>Rol:</strong> {rol}
                            </li>
                        </ul>
                        <p className="mt-3">
                            <strong>¿Estás seguro?</strong>
                        </p>
                    </div>
                    <div className="modal-footer">
                        <Button className='me-2' size="small" variant="contained" color='action' data-bs-dismiss="modal">Cerrar</Button>
                        <Button size="small" variant="contained" type="button" data-bs-dismiss="modal" onClick={() => handleInactivateUser({ _id })} >Enviar</Button>
                    </div>
                </div>
            </div>
        </div>

    );
}

const UsersActions = ({ row, setUserActiveData, setUserInactiveData, accessToken, refreshToken, setRoles }) => {

    const _id = row._id

    // console.log("row", _id);
    const navigate = useNavigate();


    return (
        <>
            <div className="d-flex justify-content-around">
                <IconButton variant='outlined' color="primary" size="small" className=" me-1"  >
                    <i className="fas fa-edit"></i>
                </IconButton>
                <IconButton variant="" color="error" size="small" data-bs-toggle="modal" data-bs-target={`#UsersActiveModal${_id}`} >
                    <i className="fas fa-trash"></i>
                </IconButton>
            </div>
            <UserModal row={row} setUserActiveData={setUserActiveData} setUserInactiveData={setUserInactiveData} accessToken={accessToken} refreshToken={refreshToken} setRoles={setRoles}/>
        </>
    );

}

export const useData = () => useContext(DataContext);

