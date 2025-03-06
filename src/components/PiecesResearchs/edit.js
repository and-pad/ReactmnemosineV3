import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
//import { fetchResearchEdit } from "./APICalls";
import { useNavigate } from "react-router-dom";
//import SETTINGS from "../Config/settings";
import { useDataResearch } from "./researchsActions";


export const EditResearch = ({ accessToken, refreshToken }) => {

    const { _id } = useParams();
    const data = useDataResearch();
    const navigate = useNavigate();
   

    return (
        <div>
            {data?.title ? <h1>{data.title}</h1> : null}
        </div>
    )
}

