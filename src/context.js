import React , {useState, useEffect, useContext} from 'react';

const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`;
const mainUrl = `https://api.unsplash.com/photos/`;
const searchUrl = `https://api.unsplash.com/search/photos/`;

const AppContext = React.createContext();

const AppProvider = ({ children }) => {

    const [loading, setLoading] = useState(false);
    const [photos, setPhotos] = useState([]);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [change, setChange] = useState(false);
    const [error, setError] = useState(200);

    const fetchImages = async () => {
        setLoading(true);

        let url;
        const urlPage = `&page=${page}`;
        if(searchTerm) {
            const urlSearch = `&query=${searchTerm}`;
            url = `${searchUrl}${clientID}${urlPage}${urlSearch}`; 
        }else{
            url = `${mainUrl}${clientID}${urlPage}`;
        }

        try{
            const response = await fetch(url);

            if(response.status === 403){
                // console.log('Number Of Request per hour Exceeded');
                setError(403);
            }else if(response.status === 200){
                setError(200);
                const data = await response.json();
                // console.log('Working Properly');
                setPhotos((prevPhotos) => {
    
                    if(searchTerm && page === 1){
                        return data.results;
                    }else if(change && searchTerm  && page > 1){
                        setChange(false);
                        return data.results;
                    }else if(searchTerm && page > 1){
                        return [...prevPhotos, ...data.results];
                    }else{
                        return [...prevPhotos, ...data];
                    }
                                  
                });
            }

            setLoading(false);
        }catch(error){
            console.log(error);
            setLoading(false);
        }
    }

    useEffect(() => {
        const event = window.addEventListener('scroll', () => {
            if(!loading && window.innerHeight + window.scrollY >= document.body.scrollHeight - 2){
                setPage((prevPage) => {
                    return prevPage + 1;
                })
            }
        })
        return () => window.removeEventListener('scroll', event);
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        fetchImages();
        // eslint-disable-next-line
    }, [page, searchTerm])

    return(
        <AppContext.Provider value={{loading, photos, setSearchTerm, setChange, error}}>
            {children}
        </AppContext.Provider>
    )
}

export const useGlobalContext = () => {
    return useContext(AppContext);
}

export { AppContext, AppProvider }