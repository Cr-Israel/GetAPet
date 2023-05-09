import jwt from 'jsonwebtoken';

const createUserToken = async (user, req, res) => {
    // Create Token
    const token = jwt.sign({
        // Aqui eu posso enviar o que vai junto com o Token, metadados, como o name e o ID do user e depois pegar esses dados.
        name: user.name,
        id: user._id
    }, "nossosecret");

    // Return Token
    res.status(200).json({
        message: 'Você está autenticado!',
        token: token,
        userId: user._id
    });
};

export default createUserToken;