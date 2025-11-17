import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { fectchRestorationEdit, fetchRestorationUpdate } from "./APICalls";
import { RestorationEdit } from "./_restoration_edit";

export const EditRestoration = ({ accessToken, refreshToken, permissions }) => {
  const [Data, setData] = useState();
  
  const [formDataRestoration, setFormDataRestoration] = useState({});
  const [formDataRestorationCp, setFormDataRestorationCp] = useState({});

  const [catalogResponsible, setCatalogResponsible] = useState([]);

  const [photos, setPhotos] = useState([]);
  const [PicsNew, setPicsNew] = useState([]);
  const [actualPhotos, setActualPhotos] = useState([]); // Array to hold actual photo objects with metadata  

  const [Documents, setDocuments] = useState([]);
  const [actualDocs, setActualDocs] = useState([]); // Array to hold actual document objects with metadata
  const [DocumentsNew, setDocumentsNew] = useState([]);

  const [changedPics, setChangedPics] = useState({}); // Object to track changed pictures
  
  const { _id, restoration_id } = useParams();

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

  useEffect(() => {
    const response = fectchRestorationEdit(
      accessToken,
      refreshToken,
      _id,
      restoration_id
    );
    response
      .then((data) => {
        // console.log(data.restoration, "datarecien");
        setData(data.restoration || []);
        setCatalogResponsible(data.catalog_responsible || []);
        setPhotos(data.photos || []);
        setDocuments(data.documents || []);
        setActualDocs(data.documents || []);

        // console.log(data.catalog_responsible, "catalog_responsible X");
      })
      .catch((error) => {
        console.error("Error inesperado", error);
      });
  }, [accessToken, refreshToken, _id, restoration_id]);

  useEffect(() => {
    if (Data) {
      setFormDataRestoration(Data);
      setFormDataRestorationCp(Data);
    }
    if (photos) {
      setActualPhotos(photos);
    }
  }, [Data]);

  useEffect(() => {
    //console.log("Changed Pics updated:", changedPics);
  }, [changedPics]);

  const IGNORED_KEYS = [
    "_id",
    "created_at",
    "updated_at",
    "deleted_at",
    "deleted_by",
    "created_by",
    "updated_by",
  ];

const compareformData = (original, modified) => {
    let changes = {};

    for (const key in original) {
      if (IGNORED_KEYS.includes(key)) continue; // ignoramos campos que no importan

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
    //console.log("changes desde compare modifications", changes);
    return changes;
  };
/*
  const compareformData = (obj1, obj2) => {
    for (let key in obj1) {
      if (IGNORED_KEYS.includes(key)) continue; // ignoramos campos que no importan

      const val1 = obj1[key];
      const val2 = obj2[key];

      // Arrays
      if (Array.isArray(val1) && Array.isArray(val2)) {
        if (val1.length !== val2.length) return true;
        for (let i = 0; i < val1.length; i++) {
          if (val1[i] !== val2[i]) return true; // compara strings/valores primitivos
        }
      }
      // Objetos anidados
      else if (
        val1 &&
        typeof val1 === "object" &&
        val2 &&
        typeof val2 === "object"
      ) {
        if (compareformData(val1, val2)) return true;
      }
      // Valores primitivos
      else {
        if (val1 !== val2) return true;
      }
    }

    return false; // Si llegamos aquí, no hubo cambios
  };
*/
  const compareDocuments = (original, modified) => {
    let changes = {};
    const doc_keys = ["name", "size", "mime_type", "file"];
  
    for (let i = 0; i < original.length; i++) {
      const originalItem = original[i];
      const modifiedItem = modified[i];
      let localChanges = {}; // Para guardar cambios de esta bibliografía
     
      for (const key of doc_keys) {       
        // Cargamos el file si es que ha cambiado
        if (key === "file") {          
          localChanges[key] = modifiedItem[key];          
          continue;
        }
        const originalValue =
          typeof originalItem[key] === "string"
            ? originalItem[key].trim()
            : originalItem[key];

        const modifiedValue =
          typeof modifiedItem[key] === "string"
            ? modifiedItem[key].trim()
            : modifiedItem[key];

        if (originalValue !== modifiedValue) {
          localChanges[key] = {
            oldValue: originalItem[key],
            newValue: modifiedItem[key],
          };
        }

        if (Object.keys(localChanges).length > 0) {
          localChanges["_id"] = originalItem["_id"];
          changes[i] = localChanges;
         
        }
      }

      if (Object.keys(changes).length > 0) {
        return changes;
      } else return null;
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const changed = compareformData(formDataRestoration, formDataRestorationCp);
    const changedPicsInputs = comparePicsModifications(actualPhotos, photos);
    const changedDocs = compareDocuments(actualDocs, Documents);
    /*console.log(changedPicsInputs, "changedPicsInputs");
    console.log(Object.keys(changedPicsInputs).length);
    console.log(changedDocs, "changedDocs");
    console.log(PicsNew, "PicsNew");
    console.log(DocumentsNew, "DocumentsNew");
    console.log(changed, "changed");*/
    if (
      Object.keys(changed || {}).length === 0 &&
      Object.keys(changedPics || {}).length === 0 &&
      Object.keys(changedPicsInputs || {}).length === 0 &&
      Object.keys(changedDocs || {}).length === 0 &&
      PicsNew.length === 0 &&
      DocumentsNew.length === 0
    ) {
      alert("Hey chavo, no modificaste nada 😎");
      return;
    } else {
      alert("Se enviará el formulario con los cambios. 🚀");
      const response = fetchRestorationUpdate(
        accessToken,
        refreshToken,
        _id,
        restoration_id,
        changed,
        changedPics,
        changedPicsInputs,
        PicsNew,
        DocumentsNew,
        changedDocs,
        changed
      );

      response.then((data) => {
          console.log(data, "datarespuesta");
          alert("Cambios guardados con éxito! 🎉");
        })
        .catch((error) => {
          console.error("Error inesperado", error);
        });


    }
  };

  return (
    <div>
      Edit Restoration
      <br />
      <div className="container ">
        <form onSubmit={handleSave}>
          <div
            className="card ps-5 pe-5 pt-3 pb-3"
            style={{ background: "#abcc" }}
          >
            <RestorationEdit
              formDataRestoration={formDataRestoration}
              setFormDataRestoration={setFormDataRestoration}
              catalogResponsible={catalogResponsible}
              photos={photos}
              setPhotos={setPhotos}
              PicsNew={PicsNew}
              setPicsNew={setPicsNew}
              changedPics={changedPics}
              setChangedPics={setChangedPics}
              Documents={Documents}
              setDocuments={setDocuments}
              actualDocs={actualDocs}
              DocumentsNew={DocumentsNew}
              setDocumentsNew={setDocumentsNew}
            />
          </div>
          <button type="submit" className="btn btn-primary mt-3 mb-5">
            Save
          </button>
        </form>
      </div>
    </div>
  );
};
