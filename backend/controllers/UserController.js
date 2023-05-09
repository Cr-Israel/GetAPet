import User from '../models/User.js';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

// Helpers
import createUserToken from '../helpers/create-user-token.js';
import getToken from '../helpers/get-token.js';
import getUserByToken from '../helpers/get-user-by-token.js';

export default class UserController {
    static async register(req, res) {
        const { name, email, phone, password, confirmpassword } = req.body;

        // Validations
        if (!name) {
            res.status(422).json({ message: 'O nome é obrigatório, por favor tente novamente!' });
            return;
        };
        if (!email) {
            res.status(422).json({ message: 'O e-mail é obrigatório, por favor tente novamente!' });
            return;
        };
        if (!phone) {
            res.status(422).json({ message: 'O telefone é obrigatório, por favor tente novamente!' });
            return;
        };
        if (!password) {
            res.status(422).json({ message: 'A senha é obrigatória, por favor tente novamente!' });
            return;
        };
        if (!confirmpassword) {
            res.status(422).json({ message: 'A confirmação de senha é obrigatória, por favor tente novamente!' });
            return;
        };
        if (password !== confirmpassword) {
            res.status(422).json({ message: 'As senhas não conferem, por favor tente novamente!' });
            return;
        };

        // Check User if Exist
        const userExists = await User.findOne({ email: email });
        if (userExists) {
            res.status(422).json({ message: 'Usuário já existente, por favor utlize outro e-mail' });
            return;
        };

        // Check if Email is Valid
        if (validator.isEmail(email) == false) {
            res.status(400).json({ message: 'E-mail inválido, por favor tente novamente!' });
            return;
        };

        // Create a Password
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create User
        const user = new User({
            name,
            email,
            phone,
            password: passwordHash
        });

        try {
            const newUser = await user.save();
            await createUserToken(newUser, req, res);
        } catch (error) {
            res.status(500).json({ message: error });
        }
    };

    static async login(req, res) {
        const { email, password } = req.body;

        // Validations
        if (!email) {
            res.status(422).json({ message: 'O email é obrigatório, por favor tente novamente!' });
            return;
        };
        if (!password) {
            res.status(422).json({ message: 'A senha é obrigatória, por favor tente novamente!' });
            return;
        };

        // Check User if Exist
        const user = await User.findOne({ email: email });
        if (!user) {
            res.status(422).json({ message: 'Não há usuário cadastrado com este e-mail' });
            return;
        };

        // Check if Password Match with in DB Password
        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
            res.status(422).json({ message: 'Senha inválida, por favor tente novamente!' });
            return;
        };

        await createUserToken(user, req, res);
    };

    static async checkUser(req, res) {
        let currentUser;

        if (req.headers.authorization) {
            const token = getToken(req);
            const decoded = jwt.verify(token, 'nossosecret');

            currentUser = await User.findById(decoded.id);
            currentUser.password = undefined;
        } else {
            currentUser = null;
        };

        res.status(200).send(currentUser);
    };

    static async getUserById(req, res) {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) { // Check if user._id is Valid
            res.status(422).json({ message: 'Usuário não encontrado!' });
            return;
        };
        const user = await User.findById(id).select('-password');
        // // if (!user) {
        // //     res.status(422).json({ message: 'Usuário não encontrado!' });
        // //     return;
        // // };

        res.status(200).json({ user });
    };

    static async editUser(req, res) {
        const { id } = req.params;
        const { name, email, phone, password, confirmpassword } = req.body;

        // Check if User Exists
        const token = getToken(req);
        const user = await getUserByToken(token);

        if (req.file) {
            user.image = req.file.filename;
        };

        // Validations
        if (!name) {
            res.status(422).json({ message: 'O nome é obrigatório, por favor tente novamente!' });
            return;
        };
        user.name = name;

        if (!email) {
            res.status(422).json({ message: 'O e-mail é obrigatório, por favor tente novamente!' });
            return;
        };
        // Check if Email is Valid
        if (validator.isEmail(email) == false) {
            res.status(400).json({ message: 'E-mail inválido, por favor tente novamente!' });
            return;
        };
        // Check if E-mail has Already Taken
        const userExists = await User.findOne({ email: email });

        if (user.email !== email && userExists) {
            res.status(422).json({ message: 'Por favor utilize outro e-mail!' });
            return;
        };

        user.email = email;

        if (!phone) {
            res.status(422).json({ message: 'O telefone é obrigatório, por favor tente novamente!' });
            return;
        };
        user.phone = phone;

        // Check if Password Match
        if (password !== confirmpassword) {
            res.status(422).json({ message: 'As senhas não conferem, por favor tente novamente!' });
            return;
        } else if (password && confirmpassword && password == confirmpassword && password !== null) {
            // Creating Password
            const salt = await bcrypt.genSalt(12);
            const passwordHash = await bcrypt.hash(password, salt);
            // Aqui eu atualizo a senha do usuário
            user.password = passwordHash;
        };

        try {
            // Return Update User Data
            await User.findOneAndUpdate(
                { _id: user._id },
                { $set: user },
                { new: true }
            );
            res.status(200).json({ message: 'Usuário atualizado com sucesso!' });
        } catch (err) {
            res.status(500).json({ message: err });
            return;
        };

        // // Check if ID is Valid
        // if (!mongoose.isValidObjectId(id)) { // Check if user._id is Valid
        //     res.status(422).json({ message: 'Usuário não encontrado!' });
        //     return;
        // };

        // if (!user) {
        //     res.status(422).json({ message: 'Usuário não encontrado!' });
        //     return;
        // };
    };
};    