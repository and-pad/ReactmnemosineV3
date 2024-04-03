import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element, authenticated, ...rest }) => {
    return authenticated ? (
        <>{element}</>
    ) : (
        <Navigate to="/" replace />
    );
};

export default PrivateRoute;