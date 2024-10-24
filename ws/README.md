# Sistema de Agendamento de Horários para Salão de Beleza

Este é um sistema de agendamento de horários desenvolvido com Node.js, projetado para permitir que clientes agendem, editem e gerenciem suas marcações em um salão de beleza. O objetivo é proporcionar uma experiência de agendamento simples e eficiente, garantindo que não haja conflitos de horários.

## Tecnologias Usadas

- Node.js
- MongoDB (como banco de dados)
- AWS S3 (para armazenamento de arquivos)
- Express (ou outro framework, se aplicável)
- React.js (para o front-end)

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/seu-repositorio.git](https://github.com/Matheuskocotem/salaoApp.git

2. Navegue até a pasta do projeto:
   ```bash
   cd seu-repositorio

3. Instale as dependências do Node.js:
    ```bash
    yarn install

4. Crie um arquivo .env e configure as variáveis de ambiente, incluindo as credenciais do MongoDB e do AWS S3.

5.Inicie o servidor:
    ```bash
    yarn start


## Uso
-Endpoints Importantes
-POST /api/login - Realiza o login do usuário.
-GET /api/services - Obtém a lista de serviços disponíveis.
-GET /api/appointments - Obtém a lista de agendamentos do cliente.
-POST /api/appointments - Agenda um novo horário.
-PUT /api/appointments/:id - Edita um agendamento existente.
-DELETE /api/appointments/:id - Cancela um agendamento.


## Autenticação
O sistema utiliza um método de autenticação baseado em tokens (ex: JWT ou outra abordagem conforme sua implementação).

## Contribuição
Sinta-se à vontade para enviar pull requests ou abrir issues para melhorias.

## Licença

Este projeto está licenciado sob a MIT License. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
