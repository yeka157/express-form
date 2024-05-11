const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({}));

const supabaseUrl = 'https://vmfyhzeaomkudqtxmcpi.supabase.co';
const supabaseKey = process.env.API_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

app.get('/customer', async (req, res) => {
    try {
        const { data, error } = await supabase.from('customer').select();
        if (error) {
            console.log(error);
            return res.status(500).send('Error fetching customer');
        }
        return res.status(200).send(data);
    } catch (error) {
        console.log(error);
        return res.status(500).send('Error fetching customer data');
    }
});

app.post('/customer', async (req, res) => {
    try {
        const { name, phone_number, email, address, birthdate, gender} = req.body;
        if (!name || !phone_number || !email || !address || !birthdate || !gender) {
            return res.status(500).send({status: 'failed', errorMsg : 'Incomplete data.'});
        }
        if (!/^[a-zA-Z ]+$/.test(name)) {
            return res.status(500).send({status: 'failed', errorMsg: 'Invalid name'});
        }
        if (!/^\d+$/.test(phone_number)) {
            return res.status(500).send({status: 'failed', errorMsg: 'Invalid phone number'});
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            return res.status(500).send({status: 'failed', errorMsg: 'Invalid email'});
        }
        if (address.length < 5) {
            return res.status(500).send({status: 'failed', errorMsg: 'Invalid address'});
        }
        let birthdayDate = new Date(birthdate);
        let currentDate = new Date();
        if (birthdayDate > currentDate) {
            return res.status(500).send({status: 'failed', errorMsg: 'Invalid birthdate'});
        }
        if (gender < 1 || gender > 2) {
            return res.status(500).send({status: 'failed', errorMsg: 'Invalid gender'});
        }
        const { data, error } = await supabase.from('customer').insert(req.body);
        if (error) {
            return res.status(500).send({status: 'failed', errorMsg: error});
        }
        res.status(201).send({ status: 'success' });
    } catch (error) {
        res.status(500).send({status: 'failed', errorMsg: error});
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;