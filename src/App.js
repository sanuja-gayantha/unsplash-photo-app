import React, { useRef } from 'react'
import { FaSearch } from 'react-icons/fa'
import Photo from './Photo'
import {useGlobalContext} from './context';
import Error from './Error';


function App() {
 
  const {loading, photos, setSearchTerm, setChange, error} = useGlobalContext();
  const query = useRef(null);

  const searchImage = (e) => {
    e.preventDefault();
    if (!query){
      return
    }
    setSearchTerm(query.current.value);
    setChange(true);
  }

  // if (photos.length < 1) {
  //   return (
  //     <h2 className='section-title'>
  //       no cocktails matched your search criteria
  //     </h2>
  //   )
  // }

  if (error === 403) {
    return (
      <Error/>  
    )
  }

  return (
    <main>
      <section className="search">
        <form className="search-form">
          <input type="text" placeholder="Search" className="form-input" ref={query} />
          <button type="submit" className='submit-btn' onClick={searchImage}>
            <FaSearch />
          </button>
        </form>
      </section>

      <section className="photos">
        <div className="photos-center">
          {photos.map((image, index) => {
            return (
              <Photo key={index} {...image} />
            );
          })}
        </div>
        {loading && <div className="loader"></div>}
      </section>
    </main>
  );
}

export default App
