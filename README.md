# MAC 463 - EP1

Versão do aplicativo implementado com o framework Ionic 2.

### Grupo:
* Victor Wichmann Raposo - 9298020
* Joao Francisco Lino Daniel - 7578279

### Ambiente

Para configurar o ambiente e baixar os plugins necessários basta executar `npm install`.
E adicionar a plataforma android com `ionic platform add android`.

## Como executar

Para executar execute o comando `ionic run android`

> Obs: se estiver tendo problemas com o launch, tente fazer o seguinte:
>
```
ionic platform rm android
ionic platform add android@6.2.1
```


### Como Usar

Implementamos dois metodos de confirmação, um aluno pode scanear um QR code de um seminário
para se matricular. O outro, o professor pode scanear um codigo de barras com o
número USP do aluno (presente na parte de tras do cartão de estudante)
para confirmar a presença do aluno no semiário
