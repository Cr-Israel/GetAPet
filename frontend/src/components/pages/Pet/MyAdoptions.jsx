import api from '../../../utils/api'

/* Import from React */
import { useState, useEffect } from 'react'

/* Styles */
import styles from './Dashboard.module.css'

/* Components */
import RoundedImage from '../../layout/RoundedImage'

function MyAdoptions() {
    const [pets, setPets] = useState([])
    const [token] = useState(localStorage.getItem('token') || '')

    useEffect(() => {
        api.get('/pets/myadoptions', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        }).then((response) => {
            setPets(response.data.pets) 
        });
    }, [token])

    return (
        <section>
            <div className={styles.petlist_header}>
                <h1>Minhas Adoções</h1>
            </div>
            <div className={styles.petlist_container}>
                {pets.length > 0 && 
                    pets.map((pet) => (
                        <div key={pet._id} className={styles.petlist_row}>
                        <RoundedImage
                            src={`http://localhost:5000/images/pets/${pet.images[0]}`}
                            alt={pet.name}
                            width="75px"
                        />
                        <span className="bold">{pet.name}</span>
                        <div className={styles.contacts}>
                            <p>
                                <span className="bold">Ligue para:</span> {pet.user.phone}
                            </p>
                            <p>
                                <span className="bold">Fale com:</span> {pet.user.name}
                            </p>
                        </div>
                        <div className={styles.actions}>
                            {pet.available ? (
                                <p>Adoção em processo</p>
                            ) : (
                                <p>Parabéns por concluir a adoção!</p>
                            )}
                        </div>
                    </div>
                    ))
                }
                {pets.lenght === 0 && <p>Ainda não há adoções de Pets.</p>}
            </div>
        </section>
    )
}

export default MyAdoptions