import mongoose from 'mongoose';

async function main() {
    await mongoose.connect('mongodb://localhost:27017/getapet');
    console.log('Conectado ao Mongoose!');
};

main().catch((err) => console.log('Houve um erro aqui na conexão com o Mongoose: ' + err));

export default mongoose;