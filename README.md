
# Documentação da Aplicação

A Interface tem como objetivo gerenciar pessoas e seus endereços. As funcionalidades disponíveis incluem:

- Criar uma pessoa: Permite a criação de um novo registro de pessoa.
- Editar uma pessoa: Permite a atualização dos dados de uma pessoa existente.
- Consultar uma pessoa: Permite a busca de uma pessoa pelo seu CPF.
- Listar pessoas: Permite listar todas as pessoas registradas.

## Tecnologias Utilizadas

- Angular 12.2.13
- AuthGuard
- JWT

## Executando a Aplicação

- Para executar a aplicação no VScode, utilize o seguinte comando:

	npm run start
	
- Para executar a aplicação na raiz, navege até a pasta e utilize o seguinte comando:

	ng serve


## Testando a Aplicação

- Baixe o projeto em `https://github.com/anderson-lima92/gerenciador-de-pessoas-back` e siga as instruções Execução.


- Após seguir as intruções, acesse: `http://localhost:4200`, você será direcionado para a tela de login, para acessar é necessário que o usuário já esteja criado, através do swagger em: `/login/register` ou utilize o usuário padrão criado em: `com.lima.api.gerenciador.config.InitialDataLoader`.


- Com o login bem sucedido, estará disponível as funcionalidades em suas respectivas abas.



