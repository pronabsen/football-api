const axios = require("axios");

exports.getManagerInfo = (req, res) => {

    if (req.params.id == null){
        return res.status(204).json({status: false, message: "Params Required", response: []});
    }
    let config = {method: 'get', maxBodyLength: Infinity, url: "https://api.sofascore.app/api/v1/manager/"+req.params.id};

    axios.request(config)
        .then((response) => {
            if (response.status === 500){
                return res.status(204).json({status: false, message: "Something went wrong", response: []});
            }
            if (!response.data) {return res.status(204).json({status: false, message: "Record not Found", response: []});}

            return res.status(200).json(response.data.manager ?? []);
        })
        .catch((error) => {
            return res.status(204).json({status: false, message: error.message, response: []});
        });
};

exports.getManagerCareer = (req, res) => {

    if (req.params.id == null){
        return res.status(204).json({status: false, message: "Params Required", response: []});
    }
    let config = {method: 'get', maxBodyLength: Infinity, url: "https://api.sofascore.app/api/v1/manager/"+req.params.id+"/career-history"};

    axios.request(config)
        .then((response) => {
            if (response.status === 500){
                return res.status(204).json({status: false, message: "Something went wrong", response: []});
            }
            if (!response.data) {return res.status(204).json({status: false, message: "Record not Found", response: []});}

            return res.status(200).json(response.data.careerHistory ?? []);
        })
        .catch((error) => {
            return res.status(204).json({status: false, message: error.message, response: []});
        });
};