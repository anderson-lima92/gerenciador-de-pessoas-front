import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-atualizar',
  templateUrl: './atualizar.component.html',
  styleUrls: ['./atualizar.component.css']
})
export class AtualizarComponent {
  atualizarForm: FormGroup;
  mensagemAtualizar: string;
  sucessoAtualizar: boolean;
  resultados: any;
  valoresIniciais: any;
  botaoAtualizarDesabilitado: boolean = true;
  displayedColumns: string[] = ['cpf', 'ativo', 'nome', 'dataNascimento', 'logradouro', 'cep', 'numero', 'cidade'];

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.atualizarForm = this.fb.group({
      cpfConsulta: ['']
    });
    this.mensagemAtualizar = '';
    this.sucessoAtualizar = false;
  }

  onSubmit() {
    const cpfConsulta = this.atualizarForm.value.cpfConsulta;
    this.http.get(`http://localhost:8080/pessoas/${cpfConsulta}`)
      .subscribe({
        next: (data: any) => {
          this.exibirResultadosAtualizar(data);
        },
        error: (error) => {
          this.mensagemAtualizar = error.error.message || 'Erro ao consultar pessoa';
          this.sucessoAtualizar = false;
          setTimeout(() => this.mensagemAtualizar = '', 10000);
        }
      });
  }

  exibirResultadosAtualizar(resultados: any) {
    this.resultados = resultados;
    this.valoresIniciais = {
      nome: resultados.nome,
      dataNascimento: resultados.dataNascimento,
      logradouro: resultados.enderecos[0].logradouro,
      cep: resultados.enderecos[0].cep,
      numero: resultados.enderecos[0].numero,
      cidade: resultados.enderecos[0].cidade
    };
    this.botaoAtualizarDesabilitado = true; // Começa desabilitado
  }

  verificarMudancas() {
    this.botaoAtualizarDesabilitado = !(
      this.resultados.nome !== this.valoresIniciais.nome ||
      this.resultados.dataNascimento !== this.valoresIniciais.dataNascimento ||
      this.resultados.enderecos[0].logradouro !== this.valoresIniciais.logradouro ||
      this.resultados.enderecos[0].cep !== this.valoresIniciais.cep ||
      this.resultados.enderecos[0].numero !== this.valoresIniciais.numero ||
      this.resultados.enderecos[0].cidade !== this.valoresIniciais.cidade
    );
  }

  atualizarPessoa() {
    const dadosAtualizados = {
      nome: this.resultados.nome,
      dataNascimento: this.resultados.dataNascimento,
      enderecos: [{
        logradouro: this.resultados.enderecos[0].logradouro,
        cep: this.resultados.enderecos[0].cep,
        numero: this.resultados.enderecos[0].numero,
        cidade: this.resultados.enderecos[0].cidade,
        enderecoPrincipal: true
      }]
    };

    this.http.put(`http://localhost:8080/pessoas/${this.resultados.cpf}`, dadosAtualizados, { responseType: 'text' })
      .subscribe({
        next: (response: string) => {
          this.mensagemAtualizar = response;
          this.sucessoAtualizar = true;
          this.valoresIniciais = { ...dadosAtualizados, dataNascimento: this.valoresIniciais.dataNascimento };
          this.botaoAtualizarDesabilitado = true; // Desabilita o botão novamente
          setTimeout(() => this.mensagemAtualizar = '', 5000);
        },
        error: (error) => {
          console.error('Erro ao atualizar pessoa:', error);
          this.mensagemAtualizar = error.error?.message || 'Erro ao atualizar pessoa';
          this.sucessoAtualizar = false;
          setTimeout(() => this.mensagemAtualizar = '', 10000);
        }
      });
  }
}
