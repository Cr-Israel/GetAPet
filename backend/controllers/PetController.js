import Pet from '../models/Pet.js'
import mongoose from 'mongoose';

// Helpers
import getToken from '../helpers/get-token.js';
import getUserByToken from '../helpers/get-user-by-token.js';

export default class PetController {
    static async create(req, res) {
        const { name, age, weight, color } = req.body;
        const available = true;
        const images = req.files;

        // Images Upload

        // Validations
        if (!name) {
            res.status(422).json({ message: 'O nome é obrigatório, por favor tente novamente!' });
            return;
        };
        if (!age) {
            res.status(422).json({ message: 'A idade é obrigatória, por favor tente novamente!' });
            return;
        };
        if (!weight) {
            res.status(422).json({ message: 'O peso é obrigatório, por favor tente novamente!' });
            return;
        };
        if (!color) {
            res.status(422).json({ message: 'A cor é obrigatória, por favor tente novamente!' });
            return;
        };
        if (images.length === 0) {
            res.status(422).json({ message: 'A imagem é obrigatória, por favor tente novamente!' });
            return;
        };

        // Get Pet Owner(User)
        const token = getToken(req);
        const user = await getUserByToken(token);

        // Create a Pet
        const pet = new Pet({
            name,
            age,
            weight,
            color,
            available,
            images: [],
            user: {
                _id: user._id,
                name: user.name,
                image: user.image,
                phone: user.phone
            }
        });

        images.map((image) => {
            pet.images.push(image.filename);
        });

        try {
            const newPet = await pet.save();
            res.status(201).json({
                message: 'Pet cadastrado com sucesso!',
                newPet
            });
        } catch (err) {
            res.status(500).json({ message: err });
        };
    };

    static async getAll(req, res) {
        const pets = await Pet.find().sort('-createdAt');
        res.status(200).json({ pets: pets });
    };

    static async getAllUserPets(req, res) {
        // Get User from Token
        const token = getToken(req);
        const user = await getUserByToken(token);

        const pets = await Pet.find({ 'user._id': user._id }).sort('-createdAt');
        res.status(200).json({ pets });
    };

    static async getAllUserAdoptions(req, res) {
        const token = getToken(req);
        const user = await getUserByToken(token);

        const pets = await Pet.find({ 'adopter._id': user._id }).sort('-createdAt');
        res.status(200).json({ pets });
    }

    static async getPetById(req, res) {
        const { id } = req.params;
        // Check if ID is Valid
        if (!mongoose.isValidObjectId(id)) {
            res.status(422).json({ message: 'ID inválido!' });
            return;
        };
        // Check if Pet Exists
        const pet = await Pet.findOne({ _id: id });
        if (!pet) {
            res.status(404).json({ message: 'Pet não encontrado! ' });
        };

        res.status(200).json({ pet });
    };

    static async removePetById(req, res) {
        const { id } = req.params ?? ''

        // Check if ID is Valid
        if (!mongoose.isValidObjectId(id)) {
            res.status(422).json({ message: 'ID inválido!' });
            return;
        };
        // Check if Pet Exists
        const pet = await Pet.findOne({ _id: id });
        if (!pet) {
            res.status(404).json({ message: 'Pet não encontrado! ' });
            return;
        };

        // Check if Logged in User Registered the Pet
        const token = getToken(req);
        const user = await getUserByToken(token);

        if (pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({ message: 'Houve um problema em processar a sua solicitação, tente novamente mais tarde! ' });
            return;
        };

        await Pet.findByIdAndDelete(id);
        res.status(200).json({ message: 'Pet removido com sucesso!' });

    };

    static async updatePet(req, res) {
        const { id } = req.params ?? '';
        const { name, age, weight, color, available } = req.body;
        const images = req.files;
        const updateData = {};

        // Check if Pet Exists
        const pet = await Pet.findOne({ _id: id });
        if (!pet) {
            res.status(404).json({ message: 'Pet não encontrado! ' });
            return;
        };

        // Check if Logged in User Registered the Pet
        const token = getToken(req);
        const user = await getUserByToken(token);

        if (pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({ message: 'Houve um problema em processar a sua solicitação, tente novamente mais tarde! ' });
            return;
        };

        // Validations
        if (!name) {
            res.status(422).json({ message: 'O nome é obrigatório, por favor tente novamente!' });
            return;
        } else {
            updateData.name = name;
        };

        if (!age) {
            res.status(422).json({ message: 'A idade é obrigatória, por favor tente novamente!' });
            return;
        } else {
            updateData.age = age;
        };

        if (!weight) {
            res.status(422).json({ message: 'O peso é obrigatório, por favor tente novamente!' });
            return;
        } else {
            updateData.weight = weight;
        };

        if (!color) {
            res.status(422).json({ message: 'A cor é obrigatória, por favor tente novamente!' });
            return;
        } else {
            updateData.color = color;
        };

        if (images.length > 0) {
            updateData.images = [];
            images.map((image) => {
                updateData.images.push(image.filename);
            });
        };

        await Pet.findByIdAndUpdate(id, updateData);
        res.status(200).json({ message: 'Pet atualizado com sucesso!' });
    };

    static async schedule(req, res) {
        const { id } = req.params;

        // Check if Pet Exists
        const pet = await Pet.findOne({ _id: id });
        if (!pet) {
            res.status(404).json({ message: 'Pet não encontrado! ' });
            return;
        };

        // Check if User Registred the Pet
        const token = getToken(req);
        const user = await getUserByToken(token);

        if (pet.user._id.equals(user._id)) {
            res.status(422).json({ message: 'Você não pode agendar uma visita para o seu próprio Pet! ' });
            return;
        };

        // Check if User has Already Scheduled a Visit
        if (pet.adopter) {
            if (pet.adopter._id.equals(user._id)) {
                res.status(422).json({ message: 'Você já agendou uma visita para este Pet! ' });
                return;
            };
        };

        // Add User to Pet
        pet.adopter = {
            _id: user._id,
            name: user.name,
            image: user.image
        };

        await Pet.findByIdAndUpdate(id, pet);
        res.status(200).json({ message: `A visita foi agendada com sucesso, entre em contato com ${pet.user.name} pelo telefone ${pet.user.phone}!` });
    };

    static async concludeAdoption(req, res) {
        const { id } = req.params;

        // Check if Pet Exists
        const pet = await Pet.findOne({ _id: id });
        if (!pet) {
            res.status(404).json({ message: 'Pet não encontrado! ' });
            return;
        };

        // Check if Logged in User Registered the Pet
        const token = getToken(req);
        const user = await getUserByToken(token);

        if (pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({ message: 'Houve um problema em processar a sua solicitação, tente novamente mais tarde! ' });
            return;
        };

        pet.available = false;
        await Pet.findByIdAndUpdate(id, pet);
        res.status(200).json({ message: 'Parabéns! O ciclo de adoção foi finalizado com sucesso!' });
    };
};