import SETTINGS from "../Config/settings";

export const API_RequestResearchs = async ({ accessToken, refreshToken }) => {
  const url =
    SETTINGS.URL_ADDRESS.server_api_commands + "authenticated/piece_research/";
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return true;
    }
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const fetchResearchEdit = async (accessToken, refreshToken, _id) => {
  const url =
    SETTINGS.URL_ADDRESS.server_api_commands +
    `authenticated/piece_researchs/edit/${_id}/`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return true;
    }
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const API_UpdateResearch = async ({
  accessToken,
        refreshToken,
        changes,
        changedPics,
        changes_pics_inputs,
        PicsNew,
        _id,
}) => {
  const url =
    SETTINGS.URL_ADDRESS.server_api_commands +
    `authenticated/piece_researchs/edit/${_id}/`;
  try {
    const formData = new FormData();
    formData.append("changes", JSON.stringify(changes || {}));
    formData.append("PicsNew", JSON.stringify(PicsNew || {}));
    if (PicsNew && Object.keys(PicsNew).length > 0) {
      for (const [key, { file }] of Object.entries(PicsNew)) {
        formData.append(`files[new_img_${key}]`, file);
      }
    }
    formData.append(
      "changes_pics_inputs",
      JSON.stringify(changes_pics_inputs || {})
    );

    let files = {};

    if (changedPics && Object.keys(changedPics).length > 0) {
      for (const [key, { _id, file }] of Object.entries(changedPics)) {
        formData.append(`files[changed_img_${key}]`, file);
        files[`${key}`] = { _id };
      }
      formData.append("changed_pics", JSON.stringify(files));
    }

    const response = await fetch(url, {
      method: "PATCH",
      headers: {        
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return true;
    }
  } catch (e) {
    console.error(e);
    return false;
  }
};
