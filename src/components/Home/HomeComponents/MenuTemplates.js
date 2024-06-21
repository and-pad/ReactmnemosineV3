import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import langData from '../../Languages/sp/Lang';

import './MenuTemplates.css'; // Asegúrate de importar los estilos CSS
//import "bootstrap/dist/css/bootstrap.min.css";
//import "bootstrap/dist/js/bootstrap.bundle.min";


export function TopNavBar({ user }) {
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark " style={{ backgroundColor: 'rgba(0, 90, 145, 0.912)' }}>

                <div className="container-fluid">
                    <span className="navbar-brand text-dark" >Mnemosine</span>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavDropdown">
                        <ul className="navbar-nav">
                            <li className="nav-item ">
                                <Link to="/mnemosine" className="nav-link  text-white" aria-current="page" >{langData.StartMenu.home}</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/mnemosine/piece_queries" className="nav-link text-white" >{langData.StartMenu.queries}</Link>
                            </li>
                            <li className="nav-item">
                                <Link to='/mnemosine/inventory' className="nav-link text-white" >{langData.StartMenu.inventory}</Link>
                            </li>
                            <li className="nav-item">
                                <Link to='/mnemosine/research' className="nav-link text-white" >{langData.StartMenu.research}</Link>
                            </li>
                            <li className="nav-item">
                                <Link to='/mnemosine/restoration' className="nav-link text-white" >{langData.StartMenu.restoration}</Link>
                            </li>

                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle text-white" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    {langData.StartMenu.movements}
                                </a>
                                <ul className="dropdown-menu bg-info" aria-labelledby="navbarDropdownMenuLink">
                                    <li><Link to='/mnemosine/movements/manage' className="dropdown-item" >{langData.StartMenu.manage}</Link></li>
                                    <li><Link to='/mnemosine/movements/loans' className="dropdown-item" >{langData.StartMenu.loans}</Link></li>
                                    <li><Link to='/mnemosine/movements/search' className="dropdown-item" >{langData.StartMenu.search}</Link></li>
                                    <li><Link to='/mnemosine/movements/institutions' className="dropdown-item" >{langData.StartMenu.institutions}</Link></li>
                                    <li><Link to='/mnemosine/movements/contacts' className="dropdown-item" >{langData.StartMenu.contacts}</Link></li>
                                    <li><Link to='/mnemosine/movements/venues' className="dropdown-item" >{langData.StartMenu.venues}</Link></li>

                                </ul>
                            </li>
                            <li className="nav-item">
                                <Link to='/mnemosine/reports' className="nav-link text-white" >{langData.StartMenu.reports}</Link>
                            </li>
                            <li className="nav-item">
                                <Link to='/mnemosine/appraisals' className="nav-link text-white" >{langData.StartMenu.appraisals}</Link>
                            </li>

                            <span class="navbar-text">
                                Usuario conectado: {user}
                            </span>
                        </ul>
                    </div>
                </div>
            </nav>
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
