# workout_tracker


TODO: Remember to add authorization to links

let auth = require('connect-ensure-login');

app.get('/profile',  
  auth.ensureLoggedIn('/login'),  
  function(req, res){  
  res.render('profile', { user: req.user });  
});  
