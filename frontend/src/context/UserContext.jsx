import { createContext } from "react";
import PropTypes from 'prop-types'

// Hook
import useAuth from "../hooks/useAuth";

const Context = createContext()

function UserProvider({ children }) {
    const { authenticated, register, logout, login } = useAuth()

    return (
        <Context.Provider value={{ authenticated, register, logout, login }}>
            {children}
        </Context.Provider>
    )
}

UserProvider.propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.element),
    ]).isRequired,
  }

export {
    Context,
    UserProvider
}