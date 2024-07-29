import { useParams, Link, Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState, createContext, useContext } from 'react';

import SETTINGS from '../Config/settings';
import langData from '../Languages/sp/Lang';
import "./fileColors.css"

// Crea el contexto
const DataContext = createContext();

export const PieceDetail = ({ accessToken , refreshToken }) => {
    const { _id } = useParams();
    const [Data, setData] = useState(null);
    const navigate = useNavigate();
    //const location = useLocation();    
    useEffect(() => {     

        const fetchDetail = async () => {
            var data;
            console.log('accesTokn', accessToken);
            try {
                const url = SETTINGS.URL_ADDRESS.server_url_commands + 'authenticated/user_query/detail/';
                const response = await fetch(url, {
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
                fetchDetail().then(res => {
                    if (res === 'not authenticated' /*|| response === 'not network'*/) {
                        console.log("no ahurotized", res);
                        navigate(`/mnemosine/piece_queries/detail/${encodeURIComponent(_id)}/`);
                    }
                });           

       // console.log('location',location.state.from);

    }, [_id, accessToken, refreshToken, navigate ]);
   
    

    return (
        <DataContext.Provider value={Data}>
            <div className="mt-0">
                <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: 'rgba(0, 100, 180, 0.612)' }}>

                    <div className="container-fluid">
                        <span className="navbar-brand text-dark" style={{ fontSize: '16px' }}>{langData.pieceDetailMenu.nameMenu}</span>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown2" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation" >
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNavDropdown2">
                            <ul className="navbar-nav" style={{ fontSize: '15px' }}>
                                <li className="nav-item">
                                    <Link to="inventory" className="nav-link text-white" aria-current="page">{langData.pieceDetailMenu.inventory}</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="research" className="nav-link text-white" aria-current="page">{langData.pieceDetailMenu.research}</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="restoration" className="nav-link text-white" aria-current="page">{langData.pieceDetailMenu.restoration}</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="movements" className="nav-link text-white" aria-current="page">{langData.pieceDetailMenu.movements}</Link>
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