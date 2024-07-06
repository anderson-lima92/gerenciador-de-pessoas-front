import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-consultar',
  templateUrl: './consultar.component.html',
  styleUrls: ['./consultar.component.css']
})
export class ConsultarComponent {
  consultaForm: FormGroup;
  mensagemConsulta: string;
  resultados: any[] = [];
  displayedColumns: string[] = ['cpf', 'ativo', 'nome', 'dataNascimento', 'logradouro', 'cep', 'numero', 'cidade', 'enderecoPrincipal'];

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.consultaForm = this.fb.group({
      cpfConsulta: ['']
    });
    this.mensagemConsulta = '';
  }

  onSubmit() {
    const cpfConsulta = this.consultaForm.value.cpfConsulta;
    this.http.get(`http://localhost:8080/pessoas/${cpfConsulta}`)
      .subscribe({
        next: (data: any) => {
          this.exibirResultados(data);
        },
        error: (error) => {
          this.mensagemConsulta = error.error.message || 'Erro ao consultar pessoa';
          setTimeout(() => this.mensagemConsulta = '', 10000);
        }
      });
  }

  exibirResultados(resultados: any) {
    this.resultados = [];
    if (resultados.enderecos && Array.isArray(resultados.enderecos)) {
      resultados.enderecos.forEach((endereco: any) => {
        this.resultados.push({
          cpf: resultados.cpf,
          ativo: resultados.ativo ? "Ativo" : "Inativo",
          nome: resultados.nome,
          dataNascimento: resultados.dataNascimento,
          logradouro: endereco.logradouro,
          cep: endereco.cep,
          numero: endereco.numero,
          cidade: endereco.cidade,
          enderecoPrincipal: endereco.enderecoPrincipal ? "Sim" : "Não"
        });
      });
    } else {
      this.resultados.push({
        cpf: resultados.cpf,
        ativo: resultados.ativo ? "Ativo" : "Inativo",
        nome: resultados.nome,
        dataNascimento: resultados.dataNascimento,
        logradouro: resultados.enderecos ? resultados.enderecos[0].logradouro : "",
        cep: resultados.enderecos ? resultados.enderecos[0].cep : "",
        numero: resultados.enderecos ? resultados.enderecos[0].numero : "",
        cidade: resultados.enderecos ? resultados.enderecos[0].cidade : "",
        enderecoPrincipal: resultados.enderecos ? (resultados.enderecos[0].enderecoPrincipal ? "Sim" : "Não") : ""
      });
    }
  }
}
