# Resultado da enquete

> ## Caso de sucesso

1. :no_entry: Recebe uma requisição do tipo **GET** na rota **/api/surveys/{survey_id}/results**
2. :no_entry: Valida se a requisição foi feita por um **usuário**
3. :no_entry: Valida dados obrigatórios **question** e **answers**
5. :no_entry: Retorna **200** com os dados do resultado da enquete

> ## Exceções

1. :no_entry: Retorna erro **404** se a API não existir
2. :no_entry: Retorna erro **403** se não for um usuário
3. :no_entry: Retorna erro **500** se der erro ao tentar listar o resultado da enquete