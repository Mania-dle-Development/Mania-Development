export const requireAuth = (req, res, next) => {
    if(!req.user) {
        res.status(401).json( { error: "Not logged in"} )
        return
    }

    next()
};