const express = require('express');
const router = express.Router();

router.get('/', (req, res) =>{
     res.render("home", { 
        messages: {
            username: '',
            email: '',
            password: '',
            confirmpassword: '',
            mobilenumber: '',
            birthdate: '',
            postalcode: ''
        }
    });
});

// router.get('/home', (req, res) =>{
//     res.render("home", { error: null });
// });

module.exports = router;