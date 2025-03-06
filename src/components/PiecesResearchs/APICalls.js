import SETTINGS from "../Config/settings";

export const API_RequestResearchs = async ({accessToken, refreshToken}) => {
    const url = SETTINGS.URL_ADDRESS.server_api_commands + 'authenticated/piece_research/';
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                
                Authorization: `Bearer ${accessToken}`
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
    const url = SETTINGS.URL_ADDRESS.server_api_commands + `authenticated/piece_researchs/edit/${_id}/`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
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

