# Criar Enquete

> ## Caso de sucesso:
1. :no_entry: Recebe uma requisição do tipo **POST** na rota **/api/surveys**
2. :no_entry: Valida se a requisição foi feita por um admin
3. :no_entry: Valida dados obrigatórios **question** e **answers**
4. :no_entry: Cria uma enquete com os dados fornecidos
5. :no_entry: Retorna 204

> ## Exceções
1. :no_entry: Retorna erro 404 se a API não existir
2. :no_entry: Retorna erro 403 se o usuário não for admin
3. :white_check_mark: Retorna erro 400 se **question** e **answers** não forem fornecidos pelo cliente
4. :no_entry: Retorna erro 500 se der erro ao tentar criar a enquete