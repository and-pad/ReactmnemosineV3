import { useData } from './inventoryActions';




export const Edit = () =>{
    const data = useData();

    return(
        <>
        {data}

        </>
    )

}