import {createContext, useEffect, useState} from 'react';

const contextData = createContext();

function DataContext({ children }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    (async function fetchData() {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND}/form`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
        const data = await response.json()
        setData(data)
      } catch (error) {
        console.error(error)
      }
    })()
  }, [])

  // console.log(data);

  // fetch(`${import.meta.env.VITE_BACKEND}/form`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     setData(data);
    //   }
    // )

  return (
    <contextData.Provider value={data}>
      {children}
    </contextData.Provider>
  )
}

export { contextData, DataContext };