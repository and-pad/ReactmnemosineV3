
import { useData } from './PieceDetail';

export const Inventory = () => {

    const data = useData();
    const item = Array.isArray(data) && data.length > 0 ? data[0] : null;
    // Verifica si data es un arreglo y tiene al menos un elemento


    return (
        <>
            <h6>Inventario</h6>
            <pre>{item?.inventory_number ? item.inventory_number : 'N/D'}</pre>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </>
    );
};
export const Research = () => {
    const data = useData();
    const item = Array.isArray(data) && data.length > 0 ? data[0] : null;
    return (
        <>
            <h6>Investigación</h6>
            <pre>{item?.research_info.title ? item.research_info.title : 'N/D'}</pre>
        </>
    );

};

export const Restoration = () => {

    return (<h6>Restauración</h6>);

};

export const Movements = () => {

    return (<h6>Movimientos</h6>);

};