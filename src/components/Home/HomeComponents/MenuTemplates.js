import React, { useState, useEffect } from 'react';
import './MenuTemplates.css'; // Asegúrate de importar los estilos CSS
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";


export function TopNavBar() {
    return (
        <>
            <div className="top-navbar">
                <div className="top-navbar-logo">
                    {/* Contenido del logo */}
                </div>
                <div className="top-navbar-user">
                    <button id="userButton"><i className="fas fa-user"></i></button>
                </div>
            </div>
        </>
    );
}


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
            menu.classList.toggle('otra');
        } else {

            console.log("Elemento con ID 'menuInicio' no encontrado en el DOM.");
        }

    }
    return (
        <div className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
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


