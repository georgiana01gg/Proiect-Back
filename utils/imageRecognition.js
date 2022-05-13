const vision = require('@google-cloud/vision');
const dotenv = require("dotenv");
dotenv.config();

const imageRecognitionAPI = new vision.ImageAnnotatorClient({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

async function detectLabels(file) {
    try{
        const [result] = await imageRecognitionAPI.labelDetection(file);
        const labels = result.labelAnnotations;
        const labelsDescriptions = labels.map(label => label.description);
        return labelsDescriptions;
    }
    catch(error){
        console.log(error);
        return;
    }
}

async function detectImageProperties(file) {
    try{
        const [result] = await imageRecognitionAPI.imageProperties(file);
        const colors = result.imagePropertiesAnnotation.dominantColors.colors;
        return colors;
    }
    catch(error){
        console.log(error);
        return;
    }
}


module.exports = {
    detectLabels,
    detectImageProperties
}