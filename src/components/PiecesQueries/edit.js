import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "./inventoryActions";
import { getTranslations } from "../Languages/i18n";
import { API_RequestInventoryEdit } from "./APICalls";
import "./edit.css";
import SETTINGS from "../Config/settings";
import "react-dropzone-uploader/dist/styles.css";
//import Dropzone from 'react-dropzone-uploader';
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min";
import {
  formatSize,
  fileTypes,
  mimeIcons,
  colorFile,
} from "../LocalTools/tools";
import { faBan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Dropzone from "react-dropzone";
import { IconButton, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { pink } from "@mui/material/colors";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ModifiedOutlet from "./isModifiedOutlet";

const langData = getTranslations();


export const Edit_inventory = ({ accessToken, refreshToken }) => {
  const navigate = useNavigate();

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
  const [editTag, setEditTag] = useState("");
  const [currentTag, setCurrentTag] = useState("");
  const [Pics, setPics] = useState(); //Estas imagenes van cambiando conforme se escribe sobre ellas
  const [actualPics, setCpPics] = useState(); //Estas se mantienen como estaban para hacer la comparación
  const [PicsNew, setPicsNew] = useState([]); //Estas imagenes van cambiando conforme se escribe sobre ellas
  const [currentImgNewIndex, setCurrentImgNewIndex] = useState(0); //el indice para navegar entre imagenes

  const [DocumentsNew, setDocumentsNew] = useState([]); //Estas son las imagenes nuevas
  const [currentDocNewIndex, setCurrentDocNewIndex] = useState(0); //el indice para navegar entre imagenes

  const [currentImgIndex, setCurrentImgIndex] = useState(0); //el indice para navegar entre imagenes
  const [currentPic, setCurrentPic] = useState(); //la imagen que se muestra actualmente
  const [changedPics, setchangedPics] = useState({});
  const [changedDocs, setchangedDocs] = useState();
  const [isDataLoaded, setIsDataLoaded] = useState(false); // Estado para verificar si los datos ya fueron cargados

  //const [currentDoc, setCurrentDoc] = useState();
  const [currentDocIndex, setCurrentDocIndex] = useState(0);

  const [Documents, setDocuments] = useState();
  const [actualDocs, setCpDocs] = useState();

  const [isExpandedImg, setIsExpandedImg] = useState(false);
  const [isExpandedDoc, setIsExpandedDoc] = useState(false);

  const image_path =
    SETTINGS.URL_ADDRESS.server_url + SETTINGS.URL_ADDRESS.inventory_thumbnails;

  const handlePrev = () => {
    console.log("Pics", Pics);
    console.log("Pics current index", Pics[currentImgIndex]);
    console.log("current index", currentImgIndex);
    setCurrentImgIndex((prevIndex) => {
      const newIndex = prevIndex === 0 ? Pics.length - 1 : prevIndex - 1;
      setCurrentPic(Pics && Pics.length > 0 ? Pics[newIndex] : null);
      return newIndex;
    });
  };

  const handleNext = () => {
    console.log("Pics", Pics);
    console.log("Pics current index", Pics[currentImgIndex]);
    console.log("current index", currentImgIndex);

    setCurrentImgIndex((prevIndex) => {
      const newIndex = prevIndex === Pics.length - 1 ? 0 : prevIndex + 1;
      console.log(newIndex);
      setCurrentPic(Pics && Pics.length > 0 ? Pics[newIndex] : null);
      return newIndex;
    });
  };
  const handlePrevNew = () => {
    setCurrentImgNewIndex((prevIndex) => {
      if (PicsNew.length > 0) {
        return prevIndex === 0 ? PicsNew.length - 1 : prevIndex - 1;
      }
      return prevIndex; // No cambia si no hay imágenes
    });
    //setCurrentPicNew(PicsNew && PicsNew.length > 0 ? PicsNew[currentImgNewIndex] : null);
  };
  const handleNextNew = () => {
    setCurrentImgNewIndex((prevIndex) => {
      if (PicsNew.length > 0) {
        return prevIndex === PicsNew.length - 1 ? 0 : prevIndex + 1;
      }
      return prevIndex; // No cambia si no hay imágenes
    });
    // setCurrentPicNew(PicsNew && PicsNew.length > 0 ? PicsNew[currentImgNewIndex] : null);
  };

  const handlePrevDoc = () => {
    setCurrentDocIndex((prevIndex) =>
      prevIndex === 0 ? Documents.length - 1 : prevIndex - 1
    );
    /*setCurrentDoc(
      Documents && Documents.length > 0 ? Documents[currentDocIndex] : null
    );*/
  };
  const handleNextDoc = () => {
    setCurrentDocIndex((prevIndex) =>
      prevIndex === Documents.length - 1 ? 0 : prevIndex + 1
    );
    
  };

  const handlePrevNewDoc = () => {
    setCurrentDocNewIndex((prevIndex) => {
      if (DocumentsNew.length > 0) {
        return prevIndex === 0 ? DocumentsNew.length - 1 : prevIndex - 1;
      }
      return prevIndex; // No cambia si no hay imágenes
    });
    //setCurrentPicNew(PicsNew && PicsNew.length > 0 ? PicsNew[currentImgNewIndex] : null);
  };
  const handleNextNewDoc = () => {
    setCurrentDocNewIndex((prevIndex) => {
      if (DocumentsNew.length > 0) {
        return prevIndex === DocumentsNew.length - 1 ? 0 : prevIndex + 1;
      }
      return prevIndex; // No cambia si no hay imágenes
    });
    // setCurrentPicNew(PicsNew && PicsNew.length > 0 ? PicsNew[currentImgNewIndex] : null);
  };

  const handleImageDrop = (acceptedFiles) => {
    console.log("pics new", PicsNew);
    const updatedPics = [...PicsNew];
    updatedPics[currentImgNewIndex] = {
      ...updatedPics[currentImgNewIndex],
      file: acceptedFiles[0],
      size: acceptedFiles[0].size,
      mime_type: acceptedFiles[0].type,
    };
    setPicsNew(updatedPics);
  };

  const handleDocumentDrop = (acceptedFiles) => {
    const updatedDocs = [...DocumentsNew];
    updatedDocs[currentDocNewIndex] = {
      ...updatedDocs[currentDocNewIndex],
      file: acceptedFiles[0],
      name: acceptedFiles[0].name.split(".").slice(0, -1).join("."),
      size: acceptedFiles[0].size,
      mime_type: acceptedFiles[0].type,
    };
    setDocumentsNew(updatedDocs);
  };
  const addImage = () => {
    const newImage = {
      photographer: "",
      description: "",
      photographed_at: "",
      file: null,
    };
    setPicsNew([...PicsNew, newImage]);
    setCurrentImgNewIndex(PicsNew.length); // Actualiza el índice al último elemento nuevo
  };
  const deleteImage = (index) => {
    setPicsNew(PicsNew.filter((_, i) => i !== index));
    setCurrentImgNewIndex(0); // Actualiza el índice al primer elemento
  };

  const addDocument = () => {
    const newDocument = { name: "", file: null };
    setDocumentsNew([...DocumentsNew, newDocument]);
    setCurrentDocNewIndex(DocumentsNew.length); // Actualiza el índice al último elemento nuevo
  };
  const deleteDocument = (index) => {
    setDocumentsNew(DocumentsNew.filter((_, i) => i !== index));
    setCurrentDocNewIndex(0); // Actualiza el índice al primer elemento
  };

  const toggleExpandNewImage = () => {
    setIsExpandedImg(!isExpandedImg);
  };

  const toggleExpandNewDoc = () => {
    setIsExpandedDoc(!isExpandedDoc);
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
        console.log("gender_info", data?.piece ? data.piece : "N/D");
        if (!isDataLoaded) {
          const temp = {
            origin_number: data.piece?.origin_number || "",
            inventory_number: data.piece?.inventory_number || "",
            catalog_number: data.piece?.catalog_number || "",
            description_origin: data.piece?.description_origin || "",
            description_inventory: data.piece?.description_inventory || "",
            gender_id: {
              _id: data.piece?.gender_id ? data.piece.gender_id : "N/D",
              title:
              data?.piece?.genders_info ? data.piece.genders_info.title : "N/D",
              description: data?.piece?.genders_info ? data.piece.genders_info.description : "N/D",              
              
            },
            subgender_id:{
             _id: data.piece?.subgender_id ? data.piece.subgender_id : "N/D",
             title : data?.piece?.subgenders_info
                ? data.piece.subgenders_info.title
                : "N/D",
                description : data?.piece?.subgenders_info
                ? data.piece.subgenders_info.description
                : "N/D",
            
              
              },
            
            
            type_object_id:{              
              _id: data.piece?.type_object_id ? data.piece.type_object_id : "N/D",
              title: data?.piece?.type_object_info 
                ? data.piece.type_object_info.title
                : "N/D",
              description: data?.piece?.type_object_info
                ? data.piece.type_object_info.description
                : "N/D",
              
            },
            dominant_material_id:{
              _id: data.piece?.dominant_material_id ? data.piece.dominant_material_id : "N/D",
              title: data?.piece?.dominant_material_info
                ? data.piece.dominant_material_info.title
                : "N/D",
              description: data?.piece?.dominant_material_info
                ? data.piece.dominant_material_info.description
                : "N/D",
            },
             
              
            tags: data.piece?.tags || "",
            appraisal: data.piece?.appraisal || "",
            base_or_frame: data.piece?.base_or_frame || "",
            height: data.piece?.height || "",
            width: data.piece?.width || "",
            depth: data.piece?.depth || "",
            diameter: data.piece?.diameter || "",
            height_with_base: data.piece?.height_with_base || "",
            width_with_base: data.piece?.width_with_base || "",
            depth_with_base: data.piece?.depth_with_base || "",
            diameter_with_base: data.piece?.diameter_with_base || "",
          };

          setPics(data.pics);

          setFormData(temp);
          setCpFormData(temp);
          setCpPics(data.pics);
          setCpDocs(data.documents);
          setIsDataLoaded(true);
          setIsModified(false);
          const tagsArray = temp.tags.split(",").map((tag) => tag.trim());
          setTags(tagsArray);
        }
        if (Pics && Pics.length > 0) {
          setCurrentPic(Pics[currentImgIndex]);
          console.log("Pics current", Pics[currentImgIndex]);
          console.log("current index", currentImgIndex);
          console.log("Pics", Pics);
        }
      } else {
        if (data.changes) {
          setIsModified(true);
          setData(data);
        }
      }
    }
  }, [
    data,
    setData,
    setFormData,
    setGenders,
    setSubgenders,
    Genders,
    Subgenders,
    isModified,
    DominantMaterial,
    TypeObject,
    Pics,
    currentImgIndex,
    isDataLoaded,
  ]);

  const compareFormModifications = (original, modified) => {
    let changes = {};
  
    for (const key in original) {
      let originalValue = original[key];
      let modifiedValue = modified[key];
  
      // Aplicar trim a los strings
      if (typeof originalValue === "string") originalValue = originalValue.trim();
      if (typeof modifiedValue === "string") modifiedValue = modifiedValue.trim();
  
      // Si el valor es un objeto con _id, solo compararemos _id
      if (typeof originalValue === "object" && typeof modifiedValue === "object") {
        if (originalValue._id !== modifiedValue._id) {
          changes[key] = {
            oldValue: original[key],
            newValue: modified[key],
          };
        }
      }
      // Comparación normal para strings y valores primitivos
      else if (originalValue !== modifiedValue) {
        changes[key] = {
          oldValue: original[key],
          newValue: modified[key],
        };
      }
    }
  
    return changes;
  };
  const comparePicsModifications = (original, modified) => {
    let changes = {};
    const keys = ["photographer", "photographed_at", "description"];

    for (let i = 0; i < original.length; i++) {
      const originalItem = original[i];
      const modifiedItem = modified[i];
      let isFirstTime = true;

      for (const key of keys) {
        // Iteramos directamente sobre `keys`
        if (key in originalItem) {
          const originalValue =
            typeof originalItem[key] === "string"
              ? originalItem[key].trim()
              : originalItem[key];

          const modifiedValue =
            typeof modifiedItem[key] === "string"
              ? modifiedItem[key].trim()
              : modifiedItem[key];

          if (originalValue !== modifiedValue) {
            if (!changes[i]) {
              changes[i] = {};
            } // Asegura que `changes[i]` exista

            if (isFirstTime) {
              changes[i]["_id"] = originalItem["_id"]; // Solo asigna `_id` la primera vez
              isFirstTime = false; // Marca que ya se procesó el primer cambio
            }

            changes[i][key] = {
              oldValue: originalItem[key],
              newValue: modifiedItem[key],
            };
          }
        }
      }
    }

    return changes;
  };

  // compareDocsModifications, igual que comparePicsModifications pero para documentos solo con el campo name
  const compareDocsModifications = (original, modified) => {
    let changes = {};
    const keys = ["name"];

    for (let i = 0; i < original.length; i++) {
      const originalItem = original[i];
      const modifiedItem = modified[i];
      let isFirstTime = true;

      for (const key of keys) {
        // Iteramos directamente sobre `keys`
        if (key in originalItem) {
          const originalValue =
            typeof originalItem[key] === "string"
              ? originalItem[key].trim()
              : originalItem[key];
          const modifiedValue =
            typeof modifiedItem[key] === "string"
              ? modifiedItem[key].trim()
              : modifiedItem[key];

          if (originalValue !== modifiedValue) {
            if (!changes[i]) {
              changes[i] = {};
            } // Asegura que `changes[i]` exista

            if (isFirstTime) {
              changes[i]["_id"] = originalItem["_id"]; // Solo asigna `_id` la primera vez
              isFirstTime = false; // Marca que ya se procesó el primer cambio
            }

            changes[i][key] = {
              oldValue: originalItem[key],
              newValue: modifiedItem[key],
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
    const changes_docs_inputs = compareDocsModifications(actualDocs, Documents);
    
    if (
      (changes && Object.keys(changes).length > 0) ||
      (changes_pics_inputs && Object.keys(changes_pics_inputs).length > 0) ||
      (changedPics && Object.keys(changedPics).length > 0) ||
      (changedDocs && Object.keys(changedDocs).length > 0) ||
      (PicsNew && PicsNew.length > 0) ||
      (changes_docs_inputs && Object.keys(changes_docs_inputs).length > 0) ||
      (DocumentsNew && DocumentsNew.length > 0)
    ) {
        const modalElement = document.getElementById("ChangesModal");
        if (modalElement) {
          const modal = new Modal(modalElement);
          modal.show();
      }  
    } else {    
      const modalElement = document.getElementById("noChangesModal");
      if (modalElement) {
        const modal = new Modal(modalElement);
        modal.show();
      }
    }
  };

 const sendSave = () => { 
    
    const changes = compareFormModifications(actualFormData, formData);
    const changes_pics_inputs = comparePicsModifications(actualPics, Pics);
    const changes_docs_inputs = compareDocsModifications(actualDocs, Documents);
    const _id = Data._id;

      API_RequestInventoryEdit({
        accessToken,
        refreshToken,
        _id,
        changes,
        changes_pics_inputs,
        changedPics,
        PicsNew,
        changedDocs,
        DocumentsNew,
        changes_docs_inputs,
      }).then((data) => {
        if (data) {          
          
         navigate(`/mnemosine/inventory_queries`);
        }      
      });

    
  };
  

  const handleTagClick = (index) => {
    // Colocar el tag en el input para permitir su edición
    setCurrentTag(tags[index]);
    setEditTag(index);
  };

  const handleTagDelete = (index) => {
    setTags(tags.filter((_, i) => i !== index)); // Eliminar el tag seleccionado
    setEditTag("");
    setCurrentTag("");
  };

  const handleTagKeyDown = (e) => {
    if (editTag !== "") {
      const result = tags.map((tag, index) =>
        index !== editTag ? tag : e.target.value
      );
      setTags(result);
      setEditTag("");
      setCurrentTag("");

      // esta es la idea hay que hacerla con el setformData //formData.tags = result.join(",");
      setFormData((prevData) => ({
        ...prevData,
        tags: result.join(","),
      }));
    } else {
      if (e.target.value.trim() !== "") {
        setTags([...tags, e.target.value.trim()]);
        setCurrentTag("");
        setFormData((prevData) => ({
          ...prevData,
          tags: [...tags, e.target.value.trim()].join(","), // Actualiza los tags en el formData          
        }))
      }
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;

    if (id === "tags") {
      if (value.endsWith(",")) {
        // Agrega el tag sin la coma al final y limpia el currentTag
        // setTags([...tags, currentTag.trim()]);
        //setCurrentTag("");
      } else {
        setCurrentTag(value); // Actualiza el tag actual mientras se escribe
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    }
  };




  const handleGenderChange = (selectedGender) => {
    setFormData({
      ...formData,
      gender_id: {
        _id: selectedGender._id,
        title: selectedGender.title,
      },
    });
    console.log("selected Gender", selectedGender);
  };

  const handleSubGenderChange = (selectedSubGender) => {
    setFormData({
      ...formData,
      subgender_id: {
        _id: selectedSubGender._id,
        title: selectedSubGender.title,
      },
    });
    console.log("selected SubGender", selectedSubGender);
  };

  const handleTypeObjectChange = (selectedTypeObject) => {
    setFormData({
      ...formData,
      type_object_id: {
        _id: selectedTypeObject._id,
        title: selectedTypeObject.title,
      },
    });
    console.log("selected TypeObject", selectedTypeObject);
  };

  const handleDominantMaterialChange = (selectedDominantMaterial) => {
    setFormData({
      ...formData,
      dominant_material_id: {
        _id: selectedDominantMaterial._id,
        title: selectedDominantMaterial.title,
      },
    });
    console.log("selected DominantMaterial", selectedDominantMaterial);
  };


   // Filtra las opciones de gender en función de lo que escribe el usuario
   const handleGenderFilter = (e) => {
    const { value } = e.target;
    const filtered = Genders.filter((gender) =>
      gender.title.toLowerCase().includes(value.toLowerCase())
    );    
    setFilteredGenders(filtered);
  };
  const handleSubGenderFilter = (e) => {
    const { value } = e.target;

    // Filtra la lista de genders
    const filtered = Subgenders.filter((subgender) =>
      subgender.title.toLowerCase().includes(value.toLowerCase())
    );   

    setFilteredSubGenders(filtered);
  };

  const handleTypeObjectFilter = (e) => {
    const { value } = e.target;
    const filtered = TypeObject.filter((type_object) =>
      type_object.title.toLowerCase().includes(value.toLowerCase())
    ); 
    setfilteredTypeObject(filtered);
  };

  const handleDominantMaterialFilter = (e) => {
    const { value } = e.target;
    const filtered = DominantMaterial.filter((dominant_material) =>
      dominant_material.title.toLowerCase().includes(value.toLowerCase())
    );   
    setFilteredDominantMaterial(filtered);
  };








  // Actualiza los campos de la imagen seleccionada
  const handleInputPic = (e) => {
    const { id, value } = e.target;
    setPics((prevData) =>
      prevData.map(
        (pic, index) =>
          index === currentImgIndex
            ? { ...pic, [id]: value } // Crea una copia del objeto actual con el campo actualizado
            : pic // Retorna el objeto sin cambios si el índice no coincide
      )
    );
  };

  const handleInputDoc = (e) => {
    const { id, value } = e.target;
    setDocuments((prevData) =>
      prevData.map(
        (doc, index) =>
          index === currentDocIndex
            ? { ...doc, [id]: value } // Crea una copia del objeto actual con el campo actualizado
            : doc // Retorna el objeto sin cambios si el índice no coincide
      )
    );
  };

  const handleChangeImageStatus = ({ file }) => {
    setchangedPics((prevChangedPics) => {
      const updatedFile = new File([file], file.name, {
        type: file.type,
        lastModified: file.lastModified,
      });
      return {
        ...prevChangedPics,
        [currentImgIndex]: {
          _id: Pics[currentImgIndex]._id,
          file: updatedFile,
        },
      };
    });
  };

  const handleChangeDocumentStatus = ({ file }) => {
    const copyFile = new File([file], file.name, {
      type: file.type,
      lastModified: file.lastModified,
    });
    setchangedDocs((prevChangedDocs) => ({
      ...prevChangedDocs,
      [currentDocIndex]: {
        _id: Documents[currentDocIndex]["_id"],
        file: copyFile,
      },
    }));
  };

  return (
    <>
      {isModified ? (
        <ModifiedOutlet
          Data={Data}
          accessToken={accessToken}
          refreshToken={refreshToken}
          setIsModified={setIsModified}
        />
      ) : (
        <div className="container">
          <form onSubmit={handleSave}>
            <div className="card p-4" style={{ background: "#abcc" }}>
              <div className="row mb-3">
                <div className="col">
                  <label htmlFor="origin_number" className="form-label">
                    {langData.pieceDetailDescriptors.inventory.origin_number}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="origin_number"
                    value={
                      formData?.origin_number ? formData?.origin_number : ""
                    }
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col">
                  <label htmlFor="inventory_number" className="form-label">
                    {langData.pieceDetailDescriptors.inventory.inventory_number}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="inventory_number"
                    value={
                      formData?.inventory_number
                        ? formData?.inventory_number
                        : ""
                    }
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col">
                  <label htmlFor="catalog_number" className="form-label">
                    {langData.pieceDetailDescriptors.inventory.catalog_number}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="catalog_number"
                    value={
                      formData?.catalog_number ? formData?.catalog_number : ""
                    }
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col">
                  <label htmlFor="description_origin" className="form-label">
                    {
                      langData.pieceDetailDescriptors.inventory
                        .description_origin
                    }
                  </label>
                  <textarea
                    type="text"
                    className="form-control"
                    id="description_origin"
                    value={
                      formData?.description_origin
                        ? formData?.description_origin
                        : ""
                    }
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col">
                  <label htmlFor="description_inventory" className="form-label">
                    {
                      langData.pieceDetailDescriptors.inventory
                        .description_inventory
                    }
                  </label>
                  <textarea
                    type="text"
                    className="form-control"
                    id="description_inventory"
                    value={
                      formData?.description_inventory
                        ? formData?.description_inventory
                        : ""
                    }
                    onChange={handleInputChange}
                    ref={(el) =>
                      (refToSave.current["description_inventory"] = el)
                    }
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col mb-3">
                  <label htmlFor="gender" className="form-label">
                    {langData.pieceDetailDescriptors.inventory.gender}
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    id="gender"
                    onChange={handleGenderFilter}
                    placeholder={langData.pieceDetailDescriptors.inventory.type_to_filter_genders}
                  />
                 
                  <select
                    className="form-select mt-2"
                    id="gender"
                    value={
                      formData?.gender_id?.title ? formData.gender_id.title : ""
                    }
                    onChange={(e) => {
                      const selectedIndex = e.target.options.selectedIndex;
                      const selectedTitle = e.target.value;
                      const selectedId =
                        e.target.options[selectedIndex].getAttribute("data-id-gender");
                      handleGenderChange({
                        _id: selectedId,
                        title: selectedTitle,
                      });
                    }}
                  >
                    {filteredGenders?.map((gender, index) => (
                      <option
                        key={index}
                        value={gender?.title || ""}
                        data-id-gender={gender?._id}
                      >
                        {gender?.title || ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col mb-3">
                  <label htmlFor="subgender" className="form-label">
                    {langData.pieceDetailDescriptors.inventory.subgenders_info}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="subgender"
                    onChange={handleSubGenderFilter}
                    placeholder={langData.pieceDetailDescriptors.inventory.type_to_filter_subgenders}
                  />

                  <select
                    type="text"
                    className="form-select mt-2"
                    id="subgender"
                    value={formData?.subgender_id ? formData.subgender_id.title : ""}
                    onChange={(e) => {
                      const selectedIndex = e.target.options.selectedIndex;
                      const selectedTitle = e.target.value;
                      const selectedId =
                        e.target.options[selectedIndex].getAttribute("data-id-subgender");
                      handleSubGenderChange({
                        _id: selectedId,
                        title: selectedTitle,
                      });
                    }}
                  >
                    {filteredSubGenders?.map((subgender, index) => {
                      return (
                        <option
                          key={index}
                          value={subgender?.title ? subgender.title : ""}
                          data-id-subgender={subgender?._id}
                        >
                          {subgender?.title ? subgender.title : ""}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <label htmlFor="type_object" className="form-label">
                    {langData.pieceDetailDescriptors.inventory.type_object_info}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="type_object"
                    onChange={handleTypeObjectFilter}
                    placeholder={langData.pieceDetailDescriptors.inventory.type_to_filter_types}
                  />
                  <select
                    type="text"
                    className="form-select mt-2"
                    id="type_object"
                    value={
                      formData?.type_object_id ? formData.type_object_id.title : ""
                    }
                    onChange={(e) => {
                      const selectedIndex = e.target.options.selectedIndex;
                      const selectedTitle = e.target.value;
                      const selectedId =
                        e.target.options[selectedIndex].getAttribute("data-id-type_object");
                      handleTypeObjectChange({
                        _id: selectedId,
                        title: selectedTitle,
                      });
                    }}
                  >
                    {filteredTypeObject?.map((type_object, index) => {
                      return (
                        <option
                          key={index}
                          value={type_object?.title ? type_object.title : ""}
                          data-id-type_object={type_object?._id}
                        >
                          {type_object?.title ? type_object.title : ""}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="col">
                  <label htmlFor="dominant_material" className="form-label">
                    {
                      langData.pieceDetailDescriptors.inventory
                        .dominant_material_info
                    }
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="dominant_material"
                    onChange={handleDominantMaterialFilter}
                    placeholder={langData.pieceDetailDescriptors.inventory.type_to_filter_materials}
                  />
                  <select
                    type="text"
                    className="form-select mt-2"
                    id="type_object"
                    value={
                      formData?.dominant_material_id
                        ? formData.dominant_material_id.title
                        : ""
                    }
                    onChange={(e) => {
                      const selectedIndex = e.target.options.selectedIndex;
                      const selectedTitle = e.target.value;
                      const selectedId =
                        e.target.options[selectedIndex].getAttribute("data-id-dominant_material");
                      handleDominantMaterialChange({
                        _id: selectedId,
                        title: selectedTitle,
                      });
                    }}
                  >
                    {filteredDominantMaterial?.map(
                      (dominant_material, index) => {
                        return (
                          <option
                            key={index}
                            value={
                              dominant_material?.title
                                ? dominant_material.title
                                : ""
                            }
                            data-id-dominant_material={dominant_material?._id}
                          >
                            {dominant_material?.title
                              ? dominant_material.title
                              : ""}
                          </option>
                        );
                      }
                    )}
                  </select>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col">
                  <label htmlFor="tags" className="form-label">
                    {langData.pieceDetailDescriptors.inventory.tags}
                  </label>
                  <div className="tags-input">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="tag"
                        onClick={() => handleTagClick(index)}
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTagDelete(index);
                          }}
                          className="delete-tag"
                        >
                          x
                        </button>
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
                  <label htmlFor="appraisal" className="form-label">
                    {langData.pieceDetailDescriptors.inventory.appraisal}
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="appraisal"
                    value={formData?.appraisal ? formData?.appraisal : ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="row mb-3"></div>

              <h5>Dimensions (without base)</h5>
              <div className="row mb-3">
                <div className="col">
                  <label htmlFor="height" className="form-label">
                    {langData.pieceDetailDescriptors.inventory.height}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="height"
                    value={formData?.height ? formData?.height : ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col">
                  <label htmlFor="width" className="form-label">
                    {langData.pieceDetailDescriptors.inventory.width}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="width"
                    value={formData?.width ? formData?.width : ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col">
                  <label htmlFor="depth" className="form-label">
                    {langData.pieceDetailDescriptors.inventory.depth}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="depth"
                    value={formData?.depth ? formData?.depth : ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col">
                  <label htmlFor="diameter" className="form-label">
                    {langData.pieceDetailDescriptors.inventory.diameter}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="diameter"
                    value={formData?.diameter ? formData?.diameter : ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <h5>Dimensions (with base)</h5>
              <div className="row mb-3">
                <div className="col">
                  <label htmlFor="height_with_base" className="form-label">
                    {langData.pieceDetailDescriptors.inventory.height_with_base}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="height_with_base"
                    value={
                      formData?.height_with_base
                        ? formData?.height_with_base
                        : ""
                    }
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col">
                  <label htmlFor="width_with_base" className="form-label">
                    {langData.pieceDetailDescriptors.inventory.width_with_base}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="width_with_base"
                    value={
                      formData?.width_with_base ? formData?.width_with_base : ""
                    }
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col">
                  <label htmlFor="depth_with_base" className="form-label">
                    {langData.pieceDetailDescriptors.inventory.depth_with_base}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="depth_with_base"
                    value={formData?.depth_with_base}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col">
                  <label htmlFor="diameter_with_base" className="form-label">
                    {
                      langData.pieceDetailDescriptors.inventory
                        .diameter_with_base
                    }
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="diameter_with_base"
                    value={formData?.diameter_with_base}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col">
                <div className="card mt-4" style={{ background: "#abcc" }}>
                  <div
                    className="card-header text-center"
                    style={{
                      background: "#99dd",
                      position: "relative",
                      padding: "10px",
                    }}
                  >
                    {/* Texto centrado */}
                    <span>{langData.pieceInventoryEdit.images}</span>
                  </div>

                  <div className="card-body text-center">
                    <div className="mb-4">
                      <div className="row">
                        <div className="col-4">
                          <img
                            alt="thumbnail"
                            src={`${image_path}${
                              currentPic?.file_name ? currentPic.file_name : ""
                            }`}
                            className="img-fluid mb-3 rounded"
                            style={{ maxHeight: "100px", maxWidth: "100px" }}
                            data-bs-toggle="modal"
                            data-bs-target={`#modalPicEdit${currentImgIndex}`}
                          />
                        </div>

                        <div className="col-4">
                          <Dropzone
                            maxFiles={1}
                            accept={{
                              "image/png": [".png"],
                              "image/jpeg": [".jpg", ".jpeg"],
                              "image/gif": [".gif"],
                              "image/svg+xml": [".svg"],
                              "image/bmp": [".bmp"],
                              "image/tiff": [".tiff"],
                              "image/webp": [".webp"],
                            }}
                            onDrop={(acceptedFiles) =>
                              handleChangeImageStatus({
                                file: acceptedFiles[0],
                              })
                            }
                          >
                            {({ getRootProps, getInputProps }) => (
                              <section className="container-fluid dashed-box">
                                <div
                                  {...getRootProps({ className: "dropzone" })}
                                >
                                  <input {...getInputProps()} />
                                  <p>
                                    {
                                      langData.pieceInventoryEdit
                                        .uploader_img_sign
                                    }
                                  </p>
                                </div>
                              </section>
                            )}
                          </Dropzone>
                        </div>

                        <div className="col-4">
                          {changedPics &&
                          changedPics[currentImgIndex] &&
                          changedPics[currentImgIndex]["file"] ? (
                            <img
                              alt="new pic"
                              src={URL.createObjectURL(
                                changedPics[currentImgIndex]["file"]
                              )}
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
                        ObjectImg={
                          changedPics &&
                          changedPics[currentImgIndex] &&
                          changedPics[currentImgIndex]["file"]
                            ? URL.createObjectURL(
                                changedPics[currentImgIndex]["file"]
                              )
                            : null
                        }
                      />
                      <ModalPictures
                        IDmodal={`modalPicEdit${currentImgIndex}`}
                        picFileName={currentPic?.file_name || ""}
                        ObjectImg={null}
                      />

                      <div className="text-start">
                        <label className="d-block">
                          {langData.pieceInventoryEdit.photographer}:
                          <input
                            id="photographer"
                            type="text"
                            value={
                              Pics && Pics[currentImgIndex]?.photographer
                                ? Pics[currentImgIndex].photographer
                                : ""
                            }
                            className="form-control mt-2"
                            onChange={handleInputPic}
                          />
                        </label>
                        <label className="d-block mt-3">
                          {langData.pieceInventoryEdit.photographed_at}:
                          <input
                            id="photographed_at"
                            type="date"
                            value={formatDate(
                              Pics && Pics[currentImgIndex]?.photographed_at
                                ? Pics[currentImgIndex].photographed_at
                                : ""
                            )}
                            className="form-control mt-2"
                            onChange={handleInputPic}
                          />
                        </label>
                        <label className="d-block mt-3">
                          {langData.pieceInventoryEdit.description}:
                          <textarea
                            id="description"
                            value={
                              Pics && Pics[currentImgIndex]?.description
                                ? Pics[currentImgIndex].description
                                : ""
                            }
                            className="form-control mt-2"
                            onChange={handleInputPic}
                          />
                        </label>
                        <label className="d-block mt-3">
                          {langData.pieceInventoryEdit.size}:
                          <p className="mt-2">
                            {formatSize(currentPic?.size ? currentPic.size : 0)}
                          </p>
                        </label>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between">
                      <Button
                        variant="contained"
                        color="secondary"
                        type="button"
                        onClick={handlePrev}
                        className="btn btn-secondary"
                      >
                        ← {langData.pieceInventoryEdit.previous}
                      </Button>
                      <span>
                        {currentImgIndex + 1} /{" "}
                        {Pics?.length ? Pics.length : null}
                      </span>{" "}
                      {/* Paginación */}
                      <Button
                        variant="contained"
                        color="secondary"
                        type="button"
                        onClick={handleNext}
                        className="btn btn-secondary"
                      >
                        {langData.pieceInventoryEdit.next} →
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col">
                <div className="card mt-4" style={{ background: "#abcc" }}>
                  {/* Card Header */}
                  <div
                    className="card-header text-center"
                    style={{
                      background: "#99dd",
                      position: "relative",
                      padding: "10px",
                      cursor: "pointer",
                    }}
                    onClick={toggleExpandNewImage}
                  >
                    {/* Header Content */}
                    <span>Imágenes nuevas</span>
                    {isExpandedImg && (
                      <>
                        <IconButton
                          sx={{ color: pink[400] }}
                          aria-label="del image"
                          onClick={(e) => {
                            e.stopPropagation(); // Evita que el clic oculte el contenido
                            deleteImage(currentImgNewIndex);
                          }}
                          style={{
                            position: "absolute",
                            right: "75px",
                            top: "50%",
                            transform: "translateY(-50%)",
                          }}
                        >
                          <RemoveIcon />
                        </IconButton>

                        <IconButton
                          color="secondary"
                          aria-label="add image"
                          onClick={(e) => {
                            e.stopPropagation(); // Evita que el clic oculte el contenido
                            addImage();
                          }}
                          style={{
                            position: "absolute",
                            right: "50px",
                            top: "50%",
                            transform: "translateY(-50%)",
                          }}
                        >
                          <AddIcon />
                        </IconButton>
                      </>
                    )}

                    <IconButton
                      color="primary"
                      aria-label="toggle expand"
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                    >
                      {isExpandedImg ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </div>

                  {/* Card Body */}
                  {isExpandedImg && (
                    <>
                      {PicsNew.length > 0 && (
                        <div className="card-body text-center">
                          {/* Images and Inputs */}
                          <div className="mb-4">
                            <div className="row">
                              {/* Current Image */}
                              <div className="col-4">
                                {PicsNew[currentImgNewIndex]?.file && (
                                  <img
                                    alt="thumbnail"
                                    src={URL.createObjectURL(
                                      PicsNew[currentImgNewIndex].file
                                    )}
                                    className="img-fluid mb-3 rounded"
                                    style={{
                                      maxHeight: "100px",
                                      maxWidth: "100px",
                                    }}
                                    data-bs-toggle="modal"
                                    data-bs-target={`#modalPicNewNew${currentImgNewIndex}`}
                                  />
                                )}
                              </div>

                              {/* Dropzone */}

                              <div className="col-4">
                                <Dropzone
                                  maxFiles={1}
                                  accept={{
                                    "image/png": [".png"],
                                    "image/jpeg": [".jpg", ".jpeg"],
                                  }}
                                  onDrop={(acceptedFiles) =>
                                    handleImageDrop(acceptedFiles)
                                  }
                                >
                                  {({ getRootProps, getInputProps }) => (
                                    <section className="container-fluid dashed-box">
                                      <div
                                        {...getRootProps({
                                          className: "dropzone",
                                        })}
                                      >
                                        <input {...getInputProps()} />
                                        <p>
                                          Arrastra aquí tu imagen o haz clic
                                          para subirla
                                        </p>
                                      </div>
                                    </section>
                                  )}
                                </Dropzone>
                              </div>
                            </div>

                            {/* Modal for Uploaded Image */}
                            <ModalPictures
                              IDmodal={`modalPicNewNew${currentImgNewIndex}`}
                              picFileName={null}
                              ObjectImg={
                                PicsNew[currentImgNewIndex]?.file
                                  ? URL.createObjectURL(
                                      PicsNew[currentImgNewIndex].file
                                    )
                                  : null
                              }
                            />

                            {/* Input Fields */}
                            <div className="text-start">
                              <label className="d-block">
                                Fotógrafo:
                                <input
                                  id="photographer"
                                  type="text"
                                  value={
                                    PicsNew[currentImgNewIndex]?.photographer ||
                                    ""
                                  }
                                  className="form-control mt-2"
                                  onChange={(e) => {
                                    const updatedPics = [...PicsNew];
                                    updatedPics[currentImgNewIndex] = {
                                      ...updatedPics[currentImgNewIndex],
                                      photographer: e.target.value,
                                    };
                                    setPicsNew(updatedPics);
                                  }}
                                />
                              </label>
                              <label className="d-block mt-3">
                                Fecha de fotografía:
                                <input
                                  id="photographed_at"
                                  type="date"
                                  value={
                                    PicsNew[currentImgNewIndex]
                                      ?.photographed_at || ""
                                  }
                                  className="form-control mt-2"
                                  onChange={(e) => {
                                    const updatedPics = [...PicsNew];
                                    updatedPics[currentImgNewIndex] = {
                                      ...updatedPics[currentImgNewIndex],
                                      photographed_at: e.target.value,
                                    };
                                    setPicsNew(updatedPics);
                                  }}
                                />
                              </label>
                              <label className="d-block mt-3">
                                Descripción:
                                <textarea
                                  id="description"
                                  value={
                                    PicsNew[currentImgNewIndex]?.description ||
                                    ""
                                  }
                                  className="form-control mt-2"
                                  onChange={(e) => {
                                    const updatedPics = [...PicsNew];
                                    updatedPics[currentImgNewIndex] = {
                                      ...updatedPics[currentImgNewIndex],
                                      description: e.target.value,
                                    };
                                    setPicsNew(updatedPics);
                                  }}
                                />
                              </label>
                            </div>

                            {/* Pagination Buttons */}
                            <div className="d-flex justify-content-between mt-3">
                              <Button
                                variant="contained"
                                color="secondary"
                                type="button"
                                onClick={handlePrevNew}
                                className="btn btn-secondary"
                              >
                                ← Anterior
                              </Button>
                              <span>
                                {currentImgNewIndex + 1} / {PicsNew.length}
                              </span>
                              <Button
                                variant="contained"
                                color="secondary"
                                type="button"
                                onClick={handleNextNew}
                                className="btn btn-secondary"
                              >
                                Siguiente →
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col">
                <div className="card mt-4" style={{ background: "#abcc" }}>
                  <div className="card-header " style={{ background: "#99dd" }}>
                    {langData.pieceInventoryEdit.documents}
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-4">
                        <div
                          className={`text-${
                            colorFile[
                              fileTypes[
                                Documents &&
                                Documents[currentDocIndex]?.mime_type
                                  ? Documents[currentDocIndex].mime_type
                                  : "primary"
                              ]
                            ]
                          } mt-3`}
                        >
                          {Documents &&
                          Documents[currentDocIndex]?.file_name ? (
                            <>
                              <a
                                href={
                                  SETTINGS.URL_ADDRESS.server_url +
                                  SETTINGS.URL_ADDRESS.inventory_documents +
                                  Documents[currentDocIndex].file_name
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <FontAwesomeIcon
                                  icon={
                                    Documents &&
                                    Documents[currentDocIndex]?.mime_type
                                      ? mimeIcons[
                                          Documents[currentDocIndex].mime_type
                                        ]
                                      : faBan
                                  }
                                  size="3x"
                                />
                              </a>
                            </>
                          ) : null}
                        </div>
                      </div>

                      {Documents && Documents.length > 0 && (
                        <div className="col-4">
                          <Dropzone
                            maxFiles={1}
                            accept={{
                              "application/pdf": [".pdf"],
                              "application/msword": [".doc"],
                              "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                                [".docx"],
                              "application/vnd.ms-excel": [".xls"],
                              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                                [".xlsx"],
                              "application/vnd.ms-powerpoint": [".ppt"],
                              "application/vnd.openxmlformats-officedocument.presentationml.presentation":
                                [".pptx"],
                              "text/plain": [".txt"],
                              "application/xml": [".xml"],
                            }}
                            onDrop={(acceptedFiles) =>
                              handleChangeDocumentStatus({
                                file: acceptedFiles[0],
                              })
                            }
                          >
                            {({ getRootProps, getInputProps }) => (
                              <section className="container-fluid dashed-box">
                                <div
                                  {...getRootProps({ className: "dropzone" })}
                                >
                                  <input {...getInputProps()} />
                                  <p>Arrastra o sube tus archivos aquí</p>
                                </div>
                              </section>
                            )}
                          </Dropzone>
                        </div>
                      )}

                      <div
                        className={`col-4 text-${
                          colorFile[
                            fileTypes[
                              changedDocs &&
                              changedDocs[currentDocIndex]["file"]?.type
                                ? changedDocs[currentDocIndex]["file"].type
                                : "primary"
                            ]
                          ]
                        } mt-3`}
                      >
                        {changedDocs &&
                        changedDocs[currentDocIndex] &&
                        changedDocs[currentDocIndex]["file"] ? (
                          <div>
                            {console.log(
                              changedDocs[currentDocIndex]["file"].type
                            )}
                            <FontAwesomeIcon
                              icon={
                                changedDocs &&
                                changedDocs[currentDocIndex]["file"]?.type
                                  ? mimeIcons[
                                      changedDocs[currentDocIndex]["file"].type
                                    ]
                                  : faBan
                              }
                              size="3x"
                            />
                          </div>
                        ) : (
                          <FontAwesomeIcon icon={faBan} size="3x" />
                        )}
                      </div>
                    </div>

                    <div className="text-start">
                      <label className="d-block">
                        {langData.pieceInventoryEdit.name}:
                        <input
                          id="name"
                          type="text"
                          value={
                            Documents && Documents[currentDocIndex]?.name
                              ? Documents[currentDocIndex].name
                              : ""
                          }
                          onChange={handleInputDoc}
                          className="form-control mt-2"
                        />
                      </label>
                      <label className="d-block mt-2">
                        {langData.pieceInventoryEdit.size}:
                        <p className="mt-2">
                          {" "}
                          {formatSize(
                            Documents && Documents[currentDocIndex]?.size
                              ? Documents[currentDocIndex].size
                              : 0
                          )}
                        </p>
                      </label>
                    </div>

                    <div className="d-flex justify-content-between">
                      <Button
                        variant="contained"
                        color="secondary"
                        type="button"
                        onClick={handlePrevDoc}
                      >
                        ← {langData.pieceInventoryEdit.previous}
                      </Button>
                      <span>
                        {currentDocIndex + 1} /{" "}
                        {Documents?.length ? Documents.length : null}
                      </span>{" "}
                      {/* Paginación */}
                      <Button
                        variant="contained"
                        color="secondary"
                        type="button"
                        onClick={handleNextDoc}
                      >
                        {langData.pieceInventoryEdit.next} →
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col">
                <div className="card mt-4" style={{ background: "#abcc" }}>
                  {/* Card Header */}
                  <div
                    className="card-header text-center"
                    style={{
                      background: "#99dd",
                      position: "relative",
                      padding: "10px",
                      cursor: "pointer",
                    }}
                    onClick={toggleExpandNewDoc}
                  >
                    {/* Header Content */}
                    <span>Documentos nuevos</span>
                    {isExpandedDoc && (
                      <>
                        <IconButton
                          sx={{ color: pink[400] }}
                          aria-label="del image"
                          onClick={(e) => {
                            e.stopPropagation(); // Evita que el clic oculte el contenido
                            deleteDocument(currentDocNewIndex);
                          }}
                          style={{
                            position: "absolute",
                            right: "75px",
                            top: "50%",
                            transform: "translateY(-50%)",
                          }}
                        >
                          <RemoveIcon />
                        </IconButton>

                        <IconButton
                          color="secondary"
                          aria-label="add image"
                          onClick={(e) => {
                            e.stopPropagation(); // Evita que el clic oculte el contenido
                            addDocument();
                          }}
                          style={{
                            position: "absolute",
                            right: "50px",
                            top: "50%",
                            transform: "translateY(-50%)",
                          }}
                        >
                          <AddIcon />
                        </IconButton>
                      </>
                    )}
                    <IconButton
                      color="primary"
                      aria-label="toggle expand"
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                    >
                      {isExpandedDoc ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </div>

                  {/* Card Body */}
                  {isExpandedDoc && (
                    <div className="card-body">
                      <div className="row">
                        {/* Icon Section */}
                        <div className="col-4">
                          <div
                            className={`text-${
                              colorFile[
                                fileTypes[
                                  DocumentsNew[currentDocNewIndex] &&
                                  DocumentsNew[currentDocNewIndex]["file"] &&
                                  DocumentsNew[currentDocNewIndex]["file"].type
                                    ? DocumentsNew[currentDocNewIndex]["file"]
                                        .type
                                    : "primary"
                                ]
                              ]
                            } mt-3`}
                          >
                            <FontAwesomeIcon
                              icon={
                                DocumentsNew[currentDocNewIndex] &&
                                DocumentsNew[currentDocNewIndex]["file"] &&
                                DocumentsNew[currentDocNewIndex]["file"].type
                                  ? mimeIcons[
                                      DocumentsNew[currentDocNewIndex]["file"]
                                        .type
                                    ]
                                  : faBan
                              }
                              size="3x"
                            />
                          </div>
                        </div>

                        {/* Dropzone for Document Upload */}
                        <div className="col-4">
                          <Dropzone
                            maxFiles={1}
                            accept={{
                              "application/pdf": [".pdf"],
                              "application/msword": [".doc"],
                              "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                                [".docx"],
                              "application/vnd.ms-excel": [".xls"],
                              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                                [".xlsx"],
                              "application/vnd.ms-powerpoint": [".ppt"],
                              "application/vnd.openxmlformats-officedocument.presentationml.presentation":
                                [".pptx"],
                              "text/plain": [".txt"],
                              "text/xml": [".xml"],
                            }}
                            onDrop={(acceptedFiles) =>
                              handleDocumentDrop(acceptedFiles)
                            }
                          >
                            {({ getRootProps, getInputProps }) => (
                              <section className="container-fluid dashed-box">
                                <div
                                  {...getRootProps({ className: "dropzone" })}
                                >
                                  <input {...getInputProps()} />
                                  <p>Arrastra o sube tus archivos aquí</p>
                                </div>
                              </section>
                            )}
                          </Dropzone>
                        </div>
                      </div>

                      {/* Document Details */}
                      <div className="text-start">
                        <label className="d-block">
                          {langData.pieceInventoryEdit.name}:
                          <input
                            id="NewDocName"
                            type="text"
                            value={DocumentsNew[currentDocNewIndex]?.name || ""}
                            className="form-control mt-2"
                            onChange={(e) => {
                              const updatedDocs = [...DocumentsNew];
                              updatedDocs[currentDocNewIndex] = {
                                ...updatedDocs[currentDocNewIndex],
                                name: e.target.value,
                              };
                              setDocumentsNew(updatedDocs);
                            }}
                          />
                        </label>
                        <label className="d-block mt-2">
                          {langData.pieceInventoryEdit.size}:
                          <p className="mt-2">
                            {formatSize(
                              DocumentsNew &&
                                DocumentsNew[currentDocNewIndex]?.file?.size
                                ? DocumentsNew[currentDocNewIndex].file.size
                                : 0
                            )}
                          </p>
                        </label>
                      </div>

                      {/* Pagination Controls */}
                      <div className="d-flex justify-content-between">
                        <Button
                          variant="contained"
                          color="secondary"
                          type="button"
                          onClick={handlePrevNewDoc}
                        >
                          ← {langData.pieceInventoryEdit.previous}
                        </Button>
                        <span>
                          {currentDocNewIndex + 1} /{" "}
                          {DocumentsNew?.length ? DocumentsNew.length : null}
                        </span>{" "}
                        {/* Paginación */}
                        <Button
                          variant="contained"
                          color="secondary"
                          type="button"
                          onClick={handleNextNewDoc}
                        >
                          {langData.pieceInventoryEdit.next} →
                        </Button>
                      </div>
                    </div>
                  )}
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
                    <h5 className="modal-title" id="noChangesModalLabel">
                      Sin cambios detectados
                    </h5>
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


            <div
              className="modal fade"
              id="ChangesModal"
              tabIndex="-1"
              aria-labelledby="ChangesModalLabel"              
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="ChangesModalLabel">
                      Cambios detectados
                    </h5>
                    <button
                      type="button"
                      className="btn-close m-1"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>

                  <div className="modal-body">
                    <p>Se han detectado cambios en la información de la pieza.</p>
                    <p>¿Deseas guardar los cambios?</p>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-primary"
                      data-bs-dismiss="modal"
                      onClick={sendSave}
                    >
                      Guardar cambios
                    </button>
                    

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




            <Button
              variant="contained"
              color="primary"
              type="submit"
              className="btn btn-primary mt-2 mb-5"
            >
              Save
            </Button>
          </form>
        </div>
      )}
    </>
  );
};

// Agrega esta función en el componente para formatear la fecha:
function formatDate(dateTime) {
  return dateTime.split(" ")[0]; // Extrae solo la fecha en formato YYYY-MM-DD
}

const ModalPictures = ({ IDmodal, picFileName = null, ObjectImg = null }) => {
  let ImageModal;

  if (ObjectImg === null) {
    ImageModal =
      SETTINGS.URL_ADDRESS.server_url +
      SETTINGS.URL_ADDRESS.inventory_full_size +
      picFileName;
  } else {
    ImageModal = ObjectImg;
  }

  return (
    <div
      className="modal fade"
      id={IDmodal}
      tabIndex="-1"
      aria-labelledby={`${IDmodal}Label`}
    >
      <div className="modal-dialog modal-lg modal-fullscreen-md-down bg-secondary">
        <div className="modal-content">
          <div className="modal-body bg-secondary">
            <button
              type="button"
              className="btn-close mt-1 me-1"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
            <div
              id={`carousel${IDmodal}Fade`}
              className="carousel slide carousel-fade"
            >
              <div className="carousel-inner">
                <img
                  src={ImageModal}
                  className="d-block w-100 mt-3"
                  alt="..."
                />
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
