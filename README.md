# workout_tracker
 
 KØR:  
 npm install  
 npm start  

TODO:  
- tilføj authentication til visse links  
- enten fjern knapper for exercises eller  
- tilføj model (populate) for exercises og tilføj funktionalitet for at create/edit/delete disse  
--- https://stackoverflow.com/questions/45515992/mongodb-and-express-dynamic-queries-for-routes-with-several-ids  
- tjek at der ikke bliver lavet en fake exercise tilføjelse ved workout Creation  
- tjek kravene på opgaven mod løsningen  
- fjern/tilføj workoutActivities  



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
