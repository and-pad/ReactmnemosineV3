import { useEffect, useState, useRef } from 'react';
import { useData } from './inventoryActions';
import { getTranslations } from '../Languages/i18n';
import { API_RequestInventoryEdit } from './APICalls';
const langData = getTranslations();

export const Edit = ({ accessToken, refreshToken }) => {
    const data = useData();
    const [Data, setData] = useState();
    const [Documents, setDocuments] = useState();
    const [Pics, setPics] = useState();
    const [Genders, setGenders] = useState();
    const [Subgenders, setSubgenders] = useState();
    const [formData, setFormData] = useState();
    const [cpFormData, setCpFormData] = useState();    
    const [filteredGenders, setFilteredGenders] = useState();
    const [filteredSubGenders, setFilteredSubGenders] = useState();    
    const refToSave = useRef({});

    const compareFormModifications = (original, modified) => {
        const changes = {};
        for (const key in original) {
            // Aplicar trim a los valores antes de compararlos
            const originalValue = typeof original[key] === 'string' ? original[key].trim() : original[key];
            const modifiedValue = typeof modified[key] === 'string' ? modified[key].trim() : modified[key];           
            
            if (originalValue !== modifiedValue) {               
                    changes[key] = {
                        oldValue: original[key],
                        newValue: modified[key]
                    };
            }
        }
        return changes;
    }
    
    useEffect(() => {
     
        if (data !== undefined) {
            data.piece && setData(data.piece);
            //console.log(data.pics);
            setDocuments(data.documents);
            setPics(data.pics);
            setGenders(data.genders);
            setSubgenders(data.subgenders);

            setFilteredGenders(Genders);
            setFilteredSubGenders(Subgenders);
            const temp = {
                origin_number: data.piece?.origin_number || '',
                inventory_number: data.piece?.inventory_number || '',
                catalog_number: data.piece?.catalog_number || '',
                description_origin: data.piece?.description_origin || '',
                description_inventory: data.piece?.description_inventory || '',                
                gender:{ title : (data.piece?.gender_info && data.piece.gender_info.length > 0) ? data.piece.gender_info[0].title : 'N/D',
                                  _id: data.piece?._id ? data.piece.gender_id : 'N/D',
                },
                subgender: (data.piece?.subgender_info && data.piece.subgender_info.length > 0) ? data.piece.subgender_info[0].title : '',
                type_object: (data.piece?.type_object_info && data.piece.type_object_info.length > 0) ? data.piece.type_object_info[0].title : '',
                dominant_material: (data.piece?.dominant_material_info && data.piece.dominant_material_info.length > 0) ? data.piece.dominant_material_info[0].title : '',
                tags: data.piece?.tags || '',
                appraisal: data.piece?.appraisal || '',
                base_or_frame: data.piece?.base_or_frame || '',
                height: data.piece?.height || '',
                width: data.piece?.width || '',
                depth: data.piece?.depth || '',
                diameter: data.piece?.diameter || '',
                height_with_base: data.piece?.height_with_base || '',
                width_with_base: data.piece?.width_with_base || '',
                depth_with_base: data.piece?.depth_with_base || '',
                diameter_with_base: data.piece?.diameter_with_base || ''
            }
            setFormData(temp);
            setCpFormData(temp);
        }
        
    }, [data, setData, setFormData, setGenders, setSubgenders, setPics, Genders, Subgenders]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value
        }));
    };
    // Función para guardar los cambios (puedes ajustarla para conectarla a una API o manejar el guardado local)
    const handleSave = (e) => {
        e.preventDefault();
        
        const changes = compareFormModifications(cpFormData, formData);        
        const _id = Data._id;        
        
        if (changes) {        
            API_RequestInventoryEdit({ accessToken, refreshToken, _id, changes })
                .then((data) => {
                    console.log("response data again",data);
                });
        }        
    };

    // Filtra las opciones de gender en función de lo que escribe el usuario
    const handleGenderFilter = (e) => {
        const { value } = e.target;
        const filtered = Genders.filter((gender) =>
            gender.title.toLowerCase().includes(value.toLowerCase())
        );
        console.log(filtered[0].title,"filtered");
        setFormData({ ...formData, gender: {title:filtered[0].title,
                                            _id:filtered[0]._id}
                                         });

        // Filtra la lista de genders
      
        console.log(filtered);
        setFilteredGenders(filtered);
    };
    const handleSubGenderFilter = (e) => {
        const { value } = e.target;        

        // Filtra la lista de genders
        const filtered = Subgenders.filter((subgender) =>
            subgender.title.toLowerCase().includes(value.toLowerCase())
        );

        setFormData({ ...formData, subgender: {title:filtered[0].title,
            _id:filtered[0]._id}
         });

        setFilteredSubGenders(filtered);
    };
    const ResetField = (e, fieldName) => {
        e.preventDefault();
        console.log("formData", cpFormData[fieldName]);
       
        if (refToSave.current[fieldName]) {
            refToSave.current[fieldName].value = cpFormData[fieldName];
            setFormData({ ...formData, [fieldName]: cpFormData[fieldName] });
        }
        
    }

    return (
        <div className="container">
      
            <form onSubmit={handleSave}>
                {/* Campos de información general */}
                <div className="row mb-3">
                    <div className="col">
                        <label htmlFor="origin_number" className="form-label">Origin Number</label>
                        <input
                            type="text"
                            className="form-control"
                            id="origin_number"
                            value={formData?.origin_number ? formData?.origin_number : ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="col">
                        <label htmlFor="inventory_number" className="form-label">Inventory Number</label>
                        <input
                            type="text"
                            className="form-control"
                            id="inventory_number"
                            value={formData?.inventory_number ? formData?.inventory_number : ''}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col">
                        <label htmlFor="catalog_number" className="form-label">Catalog Number</label>
                        <input
                            type="text"
                            className="form-control"
                            id="catalog_number"
                            value={formData?.catalog_number ? formData?.catalog_number : ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="col">
                        <label htmlFor="description_origin" className="form-label">Description Origin</label>
                        <input
                            type="text"
                            className="form-control"
                            id="description_origin"
                            value={formData?.description_origin ? formData?.description_origin : ''}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col">
                        <label htmlFor="description_inventory" className="form-label">{langData.pieceDetailDescriptors.inventory.description_inventory}</label>
                        <input
                            type="text"
                            className="form-control"
                            id="description_inventory"
                            value={formData?.description_inventory ? formData?.description_inventory : ''}
                            onChange={handleInputChange}
                            ref={(el) => (refToSave.current["description_inventory"] = el)}
                        />

                        <div className="col mt-1">
                            <button className='btn btn-success btn-sm ms-1' onClick={(e) => ResetField(e, "description_inventory")}>
                                Reset
                            </button>
                        </div>

                    </div>

                </div>

                {/* Campos de información adicional */}
                <div className="row mb-3">

                    <div className="mb-3">
                        <label htmlFor="gender" className="form-label">Gender</label>


                        {/* Selector de Gender */}
                        <select
                            className="form-select mt-2"
                            id="gender"
                            value={formData?.gender ? formData.gender : ''}
                            onChange={handleGenderFilter}
                        >
                            <input
                                type="text"
                                className="form-control"
                                id="gender"
                                value={formData?.gender ? formData.gender : ''}
                                onChange={handleGenderFilter}
                                placeholder="Type to filter genders"
                            />
                            {/*<option value={formData?.gender ? formData.gender : '' }>{filteredGenders?.[0]?.title? filteredGenders[0].title : 'Select Gender' }</option>*/}
                            {filteredGenders?.map((gender, index) => {
                                var put_bg;
                                if (formData.gender) {
                                    if (formData.gender === gender) {
                                        put_bg = true;
                                    } else {
                                        put_bg = false;
                                    }
                                }
                                return (
                                    <option className={put_bg ? 'bg-info' : ''} key={index} value={gender?.title ? gender.title : ''}>
                                        {gender?.title ? gender.title : ''}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    <div className="mb-3">

                        <label htmlFor="subgender" className="form-label">Sub-Gender</label>
                        <input
                            type="text"
                            className="form-control"
                            id="subgender"
                            value={formData?.subgender ? formData.subgender : ''}
                            onChange={handleSubGenderFilter}
                            placeholder="Type to filter sub-genders"
                        />
                        {/* Selector de Gender */}
                        <select
                            type="text"
                            className="form-select mt-2"
                            id="subgender"
                            value={formData?.subgender ? formData.subgender : ''}
                            onChange={handleSubGenderFilter}
                        >
                            <option value="">{filteredSubGenders?.[0]?.title ? filteredSubGenders[0].title : ''}</option>
                            {filteredSubGenders?.map((subgender, index) => (
                                <option key={index} value={subgender.title}>
                                    {subgender.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col">
                        <label htmlFor="type_object" className="form-label">Type of Object</label>
                        <input
                            type="text"
                            className="form-control"
                            id="type_object"
                            value={formData?.type_object ? formData?.type_object : ''}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col">
                        <label htmlFor="dominant_material" className="form-label">Dominant Material</label>
                        <input
                            type="text"
                            className="form-control"
                            id="dominant_material"
                            value={formData?.dominant_material ? formData?.dominant_material : ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="col">
                        <label htmlFor="tags" className="form-label">Tags</label>
                        <input
                            type="text"
                            className="form-control"
                            id="tags"
                            value={formData?.tags ? formData?.tags : ''}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col">
                        <label htmlFor="appraisal" className="form-label">Appraisal</label>
                        <input
                            type="text"
                            className="form-control"
                            id="appraisal"
                            value={formData?.appraisal ? formData?.appraisal : ''}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                {/* Dimensiones sin base */}
                <h5>Dimensions (without base)</h5>
                <div className="row mb-3">
                    <div className="col">
                        <label htmlFor="height" className="form-label">Height</label>
                        <input
                            type="text"
                            className="form-control"
                            id="height"
                            value={formData?.height ? formData?.height : ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="col">
                        <label htmlFor="width" className="form-label">Width</label>
                        <input
                            type="text"
                            className="form-control"
                            id="width"
                            value={formData?.width ? formData?.width : ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="col">
                        <label htmlFor="depth" className="form-label">Depth</label>
                        <input
                            type="text"
                            className="form-control"
                            id="depth"
                            value={formData?.depth ? formData?.depth : ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="col">
                        <label htmlFor="diameter" className="form-label">Diameter</label>
                        <input
                            type="text"
                            className="form-control"
                            id="diameter"
                            value={formData?.diameter ? formData?.diameter : ''}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                {/* Dimensiones con base */}
                <h5>Dimensions (with base)</h5>
                <div className="row mb-3">
                    <div className="col">
                        <label htmlFor="height_with_base" className="form-label">Height with Base</label>
                        <input
                            type="text"
                            className="form-control"
                            id="height_with_base"
                            value={formData?.height_with_base ? formData?.height_with_base : ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="col">
                        <label htmlFor="width_with_base" className="form-label">Width with Base</label>
                        <input
                            type="text"
                            className="form-control"
                            id="width_with_base"
                            value={formData?.width_with_base ? formData?.width_with_base : ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="col">
                        <label htmlFor="depth_with_base" className="form-label">Depth with Base</label>
                        <input
                            type="text"
                            className="form-control"
                            id="depth_with_base"
                            value={formData?.depth_with_base ? formData?.depth_with_base : ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="col">
                        <label htmlFor="diameter_with_base" className="form-label">Diameter with Base</label>
                        <input
                            type="text"
                            className="form-control"
                            id="diameter_with_base"
                            value={formData?.diameter_with_base ? formData?.diameter_with_base : ''}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                {/* Botón para guardar */}
                <button type="submit" className="btn btn-primary">Save</button>
            </form>
        </div>
    );
}