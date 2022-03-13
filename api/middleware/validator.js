import {check, validationResult, body} from 'express-validator'
export const validatorRegister = [
    body('username')
    .notEmpty()
    .withMessage('username is required'),
    check('email')
    .isEmail()
    .withMessage('Valid Email is required'),
    check('password')
    .matches(/[a-zA-Z]+\W+/g)
    .withMessage('Password min 6 character and include \W+ or [a-zA-Z]')
]

export const validatorLogin = [
    check('email')
    .isEmail()
    .withMessage('Valid Email is required'),
    check('password')
    .matches(/[a-zA-Z]+\W+/g)
    .withMessage('Password min 6 character and include \W+ or [a-zA-Z]')
]

export const isRequestValidated = async (req, res, next) => {
    const errors = validationResult(req)
    if(errors.array().length > 0){
        return res.status(400).json({ error: errors.array()[0].msg })
    }
    next();
}