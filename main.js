// l'importation s'est mal passées

const joursSemaine = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
let ajd = new Date();
let option = {weekday : 'long'};
let jourActuel = ajd.toLocaleDateString("fr-FR", option);
    jourActuel = jourActuel.charAt(0).toUpperCase() + jourActuel.slice(1);

let tabJoursEnOrdre = joursSemaine.slice(joursSemaine.indexOf(jourActuel)).concat(joursSemaine.slice(0, joursSemaine.indexOf(jourActuel)));
console.log(tabJoursEnOrdre);

const cleAPI= "d09f7c50be3bf52cc37580a11be1d884";
let resultatsAPI;
const temps = document.querySelector(".temps");
const temperature = document.querySelector(".temperature");
const localisation = document.querySelector(".localisation");
const imgIcone = document.querySelector(".logo-meteo")

// querySelectorALL renvoie un tableau ! (donc on peut itérer dessus)

const heure = document.querySelectorAll(".heure-nom-prevision");
const tempParH = document.querySelectorAll(".heure-prevision-valeur");

const jour = document.querySelectorAll(".jour-prevision-nom");
const jourPrevision = document.querySelectorAll(".jour-prevision-temps");



if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {

        let long = position.coords.longitude;
        let lat = position.coords.latitude
        //console.log(lat, long);

    //On crée une méthode 
    appelAPI(long, lat);

    }, () => {
        alert("Vous avez refusez la géolocalisation. L'application ne peut donc pas fonctionner. Veuillez l'activer.")
    })
}

function appelAPI(long, lat) {

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely&unit=metric&lang=fr&appid=${cleAPI}`)
            .then ((reponse) => {
                return reponse.json();
            })
            .then ((data) => {
                resultatsAPI = data;
                console.log(data);

                temps.innerText = data.current.weather[0].description;
                temperature.innerText = Math.trunc(data.current.temp) + "°";
                localisation.innerText = data.timezone;

            
                let heureActuelle = new Date().getHours();
                
                for (let i=0; i < heure.length; i++ ){
                    
                    let heureIncr = heureActuelle + i*3;

                    if (heureIncr > 24) {
                        heure[i].innerText = heureIncr - 24 + "h";
                    } else if (heureIncr === 24) {
                        heure[i].innerText = "00h"
                    } else {
                        heure[i].innerText = heureIncr + "h";
                    }
                }

                for (let j=0; j < tempParH.length; j++) {
                    tempParH[j].innerText = Math.trunc(data.hourly[j*3].temp) + "°";
                }

// 3 premiers lettres du jour 

                for (let k=0; k < tabJoursEnOrdre.length; k++) {
                    jour[k].innerText = tabJoursEnOrdre[k].slice(0,3);
                }
// prevision pour les jours suivants 

                for (let l=0; l< 7; l++){
                    jourPrevision[l].innerText= Math.trunc(data.daily[l+1].temp.day) +"°";
                }
// icone meteo affiché dynamiquement 

                if (heureActuelle >= 6 && heureActuelle < 21) {
                    imgIcone.src = `ressources/jour/${data.current.weather[0].icon}.svg`;
                }

                else {
                    imgIcone.src = `ressources/nuit/${data.current.weather[0].icon}.svg`;
                }

            });
};
