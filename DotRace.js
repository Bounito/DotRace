
function getScoreColor(score,opacity) {
    // Limiter le score entre 0 et 10
    score = Math.max(0, Math.min(10, score));

    let r, g, b;

    if (score === 10) {
        // Vert pur pour un score de 10
        r = 0;
        g = 255;
        b = 0;
    } else if (score >= 1) {
        // Transition du jaune à l'orange (score 6 à 1)
        const proportion = (6 - score) / 6; // 6 à 0 sur une plage de 6
        r = 255;                              // Rouge constant
        g = Math.round(255 * (1 - proportion)); // Du jaune (255) à l'orange (valeur plus basse)
        b = 0;                                 // Pas de bleu
    } else {
        // Score de 0
        r = 200;
        g = 150;
        b = 150;
    }

    // Retourner la couleur RGB
    return `rgba(${r}, ${g}, ${b},${opacity})`;
}


function valueToColor(value) {
    // Normaliser la valeur entre -1 et 1
    const maxValue = Math.sqrt(2);
    value = value / maxValue;

    // Clamp la valeur entre -1 et 1
    value = Math.max(-1, Math.min(1, value));

    let r, g, b;

    if (value < 0) {
        // Interpolation entre vert (-1) et jaune (0)
        r = Math.round(255 * (1 + value)); // De 0 à 255
        g = 255;
        b = 0;
    } else {
        // Interpolation entre jaune (0) et rouge (1)
        r = 255;
        g = Math.round(255 * (1 - value)); // De 255 à 0
        b = 0;
    }

    // Retourner la couleur sous forme hexadécimale
    return `rgb(${r}, ${g}, ${b})`;
}



function valueToColorGradient(value) {
    // Clamp la valeur entre 0 et 10
    value = Math.max(0, Math.min(10, value));
    
    let r, g;

    if (value <= 5) {
        // Interpolation du vert (0) au jaune (5)
        r = Math.round(255 * (value / 5)); // De 0 à 255
        g = 255; // Toujours vert
    } else {
        // Interpolation du jaune (5) au rouge (10)
        r = 255; // Toujours rouge
        g = Math.round(255 * (1 - (value - 5) / 5)); // De 255 à 0
    }

    // Retourner la couleur sous forme hexadécimale
    return `rgb(${r}, ${g}, 0)`; // Le bleu reste à 0 pour toute la gamme
}



function fctRbg2Rgba(color, transparency) {
    // Vérifie si la couleur est déjà au format RGBA
    const rgbaMatch = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d*\.?\d+))?\)$/i);
    
    if (rgbaMatch) {
        // Extraire les composantes RGBA (A sera undefined si c'est un RGB sans alpha)
        const [_, r, g, b] = rgbaMatch;
        return `rgba(${r}, ${g}, ${b}, ${transparency})`;
    }

    // Sinon, traiter comme un format RGB
    const rgbMatch = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/i);
    
    if (rgbMatch) {
        const [_, r, g, b] = rgbMatch;
        return `rgba(${r}, ${g}, ${b}, ${transparency})`;
    }

    throw new Error("Format de couleur RGB ou RGBA invalide");
}



function generateColorFromIaDepth(iaDepth,playerId,totalPlayers) {
    let r, g, b;
    let coef = parseInt(playerId*(100/totalPlayers));
    switch (parseInt(iaDepth)) {
        case 2 :
            //Purple
            r = 150+coef;
            g = 0;
            b = 150+coef;
            break;
        case 3 :
            //Blue
            r = 0;
            g = 0;
            b = 150+coef;
            break;
        case 4 :
            //Cyan
            r = 0;
            g = 100+coef;
            b = 100+coef;
            break;
        case 5 :
            //Green
            r = 0;
            g = 150+coef;
            b = 0;
            break;
        case 6 :
            // Yellow
            r = 120+coef;
            g = 120+coef;
            b = 0;
            break;
        case 7 :
            //Orange
            r = 150+coef;
            g = 75+coef;
            b = 0;
            break;
        default :
            //Red
            r = 150+coef;
            g = 0;
            b = 0;
            break; 
    }
   
    return `rgb(${r}, ${g}, ${b})`;
}


function generateDarkColors(numPlayers) {
    const colors = [];
    const goldenRatioConjugate = 0.618033988749895; // Pour une distribution uniforme des teintes
    let hue = Math.random(); // Démarrage aléatoire pour plus de variation
    
    for (let i = 0; i < numPlayers; i++) {
        hue += goldenRatioConjugate; // Incrémenter le hue par le golden ratio pour éviter les répétitions
        hue %= 1; // Assurer que hue reste entre 0 et 1
        
        const saturation = 0.6; // 60% de saturation (modifiable)
        const lightness = 0.4;  // 40% de luminosité (modifiable)
        
        const color = hslToRgb(hue, saturation, lightness);
        colors.push(`rgb(${color.r}, ${color.g}, ${color.b})`);
    }
    
    return colors;
}

// Fonction utilitaire pour convertir HSL en RGB
function hslToRgb(h, s, l) {
    let r, g, b;
    
    if (s == 0) {
        r = g = b = l; // Cas de gris
    } else {
        function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }
        
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    
    return { 
        r: Math.round(r * 255), 
        g: Math.round(g * 255), 
        b: Math.round(b * 255)
    };
}


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Index aléatoire entre 0 et i
        [array[i], array[j]] = [array[j], array[i]]; // Échanger les éléments
    }
    return array;
}


function fctEmojiPodium(ranking) {
    let emoji='';
    switch (ranking) {
        case 1 :
            emoji='🥇';
            break;
        case 2 :
            emoji='🥈';
            break;
        case 3 :
            emoji='🥉';
            break;
    }
    return emoji;
}




//=====================================================================
//                        DOM chargé
//=====================================================================
document.addEventListener('DOMContentLoaded', () => {

    console.info("== DOM chargé ==");

    window.onbeforeunload = function() {
        return "🙄 Leave now?";
    };
    // Utilise getComputedStyle pour obtenir la variable CSS
    const rootStyle = getComputedStyle(document.documentElement);
    let cellSize = parseInt(rootStyle.getPropertyValue('--cellSize'));
    let cellNbX = parseInt(rootStyle.getPropertyValue('--cellNbX'));
    let cellNbY = parseInt(rootStyle.getPropertyValue('--cellNbY'));

    console.info('cellSize', cellSize);

    const divRibbon = document.getElementById('divRibbon');
    const grid = document.getElementById('divGrid');

    const svgFond = document.getElementById('svgFond');
    const svgMask = document.getElementById('svgMask');
    
    const divScore = document.getElementById('divScore');
    const divRanking = document.getElementById('divRanking');
    const divRankLoading = document.getElementById('divRankLoading');
    
    const divBest = document.getElementById('divBest');
    
    const divSpeed = document.getElementById('divSpeed');

    // ZOOM
    const divZoomLook = document.getElementById('divZoomLook');
    const zoomIn = document.getElementById('zoomIn');
    const zoomOut = document.getElementById('zoomOut');
    const divZoomOptions = document.getElementById('divZoomOptions');
    const divZoomOptionsContainer = document.getElementById('divZoomOptionsContainer');
    const divSoundContainer = document.getElementById('divSoundContainer');
    const divFullScreen = document.getElementById('divFullScreen');
    const divFullScreenOnMenu = document.getElementById('divFullScreenOnMenu');
    const divCenterPos = document.getElementById('divCenterPos');
    const divCenterZoom = document.getElementById('divCenterZoom');
    const divCenter = document.getElementById('divCenter');

    const chkFollowPoint = document.getElementById('chkFollowPoint');
    const chkFollowIa = document.getElementById('chkFollowIa');
    const chkShowTrace = document.getElementById('chkShowTrace');
    
    const divCadreZoom = document.getElementById('divCadreZoom');
    const divCadreZoom2 = document.getElementById('divCadreZoom2');

    const divNextLine = document.getElementById('divNextLine');
    const divNextPoint = document.getElementById('divNextPoint');
    const divTitleTrackName = document.getElementById('divTitleTrackName');
    

    const divMenuBtn = document.getElementById('divMenuBtn');
    const divMenuContainer = document.getElementById('divMenuContainer');
    
    const btnCfgTracks = document.getElementById('btnCfgTracks');
    const btnCfgTracksLabel = document.getElementById('btnCfgTracksLabel');
    const btnCfgTracksPng = document.getElementById('btnCfgTracksPng');

    const btnCfgPlayers = document.getElementById('btnCfgPlayers');

    const divMenuMainTracks = document.getElementById('divMenuMainTracks');
    const divMenuMainPlayers = document.getElementById('divMenuMainPlayers');  
    
    const rangeGTturnAngleMin = document.getElementById('rangeGTturnAngleMin');
    const rangeGTturnAngleMax = document.getElementById('rangeGTturnAngleMax');
    const rangeGTtrackWidthMin = document.getElementById('rangeGTtrackWidthMin');
    const rangeGTtrackWidthMax = document.getElementById('rangeGTtrackWidthMax');
    const rangeGTtrackLengthMin = document.getElementById('rangeGTtrackLengthMin');
    const rangeGTtrackLengthMax = document.getElementById('rangeGTtrackLengthMax');
    const rangeGTsectionLengthMin = document.getElementById('rangeGTsectionLengthMin');
    const rangeGTsectionLengthMax = document.getElementById('rangeGTsectionLengthMax');
    const rangeGTsectionGap = document.getElementById('rangeGTsectionGap');
    

    const labelRangeNbPlayers = document.getElementById('labelRangeNbPlayers');
    const rangeNbPlayers = document.getElementById('rangeNbPlayers');
    rangeNbPlayers.addEventListener('input', function() {
        labelRangeNbPlayers.innerHTML = 'Nb Players: '+rangeNbPlayers.value+ ' ('+rangeNbPlayers.max+' max)';
        fctInitPlayers();
    });
    const rangeNbHuman = document.getElementById('rangeNbHuman');
    rangeNbHuman.addEventListener('input', function() {
        fctInitPlayers();
    });

    const rangeIaDepth = document.getElementById('rangeIaDepth');
    rangeIaDepth.addEventListener('input', function() {
        document.getElementById('labelIaDepth').innerHTML='👨 Human tips depth '+rangeIaDepth.value;
        fctInitPlayers();
    });
    const rangeIaDepthMin = document.getElementById('rangeIaDepthMin');
    rangeIaDepthMin.addEventListener('input', function() {
        fctInitPlayers();
    });
    const rangeIaDepthMax = document.getElementById('rangeIaDepthMax');
    rangeIaDepthMax.addEventListener('input', function() {
        fctInitPlayers();
    });
    const rangeIaAggress = document.getElementById('rangeIaAggress');
    rangeIaAggress.addEventListener('input', function() {
        document.getElementById('labelIaAggress').innerHTML='Ia Aggressivity 🤪 '+rangeIaAggress.value;
    });

    const rangeNbRaces = document.getElementById('rangeNbRaces');
    rangeNbRaces.addEventListener('input', function() {
        if (gameMode=='modeChamp') {
            fctInitChampTracks();
            fctMajMenu();
        }
    });

    const divCadrePlayersList = document.getElementById('divCadrePlayersList');    

    const checkTipBest = document.getElementById('checkTipBest');
    const checkTipTarget = document.getElementById('checkTipTarget');
    const checkTipLoose = document.getElementById('checkTipLoose');

    const rangeIaTimer = document.getElementById('rangeIaTimer');
    const rangeZoomScale = document.getElementById('rangeZoomScale');
    const rangeZoomElan = document.getElementById('rangeZoomElan');    

    const divTracksBoutons = document.getElementById('divTracksBoutons');


    const btnTrackLeft = document.getElementById('btnTrackLeft');
    const btnTrackRight = document.getElementById('btnTrackRight');

    const trackPreview = document.getElementById('trackPreview');
    const btnRace = document.getElementById('btnRace');
    const btnTestIa = document.getElementById('btnTestIa');
    const btnReverseTrack = document.getElementById('btnReverseTrack');

    const divMenuChampionDetail = document.getElementById('divMenuChampionDetail');
    const divMenuChampionTracksContainer = document.getElementById('divMenuChampionTracksContainer');
    const divMenuChampionTracks = document.getElementById('divMenuChampionTracks');

    const divTrackName = document.getElementById('divTrackName');
    const divTrackSize = document.getElementById('divTrackSize');
    const divTrackMxPl = document.getElementById('divTrackMxPl');

    const divTrackRecord = document.getElementById('divTrackRecord');    

    // SOUND
    const chkSoundPosition = document.getElementById('chkSoundPosition');

    //Pause   
    const divPauseContainer = document.getElementById('divPauseContainer');
    const divPauseTitle = document.getElementById('divPauseTitle');    
    const btnPauseRestart = document.getElementById('btnPauseRestart');   
    const btnPauseMenu = document.getElementById('btnPauseMenu'); 
    const btnPauseClose = document.getElementById('btnPauseClose'); 
    

    //Finish   
    const divFinishContainer = document.getElementById('divFinishContainer');
    const divFinishResult = document.getElementById('divFinishResult');    
    const btnFinishRestart = document.getElementById('btnFinishRestart');
    const btnFinishNext = document.getElementById('btnFinishNext');
    const btnFinishMenu = document.getElementById('btnFinishMenu');    
    const btnFinishReverse = document.getElementById('btnFinishReverse');
    const btnFinishClose = document.getElementById('btnFinishClose'); 
    
    const divFinishRanking = document.getElementById('divFinishRanking');
    

    // Sélectionne tous les boutons à l'intérieur de la div numpad
    const numpad = document.getElementById('numpad');
    const buttons = document.querySelectorAll('#numpad button');
    const divButtons = document.querySelectorAll('#numpad div');

    // Variables Circuit
    let buildinTracks = tracks;
    let currentTrack = [];
    let startPoints = [];
    let finishPoints = [];
    let gameMode = 'modeChamp'; // Best - Race - Champion
    let trackMode = 'trackModeRandom';
    let isPaused = false;
    let winMessageHuman ='';
    let winMessageIa ='';
    let tracksBestScores = [];
    let tracksIaScores = [];
    let finishMessage ='';
    let BestIaPlayerId;
    // Variables Système
    let letSoundMode = 'Car'; // '' 'Mute' 'Car'
    let scale = 1;
    // Variables Players
    let NbPlayers = 6;
    let CurrentPlayer = 0;
    let players = [
        { color: "#00008B",path: [] ,record:999,status:"RUN"}
    ];
    // Variables temp
    let tmpPos = { x: 0, y: 0 };
    let tmpElan = { x: 0, y: 0 };

    //Ecarts du numpad
    const delta = {
        1: { x: -1, y: -1 }, // 1
        2: { x: 0, y: -1 },  // 2
        3: { x: 1, y: -1 },  // 3
        4: { x: -1, y: 0 },  // 4
        5: { x: 0, y: 0 },   // 5
        6: { x: 1, y: 0 },   // 6
        7: { x: -1, y: 1 },  // 7
        8: { x: 0, y: 1 },   // 8
        9: { x: 1, y: 1 }    // 9
    };
    let champResults = [];
    let champRaceIndex = 0;
    let champTracks = [];
    let playersNames = [
        'Axel Accel',
        'Ben Burn',
        'Ben Blast',
        'Cliff Clutch',
        'Charly Chase',
        'Dave Drift',
        'Dan Drag',
        'Eva Engine',
        'Frank Fast',
        'Fred Fuel',
        'Greg Grip',
        'Gab Gear',
        'Henry Hurry',
        'Ian Ignite',
        'Jess Jet',
        'Kevin Kick',
        'Leo Light',
        'Mike Moto',
        'Nick Nitro',
        'Oscar Over',
        'Paul Pace',
        'Quin Quick',
        'Ryan Race',
        'Sam Speed',
        'Tom Turbo',
        'Ulys Uturn',
        'Vic Vroom',
        'Will Whip',
        'Xena Xenon',
        'Yuri Yow',
        'Zack Zip'
    ];
    // ====================================================================
    // ====================================================================
    // ===============================   Main
    // ====================================================================
    // ====================================================================
    fctInitPlayers();
    generateTrackButtons();



    // ====================================================================
    // ====================================================================
    //                        Fonction pour Loading
    // ====================================================================
    // ====================================================================
    // Afficher l'écran de chargement
    function showLoadingScreen() {
        document.getElementById('loadingScreen').style.display = 'flex';
    }
    // Masquer l'écran de chargement
    function hideLoadingScreen() {
        document.getElementById('loadingScreen').style.display = 'none';
    }
    showLoadingScreen();
    // chargement initial
    window.addEventListener('load', function() {
        // Masquer l'écran de chargement après 2 secondes (simulation de chargement)
        setTimeout(hideLoadingScreen, 500);
    });

    // Afficher Spinner
    function spinnerShow() {
        document.getElementById('loadingSpin').style.display = 'flex';
    }
    function spinnerHide() {
        document.getElementById('loadingSpin').style.display = 'none';
    }
    // ====================================================================
    // ====================================================================
    // ====================================================================
    //                        Fonction pour Players
    // ====================================================================
    // ====================================================================
    // ====================================================================
    function pPos() {
        if (players[CurrentPlayer].path.length > 0) {
            return pPosIndex(players[CurrentPlayer].path.length - 1);
        } else {
            console.error("plPos player",CurrentPlayer," : Le chemin est vide.");
            return {x:0,y:0};
        }
    };
    function pPosIndex(pathIndex) {
        if (players[CurrentPlayer].path.length > 0) {
            return players[CurrentPlayer].path[pathIndex];
        } else {
            console.error("Le chemin est vide.");
            return {x:0,y:0};
        }
    };
    function pPlayerPos(playerId) {
        if (players[playerId].path.length > 0) {
            return pPlayerPosIndex(playerId,players[playerId].path.length - 1);
        } else {
            console.error("plPos player",playerId," : Le chemin est vide.");
            return {x:0,y:0};
        }
    };
    function pPlayerPosIndex(playerId,pathIndex) {
        if (players[playerId].path.length > 0) {
            return players[playerId].path[pathIndex];
        } else {
            console.error("Le chemin est vide.");
            return {x:0,y:0};
        }
    };
    function pElan() {
        if (players[CurrentPlayer].path.length > 1) {
            tmpElan.x = pPosIndex(players[CurrentPlayer].path.length - 1).x - pPosIndex(players[CurrentPlayer].path.length - 2).x;
            tmpElan.y = pPosIndex(players[CurrentPlayer].path.length - 1).y - pPosIndex(players[CurrentPlayer].path.length - 2).y;
            return tmpElan;
        } else {
            //console.info("pElan : chemin trop court.");
            return {x:0,y:0};
        }
    };
    function pElanIndex(index=2) {
        if (players[CurrentPlayer].path.length > 2) {
            tmpElan.x = pPosIndex(players[CurrentPlayer].path.length - (index-1)).x - pPosIndex(players[CurrentPlayer].path.length - index).x;
            tmpElan.y = pPosIndex(players[CurrentPlayer].path.length - (index-1)).y - pPosIndex(players[CurrentPlayer].path.length - index).y;
            return tmpElan;
        } else {
            //console.info("pElan : chemin trop court.");
            return {x:0,y:0};
        }
    };
    // ====================================================================
    // ====================================================================
    // ==================================================================== 
    function fctInitPlayers() {
        NbPlayers = rangeNbPlayers.value;
        shuffleArray(playersNames);
        btnCfgPlayers.innerHTML = '⚙ Config Players 👥<br><br>';
        divRanking.innerHTML = '';
        divFinishRanking.innerHTML = '';
        players = [];
        let html = '';        
        let nivMin = document.getElementById('rangeIaDepthMin').value;
        let nivMax = document.getElementById('rangeIaDepthMax').value;
        if (nivMin>nivMax) {
            nivMax = nivMin;
            document.getElementById('rangeIaDepthMax').value = nivMax;
        }
        //========================================================
        //container TITLE
        const divFinishRankContainer = document.createElement('div');
        divFinishRankContainer.classList.add('divFinishRankContainer');
        divFinishRankContainer.style.top = '10px';
        divFinishRanking.appendChild(divFinishRankContainer);
        //div Rank
        const divFinishRankNb = document.createElement('div');
        divFinishRankNb.style.width = '80px';
        divFinishRankNb.innerHTML = 'Rank';
        divFinishRankContainer.appendChild(divFinishRankNb);
        //div player
        const divFinishRankPlayer = document.createElement('div');
        //divFinishRankPlayer.style.backgroundColor = myColor;
        divFinishRankPlayer.style.width = '120px';
        divFinishRankPlayer.style.borderRadius = '10px';
        divFinishRankPlayer.innerHTML = 'Players';
        divFinishRankContainer.appendChild(divFinishRankPlayer);
        //div Total
        const divFinishRankTotal = document.createElement('div');
        divFinishRankTotal.style.width = '80px';
        divFinishRankTotal.innerHTML = 'Total';
        divFinishRankContainer.appendChild(divFinishRankTotal);
        //div racesScores
        const divFinishRankScores = document.createElement('div');
        divFinishRankScores.id='divFinishRankScoresTitle';
        divFinishRankScores.style.display = 'flex';
        divFinishRankScores.style.justifyContent = 'space-between';
        divFinishRankScores.style.alignItems = 'flex-start';
        divFinishRankContainer.appendChild(divFinishRankScores);

        divFinishRanking.style.height = (40+NbPlayers*40)+'px';
        
        //===================================
        let nivCurrent = nivMin;
        for (let i = 0; i < NbPlayers; i++) {
            //let myIaDepth = Math.floor(Math.random() * 4)+3;
            nivCurrent++;
            if (nivCurrent>nivMax) {
                nivCurrent = nivMin;
            }
            let myIaDepth = nivCurrent;
            if (i<rangeNbHuman.value) {
                myIaDepth = rangeIaDepth.value;
            }
            let myColor = generateColorFromIaDepth(myIaDepth,i,NbPlayers);
            players.push({name:playersNames[i], color:myColor, path: [], dist:0, tracePoints: [],iaDepth:myIaDepth,raceRanking:0, champRanking:0, status:"RUN"});

            //======================================================== Visu dans Configuration
            html += '<br><span  class="classPlayerSpan" style="background-color:'+myColor+';"><small><b>'+myIaDepth+'</b>💡</small> ' + playersNames[i]+"</span>";
            if (i<rangeNbHuman.value) {
                html += ' 👨';
            }
            //======================================================== Classement en haut à droite
            const divPlayer = document.createElement('div');
            divPlayer.id='divRank'+i;
            divPlayer.classList.add('classPlayerRanking');
            divPlayer.style.backgroundColor = fctRbg2Rgba(myColor,.8);
            divPlayer.style.top = (i*20)+'px';
            divPlayer.innerHTML = playersNames[i].split(" ").pop();
            if (i<rangeNbHuman.value) {
                divPlayer.innerHTML += ' 👨';
                btnCfgPlayers.innerHTML += '<span  class="classPlayerSpan" style="background-color:'+myColor+';"><b>'+myIaDepth+'</b>💡 ' + playersNames[i]+'</span>👨';
            }
            divRanking.appendChild(divPlayer);
            //======================================================== Classement Final
            //container
            const divFinishRankContainer = document.createElement('div');
            divFinishRankContainer.id='divFinishRankContainer'+i;
            divFinishRankContainer.classList.add('divFinishRankContainer');
            divFinishRankContainer.style.top = (50+i*40)+'px';
            divFinishRanking.appendChild(divFinishRankContainer);
            //div Rank
            const divFinishRankNb = document.createElement('div');
            divFinishRankNb.id='divFinishRankNb'+i;
            divFinishRankNb.style.width = '80px';
            divFinishRankContainer.appendChild(divFinishRankNb);
            //div player
            const divFinishRankPlayer = document.createElement('div');
            divFinishRankPlayer.id='divFinishRankPlayer'+i;
            //divFinishRankPlayer.classList.add('classPlayerRanking');
            divFinishRankPlayer.style.backgroundColor = myColor;
            divFinishRankPlayer.style.width = '120px';
            divFinishRankPlayer.style.borderRadius = '10px';
            divFinishRankPlayer.innerHTML = '<small><b>'+myIaDepth+'</b>💡</small> ' + playersNames[i];
            if (i<rangeNbHuman.value) {
                divFinishRankPlayer.innerHTML += ' 👨';
            }
            divFinishRankContainer.appendChild(divFinishRankPlayer);
            //div Total
            const divFinishRankTotal = document.createElement('div');
            divFinishRankTotal.id='divFinishRankTotal'+i;
            divFinishRankTotal.style.width = '80px';
            divFinishRankContainer.appendChild(divFinishRankTotal);
            //div racesScores
            const divFinishRankScores = document.createElement('div');
            divFinishRankScores.id='divFinishRankScores'+i;
            divFinishRankScores.style.display = 'flex';
            divFinishRankScores.style.justifyContent = 'space-between';
            divFinishRankScores.style.alignItems = 'flex-start';
            divFinishRankContainer.appendChild(divFinishRankScores);
        }
        divCadrePlayersList.innerHTML = html;
        console.log('fctInitPlayers',players);
        btnCfgPlayers.innerHTML += ' + '+(rangeNbPlayers.value-rangeNbHuman.value)+' 🤖';
    }
    // ====================================================================
    // ====================================================================
    // ====================================================================
    function fctAddPointOnPath(newPoint,playerId = CurrentPlayer) {
        //console.info('player',playerId,'new point',newPoint,players[playerId].path.length);

        //Ajout dans les variables
        players[playerId].path.push(newPoint);
        //console.info('player',playerId,'players[playerId]',players[playerId],players[playerId].path.length);
        //nouvelle ligne (si pas le premier point...)
        if (players[playerId].path.length>1) {
            const divOldPoint = document.getElementById('pl'+playerId+'-pt'+(players[playerId].path.length-1));
            divOldPoint.style.opacity = .1;
            let line = document.createElement('div');
            line.id = 'pl'+playerId+"-line"+(players[playerId].path.length);
            line.classList.add('line');
            // Calculer la position de départ et d'arrivée
            const start = pPosIndex(players[playerId].path.length - 2);
            const end = pPosIndex(players[playerId].path.length - 1);
            const startX = start.x * cellSize;
            const startY = start.y * cellSize;
            const endX = end.x * cellSize;
            const endY = end.y * cellSize;
            // Calculer la longueur de la ligne
            const length = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
            line.style.height = `${length}px`;
            // Calculer l'angle de rotation
            const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI)-90; // Convertir en degrés
            line.style.transformOrigin = '0 0'; // Origine pour rotation
            line.style.transform = `translate(${startX}px, ${startY}px) rotate(${angle}deg)`;
            // Couleur
            line.style.backgroundColor = players[playerId].color;
            grid.insertBefore(line, divCadreZoom);

            //Ajout de la length
            players[playerId].dist += length;

            //Purge
            players[playerId].tracePoints = [];
            //Ajout des Points Interdits
            let width = 10;
            if (players[playerId].path.length>5) { 
                let maxPathLength = Math.min(players[playerId].path.length,20);
                let lastPoint = 5;
                if (parseInt(length)<40) {
                    lastPoint = 7;
                }
                if (parseInt(length)>60) {
                    lastPoint = 4;
                }
                if (parseInt(length)>100) {
                    lastPoint = 2;
                }
                //console.log('👣 length',length,parseInt(length),'maxPathLength',maxPathLength,'lastPoint',lastPoint);
                for (let p=-maxPathLength;p<=-lastPoint;p++) { // Trace sur les derniers points seulement
                    const monTracePoint = pPosIndex(players[playerId].path.length + p);
                    for (let w = -width; w <= width; w++) {
                        for (let h = -width; h <= width; h++) {
                            
                            if (Math.sqrt(w * w + h * h) <= width-5) { //Points dans le cercle
                                const newTracePoint = {x:monTracePoint.x + w, y:monTracePoint.y + h};
                                if (fctCaseLibre(newTracePoint,false)) {                               
                                    let alreadyExists = false;
                                    // Vérifie si le point n'existe pas déjà dans tracePoints
                                    if (players[playerId].tracePoints) {
                                        alreadyExists = players[playerId].tracePoints.some(point =>
                                            point.x === newTracePoint.x && point.y === newTracePoint.y
                                        );
                                    }
                                    // Ajoute le point uniquement s'il n'existe pas déjà
                                    if (!alreadyExists) {
                                        players[playerId].tracePoints.push(newTracePoint);
                                    }
                                }
                            }
                        }
                    }
                    //console.log('monTracePoint',monTracePoint,players[playerId].tracePoints);
                
                }

                // Afficher les traces
                // ======================
                if (chkShowTrace.checked) {
                    if (playerId<rangeNbHuman.value) {
                        //console.log(players[playerId].tracePoints);
                        // Supprimer les anciens points ayant la classe "tracePoint"
                        const oldTracePoints = grid.querySelectorAll('.tracePoint');
                        oldTracePoints.forEach(point => point.remove());
                        // Parcourir chaque point de trace du joueur
                        players[playerId].tracePoints.forEach(point => {
                            const traceDiv = document.createElement('div');
                            traceDiv.classList.add('tracePoint');
                            traceDiv.style.left = `${point.x*cellSize}px`; // Positionnement en fonction de x
                            traceDiv.style.top = `${point.y*cellSize}px`;   // Positionnement en fonction de y
                            grid.appendChild(traceDiv); // Ajouter la div au conteneur
                        });
                    }
                }
                // ======================
            }

        }
        // Dessine le nouveau point sur la grille
        const point = document.createElement('div');            
        point.id = 'pl'+playerId+"-pt"+(players[playerId].path.length);
        point.classList.add('connected-point');
        point.style.gridColumnStart = newPoint.x + 1; // 1-based pour le CSS Grid
        point.style.gridRowStart = newPoint.y + 1;
        point.innerHTML = players[playerId].path.length-1;
        point.style.backgroundColor = players[playerId].color;
        grid.appendChild(point);
        point.style.opacity = 1;
        //Retourne la div point créé
        return point;
    };




    //========================================================================
    //========================================================================
    //========================================================================


    // Fonction pour générer les radios boutons pour les circuits
    function generateTrackButtons() {
        console.log('generateTrackButtons (Radio)');
        const divTracksBoutons = document.getElementById('divTracksBoutons');
        let myIndex = 0;
        const selectedRadio = document.querySelector('input[name="track"]:checked');       
        if (selectedRadio) {
            myIndex = parseInt(selectedRadio.dataset.trackIndex);
        }

        divTracksBoutons.innerHTML = ''; // Vider la div avant d'ajouter

        // Trier les circuits par ordre croissant en fonction de la taille
        buildinTracks.sort((a, b) => {
            const sizeA = a.trackPoints[0].length * a.trackPoints.length;
            const sizeB = b.trackPoints[0].length * b.trackPoints.length;
            return sizeA - sizeB;
        });
    
        buildinTracks.forEach((track, index) => {
            setTimeout(() => {
                // Créer un label pour le radio
                const label = document.createElement('label');
                //label.textContent = track.trackPoints[0].length + 'x' + track.trackPoints.length + ' '+track.trackName;
                label.textContent = '';
                if (tracksBestScores[track.trackName] && tracksIaScores[track.trackName]) {
                    if (tracksBestScores[track.trackName].score<=tracksIaScores[track.trackName].score) {
                        label.textContent += '⭐';
                    }
                }
                label.textContent += track.trackName;
                if (tracksBestScores[track.trackName]) {
                    label.textContent += " (" + tracksBestScores[track.trackName].score+"🏆)";
                }
                if (tracksIaScores[track.trackName]) {
                    label.textContent += " (" + tracksIaScores[track.trackName].score+"🤖)";
                }            
                // Créer le bouton radio pour chaque circuit
                const radio = document.createElement('input');
                radio.type = 'radio';
                radio.name = 'track'; // Tous les radios partagent le même nom pour être mutuellement exclusifs
                radio.value = track.trackName; // L'identifiant du circuit
                // Vérifier si l'index correspond à celui choisi aléatoirement
                if (index === myIndex) {
                    radio.checked = true;
                }
                document.getElementById('divLoadingMessage').innerHTML = '_' + document.getElementById('divLoadingMessage').innerHTML;
                radio.dataset.trackIndex = index; // Stocker l'index du circuit
                radio.id = 'radioTrack'+index;
                // Ajouter le radio et le label dans la div
                label.prepend(radio); // Insère le radio avant le texte dans le label
                label.appendChild(document.createElement('br'));

                label.appendChild(fctThumbnailTrack(track, 100));
                // Créer un nouvel élément div
                const trackDiv = document.createElement('div');
                trackDiv.appendChild(label);            
                // Ajouter le nouvel élément div au menu
                divTracksBoutons.appendChild(trackDiv);
            },10);
        });
    }
    
    function previewRecord(trackName) {
        divTrackRecord.innerHTML = '';
        if (tracksBestScores[trackName] && tracksIaScores[trackName]) {
            if (tracksBestScores[trackName].score<=tracksIaScores[trackName].score) {
                divTrackRecord.innerHTML += '⭐<br>';
            }
        }
        if (tracksBestScores[trackName]) {
            divTrackRecord.innerHTML += tracksBestScores[trackName].score+"🏆<br>";
        }
        if (tracksIaScores[trackName]) {
            divTrackRecord.innerHTML += tracksIaScores[trackName].score+"🤖<br>";
        }
    }
    //==============================================================================
    function fctThumbData(track) {
        console.log('fctThumbData()', track.trackName);
        let imageData;
        if (track.trackName.endsWith('🎲') || !track.trackThumb) {
            // Créer un élément canvas
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');    
            // Définir la taille du canvas en fonction de la taille de la grille
            const width = 4 * track.trackPoints[0].length;
            const height = 4 * track.trackPoints.length;
            canvas.width = width;
            canvas.height = height;
            // Dessiner la grille sur le canvas
            for (let y = 0; y < track.trackPoints.length; y++) {
                for (let x = 0; x < track.trackPoints[y].length; x++) {
                    switch (track.trackPoints[y][x]) {
                        case ' ':
                            ctx.fillStyle = 'darkgreen';
                            break;
                        case '*':
                            ctx.fillStyle = 'lightgrey';
                            break;
                        case '#':
                            ctx.fillStyle = 'lime';
                            break;
                        case '@':
                            ctx.fillStyle = 'red';
                            break;
                    }
                    ctx.fillRect(x * 4, y * 4, 4, 4);
                }
            }
            // Convertir le canvas en une image PNG
            imageData = canvas.toDataURL('image/png');
            track.trackThumb = imageData;
        } else {
            imageData = track.trackThumb;
        }  
        return imageData;
    }


    function fctThumbnailTrack(track,imgSize = 20) {
        console.log('fctThumbnailTrack', track.trackName);
        // Convertir le canvas en une image PNG
        const imageData = fctThumbData(track);    
        // Afficher l'image dans un élément img
        const img = document.createElement('img');
        img.src = imageData;
        img.style.width = imgSize + 'px';
        img.style.height = imgSize + 'px';
        img.style.objectFit = 'contain';
        img.style.objectPosition =  'center';
        img.style.verticalAlign = 'middle';
        // Ajouter l'image à la div de prévisualisation
        return img;
    }



    // Fonction pour afficher la prévisualisation du circuit sélectionné
    function fctPreviewTrack(track) {
        console.log('fctPreviewTrack', track.trackName);

        // Créer un élément canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');    
        // Définir la taille du canvas en fonction de la taille de la grille
        const width = 4 * track.trackPoints[0].length;
        const height = 4 * track.trackPoints.length;
        canvas.width = width;
        canvas.height = height;
    
        let countStartPoints = 0;
        let countFinishPoints = 0;
        // Dessiner la grille sur le canvas
        for (let y = 0; y < track.trackPoints.length; y++) {
            for (let x = 0; x < track.trackPoints[y].length; x++) {
                switch (track.trackPoints[y][x]) {
                    case ' ':
                        ctx.fillStyle = 'darkgreen';
                        break;
                    case '*':
                        ctx.fillStyle = 'lightgrey';
                        break;
                    case '#':
                        ctx.fillStyle = 'lime';
                        countStartPoints++;
                        break;
                    case '@':
                        ctx.fillStyle = 'red';
                        countFinishPoints++;
                        break;
                }
                ctx.fillRect(x * 4, y * 4, 4, 4);
            }
        }
    
        // Convertir le canvas en une image PNG
        const imageData = canvas.toDataURL('image/png');    
        // Afficher l'image dans un élément img
        const img = document.createElement('img');
        img.src = imageData;
        //img.style.width = `${width * 10}px`; // Agrandir l'image pour une meilleure visualisation
        //img.style.height = `${height * 10}px`; // Agrandir l'image pour une meilleure visualisation    
        // Ajouter l'image à la div de prévisualisation
        const trackPreviewPng = document.getElementById('trackPreviewPng');
        //trackPreview.innerHTML = '';
        trackPreviewPng.innerHTML='';
        trackPreviewPng.appendChild(img);

        divTrackName.innerHTML = '<span style="font-size:24px;">' + track.trackName + '</span>';
        divTrackSize.innerHTML = 'Size : ' + track.trackPoints[0].length + ' x ' + track.trackPoints.length;
        divTrackMxPl.innerHTML = 'Max Players : ' + Math.min(countStartPoints,countFinishPoints);

        // Ajouter la miniature au bouton
        const thumbnail = fctThumbnailTrack(track,50);
        //console.log('thumbnail',thumbnail);
        btnCfgTracksPng.innerHTML = '';
        btnCfgTracksPng.appendChild(thumbnail);

    }

    function previewSelectedTrack() {
        const selectedRadio = document.querySelector('input[name="track"]:checked');
        
        if (selectedRadio) {
            currentTrack = buildinTracks[selectedRadio.dataset.trackIndex];
            console.log('👁‍🗨previewSelectedTrack',selectedRadio,buildinTracks[selectedRadio.dataset.trackIndex]);
            fctPreviewTrack(currentTrack);
        } else {
            trackPreview.innerHTML = 'Veuillez sélectionner un circuit pour voir la prévisualisation.';
        }
    }   

    //========================================================================
    //========================================================================
    //========================================================================

    //========================================================================
    //========================================================================
    //========================================================================
    function fctReinit() {
        NbPlayers = rangeNbPlayers.value;
        console.log('♻ Réinit NbPlayers',NbPlayers,players);
        CurrentPlayer = 0;
        
        // Nettoyage des variables players
        for (let i = 0; i < 8; i++) {
            let divMovePoint = document.getElementById('divMovePoint'+i);
            divMovePoint.style.opacity = 0;

            if (!players[i]) {
                console.info(`Player ${i} is undefined!`);
                continue; // Saute les entrées non définies.
            }
            players[i].path = [];
            players[i].dist = 0;
            players[i].tracePoints = [];
            players[i].status = 'RUN';
        }
        // Supprimer les anciens points ayant la classe "tracePoint"
        const oldTracePoints = grid.querySelectorAll('.tracePoint');
        oldTracePoints.forEach(point => point.remove());

        fctShowRanking();
        //Suppression sur la grille (points et lignes)
        const connectedPoints = grid.querySelectorAll('.connected-point');
        connectedPoints.forEach(div => {
            div.remove();
        });
        const lines = grid.querySelectorAll('.line');
        lines.forEach(div => {
            div.remove();
        });

        // Crée un tableau d'index de 0 à startPoints.length - 1
        let availableIndexes = [...Array(startPoints.length).keys()];
        // ============ Sélectionner un point aléatoire pour chaque joueur
        for (let i = 0; i < NbPlayers; i++) {
            // Sélectionne un index aléatoire parmi ceux restants
            let randomIndex = Math.floor(Math.random() * availableIndexes.length);
            // Récupère l'index aléatoire
            let selectedStartIndex = availableIndexes[randomIndex];            
            // Récupère le point de départ correspondant
            let randomStartPoint = startPoints[selectedStartIndex];
            //console.info('player', i, 'randomStartPoint', randomStartPoint);
            // Met à jour la position du joueur avec le point sélectionné
            tmpPos = { x: randomStartPoint.x, y: randomStartPoint.y };
            // Démarre le chemin pour ce joueur
            fctAddPointOnPath(tmpPos, i);
            // Retire cet index du tableau pour qu'il ne soit pas réutilisé
            availableIndexes.splice(randomIndex, 1);


            //On pré-positionne pour l'animation
            let divMovePoint = document.getElementById('divMovePoint'+i);
            divMovePoint.style.backgroundColor = players[i].color;
            divMovePoint.style.opacity = 0;
            divMovePoint.style.transition = '';
            divMovePoint.style.left = cellSize * (tmpPos.x) +'px';
            divMovePoint.style.top = cellSize * (tmpPos.y) +'px';
        }
        
        //Recherche Score
        fctAfficheRecord();

        //Cache Menu
        divMenuContainer.style.display = 'none'; // Masquer l'élément
        divPauseContainer.style.top = '-400px';
        divFinishContainer.style.top = '-800px';
        divSpeed.style.display = 'none';
        numpad.style.display = 'none';
        //divCadreZoom.style.display = 'none';
        //divCadreZoom2.style.display = 'none';
        //Win Message
        winMessageHuman ='';
        winMessageIa ='';
        finishMessage = '';
        showRibbon('Welcome on <h3>'+currentTrack.trackName+'</h3>', 1500);
        setTimeout(() => {
            requestAnimationFrame(fctAffichageNext);
            //fctAffichageNext();
        },2000);
        
    }
    //========================================================================
    //========================================================================
    //========================================================================

    //========================================================================
    //========================================================================
    //========================================================================
    // Fonction pour charger les données du circuit sélectionné (depuis Btn)
    function loadSelectedTrack() {
        const selectedRadio = document.querySelector('input[name="track"]:checked');
        
        if (selectedRadio) {
            currentTrack = buildinTracks[selectedRadio.dataset.trackIndex];
            loadTrackData(currentTrack); // Charger le circuit sélectionné
            fctReinit();
        } else {
            alert("Veuillez sélectionner un circuit.");
        }
    }

    
    //========================================================================
    //                              MENU
    //========================================================================
    //========================================================================
    function fctMajTrackModeOneRace() {
        document.getElementById('divMenuTrackDetail').style.display = 'block';
        if (trackMode=='trackModeBuildin') {
            document.getElementById('divMenuTracksList').style.display = 'flex';
            document.getElementById('divMenuTrackGen').style.display = 'none';
            previewSelectedTrack();
        } else { //random tracks
            document.getElementById('divMenuTracksList').style.display = 'none';
            document.getElementById('divMenuTrackGen').style.display = 'block';
            generateTrackWithAngles();
            fctPreviewTrack(currentTrack);
        }
        btnCfgTracksLabel.innerHTML = currentTrack.trackName;
        document.getElementById('divRangeNbRaces').style.display = 'none';
        divMenuChampionDetail.style.display = 'none';
        divMenuChampionTracksContainer.style.display = 'none';
        btnFinishNext.innerHTML = 'Next Race ⏭';
    }



    function fctMajMenu() {
        console.log('🎨fctMajMenu : gameMode=',gameMode,'trackMode=',trackMode);
        let rootStyle = document.documentElement.style;
        switch (gameMode) {
            case 'modeTime':
                rootStyle.setProperty('--menuColorR', 100);
                rootStyle.setProperty('--menuColorG', 70);
                rootStyle.setProperty('--menuColorB', 70);
                rangeNbPlayers.value = 2;
                labelRangeNbPlayers.innerHTML = 'Nb Players: '+rangeNbPlayers.value;                
                rangeNbHuman.value = 1;
                btnRace.innerHTML = 'Launch Time Attack ⏱';                
                document.getElementById('divCadreMenuPlayers').style.display = 'none';
                document.getElementById('divCadrePlayersListContainer').style.display = 'none';
                fctMajTrackModeOneRace();
                break;
            case 'modeRace':
                rootStyle.setProperty('--menuColorR', 70);
                rootStyle.setProperty('--menuColorG', 100);
                rootStyle.setProperty('--menuColorB', 100);
                labelRangeNbPlayers.innerHTML = 'Nb Players: 8 (8 max)';
                rangeNbPlayers.max = 8;
                rangeNbPlayers.value = 8;
                rangeNbHuman.value = 1;
                document.getElementById('divCadreMenuPlayers').style.display = 'block';
                btnRace.innerHTML = 'Launch Race 🏎';
                document.getElementById('divCadrePlayersListContainer').style.display = 'block';
                fctMajTrackModeOneRace();
                break;
            case 'modeChamp':
                rootStyle.setProperty('--menuColorR', 74);
                rootStyle.setProperty('--menuColorG', 72);
                rootStyle.setProperty('--menuColorB', 91);
                labelRangeNbPlayers.innerHTML = 'Nb Players: 8 (8 max)';
                rangeNbPlayers.max = 8;
                rangeNbPlayers.value = 8;
                rangeNbHuman.value = 1;
                document.getElementById('divCadreMenuPlayers').style.display = 'block';
                document.getElementById('divRangeNbRaces').style.display = 'block';
                document.getElementById('divCadrePlayersListContainer').style.display = 'block';

                btnRace.innerHTML = 'Start 🏆<br>Championship';
                divMenuChampionDetail.style.display = 'block';
                if (trackMode=='trackModeBuildin') {
                    document.getElementById('divMenuTrackDetail').style.display = 'none';
                    document.getElementById('divMenuTracksList').style.display = 'none';
                    document.getElementById('divMenuTrackGen').style.display = 'none';
                    divMenuChampionTracksContainer.style.display = 'flex';
                    fctInitChampTracks();
                    btnCfgTracksLabel.innerHTML = rangeNbRaces.value + ' x Buildin';
                } else { //random tracks
                    document.getElementById('divMenuTrackDetail').style.display = 'block';
                    document.getElementById('divMenuTracksList').style.display = 'none';
                    document.getElementById('divMenuTrackGen').style.display = 'block';
                    divMenuChampionTracksContainer.style.display = 'none';
                    generateTrackWithAngles();
                    fctPreviewTrack(currentTrack);
                    btnCfgTracksLabel.innerHTML = rangeNbRaces.value + ' x Random';
                }
                champResults = [];
                champRaceIndex = 0;
                break;
            default:
                console.log('Mode non reconnu');
        }
        // Ajouter la miniature au bouton
        const thumbnail = fctThumbnailTrack(currentTrack,50);
        //console.log('thumbnail',thumbnail);
        btnCfgTracksPng.innerHTML = '';
        btnCfgTracksPng.appendChild(thumbnail);
        fctInitPlayers();
    }
    fctMajMenu();

    divMenuBtn.addEventListener('click', function() {
        isPaused = true;
        divPauseContainer.style.top = '50%';
        switch (gameMode) {
            case 'modeTime':
                divPauseTitle.innerHTML = '<h3>⏱ Time Attack Paused !</h3>';
                btnPauseRestart.innerHTML = "Restart ⏱";
                btnPauseRestart.style.display = '';
                break;
            case 'modeRace':
                divPauseTitle.innerHTML = '<h3>🏎 Race Paused !</h3>';
                btnPauseRestart.innerHTML = "Restart Race 🏎";
                btnPauseRestart.style.display = '';
                break;
            case 'modeChamp':
                divPauseTitle.innerHTML = '<h3>🏆 Championship Paused !</h3>';
                btnPauseRestart.style.display = 'none';
                break;
        }

    });
    // ============================================================================
    //                                          Generator Track Params
    // ============================================================================
    function fctMAJrangeGTturnAngle(action = true) {
        if (parseInt(rangeGTturnAngleMin.value)>parseInt(rangeGTturnAngleMax.value)) {
            rangeGTturnAngleMax.value = rangeGTturnAngleMin.value;
        }
        document.getElementById('labelGTturnAngle').innerHTML = 'Turn angle : ' + (parseInt(rangeGTturnAngleMin.value)+1) + ' - ' + (parseInt(rangeGTturnAngleMax.value)+1) + ' points';
        if (action) {
            fctMajMenu();
        }
    }
    rangeGTturnAngleMin.addEventListener('mousemove', function() {
        fctMAJrangeGTturnAngle(false);
    });
    rangeGTturnAngleMin.addEventListener('mouseup', function() {        
        fctMAJrangeGTturnAngle(true);
    });
    rangeGTturnAngleMin.addEventListener('touchmove', function() {
        fctMAJrangeGTturnAngle(false);
    });
    rangeGTturnAngleMin.addEventListener('touchend', function() {
        fctMAJrangeGTturnAngle(true);
    });

    rangeGTturnAngleMax.addEventListener('mousemove', function() {
        fctMAJrangeGTturnAngle(false);
    });
    rangeGTturnAngleMax.addEventListener('mouseup', function() {        
        fctMAJrangeGTturnAngle(true);
    });
    rangeGTturnAngleMax.addEventListener('touchmove', function() {
        fctMAJrangeGTturnAngle(false);
    });
    rangeGTturnAngleMax.addEventListener('touchend', function() {
        fctMAJrangeGTturnAngle(true);
    });
    fctMAJrangeGTturnAngle(false);



    //=======================================
    function fctMAJrangeGTtrackWidth(action = true) {
        if (parseInt(rangeGTtrackWidthMin.value)>parseInt(rangeGTtrackWidthMax.value)) {
            rangeGTtrackWidthMax.value = rangeGTtrackWidthMin.value;
        }
        document.getElementById('labelGTtrackWidth').innerHTML = 'Track width : ' + (parseInt(rangeGTtrackWidthMin.value)+1) + ' - ' + (parseInt(rangeGTtrackWidthMax.value)+1) + ' points';
        if (action) {
            fctMajMenu();
        }
    }
    rangeGTtrackWidthMin.addEventListener('mousemove', function() {
        fctMAJrangeGTtrackWidth(false);
    });
    rangeGTtrackWidthMin.addEventListener('mouseup', function() {        
        fctMAJrangeGTtrackWidth(true);
    });
    rangeGTtrackWidthMin.addEventListener('touchmove', function() {
        fctMAJrangeGTtrackWidth(false);
    });
    rangeGTtrackWidthMin.addEventListener('touchend', function() {
        fctMAJrangeGTtrackWidth(true);
    });

    rangeGTtrackWidthMax.addEventListener('mousemove', function() {
        fctMAJrangeGTtrackWidth(false);
    });
    rangeGTtrackWidthMax.addEventListener('mouseup', function() {        
        fctMAJrangeGTtrackWidth(true);
    });
    rangeGTtrackWidthMax.addEventListener('touchmove', function() {
        fctMAJrangeGTtrackWidth(false);
    });
    rangeGTtrackWidthMax.addEventListener('touchend', function() {
        fctMAJrangeGTtrackWidth(true);
    });
    fctMAJrangeGTtrackWidth(false);

    //===========================================================
    function fctMAJrangeGTtrackLength(action = true) {
        if (parseInt(rangeGTtrackLengthMin.value)>parseInt(rangeGTtrackLengthMax.value)) {
            rangeGTtrackLengthMax.value = rangeGTtrackLengthMin.value;
        }

        document.getElementById('labelGTtrackLength').innerHTML = 'Track length : ' + (parseInt(rangeGTtrackLengthMin.value)) + ' - ' + (parseInt(rangeGTtrackLengthMax.value)) + ' points';
        if (action) {
            fctMajMenu();
        }
    }
    rangeGTtrackLengthMin.addEventListener('mousemove', function() {
        fctMAJrangeGTtrackLength(false);
    });
    rangeGTtrackLengthMin.addEventListener('mouseup', function() {        
        fctMAJrangeGTtrackLength(true);
    });
    rangeGTtrackLengthMin.addEventListener('touchmove', function() {
        fctMAJrangeGTtrackLength(false);
    });
    rangeGTtrackLengthMin.addEventListener('touchend', function() {
        fctMAJrangeGTtrackLength(true);
    });

    rangeGTtrackLengthMax.addEventListener('mousemove', function() {
        fctMAJrangeGTtrackLength(false);
    });
    rangeGTtrackLengthMax.addEventListener('mouseup', function() {        
        fctMAJrangeGTtrackLength(true);
    });
    rangeGTtrackLengthMax.addEventListener('touchmove', function() {
        fctMAJrangeGTtrackLength(false);
    });
    rangeGTtrackLengthMax.addEventListener('touchend', function() {
        fctMAJrangeGTtrackLength(true);
    });
    fctMAJrangeGTtrackLength(false);

    //===========================================================
    function fctMAJrangeGTsectionLength(action = true) {

        if (parseInt(rangeGTsectionLengthMin.value)>parseInt(rangeGTsectionLengthMax.value)) {
            rangeGTsectionLengthMax.value = rangeGTsectionLengthMin.value;
        }

        document.getElementById('labelGTsectionLength').innerHTML = 'Sections length : ' + (parseInt(rangeGTsectionLengthMin.value)+1) + ' - ' + (parseInt(rangeGTsectionLengthMax.value)+1) + ' points';
        if (action) {
            fctMajMenu();
        }
    }

    rangeGTsectionLengthMin.addEventListener('mousemove', function() {
        fctMAJrangeGTsectionLength(false);
    });
    rangeGTsectionLengthMin.addEventListener('mouseup', function() {        
        fctMAJrangeGTsectionLength(true);
    });
    rangeGTsectionLengthMin.addEventListener('touchmove', function() {
        fctMAJrangeGTsectionLength(false);
    });
    rangeGTsectionLengthMin.addEventListener('touchend', function() {
        fctMAJrangeGTsectionLength(true);
    });

    rangeGTsectionLengthMax.addEventListener('mousemove', function() {
        fctMAJrangeGTsectionLength(false);
    });
    rangeGTsectionLengthMax.addEventListener('mouseup', function() {        
        fctMAJrangeGTsectionLength(true);
    });
    rangeGTsectionLengthMax.addEventListener('touchmove', function() {
        fctMAJrangeGTsectionLength(false);
    });
    rangeGTsectionLengthMax.addEventListener('touchend', function() {
        fctMAJrangeGTsectionLength(true);
    });
    fctMAJrangeGTsectionLength(false);

    rangeGTsectionGap.addEventListener('change', function() {
        fctMajMenu();
    });
    //=========================================
    document.querySelectorAll('input[name="trackMode"]').forEach((radio) => {
        radio.addEventListener('change', (event) => {
            trackMode = event.target.value;
            console.log('trackMode',trackMode);
            fctMajMenu();
        });
    });




    document.querySelectorAll('input[name="gameMode"]').forEach((radio) => {
        radio.addEventListener('change', (event) => {
            gameMode = event.target.value;
            console.log('gameMode',gameMode);
            fctMajMenu();
        });
    });


    function fctInitChampTracks() {
        divMenuChampionTracks.innerHTML = '';
        // Playlist de tracks
        // Crée une copie de la liste pour ne pas modifier l'originale
        const tracksCopy = [...buildinTracks];
        // Mélange les pistes en utilisant l'algorithme de Fisher-Yates
        for (let i = tracksCopy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [tracksCopy[i], tracksCopy[j]] = [tracksCopy[j], tracksCopy[i]];
        }
        // Retourne les N premiers éléments de la liste mélangée
        champTracks = tracksCopy.slice(0, rangeNbRaces.value);
        for (let i = 0; i < champTracks.length; i++) {
            // Créer un nouvel élément div
            const trackDiv = document.createElement('div');
            // Ajouter le nom de la piste et l'image miniature
            trackDiv.innerHTML = champTracks[i].trackName + '<br>';
            trackDiv.appendChild(fctThumbnailTrack(champTracks[i], 100));
            // Ajouter le nouvel élément div au menu
            divMenuChampionTracks.appendChild(trackDiv);
        }
        
        champResults = [];
        champRaceIndex = 0;

        currentTrack = champTracks[champRaceIndex];
        console.log('fctInitChampTracks champTracks',champTracks);
    }



    // Écouter le changement de sélection des boutons radio pour mettre à jour la prévisualisation
    document.getElementById('divTracksBoutons').addEventListener('change', previewSelectedTrack);
    
    //=====================
    function fctStartRace() {
        console.log('btnRace click gameMode',gameMode,'currentTrack',currentTrack);
        switch (gameMode) {
            case 'modeTime':
                rangeNbPlayers.value = 1;
                rangeNbHuman.value = 0;
                fctChargeCircuit(currentTrack.trackPoints);
                fctReinit();
                break;
            case 'modeRace':
                fctChargeCircuit(currentTrack.trackPoints);
                fctReinit();
                break;
            case 'modeChamp':                
                champResults = [];
                champRaceIndex = 0;
                fctChargeCircuit(currentTrack.trackPoints);
                fctReinit();
                break;
            default:
                console.log('Mode non reconnu');
        }

        //Nettoyage Div Ranking
        if (document.getElementById('divFinishRankScoresTitle')) {
            document.getElementById('divFinishRankScoresTitle').innerHTML='';
        }
        for (let i=0;i<8;i++) {
            if (document.getElementById('divFinishRankScores'+i)) {
                document.getElementById('divFinishRankScores'+i).innerHTML='';
            }
        }
        divFinishRanking.style.width = '300px';
    }


    btnRace.addEventListener('click', function() {
        fctStartRace();
    });

    btnCfgTracks.addEventListener('click', function() {
        if (divMenuMainTracks.style.display=='none' || divMenuMainTracks.style.display=='') {
            divMenuMainTracks.style.display='flex';
            divMenuMainPlayers.style.display='none';
        } else {
            divMenuMainTracks.style.display='none';
        }
    });
    btnCfgPlayers.addEventListener('click', function() {
        if (divMenuMainPlayers.style.display=='none' || divMenuMainPlayers.style.display=='') {
            divMenuMainPlayers.style.display='flex';
            divMenuMainTracks.style.display='none';
        } else {
            divMenuMainPlayers.style.display='none';
        }
    });

    function fctReverseTrack() {
        currentTrack.trackPoints = replaceCharInTrackPoints(currentTrack.trackPoints, '#', 'S');
        currentTrack.trackPoints = replaceCharInTrackPoints(currentTrack.trackPoints, '@', 'F');
        currentTrack.trackPoints = replaceCharInTrackPoints(currentTrack.trackPoints, 'F', '#');
        currentTrack.trackPoints = replaceCharInTrackPoints(currentTrack.trackPoints, 'S', '@');
        
    }

    btnReverseTrack.addEventListener('click', function() {
        spinnerShow();
        setTimeout(() => {
            fctReverseTrack();
            showRibbon(currentTrack.trackName+' track reversed !',2000,'rgb(74, 72, 91)');
            fctPreviewTrack(currentTrack);
            spinnerHide();
        }, 10);
    });

    btnTrackLeft.addEventListener('click', function() {       
        if (trackMode!=='trackModeBuildin') {
            generateTrackWithAngles();
            fctPreviewTrack(currentTrack);
        } else {
            const selectedRadio = document.querySelector('input[name="track"]:checked');
            let nextIndex = parseInt(selectedRadio.dataset.trackIndex) - 1;
            let nextRadio = document.getElementById('radioTrack'+nextIndex);
            if (nextRadio) {
                    nextRadio.checked = true; // Cocher le bouton suivant
                    previewSelectedTrack();                
            } else {
                showRibbon('First track...',2000,'darkgreen');
            }
        }

    });
    btnTrackRight.addEventListener('click', function() {
        if (trackMode!=='trackModeBuildin') {
            generateTrackWithAngles();
            fctPreviewTrack(currentTrack);
        } else {
            const selectedRadio = document.querySelector('input[name="track"]:checked');
            let nextIndex = parseInt(selectedRadio.dataset.trackIndex) + 1;
            let nextRadio = document.getElementById('radioTrack'+nextIndex);   
            if (nextRadio) {
                nextRadio.checked = true; // Cocher le bouton suivant
                previewSelectedTrack();                
            } else {
                showRibbon('Last track...',2000,'darkgreen');
            }
        }
    });
    //===========================
    //===========================
    //===========================
    function fctBackToMenu() {
        isPaused = false;
        divPauseContainer.style.top = '-400px';
        divFinishContainer.style.top = '-800px';
        generateTrackButtons();
        previewRecord(currentTrack.trackName);
        divMenuContainer.style.display = 'flex';
        if (gameMode=='modeChamp') {
            if (trackMode=='trackModeBuildin') {
                fctInitChampTracks();
            } else { //random tracks
                generateTrackWithAngles();
                fctPreviewTrack(currentTrack);
            }
            champResults = [];
            champRaceIndex = 0;
        }
    }

    //===========================
    //            Pause
    //===========================
    btnPauseRestart.addEventListener('click', function() {
        isPaused = false;
        fctReinit();
    });

    btnPauseMenu.addEventListener('click', function() {
        fctBackToMenu();
    });

    btnPauseClose.addEventListener('click', function() {
        isPaused = false;
        requestAnimationFrame(fctAffichageNext);
        //fctAffichageNext();
        divPauseContainer.style.top = '-400px';
    });
    //                  Finish
    //===========================
    btnFinishRestart.addEventListener('click', function() {
        fctReinit();
    });
    btnFinishNext.addEventListener('click', function() {
        console.log('btnFinishNext gameMode',gameMode);
        if (gameMode=='modeRace') {

            if (trackMode=='trackModeBuildin') {
                btnTrackRight.click();
                fctInitPlayers();
                setTimeout(() => {
                    btnRace.click();
                },500);
            } else { //random tracks
                generateTrackWithAngles();
                fctChargeCircuit(currentTrack.trackPoints);
                fctReinit();
            }

        }

        if (gameMode=='modeChamp') {
            champRaceIndex++;

            if (trackMode=='trackModeBuildin') {
                currentTrack = champTracks[champRaceIndex];
                //console.log(currentTrack);
                fctReverseTrack();
                fctChargeCircuit(currentTrack.trackPoints);
                fctReinit();
            } else { //random tracks
                generateTrackWithAngles();
                fctChargeCircuit(currentTrack.trackPoints);
                fctReinit();
            }            

        }     

    });
    btnFinishReverse.addEventListener('click', function() {

        btnReverseTrack.click();        
        setTimeout(() => {
            btnRace.click();
        },500);
    });

    btnFinishMenu.addEventListener('click', function() {
        fctBackToMenu();
    });

    btnFinishClose.addEventListener('click', function() {
        divFinishContainer.style.top = '-800px';
    });

    //Params
    rangeZoomScale.addEventListener('input', function() {        
        fctCenterOnPoint();
    });

    rangeZoomElan.addEventListener('input', function() {        
        fctCenterOnPoint();
    });






    // Fonction pour charger les données du circuit sélectionné
    function loadTrackData(track) {
        //const selectedTrack = tracks.find(track => track.trackName === trackName);        
        if (track) {
            fctChargeCircuit(track.trackPoints);
        } else {
            console.error(`Le circuit ${track} n'a pas été trouvé.`);
        }
    }
    function replaceCharInTrackPoints(trackPoints, targetChar, replacementChar) {
        for (let i = 0; i < trackPoints.length; i++) {
            trackPoints[i] = trackPoints[i].replace(new RegExp(targetChar, 'g'), replacementChar);
        }
        return trackPoints;
    }
    function fctChargeCircuit(trackPoints) {
        playSound('dotraceNewGrid.mp3',1,letSoundMode);
        //console.info('fctChargeCircuit',trackPoints);
        //Suppression de la grille actuelle
        const divDotStart = document.querySelectorAll('.divDotStart');
        divDotStart.forEach(div => {
            div.remove();
        });
        const divDotFinish = document.querySelectorAll('.divDotFinish');
        divDotFinish.forEach(div => {
            div.remove();
        });
        // Sélectionner tous les éléments avec l'attribut fill="black" dans le masque
        const svgBlackElements = svgMask.querySelectorAll('[fill="black"]');
        svgBlackElements.forEach(element => {
            svgMask.removeChild(element);
        });
        //Taille de la grille
        cellNbX = trackPoints[0].length-1;
        cellNbY = trackPoints.length-1;
        console.info('fctChargeCircuit (',cellNbX,cellNbY,')');
        let rootStyle = document.documentElement.style;
        // Définir une valeur pour la variable --cellNbX et --cellNbY
        rootStyle.setProperty('--cellNbX', cellNbX);
        rootStyle.setProperty('--cellNbY', cellNbY);
        svgFond.style.width = cellSize * cellNbX;
        svgFond.style.height = cellSize * cellNbY;

        fctCenterOnMap();



        startPoints = [];
        finishPoints = [];
        let x,y;
        let divDot;
        for (y = 0; y < trackPoints.length; y++) {
            let characters = Array.from(trackPoints[y]);
            for (x = 0; x < trackPoints[y].length; x++) {
                if (trackPoints[y][x]=='*' || trackPoints[y][x]=='#' || trackPoints[y][x]=='@') {
                    // Ajouter des elmts transparents au masque
                    // Vérifier les cases adjacentes
                    let top = y > 0 ? trackPoints[y - 1][x] : ' '; // Case au-dessus
                    let bottom = y < trackPoints.length - 1 ? trackPoints[y + 1][x] : ' '; // Case en dessous
                    let left = x > 0 ? trackPoints[y][x - 1] : ' '; // Case à gauche
                    let right = x < trackPoints[y].length - 1 ? trackPoints[y][x + 1] : ' '; // Case à droite

                    const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
                    let newPoints ="";
                    if (['#', '@', '*'].includes(top) || ['#', '@', '*'].includes(left)) {
                        let topleftPoints = (x*cellSize-(cellSize/2)-1) + ',' + (y*cellSize-(cellSize/2)-1);
                        newPoints += topleftPoints+" ";
                    }
                    if (['#', '@', '*'].includes(top) && ['#', '@', '*'].includes(left)) {
                        let topleftPoints = (x*cellSize-(cellSize/2)-1) + ',' + (y*cellSize-(cellSize/2)-1);
                        newPoints += topleftPoints+" ";
                        let triangle1 = (x*cellSize-(cellSize/2)-(cellSize/2)-1) + ',' + (y*cellSize-(cellSize/2));
                        newPoints += triangle1+" ";
                        let triangle2 = (x*cellSize-(cellSize/2)) + ',' + (y*cellSize-(cellSize/2)-(cellSize/2)-1);
                        newPoints += triangle2+" ";
                        newPoints += topleftPoints+" ";
                    }
                    let topcenterPoints = (x*cellSize) + ',' + (y*cellSize-(cellSize/2)-1);
                    newPoints += topcenterPoints+" ";
                    if (['#', '@', '*'].includes(top) || ['#', '@', '*'].includes(right)) {
                        let toprightPoints = (x*cellSize+(cellSize/2)+1) + ',' + (y*cellSize-(cellSize/2)-1);
                        newPoints += toprightPoints+" ";
                    }
                    if (['#', '@', '*'].includes(top) && ['#', '@', '*'].includes(right)) {
                        let toprightPoints = (x*cellSize+(cellSize/2)+1) + ',' + (y*cellSize-(cellSize/2)-1);
                        newPoints += toprightPoints+" ";
                        let triangle1 = (x*cellSize+(cellSize/2)) + ',' + (y*cellSize-(cellSize/2)-(cellSize/2)-1);
                        newPoints += triangle1+" ";
                        let triangle2 = (x*cellSize+(cellSize/2)+(cellSize/2)+1) + ',' + (y*cellSize-(cellSize/2));
                        newPoints += triangle2+" ";
                        newPoints += toprightPoints+" ";
                    }
                    let centerrightPoints = (x*cellSize+(cellSize/2)+1) + ',' + (y*cellSize);
                    newPoints += centerrightPoints+" ";
                    if (['#', '@', '*'].includes(bottom) || ['#', '@', '*'].includes(right)) {
                        let bottomrightPoints = (x*cellSize+(cellSize/2)+1) + ',' + (y*cellSize+(cellSize/2)+1);
                        newPoints += bottomrightPoints+" ";
                    }
                    if (['#', '@', '*'].includes(bottom) && ['#', '@', '*'].includes(right)) {
                        let bottomrightPoints = (x*cellSize+(cellSize/2)+1) + ',' + (y*cellSize+(cellSize/2)+1);
                        newPoints += bottomrightPoints+" ";
                        let triangle1 = (x*cellSize+(cellSize/2)+(cellSize/2)+1) + ',' + (y*cellSize+(cellSize/2));
                        newPoints += triangle1+" ";
                        let triangle2 = (x*cellSize+(cellSize/2)) + ',' + (y*cellSize+(cellSize/2)+(cellSize/2)+1);
                        newPoints += triangle2+" ";
                        newPoints += bottomrightPoints+" ";
                    }
                    let bottomcenterPoints = (x*cellSize) + ',' + (y*cellSize+(cellSize/2)+1);
                    newPoints += bottomcenterPoints+" ";
                    if (['#', '@', '*'].includes(bottom) || ['#', '@', '*'].includes(left)) {
                        let bottomleftPoints = (x*cellSize-(cellSize/2)-1) + ',' + (y*cellSize+(cellSize/2)+1);
                        newPoints += bottomleftPoints+" ";
                    }
                    if (['#', '@', '*'].includes(bottom) && ['#', '@', '*'].includes(left)) {
                        let bottomleftPoints = (x*cellSize-(cellSize/2)-1) + ',' + (y*cellSize+(cellSize/2)+1);
                        newPoints += bottomleftPoints+" ";
                        let triangle1 = (x*cellSize-(cellSize/2)) + ',' + (y*cellSize+(cellSize/2)+(cellSize/2)+1);
                        newPoints += triangle1+" ";
                        let triangle2 = (x*cellSize-(cellSize/2)-(cellSize/2)-1) + ',' + (y*cellSize+(cellSize/2));
                        newPoints += triangle2+" ";
                        newPoints += bottomleftPoints+" ";
                    }
                    let centerleftPoints = (x*cellSize-(cellSize/2)-1) + ',' + (y*cellSize);
                    newPoints += centerleftPoints;
                    //console.info(newPoints);
                    polygon.setAttribute('points', newPoints);
                    polygon.setAttribute("fill", "black");
                    svgMask.appendChild(polygon);

                    if (trackPoints[y][x]=='#' || trackPoints[y][x]=='@') {
                        divDot = document.createElement('div');
                        if (trackPoints[y][x]=='#') {
                            divDot.id = x+'_'+y+'_'+'START';
                            divDot.classList.add('divDotStart');
                            startPoints.push({ x: x, y: y });
                        }
                        if (trackPoints[y][x]=='@') {
                            divDot.id = x+'_'+y+'_'+'FINISH';
                            divDot.classList.add('divDotFinish');
                            finishPoints.push({ x: x, y: y });
                        } 
                        
                        divDot.style.gridColumnStart = x+1;
                        divDot.style.gridRowStart = y+1;
                        divDot.style.zIndex = 1;
                        grid.insertBefore(divDot, svgFond);
                        
                    }
                }
            }
        }

    }

    function fctBordurePiste(divDot,x,y,trackPoints) {
        // Vérifier les cases adjacentes
        let top = y > 0 ? trackPoints[y - 1][x] : ' '; // Case au-dessus
        let bottom = y < trackPoints.length - 1 ? trackPoints[y + 1][x] : ' '; // Case en dessous
        let left = x > 0 ? trackPoints[y][x - 1] : ' '; // Case à gauche
        let right = x < trackPoints[y].length - 1 ? trackPoints[y][x + 1] : ' '; // Case à droite

        //console.log(divDot.id,'top',top,'bottom',bottom,'left',left,'right',right);
        let boxShadowLeft =  'inset 5px 0 0 0 red,';
        let boxShadowRight =  'inset -5px 0 0 0 red,';
        let boxShadowTop =  'inset 0 5px 0 0 red,';
        let boxShadowBottom =  'inset 0 -5px 0 0 red,';
        let boxShadowFinal ='';

        if (['#', '@', '*'].includes(left)) {
            boxShadowFinal += boxShadowLeft;
        }
        if (['#', '@', '*'].includes(right)) {
            boxShadowFinal += boxShadowRight;
        }
        if (['#', '@', '*'].includes(top)) {
            boxShadowFinal += boxShadowTop;
        }
        if (['#', '@', '*'].includes(bottom)) {
            boxShadowFinal += boxShadowBottom;
        }
        if (boxShadowFinal!='') {
            divDot.style.boxShadow = boxShadowFinal.slice(0, boxShadowFinal.length - 1);
        }
        //Arrondis
        if (['#', '@', '*'].includes(top) && ['#', '@', '*'].includes(left)) {
            divDot.style.borderTopLeftRadius = '10px';
        }
        if (['#', '@', '*'].includes(top) && ['#', '@', '*'].includes(right)) {
            divDot.style.borderTopRightRadius = '10px';
        }
        if (['#', '@', '*'].includes(bottom) && ['#', '@', '*'].includes(left)) {
            divDot.style.borderBottomLeftRadius = '10px';
        }
        if (['#', '@', '*'].includes(bottom) && ['#', '@', '*'].includes(right)) {
            divDot.style.borderBottomRightRadius = '10px';
        }         
    }




    //================================================================================
    //================================================================================
    //================================================================================
    //================================================================================



    //================================================================================
    //================================================================================
    //=============================       NUMPAD     =================================
    //================================================================================
    //================================================================================


    //const points = document.querySelectorAll('.point');
    const points = document.querySelectorAll('#numpad button');
    let activePoint = null; // Pour suivre le bouton enfoncé initialement
    let isInsideButton = false; // Suivre si l'utilisateur est à l'intérieur d'un bouton

    // Fonction déclenchée au moment de cliquer ou toucher un bouton
    function onStart(event) {
        event.preventDefault();
        //console.info('Début sur le bouton:', this.getAttribute('data-value'));
        if (this.style.cursor == 'pointer') {
            activePoint = this; // Enregistrer le point enfoncé initialement
            isInsideButton = true; // Marquer comme étant à l'intérieur d'un bouton
            fctMoveFromCommand(this.getAttribute('data-value'),true);
            divNextLine.style.opacity = 1;
            divNextPoint.style.opacity = 1;
            // Ajouter les écouteurs pour les mouvements et le relâchement
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onEnd);
            document.addEventListener('touchmove', onMove);
            document.addEventListener('touchend', onEnd);
        }           
        

    }

    // Fonction déclenchée pendant que l'utilisateur bouge le curseur ou glisse
    function onMove(event) {
        let x = event.clientX || event.touches[0].clientX;
        let y = event.clientY || event.touches[0].clientY;
        let isOverAnyPoint = false; // Variable pour suivre si on est au-dessus d'un bouton
        // Vérifier si le curseur est au-dessus d'un autre bouton
        points.forEach(point => {        
            const rect = point.getBoundingClientRect();
            if (x > rect.left && x < rect.right && y > rect.top && y < rect.bottom) {
                if (point.style.cursor == 'pointer') {
                    isOverAnyPoint = true; // Si on est au-dessus d'un bouton
                    if (activePoint !== point) { // Si on passe à un autre bouton                        
                        //console.info('Changement de bouton:', point.getAttribute('data-value'));                
                        activePoint = point; // Mettre à jour le bouton actif
                        fctMoveFromCommand(point.getAttribute('data-value'),true);
                    }
                } 
            }           
            
        });

        // Si on n'est au-dessus d'aucun bouton, marquer comme étant en dehors
        if (!isOverAnyPoint) {
            //activePoint.style.backgroundColor = 'lightblue';
            isInsideButton = false;
            //console.info('Sorti de tous les boutons, action annulée');
            divNextLine.style.opacity = 0;
            divNextPoint.style.opacity = 0;
        } else {
            isInsideButton = true;
            divNextLine.style.opacity = 1;
            divNextPoint.style.opacity = 1;
        }
    }

    // Fonction déclenchée lorsque le bouton ou l'écran est relâché
    function onEnd(event) {
        if (isInsideButton && activePoint) {
            //console.info('Relâché sur le bouton:', activePoint.getAttribute('data-value'));
            // Action à effectuer lorsque le bouton est relâché
            fctMoveFromCommand(activePoint.getAttribute('data-value'),false);

        } else {
            console.info('Action annulée, car le curseur a quitté le bouton.');
        }
        // Retirer les écouteurs de mouvement et relâchement
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onEnd);
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onEnd);
        //activePoint.style.backgroundColor = 'lightblue';
        activePoint = null; // Réinitialiser
        isInsideButton = false; // Réinitialiser
        divNextLine.style.opacity = 0;
        divNextPoint.style.opacity = 0;
    }

    // Ajouter les écouteurs sur chaque bouton
    points.forEach(point => {
        point.addEventListener('mousedown', onStart);
        point.addEventListener('touchstart', onStart);
    });


    //================================================================================
    //================================================================================
    //================================================================================
    //================================================================================


    function fctSimuNextPointLine(start,end,color) {

        //console.info('fctSimuNextPointLine',start,end,color);
        //ligne
        // Calculer la position de départ et d'arrivée
        const startX = start.x * cellSize;
        const startY = start.y * cellSize;
        const endX = end.x * cellSize;
        const endY = end.y * cellSize;
        // Calculer la longueur de la ligne
        const length = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
        divNextLine.style.height = `${length}px`;
        // Calculer l'angle de rotation
        const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI)-90; // Convertir en degrés
        divNextLine.style.transformOrigin = '0 0'; // Origine pour rotation
        divNextLine.style.transform = `translate(${startX}px, ${startY}px) rotate(${angle}deg)`; // Applique la translation et la rotation
        // Couleur
        divNextLine.style.backgroundColor = fctRbg2Rgba(color,.1);
        divNextLine.style.opacity = 1;
        // Point
        divNextPoint.style.left = endX +'px';
        divNextPoint.style.top = endY +'px';
        divNextPoint.style.backgroundColor = fctRbg2Rgba(color,.1);
        divNextPoint.innerHTML = players[CurrentPlayer].path.length;
        divNextPoint.style.opacity = 1;

        //Affichage next Zoom
        tmpPos = pPos();
        tmpElan = pElan();
        divCadreZoom.style.left = (cellSize * (tmpPos.x + tmpElan.x -2)+(cellSize/2)) +'px';
        divCadreZoom.style.top = (cellSize * (tmpPos.y + tmpElan.y -2)+(cellSize/2)) +'px';
        divCadreZoom.style.backgroundColor = players[CurrentPlayer].color;
        divCadreZoom.style.opacity = .5;
        //Nouvel Elan
        let tmpElan2 = {x:end.x-start.x,y:end.y-start.y};
        divCadreZoom2.style.left = (cellSize * (tmpPos.x + tmpElan2.x + tmpElan2.x -2)+(cellSize/2)) +'px';
        divCadreZoom2.style.top = (cellSize * (tmpPos.y + tmpElan2.y + tmpElan2.y -2)+(cellSize/2)) +'px';
        divCadreZoom2.style.backgroundColor = players[CurrentPlayer].color;
        divCadreZoom2.style.opacity = .2;        

    }


    function fctAfficheRecord() {
        divBest.innerHTML = '';
        if (tracksBestScores[currentTrack.trackName] && tracksIaScores[currentTrack.trackName]) {
            if (tracksBestScores[currentTrack.trackName].score<=tracksIaScores[currentTrack.trackName].score) {
                divBest.innerHTML += '⭐';
            }
        }
        if (tracksBestScores[currentTrack.trackName]) {
            divBest.innerHTML += ' '+tracksBestScores[currentTrack.trackName].score+" 🏆";
        }
        if (tracksIaScores[currentTrack.trackName]) {
            divBest.innerHTML += ' '+tracksIaScores[currentTrack.trackName].score+" 🤖";
        }
        if (gameMode=='modeChamp') {
            divBest.innerHTML = currentTrack.trackName + ' (' + (champRaceIndex+1) + '/' + rangeNbRaces.value + ')';            
        }
    }

    function fctAfficheFinish() {
        console.log('🏁 > fctAfficheFinish()');
        btnFinishRestart.style.display = '';
        btnFinishReverse.style.display = '';
        btnFinishNext.style.display = '';
        btnFinishMenu.style.display = '';
        btnFinishClose.style.display = '';
        divFinishRanking.style.display = 'none';

        switch (gameMode) {
            case 'modeTime':
                if (rangeNbHuman.value == 0) {
                    showRibbon(winMessageIa,2000);
                    setTimeout(function() {
                        rangeNbPlayers.value = 1;
                        rangeNbHuman.value = 1;
                        fctReinit();
                    }, 2000);
                } else {
                    if (rangeNbHuman.value == 1) {
                        btnFinishNext.style.display = 'none';
                        divFinishResult.innerHTML = 'Track <b>' + currentTrack.trackName + '</b> finish !<br>';
                        divFinishResult.innerHTML += "<br>";
                        divFinishResult.innerHTML += winMessageHuman;
                        divFinishResult.innerHTML += "<br><br>";
                        divFinishResult.innerHTML += winMessageIa;
                        divFinishResult.innerHTML += "<br>";
                        divFinishContainer.style.top = '50%';
                    }
                }
                break;
            case 'modeRace':
                fctShowRanking();
                divFinishResult.innerHTML = 'Track <b>' + currentTrack.trackName + '</b> finish !<br>';
                divFinishResult.innerHTML += "<br>";
                divFinishResult.innerHTML += winMessageHuman;
                divFinishResult.innerHTML += "<br><br>";
                divFinishResult.innerHTML += winMessageIa;
                divFinishResult.innerHTML += "<br>";
                divFinishContainer.style.top = '50%';
                break;
            case 'modeChamp':
                divFinishRanking.style.display = 'flex';
                fctShowRanking();

                const playerScores = {};
                let maxRaceIndex = 0;
                let playersNamesHtml ='';
                // 1. Déterminer le maxRaceIndex
                champResults.forEach(result => {
                    maxRaceIndex = Math.max(maxRaceIndex, result.raceIndex);
                });
                console.log('fctAfficheFinish champResults',champResults,'maxRaceIndex',maxRaceIndex);
                const pointsByRank = [10, 6, 5, 4, 3, 2]; // Points attribués par position
                
                // Calcul des scores pour chaque course individuellement
                for (let race = 0; race <= maxRaceIndex; race++) {
                    // Filtrer les résultats pour la course actuelle et trier par pathLength
                    const currentRaceResults = champResults
                        .filter(result => result.raceIndex === race)
                        .sort((a, b) => a.pathLength - b.pathLength);
                
                    let rankIndex = 0; // Index pour attribuer les points
                    let currentPoints = pointsByRank[rankIndex]; // Points pour le classement actuel
                    let winLength = currentRaceResults[rankIndex].pathLength;
                    currentRaceResults.forEach((result, index) => {
                        const { raceIndex, playerId, pathLength } = result;
                        //console.log(race,maxRaceIndex,rankIndex,winLength,pathLength,players[playerId].name);
                        //Affiche les meilleurs parcours
                        if (race === maxRaceIndex && winLength === pathLength) {
                            playersNamesHtml += "<br>" + players[playerId].name;
                            for (let p=1;p<=players[playerId].path.length;p++) {
                                let divPoint = document.getElementById('pl'+playerId+'-pt'+p);
                                divPoint.style.opacity = 1;
                                divPoint.classList.add('blinking');
                                if (document.getElementById('pl'+playerId+'-line'+p)) {
                                    divPoint = document.getElementById('pl'+playerId+'-line'+p);
                                    divPoint.style.opacity = 1;
                                    divPoint.classList.add('blinking');
                                }
                            }
                            if (playerId<rangeNbHuman.value) {
                                playSound('dotraceClaps.mp3'); 
                            }                            
                        }

                        // Si c'est le premier joueur ou s'il a une longueur de chemin différente du joueur précédent
                        if (index === 0 || pathLength !== currentRaceResults[index - 1].pathLength) {
                            currentPoints = pointsByRank[rankIndex] || 1; // Attribuer des points pour ce rang ou 1 si plus de points disponibles                            
                            if (pathLength==999999) {
                                currentPoints = 0;
                            }
                        }
                
                        // Attribuer les points au joueur
                        if (!playerScores[playerId]) playerScores[playerId] = { total: 0, races: {} };
                        playerScores[playerId].total += currentPoints;
                        playerScores[playerId].races[raceIndex] = currentPoints;


                        // Passer au rang suivant si ce n'est pas un ex aequo
                        if (index === 0 || pathLength !== currentRaceResults[index - 1].pathLength) {
                            rankIndex++;
                        }

                    });
                }
                console.log('playerScores',playerScores);
                // Convertir playerScores en tableau et trier par ordre décroissant de `total`
                const sortedPlayers = Object.entries(playerScores)
                    .sort(([, a], [, b]) => b.total - a.total); // Trier par `total` décroissant


                //===================
                let divFinishRankScoresTitle = document.getElementById('divFinishRankScoresTitle');
                let divScoreRaceTitle = document.createElement('div');
                divScoreRaceTitle.style.width = '30px';
                divScoreRaceTitle.style.borderRadius = '10px';
                divScoreRaceTitle.innerHTML = 'R'+(maxRaceIndex+1);
                divFinishRankScoresTitle.insertBefore(divScoreRaceTitle, divFinishRankScoresTitle.firstChild);

                // Remplir les lignes des joueurs triés
                sortedPlayers.forEach(([playerId, playerData],index) => {
                    //================= NewDiv Rank
                    setTimeout(function() {
                        let divFinishRankContainer = document.getElementById('divFinishRankContainer'+playerId);
                        divFinishRankContainer.style.top = (50+index*40)+'px';                 
                    }, 6000);
                    //div Rank
                    let divFinishRankNb = document.getElementById('divFinishRankNb'+playerId);
                    let rankChange='';
                    if (players[playerId].champRanking!=index && maxRaceIndex!=0) {
                        rankChange = parseInt(players[playerId].champRanking)-parseInt(index);                        
                        if (rankChange>0) {  
                            rankChange = '+' + rankChange + '🔼';
                        } else {
                            rankChange = rankChange + '🔻';
                        }                        
                    }     
                    divFinishRankNb.innerHTML = fctEmojiPodium(index+1) + ' <span class="classNumber" style="width: 15px;height: 15px;"> ' + (index+1) + ' </span> <small>' + rankChange + '</small>';

                    //div player
                    //div Total
                    let divFinishRankTotal = document.getElementById('divFinishRankTotal'+playerId);               
                    divFinishRankTotal.innerHTML = '<b>' + playerData.total + '</b>';
                    if (playerData.races[maxRaceIndex] || 0 !=0) {
                        divFinishRankTotal.innerHTML += ' <small>+' + playerData.races[maxRaceIndex] + '</small>';
                    }
                    //div racesScores
                    let divFinishRankScores = document.getElementById('divFinishRankScores'+playerId);
                    //divFinishRankScores.innerHTML = '';
                    // Colonnes Résultats Races : Ajout du dernier résultat :
                    let intValue = playerData.races[maxRaceIndex] || 0;
                    let rgbCible = getScoreColor(intValue,.5);
                    let divScoreRace = document.createElement('div');
                    divScoreRace.style.backgroundColor = rgbCible;
                    divScoreRace.style.width = '30px';
                    divScoreRace.style.borderRadius = '10px';
                    divScoreRace.innerHTML = intValue;
                    divFinishRankScores.insertBefore(divScoreRace, divFinishRankScores.firstChild);
                    //==========
                    players[playerId].champRanking=index;
                });

                //Largeur
                var currentWidth = divFinishRanking.style.width;
                // Si la largeur actuelle est définie, ajoutez 30 pixels
                if (currentWidth) {
                    var newWidth = (30 + parseInt(currentWidth)) + 'px';
                    divFinishRanking.style.width = newWidth;
                } else {
                    // Si la largeur actuelle n'est pas définie, définissez une largeur initiale
                    divFinishRanking.style.width = '330px';
                }
                //console.log('currentWidth',currentWidth,divFinishRanking.style.width);

                divFinishResult.innerHTML = 'Track <b>' + currentTrack.trackName + ' ('+(maxRaceIndex+1)+'/' + rangeNbRaces.value + ')</b> finish !<br>';
                btnFinishRestart.style.display = 'none';
                btnFinishReverse.style.display = 'none';
                if ((maxRaceIndex+1)>=rangeNbRaces.value) {
                    btnFinishNext.style.display = 'none';
                    divFinishResult.innerHTML += '<H3>Championship terminated. Well done '+players[sortedPlayers[0][0]].name+'</H3>';                    
                    playSound('dotraceClaps.mp3');
                } else {
                    btnFinishNext.innerHTML = 'Next Race ⏭<br>('+ (rangeNbRaces.value-maxRaceIndex-1) + ' left)';
                    btnFinishMenu.style.display = '';
                }
                
                btnFinishClose.style.display = 'none';

                showRibbon('<b>'+currentTrack.trackName+'</b><br>Well done<b>'+playersNamesHtml+'</b>',4500)
                setTimeout(function() {    
                    divFinishContainer.style.top = '50%';
                    
                }, 5000);
                

                break;
        }
        //rangeNbRaces.value
    }


    function fctMoveFromCommand(commandNb, simulateBool, boolSound = true) {

        value = parseInt(commandNb); // Convertit la valeur en nombre
        //console.info('🖱 fctMoveFromCommand : Clic sur',value,"simulate=",simulateBool);

        let startPos = pPos();  // Récupère la position actuelle
        let tmpElan = pElan();  // Récupère l'élan actuel
        
        // Calcul de la nouvelle position de fin
        let endPos = {
            x: startPos.x + tmpElan.x + delta[value].x,
            y: startPos.y + tmpElan.y + delta[value].y
        };

        //console.debug('🐞',startPos,endPos,tmpElan,delta[value]);

        if (!simulateBool) { //On bouge !
            //On cache le numpad
            if (numpad.style.display=='grid') {
                numpad.style.display = 'none';
                divSpeed.style.display = 'none';
            }              
            
            let divLastPoint = fctAddPointOnPath(endPos);
            if (fctTestPlayerOnFinish()) {
                //Son, on compte le nb win
                let nbWin = 1;
                for (let j=0;j<NbPlayers;j++) {
                    if (players[j].status == "FINISH") {
                        nbWin++;
                    }
                }
                let myPlayBack = 0.2 + (1.8 * (nbWin / 8));
                //console.log(myPlayBack);
                if (CurrentPlayer >= rangeNbHuman.value)  {
                    playSound('dotraceFinish.mp3',myPlayBack,letSoundMode,document.getElementById('rangeIaVolume').value);
                } else {
                    playSound('dotraceFinish.mp3',myPlayBack,letSoundMode);
                }
             
                let divMovePoint = document.getElementById('divMovePoint'+CurrentPlayer);
                divMovePoint.style.opacity = 0;
                divCadreZoom.style.opacity = 0;
                divCadreZoom2.style.opacity = 0;
                players[CurrentPlayer].status = "FINISH";

                if (CurrentPlayer < rangeNbHuman.value) {
                    if (!tracksBestScores[currentTrack.trackName] || (players[CurrentPlayer].path.length-1) < tracksBestScores[currentTrack.trackName].score) {
                        console.info('tracksBestScores',tracksBestScores);
                        // Mets à jour le meilleur score si le chemin est plus court
                        tracksBestScores[currentTrack.trackName] = { track: currentTrack.trackName, score: (players[CurrentPlayer].path.length-1) };                    
                        winMessageHuman = 'You win in '+(players[CurrentPlayer].path.length-1)+' steps !<br>New best score for ' + currentTrack.trackName + '!';
                        if (gameMode!='modeChamp')
                            showRibbon(winMessageHuman, 3000,players[CurrentPlayer].color);                        
                    } else {
                        winMessageHuman = 'You win in '+(players[CurrentPlayer].path.length-1)+' steps !<br>Try again to beat the best score!';
                        if (gameMode!='modeChamp')
                            showRibbon(winMessageHuman, 3000,players[CurrentPlayer].color);  
                    }
                } else {
                    if (!tracksIaScores[currentTrack.trackName] || (players[CurrentPlayer].path.length-1) < tracksIaScores[currentTrack.trackName].score) {
                        console.info('tracksIaScores',tracksIaScores);
                        winMessageIa = 'IA win in '+(players[CurrentPlayer].path.length-1)+' steps !';
                        tracksIaScores[currentTrack.trackName] = { track: currentTrack.trackName, score: (players[CurrentPlayer].path.length-1) };
                    }
                }

                if (gameMode=='modeChamp') {
                    champResults.push({raceIndex:champRaceIndex,playerId:CurrentPlayer,pathLength:(players[CurrentPlayer].path.length-1)});
                    //console.log(champResults);
                } else {
                    
                }

                fctAfficheRecord();
                divRankLoading.style.display = 'none';

                if (fctBoolPlayerRunning()) {
                    fctNextPlayer();
                    requestAnimationFrame(fctAffichageNext);
                } else {
                    fctCenterOnMap();
                    //showRibbon('<B>'+currentTrack.trackName + '</b><br> terminated 🏁',2000);
                    fctAfficheFinish();
                    // =================== Fin de course !
                }
                
            } else { // Le player n'a pas fini la course

                // Calcule la position précédente pour le calcul de l'élan
                let oldElan = pElanIndex(3);
                let oldSpeed = parseInt(100*Math.sqrt(Math.pow(oldElan.x, 2)+Math.pow(oldElan.y, 2)))/100
                let speed = parseInt(100*Math.sqrt(Math.pow(tmpElan.x + delta[value].x, 2)+Math.pow(tmpElan.y + delta[value].y, 2)))/100
                //let playBackMarker = (8-speed)*.5;
                let playBackMarker = -0.1*speed+1.3;
                let mp3file = 'dotraceMove.mp3';
                //console.log('playBackMarker',playBackMarker);
                playBackMarker = Math.max(playBackMarker,.5);
                playBackMarker = Math.min(playBackMarker,1.2);
                if (speed>oldSpeed) {
                    mp3file = 'dotraceMove.mp3';
                } else {
                    if (speed==oldSpeed) {
                        mp3file = 'dotraceCruise.mp3';
                    } else {
                        mp3file = 'dotraceSlow.mp3';
                    }
                }

                let transitionDelayMs = parseInt(document.getElementById('rangeDelayMoveHuman').value);
                let transitionDelaySec = (transitionDelayMs/1000)+'s';

                if (CurrentPlayer >= rangeNbHuman.value) { // IA Move
                    playSound(mp3file,playBackMarker,letSoundMode,document.getElementById('rangeIaVolume').value);
                    transitionDelayMs = parseInt(document.getElementById('rangeDelayMoveIa').value);
                    transitionDelaySec = (transitionDelayMs/1000)+'s';
                } else { // User move
                    //console.log('dotraceMove',mp3file,oldSpeed,speed,playBackMarker);
                    playSound(mp3file,playBackMarker,letSoundMode);
                }
                divLastPoint.style.opacity = 0;
                //Animation boule qui se déplace en .5s
                //console.log('glisse before',CurrentPlayer,startPos,endPos,divMovePoint.style.left,divMovePoint.style.top);
                let divMovePoint = document.getElementById('divMovePoint'+CurrentPlayer);
                divMovePoint.style.transition = 'top '+transitionDelaySec+' ease, left '+transitionDelaySec+' ease';
                divMovePoint.style.opacity = 1;                
                divMovePoint.innerHTML = players[CurrentPlayer].path.length-1;
                divMovePoint.style.left = cellSize * endPos.x +'px';
                divMovePoint.style.top = cellSize * endPos.y +'px';
                //console.log('glisse after',CurrentPlayer,startPos,endPos,divMovePoint.style.left,divMovePoint.style.top);
                
                
                fctNextPlayer();

                if (divRankLoading.style.display == 'none') {
                    divRankLoading.style.display = 'block';
                }
                divRankLoading.style.top = (53+parseInt(document.getElementById('divRank'+CurrentPlayer).style.top)) + 'px';
                //console.log(CurrentPlayer,players[CurrentPlayer].name);
                
                //Next joueur
                setTimeout(function() {
                    divLastPoint.style.opacity = 1;
                    
                    //On pré-positionne pour l'animation
                    tmpPos = pPos();
                    divMovePoint = document.getElementById('divMovePoint'+CurrentPlayer);
                    divMovePoint.style.opacity = 0;
                    divMovePoint.style.transition = '';
                    divMovePoint.style.left = cellSize * (tmpPos.x) +'px';
                    divMovePoint.style.top = cellSize * (tmpPos.y) +'px';
                    requestAnimationFrame(fctAffichageNext);

                }, transitionDelayMs);
            }
        } else {  // Mode Simulation
            //Maj du speedometer
            let speed = parseInt(100*Math.sqrt(Math.pow(tmpElan.x + delta[value].x, 2)+Math.pow(tmpElan.y + delta[value].y, 2)))/100
            divSpeed.innerHTML = speed;
            divSpeed.style.height = (speed*20)+15 + 'px';
            divSpeed.style.backgroundColor = valueToColorGradient(speed);
            fctSimuNextPointLine(startPos,endPos,players[CurrentPlayer].color);
            divNextPoint.style.opacity = 0;
            divNextLine.style.opacity = 0;

            if (boolSound && chkSoundPosition.checked) {
                let playBackMarker = -0.1*speed+1.3;            
                playBackMarker = Math.max(playBackMarker,.5);
                playBackMarker = Math.min(playBackMarker,1.2);
                playSound('dotracePosition.mp3',playBackMarker,letSoundMode);
            }

        }


    }
    //========================================================================
    //========================================================================
    //========================================================================

    //========================================================================
    //========================================================================
    //========================================================================
    function fctBestPlayerRunning() {
        let retId;
        let bestDist=0;
        for (let i=rangeNbHuman.value;i<NbPlayers;i++) {
            if (players[i].status=="RUN") {
                if (players[i].dist>bestDist) {
                    retId = i;
                    bestDist = players[i].dist;
                }
            }
        }
        return retId;
    }


    function fctHumanRun() {
        let retBool = false;
        for (let i=0;i<rangeNbHuman.value;i++) {
            if (players[i].status=="RUN") {
                retBool = true;
            }
        }
        return retBool;
    }


    function fctBoolPlayerRunning() {
        let retBool = false;
        for (let i=0;i<NbPlayers;i++) {
            if (players[i].status=="RUN") {
                retBool = true;
            }
        }
        return retBool;
    }

    function fctTestPlayerOnFinish() {
        tmpPos = pPos();
        return finishPoints.some(point => point.x === tmpPos.x && point.y === tmpPos.y);
    }


    function fctNextPlayer() {        
        if (CurrentPlayer>=NbPlayers-1) {
            fctShowRanking();
            CurrentPlayer = 0;
        } else {            
            CurrentPlayer++;
        }
        if (players[CurrentPlayer].status!="RUN") {
            fctNextPlayer();
        }
    
    }


    function fctShowRanking() {
        
        const rankingTable = [];
        for (let i = 0; i < NbPlayers; i++) {
            //const playerDistance = pDistanceTotale(i);
            let playerDistance = players[i].dist;
            if (players[i].status == 'FINISH') {
                playerDistance = Math.pow(10,10)-players[i].path.length; // 1 million
            }
            rankingTable.push({ playerId: i, distance: playerDistance });
        }
        // Trier le tableau par vitesse moyenne décroissante (du plus rapide au plus lent)
        rankingTable.sort((a, b) => b.distance - a.distance);   
        //console.log('🗂 fctShowRanking rankingTable',rankingTable) ;
        BestIaPlayerId = -1;
        rankingTable.forEach((entry, index) => {
            let myDiv = document.getElementById('divRank'+entry.playerId);
            myDiv.style.top = (index*20)+'px';
            let html = playersNames[entry.playerId].split(" ").pop();
            if (entry.playerId<rangeNbHuman.value) {
                html += ' 👨';
            } else {
                if (BestIaPlayerId == -1) {
                    BestIaPlayerId = entry.playerId;
                }
            }
            if (gameMode=='modeChamp' && champRaceIndex != 0) {
                html += ' <div class="classNumber">' + (players[entry.playerId].champRanking+1) + '</div>';
                
            }
            if (players[entry.playerId].status == 'FINISH') {
                html = players[entry.playerId].path.length + '🏁 ' + html;
            }
            if (players[entry.playerId].status == 'CRASH') {
                html = '❌ ' + html;
            }
            myDiv.innerHTML = html;
        });
    }    

    // =================================================================
    // =================================================================
    function fctBoolPlayerOnPos(posTest) {
        let returnBool = true;
        for (let i = 0; i < NbPlayers; i++) {
            let tmpPlayerPo = pPlayerPos(i);
            if (players[i].status=="RUN") {
                if (tmpPlayerPo.x === posTest.x && tmpPlayerPo.y === posTest.y) {
                    returnBool = false;
                }
            }
        }
        return returnBool;
    }
    function fctCaseLibre(posTest,boolPlayers = true) {
        let returnBool = true;
        if (boolPlayers) {
            for (let i = 0; i < NbPlayers; i++) {
                let tmpPlayerPo = pPlayerPos(i);
                //console.debug('tmpPos',tmpPos);
                if (players[i].status=="RUN") {
                    if (tmpPlayerPo.x === posTest.x && tmpPlayerPo.y === posTest.y) {
                        returnBool = false;
                        //playSound('gribouille.mp3',4);
                    }
                }
            }
        }
        if (posTest.x<0 || posTest.y<0 || posTest.x>=cellNbX || posTest.y>=cellNbY) {
            returnBool = false;
        } else {
            if (currentTrack.trackPoints[posTest.y][posTest.x]==' ')
                returnBool = false;
        } 

        if (players[CurrentPlayer].tracePoints.some(point => point.x === (posTest.x) && point.y === (posTest.y))) {
            returnBool = false;
            //console.log('➰ player',CurrentPlayer);
        }
        if (players[CurrentPlayer].path.some(point => point.x === (posTest.x) && point.y === (posTest.y))) {
            returnBool = false;
        }
        return returnBool;
    }
    function fctCaseFinish(posTest) {
        let returnBool = false;
        if (posTest.x<0 || posTest.y<0 || posTest.x>=cellNbX || posTest.y>=cellNbY) {
            returnBool = false;
        } else {
            if (currentTrack.trackPoints[posTest.y][posTest.x]=='@')
                returnBool = true;
        }  
        return returnBool;
    }


    function getPointsBetween(start, end, width) {
        const points = [];
        const dx = end[0] - start[0];
        const dy = end[1] - start[1];
        const steps = Math.max(Math.abs(dx), Math.abs(dy));
    
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const x = Math.round(start[0] + t * dx);
            const y = Math.round(start[1] + t * dy);
    
            // Add points within the specified width
            for (let w = -width; w <= width; w++) {
                for (let h = -width; h <= width; h++) {
                    if (Math.abs(w) + Math.abs(h) <= width) {
                        //=======Ajout test si piste ou foret !
                        // + ajout test si point pas déjà dans les "points" (pas de double dans points)
                        points.push([x + w, y + h]);
                    }
                }
            }
        }
    
        return points;
    }
    


    // =================================================================
    // =================================================================

    function rechercheRecursive(button_x, button_y, elan_x, elan_y, depth, rangeIaDepthCurrent,countRecursivePerDepth) {
        let dist = 0;
        if (!countRecursivePerDepth[0]) {
            dist = Math.sqrt(Math.pow(button_x-tmpPos.x, 2) + Math.pow(button_y-tmpPos.y, 2));
            countRecursivePerDepth[0] = { sum: 0, best:dist,count: 0,same:0 }; 
        }
        //console.log('➿',button_x, button_y, elan_x, elan_y, depth, rangeIaDepthCurrent,countRecursivePerDepth);
        if (depth > rangeIaDepthCurrent) {
            return countRecursivePerDepth; // Arrêt de la récursion si la profondeur max est atteinte
        }
    
        // Initialiser le tableau si nécessaire pour le niveau de profondeur actuel
        if (!countRecursivePerDepth[depth]) {
            countRecursivePerDepth[depth] = { sum: 0, best:0,count: 0,status:'', same:0 }; 
        }
    
        for (let i = 1; i <= 9; i++) {
            //console.log('➿',i);
            let button_i_x = button_x + elan_x + delta[i].x;
            let button_i_y = button_y + elan_y + delta[i].y;
            let posTest_i = { x: button_i_x, y: button_i_y };
    
            if (fctCaseLibre(posTest_i, false)) {
                let currentScore;

                //currentScore = Math.sqrt(Math.pow(button_x-button_i_x, 2) + Math.pow(button_y-button_i_y, 2));

                // Calcul du score en fonction de la profondeur et de l'élan
                //let currentScore = Math.pow(Math.pow(posTest_i.x-tmpPos.x, 2) + Math.pow(posTest_i.y-tmpPos.y, 2),3);
                //let currentScore = Math.sqrt(Math.pow(posTest_i.x-tmpPos.x, 2) + Math.pow(posTest_i.y-tmpPos.y, 2));
                currentScore = Math.sqrt(Math.pow(posTest_i.x-tmpPos.x, 2) + Math.pow(posTest_i.y-tmpPos.y, 2));
                //let lastDistance = Math.sqrt(Math.pow(posTest_i.x-button_x, 2) + Math.pow(posTest_i.y-button_y, 2));
                let maxDist = Math.max(Math.abs(posTest_i.x-button_x),Math.abs(posTest_i.y-button_y));
                //console.log(posTest_i.x,tmpPos.x,posTest_i.y,tmpPos.y,currentScore);
                //let currentScore = Math.sqrt(Math.pow(button_x-button_i_x, 2) + Math.pow(button_y-button_i_y, 2));
                //let currentScore = depth;
                if (fctCaseFinish(posTest_i)) {
                    //currentScore += 10 * currentScore; // Bonus si la case est une case de fin
                    for (let j=depth;j<=rangeIaDepthCurrent;j++) {
                        if (!countRecursivePerDepth[j]) {
                            countRecursivePerDepth[j] = { sum: 0, best:0, count: 0, status:'FINISH',same: 0}; 
                        }
                        countRecursivePerDepth[j].sum += (currentScore+j) * Math.pow(10, j);
                        countRecursivePerDepth[j].best = Math.pow(10, j)+countRecursivePerDepth[j-1].best;
                        countRecursivePerDepth[j].count = 1;
                        countRecursivePerDepth[j].status = 'FINISH';

                    }
                    //countRecursivePerDepth[rangeIaDepth.value] = Math.pow(10, depth);;
                } else {
                    //console.log(currentScore);
                    if (button_i_x==button_x && button_i_y==button_y) {
                        //countRecursivePerDepth[depth].sum += -.1;
                        countRecursivePerDepth[depth].same += 1;
                        //countRecursivePerDepth[depth].best = .1;
                        //countRecursivePerDepth[depth].count += 1;
                    } else {
                        /*if (currentScore>countRecursivePerDepth[depth]) {
                            countRecursivePerDepth[depth] = currentScore;
                        }*/
                        /*if (maxDist>=(rangeIaDepthCurrent*1.5)) { //Ton moulin va trop vite
                            currentScore = 1;
                            for (let j=depth;j<=rangeIaDepthCurrent;j++) {
                                if (!countRecursivePerDepth[j]) {
                                    countRecursivePerDepth[j] = { sum: 0, best:0, count: 0, status:'toofast', same: 0}; 
                                }
                                countRecursivePerDepth[j].sum += currentScore;
                                countRecursivePerDepth[j].count += 1;
                                //countRecursivePerDepth[j].toofast += 1;
                                if (countRecursivePerDepth[j].best<currentScore) {
                                    countRecursivePerDepth[j].best = currentScore;
                                }
                            }
                        } else {*/
                            if (countRecursivePerDepth[depth].best<currentScore) {
                                countRecursivePerDepth[depth].best = currentScore;
                            }
                            countRecursivePerDepth[depth].sum += currentScore;
                            countRecursivePerDepth[depth].count += 1;
                            // Appel récursif pour le niveau de profondeur suivant
                            countRecursivePerDepth = rechercheRecursive(button_i_x, button_i_y, elan_x + delta[i].x, elan_y + delta[i].y, depth + 1, rangeIaDepthCurrent, countRecursivePerDepth);
                        //}
                    }              
                    
                }
            }
        }
    
        return countRecursivePerDepth;
    }
    

    // =================================================================
    // =================================================================
    function fctAffichageNext() {

        // Vérifier si le jeu est en pause
        if (isPaused) {
            return; // Si en pause, ne pas continuer la boucle
        }

        tmpPos = pPos();
        tmpElan = pElan();
        

        // Human Mode
        if (CurrentPlayer < rangeNbHuman.value) {
            //console.debug('===================🐞',tmpPos,tmpElan);
            //Nettoyage...
            buttons.forEach(button => {
                button.innerHTML = '';
            });
            divButtons.forEach(div => {
                div.style.backgroundColor = 'darkgrey';
            });
            //Color numpad
            numpad.style.backgroundColor = fctRbg2Rgba(players[CurrentPlayer].color,.5);
        }


        let nbBoutonsMorts = 0;
        let bestButton = [];
        let bestId =0;
        let bestTotal =0;
        let elanInitial = Math.sqrt(Math.pow(tmpElan.x, 2)+Math.pow(tmpElan.y, 2));
        let rangeIaDepthCurrent = players[CurrentPlayer].iaDepth;
        //console.log('========⚡',CurrentPlayer,rangeIaDepthCurrent);
        buttons.forEach(button => {
            let countRecursivePerDepth = [];

            const value = button.getAttribute('data-value');
            let button_x = tmpPos.x + tmpElan.x + delta[value].x;
            let button_y = tmpPos.y + tmpElan.y + delta[value].y;
            let elanFinal = Math.sqrt(Math.pow(tmpElan.x + delta[value].x, 2)+Math.pow(tmpElan.y + delta[value].y, 2));
            let elanMax = Math.max(Math.abs(tmpElan.x + delta[value].x)+Math.abs(tmpElan.y + delta[value].y));
            let posTest = {x:button_x,y:button_y};
            //console.info(value,tmpPos,button_x+'_'+button_y+'_',fctCaseLibre(posTest));
            if (fctCaseLibre(posTest,true)) {
                //=================================
                //======= La case est dispo
                //=================================
                if (CurrentPlayer < rangeNbHuman.value) {
                    button.disabled = false; // Active le bouton
                    button.innerHTML = "";
                    button.style.cursor = 'pointer';
                    button.style.backgroundColor = valueToColor(elanInitial-elanFinal);
                    button.style.opacity = 1;
                }
                let retNbCasesLibres = 0;

                if (fctCaseFinish(posTest)) {
                    if (CurrentPlayer < rangeNbHuman.value) {
                        button.innerHTML = "🏁";
                    }
                    bestId = value;
                    bestTotal = 9999999999999;
                    button.style.backgroundColor = 'white';
                } else {
                    // Appel initial de la fonction récursive

                    
                    countRecursivePerDepth = rechercheRecursive(button_x, button_y, tmpElan.x + delta[value].x, tmpElan.y + delta[value].y, 1,rangeIaDepthCurrent,countRecursivePerDepth);
                    //console.log('⚡⚡',CurrentPlayer,value,countRecursivePerDepth);
                    
                    // Pour calculer la moyenne pour chaque profondeur :
                    /*for (let depth in countRecursivePerDepth) {
                        if (countRecursivePerDepth[depth].count > 0) {
                            let average = countRecursivePerDepth[depth].sum / countRecursivePerDepth[depth].count;
                            console.log(`Average at depth ${depth}: ${average}`);
                        }
                    }*/

                    if (countRecursivePerDepth[rangeIaDepthCurrent]) {

                        //retNbCasesLibres = countRecursivePerDepth[1].best;
                        /*for (let i=1;i<=rangeIaDepthCurrent;i++) {
                            if (countRecursivePerDepth[i].best) {

                                retNbCasesLibres += countRecursivePerDepth[i].best;
                                //retNbCasesLibres += parseFloat(countRecursivePerDepth[i].sum / (countRecursivePerDepth[i].count+countRecursivePerDepth[i].same));
                            }                            
                        }*/
                        if (countRecursivePerDepth[rangeIaDepthCurrent].best!=0) {
                            retNbCasesLibres = countRecursivePerDepth[rangeIaDepthCurrent].best;
                            let valTest = retNbCasesLibres;
                            for (let k=(rangeIaDepthCurrent-1);k>=0;k--) {     
                                if (countRecursivePerDepth[k].best==valTest)
                                    retNbCasesLibres += .2;
                            }
                            if (countRecursivePerDepth[rangeIaDepthCurrent].sum!=0) {
                                //retNbCasesLibres += 1/countRecursivePerDepth[rangeIaDepthCurrent].sum;
                                retNbCasesLibres += 1/(countRecursivePerDepth[rangeIaDepthCurrent].sum/countRecursivePerDepth[rangeIaDepthCurrent].count);
                            }
                        } else {
                            for (let k=(rangeIaDepthCurrent-1);k>=0;k--) {
                                if (countRecursivePerDepth[k].best!=0 && retNbCasesLibres==0) {
                                    //console.log(k,countRecursivePerDepth[k].best);
                                    retNbCasesLibres = countRecursivePerDepth[k].best;
                                }
                            }
                        }
                        
                        //retNbCasesLibres = ;
                        
                        /*
                        for (let i=1;i<=rangeIaDepthCurrent;i++) {
                            if (countRecursivePerDepth[i].sum) {
                                retNbCasesLibres += parseFloat(countRecursivePerDepth[i].sum/Math.pow(1000,i));
                                //retNbCasesLibres += parseFloat(countRecursivePerDepth[i].sum / countRecursivePerDepth[i].count);
                                //retNbCasesLibres += parseFloat(countRecursivePerDepth[i].sum / Math.sqrt(countRecursivePerDepth[i].count));
                                //console.log(retNbCasesLibres);
                            }                            
                        }*/
                        //retNbCasesLibres = countRecursivePerDepth[rangeIaDepthCurrent].count;
                        //retNbCasesLibres = countRecursivePerDepth[rangeIaDepthCurrent].sum;
                        if (CurrentPlayer < rangeNbHuman.value) {
                            button.innerHTML = '';
                        }
                    
                        
                            if (countRecursivePerDepth[rangeIaDepthCurrent].status=='FINISH') {
                                if (retNbCasesLibres>bestTotal) {
                                    bestTotal = retNbCasesLibres;
                                    bestId = value;
                                }
                                //Compte le meilleur
                                //console.log('🎯',rangeIaDepthCurrent,countRecursivePerDepth);
                                if (checkTipTarget.checked) {
                                    let cptTarget=rangeIaDepthCurrent;
                                    for (let k=rangeIaDepthCurrent;k >= 1;k--) {
                                        if (countRecursivePerDepth[k].status=='FINISH') {
                                            cptTarget = k;
                                        }
                                    }
                                    button.innerHTML = '🎯'+cptTarget;
                                }

                            } else {
                                if (retNbCasesLibres>bestTotal) {
                                    if (parseInt(rangeIaDepthCurrent-elanMax)>=(-1*rangeIaAggress.value)) {
                                        bestTotal = retNbCasesLibres;
                                        bestId = value;
                                    } else { //trop vite !
                                        //let newScore = retNbCasesLibres/Math.pow(100,rangeIaDepthCurrent);
                                        let newScore = retNbCasesLibres/Math.pow(100,rangeIaDepthCurrent);
                                        if (newScore>bestTotal) {
                                            bestTotal = newScore;
                                            bestId = value;
                                        }
                                        if (CurrentPlayer < rangeNbHuman.value) {
                                            button.innerHTML = "❓"+parseInt(rangeIaDepthCurrent-elanMax);
                                        }
                                    }
                                }
                            }
                        
                        //console.log(value,'retNbCasesLibres',retNbCasesLibres,'elanMax',elanMax,'rangeIaDepthCurrent',rangeIaDepthCurrent,'bestTotal',bestTotal,'bestId',bestId);
                    } else {
                        if (checkTipLoose.checked) {
                            if (CurrentPlayer < rangeNbHuman.value) {
                                button.innerHTML = "💀"+countRecursivePerDepth.length;
                                divButtons[value-1].style.backgroundColor = 'black';
                            }
                        }
                    } 

                    
                }

                bestButton.push({id:value,score:elanFinal,table:countRecursivePerDepth,final:retNbCasesLibres});

                //console.log('💨',value,bestId,retNbCasesLibres);
                
                /*if (parseInt(retNbCasesLibres*Math.pow(elanFinal,3))>bestTotal) {
                    bestTotal = parseInt(retNbCasesLibres*Math.pow(elanFinal,3));
                    bestId = value;
                    //console.log('Best',bestId,bestTotal)
                }*/

            } else {
                if (CurrentPlayer < rangeNbHuman.value) {
                    button.disabled = true; // Désactive le bouton
                    button.style.cursor = 'default';
                    button.style.backgroundColor = 'black';
                    button.style.opacity = .8;
                    if (fctCaseLibre(posTest,false)) {
                        divButtons[value-1].style.backgroundColor = '#033649';
                    } else {
                        divButtons[value-1].style.backgroundColor = 'darkgreen';
                    }
                    
                    //console.info(value,button_x+'_'+button_y+'_',pos);
                }
                nbBoutonsMorts++;
            }
        });
        //console.log('bestButton',bestButton,'bestId',bestId,'nbBoutonsMorts',nbBoutonsMorts);
        // Appliquer une bordure blanche sur le bouton sélectionné
        if (CurrentPlayer < rangeNbHuman.value) {
            let btnBest = document.getElementById('btn' + bestId);
            if (btnBest && checkTipBest.checked) {
                //btnBest.style.border = '4px solid white';
                btnBest.innerHTML += '💚';
                divButtons[bestId-1].style.backgroundColor = 'white';
            }                
        }

        if (nbBoutonsMorts == 9) { // Le joueur ne peut plus jouer...
            let timeDelay = 0;
            if (players[CurrentPlayer].status=="RUN") {
                if (CurrentPlayer >= rangeNbHuman.value)  {
                    playSound('dotraceCrash.mp3',1,letSoundMode,document.getElementById('rangeIaVolume').value);
                } else {
                    playSound('dotraceCrash.mp3',1,letSoundMode);
                }
                divCadreZoom.style.opacity = 0;
                divCadreZoom2.style.opacity = 0;
                divNextLine.style.opacity = 0;
                divNextPoint.style.opacity = 0;
                
                if (CurrentPlayer < rangeNbHuman.value) {
                    //fctCenterOnMap();
                    winMessageHuman = 'Human player loose 😥 after '+players[CurrentPlayer].path.length+' steps !';
                    if (gameMode!='modeChamp')
                        showRibbon(winMessageHuman, 2000,players[CurrentPlayer].color);
                    timeDelay = 2500;
                }
                players[CurrentPlayer].record=players[CurrentPlayer].path.length;
                players[CurrentPlayer].status = "CRASH";
                let crashPoint = {x:tmpPos.x+tmpElan.x,y:tmpPos.y+tmpElan.y};
                let divCrashPoint = fctAddPointOnPath(crashPoint);
                divCrashPoint.classList.add('pointCrashed');
                divCrashPoint.innerHTML = "";
                if (gameMode=='modeChamp') {
                    champResults.push({raceIndex:champRaceIndex,playerId:CurrentPlayer,pathLength:999999});
                }
                
            }
            setTimeout(function() {    
                if (fctBoolPlayerRunning()) {
                    fctNextPlayer();
                    requestAnimationFrame(fctAffichageNext);
                } else {
                    fctCenterOnMap();
                    fctAfficheFinish();
                }
            }, timeDelay);
          
        } else { //Des cases sont dispos
            
            if (bestId==0) { // mais aucune n'est la meilleur...
                // Initialiser les variables pour stocker le meilleur bouton et son score
                let bestButtonWithMaxScore = bestButton[0];
                for (let i = 1; i < bestButton.length; i++) {
                    if (bestButton[i].score < bestButtonWithMaxScore.score) {
                        bestButtonWithMaxScore = bestButton[i];
                    }
                }
                // Récupérer l'id du meilleur score faible
                bestId = bestButtonWithMaxScore.id;
                console.log('🤪 CurrentPlayer',CurrentPlayer,'Aucune touche interessante... ',bestButton,bestButtonWithMaxScore,bestId);
                if (CurrentPlayer >= rangeNbHuman.value)  {
                    playSound('dotraceDrift.mp3',1,letSoundMode,document.getElementById('rangeIaVolume').value);
                }else {
                    playSound('dotraceDrift.mp3',1,letSoundMode);
                }

            }
            if (CurrentPlayer >= rangeNbHuman.value)  {
                //console.log('🤖 IA MOVE !', bestId);
                if (bestId) {
                    fctMoveFromCommand(bestId,false);
                }
                if (chkFollowIa.checked && !fctHumanRun() && (fctBestPlayerRunning()==CurrentPlayer)) {
                    fctCenterOnPoint(false);               
                }                   
                
            } else { // Au tour du user
                //On affiche le numpad
                numpad.style.display = 'grid';
                divSpeed.style.display = 'block';
                divCadreZoom.style.opacity = .5;
                divCadreZoom2.style.opacity = .2;

                tmpPos = pPos();
                tmpElan = pElan();

                if (chkFollowPoint.checked)
                    fctCenterOnPoint();

                //showRibbon('<B>'+currentTrack.trackName + '</b><br>Your turn<br><b>'+players[CurrentPlayer].name+'</b> 👨 !', 1000,players[CurrentPlayer].color);
                fctMoveFromCommand(5,true,false);
                divRankLoading.style.display = 'none';
            }
        }
    }


    //================================================================================
    //================================================================================




    function generateTrackWithAngles(width = 1000, height = 1000) {
        console.log('generateTrackWithAngles');

        let nbChoc=0;
        let nbFail=0;
        let trackGrid = Array.from({ length: height }, () => ' '.repeat(width).split(''));
    
        // Initialisation et configuration de la piste
        let currentX = Math.floor(width / 2);
        let currentY = Math.floor(height / 2);
        let currentAngle = Math.random() * 360;
        //let trackWidth = 2;
        let trackLength = 100 + Math.floor(Math.random() * 50);
        let sectionLength = 3 + Math.floor(Math.random() * 5);
        let stepSectionIndex = 0;
        let NewSectionStep = 0;
        //trackWidth = parseInt(rangeGTtrackWidthMin.value) + Math.floor(Math.random() * parseInt(rangeGTtrackWidthMax.value-rangeGTtrackWidthMin.value));
        let sectionTrackWidth;
        trackLength = parseInt(rangeGTtrackLengthMin.value) + Math.floor(Math.random() * parseInt(rangeGTtrackLengthMax.value-rangeGTtrackLengthMin.value));
        //console.log(rangeGTtrackLengthMin.value,rangeGTtrackLengthMax.value,(rangeGTtrackLengthMax.value-rangeGTtrackLengthMin.value));//
        //sectionLength = rangeGTsectionLength.value;
        let currentSectionLength = sectionLength;
        zoneStartFinishWidth = 2;

        //console.log('generateTrackWithAngles','trackLength',trackLength);

        // Fonction pour convertir l'angle en déplacement
        function angleToDelta(angle, distance = 1) {
            const rad = (Math.PI / 180) * angle;
            return {
                dx: Math.round(Math.cos(rad) * distance),
                dy: Math.round(Math.sin(rad) * distance)
            };
        }
    
        // Marquer le départ
        for (let x = -zoneStartFinishWidth; x < zoneStartFinishWidth; x++) {
            for (let y = -zoneStartFinishWidth; y < zoneStartFinishWidth; y++) {
                if (currentX + x < width && currentY + y < height) {
                    if ((x + y) % 2 == 0) { // motif damier
                        trackGrid[currentY + y][currentX + x] = '#';
                    } else {
                        trackGrid[currentY + y][currentX + x] = '*';
                    }
                }
            }
        }
        let oldsectionTrackWidth = zoneStartFinishWidth;
        // Générer la piste
        for (let step = 0; step <= trackLength; step++) {
            
            if (step === stepSectionIndex) {
                //console.log('trackGrid',trackGrid.map(row => row.join('')));
                let testCasesLibres = true;
                let originalAngle = currentAngle;
                let countBlock = 0;
                oldsectionTrackWidth = sectionTrackWidth;
                do {        
                    testCasesLibres = true;

                    let turnAngle = parseInt(rangeGTturnAngleMin.value) + Math.floor(Math.random() * parseInt(rangeGTturnAngleMax.value-rangeGTturnAngleMin.value+1));
                    if (Math.random() < 0.5) {
                        turnAngle = turnAngle * -1;
                    }
                    if (countBlock>2) {
                        turnAngle = countBlock*5-90; //countBlock = 36 max
                    }
                    //const turnAngle = (Math.random() * (maxTurnAngle * 2) - maxTurnAngle);
                    currentAngle = (originalAngle + turnAngle + 360) % 360;
                    sectionTrackWidth = parseInt(rangeGTtrackWidthMin.value) + Math.floor(Math.random() * parseInt(rangeGTtrackWidthMax.value-rangeGTtrackWidthMin.value+1));
                    
                    currentSectionLength = parseInt(rangeGTsectionLengthMin.value) + Math.floor(Math.random() * (parseInt(rangeGTsectionLengthMax.value)-parseInt(rangeGTsectionLengthMin.value)+1));
                    stepSectionIndex = step+currentSectionLength;
                    //console.log('Test section turnAngle=',turnAngle,'currentAngle',currentAngle,'sectionTrackWidth',sectionTrackWidth,'currentSectionLength',currentSectionLength);
                    const { dx, dy } = angleToDelta(currentAngle, 2);
                    //Test anti-loop
                    
                    for (let k=oldsectionTrackWidth+1;k<=currentSectionLength+2;k++) {
                        let testCurrentX = currentX + k*dx;
                        let testCurrentY = currentY + k*dy;
                        let chercheAutour = sectionTrackWidth+1;
                        //console.log(k,testCurrentX,testCurrentY);
                        for (let x = -chercheAutour; x < chercheAutour; x++) {
                            for (let y = -chercheAutour; y < chercheAutour; y++) {
                                if (testCurrentX + x < width && testCurrentY + y < height && testCurrentX + x > 0 && testCurrentY + y > 0) {
                                    if (trackGrid[testCurrentY + y][testCurrentX + x] !== ' ') {
                                        testCasesLibres = false;
                                        //console.log(currentX,currentY,dx,dy,testCurrentX,testCurrentY,`Collision en (${testCurrentX + x}, ${testCurrentY + y})`);
                                        break;
                                    }
                                }
                            }
                            if (!testCasesLibres) break;
                        }
                        if (!testCasesLibres) break;   
                    }
                    
                    //Grosse boule au bout :
                    let testCurrentX = currentX + currentSectionLength*dx;
                    let testCurrentY = currentY + currentSectionLength*dy;
                    let chercheAutour = sectionTrackWidth+parseInt(rangeGTsectionGap.value);
                    for (let x = -chercheAutour; x < chercheAutour; x++) {
                        for (let y = -chercheAutour; y < chercheAutour; y++) {
                            if (testCurrentX + x < width && testCurrentY + y < height && testCurrentX + x > 0 && testCurrentY + y > 0) {
                                if (trackGrid[testCurrentY + y][testCurrentX + x] !== ' ') {
                                    testCasesLibres = false;
                                    //console.log(currentX,currentY,dx,dy,testCurrentX,testCurrentY,`Collision en (${testCurrentX + x}, ${testCurrentY + y})`);
                                    break;
                                }
                            }
                        }
                        if (!testCasesLibres) break;
                    }


                    //console.log('countBlock',countBlock,testCasesLibres);
                    countBlock++;
                    NewSectionStep = 0;
                    if (!testCasesLibres) {
                        nbChoc++;
                        console.log('Section 💥','step',step,'countBlock',countBlock,'turnAngle',turnAngle,'currentAngle',currentAngle,'sectionTrackWidth',sectionTrackWidth,'currentSectionLength',currentSectionLength);
                    }
                        
                    
                } while(!testCasesLibres && countBlock<36);

                if (countBlock==36) {
                    nbFail++;
                }
            }

            const { dx, dy } = angleToDelta(currentAngle, 2);
            currentX += dx;
            currentY += dy;
            //console.log('------------------- step',step,currentX,currentY);
            currentX = Math.max(1, Math.min(width - sectionTrackWidth - 1, currentX));
            currentY = Math.max(1, Math.min(height - sectionTrackWidth - 1, currentY));

            let dynamikWith = sectionTrackWidth;
            if (step!=0 && step!=trackLength)
                if ((NewSectionStep<sectionTrackWidth-3) || (stepSectionIndex-step)<sectionTrackWidth-2)
                    dynamikWith = 1;
            
            NewSectionStep++;
            for (let x = -dynamikWith; x < dynamikWith; x++) {
                for (let y = -dynamikWith; y < dynamikWith; y++) {
                    const distance = Math.sqrt(x * x + y * y);
                    if (distance<(dynamikWith+1)) {
                        if (currentX + x < width && currentY + y < height && currentX + x > 0 && currentY + y > 0) {
                            if (trackGrid[currentY + y][currentX + x] !== '#' && trackGrid[currentY + y][currentX + x] !== '*') {
                                trackGrid[currentY + y][currentX + x] = '*';
                            }
                        }
                    }

                }
            }
            
        }
    
        // Marquer l'arrivée avec des '@'
        for (let x = -zoneStartFinishWidth; x < zoneStartFinishWidth; x++) {
            for (let y = -zoneStartFinishWidth; y < zoneStartFinishWidth; y++) {
                if (currentX + x < width && currentY + y < height && currentX + x > 0 && currentY + y > 0) {
                    if ((x + y) % 2 == 0) { // motif damier
                        trackGrid[currentY + y][currentX + x] = '@';
                    } else {
                        trackGrid[currentY + y][currentX + x] = '*';
                    }
                }
            }
        }
    
        function shrinkAndCenterTrackGrid(trackGrid, padding = 5) {
            const originalHeight = trackGrid.length;
            const originalWidth = trackGrid[0].length;
    
            let top = 0, bottom = originalHeight - 1;
            let left = originalWidth, right = 0;
    
            for (let y = 0; y < originalHeight; y++) {
                if (trackGrid[y].includes('*') || trackGrid[y].includes('@') || trackGrid[y].includes('#')) {
                    top = y;
                    break;
                }
            }
    
            for (let y = originalHeight - 1; y >= 0; y--) {
                if (trackGrid[y].includes('*') || trackGrid[y].includes('@') || trackGrid[y].includes('#')) {
                    bottom = y;
                    break;
                }
            }
    
            for (let y = top; y <= bottom; y++) {
                for (let x = 0; x < originalWidth; x++) {
                    if (trackGrid[y][x] === '*' || trackGrid[y][x] === '@' || trackGrid[y][x] === '#') {
                        left = Math.min(left, x);
                        right = Math.max(right, x);
                    }
                }
            }
    
            const trimmedGrid = trackGrid.slice(top, bottom + 1).map(row => row.slice(left, right + 1));
            const trimmedHeight = trimmedGrid.length;
            const trimmedWidth = trimmedGrid[0].length;
    
            const blankRow = ' '.repeat(trimmedWidth + padding * 2).split('');
            const centeredGrid = Array(padding).fill(blankRow.slice());
    
            trimmedGrid.forEach(row => {
                if (typeof row === 'string') row = row.split('');  // Conversion en tableau de caractères si nécessaire
                const paddedRow = ' '.repeat(padding).split('').concat(row, ' '.repeat(padding).split(''));
                centeredGrid.push(paddedRow);
            });
    
            centeredGrid.push(...Array(padding).fill(blankRow.slice()));
            return centeredGrid;
        }
        //console.log(trackGrid);
        trackGrid = shrinkAndCenterTrackGrid(trackGrid);
    
        // Convertir la grille finale en tableau de chaînes
        let maTrackGrid = trackGrid.map(row => row.join(''));
        currentTrack.trackPoints = maTrackGrid;

        // Track Name Generator
        let trackNamePart1 = [
            'Banana', 'Crazy', 'Donut', 'Funky', 'Giggle', 'Hilarious', 'Jellybean', 'Laughing', 'Marshmallow',
            'Noodle', 'Pizza', 'Quirky', 'Rainbow', 'Silly', 'Taco', 'Down', 'Volcano', 'Wacky',
            'Bend', 'Cactus', 'Dash', 'Forest', 'Gorge', 'Hilltop', 'Junction', 'Lagoon', 'Mountain',
            'Nook', 'Pie', 'Quarry', 'Rampage', 'Sahara', 'Town', 'U-Turn', 'Valley', 'Waterfall','Boun','Bounito'
        ];        
        let trackNamePart2 = [
            'Raceway', 'Circuit', 'Track', 'Speedway', 'GrandPrix', 'Highway', 'Loop', 'Mile',
            'Nascar', 'Parkway', 'Asphalt', 'Road', 'Path', 'Street'
        ];
        
        function getRandomElement(array) {
            return array[Math.floor(Math.random() * array.length)];
        }
        
        function generateTrackName() {
            let part1 = getRandomElement(trackNamePart1);
            let part2 = getRandomElement(trackNamePart2);        
            return `${part1} ${part2}`.trim();
        }   
        

        currentTrack.trackName = generateTrackName() + '🎲';
        divTitleTrackName.innerHTML = currentTrack.trackName + ' by boun';
        
        divGTmessage = document.getElementById('divGTmessage');
        divGTmessage.innerHTML = '';
        if (nbChoc!=0)
            divGTmessage.innerHTML += '⚠ ' + nbChoc + ' hits';
        if (nbFail!=0)
            divGTmessage.innerHTML += ' 💥' + nbFail + ' fails';
        
    }
    
    








    //================================================================================
    //================================================================================

    function fctCenterOnPoint(boolElan = true) {
        let deltaXX;
        let deltaYY;
        if (boolElan) {
            deltaXX = tmpPos.x + tmpElan.x + tmpElan.x;
            deltaYY = tmpPos.y + tmpElan.y + tmpElan.y;
        } else {
            deltaXX = tmpPos.x;
            deltaYY = tmpPos.y;
        }

        let point = { x: deltaXX, y: deltaYY };
        let elanInitial = Math.sqrt(Math.pow(tmpElan.x, 2)+Math.pow(tmpElan.y, 2));
        //Maj du scale en fonction de l'élan
        scale = rangeZoomScale.value-(elanInitial*rangeZoomElan.value);

        let trackX = cellSize*currentTrack.trackPoints[0].length;
        let trackY = cellSize*currentTrack.trackPoints.length;
        let windowWidth = document.documentElement.clientWidth;
        let windowHeight = document.documentElement.clientHeight;
        let deltaX = (windowWidth - trackX) / 2;
        let deltaY = (windowHeight - trackY) / 2;    
        // Ajustement pour centrer sur le point donné
        deltaX += ((trackX/2) - (cellSize * point.x)) * scale;
        deltaY += ((trackY/2) - (cellSize * point.y)) * scale;
        grid.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scale})`;
    }
    function fctCenterOnMapZoom() {
        // Dimensions de la carte (track)
        let trackX = cellSize * currentTrack.trackPoints[0].length;
        let trackY = cellSize * currentTrack.trackPoints.length;        
        // Dimensions de la fenêtre (document)
        let windowWidth = document.documentElement.clientWidth;
        let windowHeight = document.documentElement.clientHeight;    
        // Calculer les ratios de mise à l'échelle pour faire tenir la carte dans la fenêtre
        let scaleX = windowWidth / trackX;
        let scaleY = windowHeight / trackY;    
        // Le plus petit ratio est le facteur de mise à l'échelle pour tout faire tenir
        scale = Math.max(scaleX, scaleY);
        // Calculer la translation nécessaire pour centrer la carte
        let deltaX = (windowWidth - trackX) / 2;
        let deltaY = (windowHeight - trackY) / 2;    
        // Appliquer la transformation : translation et mise à l'échelle
        grid.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scale})`;
    }
    function fctCenterOnMap() {
        // Dimensions de la carte (track)
        let trackX = cellSize * currentTrack.trackPoints[0].length;
        let trackY = cellSize * currentTrack.trackPoints.length;        
        // Dimensions de la fenêtre (document)
        let windowWidth = document.documentElement.clientWidth;
        let windowHeight = document.documentElement.clientHeight;    
        // Calculer les ratios de mise à l'échelle pour faire tenir la carte dans la fenêtre
        let scaleX = windowWidth / trackX;
        let scaleY = windowHeight / trackY;    
        // Le plus petit ratio est le facteur de mise à l'échelle pour tout faire tenir
        scale = Math.min(scaleX, scaleY);
        // Calculer la translation nécessaire pour centrer la carte
        let deltaX = (windowWidth - trackX) / 2;
        let deltaY = (windowHeight - trackY) / 2;    
        // Appliquer la transformation : translation et mise à l'échelle
        grid.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scale})`;
    }


    divZoomLook.addEventListener('mousedown', function() {
        fctCenterOnMap();
    });
    divZoomLook.addEventListener('mouseup', function() {
        fctCenterOnPoint();
    });
    divZoomLook.addEventListener('touchstart', function() {
        fctCenterOnMap();
    });
    divZoomLook.addEventListener('touchend', function() {
        fctCenterOnPoint();
    });



    divFullScreen.addEventListener('click', function() {
        requestFullScreen();  
        playSound('dotraceZoomIn.mp3');
    });
    divFullScreenOnMenu.addEventListener('click', function() {
        requestFullScreen();
        playSound('dotraceZoomIn.mp3');
    });
    divCenterPos.addEventListener('click', function() {
        fctCenterOnPoint();       
        playSound('dotraceZoomIn.mp3');
    });

    divCenter.addEventListener('click', function() {
        fctCenterOnMap();       
        playSound('dotraceZoomOut.mp3');
    });

    divCenterZoom.addEventListener('click', function() {
        fctCenterOnMapZoom();       
        playSound('dotraceZoomOut.mp3');
    });


    zoomIn.addEventListener('click', function() {
        scale *= 1.1;
        let currentTransform = grid.style.transform;
        let translatePart = currentTransform.match(/translate\([^)]*\)/); // Partie translate
        console.log('translatePart',translatePart);
        //let scalePart = currentTransform.match(/scale\([^)]*\)/); // Partie scale (s'il y en a une)
        let newTransform = `${translatePart ? translatePart[0] : 'translate(0px, 0px)'} scale(${scale})`;
        grid.style.transform = newTransform;
        playSound('dotraceZoomIn.mp3',scale);
    });
    zoomOut.addEventListener('click', function() {
        scale *= 0.9;
        let currentTransform = grid.style.transform;
        let translatePart = currentTransform.match(/translate\([^)]*\)/); // Partie translate
        //let scalePart = currentTransform.match(/scale\([^)]*\)/); // Partie scale (s'il y en a une)
        let newTransform = `${translatePart ? translatePart[0] : 'translate(0px, 0px)'} scale(${scale})`;
        grid.style.transform = newTransform;
        playSound('dotraceZoomOut.mp3',scale);
    });

    divZoomOptionsContainer.style.left = '-300px';
    divZoomOptions.addEventListener('click', function() {
        if (divZoomOptionsContainer.style.left == '-300px' || !divZoomOptionsContainer.style.left) {
            divZoomOptionsContainer.style.left = '50px';            
            divSoundContainer.style.left = '-300px';
        } else {
            divZoomOptionsContainer.style.left = '-300px';
        }        
    });

    document.querySelectorAll('input[name="soundMode"]').forEach((radio) => {
        radio.addEventListener('change', (event) => {
            letSoundMode = event.target.value;
            console.log('letSoundMode',letSoundMode);
            playSound('dotraceMove.mp3',1,letSoundMode);
        });
    });

    divSoundContainer.style.left = '-300px';
    let divSound = document.getElementById('divSound');
    divSound.addEventListener('click', function() {
        if (divSoundContainer.style.left == '-300px' || !divSoundContainer.style.left) {
            divSoundContainer.style.left = '50px';
            divZoomOptionsContainer.style.left = '-300px';
        } else {
            divSoundContainer.style.left = '-300px';
        }
    });









    const backgroundDiv = grid;

    let initialDistance = 0;
    let isDragging = false;
    let startX, startY, initialTransform;

    // Zoom with mouse wheel
    window.addEventListener('wheel', (event) => {
        if (event.deltaY > 0) {
            scale *= 0.9; // Zoom out
        } else {
            scale *= 1.1; // Zoom in
        }
        let currentTransform = grid.style.transform;
        let translatePart = currentTransform.match(/translate\([^)]*\)/); // Partie translate
        //let scalePart = currentTransform.match(/scale\([^)]*\)/); // Partie scale (s'il y en a une)
        let newTransform = `${translatePart ? translatePart[0] : 'translate(0px, 0px)'} scale(${scale})`;
        grid.style.transform = newTransform;
    });

    // Zoom with pinch gesture on mobile
    backgroundDiv.addEventListener('touchstart', (event) => {
        if (event.touches.length === 2) {
            const touch1 = event.touches[0];
            const touch2 = event.touches[1];
            initialDistance = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
        }
    });

    backgroundDiv.addEventListener('touchmove', (event) => {
        if (event.touches.length === 2) {
            const touch1 = event.touches[0];
            const touch2 = event.touches[1];
            const currentDistance = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
            const distanceDifference = currentDistance - initialDistance;

            if (distanceDifference > 0) {
                scale *= 1.1; // Zoom in
            } else if (distanceDifference < 0) {
                scale *= 0.9; // Zoom out
            }
            let currentTransform = grid.style.transform;
            let translatePart = currentTransform.match(/translate\([^)]*\)/); // Partie translate
            //let scalePart = currentTransform.match(/scale\([^)]*\)/); // Partie scale (s'il y en a une)
            let newTransform = `${translatePart ? translatePart[0] : 'translate(0px, 0px)'} scale(${scale})`;
            grid.style.transform = newTransform;
            initialDistance = currentDistance;
        }
    });

    // Drag with mouse
    backgroundDiv.addEventListener('mousedown', (event) => {
        isDragging = true;
        startX = event.clientX;
        startY = event.clientY;
        initialTransform = backgroundDiv.style.transform;
    });

    window.addEventListener('mousemove', (event) => {
        if (isDragging) {
            const deltaX = event.clientX - startX;
            const deltaY = event.clientY - startY;
            backgroundDiv.style.transform = `${initialTransform} translate(${deltaX}px, ${deltaY}px)`;
        }
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Drag with touch
    backgroundDiv.addEventListener('touchstart', (event) => {
        if (event.touches.length === 1) {
            isDragging = true;
            startX = event.touches[0].clientX;
            startY = event.touches[0].clientY;
            initialTransform = backgroundDiv.style.transform;
        }
    });

    backgroundDiv.addEventListener('touchmove', (event) => {
        if (isDragging && event.touches.length === 1) {
            const deltaX = event.touches[0].clientX - startX;
            const deltaY = event.touches[0].clientY - startY;
            backgroundDiv.style.transform = `${initialTransform} translate(${deltaX}px, ${deltaY}px)`;
        }
    });

    backgroundDiv.addEventListener('touchend', () => {
        isDragging = false;
    });







    //================================================================================
    //================================================================================
    //================================================================================
    //================================================================================
    function showRibbon(htmlText, msDelay, color = "NODATA") {
        //console.log('📣showRibbon',htmlText);
        if (color=="NODATA") {
            const rootStyle = getComputedStyle(document.documentElement);
            color = 'rgba('+parseInt(rootStyle.getPropertyValue('--menuColorR'))+','+parseInt(rootStyle.getPropertyValue('--menuColorG'))+','+parseInt(rootStyle.getPropertyValue('--menuColorB'))+',.9)';
        }
        divRibbon.innerHTML = htmlText;
        divRibbon.style.backgroundColor = color;
        divRibbon.style.opacity = 1;
        setTimeout(function() {
            divRibbon.style.opacity = 0;
        }, msDelay);
    }




    async function playSound(fileName, pbRate = 1, theme = '', volume = 1) {
        if (letSoundMode === 'Mute') return;
    
        let soundPlayed = false;
        const audioElements = document.querySelectorAll('audio[id^="myAudio"]');
    
        for (let audio of audioElements) {
            if (audio.paused || audio.ended) {
                audio.src = `sound/${fileName.split('.')[0]}${theme}.${fileName.split('.')[1]}`;
                audio.playbackRate = pbRate;
                audio.volume = volume;
                try {
                    await audio.play();
                    soundPlayed = true;
                    break;
                } catch (error) {
                    console.error('Erreur lors de la lecture de l\'audio:', error);
                }
            }
        }
    
        if (!soundPlayed) {
            console.warn(`🔊🔥⚡ ${fileName}`);
        }
    }


 /*   function playSound(fileName, pbRate = 1,theme = '',volume = 1) {
        //console.log(fileName, pbRate,theme);
        if (letSoundMode=='Mute') return;
        let soundPlayed = false;
        for (let i=0;i<20;i++) { //tous les canaus Audio
            let audio = document.getElementById('myAudio'+i);            
            
            if (audio.paused || audio.ended) {  // Le son est en pause ou terminé, donc nous pouvons le lire
                audio.src = 'sound/' + fileName.split('.')[0] + theme + '.' + fileName.split('.')[1];
                audio.playbackRate = pbRate;
                audio.volume = volume;
                audio.play();
                //console.info('🔊',i,fileName,'pbRate',pbRate);
                soundPlayed = true;
                break;
            }
        }      
        if (!soundPlayed)
            console.warn("🔊🔥⚡ "+fileName);
    }*/


// Passer en mode plein écran
function requestFullScreen() {

    if (window.innerHeight == screen.height) {
        // browser is fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
            } else if (document.mozCancelFullScreen) { // Firefox
            document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
            document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { // IE/Edge
            document.msExitFullscreen();
            }
        showRibbon('Full Screen Exited',2000);
    } else {
        const element = document.documentElement;
        if (element.requestFullscreen) {
        element.requestFullscreen();
        } else if (element.mozRequestFullScreen) { // Firefox
        element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) { // Chrome, Safari and Opera
        element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) { // IE/Edge
        element.msRequestFullscreen();
        }
        showRibbon('Full Screen Activated 👍',2000);
    }

}



});