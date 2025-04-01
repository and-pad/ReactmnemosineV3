import { useRef, useEffect, useState } from "react";

import { useParams } from "react-router-dom";
//import { fetchResearchEdit } from "./APICalls";
import { useNavigate } from "react-router-dom";
//import SETTINGS from "../Config/settings";
import { useDataResearch } from "./researchsActions";
import { Autocomplete, TextField, Chip } from "@mui/material";
import { getTranslations } from "../Languages/i18n";
const langData = getTranslations();

export const EditResearch = ({ accessToken, refreshToken }) => {
  const { _id } = useParams();
  const big_data = useDataResearch();
  const navigate = useNavigate();
  //const [dataResearch, setDataResearch] = useState(null);
  const [formDataResearch, setFormDataResearch] = useState(null);

  const [Authors, setAuthors] = useState();
  // useState para involved_creation, place_of_creation, period
  const [InvolvedCreation, setInvolvedCreation] = useState();
  const [PlaceOfCreation, setPlaceOfCreation] = useState();
  const [Period, setPeriod] = useState();
  //useState para all_authors, all_involved_creation, all_place_of_creation, all_period
  const [AllAuthors, setAllAuthors] = useState();
  const [AllInvolvedCreation, setAllInvolvedCreation] = useState();
  const [AllPlaceOfCreation, setAllPlaceOfCreation] = useState();
  const [AllPeriod, setAllPeriod] = useState();
  //const [formData, setFormData] = useState();
  const textareaRef = useRef(null); // Crear referencia para el textarea

  const [actualFormData, setCpFormData] = useState();

  const [filteredAuthors, setFilteredAuthors] = useState([]);

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

  const [selectedDominantMaterial, setSelectedDominantMaterial] = useState();
  const [filteredDominantMaterial, setFilteredDominantMaterial] = useState();

  const data = big_data && big_data["research_data"];
  const InventoryData = data && data["inventory_data"][0];

  const handleInputChange = (e) => {
    const { id, value } = e.target;

    setFormDataResearch((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleAuthorsFilter = (e) => {
    const { value } = e.target;
    const filtered = AllAuthors.filter((author) =>
      author.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredAuthors(filtered);
  };

  const handleAuthorsChange = (selectedAuthors) => {
    setFormDataResearch((prev) => ({
      ...prev,
      authors: selectedAuthors, // Guardar múltiples autores en el estado
    }));
    console.log("Autores seleccionados", selectedAuthors);
  };

  const removeAuthor = (id) => {
    setFormDataResearch((prev) => ({
      ...prev,
      authors: prev.authors.filter((author) => author._id !== id),
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
      big_data && big_data["research_data"]["inventory_data"][0]["subgenders_info"]
    );
    setSelectedTypeObject(
      big_data && big_data["research_data"]["inventory_data"][0]["type_object_info"]
    );
    setSelectedDominantMaterial(
      big_data && big_data["research_data"]["inventory_data"][0]["dominant_material_info"]
    );

    //console.log("Inventory", InventoryData);
    console.log(
      "big_data[inventory_data]",
      big_data &&
        big_data["research_data"]["inventory_data"][0]["subgenders_info"]["gender_id"]
    );
    console.log(Subgenders && Subgenders);
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
      place_of_creation: data?.place_of_creation_info
        ? data.place_of_creation_info.map((place) => place.title).join(", ")
        : null,
      involved_creation: data?.involved_creation_info
        ? data.involved_creation_info
            .map((involved) => involved.title)
            .join(", ")
        : null,
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
      period: big_data && big_data.period_research,
      inventory_data:{       
        description_origin: InventoryData?.description_origin ? InventoryData.description_origin : null,
        description_inventory: InventoryData?.description_inventory ? InventoryData.description_inventory : null,
       }
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
  }, [
    data,
    setFormDataResearch,
    setCpFormData,
    Authors,
    AllAuthors,
    InventoryData,
    Genders,
    Subgenders,
    big_data,
  ]);
  /*
      {Object.keys(AllPeriod ? AllPeriod : {}).map((key, index) => {
        return (
          <p key={index}>
            {AllPeriod[key].title}
          </p>
        );
      })}*/

  useEffect(() => {
    // Ajustar la altura al iniciar o al cambiar el contenido
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height to auto to shrink
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Ajustar a contenido
    }
  }, [formDataResearch?.title]); // Se ejecuta cuando formDataResearch.title cambia

  return (
    <div>
      {console.log("data piece research", data?.title ? data.title : null)}
      {/*data?.title ? <h1>{data.title}</h1> : null*/}

      <div className="container">
        <form>
          <div className="card p-4" style={{ background: "#abcc" }}>
            <div className="row mb-3">
              <div
                className="card border-primary mb-3 "
                style={{ background: " #abaa" }}
              >
                <div className="mt-3">
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
                        label={langData.pieceDetailDescriptors.inventory.gender}
                        placeholder={
                          langData.pieceDetailDescriptors.inventory
                            .type_to_filter_genders
                        }
                      />
                    )}
                  />
                </div>

                <div className="mb-3 mt-3">
                  <Autocomplete
                    freeSolo
                    options={filteredSubGenders || []}
                    getOptionLabel={(option) =>
                      typeof option === "string" ? option : option.title || ""
                    }
                    value={selectedSubGender || ""}
                    onInputChange={(event, newValue) => {
                      if (event && event.type === "change") {
                        handleSubGenderFilter({ target: { value: newValue } });
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
                        label="Subgénero"
                        placeholder="Escribe o selecciona un subgénero"
                      />
                    )}
                  />
                </div>

                <div className="mb-3 mt-3">
                  <Autocomplete
                    freeSolo
                    options={filteredTypeObject || []}
                    getOptionLabel={(option) =>
                      typeof option === "string" ? option : option.title || ""
                    }
                    value={selectedTypeObject || ""}
                    onInputChange={(event, newValue) => {
                      if (event && event.type === "change") {
                        handleTypeObjectFilter({ target: { value: newValue } });
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
                        label="Tipo de objeto"
                        placeholder="Escribe o selecciona un tipo de objeto"
                      />
                    )}
                  />
                </div>

                <div className="mb-3 mt-3">
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
                        label="Material Dominante"
                        placeholder="Escribe o selecciona un material dominante"
                      />
                    )}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Descripción de origen</label>
                  <textarea className="form-control" rows="2" value={formDataResearch?.inventory_data?.description_origin || ""}
                    onChange={(e) => {
                      setFormDataResearch((prevData) => ({
                        ...prevData,
                        inventory_data: {
                          ...prevData.inventory_data,
                          description_origin: e.target.value,
                        },
                      }));
                    }}
                    >
                  </textarea>
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Descripción de inventario
                  </label>
                  <textarea className="form-control" rows="2" value={formDataResearch?.inventory_data?.description_inventory || ""}
                    onChange={(e) => {
                      setFormDataResearch((prevData) => ({
                        ...prevData,
                        inventory_data: {
                          ...prevData.inventory_data,
                          description_inventory: e.target.value,
                        },
                      }));
                    }}
                    >

                  

                  </textarea>
                </div>


              </div>


            </div>

            <div className="row mb-3">
              <div className="col">
                <label htmlFor="title" className="form-label">
                  {langData.pieceDetailDescriptors.research.title}
                </label>
                <textarea
                  className="form-control"
                  id="title"
                  value={formDataResearch?.title || ""}
                  onChange={(e) => {
                    handleInputChange(e);
                    e.target.style.height = "auto"; // Restablece altura
                    e.target.style.height = e.target.scrollHeight + "px"; // Ajusta a contenido
                  }}
                  style={{ overflow: "hidden" }} // Evita barra de desplazamiento y redimensionado manual
                  rows={1}
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col">
                <label htmlFor="authors" className="form-label">
                  {langData.pieceDetailDescriptors.research.autor_s_}
                </label>

                <Autocomplete
                  multiple
                  id="authors"
                  options={
                    filteredAuthors?.filter(
                      (author, index, self) =>
                        self.findIndex((a) => a._id === author._id) === index && // Evita duplicados
                        !formDataResearch?.authors?.some(
                          (a) => a._id === author._id
                        ) // Evita mostrar seleccionados
                    ) || []
                  }
                  getOptionLabel={(option) => option.title || ""}
                  getOptionKey={(option) => option._id} // Clave única
                  value={formDataResearch?.authors || []}
                  onChange={(event, newValue) => handleAuthorsChange(newValue)}
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
                      placeholder={
                        langData.pieceDetailDescriptors.inventory
                          .type_to_filter_genders
                      }
                      variant="outlined"
                      fullWidth
                    />
                  )}
                  renderTags={(selected, getTagProps) =>
                    selected.map((author, index) => {
                      const { key, ...tagProps } = getTagProps({ index }); // Excluimos `key` de `tagProps`
                      // Asignamos directamente el `key` al `Chip`
                      return (
                        <Chip
                          key={author._id} // Asignamos el key aquí directamente
                          label={author.title}
                          {...tagProps} // Pasamos el resto de las props sin `key`
                          onDelete={() => removeAuthor(author._id)}
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

            <div className="row mb-3">
              <div className="col">
                <label htmlFor="technique" className="form-label">
                  {langData.pieceDetailDescriptors.research.technique}
                </label>
                <textarea
                  ref={textareaRef} // Asignamos el ref al textarea
                  className="form-control"
                  id="technique"
                  value={formDataResearch?.technique || ""}
                  onChange={(e) => {
                    handleInputChange(e);
                    // Ajustar la altura al cambiar el contenido
                    if (textareaRef.current) {
                      textareaRef.current.style.height = "auto"; // Reset height to auto to shrink
                      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Ajustar a contenido
                    }
                  }}
                  style={{ resize: "none", overflow: "hidden" }} // Deshabilitar redimensionamiento manual
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col">
                <label htmlFor="materials" className="form-label">
                  {langData.pieceDetailDescriptors.research.materials}
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="materials"
                  value={formDataResearch?.materials || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col">
                <label htmlFor="creation_date" className="form-label">
                  {langData.pieceDetailDescriptors.research.creation_date}
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="creation_date"
                  value={formDataResearch?.creation_date || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col">
                <label htmlFor="acquisition_form" className="form-label">
                  {langData.pieceDetailDescriptors.research.acquisition_form}
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="acquisition_form"
                  value={formDataResearch?.acquisition_form || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col">
                <label htmlFor="acquisition_source" className="form-label">
                  {langData.pieceDetailDescriptors.research.acquisition_source}
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="acquisition_source"
                  value={formDataResearch?.acquisition_source || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col">
                <label htmlFor="acquisition_date" className="form-label">
                  {langData.pieceDetailDescriptors.research.acquisition_date}
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="acquisition_date"
                  value={formDataResearch?.acquisition_date || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col">
                <label htmlFor="firm" className="form-label">
                  {langData.pieceDetailDescriptors.research.firm}
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="firm"
                  value={
                    formDataResearch?.firm
                      ? formDataResearch.firm
                        ? langData.pieceDetailDescriptors.research.firm_yes
                        : langData.pieceDetailDescriptors.research.firm_no
                      : langData.pieceDetailDescriptors.research.firm_no
                  }
                />
              </div>
              <div className="col">
                <label htmlFor="firm_description" className="form-label">
                  {langData.pieceDetailDescriptors.research.firm_description}
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="firm_description"
                  value={formDataResearch?.firm_description || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col">
                <label htmlFor="short_description" className="form-label">
                  {langData.pieceDetailDescriptors.research.short_description}
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="short_description"
                  value={formDataResearch?.short_description || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col">
                <label htmlFor="formal_description" className="form-label">
                  {langData.pieceDetailDescriptors.research.formal_description}
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="formal_description"
                  value={formDataResearch?.formal_description || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col">
                <label htmlFor="observation" className="form-label">
                  {langData.pieceDetailDescriptors.research.observation}
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="observation"
                  value={formDataResearch?.observation || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col">
                <label htmlFor="publications" className="form-label">
                  {langData.pieceDetailDescriptors.research.publications}
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="publications"
                  value={formDataResearch?.publications || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col">
                <label htmlFor="card" className="form-label">
                  {langData.pieceDetailDescriptors.research.card}
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="card"
                  value={formDataResearch?.card || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col">
                <label htmlFor="keywords" className="form-label">
                  {langData.pieceDetailDescriptors.research.keywords}
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="keywords"
                  value={formDataResearch?.keywords || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
