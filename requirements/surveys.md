# Listar Enquete

> ## Caso de sucesso

1. :white_check_mark: Recebe uma requisição do tipo **GET** na rota **/api/surveys**
2. :white_check_mark: Valida se a requisição foi feita por um usuário
3. :white_check_mark: Retorna 200 com os dados das enquetes
4. :white_check_mark: Retorna 204 se não tiver nenhuma enquete

> ## Exceções
 
1. :white_check_mark: Retorna erro 404 se a API não existir
2. :white_check_mark: Retorna erro 403 se não for um usuário
3. :white_check_mark: Retorna erro 500 se der erro ao tentar listar as enquetes