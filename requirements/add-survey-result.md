# Responder Enquete

> ## Caso de sucesso
 
1. :no_entry: Recebe uma requisição do tipo **POST** na rota **/api/surveys/{survey_id}/results**
2. :no_entry: Valida se a requisição foi feita por um **usuário**
3. :no_entry: Valida o parâmetro **survey_id**
4. :no_entry: Valida se o campo **answer** é uma resposta válida
5. :no_entry: **Cria** um resultado de enquete com os dados fornecidos
6. :no_entry: Retorna **200** com os dados do resultado da enquete

> ## Exceções

1. :no_entry: Retorna erro 404 se a API não existir
2. :no_entry: Retorna erro 403 se não for usuário
2. :no_entry: Retorna erro 403 se o survey_id passado na URL for inválido
3. :no_entry: Retorna erro 403 se a resposta enviada pelo client for uma resposta inválida
4. :no_entry: Retorna erro 500 se der erro ao tentar criar o resultado da enquete