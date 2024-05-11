const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const app = require('./app')

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`SERVER is running at port: ${port}`);
});
