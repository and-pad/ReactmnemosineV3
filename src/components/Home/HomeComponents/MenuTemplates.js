
import { Link, Outlet, useNavigate } from 'react-router-dom';
//import langData from '../../Languages/en/Lang';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './MenuTemplates.css'; // Asegúrate de importar los estilos CSS
//import "bootstrap/dist/css/bootstrap.min.css";
//import "bootstrap/dist/js/bootstrap.bundle.min";
import { ReactComponent as Logo } from "../../../mnemo.svg";

import { getTranslations, setLanguage } from '../../Languages/i18n';

const langData = getTranslations();


export function TopNavBar({ user, permissions, handleLogout }) {
    const changeLang = (lang) => {
        const reload = setLanguage(lang);
        reload && window.location.reload();
    }
    console.log(permissions, 'desde aca');

    const navigate = useNavigate();

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark " style={{ backgroundColor: 'rgba(0, 90, 145, 0.912)' }}>

                <div className="container-fluid">
                    <Logo style={{ height: "40px", width: "40px" }} />
                    <span className="navbar-brand text-dark" >Mnemosine</span>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavDropdown">
                        <ul className="navbar-nav">

                            <li className="nav-item">
                                <Link to="/mnemosine/start" className="nav-link text-white" aria-current="page">
                                    <i className="bi bi-eyeglasses"></i> {langData.StartMenu.home}
                                </Link>
                            </li>
                            {permissions.includes('ver_consultas') ? (

                                <li className="nav-item">
                                    <Link to="/mnemosine/piece_queries" className="nav-link text-white" >{langData.StartMenu.queries}</Link>
                                </li>
                            ) : null
                            }

                            {permissions.includes('ver_inventario') ? (

                                <li className="nav-item">
                                    <Link to='/mnemosine/inventory_queries' className="nav-link text-white" >{langData.StartMenu.inventory}</Link>
                                </li>

                            ) : null}

                            {permissions.includes('ver_research') ? (
                                <li className="nav-item">
                                    <Link to='/mnemosine/research' className="nav-link text-white" >{langData.StartMenu.research}</Link>
                                </li>
                            ) : null
                            }


                            {permissions.includes('ver_restauracion') ? (
                                <li className="nav-item">
                                    <Link to='/mnemosine/restoration' className="nav-link text-white" >{langData.StartMenu.restoration}</Link>
                                </li>
                            ) : null
                            }





                            {permissions.includes('ver_movimientos') ? (

                                <li className="nav-item dropdown">
                                    <div className="nav-link dropdown-toggle text-white" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        {langData.StartMenu.movements}
                                    </div>
                                    <ul className="dropdown-menu bg-info" aria-labelledby="navbarDropdownMenuLink">
                                        <li><Link to='/mnemosine/movements/manage' className="dropdown-item" >{langData.StartMenu.manage}</Link></li>
                                        <li><Link to='/mnemosine/movements/loans' className="dropdown-item" >{langData.StartMenu.loans}</Link></li>
                                        <li><Link to='/mnemosine/movements/search' className="dropdown-item" >{langData.StartMenu.search}</Link></li>
                                        <li><Link to='/mnemosine/movements/institutions' className="dropdown-item" >{langData.StartMenu.institutions}</Link></li>
                                        <li><Link to='/mnemosine/movements/contacts' className="dropdown-item" >{langData.StartMenu.contacts}</Link></li>
                                        <li><Link to='/mnemosine/movements/venues' className="dropdown-item" >{langData.StartMenu.venues}</Link></li>

                                    </ul>
                                </li>

                            ) : null
                            }

                            {permissions.includes('ver_reportes') ? (
                                <li className="nav-item">
                                    <Link to='/mnemosine/reports' className="nav-link text-white" >{langData.StartMenu.reports}</Link>
                                </li>
                            ) : null
                            }

                            {permissions.includes('ver_avaluos') ? (
                                <li className="nav-item">
                                    <Link to='/mnemosine/appraisals' className="nav-link text-white" >{langData.StartMenu.appraisals}</Link>
                                </li>
                            ) : null
                            }

                            <li className="nav-item dropdown">
                                <div className="nav-link dropdown-toggle text-white" id="navbarDropdownLang" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    {langData.StartMenu.language}
                                </div>
                                <ul className="dropdown-menu bg-info" aria-labelledby='navbarDropDownLang'>
                                    <li className="dropdown-item" onClick={() => changeLang('sp')}>{langData.LangDispo.spanish}</li>
                                    <li className="dropdown-item" onClick={() => changeLang('en')}>{langData.LangDispo.english}</li>
                                </ul>

                            </li>

                            {['ver_usuarios', 'ver_roles', 'ver_catalogos', 'ver_configuraciones'].some(perm => permissions.includes(perm)) && (
                                <li className="nav-item dropdown">
                                    <div className="nav-link dropdown-toggle text-white" id="navbarDropdownAdmin" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        {langData.StartMenu.administration}
                                    </div>
                                    <ul className="dropdown-menu bg-info" aria-labelledby="navbarDropdownAdmin">

                                        {/* Sección de Usuarios */}
                                        {['ver_usuarios', 'ver_roles'].some(perm => permissions.includes(perm)) && (
                                            <li className="nav-item dropdown">
                                                <div className="dropdown-item dropdown-toggle" id="navbarDropdownUsers" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                    <i className="nav-icon icon-user"></i> {langData.StartMenu.users}
                                                </div>
                                                <ul className="dropdown-menu bg-info" aria-labelledby="navbarDropdownUsers">
                                                    {permissions.includes('ver_usuarios') && (
                                                        <li className="dropdown-item">
                                                            <Link to="/mnemosine/administration/user_manage" className="dropdown-item">
                                                                <i className="nav-icon fa fa-cogs"></i> {langData.StartMenu.manage}
                                                            </Link>
                                                        </li>
                                                    )}
                                                    {permissions.includes('ver_roles') && (
                                                        <li className="dropdown-item">
                                                            <Link to="/mnemosine/administration/user_roles" className="dropdown-item">
                                                                <i className="nav-icon icon-people"></i> {langData.StartMenu.roles}
                                                            </Link>
                                                        </li>
                                                    )}
                                                </ul>
                                            </li>
                                        )}

                                        {/* Sección de Catálogos */}
                                        {permissions.includes('ver_catalogos') && (
                                            <li className="nav-item dropdown">
                                                <div className="dropdown-item dropdown-toggle" id="navbarDropdownCatalogs" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                    <i className="nav-icon icon-notebook"></i> {langData.StartMenu.catalogs}
                                                </div>
                                                <ul className="dropdown-menu bg-info" aria-labelledby="navbarDropdownCatalogs">
                                                    <li className="dropdown-item">
                                                        <Link to="/mnemosine/administration/catalogs_manage" className="dropdown-item">
                                                            <i className="nav-icon fa fa-cogs"></i> {langData.StartMenu.manage}
                                                        </Link>
                                                    </li>
                                                    <li className="dropdown-item">
                                                        <Link to="/mnemosine/administration/catalog_genres" className="dropdown-item">
                                                            <i className="nav-icon icon-layers"></i> {langData.StartMenu.genres}
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </li>
                                        )}

                                    </ul>
                                </li>
                            )}




                            <span className="navbar-text">
                                {langData.StartMenu.connected_user} {user}
                            </span>
                            <span >
                                <button className="btn btn-sm btn-secondary" onClick={() => handleLogout({navigate})}>Log out</button>
                            </span>

                        </ul>
                    </div>
                </div>
            </nav >
            <Outlet />
        </>
    );
}

/*
export function SideBar() {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);


    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 800) {
                setIsSidebarCollapsed(true);
            } else {
                setIsSidebarCollapsed(false);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    function lista() {
        var menu = document.getElementById('menuInicio');
        if (menu) {
            menu.classNameList.toggle('otra');
        } else {

            console.log("Elemento con ID 'menuInicio' no encontrado en el DOM.");
        }

    }
    return (
        <div classNameName={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
            <ul className='elementsgroup'>
                <li id="Inicio">
                    <i className="fas fa-landmark"></i>
                    <a id="Bid" href="#Inicio" onClick={lista} >Inicio</a>
                    <ul id="menuInicio" className="">
                        <li><a href="#d">Version1</a></li>
                        <li><a href="#d">Version2</a></li>
                        <li><a href="#d">Version3</a></li>
                    </ul>
                </li>
                <li>
                    <i className="fas fa-pen-nib"></i>
                    <a href="#Consultas">Consultas</a></li>
                <li>
                    <i className="fas fa-book-open" ></i>
                    <a href="#services">Investigación</a>
                </li>
                <li>
                    <i className="fas fa-hammer"></i>
                    <a href="#contact">Restauración</a>
                </li>
                <li>
                    <i className="fas fa-truck"></i>
                    <a href="#contact">Movimientos</a>
                </li>
                <li>
                    <i className="fa fa-file-invoice"></i>
                    <a href="#contact">Reportes</a>
                </li>
                <li>
                    <i className="fa fa-comment-dollar"></i>
                    <a href="#contact">Avalúos</a>
                </li>


            </ul>
            <button id="toggleButton" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>
                <i className='fas fa-chevron-left'></i>
            </button>
        </div>
    );
}

*/
