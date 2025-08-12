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

    //check username
    if (!usernameCheck) {
        return res.render('home', { error: "Error: Username is required" });
    }
    //3-30 username length
    if (usernameCheck.length < 3 || usernameCheck.length > 20) {
        return res.render('home', { error: "Error: Username must be 3-20 characters long" })
    }

    const usernameRegEx = /^[a-zA-Z0-9_-]+$/;
    //only alphanumeric, underscores, and hyphens
    if (!usernameRegEx.test(usernameCheck)) {
        return res.render('home', { error: "Error: Username can only contain letters, numbers, hyphens, and underscores" });
    }

    //email checking
    //trim all leading and trailing whitespaces
    if (!emailNormalized || emailNormalized.length < 1) {
        return res.render('home', { error: "Error: Email address is required" });
    }

    const emailRegEx = /^[a-zA-Z0-9\._-]+@[a-z]+(\.[a-z]{2,})+$/;
    //only alphanumeric, underscores, hyphens, and dots
    if (!emailRegEx.test(emailNormalized)) {
        return res.render('home', { error: "Error: Please enter a valid email address" });
    }

    //check password
    if (!passwordCheck){
        return res.render('home', { error: "Error: Password is required" });
    }

    //minimum 8 length
    if (passwordSanitized.length < 8) {
        return res.render('home', { error: "Error: Password must be at least 8 characters long" });
    }

    //password must contain atleast 1 uppercase letter, 1 lowercase letter, 1 digit, 1 special character characters
    const passwordRegEx = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_\-\\[\]\/;']).{8,}$/;
    if (!passwordRegEx.test(passwordSanitized)) {
        return res.render('home', { error: "Error: Password must contain atleast 1 uppercase letter, 1 lowercase letter, 1 digit, 1 special character characters" });
    }

    // check if password match with confirmpassword
    if (passwordSanitized !== confirmPasswordSanitized) {
        return res.render('home', { error: "Passwords do not match" });
    }

    //check mobilenumber
    if (!mobileNumberRaw) {
        return res.render('home', { error: "Error: Mobile Number is required" });
    }

    //mobile number validation
    const mobileNumberRegEx = /^((\+63)(9\d{9})+)$|^((\+63)\-9\d{2}\-\d{3}\-\d{4})$|^((\+63)\ 9\d{2}\ \d{3}\ \d{4})$|^((09)\d{9})$|^(09\d{2}\-\d{3}\-\d{4})$/;
    if (!mobileNumberRegEx.test(mobileNumberRaw)){
        return res.render('home', { error: "Error: Mobile Number! Must support this format: +639XXXXXXXXX, +63-9XX-XXX-XXXX, +63 9XX XXX XXXX, 09XXXXXXXXX" });
    }

    const birthdateRegEx = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(\d{4})$/;
    //check birthdate
    if (!birthdate){
        return res.render('home', { error: "Error: Birthdate is required" });
    }

    //function to check if leap year
    function isLeapYear(year){
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }

    //function to validate birthdate
    function validateBirthDate(date){
        const month = parseInt(date[1], 10);
        const day = parseInt(date[2], 10);
        const year = parseInt(date[3], 10);

        // days per month (index 0 = Jan)
        const daysInMonth = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        if (day < 1 || day > daysInMonth[month - 1]) {
            return {
            valid: false,
            reason: `Invalid day ${day} for month ${month} in year ${year}`,
            isLeapYear: isLeapYear(year)
            };
        }

        return { valid: true, reason: 'Valid date', isLeapYear: isLeapYear(year) };

    }

    //validate birthdate and birthdate follows this format: MM/DD/YYYY
    if (!birthdateRegEx.test(birthdate) && validateBirthDate(birthdate)){
        return res.render('home', { error: "Error: Birthdate must support this format: MM/DD/YYYY." });
    }

    //postal code has exactly 4 digits
    const postalCodeRegEx = /^\d{4}$/;
    if(!postalCodeRegEx.test(postalCodeRaw)){
        return res.render('home', { error: "Error: Postal code needs exactly 4 digits."});
    }
    
});

module.exports = router;