
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
    const divUndo = document.getElementById('divUndo');
    const btnUndo = document.getElementById('btnUndo');
    const spnPoint = document.getElementById('spnPoint');

    const divSpeed = document.getElementById('divSpeed');
    const zoomIn = document.getElementById('zoomIn');
    const zoomOut = document.getElementById('zoomOut');
    const divCenter = document.getElementById('divCenter');
    
    const divCadreZoom = document.getElementById('divCadreZoom');
    const divCadreZoom2 = document.getElementById('divCadreZoom2');
    const divNextPoint = document.getElementById('divNextPoint');
    const simuLine = document.getElementById('divNextLine');

    const divMenu = document.getElementById('divMenu');
    const divMenuBtn = document.getElementById('divMenuBtn');
    const divConfigBtn = document.getElementById('divConfigBtn');
    const divTracksBoutons = document.getElementById('divTracksBoutons');
    const trackPreview = document.getElementById('trackPreview');
    const loadTrackBtn = document.getElementById('loadTrackBtn');
    // Sélectionne tous les boutons à l'intérieur de la div numpad
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
    let NbPlayers = 3;
    let CurrentPlayer = 6;
    let players = [
        { id: 1, color: "blue", path: [] ,record:999},
        { id: 2, color: "green", path: [],record:999},
        { id: 3, color: "red", path: []  ,record:999},
        { id: 4, color: "gold", path: [] ,record:999},
        { id: 5, color: "cyan", path: [] ,record:999},
        { id: 6, color: "lime", path: [] ,record:999}
    ];
    // Variables temp
    let tmpPos = { x: 0, y: 0 };
    let tmpPrevPos = { x: 0, y: 0 };
    let tmpNectPos = { x: 0, y: 0 };
    let tmpElan = { x: 0, y: 0 };

    //Anciennes variables
    let currentPath = []; // Pour stocker le chemin actuel
    let pos = { x: 5, y: 5 }; // Position centrale initiale
    let previousPos = { x: 5, y: 5 }; // Position précédente
    let elan = { x: 0, y: 0 }; // Vecteur d'élan

  


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









    //fctAffichageNext();




    // Fonction pour générer les radios boutons pour les circuits
    function generateTrackButtons() {
        const divTracksBoutons = document.getElementById('divTracksBoutons');
        divTracksBoutons.innerHTML = ''; // Vider la div avant d'ajouter
        let needChecked = true;
        tracks.forEach(track => {
            // Créer un label pour le radio
            const label = document.createElement('label');
            label.textContent = track.trackName;

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
            for (y = 0; y < track.trackPoints.length; y++) {  // Assurez-vous de ne pas dépasser la taille réelle de trackPoints
                for (x = 0; x < track.trackPoints[y].length; x++) {  // Parcourir chaque caractère dans la ligne
                    if (track.trackPoints[y][x] === ' ') {
                        htmlTrack += '&nbsp;';  // Ajouter un espace non-sécable pour les espaces
                    } else {
                        htmlTrack += track.trackPoints[y][x];  // Ajouter le caractère de la piste
                    }
                }
                htmlTrack += "<br>";  // Ajouter un saut de ligne après chaque ligne de la piste
            }

            trackPreview.innerHTML = `
                Grid : ${track.trackPoints[0].length} x ${track.trackPoints.length}
                <br>
                <div style="font-family: monospace; line-height: 0.6; font-size: 4px; text-align: left;">
                ${htmlTrack}
                </div>
            `;
        } else {
            trackPreview.innerHTML = 'Veuillez sélectionner un circuit pour voir la prévisualisation.';
        }
    }
    



    function fctReinit() {
        //Réinitilisation
        elan = { x: 0, y: 0 };
        //supprimer ancien parcours
        currentPath = [];
        //Suppression sur la grille (points et lignes)
        const connectedPoints = document.querySelectorAll('.connected-point');
        connectedPoints.forEach(div => {
            div.remove();
        });
        const lines = document.querySelectorAll('.line');
        lines.forEach(div => {
            div.remove();
        });

        // ============  Sélectionner un point aléatoire
        let randomIndex = Math.floor(Math.random() * startPoints.length); // Génère un index aléatoire
        let randomStartPoint = startPoints[randomIndex]; // Récupère le point aléatoire
        console.log('randomStartPoint',randomStartPoint);
        pos = { x: randomStartPoint.x, y: randomStartPoint.y }; // Position centrale initiale
        // Démarre le chemin
        currentPath.push(pos);
        // Dessine le 1er point sur la grille
        const firstpoint = document.createElement('div');
        firstpoint.id='p-0';
        firstpoint.classList.add('connected-point');
        firstpoint.style.gridColumnStart = pos.x + 1; // 1-based pour le CSS Grid
        firstpoint.style.gridRowStart = pos.y + 1;
        firstpoint.innerHTML = "0";
        grid.appendChild(firstpoint);
        fctAffichageNext();

        //Recherche Score
        if (tracksBestScores[currentTrack.trackName]) {
            divScore.innerHTML = "<span style='font-size:16px'>"+tracksBestScores[currentTrack.trackName].score+"</span> 🏆";
        } else {
            divScore.innerHTML = "no record";
        }

        btnUndo.disabled = true;
        spnPoint.innerHTML = '';

        //Cache Menu
        divConfigBtn.style.display = 'none'; // Masquer l'élément
        divTracksBoutons.style.display = 'none';
        trackPreview.style.display = 'none';
        loadTrackBtn.style.display = 'none';
    }

    // Fonction pour charger les données du circuit sélectionné (depuis Btn)
    function loadSelectedTrack() {
        const selectedRadio = document.querySelector('input[name="track"]:checked');
        
        if (selectedRadio) {
            currentTrack = tracks[selectedRadio.dataset.trackIndex];
            showRibbon('Circuit <b>'+currentTrack.trackName+'</b> loaded.<br>Good luck !',3000);
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

        startPoints = [];
        finishPoints = [];
        let x,y;
        let divDot;
        for (y = 0; y < trackPoints.length; y++) {
            let characters = Array.from(trackPoints[y]);
            for (x = 0; x < trackPoints[y].length; x++) {
                if (trackPoints[y][x]=='█' || trackPoints[y][x]=='#' || trackPoints[y][x]=='@') {
                    // Ajouter des elmts transparents au masque
                    // Vérifier les cases adjacentes
                    let top = y > 0 ? trackPoints[y - 1][x] : ' '; // Case au-dessus
                    let bottom = y < trackPoints.length - 1 ? trackPoints[y + 1][x] : ' '; // Case en dessous
                    let left = x > 0 ? trackPoints[y][x - 1] : ' '; // Case à gauche
                    let right = x < trackPoints[y].length - 1 ? trackPoints[y][x + 1] : ' '; // Case à droite

                    const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
                    let newPoints ="";
                    if (['#', '@', '█'].includes(top) || ['#', '@', '█'].includes(left)) {
                        let topleftPoints = (x*cellSize-(cellSize/2)-1) + ',' + (y*cellSize-(cellSize/2)-1);
                        newPoints += topleftPoints+" ";
                    }
                    if (['#', '@', '█'].includes(top) && ['#', '@', '█'].includes(left)) {
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
                    if (['#', '@', '█'].includes(top) || ['#', '@', '█'].includes(right)) {
                        let toprightPoints = (x*cellSize+(cellSize/2)+1) + ',' + (y*cellSize-(cellSize/2)-1);
                        newPoints += toprightPoints+" ";
                    }
                    if (['#', '@', '█'].includes(top) && ['#', '@', '█'].includes(right)) {
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
                    if (['#', '@', '█'].includes(bottom) || ['#', '@', '█'].includes(right)) {
                        let bottomrightPoints = (x*cellSize+(cellSize/2)+1) + ',' + (y*cellSize+(cellSize/2)+1);
                        newPoints += bottomrightPoints+" ";
                    }
                    if (['#', '@', '█'].includes(bottom) && ['#', '@', '█'].includes(right)) {
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
                    if (['#', '@', '█'].includes(bottom) || ['#', '@', '█'].includes(left)) {
                        let bottomleftPoints = (x*cellSize-(cellSize/2)-1) + ',' + (y*cellSize+(cellSize/2)+1);
                        newPoints += bottomleftPoints+" ";
                    }
                    if (['#', '@', '█'].includes(bottom) && ['#', '@', '█'].includes(left)) {
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
                    //const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                    //rect.setAttribute("x", (x)*cellSize-(cellSize/2)-1);
                    //rect.setAttribute("y", (y)*cellSize-(cellSize/2)-1);
                    //rect.setAttribute("width", cellSize+2);
                    //rect.setAttribute("height", cellSize+2);
                    //rect.setAttribute("fill", "black");
                    //svgMask.appendChild(rect);

                    if (trackPoints[y][x]=='#' || trackPoints[y][x]=='@') {
                        divDot = document.createElement('div');
                        if (trackPoints[y][x]=='#') {
                            divDot.id = x+'_'+y+'_'+'START';
                            startPoints.push({ x: x, y: y });
                        }
                        if (trackPoints[y][x]=='@') {
                            divDot.id = x+'_'+y+'_'+'FINISH';
                            finishPoints.push({ x: x, y: y });
                        } 
                        divDot.classList.add('divDotStart');
                        divDot.style.gridColumnStart = x+1;
                        divDot.style.gridRowStart = y+1;               
                        grid.insertBefore(divDot, divCadreZoom);
                        
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

        if (['#', '@', '█'].includes(left)) {
            boxShadowFinal += boxShadowLeft;
        }
        if (['#', '@', '█'].includes(right)) {
            boxShadowFinal += boxShadowRight;
        }
        if (['#', '@', '█'].includes(top)) {
            boxShadowFinal += boxShadowTop;
        }
        if (['#', '@', '█'].includes(bottom)) {
            boxShadowFinal += boxShadowBottom;
        }
        if (boxShadowFinal!='') {
            divDot.style.boxShadow = boxShadowFinal.slice(0, boxShadowFinal.length - 1);
        }
        //Arrondis
        if (['#', '@', '█'].includes(top) && ['#', '@', '█'].includes(left)) {
            divDot.style.borderTopLeftRadius = '10px';
        }
        if (['#', '@', '█'].includes(top) && ['#', '@', '█'].includes(right)) {
            divDot.style.borderTopRightRadius = '10px';
        }
        if (['#', '@', '█'].includes(bottom) && ['#', '@', '█'].includes(left)) {
            divDot.style.borderBottomLeftRadius = '10px';
        }
        if (['#', '@', '█'].includes(bottom) && ['#', '@', '█'].includes(right)) {
            divDot.style.borderBottomRightRadius = '10px';
        }         
    }



    // ========== CONFIG ============


    divMenuBtn.addEventListener('click', function() {
        if (divConfigBtn.style.display === 'none' || divConfigBtn.style.display === '') {
            divConfigBtn.style.display = 'block'; // Afficher l'élément
            divTracksBoutons.style.display = 'block';
            trackPreview.style.display = 'block';
            loadTrackBtn.style.display = 'block';
        } else {
            divConfigBtn.style.display = 'none'; // Masquer l'élément
            divTracksBoutons.style.display = 'none';
            trackPreview.style.display = 'none';
            loadTrackBtn.style.display = 'none';
        }
    });

    let configMode = false;
    // Fonction appelée lorsqu'un div .divDot est cliqué
    function handleDivDotClick(event) {
        const divId = event.target.id; // Récupérer l'ID de la div cliquée
        console.info('Div cliquée avec ID:', divId);
        // Tester si l'ID se termine par "FREE"
        if (divId.endsWith("FREE")) {
            //console.info('L\'ID se termine par "FREE":', divId);
            //change ID
            event.target.id = divId.replace("FREE", "");
            event.target.classList.add('divDotBlocEdit');
        } else {
            //console.info('L\'ID ne se termine pas par "FREE":', divId);
            //change ID
            event.target.id = divId + 'FREE';
            event.target.classList.remove('divDotBlocEdit');
            event.target.classList.remove('divDotBlocPlay');
        }
    }
    // Ajouter l'événement de clic sur la divConfig
    divConfigBtn.addEventListener('click', function() {
        // Sélectionner toutes les divs de classe divDot
        const divDots = document.querySelectorAll('.divDot');
        if (configMode) { //on quitte l'éditeur
            // Pour supprimer l'écouteur :
            divDots.forEach(divDot => {
                divDot.removeEventListener('click', handleDivDotClick);
                divDot.style.cursor = 'default';
                if (!divDot.id.endsWith("FREE")) {
                    divDot.classList.remove('divDotBlocEdit');
                    divDot.classList.add('divDotBlocPlay');
                } else {
                    divDot.style.opacity=0;
                }
            });
            divConfigBtn.style.backgroundColor = 'rgba(112, 104, 230, 0.5)';
            configMode = false;
        } else { // passage en mode éditeur
            // Ajouter un écouteur de clic à chaque divDot
            divDots.forEach(divDot => {
                divDot.style.cursor = 'pointer';
                if (divDot.id.endsWith("FREE")) {
                    divDot.style.opacity = 1;
                } else {
                    divDot.classList.add('divDotBlocEdit');
                }
                divDot.addEventListener('click', handleDivDotClick);
            });
            console.info('Les divs .divDot sont maintenant cliquables');
            divConfigBtn.style.backgroundColor = 'orange';
            configMode = true;
        }
        
    });

    //================================================================================
    //================================================================================
    //=============================       UNDO       =================================
    //================================================================================
    //================================================================================

    btnUndo.addEventListener('click', function() {
        //On annule le dernier coup
        console.info('🔙Undo',currentPath);
        currentPath.pop(); //Suppression du dernier
        pos = currentPath[currentPath.length-1];
        previousPos = currentPath[currentPath.length-2];
        console.info('🔙Undo',pos,previousPos);
        elan.x = pos.x-previousPos.x;
        elan.y = pos.y-previousPos.y;

        let lines = document.querySelectorAll('.line');
        let connectedPoints = document.querySelectorAll('.connected-point');
        if (lines.length > 0) {
            let lastLine = lines[lines.length - 1];
            lastLine.remove();
        }
        if (connectedPoints.length > 0) {
            let lastConnectedPoint = connectedPoints[connectedPoints.length - 1];
            lastConnectedPoint.remove();
        }

        spnPoint.innerHTML = currentPath.length;

        fctAffichageNext();
    });


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
        console.info('Début sur le bouton:', this.getAttribute('data-value'));
        if (this.style.cursor == 'pointer') {
            activePoint = this; // Enregistrer le point enfoncé initialement
            isInsideButton = true; // Marquer comme étant à l'intérieur d'un bouton
            simuLine.style.opacity = 1;
            divNextPoint.style.opacity = 1;
            //playSound('marker-on-whiteboard.mp3');
            fctMoveFromCommand(this.getAttribute('data-value'),true);
            this.style.border = '4px solid blue';
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
                        console.info('Changement de bouton:', point.getAttribute('data-value'));                
                        activePoint.style.border = '';
                        activePoint = point; // Mettre à jour le bouton actif
                        point.style.border = '4px solid blue';
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
            console.info('Sorti de tous les boutons, action annulée');
            simuLine.style.opacity = 0;
            divNextPoint.style.opacity = 0;
        } else {
            activePoint.style.border = '4px solid blue';
            isInsideButton = true;
            simuLine.style.opacity = 1;
            divNextPoint.style.opacity = 1;
        }
    }

    // Fonction déclenchée lorsque le bouton ou l'écran est relâché
    function onEnd(event) {
        if (isInsideButton && activePoint) {
            console.info('Relâché sur le bouton:', activePoint.getAttribute('data-value'));
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
        activePoint.style.border = '';
        activePoint = null; // Réinitialiser
        isInsideButton = false; // Réinitialiser
        simuLine.style.opacity = 0;
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




    // Fonction pour dessiner une ligne entre deux points
    function drawLine(start, end,simulateBool) {
        console.info('drawLine',start,end,simulateBool);
        let line;
        if (simulateBool) {
            simuLine.style.opacity = 1;
            line = simuLine;
        } else {
            line = document.createElement('div');
            line.classList.add('line');
        } 

        // Calculer la position de départ et d'arrivée
        const startX = start.x * cellSize; // Ajuste pour le décalage du point
        const startY = start.y * cellSize; // Ajuste pour le décalage du point
        const endX = end.x * cellSize; // Ajuste pour le décalage du point
        const endY = end.y * cellSize; // Ajuste pour le décalage du point
        
        //line.style.margin = '-5px'; /* Décalage négatif pour centrer le point */
        // Calculer la longueur de la ligne
        const length = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
        line.style.height = `${length}px`;

        // Calculer l'angle de rotation
        const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI)-90; // Convertir en degrés
        line.style.transformOrigin = '0 0'; // Origine pour rotation
        line.style.transform = `translate(${startX}px, ${startY}px) rotate(${angle}deg)`; // Applique la translation et la rotation

        if (!simulateBool) {
            //grid.appendChild(line); // Ajoute la ligne à la grille
            grid.insertBefore(line, divCadreZoom);
        }
        divNextPoint.style.left = (end.x) * cellSize +'px';
        divNextPoint.style.top = (end.y) * cellSize +'px';
    }


    function fctMoveFromCommand(commandNb,simulateBool) {

        value = parseInt(commandNb); // Convertit la valeur en nombre
        console.info('==> fctMoveFromCommand : Clic sur',value,simulateBool);


        //console.info('pos', pos);
        let startPos = { x: 0, y: 0 };
        startPos.x = pos.x;
        startPos.y = pos.y;
        let endPos = { x: 0, y: 0 };
        endPos.x = pos.x;
        endPos.y = pos.y;

        endPos.x += elan.x + delta[value].x;
        endPos.y += elan.y + delta[value].y;
        let endPos2 = { x: 0, y: 0 };
        endPos2.x = endPos.x + elan.x + delta[value].x;
        endPos2.y = endPos.y + elan.y + delta[value].y;

        if (!simulateBool)
        {
            // Calcule la position précédente pour le calcul de l'élan
            previousPos.x = pos.x;
            previousPos.y = pos.y;
            // Calcule la nouvelle position centrale
            // Applique l'élan pour la nouvelle position
            pos.x += elan.x + delta[value].x;
            pos.y += elan.y + delta[value].y;
            // Calcul de l'élan entre le point précédent et le nouveau point
            elan.x = pos.x - previousPos.x; // Changement en x
            elan.y = pos.y - previousPos.y; // Changement en y
            let elanFinal = Math.sqrt(Math.pow(elan.x, 2)+Math.pow(elan.y, 2));
            playSound('sharpie_on_paper.mp3',(10-elanFinal)*.5);
            // Ajoute la nouvelle position au chemin
            currentPath.push({ x: pos.x, y: pos.y });
            // Dessine le point sur la grille
            const point = document.createElement('div');            
            point.id = "p-"+(currentPath.length-1);
            point.classList.add('connected-point');
            point.style.gridColumnStart = pos.x + 1; // 1-based pour le CSS Grid
            point.style.gridRowStart = pos.y + 1;
            point.innerHTML = currentPath.length-1;
            grid.appendChild(point);

        }
        drawLine(startPos, endPos,simulateBool);


        //Maj du speedometer
        let speed = parseInt(100*Math.sqrt(Math.pow(elan.x + delta[value].x, 2)+Math.pow(elan.y + delta[value].y, 2)))/100
        divSpeed.innerHTML = speed;
        divSpeed.style.height = (speed*20)+15 + 'px';
        divSpeed.style.backgroundColor = valueToColorGradient(speed);

        
        if (!simulateBool) {
            if (fctTestFinish()) {
                playSound('claps-few-people.mp3');
                fctCenterOnMap();   
                // Si tracksBestScores est déjà un tableau, sinon initialisez-le
                // Vérifie si il y a déjà un score pour ce circuit
                if (!tracksBestScores[currentTrack.trackName] || (currentPath.length-1) < tracksBestScores[currentTrack.trackName].score) {
                    // Mets à jour le meilleur score si le chemin est plus court
                    tracksBestScores[currentTrack.trackName] = { track: currentTrack.trackName, score: (currentPath.length-1) };
                    //console.info('tracksBestScores',tracksBestScores);
                    divScore.innerHTML = "<span style='font-size:16px'>"+(currentPath.length-1)+"</span> 🏆";
                    showRibbon('You win in '+(currentPath.length-1)+' steps !<br>New best score for ' + currentTrack.trackName + '!', 7000);  
                    playSound('magic.mp3');
                } else {
                    showRibbon('You win in '+(currentPath.length-1)+' steps !<br>Try again to beat the best score!', 7000);  
                }



                setTimeout(function() {
                    fctReinit();
                }, 7000);
                
            } else {
                fctAffichageNext();
            }            
        }            
        else {
            divCadreZoom2.style.left = (cellSize * (endPos2.x-2))+(cellSize/2) +'px';
            divCadreZoom2.style.top = (cellSize * (endPos2.y-2))+(cellSize/2) +'px';
            let myPbRate = 4 - (speed * (4 - 0.25) / 10);
            //let myPbRate = (10-speed)*.5;
            myPbRate = Math.max(myPbRate, 0.25);
            playSound('marker-on-whiteboard.mp3',myPbRate);
        }

    }


    function fctTestFinish() {
        return finishPoints.some(point => point.x === pos.x && point.y === pos.y);
    }



    function fctAffichageNext() {
            //Affichage next Zoom
            divCadreZoom.style.left = (cellSize * (pos.x+elan.x-2)+(cellSize/2)) +'px';
            divCadreZoom.style.top = (cellSize * (pos.y+elan.y-2)+(cellSize/2)) +'px';
            console.info('fctAffichageNext pos',pos);
            let testFini = 0;
            let elanInitial = Math.sqrt(Math.pow(elan.x, 2)+Math.pow(elan.y, 2));
            buttons.forEach(button => {
                const value = button.getAttribute('data-value');
                
                let button_x = pos.x + elan.x + delta[value].x;
                let button_y = pos.y + elan.y + delta[value].y;
                let elanFinal = Math.sqrt(Math.pow(elan.x + delta[value].x, 2)+Math.pow(elan.y + delta[value].y, 2));
                //console.log(button_x,currentTrack.trackPoints[0].length,button_y,currentTrack.trackPoints.length);
                console.info(value,currentTrack.trackPoints[button_y][button_x]);
                //Recherche de la div sur la grille
                
                if (currentTrack.trackPoints[button_y][button_x]===' ' || button_x<0 || button_y<0 || button_x>=cellNbX || button_y>=cellNbY) {
                    //Case interdite existante !
                    button.disabled = true; // Désactive le bouton
                    button.style.cursor = 'default';
                    button.style.backgroundColor = 'black';
                    button.style.opacity = .5;
                    console.info(value,button_x+'_'+button_y+'_',pos);
                    testFini++;
                } else {
                    button.disabled = false; // Active le bouton
                    button.style.cursor = 'pointer';
                    button.style.backgroundColor = valueToColor(elanFinal-elanInitial);
                    button.style.opacity = 1;
                }
            });
            if (testFini == 9) {                
                playSound('car-explosion-debris.mp3');
                fctCenterOnMap();

                showRibbon('You loose 😥 !<br>Restart !', 4000);
                setTimeout(function() {
                    fctReinit();
                }, 4000);
            }
            divNextPoint.style.left = (cellSize * (pos.x+elan.x-3)) +'px';
            divNextPoint.style.top = (cellSize * (pos.y+elan.y-3)) +'px';
            fctMoveFromCommand(5,true);


            //Maj du bouton undo 🔙
            if (currentPath.length>2) {
                btnUndo.disabled = false;
                spnPoint.innerHTML = currentPath.length-1;
            } else {
                btnUndo.disabled = true;
            }

            let deltaX = pos.x + elan.x + elan.x;
            let deltaY = pos.y + elan.y + elan.y;
            let ptZoom = { x: deltaX, y: deltaY };
            //Maj du scale en fonction de l'élan
            scale = 1.5-(elanInitial*.1);
            fctCenterOnPoint(ptZoom);
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
    

    divCenter.addEventListener('click', function() {
        fctCenterOnMap();       
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
    function showRibbon(htmlText, msDelay) {
        
        divRibbon.innerHTML = htmlText;
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
                console.info('🔊',i,fileName,'pbRate',pbRate);
                soundPlayed = true;
                break;
            }
        }      
        if (!soundPlayed)
            console.warn("🔊🔥⚡ "+fileName);
    }






});