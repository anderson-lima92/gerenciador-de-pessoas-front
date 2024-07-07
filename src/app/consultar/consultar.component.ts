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
  displayedColumns: string[] = ['cpf', 'active', 'name', 'birthDate', 'street', 'zipcode', 'number', 'city', 'primaryAddress'];

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.consultaForm = this.fb.group({
      cpfConsulta: ['']
    });
    this.mensagemConsulta = '';
  }

  onSubmit() {
    const cpfConsulta = this.consultaForm.value.cpfConsulta;
    this.http.get(`http://localhost:8080/persons/${cpfConsulta}`)
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
    if (resultados.addresses && Array.isArray(resultados.addresses)) {
      resultados.addresses.forEach((endereco: any) => {
        this.resultados.push({
          cpf: resultados.cpf,
          active: resultados.active ? "Ativo" : "Inativo",
          name: resultados.name,
          birthDate: resultados.birthDate,
          street: endereco.street,
          zipcode: endereco.zipcode,
          number: endereco.number,
          city: endereco.city,
          primaryAddress: endereco.primaryAddress ? "Sim" : "Não"
        });
      });
    } else {
      this.resultados.push({
        cpf: resultados.cpf,
        active: resultados.active ? "Ativo" : "Inativo",
        name: resultados.name,
        birthDate: resultados.birthDate,
        street: resultados.addresses ? resultados.addresses[0].street : "",
        zipcode: resultados.addresses ? resultados.addresses[0].zipcode : "",
        number: resultados.addresses ? resultados.addresses[0].number : "",
        city: resultados.addresses ? resultados.addresses[0].city : "",
        primaryAddress: resultados.addresses ? (resultados.addresses[0].primaryAddress ? "Sim" : "Não") : ""
      });
    }
  }
}
