
import { useData } from './PieceDetail';
import langData from '../Languages/sp/Lang';

export const Inventory = () => {

    const data = useData();
    const item = Array.isArray(data) && data.length > 0 ? data[0] : null;
    const movements = item?.all_movements_info ? item.all_movements_info : null;

    // Verifica si data es un arreglo y tiene al menos un elemento
    return (
        <>
            <h6>Inventario</h6>

            <div class="container">
                <div class="row justify-content-center ">
                    <div class="col-12 text-center d-flex flex-column flex-md-row justify-content-center">
                        <p class="mb-2 mb-md-0 mx-md-2">{langData.pieceDetailDescriptors.inventory.inventory_number} : {item?.inventory_number ? item.inventory_number : 'N/D'}</p>
                        <p class="mb-2 mb-md-0 mx-md-2">{langData.pieceDetailDescriptors.inventory.catalog_number} : {item?.catalog_number ? item.catalog_number : "N/D"}</p>
                        <p class="mb-2 mb-md-0 mx-md-2">{langData.pieceDetailDescriptors.inventory.origin_number} : {item?.origin_number ? item.origin_number : "N/D"}</p>
                    </div>
                </div>
            </div>

            <pre>{item?.inventory_number ? item.inventory_number : 'N/D'}</pre>
            <pre>{JSON.stringify(item, null, 2)}</pre>

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