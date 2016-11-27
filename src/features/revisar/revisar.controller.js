export default class RevisarController {
  constructor($scope, $rootScope, $stateParams, FirebaseFactory, $state, PlanoStatus) {
    Object.assign(this, {$scope, $rootScope, FirebaseFactory, $state, PlanoStatus});

    this.projeto = $stateParams.projeto;
    this.uid = $stateParams.uid;

    this.loadPlano(this.projeto, this.uid);

  }

  loadPlano(projeto, uid) {
    this
      .FirebaseFactory
      .get(`/planos/${projeto}/${uid}`)
      .then(res => {
        res.json().then(dados => {

          if (dados && dados.error) {
            this.$state.go('logout');
            return;
          }

          this.plano = dados.plano;

          this.plano.receitas = this.totalGeral(dados.plano.receitas);
          this.plano.custosVariaveisTotais = this.totalGeral(dados.plano.custos);
          this.plano.custosFixosTotais = this.totalSimples(dados.plano.custosFixos) * 1.05;
          this.plano.despesas = this.plano.custosVariaveisTotais + this.plano.custosFixosTotais;
          this.plano.margemDeContribuicao = this.plano.receitas - this.plano.custosVariaveisTotais;
          this.plano.resultadoOperacional = this.plano.margemDeContribuicao - this.plano.custosFixosTotais;
          this.plano.lucro = this.plano.receitas - this.plano.despesas;
          this.plano.capitalDeGiro = this.plano.despesas * 2;
          this.plano.investimento = this.totalGeral(dados.plano.investimentos);
          this.plano.investimentoTotal = this.plano.investimento + this.plano.capitalDeGiro;
          this.plano.taxaDeRetorno = this.plano.investimentoTotal / this.plano.lucro;

          this.revisao = dados.revisao;

          this.$scope.$apply();
        });

      })
      .catch(err => {
        console.error('Error:', err);
      });
  }

  saveRevisao(revisao) {
    if (!revisao) return;

    this
      .FirebaseFactory
      .update(`/planos/${this.projeto}/${this.uid}`, {
        revisao: revisao,
        status: this.PlanoStatus.STATUSES.REVISANDO
      })
      .then(() => {
        this.$rootScope.mensagens.push({
          id: this.$rootScope.mensagens.length,
          text: 'Revisão salva com sucesso!'
        });

        this.$rootScope.isLoading = false;
        this.$scope.$apply();
      });
  }

  finishRevisao(plano, revisao) {
    plano = angular.copy(plano);
    revisao = angular.copy(revisao);
    this
      .PlanoStatus
      .setStatus(this.projeto, this.uid, this.PlanoStatus.STATUSES.REVISADO)
      .then(
        () => this
          .FirebaseFactory
          .get(`/planos/${this.projeto}/${this.uid}/historico`)
      )
      .then((res) => res.json())
      .then((json) => {
        if (json && typeof json === 'object') {
          return Object.keys(json).length;
        } else {
          return 1;
        }
      })
      .then((key) => {
        this
          .FirebaseFactory
          .set(`/planos/${this.projeto}/${this.uid}/historico/${key}`, {
            plano, revisao
          })
      })
  }

  totalGeral(dados) {
    if (!dados) return;
    return dados.reduce((p, x)=> p + (x.valor * x.quantidade), 0);
  }

  totalSimples(dados) {
    if (!dados) return;
    return Object.keys(dados).reduce((p, x)=> p + dados[x], 0);
  }

}

RevisarController.$inject = ['$scope', '$rootScope', '$stateParams', 'FirebaseFactory', '$state', 'PlanoStatus'];
