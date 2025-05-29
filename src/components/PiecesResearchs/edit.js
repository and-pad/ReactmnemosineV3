import { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import SETTINGS from "../Config/settings";
import { useDataResearch } from "./researchsActions";
import { API_UpdateResearch } from "./APICalls";
import { getTranslations } from "../Languages/i18n";
import { TextField, Paper, Box, Autocomplete, Chip } from "@mui/material";
import Dropzone from "react-dropzone";
import { IconButton, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { pink } from "@mui/material/colors";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { faBan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  formatSize,
  fileTypes,
  mimeIcons,
  colorFile,
} from "../LocalTools/tools";

import {
  FormControlLabel,
  Switch,
  CardHeader,
  Typography,
} from "@mui/material";

const langData = getTranslations();

const image_path =
  SETTINGS.URL_ADDRESS.server_url + SETTINGS.URL_ADDRESS.research_thumbnails;

export const EditResearch = ({ accessToken, refreshToken, permissions }) => {
  const { _id } = useParams();
  const big_data = useDataResearch();
  const navigate = useNavigate();
  const [formDataResearch, setFormDataResearch] = useState(null);

  const [AllAuthors, setAllAuthors] = useState();
  const [AllInvolvedCreation, setAllInvolvedCreation] = useState();
  const [AllPlaceOfCreation, setAllPlaceOfCreation] = useState();
  const [AllPeriod, setAllPeriod] = useState();
  const textareaRef = useRef(null); // Crear referencia para el textarea

  const [actualFormData, setCpFormData] = useState();

  const [filteredAuthors, setFilteredAuthors] = useState([]);
  const [filteredInvolvedCreation, setFilteredInvolvedCreation] = useState([]);
  const [filteredPlaceOfCreation, setFilteredPlaceOfCreation] = useState(); //setFilteredPlaceOfCreation
  const [filteredPeriod, setFilteredPeriod] = useState();
  const [Genders, setGenders] = useState();
  const [Subgenders, setSubgenders] = useState();
  const [ObjectTypes, setObjectTypes] = useState();
  const [DominantMaterials, setDominantMaterials] = useState();
  const [filteredGenders, setFilteredGenders] = useState([]);
  const [filteredSubGenders, setFilteredSubGenders] = useState([]);
  const [selectedGender, setSelectedGender] = useState();
  const [selectedSubGender, setSelectedSubGender] = useState();
  const [selectedTypeObject, setSelectedTypeObject] = useState();
  const [filteredTypeObject, setfilteredTypeObject] = useState();
  const [selectedPeriod, setSelectedPeriod] = useState();
  const [selectedPlaceOfCreation, setSelectedPlaceOfCreation] = useState();
  const [selectedDominantMaterial, setSelectedDominantMaterial] = useState();
  const [filteredDominantMaterial, setFilteredDominantMaterial] = useState();
  const [Documents, setDocuments] = useState([]);
  const [Pics, setPics] = useState([]);
  const [currentPic, setCurrentPic] = useState(); //la imagen que se muestra actualmente
  const [currentImgIndex, setCurrentImgIndex] = useState(0); //el indice para navegar entre imagenes
  const [changedPics, setchangedPics] = useState({});
  const [isExpandedImg, setIsExpandedImg] = useState(false); // [setIsExpandedImg]
  const [PicsNew, setPicsNew] = useState([]); //Estas imagenes van cambiando conforme se escribe sobre ellas
  const [currentImgNewIndex, setCurrentImgNewIndex] = useState(0); //el indice para navegar entre imagenes
  const [currentDocIndex, setCurrentDocIndex] = useState(0);
  const [changedDocs, setchangedDocs] = useState();
  const [currentDocNewIndex, setCurrentDocNewIndex] = useState(0); //el indice para navegar entre imagenes
  const [DocumentsNew, setDocumentsNew] = useState([]); //Estas imagenes van cambiando conforme se escribe sobre ellas
  const [actualPics, setCpPics] = useState(); //Estas se mantienen como estaban para hacer la comparación
  const [isExpandedDoc, setIsExpandedDoc] = useState(false);

  const [footnotes, setFootnotes] = useState();
  const [actualFootnotes, setCpFootnotes] = useState(); //Estas se mantienen como estaban para hacer la comparación

  const [bibliographies, setBibliographies] = useState();
  const [actualBibliographies, setCpBibliographies] = useState(); //Estas se mantienen como estaban para hacer la comparación

  const [currentFootnoteIndex, setCurrentFootnoteIndex] = useState(0);
  const [currentBibliographyIndex, setCurrentBibliographyIndex] = useState(0);
  const [allreferences, setReferences] = useState();
  const [filteredReferences, setfilteredReferences] = useState();
  const [selectedReference, setSelectedReference] = useState();
  const data = big_data && big_data["research_data"];
  const InventoryData =
    data && data["inventory_data"] && data["inventory_data"][0];

  const [inventoryModifications, SetInventoryModifications] = useState({});

  const inventory_fields = [
    "gender_id",
    "subgender_id",
    "type_object_id",
    "dominant_material_id",
    "description_origin",
    "description_inventory",
  ];

  const compareFormModifications = (original, modified) => {
    let changes = {};

    for (const key in original) {
      let originalValue = original[key];
      let modifiedValue = modified[key];
      if (key === "authors") {
       /* console.log("originalValue", originalValue);
        console.log("modifiedValue", modifiedValue);*/
      }
      // Aplicar trim a los strings
      if (typeof originalValue === "string")
        originalValue = originalValue.trim();
      if (typeof modifiedValue === "string")
        modifiedValue = modifiedValue.trim();

      // Si el valor es un objeto con _id, solo compararemos _id
      if (
        originalValue !== null &&
        modifiedValue !== null &&
        typeof originalValue === "object" &&
        typeof modifiedValue === "object"
      ) {
        // hacer un if en caso de que el objeto sea un array y comparar los _id de cada uno en el array

        if (Array.isArray(originalValue) && Array.isArray(modifiedValue)) {
          const originalIds = originalValue
            .map((item) => item?._id)
            .filter(Boolean);
          const modifiedIds = modifiedValue
            .map((item) => item?._id)
            .filter(Boolean);

          const sameLength = originalIds.length === modifiedIds.length;

          const allIdsMatch =
            sameLength &&
            originalIds.every((id) => modifiedIds.includes(id)) &&
            modifiedIds.every((id) => originalIds.includes(id));

          if (!allIdsMatch) {
            changes[key] = {
              oldValue:
                Array.isArray(original[key]) && original[key].length > 0
                  ? original[key]
                  : null,
              newValue:
                Array.isArray(modified[key]) && modified[key].length > 0
                  ? modified[key]
                  : null,
            };
          }
        } else {
          if (
            originalValue &&
            modifiedValue &&
            originalValue._id !== modifiedValue._id
          ) {
            changes[key] = {
              oldValue: original[key],
              newValue: modified[key],
            };
          }
        }
      }
      // Comparación normal para strings y valores primitivos
      else if (originalValue !== modifiedValue) {
        changes[key] = {
          oldValue: original[key] ? original[key] : null,
          newValue: modified[key],
        };
        if (key === "authors") {
          /*console.log("originalValue desde if array", originalValue);
          console.log("modifiedValue", modifiedValue);*/
        }
      }
    }

    return changes;
  };
  const addDocument = () => {
    const newDocument = { name: "", file: null };
    setDocumentsNew([...DocumentsNew, newDocument]);
    setCurrentDocNewIndex(DocumentsNew.length); // Actualiza el índice al último elemento nuevo
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

  const handlePrevNewDoc = () => {
    setCurrentDocNewIndex((prevIndex) => {
      if (DocumentsNew.length > 0) {
        return prevIndex === 0 ? DocumentsNew.length - 1 : prevIndex - 1;
      }
      return prevIndex; // No cambia si no hay imágenes
    });
  };
  const handleNextNewDoc = () => {
    setCurrentDocNewIndex((prevIndex) => {
      if (DocumentsNew.length > 0) {
        return prevIndex === DocumentsNew.length - 1 ? 0 : prevIndex + 1;
      }
      return prevIndex; // No cambia si no hay imágenes
    });
  };

  const deleteDocument = (index) => {
    setDocumentsNew(DocumentsNew.filter((_, i) => i !== index));
    setCurrentDocNewIndex(0); // Actualiza el índice al primer elemento
  };
  const handleInputChange = (e) => {
    const { id, value } = e.target;

    setFormDataResearch((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleInputFootnoteChange = (e) => {
    const { id, value } = e.target;

    setFootnotes((prevData) =>
      prevData.map((footnote, index) => {
        if (index === currentFootnoteIndex) {
          const updatedFootnote = { ...footnote, [id]: value };
          /*console.log("Updated footnote:", updatedFootnote[id]);
          console.log("actualFootnotes:", actualFootnotes[index][id]);*/
          return updatedFootnote;
        }
        return footnote;
      })
    );
  };

  const handleInputBibliographyChange = (e) => {
    const { id, value } = e.target;

    setBibliographies((prevData) =>
      prevData.map((bibliography, index) => {
        if (index === currentBibliographyIndex) {
          const updatedBibliography = { ...bibliography, [id]: value };
          /*console.log("Updated bibliography:", updatedBibliography[id]);
          console.log("actualBibliographies:", actualBibliographies[index][id]);*/
          return updatedBibliography;
        }
        return bibliography;
      })
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

  const handlePrevDoc = () => {
    setCurrentDocIndex((prevIndex) =>
      prevIndex === 0 ? Documents.length - 1 : prevIndex - 1
    );
  };
  const handleNextDoc = () => {
    setCurrentDocIndex((prevIndex) =>
      prevIndex === Documents.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleImageDrop = (acceptedFiles) => {
    //console.log("pics new", PicsNew);
    const updatedPics = [...PicsNew];
    updatedPics[currentImgNewIndex] = {
      ...updatedPics[currentImgNewIndex],
      file: acceptedFiles[0],
      size: acceptedFiles[0].size,
      mime_type: acceptedFiles[0].type,
    };
    setPicsNew(updatedPics);
  };
  const deleteImage = (index) => {
    setPicsNew(PicsNew.filter((_, i) => i !== index));
    setCurrentImgNewIndex(0); // Actualiza el índice al primer elemento
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

  const handleAuthorsChange = (selectedAuthors) => {
    setFormDataResearch((prev) => ({
      ...prev,
      authors: selectedAuthors, // Guardar múltiples autores en el estado
    }));
    //console.log("Autores seleccionados", selectedAuthors);
    //console.log("formDataResearch.authors", formDataResearch["authors"]);
    //console.log("Autores seleccionados", selectedAuthors);
  };

  const handleInvolvedChange = (selectedInvolved) => {
    setFormDataResearch((prev) => ({
      ...prev,
      involved_creation: selectedInvolved, // Guardar múltiples autores en el estado
    }));
    //console.log("Autores seleccionados", selectedInvolved);
  };

  const handleReferenceChange = (selectedReferences) => {
    setBibliographies((prev) => {
      const updated = [...prev]; // copia superficial del arreglo
      updated[currentBibliographyIndex] = {
        ...updated[currentBibliographyIndex],
        reference_type_info: [selectedReferences], // esto debe ser un array
      };     
      return updated;
    });
    setSelectedReference(selectedReferences); // Actualiza el estado del reference_type_info
  };

  const handlePrevBibliography = () => {
    setCurrentBibliographyIndex((prevIndex) => {
      const newIndex =
        prevIndex === 0 ? bibliographies.length - 1 : prevIndex - 1;
      setSelectedReference(bibliographies[newIndex].reference_type_info[0]);
      return newIndex;
    });
  };
  const handleNextBibliography = () => {
    setCurrentBibliographyIndex((prevIndex) => {
      const newindex =
        prevIndex === bibliographies.length - 1 ? 0 : prevIndex + 1;
      setSelectedReference(bibliographies[newindex].reference_type_info[0]);
      return newindex;
    });

   // console.log("bibliographies", bibliographies[currentBibliographyIndex]);
  };
  const handlePlaceOfCreationChange = (selectedPlaceOfCreation) => {
    setFormDataResearch((prev) => ({
      ...prev,
      place_of_creation: {
        _id: selectedPlaceOfCreation._id,
        title: selectedPlaceOfCreation.title,
      }, // Guardar múltiples autores en el estado
    }));
    //console.log("Autores seleccionados", selectedPlaceOfCreation);
  };
  const handlePlaceOfCreationFilter = (e) => {
    const { value } = e.target;
    const filtered = AllPlaceOfCreation.filter((place_of_creation) =>
      place_of_creation.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPlaceOfCreation(filtered);
  };

  const handlePeriodChange = (selectedPeriod) => {
    setFormDataResearch((prev) => ({
      ...prev,
      period: { _id: selectedPeriod._id, title: selectedPeriod.title }, // Guardar múltiples autores en el estado
    }));
    //console.log("Autores seleccionados", selectedPeriod);
  };

  const handleFilteredPeriod = (e) => {
    const { value } = e.target;
    const filtered = AllPeriod.filter((period) =>
      period.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPeriod(filtered);
  };

  const removeAuthor = (id) => {
    setFormDataResearch((prev) => ({
      ...prev,
      authors: prev.authors.filter((author) => author._id !== id),
    }));
  };

  const removeInvolved = (id) => {
    setFormDataResearch((prev) => ({
      ...prev,
      involved_creation: prev.involved_creation.filter(
        (involved) => involved._id !== id
      ),
    }));
  };
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
    const filtered = ObjectTypes.filter((type_object) =>
      type_object.title.toLowerCase().includes(value.toLowerCase())
    );
    setfilteredTypeObject(filtered);
  };

  const handleReferenceFilter = (e) => {
    const { value } = e.target;
    const filtered = allreferences.filter((reference) =>
      reference.title.toLowerCase().includes(value.toLowerCase())
    );
    setfilteredReferences(filtered);
  };

  const handleDominantMaterialFilter = (e) => {
    const { value } = e.target;
    const filtered = DominantMaterials.filter((dominant_material) =>
      dominant_material.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredDominantMaterial(filtered);
  };

  const handleGenderChange = (SelectedGender) => {
    setFormDataResearch({
      ...formDataResearch,
      gender_id: {
        _id: SelectedGender._id,
        title: SelectedGender.title,
      },
    });
   // console.log("selected Gender", SelectedGender);
    setFilteredSubGenders(
      Subgenders.filter(
        (subgender) => subgender.gender_id === SelectedGender._id
      )
    );
    /*
    console.log("Subgenderss",Subgenders.filter(
      (subgender) => subgender.gender_id === SelectedGender._id
      
    ));*/
  };
  const toggleExpandNewDoc = () => {
    setIsExpandedDoc(!isExpandedDoc);
  };
  const handleInputPic = (e) => {
    const { id, value } = e.target;
   /* console.log("value", value);
    console.log("id", id);*/
    setPics((prevData) =>
      prevData.map(
        (pic, index) =>
          index === currentImgIndex
            ? { ...pic, [id]: value } // Crea una copia del objeto actual con el campo actualizado
            : pic // Retorna el objeto sin cambios si el índice no coincide
      )
    );
  };

  const handlePrevFootnote = () => {
    setCurrentFootnoteIndex((prevIndex) =>
      prevIndex === 0 ? footnotes.length - 1 : prevIndex - 1
    );
  };
  const handleNextFootnote = () => {
    setCurrentFootnoteIndex((prevIndex) =>
      prevIndex === footnotes.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentImgIndex((prevIndex) => {
      const newIndex = prevIndex === 0 ? Pics.length - 1 : prevIndex - 1;
      setCurrentPic(Pics && Pics.length > 0 ? Pics[newIndex] : null);
      return newIndex;
    });
  };

  const handleNext = () => {
    setCurrentImgIndex((prevIndex) => {
      const newIndex = prevIndex === Pics.length - 1 ? 0 : prevIndex + 1;
      //console.log(newIndex);
      setCurrentPic(Pics && Pics.length > 0 ? Pics[newIndex] : null);
      return newIndex;
    });
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
  const toggleExpandNewImage = () => {
    setIsExpandedImg(!isExpandedImg);
  };
  useEffect(() => {
    //setDocuments(data["documents"]);
   /* console.log(
      "big_data",
      big_data && big_data["research_data"]["bibliographies_info"]
    );*/

    setAllAuthors(big_data && big_data["all_authors"]);
    setAllInvolvedCreation(big_data && big_data["all_involved_creation"]);
    setAllPlaceOfCreation(big_data && big_data["all_place_of_creation"]);
    setAllPeriod(big_data && big_data["all_period"]);
    setGenders(big_data && big_data["all_genders"]);
    setSubgenders(big_data && big_data["all_subgenders"]);
    setObjectTypes(big_data && big_data["all_object_type"]);
    setDominantMaterials(big_data && big_data["all_dominant_material"]);
    setReferences(big_data && big_data["all_references_type"]);

    setSelectedGender(
      big_data && big_data["research_data"]["inventory_data"][0]["genders_info"]
    );
    setSelectedSubGender(
      big_data &&
        big_data["research_data"]["inventory_data"][0]["subgenders_info"]
    );
    setSelectedTypeObject(
      big_data &&
        big_data["research_data"]["inventory_data"][0]["type_object_info"]
    );
    setSelectedDominantMaterial(
      big_data &&
        big_data["research_data"]["inventory_data"][0]["dominant_material_info"]
    );
    setSelectedPeriod(
      big_data &&
        big_data["research_data"]["period_info"] &&
        big_data["research_data"]["period_info"][0]
    );
    setSelectedPlaceOfCreation(
      big_data &&
        big_data["research_data"]["place_of_creation_info"] &&
        big_data["research_data"]["place_of_creation_info"][0]
    );
    /*console.log(
      "period_info!!!",
      big_data && big_data["research_data"]["period_info"]
    );*/
    setDocuments(big_data && big_data["research_data"]["documents"]);
    setPics(big_data && big_data["research_data"]["photos"]);

    setCpPics(big_data && big_data["research_data"]["photos"]);
    setFootnotes(big_data && big_data.research_data.footnotes_info);
    setCpFootnotes(big_data && big_data.research_data.footnotes_info);
    setBibliographies(big_data && big_data.research_data.bibliographies_info);
    setCpBibliographies(big_data && big_data.research_data.bibliographies_info);
    setSelectedReference(
      big_data &&
        big_data.research_data.bibliographies_info[currentBibliographyIndex] &&
        big_data.research_data.bibliographies_info[currentBibliographyIndex]
          .reference_type_info[0]
    );

    /* console.log("selectedReference", big_data &&
        big_data.research_data.bibliographies_info[currentBibliographyIndex] &&
        big_data.research_data.bibliographies_info[currentBibliographyIndex].reference_type_info[0] );*/
  }, [big_data]);

  useEffect(() => {
    //console.log("permissions", permissions);
    const data_research = {
      title: data?.title ? data.title : null,
      technique: data?.technique ? data.technique : null,
      materials: data?.materials ? data.materials : null,
      creation_date: data?.creation_date ? data.creation_date : null,
      acquisition_form: data?.acquisition_form ? data.acquisition_form : null,
      acquisition_source: data?.acquisition_source
        ? data.acquisition_source
        : null,
      acquisition_date: data?.acquisition_date ? data.acquisition_date : null,
      firm: data?.firm ? data.firm : null,
      firm_description: data?.firm_description ? data.firm_description : null,
      short_description: data?.short_description
        ? data.short_description
        : null,
      formal_description: data?.formal_description
        ? data.formal_description
        : null,
      observation: data?.observation ? data.observation : null,
      publications: data?.publications ? data.publications : null,
      card: data?.card ? data.card : null,
      keywords: data?.keywords ? data.keywords : null,

      gender_id: InventoryData?.genders_info
        ? InventoryData.genders_info
        : null,
      subgender_id: InventoryData?.subgenders_info
        ? InventoryData.subgenders_info
        : null,
      type_object_id: InventoryData?.type_object_info
        ? InventoryData.type_object_info
        : null,
      dominant_material_id: InventoryData?.dominant_material_info
        ? InventoryData.dominant_material_info
        : null,
      authors: data && data.authors_info,
      involved_creation: data && data.involved_creation_info,
      place_of_creation: data && data.place_of_creation_info,
      period: data && data.period_info,

      description_origin: InventoryData?.description_origin
        ? InventoryData.description_origin
        : null,
      description_inventory: InventoryData?.description_inventory
        ? InventoryData.description_inventory
        : null,
    };

    //setFormData(data_research);
    //setCpFormData(data_research);
    //console.log("Authors", big_data && big_data.period_research);
    // setDataResearch(data_research);
    setFormDataResearch(data_research);
    setCpFormData(data_research);
    setFilteredAuthors(AllAuthors);
    setFilteredInvolvedCreation(AllInvolvedCreation);
    setFilteredPlaceOfCreation(AllPlaceOfCreation);
    setFilteredPeriod(AllPeriod);
    setFilteredGenders(Genders);
    setfilteredTypeObject(ObjectTypes);
    setFilteredDominantMaterial(DominantMaterials);
    setfilteredReferences(allreferences);

    SetInventoryModifications(
      (big_data && big_data["research_data"]["inventory_modifications"]) || []
    );
    //setFilteredSubGenders(Subgenders);
    //console.log("all authors", AllAuthors);
    setFilteredSubGenders(
      Subgenders?.filter((subgender) => {
        const subgenderIdStr = subgender.gender_id.toString();
        const bigDataIdStr =
          big_data["research_data"]["inventory_data"][0]["subgenders_info"][
            "gender_id"
          ].toString();
        // console.log("subgenderIdStr", subgenderIdStr);
        if (subgenderIdStr === bigDataIdStr) {
          //console.log("subgender", subgender);
          return subgender;
        } else {
          //  console.log("subgender", subgender.gender_id);
          //console.log("bigDataId", bigDataIdStr);
          return null;
        }
      })
    );

    if (Pics && Pics.length > 0) {
      setCurrentPic(Pics[currentImgIndex]);
      //console.log("Pics current", Pics[currentImgIndex]);
      //console.log("current index", currentImgIndex);
      //console.log("Pics", Pics);
    }
  }, [
    data,
    setFormDataResearch,
    setCpFormData,
    AllPlaceOfCreation,
    DominantMaterials,
    ObjectTypes,
    currentImgIndex,
    AllAuthors,
    AllInvolvedCreation,
    InventoryData,
    AllPeriod,
    Genders,
    Subgenders,
    big_data,
    Pics,
  ]);

  useEffect(() => {
    // Ajustar la altura al iniciar o al cambiar el contenido
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height to auto to shrink
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Ajustar a contenido
    }
  }, [formDataResearch?.title]); // Se ejecuta cuando formDataResearch.title cambia

  const handleSave = async (e) => {
    e.preventDefault();

    const changes = compareFormModifications(actualFormData, formDataResearch);
    
    const changes_pics_inputs = comparePicsModifications(actualPics, Pics);
    if (
      (changes && Object.keys(changes).length) > 0 ||
      (PicsNew && PicsNew.length > 0) ||
      (changes_pics_inputs && Object.keys(changes_pics_inputs).length > 0) ||
      (changedPics && Object.keys(changedPics).length > 0)
    ) {
      
      const response = await API_UpdateResearch({
        accessToken,
        refreshToken,
        changes,
        changedPics,
        changes_pics_inputs,
        PicsNew,
        _id,
      });
      
    }
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
  return (
    <div>
      <div className="container">
        <form onSubmit={handleSave}>
          <div
            className="card pt-3 ps-3 pe-3 pb-1 "
            style={{ background: "#abcc" }}
          >
            {/*
*********************************************************************************************************************
*********************************************************************************************************************
*********************************************************************************************************************
*********************************************************************************************************************
*********************************************************************************************************************
*********************************************************************************************************************
*********************************************************************************************************************
*********************************************************************************************************************
                                Campos de Inventario
 */}
            <div className="row mb-3">
              {inventoryModifications.length > 0 ? (
                <>
                  <div
                    className="card border-primary pt-1 "
                    style={{ background: " #abaa" }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#0d6efd",
                        fontWeight: "bold",
                        textAlign: "center",
                        padding: "2px 0", // Reduce padding arriba y abajo
                      }}
                    >
                      {
                        langData.pieceDetailDescriptors.research
                          .inventory_fields
                      }
                    </Typography>
                    <Typography
                      variant="h7"
                      sx={{
                        color: "#0d6efd",
                        fontWeight: "bold",
                        textAlign: "center",
                        padding: "2px 0", // Reduce padding arriba y abajo
                      }}
                    >
                      {"Tiene modificaciones por aprobar"}
                    </Typography>
                    <table className="table table-bordered table-striped">
                      <thead className="table-dark">
                        <tr>
                          <th>
                            {
                              langData.pieceDetailDescriptors
                                .inventory_in_research.field
                            }
                          </th>
                          <th>
                            {
                              langData.pieceDetailDescriptors
                                .inventory_in_research.actual_value
                            }
                          </th>
                          <th>
                            {
                              langData.pieceDetailDescriptors
                                .inventory_in_research.tochange_value
                            }
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {inventory_fields?.map((field) => {
                          const label =
                            langData.pieceDetailDescriptors
                              .inventory_in_research[field] || field;
                          const modification =
                            inventoryModifications[0][field] || {};
                          const formatValue = (value) => {
                            if (typeof value === "object" && value !== null) {
                              return value.title ?? JSON.stringify(value);
                            } else if (value === null) {
                              return null;
                            }
                            return value ?? false;
                          };

                          const oldFormatted = formatValue(
                            modification?.oldValue
                          );
                          const newFormatted = formatValue(
                            modification?.newValue
                          );
                          // Mostrar solo si alguno de los dos tiene cambios
                          if (
                            oldFormatted === false &&
                            newFormatted === false
                          ) {
                            return null;
                          }
                          return (
                            <tr key={field}>
                              <td>
                                <strong>{label}</strong>
                              </td>
                              <td>{oldFormatted}</td>
                              <td>{newFormatted}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div
                  className="card border-primary mb-1 "
                  style={{ background: " #abaa" }}
                >
                  <CardHeader
                    title={
                      <Typography
                        variant="h6"
                        sx={{
                          color: "#0d6efd",
                          fontWeight: "bold",
                          textAlign: "center",
                          padding: "2px 0", // Reduce padding arriba y abajo
                        }}
                      >
                        {
                          langData.pieceDetailDescriptors.research
                            .inventory_fields
                        }
                      </Typography>
                    }
                    sx={{ padding: "8px 16px 0 16px" }} // Menos espacio arriba y laterales normales
                  />

                  <Paper
                    elevation={6}
                    sx={{
                      paddingLeft: 1,
                      paddingRight: 1,
                      paddingBottom: 1,
                      margin: 1,
                    }}
                  >
                    <div className="mt-2">
                      <Autocomplete
                        freeSolo
                        options={filteredGenders || []}
                        getOptionLabel={(option) =>
                          typeof option === "string"
                            ? option
                            : option.title || ""
                        }
                        value={selectedGender || null}
                        onInputChange={(event, newValue) => {
                          if (event && event.type === "change") {
                            handleGenderFilter({ target: { value: newValue } });
                          }
                        }}
                        onChange={(event, newValue) => {
                          // Verificamos si newValue es un objeto antes de acceder a su propiedad _id
                          if (newValue && typeof newValue !== "string") {
                            handleGenderChange(newValue);
                          } else if (typeof newValue === "string") {
                            handleGenderChange({ _id: null, title: newValue });
                          } else {
                            // Si newValue es null o undefined, puedes manejarlo según lo necesites
                            handleGenderChange({ _id: null, title: "" });
                          }
                        }}
                        isOptionEqualToValue={(option, value) =>
                          option._id === value._id
                        }
                        renderOption={(props, option) => (
                          // `key` no se pasa dentro de `props` para evitar el error
                          <li {...props} key={option._id || option.title}>
                            {option.title}
                          </li>
                        )}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => {
                            // Extraemos `key` fuera de `props`
                            const { key, ...tagProps } = getTagProps({ index });
                            return (
                              <Chip
                                key={option._id}
                                {...tagProps}
                                label={option.title}
                              />
                            );
                          })
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={
                              langData.pieceDetailDescriptors.inventory.gender
                            }
                            placeholder={
                              langData.pieceDetailDescriptors.inventory
                                .type_to_filter_genders
                            }
                          />
                        )}
                      />
                    </div>
                  </Paper>

                  <Paper
                    elevation={6}
                    sx={{
                      paddingLeft: 1,
                      paddingRight: 1,
                      paddingBottom: 0,
                      marginLeft: 1,
                      marginRight: 1,
                      marginBottom: 1,
                    }}
                  >
                    <div className="mb-2 mt-2">
                      <Autocomplete
                        freeSolo
                        options={filteredSubGenders || []}
                        getOptionLabel={(option) =>
                          typeof option === "string"
                            ? option
                            : option.title || ""
                        }
                        value={selectedSubGender || ""}
                        onInputChange={(event, newValue) => {
                          if (event && event.type === "change") {
                            handleSubGenderFilter({
                              target: { value: newValue },
                            });
                          }
                        }}
                        onChange={(event, newValue) => {
                          if (newValue && typeof newValue !== "string") {
                            setFormDataResearch({
                              ...formDataResearch,
                              subgender_id: newValue,
                            });
                          } else if (typeof newValue === "string") {
                            setFormDataResearch({
                              ...formDataResearch,
                              subgender_id: { _id: null, title: newValue },
                            });
                          } else {
                            setFormDataResearch({
                              ...formDataResearch,
                              subgender_id: { _id: null, title: "" },
                            });
                          }
                        }}
                        isOptionEqualToValue={(option, value) =>
                          option._id === value._id
                        }
                        renderOption={(props, option) => (
                          <li {...props} key={option._id || option.title}>
                            {option.title}
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={
                              langData.pieceDetailDescriptors.inventory
                                .subgenders_info
                            }
                            placeholder={
                              langData.pieceDetailDescriptors.inventory
                                .type_to_filter_subgenders
                            }
                          />
                        )}
                      />
                    </div>
                  </Paper>

                  <Paper
                    elevation={6}
                    sx={{
                      paddingLeft: 1,
                      paddingRight: 1,
                      paddingBottom: 0,
                      marginLeft: 1,
                      marginRight: 1,
                      marginBottom: 1,
                    }}
                  >
                    <div className="mb-2 mt-2">
                      <Autocomplete
                        freeSolo
                        options={filteredTypeObject || []}
                        getOptionLabel={(option) =>
                          typeof option === "string"
                            ? option
                            : option.title || ""
                        }
                        value={selectedTypeObject || ""}
                        onInputChange={(event, newValue) => {
                          if (event && event.type === "change") {
                            handleTypeObjectFilter({
                              target: { value: newValue },
                            });
                          }
                        }}
                        onChange={(event, newValue) => {
                          if (newValue && typeof newValue !== "string") {
                            setFormDataResearch({
                              ...formDataResearch,
                              type_object_id: newValue,
                            });
                          } else if (typeof newValue === "string") {
                            setFormDataResearch({
                              ...formDataResearch,
                              type_object_id: { _id: null, title: newValue },
                            });
                          } else {
                            setFormDataResearch({
                              ...formDataResearch,
                              type_object_id: { _id: null, title: "" },
                            });
                          }
                        }}
                        isOptionEqualToValue={(option, value) =>
                          option._id === value._id
                        }
                        renderOption={(props, option) => (
                          <li {...props} key={option._id || option.title}>
                            {option.title}
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={
                              langData.pieceDetailDescriptors.inventory
                                .type_object_info
                            }
                            placeholder={
                              langData.pieceDetailDescriptors.inventory
                                .type_to_filter_types
                            }
                          />
                        )}
                      />
                    </div>
                  </Paper>

                  <Paper
                    elevation={6}
                    sx={{
                      paddingLeft: 1,
                      paddingRight: 1,
                      paddingBottom: 0,
                      marginLeft: 1,
                      marginRight: 1,
                      marginBottom: 1,
                    }}
                  >
                    <div className="mb-2 mt-2">
                      <Autocomplete
                        freeSolo
                        options={filteredDominantMaterial || []}
                        getOptionLabel={(option) =>
                          typeof option === "string"
                            ? option
                            : option.title || ""
                        }
                        value={selectedDominantMaterial || ""}
                        onInputChange={(event, newValue) => {
                          if (event && event.type === "change") {
                            handleDominantMaterialFilter({
                              target: { value: newValue },
                            });
                          }
                        }}
                        onChange={(event, newValue) => {
                          if (newValue && typeof newValue !== "string") {
                            setFormDataResearch({
                              ...formDataResearch,
                              dominant_material_id: newValue,
                            });
                          } else if (typeof newValue === "string") {
                            setFormDataResearch({
                              ...formDataResearch,
                              dominant_material_id: {
                                _id: null,
                                title: newValue,
                              },
                            });
                          } else {
                            setFormDataResearch({
                              ...formDataResearch,
                              dominant_material_id: { _id: null, title: "" },
                            });
                          }
                        }}
                        isOptionEqualToValue={(option, value) =>
                          option._id === value._id
                        }
                        renderOption={(props, option) => (
                          <li {...props} key={option._id || option.title}>
                            {option.title}
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={
                              langData.pieceDetailDescriptors.inventory
                                .dominant_material_info
                            }
                            placeholder={
                              langData.pieceDetailDescriptors.inventory
                                .type_to_filter_materials
                            }
                          />
                        )}
                      />
                    </div>
                  </Paper>

                  {/* Descripción de Origen */}
                  <Paper
                    elevation={6}
                    sx={{
                      paddingLeft: 1,
                      paddingRight: 1,
                      paddingBottom: 0,
                      paddingTop: 1,
                      marginLeft: 1,
                      marginRight: 1,
                      marginBottom: 1,
                    }}
                  >
                    <div className="mb-2">
                      <TextField
                        fullWidth
                        variant="outlined"
                        label={
                          langData.pieceDetailDescriptors.inventory
                            .description_origin
                        }
                        multiline
                        rows={2}
                        value={formDataResearch?.description_origin || ""}
                        onChange={(e) => {
                          setFormDataResearch((prevData) => ({
                            ...prevData,
                            description_origin: e.target.value,
                          }));
                        }}
                        sx={{
                          "& .MuiInputLabel-root": {
                            color: "#6c757d", // Color gris para el label
                          },
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: "#ffffff",
                          },
                          "& textarea": {
                            resize: "both", // Permite redimensionar
                            overflow: "auto", // Asegura que se pueda desplazar si es necesario
                          },
                        }}
                      />
                    </div>
                  </Paper>

                  {/* Descripción de Inventario */}
                  <Paper
                    elevation={6}
                    sx={{
                      paddingLeft: 1,
                      paddingRight: 1,
                      paddingBottom: 0,
                      paddingTop: 1,
                      marginLeft: 1,
                      marginRight: 1,
                      marginBottom: 1,
                    }}
                    className="mb-4"
                  >
                    <div className="mb-2">
                      <TextField
                        fullWidth
                        variant="outlined"
                        label={
                          langData.pieceDetailDescriptors.inventory
                            .description_inventory
                        }
                        multiline
                        rows={2}
                        value={formDataResearch?.description_inventory || ""}
                        onChange={(e) => {
                          setFormDataResearch((prevData) => ({
                            ...prevData,
                            description_inventory: e.target.value,
                          }));
                        }}
                        sx={{
                          "& .MuiInputLabel-root": {
                            color: "#6c757d", // Color gris para el label
                          },
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: "#ffffff",
                          },
                          "& textarea": {
                            resize: "both", // Permite redimensionar
                            overflow: "auto", // Asegura que se pueda desplazar si es necesario
                          },
                        }}
                      />
                    </div>
                  </Paper>
                </div>
              )}
            </div>

            <div className="row">
              <Paper
                elevation={6}
                sx={{
                  paddingLeft: 1,
                  paddingRight: 1,
                  paddingBottom: 0,
                  paddingTop: 1,

                  marginRight: 1,
                  marginBottom: 1,
                }}
              >
                {/*
**********************************************************************************************************************
**********************************************************************************************************************
**********************************************************************************************************************
**********************************************************************************************************************                
**********************************************************************************************************************
**********************************************************************************************************************
**********************************************************************************************************************
**********************************************************************************************************************                
**********************************************************************************************************************
**********************************************************************************************************************
**********************************************************************************************************************
**********************************************************************************************************************                
                /* Campos de Investigación */}

                <div className="mb-2">
                  <TextField
                    id="title"
                    variant="outlined"
                    fullWidth
                    label={langData.pieceDetailDescriptors.research.title}
                    multiline
                    rows={1}
                    value={formDataResearch?.title || ""}
                    onChange={(e) => {
                      handleInputChange(e);
                      // Ajusta la altura del textarea:
                      e.target.style.height = "auto";
                      e.target.style.height = e.target.scrollHeight + "px";
                    }}
                    sx={{
                      "& .MuiInputLabel-root": {
                        color: "#6c757d", // Label en gris
                      },
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#ffffff",
                      },
                      "& textarea": {
                        resize: "none", // Evita redimensionar manualmente
                        overflow: "hidden", // Sin barra de desplazamiento
                      },
                    }}
                  />
                </div>
              </Paper>
            </div>

            <div className="row mb-1">
              <Paper
                elevation={6}
                sx={{
                  paddingLeft: 1,
                  paddingRight: 1,
                  paddingTop: 1,

                  marginRight: 1,
                  marginBottom: 1,
                }}
              >
                <div className="row mb-2">
                  <div className="col">
                    <Autocomplete
                      multiple
                      id="authors"
                      options={
                        filteredAuthors?.filter(
                          (authors, index, self) =>
                            self.findIndex((a) => a._id === authors._id) ===
                              index && // Evita duplicados
                            !formDataResearch?.authors?.some(
                              (a) => a._id === authors._id
                            ) // Evita mostrar seleccionados
                        ) || []
                      }
                      getOptionLabel={(option) => option.title || ""}
                      getOptionKey={(option) => option._id}
                      value={formDataResearch?.authors || []}
                      onChange={(event, newValue) =>
                        handleAuthorsChange(newValue)
                      }
                      filterOptions={(options, { inputValue }) =>
                        options.filter(
                          (option) =>
                            option.title
                              .toLowerCase()
                              .includes(inputValue.toLowerCase()) // Filtra por texto
                        )
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={
                            langData.pieceDetailDescriptors.research.author_s_
                          }
                          placeholder={
                            langData.pieceDetailDescriptors.research
                              .type_to_filter_authors
                          }
                          variant="outlined"
                          fullWidth
                          sx={{
                            "& .MuiInputLabel-root": {
                              color: "#6c757d", // Label en gris
                            },
                            "& .MuiOutlinedInput-root": {
                              backgroundColor: "#ffffff",
                            },
                          }}
                        />
                      )}
                      renderTags={(selected, getTagProps) =>
                        selected.map((authors, index) => {
                          const { key, ...tagProps } = getTagProps({ index });
                          return (
                            <Chip
                              key={authors._id}
                              label={authors.title}
                              {...tagProps}
                              onDelete={() => removeAuthor(authors._id)}
                              sx={{
                                bgcolor: "white",
                                color: "black",
                                border: "1px solid #777",
                                marginRight: "2px",
                                marginBottom: "2px",
                                height: "1.4rem",
                              }}
                            />
                          );
                        })
                      }
                    />
                  </div>
                </div>
              </Paper>
            </div>

            <div className="row mb-1">
              <Paper
                elevation={6}
                sx={{
                  paddingLeft: 1,
                  paddingRight: 1,
                  paddingTop: 1,

                  marginRight: 1,
                  marginBottom: 1,
                }}
              >
                <div className="row mb-2">
                  <div className="col">
                    <Autocomplete
                      multiple
                      id="involved"
                      options={
                        filteredInvolvedCreation?.filter(
                          (involved, index, self) =>
                            self.findIndex((a) => a._id === involved._id) ===
                              index && // Evita duplicados
                            !formDataResearch?.involved_creation?.some(
                              (a) => a._id === involved._id
                            ) // Evita mostrar seleccionados
                        ) || []
                      }
                      getOptionLabel={(option) => option.title || ""}
                      getOptionKey={(option) => option._id}
                      value={formDataResearch?.involved_creation || []}
                      onChange={(event, newValue) =>
                        handleInvolvedChange(newValue)
                      }
                      filterOptions={(options, { inputValue }) =>
                        options.filter(
                          (option) =>
                            option.title
                              .toLowerCase()
                              .includes(inputValue.toLowerCase()) // Filtra por texto
                        )
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={
                            langData.pieceDetailDescriptors.research
                              .involved_creation_info
                          }
                          placeholder={
                            langData.pieceDetailDescriptors.research
                              .type_to_filter_involved_creation
                          }
                          variant="outlined"
                          fullWidth
                          sx={{
                            "& .MuiInputLabel-root": {
                              color: "#6c757d", // Label en gris
                            },
                            "& .MuiOutlinedInput-root": {
                              backgroundColor: "#ffffff",
                            },
                          }}
                        />
                      )}
                      renderTags={(selected, getTagProps) =>
                        selected.map((involved, index) => {
                          const { key, ...tagProps } = getTagProps({ index });
                          return (
                            <Chip
                              key={involved._id}
                              label={involved.title}
                              {...tagProps}
                              onDelete={() => removeInvolved(involved._id)}
                              sx={{
                                bgcolor: "white",
                                color: "black",
                                border: "1px solid #777",
                                marginRight: "2px",
                                marginBottom: "2px",
                                height: "1.4rem",
                              }}
                            />
                          );
                        })
                      }
                    />
                  </div>
                </div>
              </Paper>
            </div>

            <div className="row">
              <Paper
                elevation={6}
                sx={{
                  paddingLeft: 1,
                  paddingRight: 1,
                  paddingTop: 1,
                  paddingBottom: 0,
                  marginRight: 1,
                  marginBottom: 1,
                }}
              >
                <div className="mb-2">
                  <TextField
                    id="technique"
                    variant="outlined"
                    fullWidth
                    label={langData.pieceDetailDescriptors.research.technique}
                    multiline
                    rows={1}
                    value={formDataResearch?.technique || ""}
                    onChange={(e) => {
                      handleInputChange(e);
                      // Ajusta la altura del textarea:
                      e.target.style.height = "auto";
                      e.target.style.height = e.target.scrollHeight + "px";
                    }}
                    sx={{
                      "& .MuiInputLabel-root": {
                        color: "#6c757d", // Label en gris
                      },
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#ffffff",
                      },
                      "& textarea": {
                        resize: "none", // Evita redimensionar manualmente
                        overflow: "hidden", // Sin barra de desplazamiento
                      },
                    }}
                  />
                </div>
              </Paper>
            </div>

            <div className="row">
              <Paper
                elevation={6}
                sx={{
                  paddingLeft: 1,
                  paddingRight: 1,
                  paddingTop: 1,
                  paddingBottom: 0,
                  marginRight: 1,
                  marginBottom: 1,
                }}
              >
                <div className="mb-2">
                  <TextField
                    id="materials"
                    variant="outlined"
                    fullWidth
                    label={langData.pieceDetailDescriptors.research.materials}
                    multiline
                    rows={1}
                    value={formDataResearch?.materials || ""}
                    onChange={(e) => {
                      handleInputChange(e);
                      // Ajusta la altura del textarea de forma dinámica:
                      e.target.style.height = "auto";
                      e.target.style.height = e.target.scrollHeight + "px";
                    }}
                    sx={{
                      "& .MuiInputLabel-root": {
                        color: "#6c757d", // Label en gris
                      },
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#ffffff",
                      },
                      "& textarea": {
                        resize: "none", // Evita redimensionar manualmente
                        overflow: "hidden", // Sin barra de desplazamiento
                      },
                    }}
                  />
                </div>
              </Paper>
            </div>

            <div className="row">
              <Paper
                elevation={6}
                sx={{
                  paddingLeft: 1,
                  paddingRight: 1,
                  paddingTop: 1,
                  paddingBottom: 0,
                  marginRight: 1,
                  marginBottom: 1,
                }}
              >
                <div className="mb-2">
                  <Autocomplete
                    freeSolo
                    options={filteredPlaceOfCreation || []}
                    getOptionLabel={(option) =>
                      typeof option === "string" ? option : option.title || ""
                    }
                    value={selectedPlaceOfCreation || null}
                    onInputChange={(event, newValue) => {
                      if (event && event.type === "change") {
                        handlePlaceOfCreationFilter({
                          target: { value: newValue },
                        });
                      }
                    }}
                    onChange={(event, newValue) => {
                      if (newValue && typeof newValue !== "string") {
                        handlePlaceOfCreationChange(newValue);
                      } else if (typeof newValue === "string") {
                        handlePlaceOfCreationChange({
                          _id: null,
                          title: newValue,
                        });
                      } else {
                        handlePlaceOfCreationChange({ _id: null, title: "" });
                      }
                    }}
                    isOptionEqualToValue={(option, value) =>
                      option._id === value._id
                    }
                    renderOption={(props, option) => (
                      <li {...props} key={option._id || option.title}>
                        {option.title}
                      </li>
                    )}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => {
                        const { key, ...tagProps } = getTagProps({ index });
                        return (
                          <Chip
                            key={option._id}
                            {...tagProps}
                            label={option.title}
                          />
                        );
                      })
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={
                          langData.pieceDetailDescriptors.research
                            .place_of_creation
                        }
                        placeholder={
                          langData.pieceDetailDescriptors.research
                            .type_to_filter_place_of_creation
                        }
                        variant="outlined"
                        fullWidth
                        sx={{
                          "& .MuiInputLabel-root": {
                            color: "#6c757d", // Label en gris
                          },
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: "#ffffff",
                          },
                        }}
                      />
                    )}
                  />
                </div>
              </Paper>
            </div>

            <div className="row">
              <Paper
                elevation={6}
                sx={{
                  paddingLeft: 1,
                  paddingRight: 1,
                  paddingTop: 1,
                  paddingBottom: 0,
                  marginRight: 1,
                  marginBottom: 1,
                }}
              >
                <div className="mb-2">
                  <TextField
                    id="creation_date"
                    label={
                      langData.pieceDetailDescriptors.research.creation_date
                    }
                    variant="outlined"
                    fullWidth
                    value={formDataResearch?.creation_date || ""}
                    onChange={handleInputChange}
                    sx={{
                      "& .MuiInputLabel-root": {
                        color: "#6c757d", // Label en gris
                      },
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#ffffff",
                      },
                    }}
                  />
                </div>
              </Paper>
            </div>

            <div className="row ">
              <div className="col ms-0">
                <Paper
                  elevation={6}
                  sx={{
                    paddingLeft: 1,
                    paddingRight: 1,
                    paddingTop: 1,
                    paddingBottom: 0,
                    marginRight: 0,
                    marginBottom: 1,
                  }}
                >
                  <div className="mb-2">
                    <TextField
                      id="acquisition_form"
                      label={
                        langData.pieceDetailDescriptors.research
                          .acquisition_form
                      }
                      variant="outlined"
                      fullWidth
                      value={formDataResearch?.acquisition_form || ""}
                      onChange={handleInputChange}
                      className="mb-2"
                      sx={{
                        "& .MuiInputLabel-root": {
                          color: "#6c757d", // Label en gris
                        },
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "#ffffff",
                        },
                      }}
                    />
                  </div>
                </Paper>
              </div>

              <div className="row mb-1">
                <Paper
                  elevation={6}
                  sx={{
                    paddingLeft: 1,
                    paddingRight: 1,
                    paddingBottom: 1,
                    margin: 1,
                  }}
                >
                  <div className="mt-2">
                    <Autocomplete
                      freeSolo
                      options={filteredPeriod || []}
                      getOptionLabel={(option) =>
                        typeof option === "string" ? option : option.title || ""
                      }
                      value={selectedPeriod || null}
                      onInputChange={(event, newValue) => {
                        if (event && event.type === "change") {
                          handleFilteredPeriod({ target: { value: newValue } });
                        }
                      }}
                      onChange={(event, newValue) => {
                        if (newValue && typeof newValue !== "string") {
                          handlePeriodChange(newValue);
                        } else if (typeof newValue === "string") {
                          handlePeriodChange({ _id: null, title: newValue });
                        } else {
                          handlePeriodChange({ _id: null, title: "" });
                        }
                      }}
                      isOptionEqualToValue={(option, value) =>
                        option._id === value._id
                      }
                      renderOption={(props, option) => (
                        <li {...props} key={option._id || option.title}>
                          {option.title}
                        </li>
                      )}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => {
                          const { key, ...tagProps } = getTagProps({ index });
                          return (
                            <Chip
                              key={option._id}
                              {...tagProps}
                              label={option.title}
                            />
                          );
                        })
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={
                            langData.pieceDetailDescriptors.research.period
                          }
                          placeholder={
                            langData.pieceDetailDescriptors.research
                              .type_to_filter_period
                          }
                        />
                      )}
                    />
                  </div>
                </Paper>
              </div>

              <div className="col">
                <Paper
                  elevation={6}
                  sx={{
                    paddingLeft: 1,
                    paddingRight: 1,
                    paddingTop: 1,
                    paddingBottom: 0,
                    marginRight: 1,
                    marginBottom: 1,
                  }}
                >
                  <div className="mb-2">
                    <TextField
                      id="acquisition_source"
                      label={
                        langData.pieceDetailDescriptors.research
                          .acquisition_source
                      }
                      variant="outlined"
                      fullWidth
                      value={formDataResearch?.acquisition_source || ""}
                      onChange={handleInputChange}
                      className="mb-2"
                      sx={{
                        "& .MuiInputLabel-root": {
                          color: "#6c757d", // Label en gris
                        },
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "#ffffff",
                        },
                      }}
                    />
                  </div>
                </Paper>
              </div>

              <div className="col">
                <Paper
                  elevation={6}
                  sx={{
                    paddingLeft: 1,
                    paddingRight: 1,
                    paddingTop: 1,
                    paddingBottom: 0,
                    marginRight: 1,
                    marginBottom: 1,
                  }}
                >
                  <div className="mb-2">
                    <TextField
                      id="acquisition_date"
                      label={
                        langData.pieceDetailDescriptors.research
                          .acquisition_date
                      }
                      variant="outlined"
                      fullWidth
                      value={formDataResearch?.acquisition_date || ""}
                      onChange={handleInputChange}
                      className="mb-2"
                      sx={{
                        "& .MuiInputLabel-root": {
                          color: "#6c757d", // Label en gris
                        },
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "#ffffff",
                        },
                      }}
                    />
                  </div>
                </Paper>
              </div>
            </div>

            <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
              <Box display="flex" gap={2} alignItems="center">
                {/* Switch para Firm */}
                <FormControlLabel
                  control={
                    <Switch
                      checked={
                        formDataResearch?.firm === "yes" ||
                        formDataResearch?.firm === true
                      }
                      onChange={(e) =>
                        handleInputChange({
                          target: {
                            id: "firm",
                            value: e.target.checked ? "yes" : "no",
                          },
                        })
                      }
                    />
                  }
                  label={
                    formDataResearch?.firm === "yes" ||
                    formDataResearch?.firm === true
                      ? "Sí"
                      : "No"
                  }
                />

                {/* Campo de descripción, habilitado solo si firm es "yes" o true */}
                <TextField
                  fullWidth
                  id="firm_description"
                  label={
                    langData.pieceDetailDescriptors.research.firm_description
                  }
                  value={formDataResearch?.firm_description || ""}
                  onChange={handleInputChange}
                  disabled={
                    formDataResearch?.firm !== "yes" &&
                    formDataResearch?.firm !== true
                  }
                />
              </Box>
            </Paper>

            <div className="row ">
              <div className="col ">
                <Paper
                  elevation={6}
                  sx={{
                    paddingLeft: 1,
                    paddingRight: 1,
                    paddingTop: 1,
                    paddingBottom: 0,
                    marginRight: 1,
                    marginBottom: 1,
                  }}
                >
                  <div className="">
                    <TextField
                      id="short_description"
                      label={
                        langData.pieceDetailDescriptors.research
                          .short_description
                      }
                      className="mb-2"
                      variant="outlined"
                      fullWidth
                      value={formDataResearch?.short_description || ""}
                      onChange={handleInputChange}
                      sx={{
                        "& .MuiInputLabel-root": {
                          color: "#6c757d", // Label en gris
                        },
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "#ffffff",
                        },
                      }}
                    />
                  </div>
                </Paper>
              </div>

              <div className="col">
                <Paper
                  elevation={6}
                  sx={{
                    paddingLeft: 1,
                    paddingRight: 1,
                    paddingTop: 1,
                    paddingBottom: 0,
                    marginRight: 1,
                    marginBottom: 1,
                  }}
                >
                  <div className="mb-2">
                    <TextField
                      id="formal_description"
                      className="mb-2"
                      label={
                        langData.pieceDetailDescriptors.research
                          .formal_description
                      }
                      variant="outlined"
                      fullWidth
                      value={formDataResearch?.formal_description || ""}
                      onChange={handleInputChange}
                      sx={{
                        "& .MuiInputLabel-root": {
                          color: "#6c757d", // Label en gris
                        },
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "#ffffff",
                        },
                      }}
                    />
                  </div>
                </Paper>
              </div>
            </div>

            <div className="row ">
              <div className="col">
                <Paper
                  elevation={6}
                  sx={{
                    paddingLeft: 1,
                    paddingRight: 1,
                    paddingTop: 1,
                    paddingBottom: 0,
                    marginRight: 1,
                    marginBottom: 1,
                  }}
                >
                  <div className="">
                    <TextField
                      id="observation"
                      className="mb-2"
                      label={
                        langData.pieceDetailDescriptors.research.observation
                      }
                      variant="outlined"
                      fullWidth
                      value={formDataResearch?.observation || ""}
                      onChange={handleInputChange}
                      sx={{
                        "& .MuiInputLabel-root": {
                          color: "#6c757d", // Label en gris
                        },
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "#ffffff",
                        },
                      }}
                    />
                  </div>
                </Paper>
              </div>

              <div className="col">
                <Paper
                  elevation={6}
                  sx={{
                    paddingLeft: 1,
                    paddingRight: 1,
                    paddingTop: 1,
                    paddingBottom: 0,
                    marginRight: 1,
                    marginBottom: 1,
                  }}
                >
                  <div className="mb-2">
                    <TextField
                      id="publications"
                      className="mb-2"
                      label={
                        langData.pieceDetailDescriptors.research.publications
                      }
                      variant="outlined"
                      fullWidth
                      value={formDataResearch?.publications || ""}
                      onChange={handleInputChange}
                      sx={{
                        "& .MuiInputLabel-root": {
                          color: "#6c757d", // Label en gris
                        },
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "#ffffff",
                        },
                      }}
                    />
                  </div>
                </Paper>
              </div>
            </div>

            <div className="row ">
              <div className="col">
                <Paper
                  elevation={6}
                  sx={{
                    paddingLeft: 1,
                    paddingRight: 1,
                    paddingTop: 1,
                    paddingBottom: 0,
                    marginRight: 1,
                    marginBottom: 1,
                  }}
                >
                  <div className="mb-2">
                    <TextField
                      id="card"
                      className="mb-2"
                      label={langData.pieceDetailDescriptors.research.card}
                      variant="outlined"
                      fullWidth
                      value={formDataResearch?.card || ""}
                      onChange={handleInputChange}
                      sx={{
                        "& .MuiInputLabel-root": {
                          color: "#6c757d",
                        },
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "#ffffff",
                        },
                      }}
                    />
                  </div>
                </Paper>
              </div>

              <div className="col">
                <Paper
                  elevation={6}
                  sx={{
                    paddingLeft: 1,
                    paddingRight: 1,
                    paddingTop: 1,
                    paddingBottom: 0,
                    marginRight: 1,
                    marginBottom: 1,
                  }}
                >
                  <div className="mb-2">
                    <TextField
                      id="keywords"
                      className="mb-2"
                      label={langData.pieceDetailDescriptors.research.keywords}
                      variant="outlined"
                      fullWidth
                      value={formDataResearch?.keywords || ""}
                      onChange={handleInputChange}
                      sx={{
                        "& .MuiInputLabel-root": {
                          color: "#6c757d",
                        },
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "#ffffff",
                        },
                      }}
                    />
                  </div>
                </Paper>
              </div>
            </div>

            {/*
             ************************************************************************************************************
             ************************************************************************************************************
             ************************************************************************************************************
             ************************************************************************************************************
             ************************************************************************************************************
             ************************************************************************************************************
             ************************************************************************************************************
             ************************************************************************************************************
             ************************************************************************************************************
             ************************************************************************************************************
             ************************************************************************************************************
             */
            /* Notas al pie */}
            <div className="row mb-2">
              <div className="col ">
                <div className="card " style={{ background: "#abcc" }}>
                  <div
                    className="card-header text-center"
                    style={{
                      background: "#99dd",
                      position: "relative",
                      padding: "10px",
                    }}
                  >
                    {/* Texto centrado */}
                    <span>Notas al pie</span>
                  </div>

                  <div
                    className="card-body border-primary "
                    style={{ background: "#f0f0f0" }}
                  >
                    <Box
                      sx={{
                        paddingBottom: 1,
                        paddingLeft: 1,
                        paddingRight: 1,
                        borderRadius: 2,
                        background: "white",
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                        gap: 2,
                      }}
                    >
                      <TextField
                        label={langData.pieceDetailDescriptors.foot_notes.title}
                        id="title"
                        value={
                          (footnotes &&
                            footnotes[currentFootnoteIndex]?.title) ||
                          ""
                        }
                        onChange={(e) => handleInputFootnoteChange(e)}
                        fullWidth
                        margin="dense"
                      />
                      <TextField
                        label={
                          langData.pieceDetailDescriptors.foot_notes.author
                        }
                        id="author"
                        value={
                          (footnotes &&
                            footnotes[currentFootnoteIndex]?.author) ||
                          ""
                        }
                        onChange={(e) => handleInputFootnoteChange(e)}
                        fullWidth
                        margin="dense"
                      />
                      <TextField
                        label={
                          langData.pieceDetailDescriptors.foot_notes
                            .city_country
                        }
                        id="city_country"
                        value={
                          (footnotes &&
                            footnotes[currentFootnoteIndex]?.city_country) ||
                          ""
                        }
                        onChange={(e) => handleInputFootnoteChange(e)}
                        fullWidth
                        margin="dense"
                      />
                      <TextField
                        label={
                          langData.pieceDetailDescriptors.foot_notes.vol_no
                        }
                        id="vol_no"
                        value={
                          (footnotes &&
                            footnotes[currentFootnoteIndex]?.vol_no) ||
                          ""
                        }
                        onChange={(e) => handleInputFootnoteChange(e)}
                        fullWidth
                        margin="dense"
                      />
                      <TextField
                        label={
                          langData.pieceDetailDescriptors.foot_notes.description
                        }
                        id="description"
                        value={
                          (footnotes &&
                            footnotes[currentFootnoteIndex]?.description) ||
                          ""
                        }
                        onChange={(e) => handleInputFootnoteChange(e)}
                        fullWidth
                        margin="dense"
                      />
                      <TextField
                        label={
                          langData.pieceDetailDescriptors.foot_notes.article
                        }
                        id="article"
                        value={
                          (footnotes &&
                            footnotes[currentFootnoteIndex]?.article) ||
                          ""
                        }
                        onChange={(e) => handleInputFootnoteChange(e)}
                        fullWidth
                        margin="dense"
                      />
                      <TextField
                        label={
                          langData.pieceDetailDescriptors.foot_notes.chapter
                        }
                        id="chapter"
                        value={
                          (footnotes &&
                            footnotes[currentFootnoteIndex]?.chapter) ||
                          ""
                        }
                        onChange={(e) => handleInputFootnoteChange(e)}
                        fullWidth
                        margin="dense"
                      />
                      <TextField
                        label={
                          langData.pieceDetailDescriptors.foot_notes.editorial
                        }
                        id="editorial"
                        value={
                          (footnotes &&
                            footnotes[currentFootnoteIndex]?.editorial) ||
                          ""
                        }
                        onChange={(e) => handleInputFootnoteChange(e)}
                        fullWidth
                        margin="dense"
                      />
                      <TextField
                        label={langData.pieceDetailDescriptors.foot_notes.pages}
                        id="pages"
                        value={
                          (footnotes &&
                            footnotes[currentFootnoteIndex]?.pages) ||
                          ""
                        }
                        onChange={(e) => handleInputFootnoteChange(e)}
                        fullWidth
                        margin="dense"
                      />
                      <TextField
                        label={
                          langData.pieceDetailDescriptors.foot_notes
                            .publication_date
                        }
                        id="publication_date"
                        value={
                          (footnotes &&
                            footnotes[currentFootnoteIndex]
                              ?.publication_date) ||
                          ""
                        }
                        onChange={(e) => handleInputFootnoteChange(e)}
                        fullWidth
                        margin="dense"
                      />
                    </Box>

                    <div className="d-flex justify-content-between mt-3">
                      <Button
                        variant="contained"
                        color="secondary"
                        type="button"
                        onClick={handlePrevFootnote}
                        className="btn btn-secondary"
                      >
                        ← {langData.pieceInventoryEdit.previous}
                      </Button>
                      <span>
                        {currentFootnoteIndex + 1} /{" "}
                        {footnotes?.length ? footnotes.length : null}
                      </span>{" "}
                      {/* Paginación */}
                      <Button
                        variant="contained"
                        color="secondary"
                        type="button"
                        onClick={handleNextFootnote}
                        className="btn btn-secondary"
                      >
                        {langData.pieceInventoryEdit.next} →
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/*
************************************************************************************************************
************************************************************************************************************
************************************************************************************************************
************************************************************************************************************
************************************************************************************************************
************************************************************************************************************
************************************************************************************************************
************************************************************************************************************
/*Bibliografias*/}

            <div className="row ">
              <div className="col ">
                <div className="card " style={{ background: "#abcc" }}>
                  <div
                    className="card-header text-center"
                    style={{
                      background: "#99dd",
                      position: "relative",
                      padding: "10px",
                    }}
                  >
                    {/* Texto centrado */}
                    <span>Bibliografias</span>
                  </div>

                  <div
                    className="card-body border-primary "
                    style={{ background: "#f0f0f0" }}
                  >
                    <Box
                      sx={{
                        paddingBottom: 1,
                        paddingLeft: 1,
                        paddingRight: 1,
                        borderRadius: 2,
                        background: "white",
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                        gap: 2,
                      }}
                    >
                      
                      <Autocomplete
                        freeSolo
                        options={filteredReferences || []}
                        getOptionLabel={(option) =>
                          typeof option === "string"
                            ? option
                            : option.title || ""
                        }
                        value={selectedReference || null}
                        onInputChange={(event, newValue) => {
                          if (event && event.type === "change") {
                            handleReferenceFilter({
                              target: { value: newValue },
                            });
                          }
                        }}
                        onChange={(event, newValue) => {
                          if (newValue && typeof newValue !== "string") {
                            handleReferenceChange(newValue);
                          } else if (typeof newValue === "string") {
                            handleReferenceChange({
                              _id: null,
                              title: newValue,
                            });
                          } else {
                            handleReferenceChange({ _id: null, title: "" });
                          }
                        }}
                        isOptionEqualToValue={(option, value) =>
                          option._id === value._id
                        }
                        renderOption={(props, option) => (
                          <li {...props} key={option._id || option.title}>
                            {option.title}
                          </li>
                        )}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => {
                            const { key, ...tagProps } = getTagProps({ index });
                            return (
                              <Chip
                                key={option._id}
                                {...tagProps}
                                label={option.title}
                              />
                            );
                          })
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={
                              langData.pieceDetailDescriptors.research
                                .bibliographies_reference
                            }
                            placeholder={
                              langData.pieceDetailDescriptors.research
                                .type_to_filter_reference
                            }
                            variant="outlined"
                            fullWidth
                            sx={{
                              "& .MuiInputLabel-root": {
                                color: "#6c757d", // Label en gris
                              },
                              "& .MuiOutlinedInput-root": {
                                backgroundColor: "#ffffff",
                              },
                            }}
                          />
                        )}
                      />

                      <TextField
                        label="Title"
                        id="title"
                        value={
                          (bibliographies &&
                            bibliographies[currentBibliographyIndex]?.title) ||
                          ""
                        }
                        onChange={(e) => handleInputBibliographyChange(e)}
                        fullWidth
                        margin="dense"
                      />
                      <TextField
                        label="Author"
                        id="author"
                        value={
                          (bibliographies &&
                            bibliographies[currentBibliographyIndex]?.author) ||
                          ""
                        }
                        onChange={(e) => handleInputBibliographyChange(e)}
                        fullWidth
                        margin="dense"
                      />

                      <TextField
                        label="Article"
                        id="article"
                        value={
                          (bibliographies &&
                            bibliographies[currentBibliographyIndex]
                              ?.article) ||
                          ""
                        }
                        onChange={(e) => handleInputBibliographyChange(e)}
                        fullWidth
                        margin="dense"
                      />

                      <TextField
                        label="Chapter"
                        id="chapter"
                        value={
                          (bibliographies &&
                            bibliographies[currentBibliographyIndex]
                              ?.chapter) ||
                          ""
                        }
                        onChange={(e) => handleInputBibliographyChange(e)}
                        fullWidth
                        margin="dense"
                      />

                      <TextField
                        label="Editorial"
                        id="editorial"
                        value={
                          (bibliographies &&
                            bibliographies[currentBibliographyIndex]
                              ?.editorial) ||
                          ""
                        }
                        onChange={(e) => handleInputBibliographyChange(e)}
                        fullWidth
                        margin="dense"
                      />

                      <TextField
                        label="Vol No"
                        id="vol_no"
                        value={
                          (bibliographies &&
                            bibliographies[currentBibliographyIndex]?.vol_no) ||
                          ""
                        }
                        onChange={(e) => handleInputBibliographyChange(e)}
                        fullWidth
                        margin="dense"
                      />

                      <TextField
                        label="City Country"
                        id="city_country"
                        value={
                          (bibliographies &&
                            bibliographies[currentBibliographyIndex]
                              ?.city_country) ||
                          ""
                        }
                        onChange={(e) => handleInputBibliographyChange(e)}
                        fullWidth
                        margin="dense"
                      />

                      <TextField
                        label="Pages"
                        id="pages"
                        value={
                          (bibliographies &&
                            bibliographies[currentBibliographyIndex]?.pages) ||
                          ""
                        }
                        onChange={(e) => handleInputBibliographyChange(e)}
                        fullWidth
                        margin="dense"
                      />

                      <TextField
                        label="Editor"
                        id="editor"
                        value={
                          (bibliographies &&
                            bibliographies[currentBibliographyIndex]?.editor) ||
                          ""
                        }
                        onChange={(e) => handleInputBibliographyChange(e)}
                        fullWidth
                        margin="dense"
                      />
                      <TextField
                        label="Web page"
                        id="webpage"
                        value={
                          (bibliographies &&
                            bibliographies[currentBibliographyIndex]
                              ?.webpage) ||
                          ""
                        }
                        onChange={(e) => handleInputBibliographyChange(e)}
                        fullWidth
                        margin="dense"
                      />
                      <TextField
                        label="Identifier"
                        id="identifier"
                        value={
                          (bibliographies &&
                            bibliographies[currentBibliographyIndex]
                              ?.identifier) ||
                          ""
                        }
                        onChange={(e) => handleInputBibliographyChange(e)}
                        fullWidth
                        margin="dense"
                      />
                    </Box>

                    <div className="d-flex justify-content-between mt-3">
                      <Button
                        variant="contained"
                        color="secondary"
                        type="button"
                        onClick={handlePrevBibliography}
                        className="btn btn-secondary"
                      >
                        ← {langData.pieceInventoryEdit.previous}
                      </Button>
                      <span>
                        {currentBibliographyIndex + 1} /{" "}
                        {bibliographies?.length ? bibliographies.length : null}
                      </span>{" "}
                      {/* Paginación */}
                      <Button
                        variant="contained"
                        color="secondary"
                        type="button"
                        onClick={handleNextBibliography}
                        className="btn btn-secondary"
                      >
                        {langData.pieceInventoryEdit.next} →
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/*
             ************************************************************************************************************
             ************************************************************************************************************
             ************************************************************************************************************************************************************************************************************************
             ************************************************************************************************************************************************************************************************************************
             ************************************************************************************************************************************************************************************************************************
             ************************************************************************************************************************************************************************************************************************
             ************************************************************************************************************
             ************************************************************************************************************
             */
            /* Imagenes */}
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
                            disabled={!currentPic?.file_name}
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
            {/*
             ************************************************************************************************************
             ************************************************************************************************************
             ************************************************************************************************************
             ************************************************************************************************************
             ************************************************************************************************************
             ************************************************************************************************************
             ************************************************************************************************************
             ************************************************************************************************************
             ************************************************************************************************************
             */
            /* NEW IMAGE */}
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
                    <span>{langData.pieceInventoryEdit.new_images} </span>
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
            {/*
************************************************************************************************************
************************************************************************************************************
************************************************************************************************************
************************************************************************************************************
************************************************************************************************************
************************************************************************************************************************************************************************************************************************
************************************************************************************************************
************************************************************************************************************
************************************************************************************************************
/* Domumentos */}
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
                                  SETTINGS.URL_ADDRESS.research_documents +
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
            {/*
************************************************************************************************************
************************************************************************************************************
************************************************************************************************************
************************************************************************************************************
************************************************************************************************************
************************************************************************************************************************************************************************************************************************
************************************************************************************************************
************************************************************************************************************
************************************************************************************************************
/* Domumentos nuevos */}

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
                    <span>{langData.pieceInventoryEdit.new_documents}</span>
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
          </div>

          <Button
            className="m-3"
            variant="contained"
            color="primary"
            type="submit"
          >
            {"Salvar"}
          </Button>
        </form>
      </div>
    </div>
  );
};

const ModalPictures = ({ IDmodal, picFileName = null, ObjectImg = null }) => {
  let ImageModal;

  if (ObjectImg === null) {
    ImageModal =
      SETTINGS.URL_ADDRESS.server_url +
      SETTINGS.URL_ADDRESS.research_full_size +
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

function formatDate(dateTime) {
  return dateTime.split(" ")[0]; // Extrae solo la fecha en formato YYYY-MM-DD
}
