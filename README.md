# Orientações
Primeiramente, clone o .env.example para .env e preencha as variáveis com os dados que deseja utilizar. Logo em seguida, execute os containers via docker compose: 

```
docker compose up
```

Entre no container com a aplicação do nestjs:
```
docker compose exec app bash
```

Execute as migrations dentro do prisma usando:
```
pnpm prisma migrate dev
```

Por fim, você pode começar a executar os comandos presentes no package.json para multiplos propositos, como levantar o servidor em ambiente de desenvolvimento:
```
pnpm start:dev
```

Ou realizar os testes com o jest:
```
pnpm test:all
```
