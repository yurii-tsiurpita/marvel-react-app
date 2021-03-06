import {useHttp} from "../hooks/http.hook";

const useMarvelService = () => {
    const {process, request, clearError, setProcess} = useHttp();

    const _apiBase = "https://gateway.marvel.com:443/v1/public/";
    const _apiKey = "apikey=a5aa21fb00687e162c5d43bb64481a67";
    const _baseOffset = 210;

    const getAllComics = async (offset = _baseOffset) => {
        const response = await request(`${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`);
        return response.data.results.map(_transformComic);
    }

    const getComic = async (id) => {
        const response = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        return _transformComic(response.data.results[0]);
    }

    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    const _transformCharacter = (char) => {
        return {
            id: char.id,
            name: char.name,
            description: char.description,
            thumbnail: char.thumbnail.path + "." + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }

    const _transformComic = (comic) => {
        return {
            id: comic.id,
            title: comic.title,
            description: comic.description || "There is no description",
            pageCount: comic.pageCount ? `${comic.pageCount} p.` : "No info about the number of pages",
            thumbnail: comic.thumbnail.path + "." + comic.thumbnail.extension,
            language: comic.textObjects.language || "en-us",
            price: comic.prices[0].price
        }
    }

    return {
        _apiBase,
        _apiKey,
        process,
        getAllComics,
        getComic,
        getAllCharacters,
        getCharacter,
        clearError,
        setProcess
    }
}

export default useMarvelService;