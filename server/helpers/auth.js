const bcrypt = require('bcrypt')

module.exports.hashPassword = (password) => {
    try {
        return new Promise((resolve, reject) => {
            const saltRounds = 10;
            bcrypt.genSalt(saltRounds, (err, salt) => {
                if (err) { 
                    reject(err);
                } else {
                    bcrypt.hash(password, salt, (err, hash) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(hash);
                        }
                    });
                }
            });
        });
    } catch (error) {
        console.log("Error in hashing password: ", error);
        throw error; 
    }
}
    

module.exports.comparePassword = (password, hashedpass) => {

    return bcrypt.compare(password, hashedpass);

}