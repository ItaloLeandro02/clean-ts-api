# Criar Enquete

> ## Caso de sucesso:
1. :white_check_mark: Recebe uma requisição do tipo **POST** na rota **/api/surveys**
2. :white_check_mark: Valida se a requisição foi feita por um admin
3. :white_check_mark: Valida dados obrigatórios **question** e **answers**
4. :white_check_mark: Cria uma enquete com os dados fornecidos
5. :white_check_mark: Retorna 204

> ## Exceções
1. :white_check_mark: Retorna erro 404 se a API não existir
2. :white_check_mark: Retorna erro 403 se o usuário não for admin
3. :white_check_mark: Retorna erro 400 se **question** e **answers** não forem fornecidos pelo cliente
4. :white_check_mark: Retorna erro 500 se der erro ao tentar criar a enquete