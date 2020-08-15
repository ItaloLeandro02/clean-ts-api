# Responder Enquete

> ## Caso de sucesso
 
1. :no_entry: Recebe uma requisição do tipo **PUT** na rota **/api/surveys/{survey_id}/results**
2. :no_entry: Valida se a requisição foi feita por um **usuário**
3. :white_check_mark: Valida o parâmetro **survey_id**
4. :white_check_mark: Valida se o campo **answer** é uma resposta válida
5. :white_check_mark: **Cria** um resultado de enquete com os dados fornecidos caso não tenha um registro
6. :white_check_mark: **Atualiza** um resultado de enquete com os dados fornecidos caso já tenha um registro
7. :no_entry: Retorna **200** com os dados do resultado da enquete

> ## Exceções

1. :no_entry: Retorna erro 404 se a API não existir
2. :no_entry: Retorna erro 403 se não for usuário
3. :white_check_mark: Retorna erro 403 se o survey_id passado na URL for inválido
4. :white_check_mark: Retorna erro 403 se a resposta enviada pelo client for uma resposta inválida
5. :no_entry: Retorna erro 500 se der erro ao tentar criar o resultado da enquete
6. :no_entry: Retorna erro 500 se der erro ao tentar atualizar o resultado da enquete
7. :white_check_mark: Retorna erro 500 se der erro ao tentar carregar a enquete