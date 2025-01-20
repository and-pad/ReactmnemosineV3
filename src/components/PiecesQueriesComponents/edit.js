import { useEffect, useState, useRef, useCallback } from 'react';
import { useData } from './inventoryActions';
import { getTranslations } from '../Languages/i18n';
import { API_RequestInventoryEdit, API_SendApprovralDecision } from './APICalls';
import "./edit.css";
import SETTINGS from "../Config/settings";
import 'react-dropzone-uploader/dist/styles.css';
//import Dropzone from 'react-dropzone-uploader';
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min";
import { formatSize, fileTypes, mimeIcons, colorFile } from '../LocalTools/tools';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Dropzone from 'react-dropzone'


const langData = getTranslations();

export const Edit = ({ accessToken, refreshToken }) => {
    //definiciones para manejar los cambios
    const data = useData();
    const [Data, setData] = useState();
    const [Genders, setGenders] = useState();
    const [Subgenders, setSubgenders] = useState();
    const [formData, setFormData] = useState();
    const [actualFormData, setCpFormData] = useState();
    const [filteredGenders, setFilteredGenders] = useState();
    const [filteredSubGenders, setFilteredSubGenders] = useState();
    const [TypeObject, setTypeObject] = useState();
    const [filteredTypeObject, setfilteredTypeObject] = useState();
    const [DominantMaterial, setDominantMaterial] = useState();
    const [filteredDominantMaterial, setFilteredDominantMaterial] = useState();
    const refToSave = useRef({});
    const [isModified, setIsModified] = useState();
    const [tags, setTags] = useState([]);
    const [editTag, setEditTag] = useState('');
    const [currentTag, setCurrentTag] = useState('');
    const [Pics, setPics] = useState();//Estas imagenes van cambiando conforme se escribe sobre ellas    
    const [actualPics, setCpPics] = useState();//Estas se mantienen como estaban para hacer la comparación
    const [currentImgIndex, setCurrentImgIndex] = useState(0);//el indice para navegar entre imagenes
    const [currentPic, setCurrentPic] = useState();//la imagen que se muestra actualmente
    const [changedPics, setchangedPics] = useState();
    const [changedDocs, setchangedDocs] = useState();
    const [isDataLoaded, setIsDataLoaded] = useState(false); // Estado para verificar si los datos ya fueron cargados

    const [currentDoc, setCurrentDoc] = useState();
    const [currentDocIndex, setCurrentDocIndex] = useState(0);

    const [Documents, setDocuments] = useState();
    const [actualDocs, setCpDocs] = useState();

    const image_path = SETTINGS.URL_ADDRESS.server_url + SETTINGS.URL_ADDRESS.inventory_thumbnails;

    const handlePrev = () => {
        setCurrentImgIndex((prevIndex) => (prevIndex === 0 ? Pics.length - 1 : prevIndex - 1));
        setCurrentPic(Pics && Pics.length > 0 ? Pics[currentImgIndex] : null);
    };

    const handleNext = () => {
        setCurrentImgIndex((prevIndex) => (prevIndex === Pics.length - 1 ? 0 : prevIndex + 1));
        setCurrentPic(Pics && Pics.length > 0 ? Pics[currentImgIndex] : null);
    };


    const handlePrevDoc = () => {
        setCurrentDocIndex((prevIndex) => (prevIndex === 0 ? Documents.length - 1 : prevIndex - 1));
        setCurrentDoc(Documents && Documents.length > 0 ? Documents[currentDocIndex] : null);
    };
    const handlenextDoc = () => {
        setCurrentDocIndex((prevIndex) => (prevIndex === Documents.length - 1 ? 0 : prevIndex + 1));
        setCurrentDoc(Documents && Documents.length > 0 ? Documents[currentDocIndex] : null);

    };




    useEffect(() => {

        if (data !== undefined) {

            if (data.piece) {
                setData(data.piece);
                setDocuments(data.documents);
                setGenders(data.genders);
                setSubgenders(data.subgenders);
                setTypeObject(data.type_object);
                setfilteredTypeObject(TypeObject);
                setDominantMaterial(data.dominant_material);
                setFilteredDominantMaterial(DominantMaterial);
                setFilteredGenders(Genders);
                setFilteredSubGenders(Subgenders);
                // Si no hacemos esta revision si hay un cambio en los datos se reinician los cabios
                // eso no es deseado asi que solo llenamos los datos una vez
                if (!isDataLoaded) {

                    const temp = {
                        origin_number: data.piece?.origin_number || '',
                        inventory_number: data.piece?.inventory_number || '',
                        catalog_number: data.piece?.catalog_number || '',
                        description_origin: data.piece?.description_origin || '',
                        description_inventory: data.piece?.description_inventory || '',
                        gender_id: {
                            title: (data.piece?.gender_info && data.piece.gender_info.length > 0) ? data.piece.gender_info[0].title : 'N/D',
                            _id: data.piece?._id ? data.piece.gender_id : 'N/D',
                        },
                        subgender_id: (data.piece?.subgender_info && data.piece.subgender_info.length > 0) ? data.piece.subgender_info[0].title : '',
                        type_object_id: (data.piece?.type_object_info && data.piece.type_object_info.length > 0) ? data.piece.type_object_info[0].title : '',
                        dominant_material_id: (data.piece?.dominant_material_info && data.piece.dominant_material_info.length > 0) ? data.piece.dominant_material_info[0].title : '',
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

                    setPics(data.pics);

                    setFormData(temp);
                    setCpFormData(temp);
                    setCpPics(data.pics);
                    setCpDocs(data.documents);
                    setIsDataLoaded(true);
                    setIsModified(false);
                    const tagsArray = temp.tags.split(',').map(tag => tag.trim());
                    setTags(tagsArray);
                }
                if (Pics && Pics.length > 0) {
                    setCurrentPic(Pics[currentImgIndex]);
                }



            } else {
                if (data.changes) {
                    setIsModified(true);
                    setData(data);
                }
            }

        }

    }, [data, setData, setFormData, setGenders, setSubgenders, Genders, Subgenders, isModified, DominantMaterial, TypeObject, currentImgIndex]);

    const compareFormModifications = (original, modified) => {
        var changes = {};
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

    const comparePicsModifications = (original, modified) => {
        var changes = {};
        const keys = ["photographer", "photographed_at", "description"];

        for (let i = 0; i < original.length; i++) {
            const originalItem = original[i];
            const modifiedItem = modified[i];
            let isFirstTime = true;

            for (const key of keys) { // Iteramos directamente sobre `keys`
                if (key in originalItem) {
                    const originalValue = typeof originalItem[key] === 'string' ? originalItem[key].trim() : originalItem[key];
                    const modifiedValue = typeof modifiedItem[key] === 'string' ? modifiedItem[key].trim() : modifiedItem[key];

                    if (originalValue !== modifiedValue) {
                        if (!changes[i]) changes[i] = {}; // Asegura que `changes[i]` exista

                        if (isFirstTime) {
                            changes[i]["_id"] = originalItem["_id"]; // Solo asigna `_id` la primera vez
                            isFirstTime = false; // Marca que ya se procesó el primer cambio
                        }

                        changes[i][key] = {
                            oldValue: originalItem[key],
                            newValue: modifiedItem[key]
                        };
                    }
                }
            }
        }

        return changes;
    };

    // compareDocsModifications, igual que comparePicsModifications pero para documentos solo con el campo name
    const compareDocsModifications = (original, modified) => {
        var changes = {};
        const keys = ["name"];

        for (let i = 0; i < original.length; i++) {
            const originalItem = original[i];
            const modifiedItem = modified[i];
            let isFirstTime = true;

            for (const key of keys) { // Iteramos directamente sobre `keys`
                if (key in originalItem) {
                    const originalValue = typeof originalItem[key] === 'string' ? originalItem[key].trim() : originalItem[key];
                    const modifiedValue = typeof modifiedItem[key] === 'string' ? modifiedItem[key].trim() : modifiedItem[key];

                    if (originalValue !== modifiedValue) {
                        if (!changes[i]) changes[i] = {}; // Asegura que `changes[i]` exista

                        if (isFirstTime) {
                            changes[i]["_id"] = originalItem["_id"]; // Solo asigna `_id` la primera vez
                            isFirstTime = false; // Marca que ya se procesó el primer cambio
                        }

                        changes[i][key] = {
                            oldValue: originalItem[key],
                            newValue: modifiedItem[key]
                        };
                    }
                }
            }
        }

        return changes;
    };

    // Función para guardar los cambios (puedes ajustarla para conectarla a una API o manejar el guardado local)
    const handleSave = (e) => {
        e.preventDefault();

        const changes = compareFormModifications(actualFormData, formData);
        const changes_pics_inputs = comparePicsModifications(actualPics, Pics);
        const _id = Data._id;
        console.log("changed Pics", changes_pics_inputs);
        console.log(changes);



        if ((changes && Object.keys(changes).length > 0) || (changes_pics_inputs && Object.keys(changes_pics_inputs).length > 0) || (changedPics && Object.keys(changedPics).length > 0) || (changedDocs && Object.keys(changedDocs).length > 0)) {

            console.log("in");
            API_RequestInventoryEdit({ accessToken, refreshToken, _id, changes, changes_pics_inputs, changedPics, changedDocs })
                .then((data) => {
                    if (data) {
                        console.log("response data again", data);
                    }
                    /*else {
                        setShowModalSaveEmpty(true);
                    }*/
                });
        } else {
            /* const modalElement = document.getElementById("noChangesModal");
             if (modalElement) {
                 const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
                 modal.show();
             }*/



            const modalElement = document.getElementById("noChangesModal");
            if (modalElement) {
                const modal = new Modal(modalElement);
                modal.show();
            }

            /*const modal = new bootstrap.Modal(document.getElementById("noChangesModal"));
            modal.show();*/

        }

    };

    // Filtra las opciones de gender en función de lo que escribe el usuario
    const handleGenderFilter = (e) => {

        const { value } = e.target;
        const filtered = Genders.filter((gender) =>
            gender.title.toLowerCase().includes(value.toLowerCase())
        );
        if (filtered.length > 0) {

            setFormData({
                ...formData, gender_id: {
                    title: filtered[0].title,
                    _id: filtered[0]._id
                }
            });
        }
        setFilteredGenders(filtered);
    };

    const handleTypeObjectFilter = (e) => {

        const { value } = e.target;
        const filtered = TypeObject.filter((type_object) =>
            type_object.title.toLowerCase().includes(value.toLowerCase())
        );
        if (filtered.length > 0) {

            setFormData({
                ...formData, type_object_id: {
                    title: filtered[0].title,
                    _id: filtered[0]._id
                }
            });
        }
        setfilteredTypeObject(filtered);
    };

    const handleDominantMaterialFilter = (e) => {

        const { value } = e.target;
        const filtered = DominantMaterial.filter((dominant_material) =>
            dominant_material.title.toLowerCase().includes(value.toLowerCase())
        );
        if (filtered.length > 0) {

            setFormData({
                ...formData, dominant_material_id: {
                    title: filtered[0].title,
                    _id: filtered[0]._id
                }
            });
        }
        setfilteredTypeObject(filtered);
    };

    const handleSubGenderFilter = (e) => {
        const { value } = e.target;

        // Filtra la lista de genders
        const filtered = Subgenders.filter((subgender) =>
            subgender.title.toLowerCase().includes(value.toLowerCase())
        );
        if (filtered.length > 0) {
            setFormData({
                ...formData, subgender: {
                    title: filtered[0].title,
                    _id: filtered[0]._id
                }
            });
        }

        setFilteredSubGenders(filtered);
    };

    const handleApprovalDecision = (isApproved) => {

        const ID = Data.piece_id
        var data;
        if (ID !== undefined) {
            API_SendApprovralDecision({ accessToken, refreshToken, ID, isApproved }).then((response) => {
                if (response.ok) {
                    setIsModified(false)
                }

            })
            console.log(data);
        }
    }

    const handleTagClick = (index) => {
        // Colocar el tag en el input para permitir su edición
        setCurrentTag(tags[index]);
        setEditTag(index)
    };

    const handleTagDelete = (index) => {
        setTags(tags.filter((_, i) => i !== index)); // Eliminar el tag seleccionado
    };

    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter') {

            if (editTag !== '') {
                const result = tags.map((tag, index) => {
                    var solve = [];
                    if (index !== editTag) {
                        solve[index] = tag;
                    } else {
                        solve[index] = e.target.value;
                    }
                    return solve
                });
                setTags(result);
                setEditTag('');
                setCurrentTag('');
            }
        }
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;

        if (id === "tags") {

            if (value.endsWith(',')) {
                // Agrega el tag sin la coma al final y limpia el currentTag
                setTags([...tags, currentTag.trim()]);
                setCurrentTag('');
            } else {
                setCurrentTag(value); // Actualiza el tag actual mientras se escribe
            }
        }
        else {
            setFormData((prevData) => ({
                ...prevData,
                [id]: value
            }));

        }
    };

    // Actualiza los campos de la imagen seleccionada
    const handleInputPic = (e) => {
        const { id, value } = e.target;
        setPics((prevData) =>
            prevData.map((pic, index) =>
                index === currentImgIndex
                    ? { ...pic, [id]: value } // Crea una copia del objeto actual con el campo actualizado
                    : pic // Retorna el objeto sin cambios si el índice no coincide
            )
        );
    };

    const handleChangeImageStatus = ({ file } ) => {
            console.log(file);   
            //   const updatedPic = { ...currentPic, file }; // Actualiza el archivo en currentPic
            const copyFile = new File([file], file.name, {
                type: file.type,
                lastModified: file.lastModified,
            });
            setchangedPics((prevChangedPics) => ({
                ...prevChangedPics,
                [currentImgIndex]: { "_id": Pics[currentImgIndex]["_id"], "file": copyFile }
            }));
            
        
    };


    const handleChangeDocumentStatus = ({ file, remove }, status) => {
        if (status === 'done') {
            const copyFile = new File([file], file.name, {
                type: file.type,
                lastModified: file.lastModified,
            });
            setchangedDocs((prevChangedDocs) => ({
                ...prevChangedDocs,
                [currentDocIndex]: { "_id": Documents[currentDocIndex]["_id"], "file": copyFile }
            }));
            remove();
        }
    }

    return (
        <>
            {isModified ? (
                <>
                    <div className="container">

                        <table className="table table-bordered table-striped">
                            <thead className="table-dark">
                                <tr>
                                    <th>{langData.pieceInventoryEdit.field}</th>

                                    <th>{langData.pieceInventoryEdit.oldValue}</th>
                                    <th>{langData.pieceInventoryEdit.newValue}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(Data || {}).map(([key, value]) => {
                                    if (key === 'piece_id' || key === 'changes') {
                                        return null; // Omitir esta entrada
                                    }
                                    const name_descriptor = langData.pieceDetailDescriptors.inventory[key]
                                    const exceptions = ["gender_id", "subgender_id"]

                                    return (
                                        <>
                                            {exceptions.includes(key) ? (<tr key={key}>
                                                <td>{name_descriptor}</td>
                                                <td>{value?.oldValue?.title ? value.oldValue.title : "No disponible"}</td>
                                                <td>{value?.newValue?.title ? value.newValue.title : "No disponible"}</td>
                                            </tr>
                                            ) : (<tr key={key}>
                                                <td>{name_descriptor}</td>
                                                <td>{value?.oldValue ? value.oldValue : "No disponible"}</td>
                                                <td>{value?.newValue ? value.newValue : "No disponible"}</td>
                                            </tr>)}
                                        </>
                                    );
                                })}
                            </tbody>
                        </table>
                        <button className='btn btn-primary btn-sm me-3' onClick={() => handleApprovalDecision(true)}>Aprobar cambios</button>
                        <button className='btn btn-secondary btn-sm' onClick={() => handleApprovalDecision(false)} >Descartar cambios</button>

                    </div>
                </>

            ) : (

                <div className="container">

                    <form onSubmit={handleSave}>



                        <div className="card p-4" style={{ background: "#abcc" }}>
                            <div className="row mb-3">

                                <div className="col">

                                    <label htmlFor="origin_number" className="form-label">{langData.pieceDetailDescriptors.inventory.origin_number}</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="origin_number"
                                        value={formData?.origin_number ? formData?.origin_number : ''}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col">
                                    <label htmlFor="inventory_number" className="form-label">{langData.pieceDetailDescriptors.inventory.inventory_number}</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="inventory_number"
                                        value={formData?.inventory_number ? formData?.inventory_number : ''}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col">
                                    <label htmlFor="catalog_number" className="form-label">{langData.pieceDetailDescriptors.inventory.catalog_number}</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="catalog_number"
                                        value={formData?.catalog_number ? formData?.catalog_number : ''}
                                        onChange={handleInputChange}
                                    />
                                </div>

                            </div>

                            <div className="row mb-3">

                                <div className="col">
                                    <label htmlFor="description_origin" className="form-label">{langData.pieceDetailDescriptors.inventory.description_origin}</label>
                                    <textarea
                                        type="text"
                                        className="form-control"
                                        id="description_origin"
                                        value={formData?.description_origin ? formData?.description_origin : ''}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col">
                                    <label htmlFor="description_inventory" className="form-label">{langData.pieceDetailDescriptors.inventory.description_inventory}</label>
                                    <textarea
                                        type="text"
                                        className="form-control"
                                        id="description_inventory"
                                        value={formData?.description_inventory ? formData?.description_inventory : ''}
                                        onChange={handleInputChange}
                                        ref={(el) => (refToSave.current["description_inventory"] = el)}
                                    />
                                </div>
                            </div>

                            <div className="row mb-3">

                                <div className="col mb-3">
                                    <label htmlFor="gender" className="form-label">{langData.pieceDetailDescriptors.inventory.gender}</label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        id="gender"
                                        onChange={handleGenderFilter}
                                        placeholder="Type to filter genders"
                                    />

                                    <select
                                        className="form-select mt-2"
                                        id="gender"
                                        value={formData?.gender_id?.title ? formData.gender_id.title : ''}

                                        onChange={handleGenderFilter}
                                    >

                                        {filteredGenders?.map((gender, index) => {

                                            return (
                                                <option key={index} value={gender?.title ? gender.title : ''}>
                                                    {gender?.title ? gender.title : ''}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>

                                <div className="col mb-3">

                                    <label htmlFor="subgender" className="form-label">{langData.pieceDetailDescriptors.inventory.subgenders_info}</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="subgender"

                                        onChange={handleSubGenderFilter}
                                        placeholder="Type to filter sub-genders"
                                    />

                                    <select
                                        type="text"
                                        className="form-select mt-2"
                                        id="subgender"
                                        value={formData?.subgender_id ? formData.subgender_id : ''}
                                        onChange={handleSubGenderFilter}
                                    >
                                        {filteredSubGenders?.map((subgender, index) => {

                                            return (
                                                <option key={index} value={subgender?.title ? subgender.title : ''}>
                                                    {subgender?.title ? subgender.title : ''}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col">
                                    <label htmlFor="type_object" className="form-label">{langData.pieceDetailDescriptors.inventory.type_object_info}</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="type_object"

                                        onChange={handleTypeObjectFilter}
                                    />
                                    <select
                                        type="text"
                                        className="form-select mt-2"
                                        id="type_object"
                                        value={formData?.type_object_id ? formData.type_object_id : ''}
                                        onChange={handleTypeObjectFilter}
                                    >
                                        {filteredTypeObject?.map((type_object, index) => {

                                            return (
                                                <option key={index} value={type_object?.title ? type_object.title : ''}>
                                                    {type_object?.title ? type_object.title : ''}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>

                                <div className="col">
                                    <label htmlFor="dominant_material" className="form-label">{langData.pieceDetailDescriptors.inventory.dominant_material_info}</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="dominant_material"

                                        onChange={handleDominantMaterialFilter}
                                    />
                                    <select
                                        type="text"
                                        className="form-select mt-2"
                                        id="type_object"
                                        value={formData?.dominant_material_id ? formData.dominant_material_id : ''}
                                        onChange={handleDominantMaterialFilter}
                                    >
                                        {filteredDominantMaterial?.map((dominant_material, index) => {

                                            return (
                                                <option key={index} value={dominant_material?.title ? dominant_material.title : ''}>
                                                    {dominant_material?.title ? dominant_material.title : ''}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>

                            </div>


                            <div className="row mb-3">

                                <div className="col">
                                    <label htmlFor="tags" className="form-label">{langData.pieceDetailDescriptors.inventory.tags}</label>
                                    <div className="tags-input">
                                        {tags.map((tag, index) => (
                                            <span key={index} className="tag" onClick={() => handleTagClick(index)}>
                                                {tag}
                                                <button type="button" onClick={(e) => { e.stopPropagation(); handleTagDelete(index); }} className="delete-tag">x</button>
                                            </span>
                                        ))}
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="tags"
                                            value={currentTag}
                                            onChange={handleInputChange}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault(); // Evita que Enter dispare el submit del formulario
                                                    handleTagKeyDown(e); // Si aún quieres procesar Enter para agregar un tag, llama a tu función aquí
                                                }
                                            }}

                                        />
                                    </div>

                                </div>

                                <div className="col">
                                    <label htmlFor="appraisal" className="form-label">{langData.pieceDetailDescriptors.inventory.appraisal}</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="appraisal"
                                        value={formData?.appraisal ? formData?.appraisal : ''}
                                        onChange={handleInputChange}
                                    />
                                </div>

                            </div>

                            <div className="row mb-3">

                            </div>


                            <h5>Dimensions (without base)</h5>
                            <div className="row mb-3">
                                <div className="col">
                                    <label htmlFor="height" className="form-label">{langData.pieceDetailDescriptors.inventory.height}</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="height"
                                        value={formData?.height ? formData?.height : ''}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col">
                                    <label htmlFor="width" className="form-label">{langData.pieceDetailDescriptors.inventory.width}</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="width"
                                        value={formData?.width ? formData?.width : ''}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col">
                                    <label htmlFor="depth" className="form-label">{langData.pieceDetailDescriptors.inventory.depth}</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="depth"
                                        value={formData?.depth ? formData?.depth : ''}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col">
                                    <label htmlFor="diameter" className="form-label">{langData.pieceDetailDescriptors.inventory.diameter}</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="diameter"
                                        value={formData?.diameter ? formData?.diameter : ''}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>


                            <h5>Dimensions (with base)</h5>
                            <div className="row mb-3">
                                <div className="col">
                                    <label htmlFor="height_with_base" className="form-label">{langData.pieceDetailDescriptors.inventory.height_with_base}</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="height_with_base"
                                        value={formData?.height_with_base ? formData?.height_with_base : ''}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col">
                                    <label htmlFor="width_with_base" className="form-label">{langData.pieceDetailDescriptors.inventory.width_with_base}</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="width_with_base"
                                        value={formData?.width_with_base ? formData?.width_with_base : ''}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col">
                                    <label htmlFor="depth_with_base" className="form-label">{langData.pieceDetailDescriptors.inventory.depth_with_base}</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="depth_with_base"
                                        value={formData?.depth_with_base ? formData?.depth_with_base : ''}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col">
                                    <label htmlFor="diameter_with_base" className="form-label">{langData.pieceDetailDescriptors.inventory.diameter_with_base}</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="diameter_with_base"
                                        value={formData?.diameter_with_base ? formData?.diameter_with_base : ''}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col">
                                <div className="card mt-4" style={{ background: "#abcc" }}>
                                    <div className="card-header text-center" style={{ background: "#99dd" }}>

                                        {langData.pieceInventoryEdit.images}

                                    </div>
                                    <div className="card-body text-center">
                                        <div className="mb-4">

                                            <div className="row">
                                                <div className="col-4">
                                                    <img
                                                        alt="thumbnail"
                                                        src={`${image_path}${currentPic?.file_name ? currentPic.file_name : ''}`}
                                                        className="img-fluid mb-3 rounded"
                                                        style={{ maxHeight: "100px", maxWidth: "100px", }}
                                                        data-bs-toggle="modal"
                                                        data-bs-target={`#modalPicEdit${currentImgIndex}`}
                                                    />
                                                </div>

                                                <div className="col-4">
                                                    {/* <Dropzone
                                                        onChangeStatus={handleChangeImageStatus}
                                                        accept="image/*"
                                                        inputContent={langData.pieceInventoryEdit.uploader_img_sign}
                                                        maxFiles={1}
                                                        multiple={false}
                                                        styles={{
                                                            dropzone: { minHeight: 200, maxHeight: 250 },
                                                            previewImage: { width: '15%', height: '20%' }, // Ajusta el tamaño de la imagen
                                                        }}
                                                    />*/ }


                                                    <Dropzone
                                                        maxFiles={1}
                                                        accept={{
                                                            'image/png': ['.png'],
                                                            'image/jpeg': ['.jpg', '.jpeg'],
                                                            'image/gif': ['.gif'],
                                                            'image/svg+xml': ['.svg'],
                                                            'image/bmp': ['.bmp'],
                                                            'image/tiff': ['.tiff'],
                                                            'image/webp': ['.webp'],

                                                        }}
                                                        onDrop={acceptedFiles => handleChangeImageStatus({ file: acceptedFiles[0] })}
                                                    >
                                                        {({ getRootProps, getInputProps }) => (
                                                            <section className="container-fluid dashed-box">
                                                                <div {...getRootProps({ className: 'dropzone' })}>
                                                                    <input {...getInputProps()} />
                                                                    <p>{langData.pieceInventoryEdit.uploader_img_sign}</p>
                                                                </div>
                                                                
                                                            </section>
                                                        )}

                                                    </Dropzone>
                                                    

                                                </div>

                                                <div className='col-4'>
                                                    {changedPics && changedPics[currentImgIndex] && changedPics[currentImgIndex]["file"] ? (
                                                        <img
                                                            alt="new pic"
                                                            src={URL.createObjectURL(changedPics[currentImgIndex]["file"])}
                                                            className="img-fluid mb-3 rounded"
                                                            style={{ maxHeight: "100px", maxWidth: "100px" }}
                                                            data-bs-toggle="modal"
                                                            data-bs-target={`#modalPicNew${currentImgIndex}`}
                                                        />
                                                    ) : null}

                                                </div>
                                            </div>
                                            <ModalPictures
                                                IDmodal={`modalPicNew${currentImgIndex}`}
                                                picFileName={null}
                                                ObjectImg={changedPics && changedPics[currentImgIndex] && changedPics[currentImgIndex]["file"]
                                                    ? URL.createObjectURL(changedPics[currentImgIndex]["file"])
                                                    : null
                                                }
                                            />
                                            <ModalPictures
                                                IDmodal={`modalPicEdit${currentImgIndex}`}
                                                picFileName={currentPic?.file_name || ''}
                                                ObjectImg={null}
                                            />

                                            <div className="text-start">
                                                <label className="d-block">
                                                    {langData.pieceInventoryEdit.photographer}:
                                                    <input
                                                        id="photographer"
                                                        type="text"
                                                        value={Pics && Pics[currentImgIndex]?.photographer ? Pics[currentImgIndex].photographer : ''}
                                                        className="form-control mt-2"
                                                        onChange={handleInputPic}

                                                    />
                                                </label>
                                                <label className="d-block mt-3">
                                                    {langData.pieceInventoryEdit.photographed_at}:
                                                    <input
                                                        id="photographed_at"
                                                        type="date"
                                                        value={formatDate(Pics && Pics[currentImgIndex]?.photographed_at ? Pics[currentImgIndex].photographed_at : '')}
                                                        className="form-control mt-2"
                                                        onChange={handleInputPic}

                                                    />
                                                </label>
                                                <label className="d-block mt-3">
                                                    {langData.pieceInventoryEdit.description}:
                                                    <textarea
                                                        id="description"
                                                        value={Pics && Pics[currentImgIndex]?.description ? Pics[currentImgIndex].description : ''}
                                                        className="form-control mt-2"
                                                        onChange={handleInputPic}

                                                    />
                                                </label>
                                                <label className="d-block mt-3">
                                                    {langData.pieceInventoryEdit.size}:

                                                    <p className="mt-2">{formatSize(currentPic?.size ? currentPic.size : 0)}</p>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <button type="button" onClick={handlePrev} className="btn btn-secondary">← {langData.pieceInventoryEdit.previous}</button>
                                            <span>{currentImgIndex + 1} / {Pics?.length ? Pics.length : null}</span> {/* Paginación */}
                                            <button type="button" onClick={handleNext} className="btn btn-secondary">{langData.pieceInventoryEdit.next} →</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='row'>
                            <div className="col">
                                <div className="card mt-4" style={{ background: "#abcc" }}>
                                    <div className="card-header " style={{ background: "#99dd" }}>

                                        {langData.pieceInventoryEdit.documents}

                                    </div>
                                    <div className="card-body">
                                        <div className="row">

                                            <div className="col-4">
                                                <div className={`text-${colorFile[fileTypes[Documents && Documents[currentDocIndex]?.mime_type ? Documents[currentDocIndex].mime_type : 'primary']]} mt-3`}>

                                                    <FontAwesomeIcon icon={Documents && Documents[currentDocIndex]?.mime_type ? mimeIcons[Documents[currentDocIndex].mime_type] : ''} size="3x" />

                                                </div>
                                            </div>

                                            <div className="col-4">
                                                {/*  <Dropzone
                                                    onChangeStatus={handleChangeImageStatus}
                                                    accept="image/*"
                                                    inputContent={langData.pieceInventoryEdit.uploader_doc_sign}
                                                    maxFiles={1}
                                                    multiple={false}
                                                    styles={{
                                                        dropzone: { minHeight: 200, maxHeight: 250 },
                                                        previewImage: { width: '15%', height: '20%' }, // Ajusta el tamaño de la imagen
                                                    }}
                                                />
                                                */}
                                            </div>

                                            <div className='col-4'>
                                                {changedDocs && changedDocs[currentDocIndex] && changedDocs[currentDocIndex]["file"] ? (
                                                    <div></div>
                                                ) : null}
                                            </div>
                                        </div>

                                        <div className='text-start'>
                                            <label className="d-block">
                                                {langData.pieceInventoryEdit.name}:
                                                <input
                                                    id="photographer"
                                                    type="text"
                                                    value={Documents && Documents[currentImgIndex]?.name ? Documents[currentImgIndex].name : ''}
                                                    className="form-control mt-2"
                                                />
                                            </label>
                                            <label className="d-block mt-2">
                                                {langData.pieceInventoryEdit.size}:

                                                <p className="mt-2"> {formatSize(Documents && Documents[currentImgIndex]?.size ? Documents[currentImgIndex].size : 0)}</p>

                                            </label>
                                        </div>

                                        <div className="d-flex justify-content-between">
                                            <button type="button" onClick={handlePrevDoc} className="btn btn-secondary">← {langData.pieceInventoryEdit.previous}</button>
                                            <span>{currentDocIndex + 1} / {Documents?.length ? Documents.length : null}</span> {/* Paginación */}
                                            <button type="button" onClick={handlenextDoc} className="btn btn-secondary">{langData.pieceInventoryEdit.next} →</button>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal para mostrar "sin cambios" */}

                        <div
                            className="modal fade"
                            id="noChangesModal"
                            tabIndex="-1"
                            aria-labelledby="noChangesModalLabel"
                            aria-hidden="true"
                        >
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="noChangesModalLabel">Sin cambios detectados</h5>
                                        <button
                                            type="button"
                                            className="btn-close m-1"
                                            data-bs-dismiss="modal"
                                            aria-label="Close"
                                        ></button>
                                    </div>

                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            data-bs-dismiss="modal"
                                        >
                                            Cerrar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary">Save</button>
                    </form>
                </div>)}
        </>
    );
}

// Agrega esta función en el componente para formatear la fecha:
function formatDate(dateTime) {
    return dateTime.split(" ")[0]; // Extrae solo la fecha en formato YYYY-MM-DD
}

const ModalPictures = ({ IDmodal, picFileName, ObjectImg }) => {
    var ImageModal;

    if (ObjectImg === null) {
        ImageModal = SETTINGS.URL_ADDRESS.server_url + SETTINGS.URL_ADDRESS.inventory_full_size + picFileName;
    } else {
        ImageModal = ObjectImg;
    }

    return (
        <div className="modal fade" id={IDmodal} tabIndex="-1" aria-labelledby={`${IDmodal}Label`} aria-hidden="true">
            <div className="modal-dialog modal-lg modal-fullscreen-md-down bg-secondary">
                <div className="modal-content">
                    <div className="modal-body bg-secondary">
                        <button type="button" className="btn-close mt-1 me-1" data-bs-dismiss="modal" aria-label="Close"></button>
                        <div id={`carousel${IDmodal}Fade`} className="carousel slide carousel-fade">
                            <div className="carousel-inner">
                                <img src={ImageModal} className="d-block w-100 mt-3" alt="..." />
                                <hr className="my-4" />
                                {/* Otros detalles */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
