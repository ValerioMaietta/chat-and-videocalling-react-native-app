const express = require('express');

const router= express.Router();  //oggetto router per definire diverse rotte per l'applicazione

const {signup, signin} = require("../controllers/auth")

router.get('/', (req,res) => {

    return res.json({
        data: "hello world from the API",
    })

});

router.post("/signup", signup);
router.post("/signin", signin);



module.exports = router;