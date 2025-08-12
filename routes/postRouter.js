const express = require('express');
const router = express.Router();
const validator = require('validator');

router.post('/', async (req, res) => {
    const {username, email, password, confirmpassword, mobilenumber, birthdate, postalcode} = req.body;

    let usernameRaw = validator.trim(username);
    const usernameCheck = validator.escape(usernameRaw);
    
    const passwordCheck = validator.escape(password);

    const emailRaw = validator.trim(email);
    const emailNormalized = validator.normalizeEmail(emailRaw, { all_lowercase: true });

    const passwordSanitized = validator.trim(password);
    const confirmPasswordSanitized = validator.trim(confirmpassword);

    const mobileNumberRaw = validator.trim(mobilenumber);

    const postalCodeRaw = validator.trim(postalcode);

    let messages = {
        username: '',
        email: '',
        password: '',
        confirmpassword: '',
        mobilenumber: '',
        birthdate:  '',
        postalcode: ''
    };

    const usernameRegEx = /^[a-zA-Z0-9_-]+$/;
    //check username
    //3-30 username length
    //only alphanumeric, underscores, and hyphens
    if (!usernameCheck) {
        messages.username = 'Username is required';
    } else if (usernameCheck.length < 3 || usernameCheck.length > 20) {
        messages.username = 'Username must be 3-20 characters long';
    } else if (!usernameRegEx.test(usernameCheck)) {        
        messages.username = 'Username can only contain letters, numbers, hyphens, and underscores';
    } else {
        messages.username = 'Correct Username format';
    }

    const emailRegEx = /^[a-zA-Z0-9\._-]+@[a-z]+(\.[a-z]{2,})+$/;
    //check email
    //trim all leading and trailing whitespaces
    //only alphanumeric, underscores, hyphens, and dots
    if (!emailNormalized || emailNormalized.length < 1) {
        messages.email = 'Email address is required"';
    } else if (!emailRegEx.test(emailNormalized)) {        
        messages.email = 'Please enter a valid Email Address';
    } else {
        messages.email = 'Correct Email format';
    }

    const passwordRegEx = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_\-\\[\]\/;']).{8,}$/;
    //check password
    //minimum 8 length
    //password must contain atleast 1 uppercase letter, 1 lowercase letter, 1 digit, 1 special character characters    
    if (!passwordCheck){
        messages.password = 'Password is required';
    } else if (passwordSanitized.length < 8) {
        messages.password = 'Password must be at least 8 characters long';
    } else if (!passwordRegEx.test(passwordSanitized)) {        
        messages.password = 'Password must contain atleast 1 uppercase letter, 1 lowercase letter, 1 digit, 1 special character characters';
    } else {
        messages.password = 'Correct password format';
    }

    // check if password match with confirmpassword
    if (passwordSanitized !== confirmPasswordSanitized) {        
        messages.confirmpassword = 'Password do not match';
    }

    const mobileNumberRegEx = /^((\+63)(9\d{9})+)$|^((\+63)\-9\d{2}\-\d{3}\-\d{4})$|^((\+63)\ 9\d{2}\ \d{3}\ \d{4})$|^((09)\d{9})$|^(09\d{2}\-\d{3}\-\d{4})$/;
    //check mobilenumber
    //mobile number validation
    if (!mobileNumberRaw) {
        messages.mobilenumber = 'Mobile Number is required';
    } else if (!mobileNumberRegEx.test(mobileNumberRaw)){
        messages.mobilenumber = 'Must support this format: +639XXXXXXXXX, +63-9XX-XXX-XXXX, +63 9XX XXX XXXX, 09XXXXXXXXX';
    } else {
        messages.mobilenumber = 'Correct mobilenumber format';
    }

    //function to check if leap year
    function isLeapYear(year){
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }

    const birthdateRegEx = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(\d{4})$/;
    //check birthdate
    //validate birthdate and birthdate follows this format: MM/DD/YYYY
    if (!birthdate){
        messages.birthdate = 'Birthdate is required';
    } else {
        const m = birthdateRegEx.exec(birthdate);
        if (!m) {
            // format didn't match MM/DD/YYYY
            messages.birthdate = 'Birthdate must support this format: MM/DD/YYYY';
        } else {
            const month = parseInt(m[1], 10); 
            const day   = parseInt(m[2], 10); 
            const year  = parseInt(m[3], 10);

            // days per month (index 0 = Jan)
            const daysInMonth = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

            if (day < 1 || day > daysInMonth[month - 1]) {
                messages.birthdate = `Invalid date: ${birthdate} — ${month}/${day}/${year} is not a real date`;
            } else {
                messages.birthdate = 'Correct birthdate format';
            }
        }
    }

    const postalCodeRegEx = /^\d{4}$/;
    //chech postal code
    //postal code has exactly 4 digits
    if (!postalCodeRaw){
        messages.postalcode = 'Postal Code is required'
    } else if(!postalCodeRegEx.test(postalCodeRaw)){
        messages.postalcode = 'Postal code needs exactly 4 digits';
    } else {
        messages.postalcode = 'Correct postal code format';
    }
    
    res.render('home', { messages });
});

module.exports = router;