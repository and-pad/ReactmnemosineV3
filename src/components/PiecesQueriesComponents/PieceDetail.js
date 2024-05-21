import { useParams, Link, Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState, createContext, useContext } from 'react';


// Crea el contexto
const DataContext = createContext();

export const PieceDetail = ({ accessToken }) => {
    const { _id } = useParams();
    const [Data, setData] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchDetail = async () => {

            var data;
            try {

                const response = await fetch('http://127.0.0.1:8000/authenticated/user_query/detail/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({ '_id': _id }),
                });

                data = await response.json();
                if (response.ok) {
                    setData(data);
                } else {
                    // Manejar errores de autenticación
                    return 'not authenticated';
                }
            } catch (error) {
                console.log('elerror', error);
                return 'not network';
                // Manejar errores de red
            }
            return null;
        };

        fetchDetail().then(response => {
            if (response === 'not authenticated' /*|| response === 'not network'*/) {
                navigate('/login');
            }
        });
    }, [_id, accessToken, navigate]);


    return (
        <DataContext.Provider value={Data}>
            <div className="mt-0">
                <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: 'rgba(0, 100, 180, 0.612)' }}>

                    <div className="container-fluid">
                        <span className="navbar-brand text-dark" style={{ fontSize: '16px' }}>Detalle de Pieza</span>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown2" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation" >
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNavDropdown2">
                            <ul className="navbar-nav" style={{ fontSize: '15px' }}>
                                <li className="nav-item">
                                    <Link to="inventory" className="nav-link text-white" aria-current="page">Inventario</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="research" className="nav-link text-white" aria-current="page">Investigación</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="restoration" className="nav-link text-white" aria-current="page">Restauración</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="movements" className="nav-link text-white" aria-current="page">Movimientos</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
            <Outlet />

        </DataContext.Provider>
    );
}

export const useData = () => useContext(DataContext);