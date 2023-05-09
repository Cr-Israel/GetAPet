/* Hooks from React */
import { useState } from 'react';

/* Styles of Form */
import formStyles from './Form.module.css'

/* Components */
import Input from './Input'
import Select from './Select'

function PetForm({ handleSubmit, petData, btnText }) {
    const [pet, setPet] = useState(petData || {})
    const [preview, setPreview] = useState([]) // Empty array, because we have multiple photos, multiple upload of photos
    const colors = ["Branco", "Preto", "Caramelo", "Dourado", "Mesclado", "Azul", "Vermelho", "Cinza", "Prata",
        "Marrom", "Creme", "Fulvo", "Castanho Claro", "Castanho Escuro", "Chocolate", "Laranja", "Ferrugem",
        "Marrom Avermelhado", "Mongo", "Bege", "Alperce", "Sable"]

    function onFileChange(e) {
        setPreview(Array.from(e.target.files))
        setPet({ ...pet, images: [...e.target.files] })
    }

    function handleChange(e) {
        setPet({ ...pet, [e.target.name]: e.target.value })
    }

    function handleColor(e) {
        setPet({ ...pet, color: e.target.options[e.target.selectedIndex].text })
    }

    function submit(e) {
        e.preventDefault()
        console.log(pet)
        handleSubmit(pet)
    }

    return (
        <form onSubmit={submit} className={formStyles.form_container}>
            <div className={formStyles.preview_pet_images}>
                {preview.length > 0 ? preview.map((image, index) =>
                    <img
                        src={URL.createObjectURL(image)}
                        alt={pet.name}
                        key={`${pet.name}+${index}`} />)

                    : pet.images && pet.images.map((image, index) =>
                        <img
                            src={`http://localhost:5000/images/pets/${image}`}
                            alt={pet.name}
                            key={`${pet.name}+${index}`} />)
                }
            </div>
            <Input
                text='Imagens do Pet'
                type='file'
                name='images'
                handleOnChange={onFileChange}
                multiple={true}
            />
            <Input
                text='Nome do Pet'
                type='text'
                name='name'
                placeholder='Digite o nome do Pet'
                handleOnChange={handleChange}
                value={pet.name || ''}
            />
            <Input
                text='Idade do Pet'
                type='text'
                name='age'
                placeholder='Digite a idade do Pet'
                handleOnChange={handleChange}
                value={pet.age || ''}
            />
            <Input
                text='Peso do Pet'
                type='number'
                name='weight'
                placeholder='Digite o peso do Pet'
                handleOnChange={handleChange}
                value={pet.weight || ''}
            />
            <Select
                name="color"
                text="Selecione a cor"
                options={colors}
                handleOnChange={handleColor}
                value={pet.color || ''}
            />
            <input type="submit" value={btnText} />
        </form>
    )
}

export default PetForm;