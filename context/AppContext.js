'use client'
import { createContext, useState} from "react";


export const AppContext = createContext()

const AppContextProvider = (props) => {

    const [theme, setTheme] = useState('beary-cute')

    const value = {
        theme,
        setTheme
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider
