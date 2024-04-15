import { useState, useEffect, useCallback } from 'react';
import { locationSearch } from '../../thunks';
import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { debounce } from "lodash";

function LocationSearch() {  
    const [searchTerm, setSearchTerm] = useState('');  
    const [searchResults, setSearchResults] = useState([]); 
    const dispatch = useDispatch();

    
    const handleSearchChange = (e) => { 
         setSearchTerm(e.target.value);
    };
    
        const getPlacePredictions = (query) => {
            if (query) {    
                        try {      
                        dispatch(locationSearch({query: query}))
                            .then(unwrapResult)
                            .then((result) => {
                                console.log(result)
                                setSearchResults(result)
                            });         
                    } catch (error) {      
                        console.error('Search error:', error);    
                    }  }
        }
         useEffect(() => {  debouncedGetPlacePredictions(searchTerm);}, [searchTerm]);  

         const debouncedGetPlacePredictions = useCallback(
            debounce(getPlacePredictions, 500),
            []
        );
       
         return (  
         <div>
            <label htmlFor='locationName'>Location: </label>   
            <input type="text" 
                    name="location-name" 
                    id="locationName" 
                    value={searchTerm} 
                    onChange={handleSearchChange} 
                    />    
            {searchResults.length > 0 && (      
            <ul>        
                {searchResults.map((result) => (          
                <li key={result.id}>{result.name}</li>       
             ))}      
             </ul>    
             )}  
        </div>);

}
export default LocationSearch;