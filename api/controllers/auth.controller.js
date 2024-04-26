export const register = (req,res) => {
    // operations
    const {username, password, email} = req.body

    //hash our password
    //create new user and save it to the db
    console.log(req.body);
    res.send(req.body)
}
export const login = (req,res) => {
    // operations
    console.log("login route ");
}
export const logout = (req,res) => {
    // operations
}