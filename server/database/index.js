const mongoose = require('mongoose');

mongoose.connect(
    'mongodb+srv://thakurbhagyashree747:thakurbhagyashree910@cluster0.jnnxmih.mongodb.net/'
).then(()=> console.log('MongoDB Connection successfully')
).catch(err=> console.log(`Error Occured : ${err}`));