import { Router } from 'express';
import usersModel from '../../dao/dbManagers/models/users.models.js';

const router = Router();

router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;

        if (!first_name || !last_name || !email || !age || !password) {
            return res.status(422).send({ status: 'error', message: 'incomplete values' });
        }

        const exists = await usersModel.findOne({ email });

        if (exists) {
            return res.status(400).send({ status: 'error', message: 'user already exists' });
        }

        await usersModel.create({
            first_name,
            last_name,
            email,
            age,
            password
        })

        res.status(201).send({ status: 'success', message: 'user registered' });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message })
    }
});


 router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        req.session.user = {
            name: 'Admin', // O cualquier otro nombre para el administrador
            email: email,
            role: 'admin'
        };

        if (email === 'adminCoder@coder.com' || password === 'adminCod3r123') {
            return res.send({ status: 'success', message: 'Inicio de sesión como administrador exitoso' });
        }

        const user = await usersModel.findOne({ email, password });

        if (!user) {
            return res.status(400).send({ status: 'error', message: 'credenciales incorrectas' });
        }

        req.session.user = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            role: user.role
        }


        res.send({ status: 'success', message: 'login success' })
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: 'error', message: error.message })
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if(error) return res.status(500).send({ status: 'error', message: error.message });
        res.redirect('/');
    })
})

export default router;