const ServerName = "http://and-pad.duckdns.org/";
const SETTINGS = {
    URL_ADDRESS: {
        server_url: ServerName, //images documents and files
        server_api_commands:"http://and-pad.duckdns.org:8000/", //ServerName + 'api/',
        generate_word: 'authenticated/user_query/detail/word/',

        inventory_thumbnails: 'static/documents/public/inventario/fotosThumbnails/',
        inventory_full_size: 'static/documents/public/inventario/fotos/',
        research_thumbnails: 'static/documents/public/investigacion/fotosThumbnails/',
        research_full_size: 'static/documents/public/investigacion/fotos/',
        restoration_thumbnails:'static/documents/public/restauracion/fotosThumbnails/',
        restoration_full_size:'static/documents/public/restauracion/fotos/',


            },

};

export default SETTINGS;