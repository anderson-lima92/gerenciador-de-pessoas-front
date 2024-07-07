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
  displayedColumns: string[] = ['cpf', 'active', 'name', 'birthDate', 'street', 'zipcode', 'number', 'city'];

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.atualizarForm = this.fb.group({
      cpfConsulta: ['']
    });
    this.mensagemAtualizar = '';
    this.sucessoAtualizar = false;
  }

  onSubmit() {
    const cpfConsulta = this.atualizarForm.value.cpfConsulta;
    this.http.get(`http://localhost:8080/persons/${cpfConsulta}`)
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
      name: resultados.name.trim(),
      birthDate: resultados.birthDate,
      street: resultados.addresses[0].street.trim(),
      zipcode: resultados.addresses[0].zipcode.trim(),
      number: resultados.addresses[0].number.trim(),
      city: resultados.addresses[0].city.trim()
    };
    this.botaoAtualizarDesabilitado = true; // Começa desabilitado
  }
  
  verificarMudancas() {
    this.botaoAtualizarDesabilitado = !(
      this.resultados.name.trim() !== this.valoresIniciais.name ||
      this.resultados.birthDate !== this.valoresIniciais.birthDate ||
      this.resultados.addresses[0].street.trim() !== this.valoresIniciais.street ||
      this.resultados.addresses[0].zipcode.trim() !== this.valoresIniciais.zipcode ||
      this.resultados.addresses[0].number.trim() !== this.valoresIniciais.number ||
      this.resultados.addresses[0].city.trim() !== this.valoresIniciais.city
    );
  }
  
  atualizarPessoa() {
    const dadosAtualizados = {
      name: this.resultados.name,
      birthDate: this.resultados.birthDate,
      addresses: [{
        street: this.resultados.addresses[0].street,
        zipcode: this.resultados.addresses[0].zipcode,
        number: this.resultados.addresses[0].number,
        city: this.resultados.addresses[0].city,
        primaryAddress: true
      }]
    };
  
    this.http.put(`http://localhost:8080/persons/${this.resultados.cpf}`, dadosAtualizados, { responseType: 'text' })
      .subscribe({
        next: (response: string) => {
          this.mensagemAtualizar = response;
          this.sucessoAtualizar = true;
          
          this.valoresIniciais = {
            name: dadosAtualizados.name,
            birthDate: dadosAtualizados.birthDate,
            street: dadosAtualizados.addresses[0].street,
            zipcode: dadosAtualizados.addresses[0].zipcode,
            number: dadosAtualizados.addresses[0].number,
            city: dadosAtualizados.addresses[0].city
          };
          
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
