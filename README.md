# workout_tracker
 
 KØR:  
 npm install  
 npm start  
 
Nyeste ændringer:
udover nogle ekstra knapper har vi lavet lidt routing og default øvelse ved oprettelsen af et nyt træningsprogram.
NewExercise.ejs nåede vi kun lige at begynde på, så den har en masse fejl når man prøver at poste den. 

// TODO: på en eller anden måde skal WORKOUTPROGRAM opdateres til at kunne modificeres  
// med EXERCISES. Se i WORKOUTPROGRAMSCONTROLLER, samt WORKOUTPROGRAM model for mere.  
// APP.JS indeholder routes, men kræver nogle stykker mere for at kunne lave exercises.  
// Kig i SHOW.EJS for WORKOUTPROGRAMS for at se oversigten over visningen af det   
// enkelte workoutProgram.   

Se evt: https://mongoosejs.com/docs/populate.html  
https://stackoverflow.com/questions/54438939/save-mongo-mongoose-object-within-another-model  
hvis det kræver en model mere


HUSK AT TILFØJE DETTE TIL DE URIS DER KRÆVER LOGIN

let auth = require('connect-ensure-login');

app.get('/profile',  
auth.ensureLoggedIn('/login'),  
function(req, res){  
res.render('profile', { user: req.user });  
});  
