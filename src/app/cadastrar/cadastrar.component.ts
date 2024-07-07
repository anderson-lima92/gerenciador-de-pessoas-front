import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cadastrar',
  templateUrl: './cadastrar.component.html',
  styleUrls: ['./cadastrar.component.css']
})
export class CadastrarComponent {
  pessoaForm: FormGroup;
  mensagemCadastro: string;
  sucesso: boolean;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.pessoaForm = this.fb.group({
      name: [''],
      cpf: [''],
      birthDate: [''],
      street: [''],
      zipcode: [''],
      number: [''],
      city: ['']
    });
    this.mensagemCadastro = '';
    this.sucesso = false;
  }

  onSubmit() {
    const formData = this.pessoaForm.value;
    formData.cpf = parseInt(formData.cpf, 10);
    formData.birthDate = this.formatarDataNascimento(formData.birthDate);
    formData.addresses = [{
      street: formData.street,
      zipcode: formData.zipcode,
      number: formData.number,
      city: formData.city
    }];

    this.http.post('http://localhost:8080/pessoas', formData)
      .subscribe({
        next: (response) => {
          this.mensagemCadastro = 'Pessoa salva com sucesso!';
          this.sucesso = true;
          this.pessoaForm.reset();
          setTimeout(() => this.mensagemCadastro = '', 5000);
        },
        error: (error) => {
          this.mensagemCadastro = error.error.message || 'Erro ao salvar pessoa';
          this.sucesso = false;
          setTimeout(() => this.mensagemCadastro = '', 10000);
        }
      });
  }

  private formatarDataNascimento(dataNascimento: string): string {
    const date = new Date(dataNascimento);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
}
