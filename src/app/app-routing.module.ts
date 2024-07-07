import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CadastrarComponent } from './cadastrar/cadastrar.component';
import { ConsultarComponent } from './consultar/consultar.component';
import { AtualizarComponent } from './atualizar/atualizar.component';
import { ListarComponent } from './listar/listar.component';
import { AuthGuard } from './services/auth.guard';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'cadastrar', pathMatch: 'full' },
      { path: 'cadastrar', component: CadastrarComponent },
      { path: 'consultar', component: ConsultarComponent },
      { path: 'atualizar', component: AtualizarComponent },
      { path: 'listar', component: ListarComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
