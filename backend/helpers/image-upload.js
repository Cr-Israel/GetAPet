import multer from 'multer';
import path from 'node:path';

// Destination to Store the Images
const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        let folder = "";

        if (req.baseUrl.includes("users")) {
            folder = "users";
        } else if (req.baseUrl.includes("pets")) {
            folder = "pets";
        };

        cb(null, `public/images/${folder}`);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + String(Math.floor(Math.random() * 1000)) +path.extname(file.originalname));
    }
});

const imageUpload = multer({
    storage: imageStorage,
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(pan|jpg)$/)) {
            return cb(new Error("Por favor, envia a imagem nos formatos png ou jpg!"));
        };
        cb(undefined, true);
    }
});

export {
    imageUpload
}