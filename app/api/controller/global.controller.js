const axios = require('axios')

exports.getSearch = async (req, res) => {

    if (req.query.query == null) {
        return res.status(204).json({status: false, message: "Params Required", response: []});
    }
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: "https://www.sofascore.com/api/v1/search/all?page=0&sport=football&q=" + req.query.query
    };

    axios.request(config)
        .then((response) => {
            if (response.status === 500) {
                return res.status(204).json({status: false, message: "Something went wrong", response: []});
            }
            if (!response.data) {
                return res.status(204).json({status: false, message: "Record not Found", response: []});
            }

            return res.status(200).json(response.data.results ?? {});

        })
        .catch((error) => {
            return res.status(204).json({status: false, message: error.message, response: []});
        });
};