const checkAuthentication = (req, res, next) => {
    const { userId } = req.session;

    if (!userId) {
        return res.status(401).send({message: 'Invalid credentials'})
    }
    next();
} 

module.exports = checkAuthentication
