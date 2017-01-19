export default class RevisarController {
  constructor($scope, $rootScope, $stateParams, FirebaseFactory, $state, PlanoStatus, PlanoClassificacao) {
    Object.assign(this, {$scope, $rootScope, FirebaseFactory, $state, PlanoStatus, PlanoClassificacao});

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
          this.status = dados.status;
          this.revisao = dados.revisao;
          this.plano = dados.plano;
          this.bloqueio = dados.bloqueio;

          for (var status in this.PlanoClassificacao.STATUSES) {
            if (this.PlanoClassificacao.STATUSES.hasOwnProperty(status)) {
              this.plano[status] = dados[status] || false;
            }
          }

          this.receitas = this.totalGeral(dados.plano.receitas);
          this.custosVariaveisTotais = this.totalGeral(dados.plano.custos);
          this.custosFixosTotais = this.totalSimples(dados.plano.custosFixos) * 1.05;
          this.despesas = this.custosVariaveisTotais + this.custosFixosTotais;
          this.margemDeContribuicao = this.receitas - this.custosVariaveisTotais;
          this.resultadoOperacional = this.margemDeContribuicao - this.custosFixosTotais;
          this.lucro = this.receitas - this.despesas;
          this.capitalDeGiro = this.despesas * 2;
          this.investimento = this.totalGeral(dados.plano.investimentos);
          this.investimentoTotal = this.investimento + this.capitalDeGiro;
          this.taxaDeRetorno = this.investimentoTotal / this.lucro;

          this.$scope.$apply();
        });

      })
      .catch(err => {
        console.error('Error:', err);
      });
  }

  saveRevisao(revisao) {
    if (!revisao) throw new Exception('Revisão não encontrada');

    this
      .PlanoStatus
      .setStatus(this.projeto, this.uid, this.PlanoStatus.STATUSES.REVISANDO)
      .then(()=> {
        return this.FirebaseFactory
          .update(`/planos/${this.projeto}/${this.uid}`, {
            revisao: revisao,
            revisor: this.FirebaseFactory.getAuth().displayName
          })
      })
      .then(() => {
        this.$rootScope.addMensagem('Revisão salva com sucesso!');

        this.$rootScope.isLoading = false;
        this.$scope.$apply();
      })
      .catch((m) => {
        this.$rootScope.addMensagem(m, 'danger');
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
          .set(`/planos/${this.projeto}/${this.uid}/bloqueio`, this.bloqueio)
      )
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
            plano, revisao,
            revisor: this.FirebaseFactory.getAuth().displayName
          })
      })
      .then(() => {
        this.$rootScope.addMensagem('A revisão do plano foi finalizada e o plano de negócio enviado para o aluno com sucesso.');
        this.$scope.$apply();
      })
      .catch((m) => {
        this.$rootScope.addMensagem(m, 'danger');
        this.$scope.$apply();
      });
  }

  totalGeral(dados) {
    if (!dados) return;
    return dados.reduce((p, x)=> p + (this.toMoney(x.valor) * this.toMoney(x.quantidade)), 0);
  }

  totalSimples(dados) {
    if (!dados) return;
    return Object.keys(dados).reduce((p, x)=> p + this.toMoney(dados[x]), 0);
  }

  toMoney(v) {
    return parseFloat(v) || 0;
  }
}

RevisarController.$inject = ['$scope', '$rootScope', '$stateParams', 'FirebaseFactory', '$state', 'PlanoStatus', 'PlanoClassificacao'];
