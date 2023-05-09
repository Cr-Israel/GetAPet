import React from 'react'
import { Link } from 'react-router-dom'

/* Styles */
import styles from './404.module.css'

const NotFound = () => {
    return (
        <>

            <div style={{ justifyContent: "center", display: "flex" }}>
                <h1>Página não encontrada</h1>

            </div>
            <div className={styles.notfound} style={{ justifyContent: "center", display: "flex" }}>
                <p>
                    Voltar para Home <Link to="/">Clique aqui</Link>
                </p>
            </div>
        </>
    )
}

export default NotFound