import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {
  displayedColumns: string[] = ['cpf', 'ativo', 'nome', 'dataNascimento', 'logradouro', 'cep', 'numero', 'cidade', 'enderecoPrincipal', 'acoes'];
  resultados: any[] = [];
  mensagemListar: string;
  sucessoListar: boolean;

  constructor(private http: HttpClient) {
    this.mensagemListar = '';
    this.sucessoListar = false;
  }

  ngOnInit(): void {
    this.buscarDados();
  }

  buscarDados(): void {
    this.http.get('http://localhost:8080/pessoas/lista-pessoas')
      .subscribe({
        next: (data: any) => {
          this.resultados = data;
        },
        error: (error) => {
          this.mensagemListar = error.error.message || 'Erro ao buscar dados';
          this.sucessoListar = false;
          setTimeout(() => this.mensagemListar = '', 10000);
        }
      });
  }

  ativarPessoa(pessoa: any): void {
    const corpoJSON = {
      nome: pessoa.nome,
      dataNascimento: pessoa.dataNascimento,
      enderecos: [{
        logradouro: pessoa.enderecos[0].logradouro,
        cep: pessoa.enderecos[0].cep,
        numero: pessoa.enderecos[0].numero,
        cidade: pessoa.enderecos[0].cidade,
        enderecoPrincipal: pessoa.enderecos[0].enderecoPrincipal
      }]
    };

    this.http.put(`http://localhost:8080/pessoas/${pessoa.cpf}`, corpoJSON, { responseType: 'text' })
      .subscribe({
        next: (response: string) => {
          this.mensagemListar = response;
          this.sucessoListar = true;
          this.buscarDados();
          setTimeout(() => this.mensagemListar = '', 5000);
        },
        error: (error) => {
          this.mensagemListar = error.error.message || 'Erro ao ativar pessoa';
          this.sucessoListar = false;
          setTimeout(() => this.mensagemListar = '', 10000);
        }
      });
  }

  desativarPessoa(cpf: string): void {
    this.http.delete(`http://localhost:8080/pessoas/desativacao/${cpf}`, { responseType: 'text' })
      .subscribe({
        next: (response: string) => {
          this.mensagemListar = response;
          this.sucessoListar = true;
          this.buscarDados();
          setTimeout(() => this.mensagemListar = '', 5000);
        },
        error: (error) => {
          this.mensagemListar = error.error.message || 'Erro ao desativar pessoa';
          this.sucessoListar = false;
          setTimeout(() => this.mensagemListar = '', 10000);
        }
      });
  }

  excluirPessoa(cpf: string): void {
    this.http.delete(`http://localhost:8080/pessoas/${cpf}`, { responseType: 'text' })
      .subscribe({
        next: (response: string) => {
          this.mensagemListar = response;
          this.sucessoListar = true;
          this.resultados = this.resultados.filter(pessoa => pessoa.cpf !== cpf);
          setTimeout(() => this.mensagemListar = '', 5000);
        },
        error: (error) => {
          this.mensagemListar = error.error.message || 'Erro ao excluir pessoa';
          this.sucessoListar = false;
          setTimeout(() => this.mensagemListar = '', 10000);
        }
      });
  }
}
