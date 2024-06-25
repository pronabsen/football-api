const axios = require('axios')

exports.getLiveMatches = (req, res) => {


    let config = {method: 'get', maxBodyLength: Infinity, url: 'https://sofascore.com/api/v1/sport/football/events/live'};

    axios.request(config)
        .then((response) => {
            if (response.status === 500){
                return res.status(404).json({status: false, message: "Something went wrong", response: []});
            }
            if (!response.data) {return res.status(404).json({status: false, message: "Record not Found", response: []});}

            let results = [];
			let resultsTid = [];
            let data = response.data.events;

            data.forEach(item => {
				resultsTid.push(item.tournament.id);
				
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
                results[item.tournament.id].push(res);
            });
			
			resultsTid = resultsTid.reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]) ?? [];
			
			const orderedGroupedData = [];
			resultsTid.forEach(tournamentId => {
			  if (results[tournamentId]) {
				  let res2 = {
					  tournamentId: tournamentId, 
					  tournament: results[tournamentId][0].tournament,
					  matches: results[tournamentId] 
					}
				
				orderedGroupedData.push(res2);
			  }
			});

          /*  let newArray = Object.keys(results).map(tournamentId => {
                return { tournamentId: tournamentId, tournament: results[tournamentId][0].tournament, matches: results[tournamentId] };
            });
*/
            return res.status(200).json(orderedGroupedData ?? []);
        })
        .catch((error) => {
            return res.status(404).json({status: false, message: error.message, response: []});
        });
};
function addOrUpdateStudent(rollNo, newValue) {

}
exports.getScheduleMatches = (req, res) => {

    if (req.query.date == null){
        return res.status(404).json({status: false, message: "Params Required", response: []});
    }

    let config = {method: 'get', maxBodyLength: Infinity, url: 'https://www.sofascore.com/api/v1/sport/football/scheduled-events/'+req.query.date};

    axios.request(config)
        .then((response) => {
            if (response.status === 500){
                return res.status(404).json({status: false, message: "Something went wrong", response: []});
            }
            if (!response.data) {return res.status(404).json({status: false, message: "Record not Found", response: []});}

                      let results = [];
			let resultsTid = [];
            let data = response.data.events;

            data.forEach(item => {
				resultsTid.push(item.tournament.id);
				
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
                results[item.tournament.id].push(res);
            });
			
			resultsTid = resultsTid.reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]) ?? [];
			
			const orderedGroupedData = [];
			resultsTid.forEach(tournamentId => {
			  if (results[tournamentId]) {
				  let res2 = {
					  tournamentId: tournamentId, 
					  tournament: results[tournamentId][0].tournament,
					  matches: results[tournamentId] 
					}
				
				orderedGroupedData.push(res2);
			  }
			});

          /*  let newArray = Object.keys(results).map(tournamentId => {
                return { tournamentId: tournamentId, tournament: results[tournamentId][0].tournament, matches: results[tournamentId] };
            });
*/
            return res.status(200).json(orderedGroupedData ?? []);
        })
        .catch((error) => {
            return res.status(404).json({status: false, message: error.message, response: []});
        });
};