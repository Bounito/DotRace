
function valueToColor(value) {
    // Normaliser la valeur entre -1 et 1
    const maxValue = Math.sqrt(2);
    value = value / maxValue;

    // Clamp la valeur entre -1 et 1
    value = Math.max(-1, Math.min(1, value));
    
    let r, g, b;

    if (value < 0) {
        // Interpolation entre le vert (-1) et gris (0)
        r = Math.round(128 * (1 + value)); // De 0 à 128
        g = 128;
        b = Math.round(128 * (1 + value)); // De 0 à 128
    } else {
        // Interpolation entre gris (0) et rouge (1)
        r = Math.round(128 + 127 * value); // De 128 à 255
        g = Math.round(128 * (1 - value)); // De 128 à 0
        b = Math.round(128 * (1 - value)); // De 128 à 0
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



function fctRbg2Rgba(rgbColor, transparency) {
    // Extraire les composantes R, G et B de la chaîne RGB
    const rgbValues = rgbColor.match(/\d+/g);
    if (rgbValues.length !== 3) {
        throw new Error("Format de couleur RGB invalide");
    }
    const [r, g, b] = rgbValues;
    // Retourner la couleur en format RGBA
    return `rgba(${r}, ${g}, ${b}, ${transparency})`;

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


//=====================================================================
//                        DOM chargé
//=====================================================================
document.addEventListener('DOMContentLoaded', () => {

    console.info("== DOM chargé ==");
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
    const divBest = document.getElementById('divBest');
    const divRecord = document.getElementById('divRecord');
    const divLeft = document.getElementById('divLeft');
    
    const divParams = document.getElementById('divParams');
    const divParamsBtn = document.getElementById('divParamsBtn');
    const divParamsContainer = document.getElementById('divParamsContainer');
    const divSpeed = document.getElementById('divSpeed');
    const zoomIn = document.getElementById('zoomIn');
    const zoomOut = document.getElementById('zoomOut');
    const divCenterZoom = document.getElementById('divCenterZoom');
    const divCenter = document.getElementById('divCenter');
    
    const divCadreZoom = document.getElementById('divCadreZoom');
    const divCadreZoom2 = document.getElementById('divCadreZoom2');    
    const divNextLine = document.getElementById('divNextLine');
    const divNextPoint = document.getElementById('divNextPoint');
    const divMovePoint = document.getElementById('divMovePoint');
    
    const divMenu = document.getElementById('divMenu');
    const divMenuBtn = document.getElementById('divMenuBtn');
    const divMenuContainer = document.getElementById('divMenuContainer');
    
    const labelRangeNbPlayers = document.getElementById('labelRangeNbPlayers');
    const rangeNbPlayers = document.getElementById('rangeNbPlayers');
    rangeNbPlayers.addEventListener('input', function() {
        labelRangeNbPlayers.innerHTML = 'Nb Players: '+rangeNbPlayers.value;
    });


    const rangeNbHuman = document.getElementById('rangeNbHuman');



    const rangeIaFar = document.getElementById('rangeIaFar');
    const rangeIaSpeed = document.getElementById('rangeIaSpeed');
    const rangeIaTimer = document.getElementById('rangeIaTimer');
    const rangeZoomScale = document.getElementById('rangeZoomScale');
    const rangeZoomElan = document.getElementById('rangeZoomElan');    

    const divTracksBoutons = document.getElementById('divTracksBoutons');
    const trackPreview = document.getElementById('trackPreview');
    const loadTrackBtn = document.getElementById('loadTrackBtn');
    const checkTrackReverse = document.getElementById('checkTrackReverse');
    // Sélectionne tous les boutons à l'intérieur de la div numpad
    const numpad = document.getElementById('numpad');
    const buttons = document.querySelectorAll('#numpad button');

    // Variables Circuit
    let currentTrack = [];
    let startPoints = [];
    let finishPoints = [];
    let tracksBestScores = [];
    // Variables Système
    let letSoundOn = true;
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
    const touchesNumpad = ['↖','⬆','↗','⬅','⚪','➡','↙','⬇','↘'];

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


    // ====================================================================
    // ====================================================================
    // ====================================================================
    function fctAddPointOnPath(newPoint,playerId = CurrentPlayer) {
        //console.info('player',playerId,'new point',newPoint,players[playerId].path.length);
        //Ajout dans les variables
        players[playerId].path.push(newPoint);
        //console.info('player',playerId,'new point',newPoint,players[playerId].path.length);
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
    //                              MENU
    //========================================================================
    //========================================================================
    //========================================================================
    divMenuBtn.addEventListener('click', function() {
        if (divMenuContainer.style.display === 'none' || divMenuContainer.style.display === '') {
            divMenuBtn.innerHTML = "Close Menu";
            divMenuContainer.style.display = 'block';
            divMenu.style.left = '70px';
        } else {
            divMenuBtn.innerHTML = "Menu";
            divMenuContainer.style.display = 'none';
            divMenu.style.left = '10px';
        }
    });

    // Fonction pour générer les radios boutons pour les circuits
    function generateTrackButtons() {
        const divTracksBoutons = document.getElementById('divTracksBoutons');
        divTracksBoutons.innerHTML = ''; // Vider la div avant d'ajouter
        let needChecked = true;
    
        // Trier les circuits par ordre croissant en fonction de la taille
        tracks.sort((a, b) => {
            const sizeA = a.trackPoints[0].length * a.trackPoints.length;
            const sizeB = b.trackPoints[0].length * b.trackPoints.length;
            return sizeA - sizeB;
        });
    
        tracks.forEach(track => {
            // Créer un label pour le radio
            const label = document.createElement('label');
            label.textContent = track.trackPoints[0].length + 'x' + track.trackPoints.length + ' '+track.trackName;
            // Créer le bouton radio pour chaque circuit
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'track'; // Tous les radios partagent le même nom pour être mutuellement exclusifs
            radio.value = track.trackName; // L'identifiant du circuit
            if (needChecked) {
                radio.checked = true;
                needChecked = false;
            }
            radio.dataset.trackIndex = tracks.indexOf(track); // Stocker l'index du circuit
            // Ajouter le radio et le label dans la div
            label.prepend(radio); // Insère le radio avant le texte dans le label
            divTracksBoutons.appendChild(label);
            divTracksBoutons.appendChild(document.createElement('br')); // Ajouter une ligne après chaque bouton
        });
    }
    

    // Fonction pour afficher la prévisualisation du circuit sélectionné
    function previewTrack() {
        const selectedRadio = document.querySelector('input[name="track"]:checked');
        const trackPreview = document.getElementById('trackPreview');        
        if (selectedRadio) {
            const track = tracks[selectedRadio.dataset.trackIndex];            
            // Prévisualisation: taille de la grille et aperçu miniature du circuit
            let htmlTrack = "";
            let x, y;
            let countStartPoints = 0;
            let countFinishPoints = 0;
            for (y = 0; y < track.trackPoints.length; y++) {  // Assurez-vous de ne pas dépasser la taille réelle de trackPoints
                for (x = 0; x < track.trackPoints[y].length; x++) {  // Parcourir chaque caractère dans la ligne
                    if (track.trackPoints[y][x] === ' ') {
                        htmlTrack += '&nbsp;';  // Ajouter un espace non-sécable pour les espaces
                    } else {
                        htmlTrack += track.trackPoints[y][x];  // Ajouter le caractère de la piste
                        if (track.trackPoints[y][x] === '#') {
                            countStartPoints++;
                        }
                        if (track.trackPoints[y][x] === '@') {
                            countFinishPoints++;
                        }
                    }
                }
                htmlTrack += "<br>";  // Ajouter un saut de ligne après chaque ligne de la piste
            }
            console.log(rangeNbPlayers.value,rangeNbPlayers.max,Math.min(countStartPoints,countFinishPoints));
            rangeNbPlayers.max = Math.min(countStartPoints,countFinishPoints);
            rangeNbPlayers.value = rangeNbPlayers.max;
            console.log(rangeNbPlayers.value,rangeNbPlayers.max,Math.min(countStartPoints,countFinishPoints));
            labelRangeNbPlayers.innerHTML = 'Nb Players: '+rangeNbPlayers.value+ ' MAX';
            trackPreview.innerHTML = `
                Grid Size : ${track.trackPoints[0].length} x ${track.trackPoints.length}
                <br>
                Max Players : ${Math.min(countStartPoints,countFinishPoints)}
                <br>
                <div style="font-family: monospace; line-height: 0.6; font-size: 4px; text-align: left;">
                ${htmlTrack}
                </div>
            `;
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
        let playersColors = generateDarkColors(NbPlayers);
        /*players = [
            { color: "#00008B", path: [] ,record:999,status:"RUN"},
            { color: "#006400",path: [],record:999,status:"RUN"},
            { color: "#8B0000",path: [] ,record:999,status:"RUN"},
            { color: "#DAA520",path: [] ,record:999,status:"RUN"},
            { color: "#008B8B",path: [] ,record:999,status:"RUN"},
            { color: "#800080",path: [] ,record:999,status:"RUN"},
            { color: "#9ACD32",path: [] ,record:999,status:"RUN"},
            { color: "#FF0000",path: [] ,record:999,status:"RUN"},
            { color: "#FFA500",path: [] ,record:999,status:"RUN"}
        ];*/
        players = [];
        for (let i=0;i<NbPlayers;i++) {
            players.push({color:playersColors[i], path: [] ,record:999,status:"RUN"});
        }


        CurrentPlayer = 0;
        //Suppression sur la grille (points et lignes)
        const connectedPoints = document.querySelectorAll('.connected-point');
        connectedPoints.forEach(div => {
            div.remove();
        });
        const lines = document.querySelectorAll('.line');
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
            console.info('player', i, 'randomStartPoint', randomStartPoint);
            // Met à jour la position du joueur avec le point sélectionné
            tmpPos = { x: randomStartPoint.x, y: randomStartPoint.y };
            // Démarre le chemin pour ce joueur
            fctAddPointOnPath(tmpPos, i);
            // Retire cet index du tableau pour qu'il ne soit pas réutilisé
            availableIndexes.splice(randomIndex, 1);
        }



        fctAffichageNext();

        //Recherche Score
        if (tracksBestScores[currentTrack.trackName]) {
            divBest.innerHTML = tracksBestScores[currentTrack.trackName].score+" 🏆";
        } else {
            divBest.innerHTML = "no record";
        }
        divRecord.innerHTML = "";
        divLeft.innerHTML = " &nbsp; " + NbPlayers + " left";

        //Cache Menu
        divMenuContainer.style.display = 'none'; // Masquer l'élément
        divMenuBtn.innerHTML="Menu";

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
            currentTrack = tracks[selectedRadio.dataset.trackIndex];
            //showRibbon('Circuit <b>'+currentTrack.trackName+'</b> loaded.<br>Good luck !',3000);
            loadTrackData(currentTrack); // Charger le circuit sélectionné
            fctReinit();
        } else {
            alert("Veuillez sélectionner un circuit.");
        }
    }

    // Générer les boutons lors du chargement de la page
    generateTrackButtons();
    previewTrack();
    loadSelectedTrack();

    // Écouter le changement de sélection des boutons radio pour mettre à jour la prévisualisation
    document.getElementById('divTracksBoutons').addEventListener('change', previewTrack);
    // Ajouter un écouteur d'événement au bouton "Charger"
    document.getElementById('loadTrackBtn').addEventListener('click', loadSelectedTrack);
    // Fonction pour charger les données du circuit sélectionné
    function loadTrackData(track) {
        //const selectedTrack = tracks.find(track => track.trackName === trackName);        
        if (track) {
            fctChargeCircuit(track.trackPoints);
        } else {
            console.error(`Le circuit ${trackName} n'a pas été trouvé.`);
        }
    }
    function replaceCharInTrackPoints(trackPoints, targetChar, replacementChar) {
        for (let i = 0; i < trackPoints.length; i++) {
            trackPoints[i] = trackPoints[i].replace(new RegExp(targetChar, 'g'), replacementChar);
        }
        return trackPoints;
    }
    function fctChargeCircuit(trackPoints) {
        playSound('NewGrid.mp3');    
        console.info('fctChargeCircuit trackPoints',trackPoints)
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
        let rootStyle = document.documentElement.style;
        // Définir une valeur pour la variable --cellNbX et --cellNbY
        rootStyle.setProperty('--cellNbX', cellNbX);
        rootStyle.setProperty('--cellNbY', cellNbY);
        svgFond.style.width = cellSize * cellNbX;
        svgFond.style.height = cellSize * cellNbY;


        //Reverse ?
        if (checkTrackReverse.checked) {
            trackPoints = replaceCharInTrackPoints(trackPoints, '#', 'S');
            trackPoints = replaceCharInTrackPoints(trackPoints, '@', 'F');
            trackPoints = replaceCharInTrackPoints(trackPoints, 'F', '#');
            trackPoints = replaceCharInTrackPoints(trackPoints, 'S', '@');
        }


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

        

        fctCenterOnMap();
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
                        //playSound('marker-on-whiteboard.mp3');
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
        playSound('marker-on-whiteboard.mp3');

    }



    function fctMoveFromCommand(commandNb,simulateBool) {

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

        if (!simulateBool) {
            //On cache le numpad
            numpad.style.display = 'none';
            divSpeed.style.display = 'none';
            let divLastPoint = fctAddPointOnPath(endPos);
            

            if (fctTestFinish()) {
                playSound('correct-choice.mp3');
                if (CurrentPlayer < rangeNbHuman.value) {
                    playSound('claps-few-people.mp3');
                    fctCenterOnMap();
                }                
                divCadreZoom.style.opacity = 0;
                divCadreZoom2.style.opacity = 0;
                players[CurrentPlayer].status = "FINISH";
                

                let rcrdPt = document.createElement('div');
                rcrdPt.classList.add('recordPoint');
                rcrdPt.style.backgroundColor = players[CurrentPlayer].color;
                rcrdPt.innerHTML = (players[CurrentPlayer].path.length-1);
                divRecord.appendChild(rcrdPt);
                rcrdPt.style.opacity = 1;
                // Si tracksBestScores est déjà un tableau, sinon initialisez-le
                // Vérifie si il y a déjà un score pour ce circuit
                let timeDelay = 100;
                if (!tracksBestScores[currentTrack.trackName] || (players[CurrentPlayer].path.length-1) < tracksBestScores[currentTrack.trackName].score) {
                    // Mets à jour le meilleur score si le chemin est plus court
                    tracksBestScores[currentTrack.trackName] = { track: currentTrack.trackName, score: (players[CurrentPlayer].path.length-1) };
                    console.info('tracksBestScores',tracksBestScores);
                    if (CurrentPlayer < rangeNbHuman.value) {
                        showRibbon('You win in '+(players[CurrentPlayer].path.length-1)+' steps !<br>New best score for ' + currentTrack.trackName + '!', 3000,players[CurrentPlayer].color);  
                        timeDelay = 3000;
                    }
                    divBest.innerHTML = tracksBestScores[currentTrack.trackName].score+" 🏆";
                    playSound('magic.mp3');
                } else {
                    if (CurrentPlayer < rangeNbHuman.value) {
                        showRibbon('You win in '+(players[CurrentPlayer].path.length-1)+' steps !<br>Try again to beat the best score!', 3000,players[CurrentPlayer].color);  
                        timeDelay = 3000;
                    }
                }

                setTimeout(function() {
                    if (fctRaceContinue()) {
                        fctNextPlayer();
                        fctAffichageNext();
                    } else {
                        fctCenterOnMap();
                        if(confirm("Restart Race?")) {
                            fctReinit(); 
                        }                                               
                    }
                }, timeDelay);
                
            } else {
                if (CurrentPlayer >= rangeNbHuman.value) {
                    setTimeout(function() {
                        fctNextPlayer();
                        fctAffichageNext();
                    }, rangeIaTimer.value);
                } else {
                    // Calcule la position précédente pour le calcul de l'élan
                    tmpElan = pElan();
                    let elanFinal = Math.sqrt(Math.pow(tmpElan.x, 2)+Math.pow(tmpElan.y, 2));
                    let playBackMarker = (10-elanFinal)*.5;
                    playBackMarker = Math.max(playBackMarker,.25);
                    playSound('sharpie_on_paper.mp3',playBackMarker);
                    divLastPoint.style.opacity = 0;
                    //Animation boule qui se déplace en .5s
                    divMovePoint.style.transition = 'top 0.5s ease, left 0.5s ease';
                    divMovePoint.style.opacity = 1;
                    divMovePoint.style.backgroundColor = players[CurrentPlayer].color;
                    divMovePoint.innerHTML = players[CurrentPlayer].path.length-1;
                    divMovePoint.style.left = cellSize * endPos.x +'px';
                    divMovePoint.style.top = cellSize * endPos.y +'px';
                    //Next joueur
                    setTimeout(function() {
                        divLastPoint.style.opacity = 1;
                        fctNextPlayer();
                        fctAffichageNext();
                    }, 500);
                }
            }
        } else {
            //Maj du speedometer
            let speed = parseInt(100*Math.sqrt(Math.pow(tmpElan.x + delta[value].x, 2)+Math.pow(tmpElan.y + delta[value].y, 2)))/100
            divSpeed.innerHTML = speed;
            divSpeed.style.height = (speed*20)+15 + 'px';
            divSpeed.style.backgroundColor = valueToColorGradient(speed);
            fctSimuNextPointLine(startPos,endPos,players[CurrentPlayer].color);
            divNextPoint.style.opacity = 0;
            divNextLine.style.opacity = 0;
        }


    }
    //========================================================================
    //========================================================================
    //========================================================================

    //========================================================================
    //========================================================================
    //========================================================================

    function fctRaceContinue() {
        let retBool = false;
        let left=0;
        for (let i=0;i<NbPlayers;i++) {
            if (players[i].status=="RUN") {
                retBool = true;
                left++;
            }
        }
        if (left==0)
            divLeft.innerHTML = " Race Finish 🏁";
        else
            divLeft.innerHTML = " &nbsp; " + left + " left";
        return retBool;
    }

    function fctTestFinish() {
        tmpPos = pPos();
        return finishPoints.some(point => point.x === tmpPos.x && point.y === tmpPos.y);
    }


    function fctNextPlayer() {
        if (CurrentPlayer>=NbPlayers-1) {
            CurrentPlayer = 0;
        } else {
            CurrentPlayer++;
        }
        if (players[CurrentPlayer].status!="RUN") {
            fctNextPlayer();
        }
    }

    // =================================================================
    // =================================================================
    function fctCaseLibre(posTest,boolPlayers = true) {
        let returnBool = true;
        if (boolPlayers) {
            for (let i = 0; i < NbPlayers; i++) {
                let tmpPlayerPo = pPlayerPos(i);
                //console.debug('tmpPos',tmpPos);
                if (players[i].status=="RUN") {
                    if (tmpPlayerPo.x === posTest.x && tmpPlayerPo.y === posTest.y) {
                        returnBool = false;
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
        return returnBool;
    }
    // =================================================================
    // =================================================================
    function fctCountNeufCases(posTest,boolPlayers = true) {
        let countNeuf = 0;
        for (let i=1;i<=9;i++) {
            let butPos = {x:(posTest.x+delta[i].x),y:(posTest.y+delta[i].y)};
            if (fctCaseLibre(butPos,boolPlayers)) {
                countNeuf++;
            }            
        }
        return countNeuf;
    }
    function fctCount81Cases(posTest,boolPlayers = true) {
        let count81 = 0;
        for (let i=1;i<=9;i++) {
            let butPos = {x:(posTest.x+delta[i].x),y:(posTest.y+delta[i].y)};
            if (fctCaseLibre(butPos,boolPlayers)) {
                count81 += fctCountNeufCases(butPos,boolPlayers);
            }
        }
        return count81;
    }
    function fctCount729Cases(posTest,boolPlayers = true) {
        let count729 = 0;
        for (let i=1;i<=9;i++) {
            let butPos = {x:(posTest.x+delta[i].x),y:(posTest.y+delta[i].y)};
            if (fctCaseLibre(butPos,boolPlayers)) {
                count729 += fctCount81Cases(butPos,boolPlayers);
            }
        }
        return count729;
    }
    function fctCoun6561Cases(posTest,boolPlayers = true) {
        let count6561 = 0;
        for (let i=1;i<=9;i++) {
            let butPos = {x:(posTest.x+delta[i].x),y:(posTest.y+delta[i].y)};
            if (fctCaseLibre(butPos,boolPlayers)) {
                count6561 += fctCount729Cases(butPos,boolPlayers);
            }
        }
        return count6561;
    }
    // =================================================================
    // =================================================================
    function fctAffichageNext() {
        tmpPos = pPos();
        tmpElan = pElan();

        //On pré-positionne pour l'animation
        divMovePoint.style.opacity = 0;
        divMovePoint.style.transition = '';
        divMovePoint.style.left = cellSize * (tmpPos.x) +'px';
        divMovePoint.style.top = cellSize * (tmpPos.y) +'px';
        //console.debug('===================🐞',tmpPos,tmpElan);

        //Nettoyage des bordures et autres...
        buttons.forEach(button => {
            button.style.border = '';
            button.innerHTML = '';
        });

        //Color numpad
        numpad.style.backgroundColor = fctRbg2Rgba(players[CurrentPlayer].color,.5);
        let testFini = 0;
        let bestButton = [];
        let elanInitial = Math.sqrt(Math.pow(tmpElan.x, 2)+Math.pow(tmpElan.y, 2));
        buttons.forEach(button => {
            const value = button.getAttribute('data-value');
            let button_x = tmpPos.x + tmpElan.x + delta[value].x;
            let button_y = tmpPos.y + tmpElan.y + delta[value].y;
            let elanFinal = Math.sqrt(Math.pow(tmpElan.x + delta[value].x, 2)+Math.pow(tmpElan.y + delta[value].y, 2));
            
            let posTest = {x:button_x,y:button_y};
            //console.info(value,tmpPos,button_x+'_'+button_y+'_',fctCaseLibre(posTest));
            if (fctCaseLibre(posTest,true)) {
                //=================================
                //======= La case est dispo
                //=================================
                button.disabled = false; // Active le bouton
                button.innerHTML = "";
                button.style.cursor = 'pointer';
                button.style.backgroundColor = valueToColor(elanFinal-elanInitial);
                button.style.opacity = 1;

                let retNbCasesLibres = 0;
                let count_i = 0;
                let count_j = 0;
                let count_k = 0;
                let count_l = 0;
                let countTotal = 0;
                for (let i=1;i<=9;i++) {
                    let button_i_x = button_x + (tmpElan.x + delta[value].x) + delta[i].x;
                    let button_i_y = button_y + (tmpElan.y + delta[value].y) + delta[i].y;
                    let posTest_i = {x:button_i_x,y:button_i_y};
                    if (fctCaseLibre(posTest_i,false) && (posTest_i.x !== posTest.x || posTest_i.y !== posTest.y)) {
                        count_i++;
                        for (let j=1;j<=9;j++) {
                            let button_j_x = button_i_x + (tmpElan.x + delta[value].x) + delta[i].x + delta[j].x;
                            let button_j_y = button_i_y + (tmpElan.y + delta[value].y) + delta[i].y + delta[j].y;
                            let posTest_j = {x:button_j_x,y:button_j_y};
                            if (fctCaseLibre(posTest_j,false) && (posTest_j.x !== posTest_i.x || posTest_j.y !== posTest_i.y)) {
                                count_j++;
                                for (let k=1;k<=9;k++) {
                                    let button_k_x = button_j_x + (tmpElan.x + delta[value].x) + delta[i].x + delta[j].x + delta[k].x;
                                    let button_k_y = button_j_y + (tmpElan.y + delta[value].y) + delta[i].y + delta[j].y + delta[k].y;
                                    let posTest_k = {x:button_k_x,y:button_k_y};
                                    if (fctCaseLibre(posTest_k,false) && (posTest_k.x !== posTest_j.x || posTest_k.y !== posTest_j.y)) {
                                        count_k++;
                                        for (let l=1;l<=9;l++) {
                                            let button_l_x = button_k_x + (tmpElan.x + delta[value].x) + delta[i].x + delta[j].x + delta[k].x + delta[l].x;
                                            let button_l_y = button_k_y + (tmpElan.y + delta[value].y) + delta[i].y + delta[j].y + delta[k].y + delta[l].y;
                                            let posTest_l = {x:button_l_x,y:button_l_y};
                                            if (fctCaseLibre(posTest_l,false) && (posTest_l.x !== posTest_k.x || posTest_j.y !== posTest_k.y)) {
                                                count_l++;
                                                //Recherche de la distance finale aprés 3 sauts :
                                                let elanSauts = Math.sqrt(Math.pow(tmpPos.x - button_l_x, 2)+Math.pow(tmpPos.y - button_l_y, 2));
                                                countTotal += parseInt(rangeIaFar.value*elanSauts);
                                                                                          
                                            }
                                        }
                                                                                  
                                    }
                                }
                            }
                        }
                    }
                }





                //console.log(value,count_i + '/' + count_j + '/' + count_k + '/' + countTotal); 
                retNbCasesLibres = countTotal;               
                //button.innerHTML = parseInt(retNbCasesLibres);
                button.innerHTML = touchesNumpad[value-1];


                if (count_i==0) {
                    button.innerHTML = "⚠";
                    retNbCasesLibres = 0;
                    button.style.border = '4px solid black';  
                } else if (count_j==0) {
                    button.innerHTML = "⚠⚠";
                    retNbCasesLibres = 0;
                    button.style.border = '4px solid black';  
                } else if (count_k==0) {
                    button.innerHTML = "⚠⚠⚠";
                    retNbCasesLibres = 0;
                    button.style.border = '4px solid black';
                } else if (count_l==0) {
                    button.innerHTML = "⚠⚠⚠⚠";
                    retNbCasesLibres = 0;
                    button.style.border = '4px solid black';
                }
                
            
                //console.log('retNbCasesLibres',retNbCasesLibres);

                if (finishPoints.some(point => point.x === posTest.x && point.y === posTest.y)) {
                    button.innerHTML = "🏁";
                    retNbCasesLibres = 9999999; //Case à privilégier !
                }

                // Définir le pourcentage d'ajustement (par exemple 0.15 pour ±15%)
                let percentage = rangeIaSpeed.value;
                // Calculer la différence entre elanFinal et elanInitial
                let diff = elanFinal - elanInitial;  // Différence entre -√2 et √2
                // Normaliser la différence entre 0 et 1
                let normalizedDiff = (diff + Math.SQRT2) / (2 * Math.SQRT2);
                // Transformer cette valeur dans l'intervalle [1 - percentage, 1 + percentage]
                let adjustmentFactor = (1 - percentage) + (2 * percentage * normalizedDiff);
                // Calculer iaScore avec l'ajustement
                let iaScore = Math.floor(retNbCasesLibres * adjustmentFactor);
                //let iaScore = Math.floor(retNbCasesLibres * (2 + ((elanFinal - elanInitial) / 20)));
                bestButton.push({id:value,score:iaScore});

            } else {
                button.disabled = true; // Désactive le bouton
                button.style.cursor = 'default';
                button.style.backgroundColor = 'black';
                button.style.opacity = .5;
                //console.info(value,button_x+'_'+button_y+'_',pos);
                testFini++;
            }
        });
        //console.log('bestButton',bestButton);

        if (testFini == 9) {
            let timeDelay = 0;
            if (players[CurrentPlayer].status=="RUN") {
                playSound('marker-whiteboard-squeak.mp3');
                divCadreZoom.style.opacity = 0;
                divCadreZoom2.style.opacity = 0;
                divNextLine.style.opacity = 0;
                divNextPoint.style.opacity = 0;
                
                if (CurrentPlayer < rangeNbHuman.value) {
                    fctCenterOnMap();
                    showRibbon('Player '+ (CurrentPlayer+1) +' loose 😥 !', 3000,players[CurrentPlayer].color);
                    timeDelay = 3000;
                }
                let rcrdPt = document.createElement('div');
                rcrdPt.classList.add('recordPoint');
                rcrdPt.classList.add('pointCrashed');
                rcrdPt.style.backgroundColor = players[CurrentPlayer].color;
                divRecord.appendChild(rcrdPt);
                rcrdPt.style.opacity = 1;

                players[CurrentPlayer].record=players[CurrentPlayer].path.length;
                players[CurrentPlayer].status = "CRASH";
                let crashPoint = {x:tmpPos.x+tmpElan.x,y:tmpPos.y+tmpElan.y};
                let divCrashPoint = fctAddPointOnPath(crashPoint);
                divCrashPoint.classList.add('pointCrashed');
                divCrashPoint.innerHTML = "";
            }
            setTimeout(function() {    
                if (fctRaceContinue()) {
                    fctNextPlayer();
                    fctAffichageNext();
                } else {
                    fctCenterOnMap();
                    if(confirm("Restart Race?")) {
                        fctReinit(); 
                    }
                }
            }, timeDelay);
          
        }

        fctMoveFromCommand(5,true);



        // IA
        let bestId;
        if (bestButton.length > 0) {
            // Trouver la valeur maximale de 'cases'
            let maxScore = Math.max(...bestButton.map(b => b.score));        
            //console.log('maxScore:', maxScore);
            // Filtrer les éléments qui ont cette valeur maximale
            let candidates = bestButton.filter(b => b.score === maxScore);
            //console.log('candidates:', candidates);
            // Choisir un candidat aléatoirement si plusieurs éléments ont la même valeur
            bestId = candidates[Math.floor(Math.random() * candidates.length)].id;

            //console.log('Meilleur bouton ID :', bestId);
            //Bordue blanche sur bouton

            btnBest = document.getElementById('btn'+bestId)
            btnBest.style.border = '4px solid white';            
        } else {
            console.warn("Aucun bouton disponible");
        }

            
        if (CurrentPlayer >= rangeNbHuman.value)  {
            //console.log('🤖 IA MOVE !', bestId);
            divCadreZoom.style.opacity = 0;
            divCadreZoom2.style.opacity = 0;
            divMovePoint.style.opacity = 0;
            if (bestId) {
                fctMoveFromCommand(bestId,false);
            }            
        } else {
            //On affiche le numpad
            numpad.style.display = 'grid';
            divSpeed.style.display = 'block';
            divCadreZoom.style.opacity = .5;
            divCadreZoom2.style.opacity = .2;

            tmpPos = pPos();
            tmpElan = pElan();
            let deltaX = tmpPos.x + tmpElan.x + tmpElan.x;
            let deltaY = tmpPos.y + tmpElan.y + tmpElan.y;
            let ptZoom = { x: deltaX, y: deltaY };
            
            //Maj du scale en fonction de l'élan
            scale = rangeZoomScale.value-(elanInitial*rangeZoomElan.value);
            //console.debug('🐞','ptZoom',ptZoom,rangeZoom.value,scale);
            fctCenterOnPoint(ptZoom);

            showRibbon('Your turn !', 1000,players[CurrentPlayer].color);
        }

    }


    //================================================================================
    //================================================================================
    //================================================================================
    //================================================================================

    function fctCenterOnPoint(point) {
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

    divParamsBtn.addEventListener('click', function() {
        if (divParamsContainer.style.display == 'none' || !divParamsContainer.style.display) {
            divParamsContainer.style.display = 'block';
        } else {
            divParamsContainer.style.display = 'none';
        }        
    });


    divCenter.addEventListener('click', function() {
        fctCenterOnMap();       
        playSound('clic.mp3');
    });

    divCenterZoom.addEventListener('click', function() {
        fctCenterOnMapZoom();       
        playSound('clic.mp3');
    });


    zoomIn.addEventListener('click', function() {
        scale *= 1.1;
        let currentTransform = grid.style.transform;
        let translatePart = currentTransform.match(/translate\([^)]*\)/); // Partie translate
        console.log('translatePart',translatePart);
        //let scalePart = currentTransform.match(/scale\([^)]*\)/); // Partie scale (s'il y en a une)
        let newTransform = `${translatePart ? translatePart[0] : 'translate(0px, 0px)'} scale(${scale})`;
        grid.style.transform = newTransform;
        playSound('zoomIn.mp3',scale);
    });
    zoomOut.addEventListener('click', function() {
        scale *= 0.9;
        let currentTransform = grid.style.transform;
        let translatePart = currentTransform.match(/translate\([^)]*\)/); // Partie translate
        //let scalePart = currentTransform.match(/scale\([^)]*\)/); // Partie scale (s'il y en a une)
        let newTransform = `${translatePart ? translatePart[0] : 'translate(0px, 0px)'} scale(${scale})`;
        grid.style.transform = newTransform;
        playSound('zoomOut.mp3',scale);
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
    function showRibbon(htmlText, msDelay, color = "darkred") {
        
        divRibbon.innerHTML = htmlText;
        divRibbon.style.backgroundColor = color;
        divRibbon.style.opacity = 1;
        setTimeout(function() {
            divRibbon.style.opacity = 0;
        }, msDelay);
    }





    let sound = document.getElementById('sound');
    sound.addEventListener('click', function() {
        console.info("letSoundOn="+letSoundOn);
        if (letSoundOn) {
            sound.innerHTML = "🔈";
            sound.style.border = "4px solid gray";            
        } else {
            sound.innerHTML = "🔊";
            sound.style.border = "4px solid white";
        }
        letSoundOn = !letSoundOn;
        playSound('magic.mp3');
    });


    function playSound(fileName, pbRate = 1) {
        if (!letSoundOn) return;
        let soundPlayed = false;
        for (let i=0;i<10;i++) { //tous les canaus Audio
            let audio = document.getElementById('myAudio'+i);            
            
            if (audio.paused || audio.ended) {  // Le son est en pause ou terminé, donc nous pouvons le lire
                audio.src = 'sound/' + fileName;
                audio.playbackRate = pbRate;
                audio.play();
                //console.info('🔊',i,fileName,'pbRate',pbRate);
                soundPlayed = true;
                break;
            }
        }      
        if (!soundPlayed)
            console.warn("🔊🔥⚡ "+fileName);
    }






});