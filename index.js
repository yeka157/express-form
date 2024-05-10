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
        console.log(data);
        return res.status(200).send(data);
    } catch (error) {
        console.log(error);
        return res.status(500).send('Error fetching customer data');
    }
});

app.post('/customer', async (req, res) => {
    try {
        console.log(req.body);
        const { data, error } = await supabase.from('customer').insert(req.body);
        if (error) {
            console.log(error);
            return res.status(500).send({status: 'failed'});
        }
        res.status(201).send({ status: 'success' });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});