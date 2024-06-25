const axios = require("axios");

exports.getTeamInfo = (req, res) => {

    if (req.params.id == null){
        return res.status(404).json({status: false, message: "Params Required", response: []});
    }
    let config = {method: 'get', maxBodyLength: Infinity, url: "https://www.sofascore.com/api/v1/team/"+req.params.id};

    axios.request(config)
        .then((response) => {
            if (response.status === 500){
                return res.status(404).json({status: false, message: "Something went wrong", response: []});
            }
            if (!response.data) {return res.status(404).json({status: false, message: "Record not Found", response: []});}

            let data = response.data.team;

            let results = {
                id: data.id,
                slug: data.slug,
                name: data.name,
                shortName: data.shortName,
                gender: data.gender,
                fullName: data.fullName,
                nameCode: data.nameCode,
                ranking: data.ranking ?? "",
                foundationDateTimestamp: data.foundationDateTimestamp,
                national: data.national,
                sport: data.sport,
                category: data.category,
                manager: data.manager,
                venue: data.venue,
                teamColors: data.teamColors,
                type: data.type,
            };

            return res.status(200).json(results ?? null);

        })
        .catch((error) => {
            return res.status(404).json({status: false, message: error.message, response: []});
        });
};

exports.getTeamTournaments = (req, res) => {

    if (req.params.id == null){
        return res.status(404).json({status: false, message: "Params Required", response: []});
    }
    let config = {method: 'get', maxBodyLength: Infinity, url: "https://www.sofascore.com/api/v1/team/"+req.params.id+"/unique-tournaments"};

    axios.request(config)
        .then((response) => {
            if (response.status === 500){
                return res.status(404).json({status: false, message: "Something went wrong", response: []});
            }
            if (!response.data) {return res.status(404).json({status: false, message: "Record not Found", response: []});}

            return res.status(200).json(response.data.uniqueTournaments ?? null);

        })
        .catch((error) => {
            return res.status(404).json({status: false, message: error.message, response: []});
        });
};

exports.getTeamNextMatches = (req, res) => {

    if (req.params.id == null){
        return res.status(404).json({status: false, message: "Params Required", response: []});
    }
    let config = {method: 'get', maxBodyLength: Infinity, url: "https://www.sofascore.com/api/v1/team/"+req.params.id+"/events/next/0"};

    axios.request(config)
        .then((response) => {
            if (response.status === 500){
                return res.status(404).json({status: false, message: "Something went wrong", response: []});
            }
            if (!response.data) {return res.status(404).json({status: false, message: "Record not Found", response: []});}
            let results = [];

            let data = response.data.events;


            data.forEach(item => {
                if (!results[item.tournament.id]) {
                    results[item.tournament.id] = [];
                }
                let res = {
                    tournamentId: item.tournament.id,
                    id: item.id,
                    slug: item.slug,
                    startTimestamp: item.startTimestamp,
                    detailId: item.detailId,
                    season: item.season,
                    roundInfo: item.roundInfo,
                    status: item.status,
                    statusTime: item.statusTime,
                    homeTeam: item.homeTeam,
                    homeScore: item.homeScore,
                    awayTeam: item.awayTeam,
                    awayScore: item.awayScore,
                    time: item.time,
                    tournament: {
                        id: item.tournament.id,
                        name: item.tournament.name,
                        slug: item.tournament.slug,
                        category: item.tournament.category,
                        priority: item.tournament.priority,
                        competitionType: item.tournament.competitionType,
                        details: item.tournament.uniqueTournament,
                    },
                };
                results[item.tournament.id].push(res); // Change key from 'name' to 'full_name'
            });

            let newArray = Object.keys(results).map(tournamentId => {
                return { tournamentId: tournamentId, matches: results[tournamentId] };
            });

            return res.status(200).json(newArray ?? []);


        })
        .catch((error) => {
            return res.status(404).json({status: false, message: error.message, response: []});
        });
};

exports.getTeamRecentMatches = (req, res) => {

    if (req.params.id == null){
        return res.status(404).json({status: false, message: "Params Required", response: []});
    }
    let config = {method: 'get', maxBodyLength: Infinity, url: "https://www.sofascore.com/api/v1/team/"+req.params.id+"/events/last/0"};

    axios.request(config)
        .then((response) => {
            if (response.status === 500){
                return res.status(404).json({status: false, message: "Something went wrong", response: []});
            }
            if (!response.data) {return res.status(404).json({status: false, message: "Record not Found", response: []});}
            let results = [];

            let data = response.data.events;


            data.forEach(item => {
                if (!results[item.tournament.id]) {
                    results[item.tournament.id] = [];
                }
                let res = {
                    tournamentId: item.tournament.id,
                    id: item.id,
                    slug: item.slug,
                    startTimestamp: item.startTimestamp,
                    detailId: item.detailId,
                    season: item.season,
                    roundInfo: item.roundInfo,
                    status: item.status,
                    statusTime: item.statusTime,
                    homeTeam: item.homeTeam,
                    homeScore: item.homeScore,
                    awayTeam: item.awayTeam,
                    awayScore: item.awayScore,
                    time: item.time,
                    tournament: {
                        id: item.tournament.id,
                        name: item.tournament.name,
                        slug: item.tournament.slug,
                        category: item.tournament.category,
                        priority: item.tournament.priority,
                        competitionType: item.tournament.competitionType,
                        details: item.tournament.uniqueTournament,
                    },
                };
                results[item.tournament.id].push(res); // Change key from 'name' to 'full_name'
            });

            let newArray = Object.keys(results).map(tournamentId => {
                return { tournamentId: tournamentId, matches: results[tournamentId] };
            });

            return res.status(200).json(newArray ?? []);


        })
        .catch((error) => {
            return res.status(404).json({status: false, message: error.message, response: []});
        });
};

exports.getTeamSquads = (req, res) => {

    if (req.params.id == null){
        return res.status(404).json({status: false, message: "Params Required", response: []});
    }
    let config = {method: 'get', maxBodyLength: Infinity, url: "https://api.sofascore.app/api/v1/team/"+req.params.id+"/players"};

    axios.request(config)
        .then((response) => {
            if (response.status === 500){
                return res.status(404).json({status: false, message: "Something went wrong", response: []});
            }
            if (!response.data) {return res.status(404).json({status: false, message: "Record not Found", response: []});}
            let results = [];
            let data = response.data.players;
            for (let i = 0; i < response.data.players.length; i++ ){
                let res = data[i].player;
                results.push(res)
            }
            return res.status(200).json(results ?? []);
        })
        .catch((error) => {
            return res.status(404).json({status: false, message: error.message, response: []});
        });
};

exports.getRanking = (req, res) => {

    let config = {method: 'get', maxBodyLength: Infinity, url: "https://sofascore.com/api/v1/rankings/type/2"};

    axios.request(config)
        .then((response) => {
            if (response.status === 500){
                return res.status(404).json({status: false, message: "Something went wrong", response: []});
            }
            if (!response.data) {return res.status(404).json({status: false, message: "Record not Found", response: []});}

            return res.status(200).json(response.data.rankings ?? []);
        })
        .catch((error) => {
            return res.status(404).json({status: false, message: error.message, response: []});
        });
};