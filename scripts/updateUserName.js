const fs = require('fs');
const db = require('./db.json');

let users = db.users;
let planos = db.planos;

for (var key in users) {
  if (users.hasOwnProperty(key)) {
    let user = users[key];

    if (planos[user.projeto][key]) {
      planos[user.projeto][key]['agrupador'] = user.agrupador || 'Sem Agrupador';
      planos[user.projeto][key].plano['userName'] = user.nome || 'Sem Nome';
    }
  }
}

fs.writeFile("./update.json", JSON.stringify(planos), err => {
  if(err) {
    console.log(err);
  } else {
    console.log("update.json salvo com sucesso!");
  }
});
