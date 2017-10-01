import {Meteor} from "meteor/meteor";
import {Teams} from "../api/Teams.js";
import "../api/Teams.js";

Meteor.startup(() => {
    // false : les données sont chargées uniquement si la base est vide (les changements via IHM fonctionnent)
    // true : les données sont écrasées à chaque chargement (les changements via IHM sont donc écrasés)
    var overrideData = false;

    if(overrideData)
        Teams.remove({});

    var today = new Date().getTime();
    var yesterday = today - 24 * 3600 * 1000;

    var match = function(id, date, duree) {
        var match = {
            "_id":id,
            "type": {id: "match", name: "Match"},
            "title": "Match contre l'OM",
            "color": "#50aa64",
            "start": date,
            "city": "Paris",
            "location": "Stade de France",
            "opponent": "Olympique de Marseille",
            "invitedPlayers": [
                {
                    "player": "psgJ1",
                    "confirmed": 'will'
                },
                {
                    "player": "psgJ2",
                    "confirmed": 'will'
                },
                {
                    "player": "psgJ3",
                    "confirmed": 'will'
                },
                {
                    "player": "psgJ4",
                    "confirmed": 'will'
                },
                {
                    "player": "psgJ5",
                    "confirmed": 'will'
                },
                {
                    "player": "psgJ6",
                    "confirmed": 'will'
                },
                {
                    "player": "psgJ7",
                    "confirmed": 'will'
                },
                {
                    "player": "psgJ8",
                    "confirmed": 'will'
                },
                {
                    "player": "psgJ9",
                    "confirmed": 'will'
                },
                {
                    "player": "psgJ10",
                    "confirmed": 'will'
                },
                {
                    "player": "psgJ11",
                    "confirmed": 'will'
                }
            ],
        };

        if(duree)
            match.end = date + duree * 1000;

        if(match.end) {
            match.ownScore = 1;
            match.oppScore = 0;
            match.possessionData = [100,200];
            match.matchEvents = [
                {
                    badgeClass: 'info',
                    badgeIconClass: 'fa-play',
                    side: 'left',
                    title: 'Début du match - 00:00'
                },
                {
                    badgeClass: 'danger',
                    badgeIconClass: 'fa-futbol-o',
                    side: 'right',
                    title: 'But du PSG - 23:00'
                },
                {
                    badgeClass: 'info',
                    badgeIconClass: 'fa-pause',
                    side: 'left',
                    title: 'Mi-temps - 45:00'
                },
                {
                    badgeClass: 'info',
                    badgeIconClass: 'fa-stop',
                    side: 'left',
                    title: 'Fin du match - 90:00'
                }
            ];
        }

        return match;
    };

    const teams = [{
        "_id": "PSG",
        name: 'Paris Saint Germain',
        "formation": [
            {"column": [ {disabled: "true"},{disabled: "true"},{field: "GK",playerId : "psgJ1"},{disabled: "true"},{disabled: "true"}]},
            {"column" : [{field: "L_B"},{field: "LC_B",playerId : "psgJ2"},{field: "C_B",playerId : "psgJ3"},{field: "RC_B"},{field: "R_B"}]},
            {"column" : [{field: "L_DM"},{field: "LC_DM",playerId : "psgJ4"},{field: "C_DM",playerId : "psgJ5"},{field: "RC_DM",playerId : "psgJ6"},{field: "R_DM"}]},
            {"column" : [{field: "L_M"},{field: "LC_M",playerId : "psgJ12"},{field: "C_M",playerId : "psgJ7"},{field: "RC_M"},{field: "R_M"}]},
            {"column" : [{field: "L_AM"},{field: "LC_AM"},{field: "C_AM",playerId : "psgJ8"},{field: "RC_AM",playerId : "psgJ9"},{field: "R_AM"}]},
            {"column" :[{disabled: "true"},{field: "LC_F"},{field: "C_F",playerId : "psgJ11"},{field: "RC_F"},{disabled: "true"}]},
            {"column" :[{disabled: "true"},{disabled: "true"},{disabled: "true"},{disabled: "true"},{disabled: "true"}]}
        ],
        "followedEvent": "psgevt2",
        "formationName" : "Formation trident",
        "Events": [
            match('psgevt1', yesterday, 92*60),
            match('psgevt2', today),
            {
                "_id":"psgevt3",
                'title': 'Renard & Rock - Remise en forme',
                "type": "session",
                "date": new Date().getTime(),
                "city":"Paris",
                "location": "Parc des princes",
                "duration": 7200,
                "invitedPlayers": [
                    {
                        "player": "psgJ1",
                        "confirmed": 'will'
                    },
                    {
                        "player": "psgJ2",
                        "confirmed": 'will'
                    },
                    {
                        "player": "psgJ3",
                        "confirmed": 'will'
                    },
                    {
                        "player": "psgJ4",
                        "confirmed": 'will'
                    },
                    {
                        "player": "psgJ5",
                        "confirmed": 'will'
                    },
                    {
                        "player": "psgJ6",
                        "confirmed": 'will'
                    },
                    {
                        "player": "psgJ7",
                        "confirmed": 'will'
                    },
                    {
                        "player": "psgJ8",
                        "confirmed": 'will'
                    },
                    {
                        "player": "psgJ9",
                        "confirmed": 'will'
                    },
                    {
                        "player": "psgJ10",
                        "confirmed": 'will'
                    },
                    {
                        "player": "psgJ11",
                        "confirmed": 'will'
                    }
                ],
                "Trainings": [
                    {_id: "trnPsg1_0", ext_id:"trnPsg1", name: "Renard - Facile", time:0, breakTime:0, Exercises: [{name: "Squat", nb_series:3, repetition: 25},{name: "Jumping Jack", nb_series:3, repetition: 50},{name: "Moutain Climbing",nb_series:3, repetition: 30}]},
                    {_id: "trnPsg2_1", ext_id:"trnPsg2", name: "Rock - Moyenne", time:0, breakTime:0, Exercises: [{name: "Tractions", nb_series:3, repetition: 25},{name: "Conduite de balle", nb_series:3, repetition: 10},{name: "Moutain Climbing",nb_series:3, repetition: 30}]}
                ],
                status:"Nouveau"
            }
        ],
        "Players": [
            {
                "_id": "psgJ1",
                "firstname": "Colin",
                "lastname": "Auberger",
                "condition": "",
                "condition_type": "good",
                "post" : "C_GK",
                "Stats": [
                    {name: "speed", value: 30},
                    {name: "control", value: 40},
                    {name: "teamwork", value: 50},
                    {name: "attack", value: 60},
                    {name: "defense", value: 70}
                ],
                "isDisabled": false
            },
            {
                "_id": "psgJ2",
                "firstname": "Baptiste",
                "lastname": "Lesiourd",
                "condition": "",
                "condition_type": "good",
                "post" : "L_B",
                "Stats": [
                    {name: "speed", value: 30},
                    {name: "control", value: 40},
                    {name: "teamwork", value: 50},
                    {name: "attack", value: 60},
                    {name: "defense", value: 70}
                ],
                "isDisabled": false
            },
            {
                "_id": "psgJ3",
                "firstname": "Symoran",
                "lastname": "Trem",
                "condition": "",
                "condition_type": "good",
                "post" : "R_B",
                "Stats": [
                    {name: "speed", value: 30},
                    {name: "control", value: 40},
                    {name: "teamwork", value: 50},
                    {name: "attack", value: 60},
                    {name: "defense", value: 70}
                ],
                "isDisabled": false
            },
            {
                "_id": "psgJ4",
                "firstname": "Olivier",
                "lastname": "Zhou",
                "condition": "",
                "condition_type": "good",
                "post" : "R_B",
                "Stats": [
                    {name: "speed", value: 30},
                    {name: "control", value: 40},
                    {name: "teamwork", value: 50},
                    {name: "attack", value: 60},
                    {name: "defense", value: 70}
                ],
                "isDisabled": false
            },
            {
                "_id": "psgJ5",
                "firstname": "Nico",
                "lastname": "Laborie",
                "condition": "",
                "condition_type": "good",
                "post" : "R_B",
                "Stats": [
                    {name: "speed", value: 30},
                    {name: "control", value: 40},
                    {name: "teamwork", value: 50},
                    {name: "attack", value: 60},
                    {name: "defense", value: 70}
                ],
                "isDisabled": false
            },
            {
                "_id": "psgJ6",
                "firstname": "Pierre",
                "lastname": "Quiroul",
                "condition": "",
                "condition_type": "good",
                "post" : "R_B",
                "Stats": [
                    {name: "speed", value: 30},
                    {name: "control", value: 40},
                    {name: "teamwork", value: 50},
                    {name: "attack", value: 60},
                    {name: "defense", value: 70}
                ],
                "isDisabled": false
            },
            {
                "_id": "psgJ7",
                "firstname": "Nico",
                "lastname": "Pala",
                "condition": "",
                "condition_type": "good",
                "post" : "R_B",
                "Stats": [
                    {name: "speed", value: 30},
                    {name: "control", value: 40},
                    {name: "teamwork", value: 50},
                    {name: "attack", value: 60},
                    {name: "defense", value: 70}
                ],
                "isDisabled": false
            },
            {
                "_id": "psgJ8",
                "firstname": "Baptiste",
                "lastname": "Lemuet",
                "condition": "",
                "condition_type": "good",
                "post" : "R_B",
                "Stats": [
                    {name: "speed", value: 30},
                    {name: "control", value: 40},
                    {name: "teamwork", value: 50},
                    {name: "attack", value: 60},
                    {name: "defense", value: 70}
                ],
                "isDisabled": false
            },
            {
                "_id": "psgJ9",
                "firstname": "Symo",
                "lastname": "Pamaran",
                "condition": "",
                "condition_type": "good",
                "post" : "R_B",
                "Stats": [
                    {name: "speed", value: 30},
                    {name: "control", value: 40},
                    {name: "teamwork", value: 50},
                    {name: "attack", value: 60},
                    {name: "defense", value: 70}
                ],
                "isDisabled": false
            },
            {
                "_id": "psgJ10",
                "firstname": "Olivier",
                "lastname": "Aquarium",
                "condition": "",
                "condition_type": "good",
                "post" : "R_B",
                "Stats": [
                    {name: "speed", value: 30},
                    {name: "control", value: 40},
                    {name: "teamwork", value: 50},
                    {name: "attack", value: 60},
                    {name: "defense", value: 70}
                ],
                "isDisabled": false
            },
            {
                "_id": "psgJ11",
                "firstname": "Colin",
                "lastname": "Bamouton",
                "condition": "",
                "condition_type": "good",
                "post" : "R_B",
                "Stats": [
                    {name: "speed", value: 30},
                    {name: "control", value: 40},
                    {name: "teamwork", value: 50},
                    {name: "attack", value: 60},
                    {name: "defense", value: 70}
                ],
                "isDisabled": false
            },
            {
                "_id": "psgJ12",
                "firstname": "Elicodaire",
                "lastname": "Socoman",
                "condition": "Une semaine de repos",
                "condition_type": "good",
                "post" : "R_M",
                "Stats": [
                    {name: "speed", value: 30},
                    {name: "control", value: 40},
                    {name: "teamwork", value: 50},
                    {name: "attack", value: 60},
                    {name: "defense", value: 70}
                ],
                "isDisabled": false
            },
            {
                "_id": "psgJ13",
                "firstname": "Dodo",
                "lastname": "Zzz",
                "condition": "Une semaine de repos",
                "condition_type": "good",
                "post" : "R_M",
                "Stats": [
                    {name: "speed", value: 30},
                    {name: "control", value: 40},
                    {name: "teamwork", value: 50},
                    {name: "attack", value: 60},
                    {name: "defense", value: 70}
                ],
                "isDisabled": false
            },
            {
                "_id": "psgJ14",
                "firstname": "Coucou",
                "lastname": "Hello",
                "condition": "Une semaine de repos",
                "condition_type": "good",
                "post" : "RC_DM",
                "Stats": [
                    {name: "speed", value: 30},
                    {name: "control", value: 40},
                    {name: "teamwork", value: 50},
                    {name: "attack", value: 60},
                    {name: "defense", value: 70}
                ],
                "isDisabled": false
            }
        ],
        "Trainings": [
            {
                "_id": "trnPsg1",
                "name": "Renard",
                "type": "Vitesse",
                "difficulty": "Facile",
                "Exercises": [
                    {name: "Squat", nb_series:3, repetition: 25},
                    {name: "Jumping Jack", nb_series:3, repetition: 50},
                    {name: "Moutain Climbing",nb_series:3, repetition: 30}
                ]
            },
            {
                "_id": "trnPsg2",
                "name": "Rock",
                "type": "Défense",
                "difficulty": "Moyenne",
                "Exercises": [
                    {name: "Tractions", nb_series:3, repetition: 25},
                    {name: "Conduite de balle", nb_series:3, repetition: 10},
                    {name: "Moutain Climbing",nb_series:3, repetition: 30}
                ]
            },
            {
                "_id": "trnPsg3",
                "name": "All for One",
                "type": "Teamwork",
                "difficulty": "Difficile",
                "Exercises": [
                    {name: "Squat", nb_series:3, repetition: 25},
                    {name: "Jumping Jack", nb_series:3, repetition: 50},
                    {name: "Moutain Climbing",nb_series:3, repetition: 30}
                ]
            }
        ]
    }];

    if (overrideData || Teams.find().count() === 0)
        teams.forEach((team) => {
            Teams.insert(team)
        });
});