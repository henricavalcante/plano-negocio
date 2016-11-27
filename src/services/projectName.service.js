'use strict';

import angular from 'angular';

const ProjectName = () => {
  let projects = {
    12: '12',
    16: 'Atividade CEEV',
    19: 'Cursos WiLivro',
    32: 'Treinamento',
    57: 'Empreendedor Juvenil - Ceará 2016',
    60: 'Juventude Empreendedora - Alagoas 2016',
    68: 'Plano de Negócios em Grupo CE 2016'
  };

  return function(id) {
    if (!projects[id]) return id;

    return projects[id];
  };
};

export default angular.module('services.ProjectName', [])
  .service('ProjectName', ProjectName)
  .name;
