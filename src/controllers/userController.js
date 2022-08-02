const userModel = require('../models/userModel');
const {uploadFile} = require('../aws/aws');
const validEmail = require('email-validator');
const bcrypt = require('bcrypt');

const nameRegex = /^[a-zA-z]+([\s][a-zA-Z]+)*$/
const phoneRegex = /^(?:(?:\+|0{0,2})91(\s*|[\-])?|[0]?)?([6789]\d{2}([ -]?)\d{3}([ -]?)\d{4})$/;
const passwordRegex = /^[a-zA-Z0-9!@#$%^&*]{8,15}$/;
const streetRegex = /^([a-zA-Z0-9 ]{2,50})*$/;
const cityRegex = /^[a-zA-z]+([\s][a-zA-Z]+)*$/;
const pincodeRegex = /^\d{6}$/;

const isValid = function(value){
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  if (typeof value === "number") return false;
  return true;
}

const isValidImage = function (files){
  if(files == undefined || files == '') return false;
  if (!/(\.jpg|\.jpeg|\.png|\.gif)$/i.exec(files.originalname)) return false
  return true
}
const bcryptPassword = async function(password){
  const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

const registerUser = async function (req, res){
  try{
    let data = req.body;
    let files = req.files[0];

    let {fname, lname, email, phone, password, address} = data;

    if(!isValid(fname)) return res.status(400).send({status: false, message: 'First name is not present.'});
    if(!nameRegex.test(fname)) return res.status(400).send({status: false, message: 'First name should only contain alphabets.'});
    
    if(!isValid(lname)) return res.status(400).send({status: false, message: 'Last name is not present.'});
    if(!nameRegex.test(lname)) return res.status(400).send({status: false, message: 'Last name should only contain alphabets.'});

    if(!isValid(email)) return res.status(400).send({status: false, message: 'Email address is not present.'});
    if(!validEmail.validate(email)) return res.status(400).send({status: false, message: 'The email is invalid.'});
    let checkEmail = await userModel.findOne({email});
    if(checkEmail) return res.status(400).send({status: false, message: 'This email address is already registered.'});

    if(!isValid(phone)) return res.status(400).send({status: false, message: 'Phone number is not present.'});
    if(!phoneRegex.test(phone)) return res.status(400).send({status: false, message: 'Phone number must contain only digits and should have length of 10.'});
    let checkPhone = await userModel.findOne({phone});
    if(checkPhone) return res.status(400).send({status: false, message: 'This phone number is already registered.'});

    if(!isValid(password)) return res.status(400).send({status: false, message: 'Password is not present.'});
    if(!passwordRegex.test(password)) return res.status(400).send({status: false, message: 'Password should have 8 to 15 characters.'});
    
    if(!isValidImage(files)) return res.status(400).send({status: false, message: 'Image must be present and only jpg/jpeg/png/gif extensions are allowed.'});
    data.profileImage = await uploadFile(files);

    data.password = await bcryptPassword(password);

    if(!address) return res.status(400).send({status: false, message: 'Address should be present.'});
    data.address = JSON.parse(address)
    
    let {shipping, billing} = data.address;
    
    if(!shipping || typeof shipping != 'object') return res.status(400).send({status: false, message: 'The shipping address must be present and should be an object.'});
    {
      let {street, city, pincode} = shipping;
      
      if(!isValid(street)) return res.status(400).send({status: false, message: 'The shipping street should be present.'});
      if(!streetRegex.test(street)) return res.status(400).send({status: false, message: 'The shipping street should only contain alphabets and digits.'})

      if(!isValid(city)) return res.status(400).send({status: false, message: 'The shipping city should be present.'});
      if(!cityRegex.test(city)) return res.status(400).send({status: false, message: 'The shipping city should contain only alphabets.'});

      if(!pincode || typeof pincode != 'number') return res.status(400).send({status: false, message: 'The shipping pincode must be present and should be a number.'});
      if(!pincodeRegex.test(pincode)) return res.status(400).send({status: false, message: 'The shipping pincode should have 6 six digits.'});
    }

    if(!billing || typeof billing != 'object') return res.status(400).send({status: false, message: 'The billing address must be present and should be an object.'});
    {
      let {street, city, pincode} = billing;
      
      if(!isValid(street)) return res.status(400).send({status: false, message: 'The billing street should be present.'});
      if(!streetRegex.test(street)) return res.status(400).send({status: false, message: 'The billing street should only contain alphabets and digits.'})

      if(!isValid(city)) return res.status(400).send({status: false, message: 'The billing city should be present.'});
      if(!cityRegex.test(city)) return res.status(400).send({status: false, message: 'The billing city should contain only alphabets.'});

      if(!pincode || typeof pincode != 'number') return res.status(400).send({status: false, message: 'The billing pincode must be present and should be a number.'});
      if(!pincodeRegex.test(pincode)) return res.status(400).send({status: false, message: 'The billing pincode should have 6 six digits.'});
    }
    
    let profileData = await userModel.create(data);
    return res.status(201).send({status: true, message: 'User Created Successfully', data: profileData});
  }
  catch(error){ return res.status(500).send({status: false, message: error.message})}
}

module.exports = {registerUser}