# Car Dealership — Frontend

Frontend веб-приложения автосалона. Интерфейс построен на Vue 3, а запросы к backend выполняются через Axios.

## Технологии

- Vue 3
- JavaScript
- Vite
- Tailwind CSS
- Axios
- jwt-decode
- JWT для сценариев авторизации

## Локальный запуск

Требуется установленный Node.js и npm.

```bash
git clone https://github.com/Savatan/MM-frontend.git
cd MM-frontend
npm install
npm run dev
```

Vite запускает frontend на http://localhost:5173.

## Сборка

```bash
npm run build
npm run preview
```

Собранные файлы размещаются в каталоге `dist`. Для работы функций, обращающихся к данным, требуется запущенный backend. В конфигурации Vite запросы по пути `/api` проксируются на http://localhost:3000.
