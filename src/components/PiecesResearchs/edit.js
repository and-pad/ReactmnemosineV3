import { useRef, useEffect, useState } from "react";

import { useParams } from "react-router-dom";
//import { fetchResearchEdit } from "./APICalls";
import { useNavigate } from "react-router-dom";
import SETTINGS from "../Config/settings";
import { useDataResearch } from "./researchsActions";

import { getTranslations } from "../Languages/i18n";
import { TextField, Paper, Box, Autocomplete, Chip } from "@mui/material";

import Dropzone from "react-dropzone";
import { IconButton, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { pink } from "@mui/material/colors";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

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

export const EditResearch = ({ accessToken, refreshToken }) => {
  const { _id } = useParams();
  const big_data = useDataResearch();
  const navigate = useNavigate();
  //const [dataResearch, setDataResearch] = useState(null);
  const [formDataResearch, setFormDataResearch] = useState(null);

  //const [Authors, setAuthors] = useState();
  // useState para involved_creation, place_of_creation, period
  //const [InvolvedCreation, setInvolvedCreation] = useState();
  //const [PlaceOfCreation, setPlaceOfCreation] = useState();
  //const [Period, setPeriod] = useState();
  //useState para all_authors, all_involved_creation, all_place_of_creation, all_period
  const [AllAuthors, setAllAuthors] = useState();
  const [AllInvolvedCreation, setAllInvolvedCreation] = useState();
  const [AllPlaceOfCreation, setAllPlaceOfCreation] = useState();
  const [AllPeriod, setAllPeriod] = useState();
  //const [formData, setFormData] = useState();
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

  const data = big_data && big_data["research_data"];
  const InventoryData = data && data["inventory_data"][0];

  const handleInputChange = (e) => {
    const { id, value } = e.target;

    setFormDataResearch((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };  

  const handleAuthorsChange = (selectedAuthors) => {
    setFormDataResearch((prev) => ({
      ...prev,
      authors: selectedAuthors, // Guardar múltiples autores en el estado
    }));
    //console.log("Autores seleccionados", selectedAuthors);
  };

  const handleInvolvedChange = (selectedInvolved) => {
    setFormDataResearch((prev) => ({
      ...prev,
      involved_creation: selectedInvolved, // Guardar múltiples autores en el estado
    }));
    //console.log("Autores seleccionados", selectedInvolved);
  };

 
  const handlePlaceOfCreationChange = (selectedPlaceOfCreation) => {
    setFormDataResearch((prev) => ({
      ...prev,
      place_of_creation: {_id: selectedPlaceOfCreation._id, title: selectedPlaceOfCreation.title} // Guardar múltiples autores en el estado
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
      period:{_id: selectedPeriod._id, title: selectedPeriod.title} // Guardar múltiples autores en el estado
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

  const removePlace = (id) => {
    setFormDataResearch((prev) => ({
      ...prev,
      place_of_creation: prev.place_of_creation.filter(
        (place) => place._id !== id
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
      gender: {
        _id: SelectedGender._id,
        title: SelectedGender.title,
      },
    });
    console.log("selected Gender", SelectedGender);
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

  const handlePrev = () => {
    //console.log("Pics", Pics);
    //console.log("Pics current index", Pics[currentImgIndex]);
    //console.log("current index", currentImgIndex);
    setCurrentImgIndex((prevIndex) => {
      const newIndex = prevIndex === 0 ? Pics.length - 1 : prevIndex - 1;
      setCurrentPic(Pics && Pics.length > 0 ? Pics[newIndex] : null);
      return newIndex;
    });
  };

  const handleNext = () => {
    //console.log("Pics", Pics);
    //console.log("Pics current index", Pics[currentImgIndex]);
    //console.log("current index", currentImgIndex);

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

  useEffect(() => {
    //setDocuments(data["documents"]);
    /*
    setAuthors(big_data && big_data["author_research"]);
    setInvolvedCreation(big_data && big_data["involved_creation_research"]);
    setPlaceOfCreation(big_data && big_data["place_of_creation_research"]);
    setPeriod(big_data && big_data["period_research"]);
    */

    setAllAuthors(big_data && big_data["all_authors"]);
    setAllInvolvedCreation(big_data && big_data["all_involved_creation"]);
    setAllPlaceOfCreation(big_data && big_data["all_place_of_creation"]);
    setAllPeriod(big_data && big_data["all_period"]);
    setGenders(big_data && big_data["all_genders"]);
    setSubgenders(big_data && big_data["all_subgenders"]);
    setObjectTypes(big_data && big_data["all_object_type"]);
    setDominantMaterials(big_data && big_data["all_dominant_material"]);

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
        big_data["research_data"]["period_info"][0]
    );
    setSelectedPlaceOfCreation(
      big_data &&
        big_data["research_data"]["place_of_creation_info"][0]
    )
    console.log("period_info!!!",big_data &&
      big_data["research_data"]["period_info"]);
    setDocuments(big_data && big_data["research_data"]["documents"]);
    setPics(big_data && big_data["research_data"]["photos"]);
    console.log(
      "documents",
      big_data && big_data["research_data"]["documents"]
    );
    console.log("photos", big_data && big_data["research_data"]["photos"]);

    //console.log("Inventory", InventoryData);
    /*console.log(
      "big_data[inventory_data]",
      big_data &&
        big_data["research_data"]["inventory_data"][0]["subgenders_info"][
          "gender_id"
        ]
    );*/
    //console.log(Subgenders && Subgenders);
  }, [big_data]);

  useEffect(() => {
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
      /*authors: data?.authors_info
        ? data.authors_info.map((author) => author.title).join(", ")
        : null,*/
      //place_of_creation: data?.place_of_creation_info
      //  ? data.place_of_creation_info.map((place) => place.title).join(", ")
      //  : null,
      // involved_creation: data?.involved_creation_info
      //  ? data.involved_creation_info
      //     .map((involved) => involved.title)
      //    .join(", ")
      // : null,
      gender: InventoryData?.genders_info ? InventoryData.genders_info : null,
      subgender: InventoryData?.subgenders_info
        ? InventoryData.subgenders_info
        : null,
      type_object: InventoryData?.type_object_info
        ? InventoryData.type_object_info
        : null,
      dominant_material: InventoryData?.dominant_material_info
        ? InventoryData.dominant_material_info
        : null,
      authors: data && data.authors_info,
      involved_creation: data && data.involved_creation_info,
      place_of_creation: data && data.place_of_creation_info,
      period: data && data.period_info,
      inventory_data: {
        description_origin: InventoryData?.description_origin
          ? InventoryData.description_origin
          : null,
        description_inventory: InventoryData?.description_inventory
          ? InventoryData.description_inventory
          : null,
      },
      //inventory_data: InventoryData,
      //genders: Genders,
      //subgenders: Subgenders,
    };

    //setFormData(data_research);
    //setCpFormData(data_research);
    console.log("Authors", big_data && big_data.period_research);
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

  return (
    <div>
      <div className="container">
        <form>
          <div className="card p-4 mb-0" style={{ background: "#abcc" }}>
            <div className="row mb-2">
              <div
                className="card border-primary mb-1 "
                style={{ background: " #abaa" }}
              >
                {/* Título estilizado con menos margen */}
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
                        typeof option === "string" ? option : option.title || ""
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
                        typeof option === "string" ? option : option.title || ""
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
                            subgender: newValue,
                          });
                        } else if (typeof newValue === "string") {
                          setFormDataResearch({
                            ...formDataResearch,
                            subgender: { _id: null, title: newValue },
                          });
                        } else {
                          setFormDataResearch({
                            ...formDataResearch,
                            subgender: { _id: null, title: "" },
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
                        typeof option === "string" ? option : option.title || ""
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
                            type_object: newValue,
                          });
                        } else if (typeof newValue === "string") {
                          setFormDataResearch({
                            ...formDataResearch,
                            type_object: { _id: null, title: newValue },
                          });
                        } else {
                          setFormDataResearch({
                            ...formDataResearch,
                            type_object: { _id: null, title: "" },
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
                        typeof option === "string" ? option : option.title || ""
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
                            dominant_material: newValue,
                          });
                        } else if (typeof newValue === "string") {
                          setFormDataResearch({
                            ...formDataResearch,
                            dominant_material: { _id: null, title: newValue },
                          });
                        } else {
                          setFormDataResearch({
                            ...formDataResearch,
                            dominant_material: { _id: null, title: "" },
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
                      value={
                        formDataResearch?.inventory_data?.description_origin ||
                        ""
                      }
                      onChange={(e) => {
                        setFormDataResearch((prevData) => ({
                          ...prevData,
                          inventory_data: {
                            ...prevData.inventory_data,
                            description_origin: e.target.value,
                          },
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
                      value={
                        formDataResearch?.inventory_data
                          ?.description_inventory || ""
                      }
                      onChange={(e) => {
                        setFormDataResearch((prevData) => ({
                          ...prevData,
                          inventory_data: {
                            ...prevData.inventory_data,
                            description_inventory: e.target.value,
                          },
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
                            langData.pieceDetailDescriptors.research
                              .author_s_
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
          handlePlaceOfCreationFilter({ target: { value: newValue } });
        }
      }}
      onChange={(event, newValue) => {
        if (newValue && typeof newValue !== "string") {
          handlePlaceOfCreationChange(newValue);
        } else if (typeof newValue === "string") {
          handlePlaceOfCreationChange({ _id: null, title: newValue });
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
            langData.pieceDetailDescriptors.research.place_of_creation
          }
          placeholder={
            langData.pieceDetailDescriptors.research.type_to_filter_place_of_creation
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
          label={langData.pieceDetailDescriptors.research.period}
          placeholder={
            langData.pieceDetailDescriptors.research.type_to_filter_period
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

            <div className="row">
              {big_data &&
                big_data["research_data"]["footnotes_info"].map(
                  (footnote, index) => (
                    <div key={index}>
                      {footnote.author}
                      <br />
                      {footnote.title}
                      <br />
                      {footnote.city_country}
                      <br />
                      {footnote.vol_no}
                      <br />
                      {footnote.description}
                      <br />
                      {footnote.article}
                      <br />
                      {footnote.chapter}
                      <br />
                      {footnote.editorial}
                      <br />
                      {footnote.pages}
                      <br />
                      {footnote.publication_date}
                      <br />
                    </div>
                  )
                )}
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
          </div>
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
