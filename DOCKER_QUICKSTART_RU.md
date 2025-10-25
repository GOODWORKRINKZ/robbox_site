# Быстрый старт - Docker развертывание

## Что добавлено

Создана полная система Docker развертывания для сайта ROBBOX:

### Файлы:
- `Dockerfile` - многоэтапная сборка (64MB финальный образ)
- `nginx.conf` - оптимизированная конфигурация nginx
- `docker-compose.yml` - для удобного запуска
- `.github/workflows/docker-build.yml` - автоматическая сборка в GitHub

## Быстрый запуск

### На локальной машине:
```bash
# Собрать образ
docker build -t robbox-site .

# Запустить контейнер
docker run -d -p 80:80 robbox-site
```

### С Docker Compose:
```bash
docker-compose up -d
```

Сайт будет доступен на `http://localhost`

## Развертывание на VPS

### Вариант 1: Использовать готовый образ из GitHub
```bash
# Подключиться к VPS
ssh user@your-vps-ip

# Скачать последний образ
docker pull ghcr.io/goodworkrinkz/robbox_site:latest

# Запустить контейнер
docker run -d -p 80:80 --name robbox-site --restart unless-stopped ghcr.io/goodworkrinkz/robbox_site:latest
```

### Вариант 2: Собрать на VPS
```bash
# Подключиться к VPS
ssh user@your-vps-ip

# Клонировать репозиторий
git clone https://github.com/GOODWORKRINKZ/robbox_site.git
cd robbox_site

# Запустить через Docker Compose
docker-compose up -d
```

## Обновление на VPS

```bash
# Скачать новую версию
docker pull ghcr.io/goodworkrinkz/robbox_site:latest

# Остановить старый контейнер
docker stop robbox-site
docker rm robbox-site

# Запустить новый
docker run -d -p 80:80 --name robbox-site --restart unless-stopped ghcr.io/goodworkrinkz/robbox_site:latest
```

## Автоматическая сборка

При каждом push в ветку `main`:
1. GitHub Actions автоматически собирает Docker образ
2. Образ публикуется в GitHub Container Registry
3. Доступен по адресу: `ghcr.io/goodworkrinkz/robbox_site:latest`

## Особенности

- ✅ Легковесный образ (всего 64MB)
- ✅ Nginx с gzip сжатием
- ✅ Кеширование статических файлов
- ✅ Поддержка SPA маршрутизации
- ✅ Заголовки безопасности
- ✅ Автоматические обновления через CI/CD

## Порты

По умолчанию сайт работает на порту 80. Чтобы использовать другой порт:

```bash
docker run -d -p 8080:80 --name robbox-site robbox-site
```

## Логи

Просмотр логов:
```bash
docker logs robbox-site
```

Просмотр логов в реальном времени:
```bash
docker logs -f robbox-site
```

## Полная документация

Подробная документация на английском: [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md)
